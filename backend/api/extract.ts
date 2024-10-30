import { XMLParser } from 'fast-xml-parser';
import { InvoiceDetails, SupplierInfo, ProductDetails, CustomerInfo } from './interfaces';
import HTTPError from 'http-errors';

export function xmlExtractV2(xmlContent: any) {
  if (typeof xmlContent !== 'string') {
    throw HTTPError(400, 'Unexpected or malformed XML Received');
  }

  const parser = new XMLParser();
  const jsonObj = parser.parse(xmlContent);

  const invoiceDetails: InvoiceDetails[] = [
    {
      inNumber: jsonObj.Invoice['cbc:ID'],
      date: new Date(jsonObj.Invoice['cbc:IssueDate']),
      supplierInfo: extractSupplierInfo(jsonObj.Invoice),
      productDetails: extractProductDetails(jsonObj.Invoice),
      gst: Number(jsonObj.Invoice['cac:TaxTotal']['cbc:TaxAmount']),
      total: Number(jsonObj.Invoice['cac:LegalMonetaryTotal']['cbc:PayableAmount']),
      customerInfo: extractCustomerInfo(jsonObj.Invoice),
    }];
  return { invoiceDetails };
}

export function xmlExtract(xmlName:any, xmlContent: any, xmlId: any, xmlData: any) {
  if (typeof xmlName !== 'string' ||
    typeof xmlContent !== 'string' ||
    typeof xmlId !== 'string' ||
    typeof xmlData !== 'object') {
    throw HTTPError(400, 'Unexpected or malformed XML Received');
  }

  const parser = new XMLParser();
  const jsonObj = parser.parse(xmlContent);

  const invoiceDetails: InvoiceDetails[] = [
    {
      inNumber: jsonObj.Invoice['cbc:ID'],
      date: new Date(jsonObj.Invoice['cbc:IssueDate']),
      supplierInfo: extractSupplierInfo(jsonObj.Invoice),
      productDetails: extractProductDetails(jsonObj.Invoice),
      gst: Number(jsonObj.Invoice['cac:TaxTotal']['cbc:TaxAmount']),
      total: Number(jsonObj.Invoice['cac:LegalMonetaryTotal']['cbc:PayableAmount']),
      customerInfo: extractCustomerInfo(jsonObj.Invoice),
    }];
  return { invoiceDetails };
}

function extractSupplierInfo(jsonData:any): SupplierInfo {
  const supplier = jsonData['cac:AccountingSupplierParty']['cac:Party'];
  const countryCode = supplier['cac:PostalAddress']['cac:Country']['cbc:IdentificationCode'];
  const countryName = new Intl.DisplayNames(['en'], { type: 'region' });
  const country = countryName.of(countryCode);

  return {
    name: supplier['cac:PartyName']['cbc:Name'],
    address: supplier['cac:PostalAddress']['cbc:StreetName'] + ',' + supplier['cac:PostalAddress']['cbc:CityName'] + ',' + supplier['cac:PostalAddress']['cbc:PostalZone'] + ' ' + country,
    taxNumber: Number(supplier['cac:PartyLegalEntity']['cbc:CompanyID']),
  };
}

function extractProductDetails(jsonData:any): ProductDetails[] {
  const invoiceLines = jsonData['cac:InvoiceLine'];

  const lines = Array.isArray(invoiceLines) ? invoiceLines : [invoiceLines];

  const products: ProductDetails[] = [];

  lines.forEach((line: any) => {
    const product: ProductDetails = {
      productId: parseInt(line['cbc:ID']),
      name: line['cac:Item']['cbc:Name'],
      Quantity: parseFloat(line['cbc:InvoicedQuantity']),
      price: parseFloat(line['cac:Price']['cbc:PriceAmount']),
      amount: parseFloat(line['cbc:LineExtensionAmount']),
    };

    products.push(product);
  });

  return products;
}

function extractCustomerInfo(jsonData:any): CustomerInfo {
  const customer = jsonData['cac:AccountingCustomerParty']['cac:Party'];
  return {
    name: customer['cac:PartyName']['cbc:Name'],
    streetName: customer['cac:PostalAddress']['cbc:StreetName'],
    city: customer['cac:PostalAddress']['cbc:CityName'],
    postcode: customer['cac:PostalAddress']['cbc:PostalZone'],
    regionCode: customer['cac:PostalAddress']['cac:Country']['cbc:IdentificationCode'],
  };
}
