#!/usr/bin/env python -tt
import codecs
from jinja2 import Environment, FileSystemLoader, Template

loader = FileSystemLoader('templates')
env = Environment(loader=loader)

template_names = loader.list_templates()
for template_name in template_names:
	if not template_name.startswith('_'):
		template = env.get_template(template_name)
		html = template.render()
		html_file = codecs.open(template_name, 'w', 'utf-8')
		html_file.write(html)
		html_file.close()