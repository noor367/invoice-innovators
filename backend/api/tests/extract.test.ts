import fs from 'fs';
import { xmlExtract } from '../extract';
import HTTPError from 'http-errors';

const example1 = fs.readFileSync('exampleXml1.xml', 'utf-8');
const xmlData = {};
const xmlName = 'xml1';

test('Valid XML Content', () => {
  expect(xmlExtract(xmlName, example1, 'id1', xmlData)).toEqual({
    invoiceDetails: [
      {
        inNumber: 'Invoice01',
        date: new Date('2019-07-29'),
        supplierInfo: {
          name: 'Supplier Trading Name Ltd',
          address: 'Main street 1,Harrison,2912 Australia',
          taxNumber: 47555222000
        },
        productDetails: [{
          productId: 1,
          name: 'True-Widgets',
          Quantity: 10,
          price: 29.99,
          amount: 299.90
        },
        {
          productId: 2,
          name: 'item name 2',
          Quantity: 2,
          price: 500,
          amount: 1000
        },
        {
          productId: 3,
          name: 'True-Widgets',
          Quantity: 25,
          price: 7.5,
          amount: 187.5
        }],
        gst: 148.74,
        total: 1636.14,
        customerInfo: {
          name: 'Trotters Trading Co Ltd',
          streetName: '100 Queen Street',
          city: 'Sydney',
          postcode: 2000,
          regionCode: 'AU'
        }
      }
    ]
  });
});

test('Error Handling: Malformed XML', () => {
  expect(() => xmlExtract(null, example1, 'id1', xmlData)).toThrow(HTTPError(400, 'Unexpected or malformed XML Received'));
});
