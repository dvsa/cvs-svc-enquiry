import AWS from 'aws-sdk';
import express, { Request } from 'express';
import mysql from 'mysql2/promise';
import vehicleQueryFunctionFactory from '../../app/vehicleQueryFunctionFactory';
import testResultsQueryFunctionFactory from '../../app/testResultsQueryFunctionFactory';
import { getResultsDetails, getVehicleDetails } from '../../domain/enquiryService';
import ParametersError from '../../errors/ParametersError';
import ResultsEvent from '../../interfaces/ResultsEvent';
import VehicleEvent from '../../interfaces/VehicleEvent';
import DatabaseService from '../databaseService';
import SecretsManagerService from '../secretsManagerService';

const app = express();
const router = express.Router();

const { API_VERSION } = process.env;

// Declare middlewares
/**
 * bodyParser, error handling, logger, etc..
 * http://expressjs.com/en/starter/basic-routing.html
 * http://expressjs.com/en/guide/using-middleware.html
 */

/**
 * app level middlewares
 * app.use('/path', (req, res, next) => {
 * chain middlewares
 * next()
 * })
 */
router.use((req, _response, next) => {
  // TODO Add logger lib like Winston or Morgan
  console.log('path');
  console.log(req.path);
  next();
});

// Debug router before we start proxying  requests from /v<x> psth
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
    let secretsManager;
    try {
      secretsManager = new SecretsManagerService(new AWS.SecretsManager());
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
    const secretsManager = new SecretsManagerService(new AWS.SecretsManager());

    DatabaseService.build(secretsManager, mysql)
      .then((dbService) => getResultsDetails(request.query, testResultsQueryFunctionFactory, dbService))
      .then((result) => {
        res.contentType('json').send(JSON.stringify(result));
      })
      .catch((e: Error) => {
        if (e instanceof ParametersError) {
          res.status(400);
        } else {
          res.status(500);
        }

        res.send(e.message);
      });
  },
);

router.all('*', (_request, res) => {
  res.status(405).send();
});

app.use('/*/enquiry/', router);

export { app };
