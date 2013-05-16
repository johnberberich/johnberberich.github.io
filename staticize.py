#!/usr/bin/env python -tt
import codecs
from jinja2 import Environment, FileSystemLoader, Template


def staticize():
	loader = FileSystemLoader('templates')
	env = Environment(loader=loader)
	template_names = [t for t in loader.list_templates() if not t.startswith(('_','.'))]
	for template_name in template_names:
		print 'Staticizing ' + template_name
		template = env.get_template(template_name)
		html = template.render()
		try:
			html_file = codecs.open(template_name, 'w', 'utf-8')
			try:
				html_file.write(html)
			finally:
				html_file.close()
		except IOError as e:
			print 'IOError{}: Could not open '.format(e.errno) + template_name + ' for writing'
			print e.strerror


if __name__ == '__main__':
	staticize()
