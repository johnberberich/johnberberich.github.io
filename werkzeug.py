import os
import urlparse
from werkzeug.wrappers import Request, Response
from werkzeug.routing import Map, Rule
from werkzeug.exceptions import HTTPException, NotFound
from werkzeug.wsgi import SharedDataMiddleware
from werkzeug.utils import redirect
from jinja2 import Environment, FileSystemLoader

class Website(object):

	def __init__(self, config):
		template_path = os.path.join(os.path.dirname(__file__), 'templates')
		self.jinja_env = Environment(loader=FileSystemLoader(template_path),
			autoescape=True)
		self.url_map = Map([
			Rule('/', endpoint='home'),
			Rule('/about', endpoint='about'),
			Rule('/contact', endpont='contact'),
			Rule('/games', endpont='games'),
			Rule('/projects', endpoint='projects'),
			Rule('/<short_id>', endpoint='follow_short_link'),
			Rule('/<short_id>+', endpoint='short_link_details')
		])

	def render_template(self, template_name, **context):
		t = self.jinja_env.get_template(template_name)
		return Response(t.render(context), mimetype='text/html')

	def dispatch_request(self, request):
		adapter = self.url_map.bind_to_environ(request.environ)
		try:
			endpoint, values = adapter.match()
			#return getattr(self, 'on_' + endpoint)(request, **values)
			return getattr(self, endpoint)(request, **values)
		except HTTPException, e:
			return e

	def home(self, request):
		return self.render_template('index.html')

	def about(self, request):
		return self.render_template('about.html')

	def contact(self, request):
		return self.render_template('about.html')

	def games(self, request):
		return self.render_template('games.html')

	def projects(self, request):
		return self.render_template('projects.html')

	def on_new_url(self, request):
		error = None
		url = ''
		if request.method == 'POST':
			url = request.form['url']
			if not is_valid_url(url):
				error = 'Please enter a valid URL'
			else:
				short_id = self.insert_url(url)
				return redirect('/%s+' % short_id)
		return self.render_template('new_url.html', error=error, url=url)

	def wsgi_app(self, environ, start_response):
		request = Request(environ)
		response = self.dispatch_request(request)
		return response(environ, start_response)

	def __call__(self, environ, start_response):
		return self.wsgi_app(environ, start_response)


def create_app(with_static=True):
	app = Website({})
	if with_static:
		app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
			'/static': os.path.join(os.path.dirname(__file__), 'static')
			})
	return app

if __name__ == '__main__':
	from werkzeug.serving import run_simple
	app = create_app()
	run_simple('127.0.0.1', 5000, app, use_debugger=True, use_reloader=True)
