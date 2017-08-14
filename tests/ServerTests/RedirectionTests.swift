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
        let responses = sources.map { self.request(url: $0).last }

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

    func testInvalidLocations() {
        // given
        let locations: [String] = [
            "_error",
            ].map { "/" + $0 }
            .flatMap { [$0, $0 + "/index.php", $0 + "index.html"] }
            .flatMap { self.combinations(for: $0) }

        // when
        let responses = locations.map { self.request(url: $0).last }

        // then
        zip(responses, locations).forEach {
            guard let status = $0.0?.status else { XCTFail("No status code for \($0.1)"); return }
            XCTAssertTrue((400...499).contains(status), "For \($0.1)")
        }
    }
}
