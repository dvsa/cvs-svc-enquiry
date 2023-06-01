import DatabaseService from '../interfaces/DatabaseService';
import { getFeed } from './databaseService';
import logger from '../utils/logger';
import TflFeedData from '../interfaces/queryResults/tflFeedData';
import { FeedName } from '../interfaces/FeedTypes';

export default (): ((databaseService: DatabaseService, feedName: FeedName) => Promise<TflFeedData[]>) => {
  logger.debug('redirecting to getTflFeed using tfl factory');
  return getFeed as (databaseService: DatabaseService, feedName: FeedName) => Promise<TflFeedData[]>;
};
