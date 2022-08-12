import TflFeedData from '../interfaces/queryResults/tflFeedData';

export function processTFLFeedData(data: TflFeedData): TflFeedData {
  return Object.assign({}, ...Object.keys(data).map((key) => ({ [key]: escapeString(data[key]) }))) as TflFeedData;
}

export function escapeString(str: any): string {
  let newStr = String(str).toUpperCase();

  if (newStr.includes('"')) {
    newStr = '"' + newStr.replace(/"/g, '""') + '"';
    return newStr;
  }

  if (newStr.includes(',')) {
    newStr = '"' + newStr + '"';
    return newStr;
  }

  return newStr;
}
