import moment from 'moment';
import { writeFile } from 'fs';
import EvlFeedData from '../interfaces/queryResults/evlFeedData';

export function generateEvlFile(data: EvlFeedData[]): void {
  console.log(data);
  const evlFeedProcessedData: string[] = data.map((entry) => `${entry.vrm_trm},${entry.certificateNumber},${moment(entry.testExpiryDate).format('DD-MMM-YYYY')}`);
  // add logging
  writeFile(`EVL_GVT_${moment(Date.now()).format('YYYYMMDD')}.csv`, evlFeedProcessedData.join('\n'), (err) => {
    if (err) {
      console.log(err);
    }
  });
}
