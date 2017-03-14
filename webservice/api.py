from flask import Flask, request
from flask_cors import CORS, cross_origin
import time
import requests
import requests_cache
import json


app = Flask(__name__)
CORS(app)


# a list that represents users with valid api key
api_keys = ['d6e0b8cd18ec0248d6e0b18ec0248']


#create sqlite database to persist request for 1 hour
#this database will appear in the same direcotry where the api.py is
#the database name is weather_api_cache.sqlite

requests_cache.install_cache('weather_api_cache', backend='sqlite', expire_after=3600)

#define the api resourece url
@app.route('/api/', methods=['GET'])
@cross_origin()
def index():
	
	#to demonestrate the request loader image indicator halt execution for 1 second
	time.sleep(1)
	userkey = request.args.get('key')
	zipcode = request.args.get('zipcode')

	#remove spaces
	userkey = userkey.strip()
	zipcode = zipcode.strip()


	#second line check
	#=============================
	#check if any of the required parameters is not set or empty
	if userkey == None or userkey == '' or zipcode == None or zipcode=='':
		return json.dumps({'type':'error', 'data':'Invalid arguments'})

	#check if zipcode doesn't have the required length
	if len(zipcode) != 5:
		return json.dumps({'type':'error', 'data':'Missing zipcode numbers'})

	#=============================

	#confirm that the request comes from a user that exist in the users list
	#this could be also checked against a users api keys in a database
	#for simplicity I will use a dictionary called users and the check the users against it
	
	if userkey in str(api_keys):

		# the weather api to connect to with our user key
		api_key = 'd6e0b8cd18ec0248'
		wunderground_api = 'http://api.wunderground.com/api/{}/forecast10day/q/{}.json'.format(api_key, zipcode)
		wunderground_api_geolookup = 'http://api.wunderground.com/api/{}/geolookup/q/{}.json'.format(api_key, zipcode)

		now = time.ctime(int(time.time()))
		weahter_response = requests.get(wunderground_api)
		geolookup_response = requests.get(wunderground_api_geolookup)
		print()
		print("Time: {} / Used Cache: {}".format(now, weahter_response.from_cache))
		print("Time: {} / Used Cache: {}".format(now, geolookup_response.from_cache))
		print()

		weahter_response = weahter_response.json()
		geolookup_response = geolookup_response.json()

		#extracting the data we need to send to the client from json response 
		dayone	 	= weahter_response['forecast']['txt_forecast']['forecastday'][0]
		nightone 	= weahter_response['forecast']['txt_forecast']['forecastday'][1]
		daytwo 	 	= weahter_response['forecast']['txt_forecast']['forecastday'][2]
		nighttwo 	= weahter_response['forecast']['txt_forecast']['forecastday'][3]
		daythree 	= weahter_response['forecast']['txt_forecast']['forecastday'][4]
		nightthree 	= weahter_response['forecast']['txt_forecast']['forecastday'][5]

		dayonetemphigh = weahter_response['forecast']['simpleforecast']['forecastday'][0]['high']
		dayonetemplow  = weahter_response['forecast']['simpleforecast']['forecastday'][0]['low']
		daytwotemphigh = weahter_response['forecast']['simpleforecast']['forecastday'][1]['high']
		daytwotemplow  = weahter_response['forecast']['simpleforecast']['forecastday'][1]['low']
		daythreetemphigh = weahter_response['forecast']['simpleforecast']['forecastday'][2]['high']
		daythreetemplow = weahter_response['forecast']['simpleforecast']['forecastday'][2]['low']


		#extract location information

		city 	= geolookup_response['location']['city']
		state	= geolookup_response['location']['state']
		country = geolookup_response['location']['country_name']

		# a dictionary to hold all the aquired information
		response_dict = {'type':'success', 'data':{'city':city, 'state':state, 'country':country, 'dayone': (dayone, nightone, {'high': dayonetemphigh, 'low': dayonetemplow}), 
						 'daytwo': (daytwo, nighttwo, {'high': daytwotemphigh, 'low': daytwotemplow}), 
						 'daythree': (daythree, nightthree, {'high': daythreetemphigh, 'low': daythreetemplow})}}

		# careate a json from dictionary and return

		json_response = json.dumps(response_dict)
		return json_response

	else:
		#if there is an error in the api key this will be return to the user
		return json.dumps({'type': 'error', 'data': 'Invalid api key'})

	

	
#when sending requests to wrong url or a url with missing arguments return error message

@app.errorhandler(404)
def wrong_request(e):

	return json.dumps({'type': 'error', 'data': 'the url you requested doesn\'t exist'})


@app.errorhandler(500)
def bad_request(e):

	return json.dumps({'type':'error', 'data': 'bad request'})

if __name__ == '__main__':
	app.run()