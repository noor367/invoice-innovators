import { authRegisterReq, authLoginReq, authLogoutReq } from '../utils/testHelper';
import { clear } from '../dataStore';

const USER = { token: expect.any(String), uId: expect.any(Number) };

afterAll(() => {
  clear();
});

describe('/innovators/auth/register test cases:', () => {
  describe('success', () => {
    test('Success Register', () => {
      const data = authRegisterReq('j@gmail.com', '123456', 'John', 'Smith');
      expect(data).toStrictEqual(USER);
    });
  });

  describe('error', () => {
    test('Invalid email', () => {
      expect(authRegisterReq('hgmail.com', '123456', 'John', 'Smith')).toEqual(400);
    });

    test('Email is already used', () => {
      expect(authRegisterReq('j@gmail.com', '123456', 'John', 'Smith')).toEqual(400);
    });

    test('Invalid password', () => {
      expect(
        authRegisterReq('j2@gmail.com', '12345', 'John', 'Smith')
      ).toStrictEqual(400);
    });

    test('Invalid name length', () => {
      expect(authRegisterReq('j2@gmail.com', '123456', '', 'Smith')).toStrictEqual(400);
    });

    test('Invalid email', () => {
      expect(
        authRegisterReq('hgmail.com', '123456', 'John', 'Smith')
      ).toStrictEqual(400);
    });
  });
});

describe('/innovators/auth/login test cases:', () => {
  describe('success', () => {
    test('Success Login', () => {
      const data = authLoginReq('j@gmail.com', '123456');
      expect(data).toStrictEqual(USER);
    });
  });

  describe('error', () => {
    test('Invalid email', () => {
      expect(authLoginReq('hgmail.com', '123456')).toStrictEqual(400);
    });

    test('Unregisterd email', () => {
      expect(authLoginReq('h2@gmail.com', '123456')).toStrictEqual(400);
    });

    test('Invalid password', () => {
      expect(authLoginReq('j@gmail.com', '1234567')).toStrictEqual(400);
    });
  });
});

describe('/innovators/auth/logout test cases:', () => {
  const token1 = authRegisterReq('h3@gmail.com', '123456', 'John3', 'Smith');
  const token2 = authLoginReq('h3@gmail.com', '123456');

  describe('error', () => {
    test('Invalid token', () => {
      expect(authLogoutReq('-234234')).toStrictEqual(403);
    });
  });

  describe('success', () => {
    test('Success Logout with token2', () => {
      const data = authLogoutReq(token2.token);
      expect(data).toStrictEqual({});
    });

    test('Success Logout with token 1', () => {
      const data = authLogoutReq(token1.token);
      expect(data).toStrictEqual({});
    });

    test('Logout 1 more time', () => {
      const data = authLogoutReq(token2.token);
      clear();
      expect(data).toStrictEqual(403);
    });
  });
});
