const rcs = require('rcs-core');
const fs = require('fs');
const glob = require('glob');

// load selectors
rcs.fillLibraries(fs.readFileSync('public/style.css', 'utf8'));
rcs.selectorsLibrary.setExclude('js');
rcs.optimize();

// save selectors
fs.writeFileSync('public/style.css', rcs.replace.css(fs.readFileSync('public/style.css', 'utf8')));
fs.writeFileSync('public/bundle.js', rcs.replace.js(fs.readFileSync('public/bundle.js', 'utf8'))); // js is not necessary
glob.sync('public/**/*.html').forEach((path) => fs.writeFileSync(path, rcs.replace.html(fs.readFileSync(path, 'utf8'))));
