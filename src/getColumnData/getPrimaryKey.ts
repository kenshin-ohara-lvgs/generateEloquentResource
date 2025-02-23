// PKを取得するメソッド
export const getPrimaryKey = (sheetData: string[][]) => {
  // Indexはいずれもゼロオリジン
  const startRowIndex = 7;
  const pkColumnIndex = 4;
  const columnNameIndex = 1;

  let rowIndex = startRowIndex;

  while (rowIndex < sheetData.length) {
    if (sheetData[rowIndex][pkColumnIndex] === "true") {
      return sheetData[rowIndex][columnNameIndex];
    }
    rowIndex++;
  }
};
