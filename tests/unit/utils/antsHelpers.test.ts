import AntsFeedData from "../../../src/interfaces/queryResults/antsFeedData";
import { processAntsFeedData } from "../../../src/utils/antsHelpers";

describe('ants helper functions', () => {
  describe('process feed data function', () => {
    it('should update all strings on ANTS feed data', () => {
      const input: AntsFeedData = {
        vrm_trm: 'abc123',
        make: 'make',
        model: 'model',
        wheelplan: 'wheelplan',
        test_date: '2025-02-01',
        // @ts-ignore
        weight_before_test: 1000,
        // @ts-ignore
        weight_after_test: 1500,
        DOE_reference: 'reference',
        tech_record_date: '2025-01-01'
      }
      const result = processAntsFeedData(input);
      const expectedResult: AntsFeedData = {
        vrm_trm: 'ABC123',
        make: 'MAKE',
        model: 'MODEL',
        wheelplan: 'WHEELPLAN',
        test_date: '2025-02-01',
        // @ts-ignore
        weight_before_test: "1000",
        // @ts-ignore
        weight_after_test: "1500",
        DOE_reference: 'REFERENCE',
        tech_record_date: '2025-01-01'
      }
      expect(result).toMatchObject(expectedResult);
    });
  })
})
