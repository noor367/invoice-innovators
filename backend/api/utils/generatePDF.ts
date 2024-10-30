import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

import { InvoiceDetails } from '../interfaces';

function generateInvoicePDF(invoiceDetails: InvoiceDetails) {
  if (!(invoiceDetails.date instanceof Date)) {
    invoiceDetails.date = new Date(invoiceDetails.date);
  }

  // Create a new PDF document
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();
  // Because jsPDF is how they named, I don't have any choice but to disable eslint on the above line

  // Title and Invoice Headers
  doc.setFontSize(16);
  doc.text('INVOICE', 105, 15, null, 'center'); // Adjust according to the correct method signature

  // // Supplier Information
  doc.setFontSize(14);
  doc.text('From:', 16, 25);

  doc.setFontSize(10);
  doc.text(`${invoiceDetails.supplierInfo.name}`, 16, 30);
  doc.text(invoiceDetails.supplierInfo.address, 16, 35);
  doc.text(`Tax Number: ${invoiceDetails.supplierInfo.taxNumber}`, 16, 40);

  // Invoice Details
  doc.text(`Invoice Number: ${invoiceDetails.inNumber}`, 16, 55);
  doc.text(`Invoice Date: ${invoiceDetails.date.toLocaleDateString()}`, 16, 60);

  // Use path.join and __dirname to construct the path to the image file
  const imagePath = path.join(__dirname, '..', '..', 'image', 'logo_base64.txt');

  // Read the base64 string from the file
  const imageData = fs.readFileSync(imagePath, 'utf8');
  doc.addImage(imageData, 'PNG', 155, 20, 40, 40);

  doc.setLineWidth(0.5);
  doc.line(5, 70, 205, 70);

  // Customer Details:
  doc.setFontSize(14);
  doc.text('To:', 16, 80);

  doc.setFontSize(10);
  doc.text(`${invoiceDetails.customerInfo.name}`, 16, 85);
  doc.text(invoiceDetails.customerInfo.streetName, 16, 90);
  doc.text(`${invoiceDetails.customerInfo.city}`, 16, 95);
  doc.text(`${invoiceDetails.customerInfo.postcode}`, 16, 100);

  // Convert region code
  const regionCode = invoiceDetails.customerInfo.regionCode;
  const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
  const country = regionName.of(regionCode);
  doc.text(`${country}`, 16, 105);

  // Product Details Table
  const tableColumn = ['ID', 'Name', 'Quantity', 'Price', 'Amount', 'GST', `GST at ${invoiceDetails.gst}%`];

  const body: string[][] = [];
  let total = 0;
  invoiceDetails.productDetails.forEach(product => {
    const gstAmount = (product.Quantity * product.price * invoiceDetails.gst / 100).toFixed(2);
    const productRow = [
      product.productId.toString(),
      product.name,
      product.Quantity.toString(),
        `$${product.price.toFixed(2)}`.toString(),
        `$${product.amount.toFixed(2)}`.toString(),
        `${invoiceDetails.gst}%`,
        gstAmount,
    ];
    total += product.amount + parseFloat(gstAmount);
    body.push(productRow);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: body,
    margin: { top: 120 },
    theme: 'plain',
  });

  // Total

  const finalY = (doc as any).lastAutoTable.finalY || 150; // 150 by default

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`Total:  $${total}`, 180, finalY + 10, null, 'right');

  // Define the path to the folder
  const folderPath = path.join(__dirname, '..', '..', 'invoicePDF');

  // Check if the folder exists
  if (!fs.existsSync(folderPath)) {
    // Folder does not exist, so create it
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Output the PDF
  let fileName = (invoiceDetails.supplierInfo.name + '_Invoice' + invoiceDetails.inNumber.toString() + invoiceDetails.date.toDateString());
  fileName = fileName.replace(/\s+/g, '');

  const filePath = path.join(folderPath, `${fileName}.pdf`);
  doc.save(filePath);

  return `${fileName}.pdf`;
}

export { generateInvoicePDF };
