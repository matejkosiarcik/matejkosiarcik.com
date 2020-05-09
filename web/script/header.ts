import { ready, listen } from './utils'
import 'velocity-animate'

// header collapsing
ready(() => {
    // must set the initial value
    // for some reason without it 1st click can result in checked=false
    const checkbox = <HTMLInputElement>document.querySelector('header input[type="checkbox"]')
    if (!checkbox) {
        return
    }
    checkbox.checked = false

    const navigation = <HTMLElement>document.querySelector('header nav')
    if (!navigation) {
        return
    }

    listen(checkbox, 'change', () => {
        const duration = 200
        if (checkbox.checked) {
            navigation.style.height = 'auto'
            const newHeight = navigation.offsetHeight
            navigation.style.height = '0'

            window['Velocity'](navigation, { height: newHeight }, duration, () => {
                navigation.style.height = 'auto'
            })
        } else {
            window['Velocity'](navigation, { height: 0 }, duration, () => {
                navigation.style.height = '0'
            })
        }
    })
})
