import $ from 'jquery'

// header collapsing
$(document).ready(() => {
    // must set the initial value
    // for some reason without it 1st click can result in checked=false
    $('header input[type="checkbox"]').prop('checked', false)

    $('header input[type="checkbox"]').on('change', event => {
        if ($(event.currentTarget).prop('checked') === true) {
            // we can't animate to "height: auto"
            // so instead we check what is element's height with "height: auto"
            // animate from 0 to this value and switch to "height: auto" after animation
            const newHeight = $('header nav').css('height', 'auto').height() ?? 0
            $('header nav').css('height', 0)
            $('header nav').animate({ height: newHeight }, 200, () => {
                $('header nav').css('height', 'auto')
            })
        } else {
            $('header nav').animate({ height: 0 }, 200, () => {
                $('header nav').css('height', 0)
            })
        }
    })
})
