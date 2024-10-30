import { port, url } from '../config.json';
import request, { Response, HttpVerb } from 'sync-request';
import { InvoiceDetails } from '../interfaces';
import fs from 'fs';
import path from 'path';

const SERVER_URL = `${url}:${port}`;

// ========================================================================= //

// Helper functions were taken from `lab08_quiz` in `quiz.test.ts` (from COMP1531 23T1)

function requestHelper(
  method: HttpVerb,
  path: string,
  payload: object,
  token?: string
) {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  let headers = {};
  if (token) {
    headers = { token };
  }
  const res = request(method, SERVER_URL + path, { qs, json, headers });

  if (res.statusCode !== 200) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

// ========================================================================= //

// Upload

export function uploadFileReq(
  token: string,
  invoiceDetails: InvoiceDetails,
  fileType: string,
  language: string,
  userIds: number[]
) {
  return requestHelper(
    'POST',
    '/innovators/invoice/upload/v3',
    { invoiceDetails, fileType, language, userIds },
    token
  );
}

// ========================================================================= //

// Auth

export function authRegisterReq(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string
) {
  return requestHelper(
    'POST',
    '/innovators/auth/register',
    { email, password, nameFirst, nameLast }
  );
}

export function authLoginReq(email: string, password: string) {
  return requestHelper('POST', '/innovators/auth/login', { email, password });
}

export function authLogoutReq(token: string) {
  return requestHelper('POST', '/innovators/auth/logout', {}, token);
}

// ========================================================================= //

export function requestStatus() {
  return requestHelper('GET', '/innovators/invoice/statusCheck', {});
}

export function requestDelete(inId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + '/innovators/invoice/delete',
    {
      qs: {
        inId
      }
    }
  );

  return returnErrors(res);
}

function returnErrors(res: Response) {
  return res.statusCode;
}

// ========================================================================= //

// Invoices

export function invoicesListReq(token: string) {
  return requestHelper('GET', '/innovators/invoices/list', {}, token);
}

// Function to delete all PDF files in a directory
export function deleteAllFilesInDirectory(dir: string, extension: string) {
  // Path to the directory
  const folderPath = path.join(__dirname, '..', '..', `${dir}`);

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Could not list the directory.', err);
      process.exit();
    }

    files.forEach(file => {
      if (path.extname(file).toLowerCase() === `.${extension}`.toLocaleLowerCase()) {
        // Check if the file is a the folder
        const filePath = path.join(folderPath, file);
        fs.unlink(filePath, err => {
          if (err) {
            console.error(`Failed to delete file: ${file}`, err);
          }
        });
      }
    });
  });
}
