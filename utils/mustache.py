# -*- coding: utf-8 -*-
#
# This file is part of personal-website by Matej Košiarčik
# Released under MIT license
#

"""
Mustache builder

Generates output from mustache template and json data.
"""

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)
import argparse
import json
import os
import sys
import pystache


def main(arguments):
    """Execute program."""
    # parse arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("-t", "--template", help="Path for template file")
    parser.add_argument("-d", "--data", help="Path for data file")
    arguments = parser.parse_args(arguments[1:])

    # get paths
    template_path = arguments.template
    data_path = arguments.data
    page_path = os.path.dirname(template_path)
    shared_path = os.path.join("sources", "web", "markup")
    with open(template_path) as template_file, open(data_path) as data_file:
        template = template_file.read()
        data = json.loads(data_file.read())
    renderer = pystache.Renderer(search_dirs=[page_path, shared_path],
                                 string_encoding="utf-8",
                                 file_encoding="utf-8")

    # get output
    print(renderer.render(template, data))


if __name__ == "__main__":
    main(sys.argv)
