import { httpRequestRequest } from '../utils/httpRequest';
import HTTPError from 'http-errors';
import { clear, setData } from '../dataStore';
import { User, XmlFile, Data } from '../interfaces';

const userOne: User = {
  uId: 1,
  email: '',
  password: '',
  nameFirst: '',
  nameLast: '',
  token: [],
  invoiceData: [{
    language: 'en',
    fileType: 'pdf',
    validUser: []
  }],
  invoiceIdList: [],
};
const userTwo: User = {
  uId: 2,
  email: '',
  password: '',
  nameFirst: '',
  nameLast: '',
  token: [],
  invoiceData: [{
    language: 'en',
    fileType: 'pdf',
    validUser: [1]
  }],
  invoiceIdList: [],
};
const xmlIdOne = '1';
const xmlIdTwo = '2';
const xmlIdThree = '3';
const xmlIdFour = '4';
const xmlIdFive = '5';
const xmlIdSix = '6';

const xmlOne: XmlFile = { // No xmlName
  xmlName: '',
  xmlContent: '',
  xmlId: xmlIdOne,
  xmlData: {
    language: 'en',
    fileType: 'PDF',
    validUser: [1]
  }
};
const xmlTwo: XmlFile = { // Existing xmLContent
  xmlName: 'exampleXml2.xml',
  xmlContent: 'hey',
  xmlId: xmlIdTwo,
  xmlData: {
    language: 'en',
    fileType: 'PDF',
    validUser: [2]
  }
};
const xmlThree: XmlFile = { // Invalid File Type
  xmlName: 'exampleXml2.xml',
  xmlContent: '',
  xmlId: xmlIdThree,
  xmlData: {
    language: 'en',
    fileType: 'INVALID',
    validUser: [1]
  }
};
const xmlFour: XmlFile = { // No Valid Users
  xmlName: 'exampleXml2.xml',
  xmlContent: '',
  xmlId: xmlIdFour,
  xmlData: {
    language: 'en',
    fileType: 'PDF',
    validUser: []
  }
};
const xmlFive: XmlFile = { // Invalid Language
  xmlName: 'exampleXml2.xml',
  xmlContent: '',
  xmlId: xmlIdFive,
  xmlData: {
    language: 'INVALID',
    fileType: 'PDF',
    validUser: [1, 2]
  }
};
const xmlSix: XmlFile = { // Valid Case
  xmlName: 'exampleXml2.xml',
  xmlContent: '',
  xmlId: xmlIdSix,
  xmlData: {
    language: 'en',
    fileType: 'PDF',
    validUser: [1, 2]
  }
};
const dataOne: Data = {
  users: [userOne, userTwo],
  invoices: [],
  xmlFiles: [xmlOne, xmlTwo, xmlThree, xmlFour, xmlFive, xmlSix]
};
beforeEach(() => {
  setData(dataOne);
});
afterEach(() => {
  clear();
});
describe('Testing for xmlReceive', () => {
  test('Test is Functioning', () => {
    expect(1 + 1).toStrictEqual(2);
  });

  const path = '/innovators/invoice/receive';
  test('invalid XmlId', () => {
    expect(() => httpRequestRequest('GET', path, { xmlId: '919191' })).toThrow(HTTPError[400]);
  });
  test('invalid Xml Name', () => {
    expect(() => httpRequestRequest('GET', path, { xmlId: xmlIdOne })).toThrow(HTTPError[400]);
  });
  test('invalid Xml Content', () => {
    expect(() => httpRequestRequest('GET', path, { xmlId: xmlIdTwo })).toThrow(HTTPError[400]);
  });
  test('invalid File Type', () => {
    expect(() => httpRequestRequest('GET', path, { xmlId: xmlIdThree })).toThrow(HTTPError[400]);
  });
  test('invalid Users', () => {
    expect(() => httpRequestRequest('GET', path, { xmlId: xmlIdFour })).toThrow(HTTPError[400]);
  });
  test('invalid Language', () => {
    expect(() => httpRequestRequest('GET', path, { xmlId: xmlIdFive })).toThrow(HTTPError[400]);
  });
  test('Valid Case Output', () => {
    expect(httpRequestRequest('GET', path, { xmlId: xmlIdSix })).toStrictEqual({
      xmlName: 'exampleXml2.xml',
      xmlContent: expect.any(String),
      xmlId: xmlIdSix,
      xmlData: {
        language: 'en',
        fileType: 'PDF',
        validUser: [1, 2]
      }
    });
  });
});
