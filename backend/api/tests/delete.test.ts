import { deleteInvoice } from '../delete';
import { setData, getData, clear } from '../dataStore';
import { Data, Invoice } from '../interfaces';
import createError from 'http-errors';
import HTTPError from 'http-errors';
import { requestDelete } from '../utils/testHelper';

const invoiceOne: Invoice = {
  inId: 1,
  name: 'invoiceOne',
  ownerId: [1],
  storedURL: 'practice1',
  renderedDate: new Date(Date.now()),
  invoiceData: {
    language: 'English',
    fileType: 'pdf',
    validUser: []
  }
};

const invoiceTwo: Invoice = {
  inId: 2,
  name: 'invoiceTwo',
  ownerId: [],
  storedURL: 'practice1',
  renderedDate: new Date(Date.now()),
  invoiceData: {
    language: 'Spanish',
    fileType: 'html',
    validUser: []
  }
};

const testData: Data = {
  users: [],
  invoices: [invoiceOne, invoiceTwo],
  xmlFiles: []
};

const invalidId = 3;
const validId = 1;
const success = 200;
const failure = 404;

describe('deleteInvoice', () => {
  beforeEach(() => {
    setData(testData);
  });

  test('1) Function: should delete an existing invoice', () => {
    const result = deleteInvoice(validId);
    expect(result).toStrictEqual(success);
    const updatedData = getData();
    const deletedInvoice = updatedData.invoices.find((invoice) => invoice.inId === 1);
    expect(deletedInvoice).toBeUndefined();
  });

  test('2) Function: should return an error for a non-existing invoice', () => {
    try {
      expect(deleteInvoice(invalidId)).toThrow(HTTPError[failure]);
    } catch (error) {
      expect(error).toBeInstanceOf(createError.NotFound);
      expect(error.status).toBe(failure);
      expect(error.message).toBe('InvoiceId not found');
    }

    // Set renderedDate back to Date type
    const data = getData();
    data.invoices.forEach((invoice) => {
      if (!(invoice.renderedDate instanceof Date)) {
        invoice.renderedDate = new Date(invoice.renderedDate);
      }
    });

    expect(data).toStrictEqual(testData);
  });

  test('3) HTTP: failure, should return an error and not affect data', () => {
    expect(requestDelete(invalidId)).toStrictEqual(failure);

    // Set renderedDate back to Date type
    const data = getData();
    data.invoices.forEach((invoice) => {
      if (!(invoice.renderedDate instanceof Date)) {
        invoice.renderedDate = new Date(invoice.renderedDate);
      }
    });

    expect(data).toStrictEqual(testData);
  });

  afterEach(() => {
    clear();
  });
});
