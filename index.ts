import { generateEloquentResource } from "./src/generateEloquentResource";
import { convertCsvToArray } from "./src/utils/convertCsvToArray";
import { convertTextToPhpFile } from "./src/utils/convertTextToPhpFile";
import * as fs from "fs";
import * as path from "path";

// CSVファイルが格納されているディレクトリのパス
const CSV_DIR = "./resources";

// CSVファイルを処理する関数
function processCSVFiles() {
  // resourcesディレクトリ内のすべてのCSVファイルを取得
  const files = fs.readdirSync(CSV_DIR).filter((file) => file.endsWith(".csv"));

  // 各CSVファイルを処理
  files.forEach((file) => {
    const csvPath = path.join(CSV_DIR, file);
    const csvdata = convertCsvToArray(csvPath).data as string[][];

    // 出力ファイル名を生成（.csvを.phpに置換）
    const outputFileName = file.replace(".csv", ".php");
    const outputPath = path.join("out", outputFileName);

    const output = generateEloquentResource(csvdata);
    convertTextToPhpFile(outputPath, output);
    console.log(`Processed: ${file} -> ${outputFileName}`);
  });
}

// 実行
processCSVFiles();
