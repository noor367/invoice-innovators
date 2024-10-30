import fs from 'fs';
import path from 'path';

import { InvoiceDetails } from '../interfaces';

const { translateToLanguage } = require('./languageTranslator');

/**
 * Helper function for default (english) html file generating
 * @param { InvoiceDetails } invoiceDetails
 */
function generateInvoiceHTML(invoiceDetails: InvoiceDetails) {
  // Convert date to readable format
  if (!(invoiceDetails.date instanceof Date)) {
    invoiceDetails.date = new Date(invoiceDetails.date);
  }

  // Convert region code to full country name for customer
  const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
  const country = regionName.of(invoiceDetails.customerInfo.regionCode);

  // Create HTML content
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoiceDetails.inNumber}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      .header { text-align: center; }
      .logo { width: 200px; height: 200px;}
      .section { margin-top: 20px; }
      .info_container { display: flex; justify-content: space-between; align-items: center; }
      .total { text-align: right; margin-top: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
      th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>INVOICE</h1>
    </div>
    <div class="info_container">
      <div class="text_section">
        <div class="section">
            <strong>From:</strong><br>
            ${invoiceDetails.supplierInfo.name}<br>
            ${invoiceDetails.supplierInfo.address}<br>
            Tax Number: ${invoiceDetails.supplierInfo.taxNumber}<br>
        </div>

        <div class="section">
        <strong>To:</strong><br>
          ${invoiceDetails.customerInfo.name}<br>
          ${invoiceDetails.customerInfo.streetName}<br>
          ${invoiceDetails.customerInfo.city}<br>
          ${invoiceDetails.customerInfo.postcode}<br>
          ${country}<br>
        </div>
      </div>
      <img src="/image/logo.png" alt="Group Logo" class="logo">
    </div>
    <div class="section">
        <strong>Invoice Number:</strong> ${invoiceDetails.inNumber}<br>
        <strong>Invoice Date:</strong> ${invoiceDetails.date.toLocaleDateString()}<br>
    </div>
    <div class="section">
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
                <th>GST</th>
                <th>GST at ${invoiceDetails.gst}%</th>
            </tr>`;

  let total = 0;
  invoiceDetails.productDetails.forEach(product => {
    const gstAmount = (product.Quantity * product.price * invoiceDetails.gst / 100).toFixed(2);
    htmlContent += `
            <tr>
                <td>${product.productId}</td>
                <td>${product.name}</td>
                <td>${product.Quantity}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>$${product.amount.toFixed(2)}</td>
                <td>${invoiceDetails.gst}%</td>
                <td>${gstAmount}</td>
            </tr>`;
    total += product.amount + parseFloat(gstAmount);
  });

  htmlContent += `
        </table>
    </div>
    <div class="total">
        <strong>Total: $${total.toFixed(2)}</strong>
    </div>
</body>
</html>`;

  // Define the path to the folder
  const folderPath = path.join(__dirname, '..', '..', 'invoiceHTML');

  // Check if the folder exists
  if (!fs.existsSync(folderPath)) {
    // Folder does not exist, so create it
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Output the HTML content to a file
  let fileName = (invoiceDetails.supplierInfo.name + '_Invoice' + invoiceDetails.inNumber.toString() + invoiceDetails.date.toDateString());
  fileName = fileName.replace(/\s+/g, '');

  const filePath = path.join(folderPath, `${fileName}.html`);

  // Write HTML content to its file
  createAndWriteHTMLFile(filePath, htmlContent);

  return `${fileName}.html`;
}

function createAndWriteHTMLFile(filename: string, htmlContent: string): void {
  fs.writeFile(filename, htmlContent, (err) => {
    if (err) {
      console.error('Failed to create the file:', err);
    } else {
      console.log('HTML file successfully created.');
    }
  });
}

/**
 * Helper function for translate language html file generating
 *
 * The reason why having 2 seperate function: one for translation
 * and one without because of the complexity of the translating function
 *
 * It is also slow down our code a lot which is not really good for our performent
 * in default (english case) that is why I keep the previous one
 *
 * @param { InvoiceDetails } invoiceDetails
 * @param { string } language
 */
async function generateTransInvoiceHTML(invoiceDetails: InvoiceDetails, language: string) {
  if (!(invoiceDetails.date instanceof Date)) {
    invoiceDetails.date = new Date(invoiceDetails.date);
  }

  // Convert region code to full country name for customer, in the desired language
  const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
  const country = regionName.of(invoiceDetails.customerInfo.regionCode);

  // Preparing texts for translation
  const texts = [
    'INVOICE',
    'From:',
    invoiceDetails.supplierInfo.name,
    invoiceDetails.supplierInfo.address,
    'Tax Number: ' + invoiceDetails.supplierInfo.taxNumber,
    'To:',
    invoiceDetails.customerInfo.name,
    invoiceDetails.customerInfo.streetName,
    invoiceDetails.customerInfo.city,
    invoiceDetails.customerInfo.postcode.toString(),
    country,
    'Invoice Number:',
    'Invoice Date:',
    invoiceDetails.date.toLocaleDateString(),
    'ID',
    'Name',
    'Quantity',
    'Price',
    'Amount',
    'GST',
    `GST at ${invoiceDetails.gst}%`,
    'Total:'
  ];

  // Translate static content
  const translatedTextsPromises = texts.map(async (text) => await translateToLanguage(text, language));
  const translatedTexts = await Promise.all(translatedTextsPromises);

  // Prepare dynamic product details texts for translation
  const productsDetailsTexts: any = [];
  invoiceDetails.productDetails.forEach((product) => {
    productsDetailsTexts.push(product.name, product.Quantity.toString(), product.price.toString(), product.amount.toString());
  });

  // Translate dynamic product details content
  const productsDetailsTextsPromises = productsDetailsTexts.map(async (text: any) => await translateToLanguage(text, language));
  const translatedProductsDetailsTexts = await Promise.all(productsDetailsTextsPromises);

  // Now, construct the HTML with the translated texts
  let htmlContent = `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <title>${translatedTexts[0]}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      .header { text-align: center; }
      .logo { width: 200px; height: 200px;}
      .section { margin-top: 20px; }
      .info_container { display: flex; justify-content: space-between; align-items: center; }
      .total { text-align: right; margin-top: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${translatedTexts[0]}</h1> <!-- INVOICE -->
    </div>
    <div class="info_container">
      <div class="text_section">
        <div class="section">
            <strong>${translatedTexts[1]}</strong><br> <!-- From: -->
            ${translatedTexts[2]}<br> <!-- Supplier Name -->
            ${translatedTexts[3]}<br> <!-- Address -->
            ${translatedTexts[4]}<br> <!-- Tax Number -->
        </div>
        <div class="section">
            <strong>${translatedTexts[5]}</strong><br> <!-- To: -->
            ${translatedTexts[6]}<br> <!-- Customer Name -->
            ${translatedTexts[7]}<br> <!-- Street Name -->
            ${translatedTexts[8]}<br> <!-- City -->
            ${translatedTexts[9]}<br> <!-- Postcode -->
            ${translatedTexts[10]}<br> <!-- Country -->
        </div>
      </div>
      <img src="/image/logo.png" alt="Group Logo" class="logo">
    </div>
    <div class="section">
        <strong>${translatedTexts[11]}</strong> ${invoiceDetails.inNumber}<br>
        <strong>${translatedTexts[12]}</strong> ${translatedTexts[13]}<br>
    </div>
    <div class="section">
        <table>
            <thead>
                <tr>
                    <th>${translatedTexts[14]}</th> <!-- ID -->
                    <th>${translatedTexts[15]}</th> <!-- Name -->
                    <th>${translatedTexts[16]}</th> <!-- Quantity -->
                    <th>${translatedTexts[17]}</th> <!-- Price -->
                    <th>${translatedTexts[18]}</th> <!-- Amount -->
                    <th>${translatedTexts[19]}</th> <!-- GST -->
                    <th>${translatedTexts[20]}</th> <!-- GST at XX% -->
                </tr>
            </thead>
            <tbody>`;

  // Append product rows
  invoiceDetails.productDetails.forEach((product, index) => {
    const productIndex = index * 4; // 4 details per product
    htmlContent += `
                <tr>
                    <td>${product.productId}</td>
                    <td>${translatedProductsDetailsTexts[productIndex]}</td>
                    <td>${translatedProductsDetailsTexts[productIndex + 1]}</td>
                    <td>$${translatedProductsDetailsTexts[productIndex + 2]}</td>
                    <td>$${translatedProductsDetailsTexts[productIndex + 3]}</td>
                    <td>${invoiceDetails.gst}%</td>
                    <td>$${((product.Quantity * product.price * invoiceDetails.gst) / 100).toFixed(2)}</td>
                </tr>`;
  });

  // Calculate total
  const total = invoiceDetails.productDetails.reduce((acc, product) => acc + product.amount + (product.Quantity * product.price * invoiceDetails.gst / 100), 0);

  htmlContent += `
            </tbody>
        </table>
    </div>
    <div class="total">
        <strong>${translatedTexts[21]} $${total.toFixed(2)}</strong>
    </div>
</body>
</html>`;

  // Define the path and filename for the HTML file
  const filename = `${invoiceDetails.supplierInfo.name.replace(/\s+/g, '')}_${language}_Invoice${invoiceDetails.inNumber}_${invoiceDetails.date.toISOString().slice(0, 10)}.html`;

  const outputPath = path.join(__dirname, '..', '..', 'invoiceHTML', filename);

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Write the file
  fs.writeFileSync(outputPath, htmlContent);

  return filename;
}

export { generateInvoiceHTML, generateTransInvoiceHTML };
