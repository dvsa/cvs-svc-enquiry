import DatabaseService from "../interfaces/DatabaseService";
import { FeedName } from "../interfaces/FeedTypes";
import logger from "../utils/logger";
import { getFeed } from "./databaseService";
import AntsFeedData from "../interfaces/queryResults/antsFeedData";

export default (): ((databaseService: DatabaseService, feedName: FeedName) => Promise<AntsFeedData[]>) => {
  logger.debug('redirecting to getTflFeed using tfl factory');
  return getFeed as (databaseService: DatabaseService, feedName: FeedName) => Promise<AntsFeedData[]>;
};
