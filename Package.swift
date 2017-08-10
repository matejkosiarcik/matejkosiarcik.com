// swift-tools-version:4.0
//
// This file is part of personal-website which is released under MIT license.
// See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
//

import PackageDescription

let package = Package(name: "PersonalWebsite")

package.dependencies = [
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "4.0.0"),
]

package.targets = [
    .testTarget(name: "ServerTests", dependencies: ["Alamofire"]),
]
