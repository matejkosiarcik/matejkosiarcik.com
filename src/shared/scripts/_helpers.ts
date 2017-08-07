//
// This file is part of personal-website which is released under MIT license.
// See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
//

export function rewrite_class(htmlclass: string, element: HTMLElement, enable: boolean): void {
    const classes = element.classList
    classes.remove(`no-${htmlclass}`)
    classes.remove(htmlclass)
    const newClass = enable ? htmlclass : `no-${htmlclass}`
    classes.add(newClass)
}
