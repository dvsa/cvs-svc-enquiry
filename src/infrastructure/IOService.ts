import moment from 'moment';
import { writeFileSync } from 'fs';
import EvlFeedData from '../interfaces/queryResults/evlFeedData';

export function generateEvlFile(data: EvlFeedData[], fileName: string): void {
  console.debug('Generating EVL File Data');
  const evlFeedProcessedData: string[] = data.map((entry) => `${entry.vrm_trm},${entry.certificateNumber},${moment(entry.testExpiryDate).format('DD-MMM-YYYY')}`);

  try {
    writeFileSync(fileName, evlFeedProcessedData.join('\n'));
    console.debug('Generating EVL File Data Completed');
  } catch (error) {
    if (error instanceof Error) {
      console.debug(`An Error Occured: ${error.message}`);
    }
  }
}
