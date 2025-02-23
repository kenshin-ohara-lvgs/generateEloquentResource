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

          protected $visible_column = [${visibleColumns}];

          `;
  return eloquentResourceCode;

  // 各シートごとに、generateEloquentTemplateメソッドを実行
  // TODO: 切り出し
  // TODO: TBL定義以外のシートや、フォーマットに則さないTBL定義シートが指定された時用のエラーハンドリング
  // for (const sheet of sheets) {
  //   const tableName = getTableNameFromSheet(sheet);
  //   try {
  //     outputs[tableName] = generateEloquentTemplate(sheet);
  //   } catch (e) {
  //     console.log(
  //       tableName,
  //       "での読込に失敗しました。次のシートの処理に移ります"
  //     );
  //   }
  // }
};
