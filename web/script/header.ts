import { ready, listen } from './utils'

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

            // animate 0 -> new-height
            let start: number | null = null
            function step(timestamp: number) {
                if (!start) {
                    start = timestamp
                }
                const progress = timestamp - start
                if (progress < duration) {
                    navigation.style.height = `${newHeight * progress / duration}px`
                    window.requestAnimationFrame(step)
                } else {
                    navigation.style.height = `${newHeight}px`
                }
            }
            window.requestAnimationFrame(step)
        } else {
            const oldHeight = parseFloat(navigation.style.height)

            // animate old-height -> 0
            let start: number | null = null
            function step(timestamp: number) {
                if (!start) {
                    start = timestamp
                }
                const progress = timestamp - start
                if (progress < duration) {
                    navigation.style.height = `${oldHeight * (1 - progress / duration)}px`
                    window.requestAnimationFrame(step)
                } else {
                    navigation.style.height = `0`
                }
            }
            window.requestAnimationFrame(step)
        }
    })
})
