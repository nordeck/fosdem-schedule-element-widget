import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    logo: string;
    name: string;
    primaryColor: string;
    textColor: string;
    widgetBackground: string;
  }
}
