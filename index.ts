import { generateEloquentResource } from "./src/generateEloquentResource";
import { convertCsvToArray } from "./src/utils/convertCsvToArray";

const csvdata = convertCsvToArray("./resources/eloquentResources.csv")
  .data as string[][];

const output = generateEloquentResource(csvdata);
console.log(output);
