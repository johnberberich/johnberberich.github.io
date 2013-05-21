#!/usr/bin/env python -tt
import codecs
from jinja2 import Environment, FileSystemLoader, Template


def render(template_path):
    loader = FileSystemLoader(template_path)
    env = Environment(loader=loader)
    ignores = ('_', '.')
    filenames = [t for t in loader.list_templates()
            if not t.startswith(ignores)]
    for filename in filenames:
        print 'Staticizing ' + filename
        template = env.get_template(filename)
        text = template.render()
        try:
            outfile = codecs.open(filename, 'w', 'utf-8')
            try:
                outfile.write(text)
            finally:
                outfile.close()
        except IOError as e:
            print 'IOError{}: Could not open '.format(e.errno) + filename + ' for writing'
            print e.strerror


def run():
    print 'This feature is not currently available.'


if __name__ == '__main__':
    import sys

    #TODO Handle args better
    #TODO Undo default behavior
    # If no option is given, default to 'render'
    if len(sys.argv) == 1:
        command = 'render'
    else:
        command = sys.argv[1]

    if command == 'render':
        render('templates')
    elif command == 'run':
        run()
    else:
        # Print usage info
        print """
usage: staticize.py <command> [<options>]

Commands are:
   render   Convert templates into static files
   run      Start dev server to dynamically convert templates
"""
