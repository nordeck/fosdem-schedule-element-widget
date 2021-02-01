import React from 'react';
import { useLocalStorage as useLS } from 'react-use';
import { Grid, Loader } from 'semantic-ui-react';
import { LOCAL_STORAGE__MX_USER } from '../../common/constants';
import { LoginResponse } from '../../common/synapseTypes';
import Login from '../account/Login';
import { useWidget } from './WidgetProvider';

type Return<T> = [T, React.Dispatch<React.SetStateAction<T>>, () => void];

// TODO: Remove when https://github.com/streamich/react-use/pull/1438 (hopefully) gets released
function useLocalStorage<T>(key: string, initialValue: T): Return<T> {
  return useLS<T>(key, initialValue) as Return<T>;
}

const defaultLoginContext: LoginResponse = {
  access_token: undefined,
  device_id: undefined,
  home_server: undefined,
  user_id: undefined,
  well_known: undefined
};

const LoginContext = React.createContext<LoginResponse>(defaultLoginContext);

/**
 * A hook to access the current user login
 */
export const useLogin = () => {
  const context = React.useContext(LoginContext);

  if (context === undefined) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};

/**
 *  A react component that provides access to the current user login
 */
export const LoginConsumer = ({ children }: { children: (login: LoginResponse | {}) => React.ReactNode }) => {
  return (
    <LoginContext.Consumer>
      {(context) => {
        if (context === undefined) {
          throw new Error('LoginConsumer must be used within a LoginProvider');
        }
        return children(context);
      }}
    </LoginContext.Consumer>
  );
};

/**
 * Makes the current user login available to the component hierarchy below.
 */
function LoginProvider({ children }: React.PropsWithChildren<{}>) {
  const widget = useWidget();
  const [userAccount, setUserAccount] = useLocalStorage<LoginResponse>(LOCAL_STORAGE__MX_USER, defaultLoginContext);
  const onLoggedIn = (user: LoginResponse) => {
    setUserAccount(user);
  };
  return (
    <LoginContext.Provider value={userAccount}>
      {widget.isInitializing ?
        <Loader /> :
        (
          widget.isReady || userAccount.access_token ?
            children :
            <Grid
              centered
              padded
              verticalAlign="middle"
            >
              <Grid.Row>
                <Grid.Column textAlign="center">
                  <Login onLoggedIn={onLoggedIn} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
        )
      }
    </LoginContext.Provider>
  );
}

export default LoginProvider;
