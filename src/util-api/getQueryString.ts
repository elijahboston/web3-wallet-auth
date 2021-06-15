/**
 * If the query argument if an array this returns the first item
 * @param query The property from request.query
 * @returns Either the query string or the first item from the query string array
 */
export const getQueryString = (query?: string | string[]) =>
  Array.isArray(query) ? query[0] : query;
