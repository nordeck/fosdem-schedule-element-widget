
const urlForColor = (color: string, name: string): string => {
  const size = 30;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  // bail out when using jsdom in unit tests
  if (!ctx) {
    return '';
  }
  ctx.font = '21px Lato';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'white';
  const userLetter = getInitialLetter(name);
  const text = ctx.measureText(userLetter);
  ctx.fillText(userLetter, 15 - (text.width / 2), 22);
  return canvas.toDataURL();
};

const getInitialLetter = (name: string): string => {
  if (name.length < 1) {
    return '';
  }

  let idx = 0;
  const initial = name[0];
  if ((initial === '@' || initial === '#' || initial === '+') && name[1]) {
    idx++;
  }

  // string.codePointAt(0) would do this, but that isn't supported by
  // some browsers (notably PhantomJS).
  let chars = 1;
  const first = name.charCodeAt(idx);

  // check if it’s the start of a surrogate pair
  if (first >= 0xd800 && first <= 0xdbff && name[idx + 1]) {
    const second = name.charCodeAt(idx + 1);
    if (second >= 0xdc00 && second <= 0xdfff) {
      chars++;
    }
  }

  const firstChar = name.substring(idx, idx + chars);
  return firstChar.toUpperCase();
};

const colorToDataURLCache = new Map<string, string>();

const defaultAvatarUrlForString = (name: string, userName: string): string => {
  if (!name || !userName) return '';
  const defaultColors = ['#0DBD8B', '#368bd6', '#ac3ba8'];
  let total = 0;
  for (let i = 0; i < userName.length; ++i) {
    total += userName.charCodeAt(i);
  }
  const colorIndex = total % defaultColors.length;
  const color = defaultColors[colorIndex];
  let dataUrl = colorToDataURLCache.get(userName);
  if (!dataUrl) {
    dataUrl = urlForColor(color, name);
    colorToDataURLCache.set(userName, dataUrl);
  }
  return dataUrl;
};

export default defaultAvatarUrlForString;
