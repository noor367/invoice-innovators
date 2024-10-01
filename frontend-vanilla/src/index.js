import { handleLogin, handleRegister, handleLogout } from './auth.js';
import { handleDashboard, handleUserProfile } from './dashboard.js';
import { hideError } from './helpers.js';
import { handleUpload } from './upload.js';

const token = localStorage.getItem('token');
let loggedIn = token;

// vairables
const home = document.getElementById('landing-page');
const uploadPage = document.getElementById('upload-page');
const viewPage = document.getElementById('view-page');
const createPage = document.getElementById('create-page');

// Show Dashboard
if (loggedIn) {
  handleDashboard();
} else {
  document.getElementById('auth').style.display = 'block';
}

// Close error button event listener
document.getElementById('close-error-btn').addEventListener('click', hideError);

// Login
document.getElementById('login-btn').addEventListener('click', (e) => {
  e.preventDefault();
  loggedIn = handleLogin();
});

// Register
document.getElementById('register-btn').addEventListener('click', (e) => {
  e.preventDefault();
  loggedIn = handleRegister();
});

// Logout
document.getElementById('logout-btn').addEventListener('click', (e) => {
  loggedIn = handleLogout();
});

// Home
document.getElementById('home-btn').addEventListener('click', () => {
  home.style.display = 'block';
  createPage.style.display = 'none';
  viewPage.style.display = 'none';
  uploadPage.style.display = 'none';
})

// Create via GUI
document.getElementById('create-btn').addEventListener('click', () => {
  createPage.style.display = 'block';
  home.style.display = 'none';
});

// Upload file
document.getElementById('upload-btn').addEventListener('click', () => {
  uploadPage.style.display = 'block';
  home.style.display = 'none';
});

document.getElementById('upload-submit').addEventListener('click', async () => {
  const response = await handleUpload();
  if (response.invoiceLink) {
    showLinkPopup(response.invoiceLink);
  }
})

// View invoices
document.getElementById('view-btn').addEventListener('click', () => {
  viewPage.style.display = 'block';
  home.style.display = 'none';
});

// View profile
document.getElementById('profile-btn').addEventListener('click', handleUserProfile);

document.getElementById('cpy-link').addEventListener('click', () => {
  const inputBox = document.getElementById('invoice-link');
  inputBox.select();
  inputBox.setSelectionRange(0, 99999); 
  navigator.clipboard.writeText(inputBox.value);
})
// Function to show the link popup
function showLinkPopup(link) {
  const inputBox = document.getElementById('invoice-link');
  inputBox.value = link;
  $('#render-modal').modal('show'); // Show the modal popup
}