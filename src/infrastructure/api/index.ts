import AWS from 'aws-sdk';
import express, { Request, Router } from 'express';
import mysql from 'mysql2/promise';
import moment from 'moment';
import vehicleQueryFunctionFactory from '../../app/vehicleQueryFunctionFactory';
import testResultsQueryFunctionFactory from '../../app/testResultsQueryFunctionFactory';
import { getResultsDetails, getVehicleDetails, getEvlFeedDetails } from '../../domain/enquiryService';
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
import { generateEvlFile, removeFile } from '../IOService';
import { uploadToS3 } from '../s3BucketService';

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
        secretsManager = new SecretsManagerService(new AWS.SecretsManager());
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
      secretsManager = new SecretsManagerService(new AWS.SecretsManager());
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
      secretsManager = new LocalSecretsManagerService();
    } else {
      secretsManager = new SecretsManagerService(new AWS.SecretsManager());
    }

    DatabaseService.build(secretsManager, mysql)
      .then((dbService) => getEvlFeedDetails(request.query, evlFeedQueryFunctionFactory, dbService))
      .then((result) => {
        const fileName = `EVL_GVT_${moment(Date.now()).format('YYYYMMDD')}.csv`;
        generateEvlFile(result, fileName);
        uploadToS3(fileName);
        removeFile(fileName);
        res.status(200);
        res.contentType('json').send();
      })
      .catch((e: Error) => {
        if (e instanceof ParametersError) {
          res.status(400);
        } else if (e instanceof NotFoundError) {
          res.status(404);
        } else {
          res.status(500);
        }
        res.send(`Error Generating EVL Feed Data: ${e.message}`);
      });
  },
);

router.all(/testResults|vehicle/, (_request, res) => {
  res.status(405).send();
});

router.all('*', (_request, res) => {
  res.status(404).send();
});

app.use('/*/enquiry/', router);

export { app };
