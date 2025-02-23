import { getPrimaryKey } from "./getColumnData/getPrimaryKey";
import { getVisibleColumns } from "./getColumnData/getVisibleColumns";
import { snakeToUpperCamel } from "./utils/snakeToUpperCamel";
import { getTableNameFromSheet } from "./getColumnData/getTableNameFromSheet";

/**
 * 他のTBLを参照しない、単一のTBL定義書で完結するEloquentリソースを生成するメソッド
 * @param dataObject
 */
export const generateEloquentResource = (
  sheetData: string[][],
  relations?: { belongsTo: string[]; hasMany: string[] }
) => {
  const tableName = getTableNameFromSheet(sheetData);
  const className = snakeToUpperCamel(tableName);
  const primaryKey = getPrimaryKey(sheetData);
  const visibleColumns = getVisibleColumns(sheetData);

  // リレーションメソッド名を取得
  const withRelations = [];
  if (relations) {
    // belongsToのメソッド名を抽出
    withRelations.push(
      ...relations.belongsTo.map((method) => {
        const methodName = method.match(/public function (\w+)\(\)/)?.[1];
        return methodName ? `'${methodName}'` : "";
      })
    );

    // hasManyのメソッド名を抽出
    withRelations.push(
      ...relations.hasMany.map((method) => {
        const methodName = method.match(/public function (\w+)\(\)/)?.[1];
        return methodName ? `'${methodName}'` : "";
      })
    );
  }

  const eloquentResourceCode = `<?php

namespace Lvgs\Laravel\Lvm\Models\Resources\Eloquent;

class ${className} extends BaseEloquent
{
  protected $table = '${tableName}';

  protected $primaryKey = '${primaryKey}';

  protected $with = [
      ${withRelations.join(",\n      ")}
  ];

  protected $fillable = [
  ];

  protected $visible_column = [
    ${visibleColumns.map((col) => `'${col}'`).join(",\n    ")}
  ];
}
`;
  return eloquentResourceCode;
};
