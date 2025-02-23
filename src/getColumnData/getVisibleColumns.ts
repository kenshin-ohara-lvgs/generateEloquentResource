// Visibleなカラムを取得するメソッド
export const getVisibleColumns = (sheetData: string[][]): string[] => {
  const publicVisibleColumns = [];
  // Indexはいずれもゼロオリジン
  const startRowIndex = 7;
  const publicVisibleColumnIndex = 10;
  const columnNameIndex = 1;

  let rowIndex = startRowIndex;

  while (rowIndex < sheetData.length) {
    if (
      sheetData[rowIndex][publicVisibleColumnIndex] === "TRUE" ||
      sheetData[rowIndex][publicVisibleColumnIndex] === "true"
    ) {
      publicVisibleColumns.push(sheetData[rowIndex][columnNameIndex]);
    }
    rowIndex++;
  }

  return publicVisibleColumns;
};
