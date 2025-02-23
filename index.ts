import { generateEloquentResource } from "./src/generateEloquentResource";
import { convertCsvToArray } from "./src/utils/convertCsvToArray";
import { convertTextToPhpFile } from "./src/utils/convertTextToPhpFile";
import { generateRelations } from "./src/generateRelation";
import { snakeToUpperCamel } from "./src/utils/snakeToUpperCamel";
import * as fs from "fs";
import * as path from "path";

const CSV_DIR = "./resources";

function processCSVFiles() {
  const files = fs.readdirSync(CSV_DIR).filter((file) => file.endsWith(".csv"));
  const allRelations = new Map<
    string,
    { belongsTo: string[]; hasMany: string[] }
  >();

  // 最初にすべてのCSVを読み込んでリレーション情報を収集
  files.forEach((file) => {
    const csvPath = path.join(CSV_DIR, file);
    const csvdata = convertCsvToArray(csvPath).data as string[][];
    const tableName = csvdata[0][2]; // テーブル名を取得
    const relations = generateRelations(csvdata);

    console.log("リレーション：", relations);

    // リレーション情報を整理
    relations.forEach(([targetTable, foreignKey, primaryKey]) => {
      // belongsTo側の設定
      if (!allRelations.has(tableName)) {
        allRelations.set(tableName, { belongsTo: [], hasMany: [] });
      }
      allRelations.get(tableName)?.belongsTo.push(
        `public function ${targetTable}()
    {
        return $this->belongsTo(${snakeToUpperCamel(
          targetTable
        )}::class, '${foreignKey}', '${primaryKey}');
    }`
      );

      // hasMany側の設定
      if (!allRelations.has(targetTable)) {
        allRelations.set(targetTable, { belongsTo: [], hasMany: [] });
      }
      allRelations.get(targetTable)?.hasMany.push(
        `public function ${tableName}s()
    {
        return $this->hasMany(${snakeToUpperCamel(
          tableName
        )}::class, '${foreignKey}', '${primaryKey}');
    }`
      );
    });
  });

  // 収集したリレーション情報をもとにファイルを生成
  files.forEach((file) => {
    const csvPath = path.join(CSV_DIR, file);
    const csvdata = convertCsvToArray(csvPath).data as string[][];
    const tableName = csvdata[0][2];

    // 基本的なEloquentリソースコードを生成
    let output = generateEloquentResource(csvdata);
    // リレーションメソッドを追加
    const relations = allRelations.get(tableName);
    if (relations) {
      // 出力を行ごとに分割
      const lines = output.split("\n");
      // 末尾から2行目の位置を計算
      const insertPosition = lines.length - 2;

      // リレーションメソッドを作成
      const relationMethods = [
        ...relations.belongsTo,
        ...relations.hasMany,
      ].join("\n\n    ");

      // 指定位置にリレーションメソッドを挿入
      lines.splice(insertPosition, 0, `    ${relationMethods}`);

      // 行を結合して文字列に戻す
      output = lines.join("\n");
    }

    // ファイルに出力
    const outputFileName = file.replace(".csv", ".php");
    const outputPath = path.join("out", outputFileName);
    convertTextToPhpFile(outputPath, output);
    console.log(`Processed: ${file} -> ${outputFileName}`);
  });
}

processCSVFiles();
