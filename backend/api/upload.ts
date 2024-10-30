import { getUserByToken, checkValidType, getUserbyId } from './utils/helper';
import { setData, getData } from './dataStore';
import { generateInvoicePDF } from './utils/generatePDF';
import { generateInvoiceHTML, generateTransInvoiceHTML } from './utils/generateHTML';
import { generateInvoiceJSON } from './utils/generateJSON';
import { generateInvoiceImage } from './utils/generateImage';

import HTTPError from 'http-errors';

import { User, Invoice, InvoiceDetails } from './interfaces';
import { port } from './config.json';

const url = '3.25.232.173';

const SERVER_URL = `${url}:${port}/`;

async function uploadV3(
  token: string,
  invoiceDetails: InvoiceDetails,
  fileType: string,
  language: string,
  userIds: number[]
) {
  const validFileTypes = ['html', 'pdf', 'json', 'png', 'xlsx'];
  const validLanguages =
  [
    'english', 'spanish', 'french', 'german',
    'vietnamese', 'chinese', 'japanese', 'arabic',
    'hindi', 'italian',
  ];

  // Verify valid user
  const user: User = getUserByToken(token);
  if (!user) {
    throw HTTPError(403, 'Invalid Token');
  }

  if (!checkValidType(fileType, validFileTypes)) {
    throw HTTPError(400, 'Invalid fileType');
  }

  if (!checkValidType(language, validLanguages)) {
    throw HTTPError(400, 'Invalid desire language');
  }

  if (!userIds.every((uId) => getUserbyId(uId))) {
    throw HTTPError(400, 'Invalid user ID');
  }

  let fileName;
  let invoiceLink = SERVER_URL;
  const data = getData();
  const inId = data.invoices.length + 1;

  switch (fileType.toLocaleLowerCase()) {
    case 'pdf':
      fileName = generateInvoicePDF(invoiceDetails);
      invoiceLink = invoiceLink + 'invoicePDF/' + fileName;
      break;

    case 'html':
      if (language === 'english') {
        fileName = generateInvoiceHTML(invoiceDetails);
        invoiceLink = invoiceLink + 'invoiceHTML/' + fileName;
        break;
      } else {
        fileName = await generateTransInvoiceHTML(invoiceDetails, language);
        invoiceLink = invoiceLink + 'invoiceHTML/' + fileName;
        break;
      }

    case 'json':
      fileName = generateInvoiceJSON(invoiceDetails, SERVER_URL, inId);
      invoiceLink = invoiceLink + 'invoiceJSON/' + fileName;
      break;

    case 'png':
      fileName = await generateInvoiceImage(invoiceDetails);
      invoiceLink = invoiceLink + 'invoiceImage/' + fileName;
      break;

    case 'xlsx':
      throw HTTPError(404, 'Can\'t reach the page!!!!');
  }

  // add the one who created this invoice if not existed
  if (!userIds.includes(user.uId)) {
    userIds.push(user.uId);
  }

  const inName = 'Invoice ' + invoiceDetails.inNumber;
  const renderedDate = Date.now();

  const newInvoice: Invoice = {
    inId: inId,
    name: inName,
    ownerId: userIds,
    storedURL: invoiceLink,
    renderedDate: new Date(renderedDate),
    invoiceData: {
      language: 'English',
      fileType: fileType,
      validUser: userIds
    }
  };

  data.invoices.push(newInvoice);

  setData(data);
  console.log(`\nPLease access the link beloew for the file:\n ${invoiceLink}\n`);

  return {
    invoiceLink: invoiceLink,
    inId: inId,
    userIds: userIds,
  };
}

export { uploadV3 };
