# -*- coding: utf-8 -*-
#
# This file is part of personal-website by Matej Košiarčik
# Released under MIT license
#

# This effectively disables missing-module-docstring
# pylint: disable=missing-docstring
# pylint: enable=missing-docstring

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)
import argparse
import json
import os
import sys
import pystache


def main(arguments):
    """Classic main"""
    # parse arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("-t", "--template", help="Path for template file")
    parser.add_argument("-d", "--data", help="Path for data file")
    arguments = parser.parse_args(arguments[1:])

    # get paths
    template_path = arguments.template
    data_path = arguments.data
    page_path = os.path.dirname(template_path)
    shared_path = os.path.join("sources", "shared", "sources", "markup")
    template = open(template_path).read()
    data = json.loads(open(data_path).read())
    renderer = pystache.Renderer(search_dirs=[page_path, shared_path],
                                 string_encoding="utf-8",
                                 file_encoding="utf-8")

    # get output
    print(renderer.render(template, data))


if __name__ == "__main__":
    main(sys.argv)
