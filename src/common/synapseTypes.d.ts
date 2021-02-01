export type LoginFlowType = 'm.login.password' | 'm.login.password' | 'm.login.recaptcha' | 'm.login.oauth2' | 'm.login.sso' | 'm.login.email.identity' | 'm.login.msisdn' | 'm.login.token' | 'm.login.dummy';

export type LoginFlowInitResponse = {
  'flows': Array<{ 'type': LoginFlowType }>
}

export type LoginResponse = {
  'user_id': string | undefined,
  'access_token': string | undefined,
  'home_server': string | undefined,
  'device_id': string | undefined,
  'well_known': {
    'm.homeserver': {
      'base_url': string
    }
  } | undefined
}
