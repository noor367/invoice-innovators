import { makeRequest, showError } from './helpers.js';
import { RENDERING } from './config.js';

export function handleDashboard() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';
  document.getElementById('landing-page').style.display = 'block';
  document.getElementById('upload-page').style.display = 'none';
  document.getElementById('view-page').style.display = 'none'
  document.getElementById('create-page').style.display = 'none';
  document.getElementById('nav-bar').style.display = 'block';
}

export function handleUserProfile(uId) {
  const detailsBox = document.getElementById('display-profile');
  while (detailsBox.firstChild) {
    detailsBox.removeChild(detailsBox.firstChild);
  }
  const userId = document.createElement('p');
  userId.innerText = 'User Id: ' + localStorage.getItem('uId');
  const email = document.createElement('p');
  email.innerText = 'Email: ' + localStorage.getItem('email');
  detailsBox.appendChild(userId);
  detailsBox.appendChild(email);
}