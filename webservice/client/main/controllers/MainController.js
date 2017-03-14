
angular.module('API.Main')
	.factory('getWeather', function($http){

		var queryAPI = {};

		var url = 'http://saeedomar.pythonanywhere.com/api';
		var api_key = 'd6e0b8cd18ec0248d6e0b18ec0248';
		queryAPI.sendQuery = function (zipcode){
			var promise = $http({
				method:"GET",  
				url: url, 
				params: {key:api_key, zipcode: zipcode}
			});
		
			return promise;
		}

		return queryAPI;


	})
	.controller('MianController', function($scope, getWeather){
		
		$scope.zipcode = "";
		$scope.showloader = false;
		$scope.showErrorMsg = false;
		$scope.errormsg = "";
		$scope.showInfoMsg = false;
		$scope.showResult = false;
		$scope.result = "";
		$scope.infomsg = "";
		$scope.maxlength = 5;
		$scope.buttonDisable = false;


		$scope.submitForm = function(){
			$scope.showloader = true;
			$scope.buttonDisable = true;
			$scope.errormsg   = "";
			$scope.result = "";
			if($scope.showResult)
				$scope.showResult = false;
			if($scope.showErrorMsg)
				$scope.showErrorMsg = false;
			if($scope.showInfoMsg)
				$scope.showInfoMsg = false;

			// first line defense
			// checking the client inputs to make sure it confirms to api rules
			if($scope.zipcode == "")
			{
				$scope.errormsg = "Enter a zipcode";
				$scope.showErrorMsg = true;	
				$scope.showloader = false;
				$scope.buttonDisable = false;

			}
			else if($scope.zipcode.length != 5){
				$scope.errormsg = "Zipcode must be 5 numbers";
				$scope.showErrorMsg = true;	
				$scope.showloader = false;
				$scope.buttonDisable = false;

			}
			else if((! /^[0-9]+$/.test($scope.zipcode)))
			{
				$scope.errormsg = "Zipcode must contain only numbers";
				$scope.showErrorMsg = true;	
				$scope.showloader = false;
				$scope.buttonDisable = false;

			}
			else{
				var promise = getWeather.sendQuery($scope.zipcode);

				promise.then(function(data, status){
					$scope.showloader = false;
					$scope.buttonDisable = false;
					
					var api_response = data.data;

					if(api_response.type === 'error'){
						$scope.errormsg = api_response.data;
						$scope.showErrorMsg = true;
					}
					else{
						api_response = api_response.data;
						$scope.infomsg = api_response.city + ',' + api_response.state + '  ' + api_response.country;
						$scope.showInfoMsg = true;
						$scope.showResult = true;
						var weather_information = {};

						weather_information.dayone = {
							'icon' : api_response.dayone[0].icon_url,
							'daytitle' : api_response.dayone[0].title,
							'daydescription' : api_response.dayone[0].fcttext,
							'nightdescription' : api_response.dayone[1].fcttext,
							'daytempf' : api_response.dayone[2].high.fahrenheit,
							'daytempc' : api_response.dayone[2].high.celsius,
							'nighttempf' : api_response.dayone[2].low.fahrenheit,
							'nighttempc' : api_response.dayone[2].low.celsius
						};
						weather_information.daytwo = {
							'icon' : api_response.daytwo[0].icon_url,
							'daytitle' : api_response.daytwo[0].title,
							'daydescription' : api_response.daytwo[0].fcttext,
							'nightdescription' : api_response.daytwo[1].fcttext,
							'daytempf' : api_response.daytwo[2].high.fahrenheit,
							'daytempc' : api_response.daytwo[2].high.celsius,
							'nighttempf' : api_response.daytwo[2].low.fahrenheit,
							'nighttempc' : api_response.daytwo[2].low.celsius
						};
						weather_information.daythree = {
							'icon' : api_response.daythree[0].icon_url,
							'daytitle' : api_response.daythree[0].title,
							'daydescription' : api_response.daythree[0].fcttext,
							'nightdescription' : api_response.daythree[1].fcttext,
							'daytempf' : api_response.daythree[2].high.fahrenheit,
							'daytempc' : api_response.daythree[2].high.celsius,
							'nighttempf' : api_response.daythree[2].low.fahrenheit,
							'nighttempc' : api_response.daythree[2].low.celsius
						};
					

						$scope.weather_information = weather_information;
					}

				});

			}
			
		}
	});
