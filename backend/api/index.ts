import express, { json, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { deleteInvoice } from './delete';
import { xmlReceive } from './receive';
import { uploadV3 } from './upload';
import { xmlExtract, xmlExtractV2 } from './extract';
import { authRegister, authLogin, authLogout, generateHash } from './auth';
import { invoicesList } from './invoices';

import { port } from './config.json';

const app = express();
const PORT = process.env.PORT || port;

// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for error handling
app.use(errorHandler());

// ========================================================================= //

// Invoice

app.get('/echo', (req: Request, res: Response) => {
  res.json('Invoice Innovators\'s API is running😍😍');
});

app.post('/innovators/invoice/receive/v2', (req: Request, res: Response) => {
  const { xmlId } = req.body;
  const response = xmlReceive(xmlId);
  res.json(response);
});

app.post('/innovators/invoice/extract/v2', (req: Request, res: Response) => {
  const { xmlContent } = req.body;
  const response = xmlExtractV2(xmlContent);
  res.json(response);
});

// app.get('/innovators/invoice/validation', (req: Request, res: Response) => {
// });

app.get('/innovators/invoice/receive', (req: Request, res: Response) => {
  const { xmlId } = req.body;
  const response = xmlReceive(xmlId);
  res.json(response);
});

app.get('/innovators/invoice/extract', (req: Request, res: Response) => {
  const { xmlName, xmlContent, xmlId, xmlData } = req.body;
  const response = xmlExtract(xmlName, xmlContent, xmlId, xmlData);
  res.json(response);
});

app.delete('/innovators/invoice/delete', (req: Request, res: Response) => {
  const invoiceId = req.body;
  const response = deleteInvoice(invoiceId);
  return res.json(response);
});

app.get('/innovators/invoice/statusCheck', (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'Server is online and running' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/innovators/invoice/upload/v3', async (req: Request, res: Response) => {
  const token = req.header('token');
  const hashedToken = generateHash(token);
  const { invoiceDetails, fileType, language, userIds } = req.body;

  try {
    const result = await uploadV3(hashedToken, invoiceDetails, fileType, language, userIds);
    res.json(result);
  } catch (error) {
    // Check for the existence of a status code on the error object
    const statusCode = error.status || error.statusCode || 500; // Default to 500 if not specified
    const errorMessage = error.message || 'Internal Server Error';
    res.status(statusCode).json({ error: errorMessage });
    console.log(errorMessage);
  }
});

app.get('/innovators/invoices/list', (req: Request, res: Response) => {
  const token = req.header('token');
  const hashedToken = generateHash(token);

  const response = invoicesList(hashedToken);
  res.json(response);
});

// ========================================================================= //

// Auth

app.post('/innovators/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;

  res.json(authRegister(email, password, nameFirst, nameLast));
});

app.post('/innovators/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  res.json(authLogin(email, password));
});

app.post('/innovators/auth/logout', (req: Request, res: Response) => {
  const token = req.header('token');
  const hashedToken = generateHash(token);

  res.json(authLogout(hashedToken));
});

// ========================================================================= //

// extract root for saved pdf files
app.use('/invoicePDF', express.static('invoicePDF'));

// extract root for saved html files
app.use('/invoiceHTML', express.static('invoiceHTML'));

// extract root for saved json files
app.use('/invoiceJSON', express.static('invoiceJSON'));

// extract root for saved image files
app.use('/invoiceImage', express.static('invoiceImage'));

// extract root for logo
app.use('/image', express.static('image'));

app.use(errorHandler());

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log('\nShutting down server.'));
});
