import { requestStatus } from '../utils/testHelper';

describe('statusCheck', () => {
  test('GET: should return 200 and a success message', () => {
    const response = requestStatus();
    expect(response.message).toBe('Server is online and running');
  });
});
