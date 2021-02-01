import React, { Suspense, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createGlobalStyle, DefaultTheme, ThemeProvider } from 'styled-components';
import App from './App';
import darkTheme from './common/darkTheme';
import lightTheme from './common/lightTheme';
import { getTheme } from './common/utils';
import PageLoader from './components/common/PageLoader';
import SemanticUiTheme from './components/common/SemanticUiTheme';
import WidgetProvider from './components/common/WidgetProvider';
import { store } from './store';


interface IGlobalStyleProps {
  theme: DefaultTheme;
  widgetBackground: boolean;
}

const getBackgroundColor = ({ widgetBackground, theme }: IGlobalStyleProps) => widgetBackground ? theme.widgetBackground : theme.background;

const GlobalStyle = createGlobalStyle<IGlobalStyleProps>`
  html, body {
    height: auto !important;
    background: ${getBackgroundColor} !important;
  }
  html {
    height: 100% !important;
    overflow-x: hidden !important;
  }
  body {
    min-height: 100% !important;
  }
  span.suicr-content-item {
    white-space: nowrap;
    margin: -4px;
    display: block;
  }
  #root {
    display: inline;
  }
  .ui.placeholder, .ui.placeholder > :before, .ui.placeholder .image.header:after, .ui.placeholder .line, .ui.placeholder .line:after {
    background-color: ${getBackgroundColor};
  }

  input[type=search]::-webkit-search-cancel-button {
    appearance: none !important;
    height: 14px;
    width: 14px;
    display: block;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAn0lEQVR42u3UMQrDMBBEUZ9WfQqDmm22EaTyjRMHAlM5K+Y7lb0wnUZPIKHlnutOa+25Z4D++MRBX98MD1V/trSppLKHqj9TTBWKcoUqffbUcbBBEhTjBOV4ja4l4OIAZThEOV6jHO8ARXD+gPPvKMABinGOrnu6gTNUawrcQKNCAQ7QeTxORzle3+sDfjJpPCqhJh7GixZq4rHcc9l5A9qZ+WeBhgEuAAAAAElFTkSuQmCC);
    background-repeat: no-repeat;
    background-size: 14px;
    cursor: pointer;
  }

  input[type=search]::-moz-search-clear-button {
    appearance: none !important;
    display: block;
    cursor: pointer;
    width: 14px;
    height: 14px;
    max-height: 14px;
    align-self: center;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAn0lEQVR42u3UMQrDMBBEUZ9WfQqDmm22EaTyjRMHAlM5K+Y7lb0wnUZPIKHlnutOa+25Z4D++MRBX98MD1V/trSppLKHqj9TTBWKcoUqffbUcbBBEhTjBOV4ja4l4OIAZThEOV6jHO8ARXD+gPPvKMABinGOrnu6gTNUawrcQKNCAQ7QeTxORzle3+sDfjJpPCqhJh7GixZq4rHcc9l5A9qZ+WeBhgEuAAAAAElFTkSuQmCC);
    background-repeat: no-repeat;
    background-size: 14px;
  }
`;

const widgetBackground = !!/[?&]widgetId=(?!modal_)/.exec(window.location.search);

function AppContainer() {
  const location = useLocation();
  const currentTheme = getTheme();
  const [theme, setTheme] = useState(currentTheme);
  useEffect(() => {
    const newTheme = getTheme(location);
    if (newTheme !== theme) {
      setTheme(newTheme);
    }
  }, [location, theme]);
  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <GlobalStyle widgetBackground={widgetBackground} />
      <Suspense fallback={<PageLoader />}>
        <WidgetProvider>
          <SemanticUiTheme>
            <Provider store={store}>
              <App />
            </Provider>
          </SemanticUiTheme>
        </WidgetProvider>
      </Suspense>
    </ThemeProvider>
  );
}

export default AppContainer;
