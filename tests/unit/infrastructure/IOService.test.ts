import moment from 'moment';
import { existsSync } from 'fs';
import { generateEvlFile, removeFile } from '../../../src/infrastructure/IOService';
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
    it('should generate a csv file', () => {
      const fileName = `EVL_GVT_${moment(Date.now()).format('YYYYMMDD')}.csv`;
      generateEvlFile(evlFeedData, fileName);
      const fileExists = existsSync(`/tmp/${fileName}`);
      expect(fileExists).toBeTruthy();
      removeFile(`/tmp/${fileName}`);
    });
  });
});
