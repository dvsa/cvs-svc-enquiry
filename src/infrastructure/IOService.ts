import { writeFile } from 'fs';
import EvlFeedData from '../interfaces/queryResults/evlFeedData';

export function generateEvlFile(data: EvlFeedData[]): void {
  console.log(data);
  const path = '../../tmp/evl.csv';
  writeFile(path, data.toString(), (err) => {
    if (err) {
      console.log(err);
    }
  });
}
