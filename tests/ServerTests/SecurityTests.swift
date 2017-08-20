//
// This file is part of personal-website which is released under MIT license.
// See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
//

import Alamofire
import XCTest

final class SecurityTests: ServerTests {}

// MARK: - Helpers
// swiftlint:disable:next no_extension_access_modifier
private extension HTTPMethod {
    static var all: [HTTPMethod] {
        return [
            .connect,
            .delete,
            .get,
            .head,
            .options,
            .patch,
            .post,
            .put,
            .trace,
        ]
    }

    static var valid: [HTTPMethod] {
        return [.get, .head, .post]
    }

    // these two methods return 400 and 200 respectively
    // enable them when they return proper 403
    static var glitching: [HTTPMethod] {
        return [.connect, .trace]
    }

    static var invalid: [HTTPMethod] {
        return self.all.filter { !self.valid.contains($0) && !self.glitching.contains($0) }
    }
}

// MARK: - Accesing server
extension SecurityTests {
    func testValidHTTPMethods() {
        // given
        let location = "https://" + self.domain
        let methods = HTTPMethod.valid

        // when
        let responses = methods.map { self.request(url: location, method: $0).headers.last }

        // then
        zip(responses, methods).forEach {
            XCTAssertEqual($0.0?.status, 200, "For \($0.1)")
            XCTAssertEqual($0.0?.destination, location + "/", "For \($0.1)")
        }
    }

    func testInvalidHTTPMethods() {
        // given
        let location = "https://" + self.domain
        let methods = HTTPMethod.invalid

        // when
        let responses = methods.map { self.request(url: location, method: $0).headers.last }

        // then
        zip(responses, methods).forEach {
            XCTAssertEqual($0.0?.status, 403, "For \($0.1)")
            XCTAssertEqual($0.0?.destination, location + "/", "For \($0.1)")
        }
    }
}
