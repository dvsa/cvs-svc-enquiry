import AWS from 'aws-sdk';
import express, { Request } from 'express';
import mysql from 'mysql2/promise';
import queryFunctionFactory from '../../app/queryFunctionFactory';
import { getVehicleDetails } from '../../domain/enquiryService';
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
app.use((req, _response, next) => {
  // TODO Add logger lib like Winston or Morgan
  console.log('path');
  console.log(req.path);
  next();
});

/**
 * Define routing and route level middleware if necessary from ./routes
 */
router.post('/', (_request, res, next) => {
  res.send('Hello World!');
  next();
});

// Debug router before we start proxying  requests from /v<x> psth
app.get('/', (_request, res) => {
  res.send({ ok: true });
});

app.get('/version', (_request, res) => {
  res.send({ version: API_VERSION });
});

app.get(
  '/enquiry/vehicle',
  (
    request: Request<Record<string, unknown>, string | Record<string, unknown>, Record<string, unknown>, VehicleEvent>,
    res,
  ) => {
    const secretsManager = new SecretsManagerService(new AWS.SecretsManager());
    const dbService = new DatabaseService(secretsManager, mysql);
    getVehicleDetails(request.query, queryFunctionFactory, dbService)
      .then((result) => {
        res.send(result);
      })
      .catch((e: Error) => {
        res.send(e.message);
      });
  },
);

app.get(
  '/enquiry/results',
  (
    _request: Request<Record<string, unknown>, string | Record<string, unknown>, Record<string, unknown>, ResultsEvent>,
    _res,
  ) => {},
);

export { app };
