#!/usr/bin/python

import getpass
import webbrowser
import requests
import flask
import json
import pdb
from flask import request
from optparse import OptionParser

app = flask.Flask(__name__)
app.config.from_pyfile('instance/config.cfg')

PORT = 5000
API_SERVER = "api.23andme.com"
BASE_CLIENT_URL = 'http://localhost:%s/'% PORT
DEFAULT_REDIRECT_URI = '%sreceive_code/'  % BASE_CLIENT_URL
SNPS = ["rs12913832"]
DEFAULT_SCOPE = "ancestry"
CLIENT_SECRET = app.config['CLIENT_SECRET']
CLIENT_ID = app.config['CLIENT_ID']
THRESHOLD_CONVERSION = .01 # converts slider value from client to threshold value used by 23andme api

parser = OptionParser(usage = "usage: %prog -i CLIENT_ID [options]")
parser.add_option("-i", "--client_id", dest="client_id",
        help="Your client_id [REQUIRED]", default ='')
parser.add_option("-s", "--scope", dest="scope",
        help="Your requested scope [%s]" % DEFAULT_SCOPE, default = DEFAULT_SCOPE)
parser.add_option("-r", "--redirect_uri", dest="redirect_uri",
        help="Your client's redirect_uri [%s]" % DEFAULT_REDIRECT_URI, default = DEFAULT_REDIRECT_URI)
parser.add_option("-a", "--api_server", dest="api_server",
        help="Almost always: [api.23andme.com]", default = API_SERVER)

(options, args) = parser.parse_args()
BASE_API_URL = "https://%s/" % options.api_server
REDIRECT_URI = options.redirect_uri

if not options.client_id:
    print "missing param: CLIENT_ID:"
    parser.print_usage()
    print "Please navigate to your developer dashboard [%sdashboard/] to retrieve your client_id.\n" % BASE_API_URL
    exit()

if not CLIENT_SECRET:
    print "Please navigate to your developer dashboard [%sdashboard/] to retrieve your client_secret." % BASE_API_URL
    CLIENT_SECRET = getpass.getpass("Please enter your client_secret:")

@app.route('/')
def index():
    auth_url = "%sauthorize/?response_type=code&redirect_uri=%s&client_id=%s&scope=%s" % (BASE_API_URL, REDIRECT_URI, CLIENT_ID, DEFAULT_SCOPE)
    print auth_url
    return flask.render_template('index.html', auth_url = auth_url)

@app.route('/receive_code/')
def receive_code():
    parameters = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': request.args.get('code'),
        'redirect_uri': REDIRECT_URI,
        'scope': 'ancestry'
    }
    response = requests.post(
        "%s%s" % (BASE_API_URL, "token/"),
        data = parameters,
        verify=False
    )

    if response.status_code == 200:
        global access_token
        access_token = response.json()['access_token']

        headers = {'Authorization': 'Bearer %s' % access_token}
        ancestry_response = requests.get("%s%s" % (BASE_API_URL, "1/ancestry/"),
                                         params = {'threshold': .51},
                                         headers=headers,
                                         verify=False)
        if ancestry_response.status_code == 200:
            return flask.render_template('receive_code.html', response_json = ancestry_response.json())
        else:
            reponse_text = ancestry_response.text
            response.raise_for_status()
    else:
        response.raise_for_status()

@app.route('/get_ancestry', methods=['POST'])
def get_ancestry():
    threshold = int(request.form['threshold'])*THRESHOLD_CONVERSION
    headers = {'Authorization': 'Bearer %s' % access_token}
    ancestry_response = requests.get("%s%s" % (BASE_API_URL, "1/ancestry/"),
                                     params = {'threshold': threshold},
                                     headers=headers,
                                     verify=False)
    print threshold
    ancestry_structure =  ancestry_response.json()[0]
    return flask.jsonify(**ancestry_structure)

if __name__ == '__main__':
    print "A local client for the Personal Genome API is now initialized."
    app.run(debug=False, port=PORT)
