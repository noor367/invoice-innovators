import fs from 'fs';
import path from 'path';

import { InvoiceDetails } from '../interfaces';

function generateInvoiceJSON(
  invoiceDetails: InvoiceDetails,
  SERVER_URL: string,
  inId: number) {
  // Convert date to readable format
  if (!(invoiceDetails.date instanceof Date)) {
    invoiceDetails.date = new Date(invoiceDetails.date);
  }

  // Convert region code to full country name for customer
  const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
  const country = regionName.of(invoiceDetails.customerInfo.regionCode);

  // Calculating total
  let total = 0;
  invoiceDetails.productDetails.forEach(product => {
    const gstAmount = (product.Quantity * product.price * invoiceDetails.gst / 100).toFixed(2);
    total += product.amount + parseFloat(gstAmount);
  });

  const jsonData = {
    resourceType: 'Invoice',
    id: inId,

    images: {
      logo: `${SERVER_URL}/image/logo.png`
    },

    sender_info: {
      company: invoiceDetails.supplierInfo.name,
      address: invoiceDetails.supplierInfo.address,
      tax_nubmer: invoiceDetails.supplierInfo.taxNumber
    },

    customer_info: {
      company: invoiceDetails.customerInfo.name,
      street: invoiceDetails.customerInfo.streetName,
      city: invoiceDetails.customerInfo.city,
      postcode: invoiceDetails.customerInfo.postcode,
      country: country
    },

    invoice_info: {
      invoice_number: invoiceDetails.inNumber,
      invoice_creation_date: invoiceDetails.date.toLocaleDateString(),
    },

    product_info: invoiceDetails.productDetails,
    gst: `${invoiceDetails.gst}%`,
    total: total,
  };

  // Define the path to the folder
  const folderPath = path.join(__dirname, '..', '..', 'invoiceJSON');

  // Check if the folder exists
  if (!fs.existsSync(folderPath)) {
    // Folder does not exist, so create it
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Output the JSON content to a file
  let fileName = (invoiceDetails.supplierInfo.name + '_Invoice' + invoiceDetails.inNumber.toString() + invoiceDetails.date.toDateString());
  fileName = fileName.replace(/\s+/g, '');

  const filePath = path.join(folderPath, `${fileName}.json`);

  // Write JSON content to a file
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

  return `${fileName}.json`;
}

export { generateInvoiceJSON };
