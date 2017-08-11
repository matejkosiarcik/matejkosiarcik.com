//
// This file is part of personal-website which is released under MIT license.
// See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
//

struct Response {
    let status: Int?
    let source: String?
    let destination: String?
}

extension Response: Equatable {
    static func == (lhs: Response, rhs: Response) -> Bool {
        guard lhs.status == rhs.status else { return false }
        guard lhs.source == rhs.source else { return false }
        guard lhs.destination == rhs.destination else { return false }
        return true
    }
}
