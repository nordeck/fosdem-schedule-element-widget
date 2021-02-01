import React, { useEffect, useState } from 'react';
import PageLoader from './PageLoader';

interface ThemeSelectorProps {
  theme: string;
}

const ThemeSelector: React.FunctionComponent<ThemeSelectorProps> = ({ children, theme }) => {
  const [loaded, setLoaded] = useState(false);
  const [styles, setStyles] = useState<any>();
  useEffect(() => {
    const module = (theme === 'dark') ?
      import(/* webpackChunkName: "dark-theme" */ 'semantic-ui-less/semantic.less?theme=dark') :
      import(/* webpackChunkName: "light-theme" */ 'semantic-ui-less/semantic.less?theme=light');
    module.then((styles) => {
      setStyles(styles);
      return styles;
    }).catch((err) => {
      console.warn(err);
      return null;
    });
  }, [theme]);

  useEffect(() => {
    if (styles && styles.use) {
      styles.use();
      setLoaded(true);
      return () => {
        styles.unuse();
        setLoaded(false);
      };
    }
  }, [styles]);
  return (
    loaded ?
      <>
        {children}
      </> :
      <PageLoader />
  );
};

export default ThemeSelector;
