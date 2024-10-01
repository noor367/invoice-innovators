import { RENDERING } from './config.js';
import { showError } from './helpers.js';

async function authRequest(url, method, data) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      // Handle non-200 HTTP responses
      throw new Error('HTTP error ' + response.status);
    }
    
    return await response.json();
  } catch (error) {
    // Handle fetch errors
    showError('An error occurred during the authentication request.');
    console.error('Error in authRequest:', error);
    throw error; // Rethrow the error for the caller to handle
  }
}


export async function handleLogin() {
  try {
    const url = RENDERING + '/innovators/auth/login';
    const email = document.getElementById('login-email').value;
    const data = {
      email: email,
      password: document.getElementById('login-password').value
    };
    const response = await authRequest(url, 'POST', data);
    localStorage.setItem('token', response.token);
    localStorage.setItem('uId', response.uId);
    localStorage.setItem('email', email);
    login();
    return true;
  } catch (error) {
    showError('Invalid input');
    console.error('Error in login:', error);
    return false;
  }
}

export async function handleRegister() {
  try {
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('confirm-password').value;
    const email = document.getElementById('register-email').value;

    // Check if passwords match
    if (password !== confirm) {
      showError('Passwords do not match!');
      return false;
    }

    const url = RENDERING + '/innovators/auth/register';
    const data = {
      nameFirst: document.getElementById('register-fname').value,
      nameLast: document.getElementById('register-lname').value,
      email: email,
      password: password
    };

    const response = await authRequest(url, 'POST', data);

    // Check if the response is successful
    if (response && response.token && response.uId) {
      // Registration successful, store token and user ID
      localStorage.setItem('token', response.token);
      localStorage.setItem('uId', response.uId);
      localStorage.setItem('email', email);
      login();
      return true;
    } else {
      // Registration failed or response is incomplete
      showError('Registration failed. Please try again.');
      return false;
    }
  } catch (error) {
    // Handle fetch errors
    showError('An error occurred during registration.');
    console.error('Error in register:', error);
    return false;
  }
}

function login() {
  document.getElementById('login-form').reset();
  document.getElementById('register-form').reset();
  document.getElementById('auth').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';
  document.getElementById('nav-bar').style.display = 'block';
}

export function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('uId');
  localStorage.removeItem('email');
  document.getElementById('auth').style.display = 'block';
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('nav-bar').style.display = 'none';
  return false;
}