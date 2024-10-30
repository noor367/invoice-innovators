import { invoicesListReq, uploadFileReq, authRegisterReq } from '../utils/testHelper';
import { InvoiceDetails } from '../interfaces';
import { clear } from '../dataStore';

afterAll(() => {
  clear();
});

const correctResult = [
  {
    inId: expect.any(Number),
    inName: expect.any(String),
    link: expect.any(String),
    renderedDate: expect.any(String),
  }
];

// Create Dummy Data
const invoiceDetails: InvoiceDetails = {
  inNumber: 1002,
  date: new Date('February 07, 2022'),
  supplierInfo: {
    name: 'Ebusiness Software Services Pty Ltd',
    address: '100 Business St, Dulwich Hill, Australia',
    taxNumber: 80647710156,
  },
  productDetails: [{
    productId: 1,
    name: 'pencils',
    Quantity: 500,
    price: 0.20,
    amount: 100.00,
  },
  {
    productId: 2,
    name: 'pens',
    Quantity: 600,
    price: 0.50,
    amount: 300.00,
  },
  {
    productId: 3,
    name: 'pencilcases',
    Quantity: 200,
    price: 5.00,
    amount: 1000.00,
  },
  ],
  gst: 10,
  total: 110,
  customerInfo: {
    name: 'Test Company',
    streetName: 'Some Street',
    city: 'Sydney',
    postcode: 2052,
    regionCode: 'AU',
  }
};

// Initialize data
const user = authRegisterReq('test@gmail.com', '123456', 'John', 'Terry');
const user2 = authRegisterReq('test2@gmail.com', '123456', 'John', 'Terry');
const user3 = authRegisterReq('test3@gmail.com', '123456', 'John', 'Terry');
const user4 = authRegisterReq('test4@gmail.com', '123456', 'John', 'Terry');

// Invoice 1
uploadFileReq(user.token, invoiceDetails, 'pdf', 'english', [user2.uId]);
// Invoice 2
uploadFileReq(user.token, invoiceDetails, 'pdf', 'english', [user.uId, user2.uId]);
// Invoice 3
uploadFileReq(user.token, invoiceDetails, 'HTML', 'english', [user.uId]);
// Invoice 4
uploadFileReq(user.token, invoiceDetails, 'HTML', 'italian', [user.uId, user3.uId]);

// Testing
describe('/innovators/invoices/list', () => {
  describe('Failed test cases', () => {
    test('Invalid token', () => {
      expect(invoicesListReq('invalidToken')).toStrictEqual(403);
    });
  });

  describe('success', () => {
    test('Empty list', () => {
      const list = invoicesListReq(user4.token);
      expect(list).toStrictEqual([]);
    });

    test('List 1 invoice', () => {
      const list = invoicesListReq(user3.token);
      expect(list).toStrictEqual(correctResult);
    });

    test('List 2 invoices', () => {
      const list = invoicesListReq(user2.token);
      expect(list).toStrictEqual([
        {
          inId: expect.any(Number),
          inName: expect.any(String),
          link: expect.any(String),
          renderedDate: expect.any(String),
        },
        {
          inId: expect.any(Number),
          inName: expect.any(String),
          link: expect.any(String),
          renderedDate: expect.any(String),
        },
      ]);
    });

    test('Succesful list multiple invoices', () => {
      const list = invoicesListReq(user.token);

      expect(list).toStrictEqual([
        {
          inId: expect.any(Number),
          inName: expect.any(String),
          link: expect.any(String),
          renderedDate: expect.any(String),
        },
        {
          inId: expect.any(Number),
          inName: expect.any(String),
          link: expect.any(String),
          renderedDate: expect.any(String),
        },
        {
          inId: expect.any(Number),
          inName: expect.any(String),
          link: expect.any(String),
          renderedDate: expect.any(String),
        },
        {
          inId: expect.any(Number),
          inName: expect.any(String),
          link: expect.any(String),
          renderedDate: expect.any(String),
        },
      ]);
    });
  });
});
