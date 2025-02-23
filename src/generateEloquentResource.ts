import { getPrimaryKey } from "./getColumnData/getPrimaryKey";
import { getVisibleColumns } from "./getColumnData/getVisibleColumns";
import { snakeToUpperCamel } from "./utils/snakeToUpperCamel";
import { getTableNameFromSheet } from "./getColumnData/getTableNameFromSheet";

/**
 * 他のTBLを参照しない、単一のTBL定義書で完結するEloquentリソースを生成するメソッド
 * @param dataObject
 */
export const generateEloquentResource = (sheetData: string[][]) => {
  // リレーションメソッド以外のEloquent定義を記述
  const tableName = getTableNameFromSheet(sheetData);
  const className = snakeToUpperCamel(tableName);
  const primaryKey = getPrimaryKey(sheetData);
  const visibleColumns = getVisibleColumns(sheetData);
  const eloquentResourceCode = `<?php

namespace Lvgs\Laravel\Lvm\Models\Resources\Eloquent;

class ${className} extends BaseEloquent
{
  protected $table = '${tableName}';

  protected $primaryKey = '${primaryKey}';

  protected $with = [
      'member',
      'labors',
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
