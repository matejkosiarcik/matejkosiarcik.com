import 'instant.page'
import { ready } from './utils'

// config for instant.page
ready(() => {
    document.body.dataset['instantAllowExternalLinks'] = 'true'
})
