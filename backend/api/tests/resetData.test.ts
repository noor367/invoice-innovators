import { clear } from '../dataStore';
import { deleteAllFilesInDirectory } from '../utils/testHelper';

afterAll(() => {
  deleteAllFilesInDirectory('invoiceHTML', 'html');
  deleteAllFilesInDirectory('invoicePDF', 'pdf');
  deleteAllFilesInDirectory('invoiceJSON', 'json');
  deleteAllFilesInDirectory('invoiceImage', 'png');
  clear();
});

describe('This test file is only for reseting data to its initial state:', () => {
  test('Reset Test', () => {
    expect(1 + 1).toStrictEqual(2);
  });
});
