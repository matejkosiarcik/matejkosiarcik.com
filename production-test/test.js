const fs = require('fs')
const process = require('process')
const htmlValidator = require('html-validator')
const cssValidator = require('css-validator')
require('isomorphic-fetch')

// just bail on error
process.on('unhandledRejection', error => {
    console.error(error)
    process.exit(1)
});

// async function getURLs() {
//     return new Promise(async (resolve, reject) => {
//         const response = await fetch('https://matejkosiarcik.com/urllist.txt')
//         const body = await response.text()
//         resolve(body.split('\n'))
//     })
// }

(async () => {
    // TODO: switch to: const urls = await getURLs()
    const urls = ['https://matejkosiarcik.com']
    urls.forEach(async url => {
        // whatwg, local validator
        const results = await htmlValidator({ url: url, validator: 'WHATWG' })
        if (!results['isValid']) {
            console.log(url)
            throw results['errors'].concat(results['warnings'])
        }

        // default online validator
        const results2 = await htmlValidator({ url: url, format: 'text' })
        if (results2.toLowerCase().includes('error')) {
            console.log(url)
            throw results2
        }

        // validates all styles in given document
        cssValidator({ uri: url, warning: 'no', profile: 'css3svg' }, (_, data) => {
            if (!data['validity']) {
                console.log(url)
                throw data['errors']
            }
        })
    })
})()
