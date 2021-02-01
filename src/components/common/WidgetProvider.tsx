import { IOpenIDCredentials, WidgetApi } from 'matrix-widget-api';
import * as qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { ElementWidgetCapabilities } from '../../common/constants';

/**
 * An extended version of the Matrix Widget API.
 */
interface ExtendedWidgetApi extends WidgetApi {
  /**
   * Allows to close modal as if the user dismisses it using the Element UI.
   */
  exitModalWidget: () => Promise<void>;
}

interface WidgetContextProps {
  /**
   * The instance of the widget API.
   */
  widgetApi: ExtendedWidgetApi;
  /**
   * The ID of the widget.
   */
  widgetId: string | undefined;
  /**
   * The room of the widget.
   */
  roomId: string | undefined;
  /**
   * The creator of the widget.
   */
  creator: string | undefined;
  /**
   * The origin of the matrix client.
   */
  parentOrigin: string | undefined;
  /**
   * Indicates if the widget API is initializing.
   */
  isInitializing: Boolean;
  /**
   * Indicates if the widget API is ready to be used.
   */
  isReady: Boolean;
  /**
   * Gets the current OpenID Connect token that can be used server side with the Federation API.
   */
  getOpenIdToken: () => Promise<IOpenIdToken | undefined>;
};

export interface IOpenIdToken extends IOpenIDCredentials {
  expirationDate: Date
}

const widgetQuery = qs.parse(window.location.hash.substring(1));
const query = Object.assign({}, qs.parse(window.location.search.substring(1)), widgetQuery);
const qsParam = (name: string): string | undefined => {
  return query[name] as string;
};

const parentUrl = qsParam('parentUrl');
const parentOrigin = parentUrl && new URL(parentUrl).origin;
const widgetId = qsParam('widgetId');
const widgetApi = new WidgetApi(widgetId, parentOrigin) as ExtendedWidgetApi;

widgetApi.exitModalWidget = () => widgetApi.closeModalWidget({ 'm.exited': true });

const mainWidgetId = widgetId && decodeURIComponent(widgetId).replace(/^modal_/, '');
const roomId = mainWidgetId && mainWidgetId.indexOf('_') ? mainWidgetId.split('_')[0] : undefined;
const creator = mainWidgetId && (mainWidgetId.match(/_/g) || []).length > 1 ? mainWidgetId.split('_')[1] : undefined;

let openIdToken: IOpenIdToken | undefined = undefined;
const getOpenIdToken = async () => {
  try {
    const timeoutDate = new Date();
    timeoutDate.setSeconds(timeoutDate.getSeconds() - 30);
    if (!openIdToken || openIdToken.expirationDate < timeoutDate) {
      const token = await widgetApi.requestOpenIDConnectToken() as IOpenIdToken;
      token.expirationDate = new Date();
      token.expirationDate.setSeconds(token.expirationDate.getSeconds() + (token.expires_in || 0));
      openIdToken = token;
    }
  } catch (err) {
    console.warn('Unable to retrieve OpenId Connect token from Matrix Widget API.', err);
    openIdToken = undefined;
  }
  return openIdToken;
};

const widgetContextDefault: WidgetContextProps = {
  creator,
  getOpenIdToken,
  isInitializing: true,
  isReady: false,
  parentOrigin,
  roomId,
  widgetApi,
  widgetId: mainWidgetId
};

const WidgetContext = React.createContext<WidgetContextProps>(widgetContextDefault);

/**
 * A hook to access the Matrix Widget API
 */
export const useWidget = () => {
  const context = React.useContext(WidgetContext);

  if (context === undefined) {
    throw new Error('useWidget must be used within a WidgetProvider');
  }
  return context;
};

/**
 *  A react component that provides access to the Matrix Widget API
 */
export const WidgetConsumer = ({ children }: { children: (widget: WidgetContextProps) => React.ReactNode }) => {
  return (
    <WidgetContext.Consumer>
      {(context) => {
        if (context === undefined) {
          throw new Error('WidgetConsumer must be used within a WidgetProvider');
        }
        return children(context);
      }}
    </WidgetContext.Consumer>
  );
};

/**
 * Makes the Matrix Widget API available to the component hierarchy below.
 */
function WidgetProvider({ children }: React.PropsWithChildren<{}>) {
  const [widgetApiState, setWidgetApiState] = useState(widgetContextDefault);
  useEffect(() => {
    const onReady = () => {
      console.info(`Matrix Widget API is now connected to ${parentOrigin}`);

      setWidgetApiState((w) => ({
        ...w,
        isInitializing: false,
        isReady: true
      }));
    };
    widgetApi.on('ready', onReady);

    if (widgetId) {
      setWidgetApiState((w) => ({
        ...w,
        isInitializing: true
      }));
      try {
        widgetApi.requestCapability(ElementWidgetCapabilities.CanChangeViewedRoom);
        widgetApi.start();
      } catch (err) {
        console.error('Unable to initialize Matrix Widget API', err);
      }
    } else {
      console.info('Widget is used outside of Matrix. Matrix Widget API is not available.');
      setWidgetApiState((w) => ({
        ...w,
        isInitializing: false
      }));
    }
    return () => {
      widgetApi.off('ready', onReady);
      widgetApi.removeAllListeners();
    };
  }, []);

  return (
    <WidgetContext.Provider value={widgetApiState}>
      {children}
    </WidgetContext.Provider>
  );
}

export default WidgetProvider;
