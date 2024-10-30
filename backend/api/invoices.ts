import { getUserByToken } from './utils/helper';
import HTTPError from 'http-errors';
import { ListReturn, Data } from './interfaces';
import { getData } from './dataStore';

/**
 * Provides an array of all invoices (and their associated
 * details) that the user is owning or having right to view it.
 *
 * Return 403 Error when any of:
 * - `token` is invalid
 *
 * @param { string } token
 *
 * @returns { ListReturn[] } - no error
 */
function invoicesList(token: string): ListReturn[] {
  const user = getUserByToken(token);
  if (!user) {
    throw HTTPError(403, 'Invalid token');
  }

  // Filter invoices where the user's UID is in the validUser array
  const data: Data = getData();
  const invoices = data.invoices.filter((invoice) =>
    invoice.invoiceData.validUser.includes(user.uId)
  );

  const invoicesList: ListReturn[] = invoices.map((invoice) => {
    // Ensure the valid Date type
    if (!(invoice.renderedDate instanceof Date)) {
      invoice.renderedDate = new Date(invoice.renderedDate);
    }

    return {
      inId: invoice.inId,
      inName: invoice.name,
      link: invoice.storedURL,
      renderedDate: invoice.renderedDate.toLocaleDateString(),
    };
  });

  return invoicesList;
}

export { invoicesList };
