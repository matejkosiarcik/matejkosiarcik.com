//
// This file is part of personal-website which is released under MIT license.
// See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
//

import * as helpers from "./_helpers"

function isTouchDevice(): boolean {
   const element = document.createElement("div")
   element.setAttribute("ontouchstart", "return;")
   return typeof(element.ontouchstart) === "function"
}

const root = document.documentElement
helpers.rewrite_class("touch", root, isTouchDevice())
