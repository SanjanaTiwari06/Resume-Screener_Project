const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

const extractText = async (fileBuffer, originalName) => {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === '.pdf') {
    const data = await pdfParse(fileBuffer);
    return data.text;
  }

  if (ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  if (ext === '.txt') {
    return fileBuffer.toString('utf-8');
  }

  throw new Error(`Unsupported file format: ${ext}`);
};

module.exports = { extractText };
