export const snakeToUpperCamel = (text: string) => {
  return text
    .split("_") // アンダースコアで分割
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // 各単語の先頭を大文字にする
    .join(""); // 連結
};
