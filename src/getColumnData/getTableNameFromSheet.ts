// シートのデータからテーブル名を取得する
export const getTableNameFromSheet = (sheet: string[][]): string => {
  return sheet[0][2];
};
