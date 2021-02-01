import React from 'react';
import { useTheme } from 'styled-components';
import ThemeSelector from './ThemeSelector';


const SemanticUiTheme: React.FunctionComponent<{}> = ({ children }) => {
  const theme = useTheme();
  return (
    <ThemeSelector
      children={children}
      theme={theme.name}
    />
  );
};

export default SemanticUiTheme;
