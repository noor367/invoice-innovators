import { getData } from './dataStore';
import { XmlFile } from './interfaces';
import HTTPError from 'http-errors';
import fs from 'fs';

export function xmlReceive(xmlId: string): XmlFile {
  const data = getData();
  let file: XmlFile = {
    xmlName: '',
    xmlContent: '',
    xmlId: '',
    xmlData: {
      language: '',
      fileType: '',
      validUser: []
    }
  };

  let found = false;
  for (let i = 0; i < data.xmlFiles.length; i++) {
    if (data.xmlFiles[i].xmlId === xmlId) {
      file = data.xmlFiles[i];
      found = true;
      break;
    }
  }

  errorCheck(found, file);

  const readData = fs.readFileSync(file.xmlName, 'utf8');
  file.xmlContent = readData;

  return {
    xmlName: file.xmlName,
    xmlContent: file.xmlContent,
    xmlId: xmlId,
    xmlData: {
      language: file.xmlData.language,
      fileType: file.xmlData.fileType,
      validUser: file.xmlData.validUser
    }
  };
}

function errorCheck(found: boolean, file: XmlFile): void {
  if (found === false) { // Found File
    throw HTTPError(400, 'XML File not found');
  }
  if (file.xmlName === '') { // fileName exists
    throw HTTPError(400, 'XML File Name not found');
  }
  if (file.xmlData.validUser.length <= 0 || file.xmlData.validUser.length >= 20) { // Valid Users
    throw HTTPError(400, 'Invalid Number of Authorised Users');
  }
  if (file.xmlContent !== '') { // Valid Content
    throw HTTPError(400, 'XML File Name not found');
  }

  const fileType = file.xmlData.fileType;
  if (fileType !== 'PDF' && fileType !== 'HTML' && fileType !== 'image') { // Valid fileType
    throw HTTPError(400, 'Invalid File Type');
  }

  const lang = file.xmlData.language;
  if (lang !== 'en' && lang !== 'zh' && lang !== 'hi' && lang !== 'es' && lang !== 'fr' &&
    lang !== 'ar' && lang !== 'bn' && lang !== 'pt' && lang !== 'ru' && lang !== 'ur') {
    // Valid Language (English, Mandarin Chinese, Hindi, Spanish, French, Standard Arabic, Bengali, Portugese, Russian, Urdu)
    throw HTTPError(400, 'Invalid Language type');
  }
}
