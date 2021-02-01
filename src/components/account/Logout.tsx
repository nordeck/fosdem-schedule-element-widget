import React, { useCallback, useState } from 'react';
import { Button, Header, Icon, Message } from 'semantic-ui-react';
import environment from '../../common/environment';
import { LoginResponse } from '../../common/synapseTypes';
import CenteredSegment from '../common/CenteredSegment';

export interface LoginProps {
  user: LoginResponse;
  onLoggedOut: () => void;
}

const SynapseBaseUrl = environment.REACT_APP_HOME_SERVER_URL || 'https://matrix.org';

const Logout = ({ user, onLoggedOut }: LoginProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logoutCallback = useCallback(
    async (ev: React.MouseEvent<HTMLButtonElement | MouseEvent>) => {
      ev.preventDefault();
      ev.stopPropagation();
      try {
        setIsSubmitting(true);
        const response = await fetch(`${SynapseBaseUrl}/_matrix/client/r0/logout`, {
          body: JSON.stringify({}),
          headers: {
            authorization: `Bearer ${user.access_token}`
          },
          method: 'POST'
        });
        if (response.ok) {
          const result = await response.json() as LoginResponse;
          onLoggedOut();
          setIsSubmitting(false);
          return result;
        } else {
          const error = await response.json();
          throw new Error(error.error);
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
        setIsSubmitting(false);
      }
    },
    [user, onLoggedOut]
  );

  console.log('test');

  return (
    <CenteredSegment
      color="teal"
      compact
      padded
      placeholder
      raised
    >
      <Header
        icon
        size="tiny"
      >
        <Icon name="unlock" />
        {user.user_id}
      </Header>
      <Button
        loading={isSubmitting}
        onClick={(ev) => logoutCallback(ev)}
        primary
        type="submit"
      >
        Sign Out
      </Button>
      {error ?
        <Message
          content={error}
          header="Error"
          negative
        /> :
        null}
    </CenteredSegment>
  );
};

export default Logout;
