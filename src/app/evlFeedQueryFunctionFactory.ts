import DatabaseService from '../interfaces/DatabaseService';
import EvlEvent from '../interfaces/EvlEvent';
import { getEvlFeed, getEvlFeedByVrm } from './databaseService';
import EvlFeedData from '../interfaces/queryResults/evlFeedData';
import logger from '../utils/logger';

export default (
  event: EvlEvent,
): ((databaseService: DatabaseService, event: EvlEvent) => Promise<EvlFeedData[]>
  ) => {
  if (event.vrm_trm) {
    logger.debug('redirecting to getEVLFeedByVrm using evl factory');
    return getEvlFeedByVrm;
  }

  logger.debug('redirecting to getEVLFeed using evl factory');
  return getEvlFeed;
};
