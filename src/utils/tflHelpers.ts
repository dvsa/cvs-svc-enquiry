import TflFeedData from '../interfaces/queryResults/tflFeedData';

export function processTFLFeedData(data: TflFeedData): TflFeedData {
  Object.keys(data).forEach((key) => (data[key] = escapeString(data[key])));

  return data;
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
