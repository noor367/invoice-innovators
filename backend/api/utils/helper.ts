import { getData } from '../dataStore';
import { User } from '../interfaces';

// ========================================================================= //

// User

/**
 * Helper function for finding user object by a corresponding token.
 *
 * @param { string } token
 *
 * @returns {{ User }}
 */
export function getUserByToken(token: string): User {
  const data = getData();
  let userData;
  for (const user of data.users) {
    for (const isToken of user.token) {
      if (isToken === token) {
        userData = user;
      }
    }
  }
  return userData;
}

/**
 * Helper function for finding user object by a corresponding Id.
 *
 * @param { number } authUserId
 *
 * @returns {{ User }} - user found in data.users
 * @returns {{ undefined }} - user not found
 */
export function getUserbyId(authUserId: number): User {
  const data = getData();
  return data.users.find((u) => u.uId === authUserId);
}

/**
 * Helper function for finding user object by a corresponding email.
 *
 * @param { string } email
 *
 * @returns {{ User }} - user found in data.users
 * @returns {{ undefined }} - user not found
 */
export function getUserByEmail(email: string): User {
  const data = getData();
  return data.users.find((u) => u.email === email);
}

/**
 * Helper function for validating file type
 *
 * @param { string } inputType
 * @param { string[] } validType
 *
 * @returns { boolean }
 */
export function checkValidType(inputType: string, validType: string[]) {
  const typeValidation = (type: string) => type.toLowerCase() === inputType.toLowerCase();
  return validType.some(typeValidation);
}

// ========================================================================= //

// Auth

/**
 * Helper function to generate a random token for an authorised user
 *
 * @param {{}}
 *
 * @returns {{ tokenStr: string }}
 */
export function generateToken(): string {
  const token = Math.floor(Math.random() * 10000000);
  const tokenStr = token.toString();
  return tokenStr;
}
