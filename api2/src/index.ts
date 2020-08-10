import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import * as CorsFactory from 'cors'

admin.initializeApp()
const database = admin.database().ref('visits');
const cors = CorsFactory({
    origin: process.env['FUNCTIONS_EMULATOR'] ? /http:\/\/localhost:8080\/?/ : /https:\/\/matejkosiarcik.com\/?/,
    methods: ['GET'],
})

export const analytics = functions.https.onRequest((request, response) => {
    return cors(request, response, () => {
        // init response
        response.status(200)

        // set no caching
        response.vary('*')
        response.setHeader('Cache-Control', 'no-store')

        // send content
        response.type('svg')
        response.send('<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" height="0" viewBox="0 0 0 0" width="0"></svg>')
        response.end()

        // get data for save
        functions.logger.debug('Raw headers', request.headers)
        const data = {
            'date': new Date().toISOString(),
            'data': {
                'user-agent': request.headers['user-agent'] ?? '',
                'origin': request.headers['origin'] ?? '',
                'language': request.headers['accept-language'] ?? '',
                'referrer': request.headers['referer'] ?? '',
                'ip': request.ip ?? request.ips.filter(el => el)[0] ?? request.headers['x-forwarded-for'] ?? '',
            },
        }

        // save data
        functions.logger.debug('Saving:', data)
        database.push(data)
    })
})
