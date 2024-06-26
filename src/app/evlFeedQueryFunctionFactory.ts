import DatabaseService from '../interfaces/DatabaseService';
import EvlEvent from '../interfaces/EvlEvent';
import { getFeed, getEvlFeedByVrm } from './databaseService';
import EvlFeedData from '../interfaces/queryResults/evlFeedData';
import logger from '../utils/logger';
import { FeedName } from '../interfaces/FeedTypes';

export default (
  event: EvlEvent,
):
  | ((databaseService: DatabaseService, event: EvlEvent) => Promise<EvlFeedData[]>)
  | ((databaseService: DatabaseService, feedName: FeedName, event: EvlEvent) => Promise<EvlFeedData[]>
  ) => {
  if (event.vrm_trm) {
    logger.debug('redirecting to getEVLFeedByVrm using evl factory');
    return getEvlFeedByVrm;
  }

  logger.debug('redirecting to getEVLFeed using evl factory');
  return getFeed as (databaseService: DatabaseService, feedName: FeedName, event: EvlEvent) => Promise<EvlFeedData[]>;
};
