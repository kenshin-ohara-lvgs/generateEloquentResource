import { generateRelations } from "./src/generateRelation";
import { convertCsvToArray } from "./src/utils/convertCsvToArray";

const parsedArray: string[][] = convertCsvToArray(
  "./resources/eloquentResources.csv"
).data as string[][];

const relations = generateRelations(parsedArray);
console.log("foreign keys", relations);
