import requests
import flask
import json
from flask import request

application = flask.Flask(__name__)

API_SERVER = "api.23andme.com"
BASE_CLIENT_URL = 'bioinformatics.party/'
DEFAULT_REDIRECT_URI = '%sreceive_code/'  % BASE_CLIENT_URL
DEFAULT_SCOPE = "ancestry"
CLIENT_SECRET = application.config['CLIENT_SECRET']
CLIENT_ID = application.config['CLIENT_ID']
THRESHOLD_CONVERSION = .01 # converts slider value from client to threshold value used by 23andme api
BASE_API_URL = 'https://api.23andme.com/'
REDIRECT_URI = 'http://bioinformatics.party/receive_code'


@application.route('/')
def index():
    auth_url = "%sauthorize/?response_type=code&redirect_uri=%s&client_id=%s&scope=%s" % (BASE_API_URL, REDIRECT_URI, CLIENT_ID, DEFAULT_SCOPE)
    return flask.render_template('index.html', auth_url = auth_url)

@application.route('/receive_code/')
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

@application.route('/get_ancestry', methods=['POST'])
def get_ancestry():
    threshold = int(request.form['threshold'])*THRESHOLD_CONVERSION
    headers = {'Authorization': 'Bearer %s' % access_token}
    ancestry_response = requests.get("%s%s" % (BASE_API_URL, "1/ancestry/"),
                                     params = {'threshold': threshold},
                                     headers=headers,
                                     verify=False)
    ancestry_structure =  ancestry_response.json()[0]
    return flask.jsonify(**ancestry_structure)

if __name__ == '__main__':
    application.run()
