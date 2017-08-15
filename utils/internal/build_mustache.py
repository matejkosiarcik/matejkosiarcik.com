# -*- coding: utf-8 -*-
#
# This file is part of personal-website which is released under MIT license.
# See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
#

from __future__ import absolute_import, division, print_function, unicode_literals
import argparse
import json
import os
import sys
import pystache


def main(arguments):
    # parse arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--data", help="Directory path for json-data and partial-html")
    arguments = parser.parse_args(arguments[1:])

    if arguments.data is None:
        print("Missing data filepath")
        print(arguments.usage)
        exit(1)

    # get arguments
    data_path = arguments.data

    # validate path existencies
    if not os.path.exists(data_path):
        print("File not found", data_path)
        exit(1)

    # get paths
    shared_path = os.path.join("sources", "shared", "sources", "markup")
    template = uni(open(os.path.join(shared_path, "html.html.mustache")).read())
    data = json.loads(open(os.path.join(data_path, "data.json")).read())
    renderer = pystache.Renderer(search_dirs=[data_path, shared_path], string_encoding="utf-8", file_encoding="utf-8")

    # get output content
    print(uni(renderer.render(template, data)))


def uni(string):
    if sys.version_info < (3, 0, 0):
        return string.encode("utf-8")
    return str(string)


if __name__ == "__main__":
    main(sys.argv)
