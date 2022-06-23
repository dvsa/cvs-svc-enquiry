import DatabaseService from '../interfaces/DatabaseService';
import EvlEvent from '../interfaces/EvlEvent';
import { getEvlFeed, getEvlFeedByVrm } from './databaseService';
import EvlFeedData from '../interfaces/queryResults/evlFeedData';

export default (
  event: EvlEvent,
): ((databaseService: DatabaseService, event: EvlEvent) => Promise<EvlFeedData[]>
  ) => {
  if (event.vrm_trm) {
    console.info('Using getEvlFeedByVrm');

    return getEvlFeedByVrm;
  }

  console.info('Using getEvlFeed');
  return getEvlFeed;
};
