import * as Keychain from 'react-native-keychain';

const REFRESH_TOKEN_SERVICE = 'com.neyfuel.customer.refresh-token';
const REFRESH_TOKEN_USERNAME = 'refresh-token';

export async function saveRefreshToken(refreshToken: string) {
  const result = await Keychain.setGenericPassword(
    REFRESH_TOKEN_USERNAME,
    refreshToken,
    {service: REFRESH_TOKEN_SERVICE},
  );

  if (!result) {
    throw new Error('Unable to store the refresh token securely.');
  }
}

export async function getRefreshToken() {
  const credentials = await Keychain.getGenericPassword({
    service: REFRESH_TOKEN_SERVICE,
  });

  return credentials ? credentials.password : null;
}

export async function removeRefreshToken() {
  await Keychain.resetGenericPassword({service: REFRESH_TOKEN_SERVICE});
}
