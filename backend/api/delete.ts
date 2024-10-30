import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';

export function deleteInvoice(inId: number) {
  const data = getData();
  const index = data.invoices.findIndex(invoice => invoice.inId === inId);
  if (index >= 0) {
    data.invoices.splice(index, 1);
    setData(data);
    return 200;
  } else {
    throw HTTPError(404, 'InvoiceId not found');
  }
  // For after Sprint 2, implement token/user checking for authentication/authorisation
}
