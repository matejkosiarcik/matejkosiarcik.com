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
        response.status(200)
        response.end()
        functions.logger.debug(request.headers)
        functions.logger.debug(request.ip)

        let data = {
            'date': new Date().toISOString(),
            'data': {
                'user-agent': request.headers['user-agent'] ?? '',
                'origin': request.headers['origin'] ?? '',
                'language': request.headers['accept-language'] ?? '',
                'referrer': request.headers['referer'] ?? '',
                'ip': request.ip ?? request.ips.filter(el => el)[0] ?? request.headers['x-forwarded-for'] ?? '',
            },
        }
        functions.logger.debug(data)
        database.push(data)
    })
})
