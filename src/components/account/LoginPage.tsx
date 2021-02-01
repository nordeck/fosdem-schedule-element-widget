import React from 'react';
import { useLocalStorage } from 'react-use';
import { Grid } from 'semantic-ui-react';
import { LOCAL_STORAGE__MX_USER } from '../../common/constants';
import { LoginResponse } from '../../common/synapseTypes';
import Login from './Login';
import Logout from './Logout';

const LoginPage = () => {
  const [userAccount, setUserAccount, removeUserAccount] = useLocalStorage<LoginResponse | null>(LOCAL_STORAGE__MX_USER, null);
  const onLoggedIn = (user: LoginResponse) => {
    setUserAccount(user);
  };
  const onLoggedOut = () => {
    removeUserAccount();
  };
  return (
    <Grid
      centered
      padded
      verticalAlign="middle"
    >
      <Grid.Row>
        <Grid.Column textAlign="center">
          {userAccount ?
            <Logout
              onLoggedOut={onLoggedOut}
              user={userAccount}
            /> :
            <Login onLoggedIn={onLoggedIn} />
          }
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default LoginPage;
