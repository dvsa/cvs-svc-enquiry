import moment from 'moment';
import { existsSync, rmSync, writeFileSync } from 'fs';
import EvlFeedData from '../interfaces/queryResults/evlFeedData';

export function generateEvlFile(data: EvlFeedData[], fileName: string): void {
  console.log('Generating EVL File Data');
  const evlFeedProcessedData: string[] = data.map((entry) => `${entry.vrm_trm},${entry.certificateNumber},${moment(entry.testExpiryDate).format('DD-MMM-YYYY')}`);

  try {
    writeFileSync(fileName, evlFeedProcessedData.join('\n'));
    console.log('Generating EVL File Data Completed');
  } catch (error) {
    if (error instanceof Error) {
      console.log(`An Error Occured: ${error.message}`);
    }
  }
}

export function removeFile(filePath: string):void {
  rmSync(filePath);
  if (!existsSync(filePath)) {
    console.debug(`Deleted Local File: ${filePath}`);
  } else {
    console.debug(`Unable To Remove Local File ${filePath}`);
  }
}
