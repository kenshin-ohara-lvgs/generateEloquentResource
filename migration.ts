import { convertCsvToArray } from "./src/utils/convertCsvToArray";
import { generateMigration } from "./src/migrationConvertLogic";
import { convertTextToPhpFile } from "./src/utils/convertTextToPhpFile";
import * as fs from "fs";
import * as path from "path";

const CSV_DIR = "./resources";
const OUT_DIR = "./out/migrations";

// 出力ディレクトリの作成
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function processCSVFiles() {
  const files = fs.readdirSync(CSV_DIR).filter((file) => file.endsWith(".csv"));

  files.forEach((file) => {
    const csvPath = path.join(CSV_DIR, file);
    const csvdata = convertCsvToArray(csvPath).data as string[][];

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14)
      .replace(/^(\d{4})(\d{2})(\d{2})(\d{6})$/, "$1_$2_$3_$4");

    const tableName = csvdata[0][2];
    const outputFileName = `${timestamp}_create_${tableName}.php`;
    const outputPath = path.join(OUT_DIR, outputFileName);

    const migrationContent = generateMigration(csvdata);
    convertTextToPhpFile(outputPath, migrationContent);

    console.log(`Generated migration: ${outputFileName}`);
  });
}

processCSVFiles();
