const process = require('process');
const htmlValidator = require('html-validator');
const cssValidator = require('css-validator');

// just bail on error
process.on('unhandledRejection', (error) => {
  console.error(error);
  process.exit(1);
});

const baseUrl = process.env.BASE_URL;
if (!baseUrl) {
  console.log('BASE_URL not set');
  process.exit(1);
}

(async () => {
  const urls = [baseUrl, `${baseUrl}/zenplayer`];
  urls.forEach(async (url) => {
    // whatwg, local validator
    const results = await htmlValidator({ url, validator: 'WHATWG', ignore: ['no-conditional-comment'] });
    if (!results.isValid) {
      console.log(url);
      throw results.errors.concat(results.warnings);
    }

    // default online validator
    const results2 = await htmlValidator({ url, format: 'text', ignore: ['no-conditional-comment'] });
    if (results2.toLowerCase().includes('error')) {
      console.log(url);
      throw results2;
    }

    // validates all styles in given document
    cssValidator({ uri: url, warning: 'no', profile: 'css3svg' }, (_, data) => {
      if (!data.validity) {
        console.log(url);
        throw data.errors;
      }
    });
  });
})();
