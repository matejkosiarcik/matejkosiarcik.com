//
// This file is part of personal-website by Matej Košiarčik
// Released under MIT license
//

import XCTest

class ResponseTests: XCTestCase {}

extension ResponseTests {
    func testEquality() {
        // given
        let items = [
            (10, "foo", "bar"),
            (10, "foo", "lol"),
            (10, "bar", "foo"),
            (3, "foo", "bar"),
            (100, "bar", "foo"),
            ].map { Header(status: $0.0, source: $0.1, destination: $0.2) }
        let comparator = items[0]
        let expected = [true] + [Bool](repeating: false, count: 4)

        // when
        let equalities = items.map { $0 == comparator }

        // then
        XCTAssertEqual(equalities, expected)
    }
}
