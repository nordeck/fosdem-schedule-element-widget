# FOSDEM Schedule Widget

## Build Status

### main

![Build](https://github.com/nordeck/fosdem-schedule-element-widget/workflows/Docker%20Image%20Build/badge.svg)

### dev

![Dev Build](https://github.com/nordeck/fosdem-schedule-element-widget/workflows/Docker%20Image%20Build/badge.svg?branch=dev)

## Prerequisites

The project requires [node >=12.13.0](https://nodejs.org) and uses [Yarn 1.22.x](https://classic.yarnpkg.com/en/docs/install) instead of npm.<br />
To check if you have the required versions installed you can run:

```sh
node --version && yarn --version
```

## Installation

**Do NOT use `npm install` to install packages!**<br />
To install all dependencies you can just run:

```sh
yarn
```

To add new dependencies to the project use:

```sh
yarn add [package-name] --dev
```

## Development

### Local Testing

To test the widget locally you can add it to a room using `/addwidget https://localhost:3000?theme=$theme&room=M.misc`. This will only work in a chrome instance that is started with `--allow-insecure-localhost --disable-site-isolation-trials --disable-web-security` flags.

> WARNING: Do not use this chrome instance to browse the web!

### IntelliJ and Webstorm

#### Configuration

1. Open Edit Run/Debug configurations by clicking on `ADD CONFIGURATION` from the popup window on the left there is node.js template `app` click and switch to `Browser / Live Edit` tab
2. Click on the three dots next to your default browser `...` and then click on `+` icon or <kbd>⌘</kbd>+<kbd>N</kbd> (Mac) or <kbd>Ctrl</kbd>+<kbd>N</kbd> (Windows)
3. The browser entry is added to the end of the list. Click on the Name to change it to `insecure` for example.
4. Edit the browser by clicking on the pen icon, add this line `--allow-insecure-localhost --disable-site-isolation-trials --disable-web-security` hit `OK` and another time `OK`
5. In the `Browser / Live Edit` tab from the drop down choose your newly added browser hit `Apply` and `OK`

> WARNING: Do not use this chrome instance to browse the web!

#### Syntax Highlighting

You can install [this plugin](https://github.com/styled-components/webstorm-styled-components) to get syntax highlighting on styled-components CSS

#### Debugging

Click the run icon on top of the window or <kbd>⌃</kbd>+<kbd>R</kbd> (Mac) <kbd>Ctrl</kbd>+<kbd>R</kbd> (Windows) to run
 or <kbd>⌃</kbd>+<kbd>D</kbd> (Mac) <kbd>Ctrl</kbd>+<kbd>D</kbd> (Windows) to Debug


### Visual Studio Code

If you are using vscode you have to install the recommended extensions first.<br />
Hit <kbd>F1</kbd> and type `Show Recommended Extensions` or filter extensions by `@recommended`.<br /> Install all **Workspace Recommendations** that are listed in the extensions panel.

#### Debugging

The project is configured to support debugging within vscode.<br />
Hit <kbd>F5</kbd> to start a pre-configured chrome instance with the debugger attached.

> WARNING: Do not use this chrome instance to browse the web!

You should install the following chrome extensions on first run:

* React Developer Tools
* Redux DevTools


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in development mode.<br />
Open [https://localhost:3000](https://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.<br />
The build is minified and the filenames include the hashes.

### `yarn docker:*`

Some commands to build and run the application using docker.

#### `yarn docker:build`

Use this command to build the docker image.

#### `yarn docker:inspect`

Use this command to inspect the image that has been builded using `yarn docker:build`

#### `yarn docker:run`

Use this command to run a container based on the image that has been builded using `yarn docker:build`<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### `yarn docker:stop`

Use this command to stop the container that has been started using `yarn docker:run`

#### `yarn docker:remove`

Use this command to stop and remove the container that has been started using `yarn docker:run`

## Deployment

### Environment Variables

```env
REACT_APP_HOME_SERVER_URL=https://matrix.org // optional
REACT_APP_PRIMARY_COLOR=#b0131d // optional
```
