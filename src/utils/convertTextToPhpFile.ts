import * as fs from "fs";

export const convertTextToPhpFile = (fileName: string, text: string) => {
  fs.writeFileSync(fileName, text);
};
