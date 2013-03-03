#!/usr/bin/env python -tt
import codecs
from jinja2 import Environment, FileSystemLoader, Template

loader = FileSystemLoader('templates')
env = Environment(loader=loader)

template_files = ['index.html']
for template_file in template_files:
	template = env.get_template(template_file)
	html = template.render()
	html_file = codecs.open(template_file, 'w', 'utf-8')
	html_file.write(html)
	html_file.close()