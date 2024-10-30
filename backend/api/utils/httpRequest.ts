import request from 'sync-request-curl';
import HTTPError from 'http-errors';

const port = process.env.PORT || 3000; // must match port
const url = 'http://localhost';
const SERVER_URL = `${url}:${port}`;
type Method = 'GET' | 'PUT' | 'POST' | 'DELETE';

/**
 * Sends a request to the given pathway and returns the results
 * @param { Method } method - Chosen method of communicating with server.
 * @param { string } pathway - Chosen route of server
 * @param {object} data - data to be sent to server
 * @returns {object} - the return string and the status code of request
 */
// export const httpRequest = (method: Method, pathway: string, data: object) => {
//   let optionObj: object;
//   if (method === 'GET' || method === 'DELETE') {
//     optionObj = { qs: data };
//   } else {
//     optionObj = { json: data };
//   }
//   const res = request(method, SERVER_URL + pathway, optionObj);

//   const responseBody = JSON.parse(res.body.toString());

//   const errorMessage = `[${res.statusCode}]` + responseBody?.error || responseBody || 'No message specified';

//   switch (res.statusCode) {
//     case 400:
//       throw HTTPError(res.statusCode, errorMessage);
//     case 401:
//       throw HTTPError(res.statusCode, errorMessage);
//     case 403:
//       throw HTTPError(res.statusCode, errorMessage);
//     default:
//   }
//   return responseBody;
// };

export const httpRequestRequest = (method: Method, pathway: string, data: object) => {
  let optionObj: object;
  if (method === 'DELETE') {
    optionObj = { qa: data };
  } else {
    optionObj = { json: data };
  }
  const res = request(method, SERVER_URL + pathway, optionObj);

  const responseBody = JSON.parse(res.body.toString());

  const errorMessage = `[${res.statusCode}]` + responseBody?.error || responseBody || 'No message specified';

  switch (res.statusCode) {
    case 400:
      throw HTTPError(res.statusCode, errorMessage);
    case 401:
      throw HTTPError(res.statusCode, errorMessage);
    case 403:
      throw HTTPError(res.statusCode, errorMessage);
    default:
  }
  return responseBody;
};
