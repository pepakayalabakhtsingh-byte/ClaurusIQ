const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');

class ParserFactory {
  /**
   * Parse the given file based on its mime type or extension
   * @param {Object} file - Multer file object
   * @returns {Promise<String>} Extracted text
   */
  static async parseFile(file) {
    const ext = file.originalname.split('.').pop().toLowerCase();
    const mime = file.mimetype;

    try {
      if (mime === 'application/pdf') {
        return await this.parsePdf(file.path);
      } else if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === 'docx') {
        return await this.parseDocx(file.path);
      } else if (mime.startsWith('image/')) {
        return await this.parseImage(file.path);
      } else if (['txt', 'md', 'csv', 'json', 'html'].includes(ext)) {
        return await this.parseText(file.path);
      } else {
        throw new Error(`Unsupported file parsing for type: ${mime}`);
      }
    } catch (error) {
      console.error(`Error parsing file ${file.originalname}:`, error);
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }

  static async parsePdf(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  static async parseDocx(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  static async parseImage(filePath) {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
      logger: m => {} // suppress logs
    });
    return text;
  }

  static async parseText(filePath) {
    return fs.readFileSync(filePath, 'utf8');
  }
}

module.exports = ParserFactory;
