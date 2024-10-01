async function makeRequest(url, method, data) {
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
  }
}

// Function to show the error popup with a message
function showError(message) {
  const errorPopup = document.getElementById('error-popup');
  const errorMessage = document.getElementById('error-message');
  
  // Set the error message
  errorMessage.innerText = message;
  
  // Show the error popup
  errorPopup.style.display = 'block';
}

// Function to hide the error popup
function hideError() {
  const errorPopup = document.getElementById('error-popup');
  errorPopup.style.display = 'none';
}

export { makeRequest, showError, hideError }