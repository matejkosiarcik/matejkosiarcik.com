//
// This file is part of personal-website which is released under MIT license.
// See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
//

import Alamofire
import XCTest

class ServerTests: XCTestCase {
    let isLocal = true
    let isDebug = true
    lazy var host: String = self.isLocal ? "example.com" : "binarytrex.com"
}

extension ServerTests {
    func manager() -> Alamofire.SessionManager {
        // disable validating local server, otherwise requests fail
        let policies: [String: ServerTrustPolicy] = [
            "example.com": .disableEvaluation,
            "www.example.com": .disableEvaluation,
            "test.example.com": .disableEvaluation,
            ]
        return Alamofire.SessionManager(serverTrustPolicyManager: ServerTrustPolicyManager(policies: policies))
    }

    func request(url: URLConvertible, method: HTTPMethod = .get) -> (headers: [Response], content: String) {
        // given
        var responses: [Response] = []
        var content = ""
        let manager = self.manager()
        guard var request = try? URLRequest(url: url.asURL(), cachePolicy: .reloadIgnoringCacheData)
            else { XCTFail("Could not create URL from \(url)"); return (responses, content) }
        request.httpMethod = method.rawValue

        // when
        let exp = expectation(description: "Wait for server response")
        manager.delegate.taskWillPerformHTTPRedirection = { _, _, response, request in
            responses.append(Response(status: response.statusCode,
                                      source: response.url?.absoluteString,
                                      destination: request.url?.absoluteString))
            return request
        }
        manager.request(request).response {
            responses.append(Response(status: $0.response?.statusCode,
                                      source: $0.request?.url?.absoluteString,
                                      destination: $0.response?.url?.absoluteString))
            content = $0.data.flatMap { String(data: $0, encoding: .utf8) } ?? ""
            exp.fulfill()
        }

        // then
        wait(for: [exp], timeout: self.isLocal ? 0.2 : 1)
        return (responses, content)
    }
}
