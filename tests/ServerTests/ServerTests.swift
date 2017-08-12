//
// This file is part of personal-website which is released under MIT license.
// See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
//

import Alamofire
import XCTest

class ServerTests: XCTestCase {
    private let isLocal = true
    private let isDebug = true
    private lazy var host: String = self.isLocal ? "example.com" : "binarytrex.com"
    private lazy var redirectCode: Int = self.isDebug ? 302 : 301
}

// MARK: - Helpers
extension ServerTests {
    private func manager() -> Alamofire.SessionManager {
        // disable validating local server, otherwise requests fail
        let policies: [String: ServerTrustPolicy] = [
            "example.com": .disableEvaluation,
            "www.example.com": .disableEvaluation,
            ]
        return Alamofire.SessionManager(serverTrustPolicyManager: ServerTrustPolicyManager(policies: policies))
    }

    private func request(url: URLConvertible) -> [Response] {
        // given
        var responses: [Response] = []
        let manager = self.manager()

        // when
        let exp = expectation(description: "Wait for server response")
        manager.delegate.taskWillPerformHTTPRedirection = { _, _, response, request in
            responses.append(Response(status: response.statusCode,
                                      source: response.url?.absoluteString,
                                      destination: request.url?.absoluteString))
            return request
        }
        manager.request(url).response {
            responses.append(Response(status: $0.response?.statusCode,
                                      source: $0.request?.url?.absoluteString,
                                      destination: $0.response?.url?.absoluteString))
            exp.fulfill()
        }

        // then
        wait(for: [exp], timeout: self.isLocal ? 0.2 : 1)
        return responses
    }

    private func helpTestCombinations(source: String, destination: String,
                                      file: StaticString = #file, line: UInt = #line) {
        // given
        let prefices: [String] = ["http://", "https://"].flatMap { form in ["www.", ""].flatMap { form + $0 } }
        let slashes = ["/", "//", "///"]
        let trailingSlashes = [""] + slashes
        let sources: [String] = prefices.flatMap { prefix in
            slashes.flatMap { slash in
                trailingSlashes.flatMap { trailingSlash in
                    prefix + source.replacingOccurrences(of: "/", with: slash) + trailingSlash
                }
            }
        }

        // when
        let responses = sources.map { self.request(url: $0).last }

        // then
        responses.enumerated().forEach {
            XCTAssertEqual($0.element?.status, 200, "Fail for url: \(sources[$0.offset])", file: file, line: line)
            XCTAssertEqual($0.element?.destination, destination, "Fail for url: \(sources[$0.offset])", file: file,
                           line: line)
        }
    }
}

// MARK: - Accessing server
extension ServerTests {
    func testAccessPages() {
        // given
        let resources = ["", "/about", "/zenplayer"]
        let sources = resources.map { self.host + $0 }
        let destinations = resources.map { "https://" + self.host + $0 + "/" }

        // then
        zip(sources, destinations).forEach {
            self.helpTestCombinations(source: $0.0, destination: $0.1)
        }
    }

    func testAccessResources() {
        // given
        let resources = ["favicon.ico",
                         "_include/images/favicon.ico",
                         "_include/images/favicon_monochrome.svg",
                         "_include/images/logo.svg",
                         ]
        let sources = resources.map { self.host + "/" + $0 }
        let destinations = resources.map { "https://" + self.host + "/" + $0 }

        // then
        zip(sources, destinations).forEach {
            self.helpTestCombinations(source: $0.0, destination: $0.1)
        }
    }
}
