import { DefaultTheme } from 'styled-components';
import environment from './environment';

/**
 * This config will contain all dark theme specific colors and properties.
 * * Change styled.d.ts to add additional properties.
 */
const darkTheme: DefaultTheme = {
  background: '#15191e',
  logo: 'logo_dark.svg',
  name: 'dark',
  primaryColor: environment.REACT_APP_PRIMARY_COLOR || '#0dbd8b',
  textColor: '#fff',
  widgetBackground: '#20252b'
};

export default darkTheme;
