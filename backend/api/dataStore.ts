import { Data } from './interfaces';
import fs from 'fs';

const data: Data = {
  users: [],
  invoices: [],
  xmlFiles: []
};
// Use get() to access the data
function getData(): Data {
  let readData = data;

  try {
    const jsonstr = fs.readFileSync('database.json');
    readData = JSON.parse(String(jsonstr));
  } catch {
    setData(readData);
  }

  return readData;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: Data): void {
  fs.writeFileSync('database.json', JSON.stringify(newData, null, 2));
}

function clear() {
  const dataTwo: Data = {
    users: [],
    invoices: [],
    xmlFiles: []
  };
  setData(dataTwo);
}

export { getData, setData, clear };
