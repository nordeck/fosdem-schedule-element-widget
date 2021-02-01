import { DefaultTheme } from 'styled-components';
import environment from './environment';

/**
 * This config will contain all light theme specific colors and properties.
 * * Change styled.d.ts to add additional properties.
 */
const lightTheme: DefaultTheme = {
  background: '#fff',
  logo: 'logo_light.svg',
  name: 'light',
  primaryColor: environment.REACT_APP_PRIMARY_COLOR || '#0dbd8b',
  textColor: '#000',
  widgetBackground: '#f2f5f8'
};

export default lightTheme;
