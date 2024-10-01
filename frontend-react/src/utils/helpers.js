// helpers.js
export const RENDERING = 'http://3.25.232.173:3000';
export const VALIDATION = 'https://sandc.vercel.app';
export const CREATION = 'https://w13a-brownie.vercel.app';

export const requestAuth = async (path, body) => {
  try {
    const askPath = '/innovators/auth' + path
    const response = await fetch(RENDERING + askPath, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return await response.json();
  } catch (error) {
    console.error('Request error:', error);
    throw new Error('Failed to authenticate'); // Throw the error for proper handling in components
  }
};

export const makeRequest = async (url, method, data) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to make request'); // Throw the error for proper handling in components
  }
}

export const createXML = async (formData) => {
  const url = CREATION + '/v2/api/invoice/create';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    // Parse the response body as text
    return  await response.text();
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to make request'); // Throw the error for proper handling in components
  }
}

export const xmlFromCSV = async (csvFile) => {
  const url = CREATION + '/v1/api/invoice/csv/create';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: csvFile.toString()
    });

    // Parse the response body as text
    return  await response.text();
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to make request'); // Throw the error for proper handling in components
  }
}
