# -*- coding: utf-8 -*-
#
# build-mustache
# Copyright © 2017 Matej Kosiarcik. All rights reserved.
# This file builds mustache
#

from __future__ import absolute_import, division, print_function, unicode_literals
import argparse
import json
import os
from functional import seq
import pystache
import six

# parse arguments
parser = argparse.ArgumentParser()
parser.add_argument("-o", "--output")
arguments = parser.parse_args()

# validate arguments
if arguments.output is None:
    print("Output is missing")
    exit(1)
output = arguments.output

# get markup template
markup_path = os.path.join("src", "shared", "markup")
markup_main = open(os.path.join(markup_path, "html.html.mustache")).read()
if six.PY2:
    markup_main = unicode(markup_main)
markup = pystache.parse(markup_main)

# get pages to create
pages_path = os.path.join("src", "pages")
pages = seq(os.listdir(pages_path)).map(lambda x: os.path.join(pages_path, x)).filter(os.path.isdir).list()

# generate formatted pages
for page in pages:
    data = json.loads(open(os.path.join(page, "data.json")).read())
    renderer = pystache.Renderer(search_dirs=[page, markup_path], file_encoding="utf-8")
    content = renderer.render(markup, data).encode("utf-8")
    target = open(os.path.join(output, os.path.basename(page), "index.html"), "w+")
    target.write(content)
    target.close()
