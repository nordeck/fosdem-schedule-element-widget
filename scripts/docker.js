var childProcess = require('child_process');
var pkg = require('../package.json');
var chalk = require('chalk');

/**
 * For ease of use add the following line to scripts in package.json: `"docker:build": "node scripts/docker.js"`
 *
 * **Usage:**
 *
 * * `yarn run docker:build`
 * > This will just build the image: `organization/package-name:0.1.0`
 *
 * * `yarn run docker:build -- --tag-suffix`
 * > This will just build the image with git ref suffix: `organization/package-name:0.1.0-90b0665`
 *
 * * `yarn run docker:build -- --push`
 * > This will build and push the image to Docker Hub: `organization/package-name:0.1.0`
 *
 * * `yarn run docker:build -- --push --tag-suffix`
 * > This will build and push the image to Docker Hub with git ref suffix: `organization/package-name:0.1.0-90b0665`
 *
 * * `yarn run docker:build -- --push --tag-suffix stage`
 * > This will build and push the image to Docker Hub with custom suffix: `organization/package-name:0.1.0-90b0665-stage`
 *
 * * `yarn run docker:build -- --push aws_account_id.dkr.ecr.eu-central-1.amazonaws.com --tag-suffix dev`
 * > This will build and push the image to AWS ECR with custom suffix: `aws_account_id.dkr.ecr.eu-central-1.amazonaws.com/package-name:0.1.0-90b0665-dev`
 *
 */
const buildDocker = async () => {
  return new Promise((resolve, reject) => {
    execChildProcess('git', 'rev-parse --short HEAD').then((ref) => {
      return ref.replace(/^(.*?)[\r\n]*$/, '$1'); // remove line breaks from output if present
    }).then((vcsRef) => {
      if (!process.env.GITHUB_TOKEN) {
        return reject(chalk.redBright('missing GITHUB_TOKEN environment variable!'));
      }

      var version = pkg.version || 'latest'; // fallback to 'latest' if no version is set in package.json
      var date = new Date().toISOString(); // get current date in ISO format
      var name = pkg.name.replace(/^(?:@\w*\/)?(.*)$/, '$1'); // remove organization prefix from package name if present
      var organization = pkg.name.replace(/^(?:@(\w*)\/)?.*$/, '$1') || 'nordeck'; // get organization from package name

      var getArgument = (name) => {
        var argIndex = process.argv.indexOf(name);
        if (argIndex > -1) {
          if (process.argv.length > argIndex + 1) {
            return process.argv[argIndex + 1];
          }
          return true;
        }
      }

      var pushTarget = getArgument('--push');
      if (pushTarget) {
        if (pushTarget === true) {
          pushTarget = organization;
        }
        console.log(chalk.blueBright(`image will be pushed to ${pushTarget}`))
      }

      var tag = `${pushTarget || organization}/${name}:${version}`

      var tagSuffix = getArgument('--tag-suffix');
      if (tagSuffix) {
        if (tagSuffix === true) {
          tag += `-${vcsRef}`;
        } else {
          tag += `-${vcsRef}-${tagSuffix}`
        }
      }

      var maxLabelLength = 100;
      var formatInfo = (label, value) => chalk.cyanBright('║') + ` ${`${label}:`.padEnd(12, ' ')} ${value}`.padEnd(maxLabelLength, ' ').substring(0, maxLabelLength) + chalk.cyanBright('║');
      console.log(chalk.cyanBright(`╔${'═'.repeat(maxLabelLength)}╗`))
      console.log(formatInfo('image', tag));
      console.log(formatInfo('git ref', vcsRef));
      console.log(formatInfo('build date', date));
      console.log(chalk.cyanBright(`╚${'═'.repeat(maxLabelLength)}╝`))

      var cmd = childProcess.spawn('docker', `build --build-arg CI --build-arg VCS_REF --build-arg VERSION --build-arg BUILD_DATE --build-arg GITHUB_TOKEN -t ${tag}${tagSuffix ? '' : ` -t ${`${pushTarget || organization}/${name}:latest`}`} .`.split(' '), {
        env: {
          CI: true,
          VCS_REF: vcsRef,
          VERSION: version,
          BUILD_DATE: date,
          GITHUB_TOKEN: process.env.GITHUB_TOKEN
        }
      });

      cmd.stdout.on('data', function (output) {
        var val = output.toString().replace(/^(.*?)[\r\n]*$/, '$1');
        console.log(val);
      });

      cmd.stderr.on('data', function (err) {
        var val = err.toString().replace(/^(.*?)[\r\n]*$/, '$1');
        console.error(chalk.redBright(val));
      });

      cmd.on('exit', code => {
        if (code === 0) {
          // output image name and tag to github action
          console.log(`::set-output name=image::${tag}`)
          console.log(`::set-output name=container::${name}`)

          if (pushTarget) {
            execChildProcess('docker', `push ${pushTarget || organization}/${name}`, false).then(() => {
              resolve(chalk.greenBright(`docker image build and pushed successfully (${tag})!`));
            }).catch((err) => {
              console.error(chalk.redBright(`unable to push docker image (${tag})!`));
              reject(err);
            });
          } else {
            resolve(chalk.greenBright('docker build completed successfully!'));
          }
        } else {
          reject(chalk.redBright('docker build failed!'));
        }
      });
    }).catch((err) => {
      console.error(chalk.redBright('unable to read git ref!'));
      reject(err);
    });
  });
}

const execChildProcess = (command, options, resolveOnOutput = true) => {
  return new Promise((resolve, reject) => {
    var cmd = childProcess.spawn(command, options.split(' '));

    cmd.stdout.on('data', function (output) {
      var val = output.toString().replace(/^(.*?)[\r\n]*$/, '$1');
      if (resolveOnOutput) {
        resolve(val);
      } else {
        console.log(val);
      }
    });

    cmd.stderr.on('data', function (err) {
      var val = err.toString().replace(/^(.*?)[\r\n]*$/, '$1');
      if (resolveOnOutput) {
        reject(val);
      } else {
        console.error(val);
      }
    });

    cmd.on('exit', code => {
      if (code === 0) {
        resolve('task completed successfully!');
      } else {
        reject('task failed!');
      }
    });
  });
}

buildDocker().then((message) => {
  console.log(message);
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
