import { VALIDATION, CREATION, RENDERING } from './config.js';
import { makeRequest, showError } from './helpers.js';

export async function handleUpload() {
  try {
    const fileType = document.getElementById('upload-type').value;
    const file = document.getElementById('upload-file').files[0];
    let response;
    switch (fileType) {
      case 'xml-file':
      response = await uploadXML(file);
      break;
      case 'json-file':
      response = await uploadJSON(file);
      break;
      default:
      showError('Invalid File Type');
      return;
    }
    return response;
  } catch (e) {
    showError(e);
    console.error('Error:', e);
  }
}

async function uploadXML(xmlFile) {
  try {
    const validate = await validateXML(xmlFile);
    if (validate.successful) {
      return await renderXML(xmlFile);
    } else {
      showError('Invalid XML file');
      return false;
    }
  } catch (e) {
    showError(e);
    console.error('Error:', e);
  }
}

async function validateXML(xmlFile) {
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
    showError(e);
    console.error('Error:', e);
  }
}

async function uploadJSON(JSONfile) {
  try {
    const url = CREATION + '/create/individual/json';
    const creation = await makeRequest(url, 'POST', JSONfile);
    const validate = await validateXML(creation);
    if (validate) {
      return await renderXML(creation);
    } else {
      showError('Invalid XML file');
      return false;
    }
  } catch (e) {
    showError(e);
    console.error('Error:', e);
  }
}

async function renderXML(xmlFile) {
  try {
    const renderType = document.getElementById('render-type').value;
    const extractUrl = RENDERING + '/innovators/invoice/extract/v2';
    const data = await readXMLFile(xmlFile);
    const extract = await makeRequest(extractUrl, 'POST', { xmlContent: data });
    if (extract.error) {
      showError(extract.error);
    } else {
      const uploadUrl = RENDERING + '/innovators/invoice/upload/v2';
      const uploadData = {
        invoiceDetails: extract.invoiceDetails[0],
        fileType: renderType,
        language: document.getElementById('render-lan').value,
        userIds: [Number(localStorage.getItem('uId'))]
      }
      const response = await makeRequest(uploadUrl, 'POST', uploadData);
      if (response.error) {
        showError(response.error);
      } else {
        return response;
      }
    }
  } catch (error) {
    showError(error);
    console.error(error);
  }
}

async function readXMLFile(xmlFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(xmlFile);
  });
}