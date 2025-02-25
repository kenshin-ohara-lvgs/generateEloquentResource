// src/generateMigration.ts
import { snakeToUpperCamel } from "./utils/snakeToUpperCamel";

interface ColumnDefinition {
  name: string;
  type: string;
  isPrimary: boolean;
  isNotNull: boolean;
  isUnique: boolean;
  default?: string;
  foreignKey?: string;
}

export const generateMigration = (sheetData: string[][]) => {
  const tableName = sheetData[0][2];
  const upperCamelTableName = snakeToUpperCamel(tableName);
  const tableComment = sheetData[1][2];
  const columns: ColumnDefinition[] = [];

  // カラム定義の開始行から処理
  for (let i = 7; i < sheetData.length; i++) {
    const row = sheetData[i];
    if (!row[1]) break; // カラム名が空の場合は終了

    columns.push({
      name: row[1],
      type: row[3],
      isPrimary: row[4] === "true" || row[4] === "TRUE",
      isNotNull: row[5] === "true" || row[5] === "TRUE",
      isUnique: row[6] === "true" || row[6] === "TRUE",
      default: row[7] || undefined,
      foreignKey: row[8] || undefined,
    });
  }

  const migrationTemplate = `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

class Create${upperCamelTableName} extends Migration
{
    public function up(): void
    {
        Schema::connection('center')->create('${tableName}', function (Blueprint $table) {
            ${generateColumns(columns)}
        });
    }

    public function down(): void
    {
        Schema::connection('center')->dropIfExists('${tableName}');
    }
};`;

  return migrationTemplate;
};

function generateColumns(columns: ColumnDefinition[]): string {
  return columns
    .map((column) => {
      let def = `$table->${mapColumnType(column.type)}('${column.name}')`;

      if (column.isPrimary) def += "->primary()";
      if (column.isUnique) def += "->unique()";
      if (!column.isNotNull) def += "->nullable()";
      if (column.default) {
        // created_at と updated_at の場合で now() がデフォルト値の時は DB::raw を使用
        if (
          (column.name === "created_at" || column.name === "updated_at") &&
          column.default.toLowerCase() === "now()"
        ) {
          def += `->default(\\DB::raw('now()'))`;
        } else {
          def += `->default(${column.default})`;
        }
      }

      if (column.foreignKey) {
        const [refTable, refColumn] = column.foreignKey.split(".");
        def += `;\n            $table->foreign('${column.name}')->references('${refColumn}')->on('${refTable}')`;
      }

      return `${def};`;
    })
    .join("\n            ");
}

function mapColumnType(type: string): string {
  const typeMap: { [key: string]: string } = {
    int: "integer",
    text: "text",
    "timestamp(0) without time zone": "timestamp",
    // 他の型も必要に応じて追加
  };

  return typeMap[type] || type;
}
