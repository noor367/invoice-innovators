import { setData, getData } from './dataStore';
import { User, Data } from './interfaces';
import crypto from 'crypto';
import { generateToken, getUserByEmail, getUserByToken } from './utils/helper';
import validator from 'validator';

import HTTPError from 'http-errors';

// Secret key for hasing function
const GLOBAL_SECRET_KEY = 'innovt';

/**
 * @param {string} email - The user's email for authentication.
 * @param {string} password - The user's password for authentication.
 * @returns {object} - An object with a boolean property 'auth' indicating the authentication status.
 * @throws { HTTPError } - error
 */
function authLogin(email: string, password: string): { token: string, uId: number } {
  const user: User = getUserByEmail(email);
  if (!user) {
    throw HTTPError(400, 'Invalid email');
  }

  if (user.password !== hashPassword(password)) {
    throw HTTPError(400, 'Invalid password');
  }

  const token = generateToken();
  const hashedToken = generateHash(token);

  const data: Data = getData();
  const userIndex: number = data.users.findIndex(u => u.email === email);
  data.users[userIndex].token.push(hashedToken);

  setData(data);

  return { token: token, uId: user.uId };
}

/**
 * Given a user's first and last name, email address, and password,
 * creates a new account for user.
 *
 * 400 Error when any of
 * - `email` entered is not a valid email
 * - `email` address is already being used by another user
 * - `length` of password is less than 6 characters
 * - `length` of nameLast is not between 1 and 50 characters inclusive
 * @param { string } email
 * @param { string } password
 * @param { string } nameFirst
 * @param { string } nameLast
 *
 * @returns {{ token: string, authUserId: number }} - no error
 * @throws { HTTPError } - error
 */
function authRegister(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string
): {token: string, uId: number } {
  const data: Data = getData();

  // Valdating all the information
  validateEmail(email, data);
  validateName(nameFirst);
  validateName(nameLast);
  validatePassword(password);

  const id = data.users.length + 1;
  const token = generateToken();
  const hashedToken = generateHash(token);

  const newUser: User = {
    uId: id,
    email: email,
    password: hashPassword(password),
    nameFirst: nameFirst,
    nameLast: nameLast,
    token: [hashedToken],
    invoiceData: [],
    invoiceIdList: [],
  };

  data.users.push(newUser);
  setData(data);

  return { token: token, uId: id };
}

/**
 * Given an active token, invalidates the token to log the user out.
 *
 * 403 Error when any of:
 *  - token is invalid
 *
 * @param { number } token
 *
 * @returns {{}} - no error
 * @throws { HTTPError } - error
 */
function authLogout(token: string): Record<string, never> {
  const user: User = getUserByToken(token);
  if (!user) {
    throw HTTPError(403, 'Invalid token');
  }

  const data: Data = getData();
  const userIndex: number = data.users.findIndex(u => u.email === user.email);
  const tokenIndex: number = user.token.indexOf(token);
  data.users[userIndex].token.splice(tokenIndex, 1);
  setData(data);

  return {};
}

// ========================================================================= //

// Helper function for Auth
function generateHash(information: string) {
  information = information + GLOBAL_SECRET_KEY;
  const hash = crypto.createHash('sha512').update(information).digest('hex');
  return hash;
}

function hashPassword(password: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(GLOBAL_SECRET_KEY + password);
  return hash.digest('hex');
}

/**
 * Validate email.
 * And checking if email address is already being used by another user
 *
 * @param { string } email
 *
 */
function validateEmail(email: string, data: Data): void {
  // Make sure the input is a valid email
  if (!validator.isEmail(email)) {
    throw HTTPError(400, 'Invalid email');
  }

  for (const user of data.users) {
    if (user.email === email) {
      throw HTTPError(400, 'Email have been used');
    }
  }
}

/**
 * Validate name.
 * Make sure the length of name is between 1 and 50 characters inclusive.
 *
 * @param { string } name
 *
 */
function validateName(name: string): void {
  if (name.length < 1 || name.length > 50) {
    throw HTTPError(400, 'invalid name length < 1 or > 50');
  }
}

/**
 * Validate password.
 * Make sure the password meeting the standart to ensure the security
 *
 * @param { string } password
 *
 */
function validatePassword(password: string): void {
  if (password.length < 6) {
    throw HTTPError(400, 'invalid password length < 6');
  }
}

export {
  authLogin,
  authRegister,
  authLogout,
  generateHash,
};
