# invoice-seng2021-24t1-seng2021-24t1-w11a_two
# Invoice Rendering API

## Overview

The Invoice Rendering API is designed to handle the rendering of invoices from XML files and provide the user with the flexibility to specify parameters such as file type and language for the rendered invoice. This API is part of a larger system that involves uploading, receiving, validating, and deleting rendered invoices.

## Routes

### 1. `/innovators/invoice/upload/v3`

#### Description
This route handles the uploading of a rendered invoice. It takes an XML file as input, translates it into the desired language, converts it into the specified file type, and provides a link to the rendered invoice.

List of supported **file type** conversion: `PDF`, `JSON`, `HTML`, `PNG`.

List of 10 supported **language**s: `english`, `spanish`, `french`, `german`, `vietnamese`, `chinese`, `japanese`, `arabic`, `hindi`, `italian`.

#### CRUD Method
POST

#### Parameters
- `fileType` (string): File type (e.g., PDF, HTML) of the rendered invoice.
- `language` (string): Language to which the invoice should be translated.
- `XML File` (Object): The XML file containing the invoice data.

#### Return Values
- 200 Successful Operation: Invoice has been correctly rendered and uploaded.
- 400 Bad Request: Unexpected or malformed XML, language, or fileType received.
- 403 Forbidden Request: The request denied by the server.
- 404 Not Found: The requested items do not exist/not found.
- 500 Internal Server Error: Server-side errors.

### 2. `/innovators/invoice/receive`

#### Description
This route handles the receiving of the XML file. It is designed to keep the receiving process separate from the more complicated rendering functions.

#### CRUD Method
GET

#### Parameters
None

#### Return Values
- 200 Successful Operation: XML File has been received.
- 400 Bad Request: Unexpected or malformed XML file received.
- 403 Forbidden Request: The request denied by the server.
- 404 Not Found: The requested XML file does not exist/not found.
- 500 Internal Server Error: Server-side errors.

### 3. `/innovators/invoice/validation`

#### Description
This route receives and checks the validation report. Another API in the ecosystem produces a validation report of the incoming invoice in XML format. This route checks for errors in the report.

#### CRUD Method
GET

#### Parameters
None

#### Return Values
- 200 Successful Operation: Validation report has been received, and there are no errors.
- 400 Bad Request: The report states the invoice is not correct.
- 403 Forbidden Request: The request denied by the server.
- 404 Not Found: The requested validation report does not exist/not found.
- 500 Internal Server Error: Server-side errors.

### 4. `/innovators/invoice/parameters`

#### Description
This route receives the parameters (language and file type) for the rendered invoice.

#### CRUD Method
GET

#### Parameters
None

#### Return Values
- 200 Successful Operation: Parameters correctly read and are valid.
- 400 Bad Request: Invalid parameters.
- 403 Forbidden Request: The request denied by the server.
- 404 Not Found: The requested parameters do not exist/not found.
- 500 Internal Server Error: Server-side errors.

### 5. `/innovators/invoice/delete`

#### Description
This route deletes a specified rendered invoice based on its unique `invoiceId`. It helps manage unwanted invoices and assists with security concerns.

#### CRUD Method
DELETE

#### Parameters
- `invoiceId` (String): The unique identifier of the invoice to be deleted.

#### Return Values
- 200 Successful Operation: Invoice correctly deleted.
- 400 Bad Request: Invalid `invoiceId`.
- 403 Forbidden Request: The request denied by the server.
- 404 Not Found: The requested Invoice does not exist/not found.
- 500 Internal Server Error: Server-side errors.

### 6. `/innovators/statusCheck`

#### Description
This route checks the status of the server.

#### CRUD Method
GET

#### Parameters
None

#### Return Values
- 200 Successful Operation: Server is online and running.
- 404 Not Found: Server is not found/is failing.

### 7. `/innovators/auth/register`

#### Description
Given a user's first and last name, email address, and password, creates a new account for them and returns a new uId.

#### CRUD Method
POST

#### Parameters
- `email` (string): Valid email.
- `password` (string): Valid password.
- `nameFirst` (string): First name.
- `nameLast` (string): Last name.

#### Return Values
- 200 Successful Operation: Account has been successful created.
- 400 Bad Request: 
    - Invalid email.
    - Email has been already used by another user.
    - Length of `password` is Less than 6 characters.
    - Length of `nameLast` and `nameFirst` is not between 1 and 50 characters inclusive.
- 403 Forbidden Request: The request denied by the server.
- 404 Not Found: The requested items do not exist/not found.
- 500 Internal Server Error: Server-side errors.

### 8. `/innovators/auth/login`

#### Description
Given a user's `email` and `password`, return uId and log them into system.

#### CRUD Method
POST

#### Parameters
- `email` (string): Email.
- `password` (string): Password.

#### Return Values
- 200 Successful Operation: Account has been successful logged in.
- 400 Bad Request: 
    - `email` is not existed in the system
    - `password` is incorrect.
- 403 Forbidden Request: The request denied by the server.
- 404 Not Found: The requested items do not exist/not found.
- 500 Internal Server Error: Server-side errors.

### 9. `/innovators/auth/logout`

#### Description
Given an active `token`, invalidates the `token` to log the user out.

#### CRUD Method
POST

#### Parameters
None

#### Return Values
- 200 Successful Operation: Account has been successful logged out.
- 403 Forbidden Request: The request denied by the server.

### 10. `/innovators/invoices/list`

#### Description
Given an active `token`, retrieving rendered invoice(s) that the user owns or has the right to view

#### CRUD Method
GET

#### Parameters
None

#### Return Values
- 200 Successful Operation: Rendered invoice(s) have been succesful listed.
- 403 Forbidden Request: The request denied by the server.
