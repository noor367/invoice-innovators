import { uploadFileReq, authRegisterReq } from '../utils/testHelper';
import { InvoiceDetails } from '../interfaces';
import { clear } from '../dataStore';

afterAll(() => {
  clear();
});

const correctResult = {
  invoiceLink: expect.any(String),
  inId: expect.any(Number),
  userIds: expect.any(Array)
};

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

const user = authRegisterReq('test@gmail.com', '123456', 'John', 'Terry');
const user2 = authRegisterReq('test2@gmail.com', '123456', 'John', 'Terry');
const user3 = authRegisterReq('test3@gmail.com', '123456', 'John', 'Terry');
const user4 = authRegisterReq('test4@gmail.com', '123456', 'John', 'Terry');

describe('innovators/invoice/upload', () => {
  describe('Failed test cases', () => {
    test('Invalid token', () => {
      const data = uploadFileReq('invalidToken', invoiceDetails, 'pdf', 'english', [user2.uId]);
      expect(data).toStrictEqual(403);
    });

    test('Invalid file type', () => {
      const data = uploadFileReq(user.token, invoiceDetails, 'sh', 'english', [user2.uId]);
      expect(data).toStrictEqual(400);
    });

    test('Invalid userId list', () => {
      const data = uploadFileReq(user.token, invoiceDetails, 'pdf', 'english', [10]);
      expect(data).toStrictEqual(400);
    });

    test('Invalid 1 uId in userId list', () => {
      const data = uploadFileReq(user.token, invoiceDetails, 'pdf', 'english', [user2.uId, user3.uId, 10, user4.uId]);
      expect(data).toStrictEqual(400);
    });

    test('Not implemented file type for now', () => {
      const data = uploadFileReq(user.token, invoiceDetails, 'XLSX', 'english', [user2.uId, user3.uId, user4.uId]);
      expect(data).toStrictEqual(404);
    });
  });

  describe('Success cases', () => {
    test('PDF success case', () => {
      const data = uploadFileReq(user.token, invoiceDetails, 'pdf', 'english', [user2.uId]);
      expect(data).toStrictEqual(correctResult);
    });

    test('PDF success case that include creator', () => {
      const data = uploadFileReq(user.token, invoiceDetails, 'pdf', 'english', [user.uId, user2.uId]);
      expect(data).toStrictEqual(correctResult);
    });

    test('HTML success case', () => {
      const data = uploadFileReq(user.token, invoiceDetails, 'HTML', 'english', [user.uId]);
      expect(data).toStrictEqual(correctResult);
    });

    test('HTML success Italian translation case', () => {
      const data = uploadFileReq(user.token, invoiceDetails, 'HTML', 'italian', [user.uId]);
      expect(data).toStrictEqual(correctResult);
    });

    test('HTML success case with randomly case name', () => {
      const data = uploadFileReq(user.token, invoiceDetails, 'HtMl', 'english', [user.uId]);
      expect(data).toStrictEqual(correctResult);
    });

    test('JSON success case', () => {
      const data = uploadFileReq(user.token, invoiceDetails, 'JSON', 'english', [user.uId]);
      expect(data).toStrictEqual(correctResult);
    });

    test('Image success case', () => {
      const data = uploadFileReq(user.token, invoiceDetails, 'PNG', 'english', [user.uId]);
      expect(data).toStrictEqual(correctResult);
    });
  });
});
