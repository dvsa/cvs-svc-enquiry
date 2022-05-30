import moment from 'moment';
import { existsSync, readFileSync } from 'fs';
import { generateEvlFile } from '../../../src/infrastructure/IOService';
import EvlFeedData from '../../../src/interfaces/queryResults/evlFeedData';

describe('IO Service', () => {
  describe('generateEvlFile', () => {
    const evlFeedData: EvlFeedData[] = [
      {
        certificateNumber: '123',
        testExpiryDate: '2020/01/20',
        vrm_trm: '123',
      },
    ];

    const expectedFileResult = '123,123,20-Jan-2020';

    it('should generate a csv file', () => {
      const fileName = `EVL_GVT_${moment(Date.now()).format('YYYYMMDD')}.csv`;
      generateEvlFile(evlFeedData, fileName);
      const fileExists = existsSync(fileName);
      expect(fileExists).toBeTruthy();
      expect(readFileSync(fileName, { encoding: 'utf-8' })).toEqual(expectedFileResult);
    });
  });
});
