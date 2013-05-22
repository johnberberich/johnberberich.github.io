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


class StaticSite(object):
    def __init__(self):
        pass

    def dispatch_request(self, request):
        pass

    def wsgi_app(self, environ, start_response):
        request = Request(environ)
        response = self.dispatch_request(request)
        return response(environ, start_response)

    def __call__(self, environ, start_response):
        return self.wsgi_app(environ, start_response)


def create_app():
    app = StaticSite()
    return app


def run():
    from werkzeug.serving import run_simple
    app = create_app()
    run_simple('127.0.0.1', 5000, app, use_debugger=True, use_reloader=True)


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
