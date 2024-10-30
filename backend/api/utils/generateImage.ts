import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { InvoiceDetails } from '../interfaces';

async function generateInvoiceImage(invoiceDetails: InvoiceDetails) {
  // Constants for the invoice layout
  const width = 800;
  const height = 600;

  // Create a new image with a white background
  const image = new Jimp(width, height, '#ffffff');

  // Load the font
  const fontBold25 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK); // closest size match for bold 25px
  const font20 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  const font14 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
  const fontBold14 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK); // for bold effect in table headers
  const fontBold16 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK); // for total

  // Title
  image.print(fontBold25, 350, 20, 'INVOICE');

  // Supplier Info
  image.print(font20, 50, 70, 'From:');
  image.print(font14, 50, 110, invoiceDetails.supplierInfo.name);
  image.print(font14, 50, 130, invoiceDetails.supplierInfo.address);
  image.print(font14, 50, 150, `Tax Number: ${invoiceDetails.supplierInfo.taxNumber}`);

  // Customer Info
  image.print(font20, 400, 70, 'To:');
  image.print(font14, 400, 110, invoiceDetails.customerInfo.name);
  image.print(font14, 400, 130, invoiceDetails.customerInfo.streetName);
  image.print(font14, 400, 150, `${invoiceDetails.customerInfo.city}, ${invoiceDetails.customerInfo.postcode}`);

  // Logo Handling
  const logo = await Jimp.read(path.join(__dirname, '..', '..', 'image', 'logo.png'));
  image.composite(logo.resize(190, 150), 580, 30); // Resizing and placing the logo

  // Convert region code into its name
  const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
  const country = regionName.of(invoiceDetails.customerInfo.regionCode);
  image.print(font14, 400, 170, country);

  // Invoice Info
  image.print(font14, 50, 220, `Invoice Number: ${invoiceDetails.inNumber}`);

  // Date handling
  if (!(invoiceDetails.date instanceof Date)) {
    invoiceDetails.date = new Date(invoiceDetails.date);
  }
  image.print(font14, 50, 240, `Invoice Date: ${invoiceDetails.date.toLocaleDateString()}`);

  // Products Table Header
  image.print(fontBold14, 50, 280, 'ID');
  image.print(fontBold14, 100, 280, 'Name');
  image.print(fontBold14, 240, 280, 'Quantity');
  image.print(fontBold14, 400, 280, 'Price');
  image.print(fontBold14, 500, 280, 'Amount');
  image.print(fontBold14, 600, 280, 'GST');
  image.print(fontBold14, 650, 280, `GST at ${invoiceDetails.gst}%`);

  // Products Details
  let yPos = 300;
  invoiceDetails.productDetails.forEach(product => {
    image.print(font14, 50, yPos, product.productId.toString());
    image.print(font14, 100, yPos, product.name);
    image.print(font14, 255, yPos, product.Quantity.toString());
    image.print(font14, 400, yPos, `$${product.price.toFixed(2)}`);
    image.print(font14, 500, yPos, `$${product.amount.toFixed(2)}`);
    const gstAmount = (product.Quantity * product.price * invoiceDetails.gst / 100).toFixed(2);
    image.print(font14, 600, yPos, `${invoiceDetails.gst}%`);
    image.print(font14, 650, yPos, `$${gstAmount}`);
    yPos += 20;
  });

  // Total
  const total = invoiceDetails.productDetails.reduce((acc, product) => acc + product.amount + (product.Quantity * product.price * invoiceDetails.gst / 100), 0);
  image.print(fontBold16, 600, yPos + 20, 'Total: ');
  image.print(font14, 650, yPos + 20, `$${total.toFixed(2)}`);

  // Define the file name and path
  const folderPath = path.join(__dirname, '..', '..', 'invoiceImage');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  const fileName = `${invoiceDetails.supplierInfo.name}_Invoice${invoiceDetails.inNumber}${invoiceDetails.date.toDateString()}`.replace(/\s+/g, '');
  const filePath = path.join(folderPath, `${fileName}.png`);

  // Save to a file
  await image.writeAsync(filePath);

  return `${fileName}.png`;
}

export { generateInvoiceImage };
