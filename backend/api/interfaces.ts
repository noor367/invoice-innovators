// Utils
interface SupplierInfo {
  name: string;
  address: string;
  taxNumber: number | string;
}

interface CustomerInfo {
  name: string;
  streetName: string;
  city: string;
  postcode: number;
  regionCode: string;
}

interface ProductDetails {
  productId: number;
  name: string;
  Quantity: number;
  price: number;
  amount: number;
}

interface InvoiceDetails {
  inNumber: number;
  date: Date;
  supplierInfo: SupplierInfo;
  productDetails: ProductDetails[];
  gst: number;
  total: number;
  customerInfo: CustomerInfo;
}

// Additional Interfaces
interface InvoiceData {
  language: string;
  fileType: string;
  validUser: number[];
}

interface XmlFile {
  xmlName: string;
  xmlContent: string;
  xmlId: string;
  xmlData: InvoiceData;
}

interface ReceiveReturn {
  xmlName: string;
  xmlContent?: string;
  xmlId: string;
  language: string;
  fileType: string;
}

interface ListReturn {
  inId: number,
  inName: string,
  link: string,
  renderedDate: string,
}

// Storage details
interface User {
  uId: number,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  token: string[],
  invoiceData: InvoiceData[],
  invoiceIdList: number[],
}

interface Invoice {
  inId: number,
  name: string,
  ownerId: number[],
  storedURL: string,
  renderedDate: Date,
  invoiceData: InvoiceData
}

interface Data {
  users: User[];
  invoices: Invoice[];
  xmlFiles: XmlFile[];
}

// Export all interfaces
export {
  User,
  Invoice,
  InvoiceDetails,
  SupplierInfo,
  CustomerInfo,
  ProductDetails,
  InvoiceData,
  XmlFile,
  ReceiveReturn,
  Data,
  ListReturn,
};
