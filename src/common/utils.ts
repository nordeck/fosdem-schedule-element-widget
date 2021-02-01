const DEFAULT_THEME = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';

interface Location {
  search: string;
}

export const getTheme = (location: Location = window.location) => {
  const urlParams = new URLSearchParams(location.search);
  const theme = urlParams.get('theme');
  const widgetId = urlParams.get('widgetId') || '';
  const currentTheme = theme || window.localStorage.getItem(`${widgetId}_theme`) || DEFAULT_THEME;
  window.localStorage.setItem(`${widgetId}_theme`, currentTheme);
  return currentTheme;
};
export const switchTheme = (location: Location = window.location) => {
  const urlParams = new URLSearchParams(location.search);
  const widgetId = urlParams.get('widgetId') || '';
  const theme = urlParams.get('theme') || window.localStorage.getItem(`${widgetId}_theme`) || DEFAULT_THEME;
  if (theme === 'light') {
    urlParams.set('theme', 'dark');
  } else {
    urlParams.set('theme', 'light');
  }
  return urlParams.toString();
};
