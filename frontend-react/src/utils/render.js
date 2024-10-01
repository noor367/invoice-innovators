import { makeRequest, RENDERING, VALIDATION } from "./helpers";

export async function validateXML(xmlFile) {
  try {
    const url = VALIDATION + '/validate';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: xmlFile
    });
    return await response.json();
  } catch (e) {
    console.error('Error:', e);
  }
}

export async function renderXML(xmlFile, renderType, lang) {
  try {
    const extractUrl = RENDERING + '/innovators/invoice/extract/v2';
    const data = await readXMLFile(xmlFile);
    const extract = await makeRequest(extractUrl, 'POST', { xmlContent: data });
    if (extract.error) {
      return extract;
    } else {
      const uploadUrl = RENDERING + '/innovators/invoice/upload/v3';
      const uploadData = {
        invoiceDetails: extract.invoiceDetails[0],
        fileType: renderType,
        language: lang,
        userIds: [Number(localStorage.getItem('id'))]
      }
      return await makeRequest(uploadUrl, 'POST', uploadData);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function readXMLFile(xmlFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(xmlFile);
  });
}
