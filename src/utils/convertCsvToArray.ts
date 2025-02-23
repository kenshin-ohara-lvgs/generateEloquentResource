import * as fs from "fs";
import Papa from "papaparse";

/**
 * csvファイルを読み込み、２次元配列に変換する
 * @param csvPath
 * @returns
 */
export const convertCsvToArray = (csvPath: string) => {
  const csv = fs.readFileSync(csvPath, "utf8");

  return Papa.parse(csv);
};
