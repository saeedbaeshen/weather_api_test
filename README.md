# weather_api_test

This is a simple falsk api that returns weather forecast for the next 3 days using weather underground api. 
You can run this web service on a localhost or a remote host. 

There are two parts of this application the backend, using flask server, and the client part, using angularjs. 
To test this api you can go to http://weather.nsaym.com which host the client part of the app. 
The web service backend is hosted on my account on http://pythonanywhere.com 

===========================================================

### Installing on localhost

You will need to install the following python pakcages 

-flask          (a python micro web server)
-requests       (to send requests to weather underground api)
-requests_cache (to keep the requested data for a specific period of time, see blow for more details)
-flask-cors     (to allow corss origin resources)

using the pip commands
```
$ pip install flask
```
```
$ pip install requests
```
```
$ pip install requests-cache
```
```
$ pip install -U flask-cors
```

from the terminal run the api.py file
this will start the flask server at 127.0.0.1:5000

The api link is at 
127.0.0.1:5000/api/?key=your_secert_key&zipcode=00000

From the client folder run the index.html.

Note: if you are testing this on a local machine then you need to go to "client/main/controllers/MainController.js"
and update the url variable at line 7 to make it point to "127.0.0.1:5000/api/" or "your_local_host_ip:5000/api/"

For simplicity the api key for the flask server is stored in a list. This could be changed to query a database to check whether the key exist or not. 


### requests_cache

I used requests_cache to be able to cache requests using the same query parameters for one hour before they are flushed. This helps to limit the number of HTTP requests to the external api to improve performance. 

The following line uses the install_cache() method to cache the response

```
requests_cache.install_cache('weather_api_cache', backend='sqlite', expire_after=3600)
```

The first parameter specify the name of the file when the database is created
the second parameter specify the type of the database. Here I am using sqlite
the third parameter specify the amount of time in seconds you need to keep the data before they are removed. In my case
I set it to 3600 (1 hour)



### Installing on remote host

When running the api.py on a remote host make sure to change the url variable in "client/main/controllers/MainController.js" to point to 
the remote host.


