const validator = require('html-validator')
const glob = require('glob')
const fs = require('fs')
const process = require('process')

// just bail on error
process.on('unhandledRejection', error => {
    console.error(error)
    process.exit(1)
})

const pages = glob.sync('public/**/*.html')
pages.forEach(async page => {
    const pageContent = fs.readFileSync(page, 'utf-8').toString()

    // wahtwg, local validator
    const results = await validator({ data: pageContent, validator: 'WHATWG' })
    if (!results['isValid']) {
        throw results['errors'].concat(results['warnings'])
    }

    // default online validator
    const results2 = await validator({ data: pageContent, format: 'text' })
    if (results2.toLowerCase().includes('error')) {
        throw results2
    }
})
