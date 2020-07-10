'''
Main entrypoint file.  To run:

  $ python serve.py

'''
from flask import Flask
from flask import request
from flask import render_template
from flask import json
from flask import send_from_directory
import importlib
import traceback
import sys
import os

# Add current directory to sys.path
site_dir = os.path.dirname(os.path.abspath(__file__))
examples_json = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'examples.json')
faq_json = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'faq.json')

if site_dir not in sys.path:
    sys.path.append(site_dir)

# Set default FLASK_SETTINGS_MODULE for debug mode
if not os.environ.get('FLASK_SETTINGS_MODULE', ''):
    os.environ['FLASK_SETTINGS_MODULE'] = 'core.settings.loc'

# Import settings module for the inject_static_url context processor.
settings_module = os.environ.get('FLASK_SETTINGS_MODULE')

try:
    importlib.import_module(settings_module)
except ImportError, e:
    raise ImportError(
        "Could not import settings '%s' (Is it on sys.path?): %s" \
        % (settings_module, e))

settings = sys.modules[settings_module]


app = Flask(__name__)

dist_dir = os.path.join(settings.PROJECT_ROOT, 'dist')

@app.context_processor
def inject_static_url():
    """
    Inject the variables 'static_url' and 'STATIC_URL' into the templates to
    avoid hard-coded paths to static files. Grab it from the environment
    variable STATIC_URL, or use the default. Never has a trailing slash.
    """
    static_url = settings.STATIC_URL or app.static_url_path
    if static_url.endswith('/'):
        static_url = static_url.rstrip('/')
    return dict(static_url=static_url, STATIC_URL=static_url)


@app.context_processor
def inject_index_data():
        return dict(examples=json.load(open(examples_json)),faqs=json.load(open(faq_json)))


@app.route('/dist/<path:path>')
def catch_build(path):
    """
    Serve /dist/... urls from the build directory
    """
    return send_from_directory(dist_dir, path)

@app.route('/')
@app.route('/<path:path>')
def catch_all(path='index.html', context=None):
    """Catch-all function which serves every URL."""
    context = context or {}
    if not os.path.splitext(path)[1]:
        path = os.path.join(path, 'index.html')
    return render_template(path, **context)


if __name__ == "__main__":
    import getopt

    ssl_context = None
    port = 5000

    try:
        opts, args = getopt.getopt(sys.argv[1:], "sp:", ["port="])
        for opt, arg in opts:
            if opt == '-s':
                ssl_context = 'adhoc'
            elif opt in ('-p', '--port'):
                port = int(arg)
            else:
                print 'Usage: app.py [-s]'
                sys.exit(1)
    except getopt.GetoptError:
        print 'Usage: app.py [-s] [-p port]'
        sys.exit(1)

    app.run(host='0.0.0.0', port=port, debug=True, ssl_context=ssl_context)
