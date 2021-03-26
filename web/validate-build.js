const fs = require('fs');
const process = require('process');
const htmlValidator = require('html-validator');
const glob = require('glob');
const cssValidator = require('css-validator');

// just bail on error
process.on('unhandledRejection', (error) => {
  console.error(error);
  process.exit(1);
});

const pages = glob.sync('public/**/*.html');
pages.forEach(async (pagePath) => {
  const pageContent = fs.readFileSync(pagePath, 'utf-8').toString();

  // whatwg, local validator
  const results = await htmlValidator({ data: pageContent, validator: 'WHATWG', ignore: ['no-conditional-comment'] });
  if (!results.isValid) {
    throw results.errors.concat(results.warnings);
  }
});

const styles = glob.sync('public/**/*.css');
styles.forEach(async (stylePath) => {
  const styleContent = fs.readFileSync(stylePath, 'utf-8').toString();

  cssValidator({ text: styleContent, warning: 'no', profile: 'css3svg' }, (_, data) => {
    if (!data.validity) {
      throw data.errors;
    }
  });
});
