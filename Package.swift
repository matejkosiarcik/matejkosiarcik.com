// swift-tools-version:4.0

import PackageDescription

let package = Package(name: "Website")

package.dependencies = [
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "4.0.0"),
]

package.targets = [
    .testTarget(name: "ServerTests", dependencies: ["Alamofire"]),
]
