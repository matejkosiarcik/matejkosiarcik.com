//
// This file is part of personal-website by Matej Košiarčik
// Released under MIT license
//

import Alamofire
import XCTest

class ServerTests: XCTestCase {
    let host = Hosts.current
    private(set) lazy var domain = self.host.rawValue
}

enum Hosts: String {
    case local = "binarytrex.localhost"
    case staging = "test.binarytrex.com"
    case production = "binarytrex.com"

    static let current: Hosts = {
        #if DEBUG || Xcode
            return .local
        #elseif BETA
            return .testing
        #elseif RELEASE
            return .production
        #else
            fatalError("Invalid compilation mode")
        #endif
    }()
}

extension ServerTests {
    func manager() -> Alamofire.SessionManager {
        // disable validating local server, otherwise requests fail
        let policies: [String: ServerTrustPolicy] = [
            "binarytrex.localhost": .disableEvaluation,
            "www.binarytrex.localhost": .disableEvaluation,
            "test.binarytrex.localhost": .disableEvaluation,
            ]
        return Alamofire.SessionManager(serverTrustPolicyManager: ServerTrustPolicyManager(policies: policies))
    }

    func request(url: URLConvertible, method: HTTPMethod = .get) -> (headers: [Header], content: String) {
        // given
        var responses: [Header] = []
        var content = ""
        let manager = self.manager()
        guard var request = try? URLRequest(url: url.asURL(), cachePolicy: .reloadIgnoringCacheData)
            else { XCTFail("Could not create URL from \(url)"); return (responses, content) }
        request.httpMethod = method.rawValue

        // when
        let exp = expectation(description: "Wait for server response")
        manager.delegate.taskWillPerformHTTPRedirection = { _, _, response, request in
            responses.append(Header(status: response.statusCode,
                                      source: response.url?.absoluteString,
                                      destination: request.url?.absoluteString))
            return request
        }
        manager.request(request).response {
            responses.append(Header(status: $0.response?.statusCode,
                                      source: $0.request?.url?.absoluteString,
                                      destination: $0.response?.url?.absoluteString))
            content = $0.data.flatMap { String(data: $0, encoding: .utf8) } ?? ""
            exp.fulfill()
        }

        // then
        wait(for: [exp], timeout: self.host == .local ? 0.2 : 1)
        return (responses, content)
    }
}
