import { convertCsvToArray } from "./src/utils/convertCsvToArray";
import { generateMigration } from "./src/migrationConvertLogic";
import { convertTextToPhpFile } from "./src/utils/convertTextToPhpFile";
import * as fs from "fs";
import * as path from "path";

const CSV_DIR = "./resources";
const OUT_DIR = "./out/migrations";

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

interface TableDependency {
  tableName: string;
  csvPath: string;
  dependencies: string[];
}

function processCSVFiles() {
  const files = fs.readdirSync(CSV_DIR).filter((file) => file.endsWith(".csv"));
  const dependencies: TableDependency[] = [];

  // 依存関係の収集
  files.forEach((file) => {
    const csvPath = path.join(CSV_DIR, file);
    const csvdata = convertCsvToArray(csvPath).data as string[][];
    const tableName = csvdata[0][2];
    const foreignKeys: string[] = [];

    // 外部キーの収集（7行目以降を処理）
    for (let i = 7; i < csvdata.length; i++) {
      const foreignKey = csvdata[i][8];
      if (foreignKey) {
        const referencedTable = foreignKey.split(".")[0];
        foreignKeys.push(referencedTable);
      }
    }

    dependencies.push({
      tableName,
      csvPath,
      dependencies: foreignKeys,
    });
  });

  // トポロジカルソートで依存関係を解決
  const sortedTables = topologicalSort(dependencies);

  // タイムスタンプの基準値
  const baseTimestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  console.log(sortedTables);

  // ソートされた順序でマイグレーションファイルを生成
  sortedTables.forEach((table, index) => {
    const csvdata = convertCsvToArray(table.csvPath).data as string[][];

    // インデックスを使用して時間差を付ける
    const timestamp = parseInt(baseTimestamp) + index;
    const formattedTimestamp = String(timestamp).replace(
      /^(\d{4})(\d{2})(\d{2})(\d{6})$/,
      "$1_$2_$3_$4"
    );

    const outputFileName = `${formattedTimestamp}_create_${table.tableName}.php`;
    const outputPath = path.join(OUT_DIR, outputFileName);

    const migrationContent = generateMigration(csvdata);
    convertTextToPhpFile(outputPath, migrationContent);

    console.log(`Generated migration: ${outputFileName}`);
  });
}

// トポロジカルソートの実装
function topologicalSort(tables: TableDependency[]): TableDependency[] {
  const visited = new Set<string>();
  const temp = new Set<string>();
  const order: TableDependency[] = [];
  const tableMap = new Map(tables.map((table) => [table.tableName, table]));

  function visit(tableName: string) {
    if (temp.has(tableName)) {
      throw new Error("循環参照が検出されました");
    }
    if (visited.has(tableName)) {
      return;
    }

    const table = tableMap.get(tableName);
    if (!table) {
      return;
    }

    temp.add(tableName);
    for (const dep of table.dependencies) {
      visit(dep);
    }
    temp.delete(tableName);
    visited.add(tableName);
    // ここを変更: unshiftではなくpushを使用
    order.push(table);
  }

  for (const table of tables) {
    if (!visited.has(table.tableName)) {
      visit(table.tableName);
    }
  }

  return order;
}

processCSVFiles();
