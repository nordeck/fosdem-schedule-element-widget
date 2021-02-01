const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const engine = require('consolidate');
const chalk = require('chalk');

const PORT = parseInt(process.env.PORT, 10) || 80;
const HOST = process.env.HOST || '0.0.0.0';

const config = {};
// extract environment variables that start with REACT_APP_ to be injected to index.html at runtime
for (const key in process.env) {
  if (key.indexOf('REACT_APP_') === 0) {
    config[key] = process.env[key];
  }
}

// variables to inject to index.html at runtime.
const renderOptions = {
  __ENVIRONMENT__: Buffer.from(JSON.stringify(config)).toString('base64'),
  cache: true
};

const app = express();

app.use(helmet({
  frameguard: false // disable frame guard because the widget has to be displayed in an iframe
}));

app.use(helmet.contentSecurityPolicy({
  directives: {
    connectSrc: ['\'self\'', 'fosdem.org'],
    defaultSrc: ['\'self\''],
    fontSrc: ['\'self\'', 'data:', 'fonts.gstatic.com'],
    imgSrc: ['\'self\'', 'https:', 'data:'],
    scriptSrc: ['\'self\'', '\'unsafe-inline\''],
    styleSrc: ['\'self\'', '\'unsafe-inline\'', 'fonts.googleapis.com']
  }
}));

app.use(compression());

// replace mustache style placeholders in index.html with values provided in renderOptions
app.engine('html', engine.mustache);
app.set('view engine', 'html');
app.set('views', `${__dirname}/build`);

// static files can be safely cached for up to one year because the filename contains a hash
app.use(express.static('build', {
  index: false,
  maxAge: '1y',
  setHeaders: (res, path) => {
    if (['robots.txt', 'favicon.ico', 'logo192.png', 'logo512.png'].some((file) => path.indexOf(file) !== -1)) {
      // cache these files for up to an hour
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    else if (['sw.js', 'workbox-sw', 'asset-manifest.json', 'manifest.json'].some((file) => path.indexOf(file) !== -1) || express.static.mime.lookup(path) === 'text/html') {
      // do not cache these files
      res.setHeader('Cache-Control', 'public, max-age=0');
    }
  }
}));

app.get('*', function (_, res) {
  res.render('index', renderOptions);
});

app.listen(PORT, HOST);
console.log(`Listening on ${chalk.yellowBright(`http://${HOST}:${PORT}`)}`);
console.log(`${chalk.greenBright('Server running...')} press ${chalk.redBright('CTRL+C')} to stop.`);
