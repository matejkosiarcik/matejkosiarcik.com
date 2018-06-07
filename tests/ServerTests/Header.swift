//
// This file is part of personal-website by Matej Košiarčik
// Released under MIT license
//

struct Header {
    let status: Int?
    let source: String?
    let destination: String?
}

extension Header: Equatable {
    static func == (lhs: Header, rhs: Header) -> Bool {
        guard lhs.status == rhs.status else { return false }
        guard lhs.source == rhs.source else { return false }
        guard lhs.destination == rhs.destination else { return false }
        return true
    }
}
