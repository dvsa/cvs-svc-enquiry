import DatabaseService from '../interfaces/DatabaseService';
import { getTflFeed } from './databaseService';
import logger from '../utils/logger';
import TflFeedData from '../interfaces/queryResults/tflFeedData';

export default (): ((databaseService: DatabaseService) => Promise<TflFeedData[]>) => {
  logger.debug('redirecting to getTflFeed using tfl factory');
  return getTflFeed;
};
