/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { SecretsManager } from '@aws-sdk/client-secrets-manager';
import express, { Request, Router } from 'express';
import mysql from 'mysql2/promise';
import moment from 'moment';
import vehicleQueryFunctionFactory from '../../app/vehicleQueryFunctionFactory';
import testResultsQueryFunctionFactory from '../../app/testResultsQueryFunctionFactory';
import { getResultsDetails, getVehicleDetails, getFeedDetails } from '../../domain/enquiryService';
import ParametersError from '../../errors/ParametersError';
import ResultsEvent from '../../interfaces/ResultsEvent';
import VehicleEvent from '../../interfaces/VehicleEvent';
import EvlEvent from '../../interfaces/EvlEvent';
import DatabaseService from '../databaseService';
import SecretsManagerService from '../secretsManagerService';
import NotFoundError from '../../errors/NotFoundError';
import SecretsManagerServiceInterface from '../../interfaces/SecretsManagerService';
import LocalSecretsManagerService from '../localSecretsManagerService';
import evlFeedQueryFunctionFactory from '../../app/evlFeedQueryFunctionFactory';
import { uploadToS3 } from '../s3BucketService';
import logger from '../../utils/logger';
import tflFeedQueryFunctionFactory from '../../app/tflFeedQueryFunctionFactory';
import { processTFLFeedData } from '../../utils/tflHelpers';
import { FeedName } from '../../interfaces/FeedTypes';
import EvlFeedData from '../../interfaces/queryResults/evlFeedData';
import TflFeedData from '../../interfaces/queryResults/tflFeedData';

const app = express();
const router: Router = express.Router();

const { API_VERSION } = process.env;

// Debug router before we start proxying  requests from /v<x> psth
console.log('process.env.IS_OFFLINE');
console.log(process.env.IS_OFFLINE);
router.get('/', (_request, res) => {
  res.send({ ok: true });
});

router.get('/version', (_request, res) => {
  res.send({ version: API_VERSION });
});

router.get(
  '/vehicle',
  (
    request: Request<Record<string, unknown>, string | Record<string, unknown>, Record<string, unknown>, VehicleEvent>,
    res,
  ) => {
    console.info('Handling vehicle request');
    let secretsManager: SecretsManagerServiceInterface;
    try {
      if (process.env.IS_OFFLINE === 'true') {
        secretsManager = new LocalSecretsManagerService();
      } else {
        secretsManager = new SecretsManagerService(new SecretsManager());
      }
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).send(e.message);
      }
    }

    DatabaseService.build(secretsManager, mysql)
      .then((dbService) => getVehicleDetails(request.query, vehicleQueryFunctionFactory, dbService))
      .then((result) => {
        res.contentType('json').send(result);
      })
      .catch((e: Error) => {
        if (e instanceof ParametersError) {
          res.status(400);
        } else if (e instanceof NotFoundError) {
          res.status(404);
        } else {
          res.status(500);
        }

        res.send(e.message);
      });
  },
);

router.get(
  '/testResults',
  (
    request: Request<Record<string, unknown>, string | Record<string, unknown>, Record<string, unknown>, ResultsEvent>,
    res,
  ) => {
    let secretsManager: SecretsManagerServiceInterface;

    if (process.env.IS_OFFLINE === 'true') {
      secretsManager = new LocalSecretsManagerService();
    } else {
      secretsManager = new SecretsManagerService(new SecretsManager());
    }

    DatabaseService.build(secretsManager, mysql)
      .then((dbService) => getResultsDetails(request.query, testResultsQueryFunctionFactory, dbService))
      .then((result) => {
        res.contentType('json').send(JSON.stringify(result));
      })
      .catch((e: Error) => {
        if (e instanceof ParametersError) {
          res.status(400);
        } else if (e instanceof NotFoundError) {
          res.status(404);
        } else {
          res.status(500);
        }

        res.send(e.message);
      });
  },
);

router.get(
  '/evl',
  (
    request: Request<Record<string, unknown>, string | Record<string, unknown>, Record<string, unknown>, EvlEvent>,
    res,
  ) => {
    let secretsManager: SecretsManagerServiceInterface;
    if (process.env.IS_OFFLINE === 'true') {
      logger.debug('configuring local secret manager');
      secretsManager = new LocalSecretsManagerService();
    } else {
      logger.debug('configuring aws secret manager');
      secretsManager = new SecretsManagerService(new SecretsManager());
    }
    const fileName = `EVL_GVT_${moment(Date.now()).format('YYYYMMDD')}.csv`;
    logger.debug(`creating file for EVL feed called: ${fileName}`);
    DatabaseService.build(secretsManager, mysql)
      .then((dbService) => getFeedDetails(evlFeedQueryFunctionFactory, FeedName.EVL, dbService, request.query))
      .then((result: EvlFeedData[]) => {
        logger.info('Generating EVL File Data');
        const evlFeedProcessedData: string = result
          .map(
            (entry) =>
              `${entry.vrm_trm},${entry.certificateNumber},${moment(entry.testExpiryDate).format('DD-MMM-YYYY')}`,
          )
          .join('\n');
        logger.debug(`\nData captured for file generation: ${evlFeedProcessedData} \n\n`);

        uploadToS3(evlFeedProcessedData, fileName, () => {
          logger.info(`Successfully uploaded ${fileName} to S3`);
          res.status(200);
          res.contentType('json').send();
        });
      })
      .catch((e: Error) => {
        if (e instanceof ParametersError) {
          res.status(400);
        } else if (e instanceof NotFoundError) {
          res.status(404);
        } else {
          res.status(500);
        }
        logger.error(`Error occured with message ${e.message}. Stack Trace: ${e.stack}`);
        res.send(`Error Generating EVL Feed Data: ${e.message}`);
      });
  },
);

router.get('/tfl', (_req, res) => {
  let secretsManager: SecretsManagerServiceInterface;
  if (process.env.IS_OFFLINE === 'true') {
    logger.debug('configuring local secret manager');
    secretsManager = new LocalSecretsManagerService();
  } else {
    logger.debug('configuring aws secret manager');
    secretsManager = new SecretsManagerService(new SecretsManager());
  }
  DatabaseService.build(secretsManager, mysql)
    .then((dbService) => getFeedDetails(tflFeedQueryFunctionFactory, FeedName.TFL, dbService))
    .then((result: TflFeedData[]) => {
      const numberOfRows = result.length;
      const fileName = `VOSA-${moment(Date.now()).format('YYYY-MM-DD')}-G1-${numberOfRows}-01-01.csv`;
      logger.debug(`creating file for TFL feed called: ${fileName}`);
      logger.info('Generating TFL File Data');
      const processedResult = result.map((entry) => processTFLFeedData(entry));
      const tflFeedProcessedData: string = processedResult
        .map(
          (entry) =>
            `${entry.VRM},${entry.VIN},${entry.SerialNumberOfCertificate},${entry.CertificationModificationType},${entry.TestStatus},${entry.PMEuropeanEmissionClassificationCode},${entry.ValidFromDate},${entry.ExpiryDate},${entry.IssuedBy},${entry.IssueDate}`,
        )
        .join('\n');
      logger.debug(`\nData captured for file generation: ${tflFeedProcessedData} \n\n`);
      uploadToS3(tflFeedProcessedData, fileName, () => {
        logger.info(`Successfully uploaded ${fileName} to S3`);
        res.status(200);
        res.contentType('json').send();
      });
    })
    .catch((e: Error) => {
      if (e instanceof ParametersError) {
        res.status(400);
        res.send(`Error Generating TFL Feed Data: ${e.message}`);
      } else if (e instanceof NotFoundError) {
        const fileName = `VOSA-${moment(Date.now()).format('YYYY-MM-DD')}-G1-0-01-01.csv`;
        uploadToS3(' , ,', fileName, () => {
          logger.info(`Successfully uploaded ${fileName} to S3`);
          res.status(200);
          res.contentType('json').send();
        });
      } else {
        res.status(500);
        res.send(`Error Generating TFL Feed Data: ${e.message}`);
      }
      logger.error(`Error occurred with message ${e.message}. Stack Trace: ${e.stack}`);
    });
});

router.all(/testResults|vehicle/, (_request, res) => {
  res.status(405).send();
});

router.all('*', (_request, res) => {
  res.status(404).send();
});

app.use('/*/enquiry/', router);

export { app };
