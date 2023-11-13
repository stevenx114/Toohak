import {
  requestNonExistentRoute
} from './wrapper';
import HTTPError from 'http-errors';

test('Success test for error 404', () => {
  expect(() => requestNonExistentRoute()).toThrow(HTTPError[404]);
});
