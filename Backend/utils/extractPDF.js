// import { PDFParse } from "pdf-parse";

// export const extractTextFromPDF = async (buffer) => {

//     const parser = new PDFParse({
//         data: buffer
//     });

//     const result = await parser.getText();

//     await parser.destroy();

//     console.log(result.text)

//     return result.text;
// };

import { PDFParse } from "pdf-parse";

export async function extractTextFromPDF(buffer) {
  const parser = new PDFParse({
    data: buffer,
  });

  const result = await parser.getText({
    disableCombineTextItems: false,
  });

  await parser.destroy();

  console.log(result);

  return result.text.trim();
}

export default extractTextFromPDF