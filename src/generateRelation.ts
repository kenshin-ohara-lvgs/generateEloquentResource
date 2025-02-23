/**
 * 2次元配列をもとにして、リレーションメソッドを生成する
 * @returns
 */

import { START_ROW_INDEX } from "./constants";

export const generateRelations = (array: string[][]) => {
  let current_row_index = START_ROW_INDEX;
  const foreignKeys: { [tableName: string]: string } = {};
  const belongsToRelations = [];

  //
  while (current_row_index < array.length) {
    const columnName = array[current_row_index][1];
    const foreignKey = array[current_row_index][8];

    //第一引数
    const one = foreignKey.split(".")[0];
    //第三引数
    const three = foreignKey.split(".")[1];

    if (foreignKey) {
      // belongsToリレーションに挿入
      belongsToRelations.push([one, columnName, three]);

      // hasManyリレーションに挿入
    }

    current_row_index++;
  }

  // リレーションメソッドたちを返す

  return belongsToRelations; //TODO: relationMethodsに変更
};
