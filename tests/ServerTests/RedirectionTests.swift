//
// This file is part of personal-website which is released under MIT license.
// See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
//

import Alamofire
import XCTest

final class RedirectionTests: ServerTests {
    private lazy var redirectCode: Int = self.isDebug ? 302 : 301
}

// MARK: - Helpers
extension RedirectionTests {
    private func combinations(for source: String) -> [String] {
        let prefices: [String] = ["http://", "https://"].flatMap { form in ["www.", ""].flatMap { form + $0 } }
        let slashes = ["/", "//", "///"]
        let trailingSlashes = [""] + slashes
        return prefices.flatMap { prefix in
            slashes.flatMap { slash in
                trailingSlashes.flatMap { trailingSlash in
                    prefix + self.host + source.replacingOccurrences(of: "/", with: slash) + trailingSlash
                }
            }
        }
    }

    private func helpTestCombinations(source: String, destination: String,
                                      file: StaticString = #file, line: UInt = #line) {
        // given
        let sources = self.combinations(for: source)

        // when
        let responses = sources.map { self.request(url: $0).headers.last }

        // then
        responses.enumerated().forEach {
            XCTAssertEqual($0.element?.status, 200, "For: \(sources[$0.offset])", file: file, line: line)
            XCTAssertEqual($0.element?.destination, destination, "For: \(sources[$0.offset])", file: file,
                           line: line)
        }
    }
}

// MARK: - Accessing server
extension RedirectionTests {
    func testValidPages() {
        // given
        let locations: [(source: String, destination: String)] = [
            ("", ""),
            ("/about", "/about"),
            ("/zenplayer", "/zenplayer"),
            ].map { ($0.0, "https://" + self.host + $0.1 + "/") }

        // then
        locations.forEach {
            self.helpTestCombinations(source: $0.source, destination: $0.destination)
        }
    }

    func testValidFiles() {
        // given
        let locations: [(source: String, destination: String)] = [
            "favicon.ico",
            "robots.txt",
            "_include/config/robots.txt",
            "_include/config/robots-disallow.txt",
            "_include/images/favicon.ico",
            "_include/images/favicon.png",
            "_include/images/favicon_monochrome.svg",
            "_include/images/logo.svg",
            ].map { ("/" + $0, "https://" + self.host + "/" + $0) }

        // then
        locations.forEach {
            self.helpTestCombinations(source: $0.source, destination: $0.destination)
        }
    }

    func testNotFoundPages() {
        // given
        let locations = [
            "foo",
            "42",
            ].map { "/" + $0 }
            .flatMap { self.combinations(for: $0) }

        // when
        let responses = locations.map { self.request(url: $0).headers.last }

        // then
        zip(responses, locations).forEach {
            XCTAssertEqual($0.0?.status, 404, "For \($0.1)")
        }
    }

    func testRestrictedFiles() {
        // given
        let locations = [
            ".htaccess",
            ].map { "/" + $0 }
            .flatMap { self.combinations(for: $0) }
        let expected: [Int?] = [403, 404]

        // when
        let responses = locations.map { self.request(url: $0).headers.last }

        // then
        zip(responses, locations).forEach {
            let status = $0.0?.status
            XCTAssertTrue(expected.contains { $0 == status }, "For \($0.1) got \(status ?? 0)")
        }
    }

    func testTeapot() {
        // given
        let locations = [
            "teapot",
            ].map { "/" + $0 }
            .flatMap { self.combinations(for: $0) }

        // when
        let responses = locations.map { self.request(url: $0).headers.last }

        // then
        zip(responses, locations).forEach {
            XCTAssertEqual($0.0?.status, 418, "For \($0.1)")
        }
    }
}

// MARK: - Content for files
extension RedirectionTests {
    func testRobotsFile() {
        // given
        let locations = [
            "",
            "test.",
            ].map { "https://" + $0 + self.host + "/robots.txt" }
        let realLocations = [
            "robots.txt",
            "robots-disallow.txt",
            ].map { "https://" + self.host + "/_include/config/" + $0 }

        // when
        let tested = locations.map { self.request(url: $0).content }
        let expected = realLocations.map { self.request(url: $0).content }

        // then
        XCTAssertEqual(tested, expected)
        zip(tested, expected).enumerated().forEach {
            XCTAssertTrue($0.element.0.hasPrefix("User-Agent: *\n"), "At \($0.offset), '\($0.element.0)'")
            XCTAssertTrue($0.element.1.hasPrefix("User-Agent: *\n"), "At \($0.offset), '\($0.element.1)'")
        }
    }
}
