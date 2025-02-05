import AntsFeedData from "../interfaces/queryResults/antsFeedData";
import { escapeString } from "./tflHelpers";

export function processAntsFeedData(data: AntsFeedData): AntsFeedData {
  return Object.assign(
    {},
    ...Object.keys(data).map((key) => ({ [key]: escapeString(data[key as keyof AntsFeedData]) })),
  ) as AntsFeedData;
}
