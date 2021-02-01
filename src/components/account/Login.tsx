import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Header, Icon, Message } from 'semantic-ui-react';
import environment from '../../common/environment';
import { LoginFlowInitResponse, LoginResponse } from '../../common/synapseTypes';
import CenteredSegment from '../common/CenteredSegment';
export interface LoginProps {
  onLoggedIn: (user: LoginResponse) => void;
}

const SynapseBaseUrl = environment.REACT_APP_HOME_SERVER_URL || 'https://matrix.org';

const Login = ({ onLoggedIn }: LoginProps) => {
  const [flows, setFlows] = useState({} as LoginFlowInitResponse);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${SynapseBaseUrl}/_matrix/client/r0/login`, {
      method: 'GET'
    }).then((response) => {
      return response.json();
    }).then((result: LoginFlowInitResponse) => {
      return setFlows(result);
    }).catch((err) => {
      setError(err.message);
      console.error(err);
    });
  }, []);

  const loginCallback = useCallback(
    async (form) => {
      if (!flows.flows.some((f) => f.type === 'm.login.password')) {
        throw new Error('The homeserver does not support login by username!');
      }
      try {
        setIsSubmitting(true);
        const data = new FormData(form);
        const response = await fetch(`${SynapseBaseUrl}/_matrix/client/r0/login`, {
          body: JSON.stringify({
            'identifier': {
              'type': 'm.id.user',
              'user': data.get('username')
            },
            'initial_device_display_name': window.location.hostname,
            'password': data.get('password'),
            'type': 'm.login.password'
          }),
          method: 'POST'
        });
        if (response.ok) {
          const result = await response.json() as LoginResponse;
          onLoggedIn(result);
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
    [flows, onLoggedIn]
  );

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
        <Icon name="user" />
        Sign in to your Matrix account on
        <br />
        {new URL(SynapseBaseUrl).hostname}
      </Header>

      <Form
        onSubmit={async (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          await loginCallback(ev.target);
        }}
      >
        <Form.Field>
          <label htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            placeholder="Username"
            required
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            placeholder="Password"
            required
            type="password"
          />
        </Form.Field>
        {error ?
          <Message
            content={error}
            header="Error"
            negative
          /> :
          null}
        <Button
          disabled={!flows.flows?.length}
          loading={isSubmitting}
          primary
          type="submit"
        >
          Sign In
        </Button>
      </Form>
    </CenteredSegment>
  );
};

export default Login;
