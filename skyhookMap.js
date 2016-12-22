var skyhookMap = angular.module("skyhookMap", ['ngAnimate']);
// var pie;

skyhookMap.controller("skyhookMapController", function($scope, $http) {
	$scope.ipaddress = "";
	$scope.ipPlaceholder = "Enter an IP";
	$scope.ips = [];
	$scope.order = "properties.ipDecimal";
	$scope.mouseoverItem = "";
	$scope.loading = false;
	$scope.map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 37.875539, lng: -123.278476},
	  zoom: 8,
	  maxZoom: 13
	});

	// $scope.map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById("graph"));
	// $scope.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(document.getElementById("description"));
	var d = new Date();
	d.setMonth(d.getMonth() - 3)

	$scope.defaultDate = "";
	console.log($scope.defaultDate);

	$scope.dateFilter = function(item){
		if ($scope.defaultDate !== ""){
			var date = new Date(item.properties.date);
			return (date > $scope.defaultDate);
		} else {
			return true
		};
	};

	$scope.filterMarker = function(){
		$scope.map.data.setStyle(function(feature){
			if ($scope.defaultDate !== ""){
				var date = new Date(feature.getProperty("date"));
				if (date < $scope.defaultDate) {
					return ({visible: false});
				} else {
					return ({visible: true});
				};
			} else {
				return ({visible: true});
			}
		});
	};

	$scope.sortBy = function(column){
		if ($scope.order === column) {
			$scope.order = "-" + column;
		} else {
			$scope.order = column;
		};
	};

	var zoom = function(map) {
		var bounds = new google.maps.LatLngBounds();
		map.data.forEach(function(feature) {
		  // console.log(feature);
		  processPoints(feature.getGeometry(), bounds.extend, bounds);
		});
		map.fitBounds(bounds);
	};
	var processPoints = function(geometry, callback, thisArg) {
		if (geometry instanceof google.maps.LatLng) {
		  callback.call(thisArg, geometry);
		} else if (geometry instanceof google.maps.Data.Point) {
		  callback.call(thisArg, geometry.get());
		} else {
		  geometry.getArray().forEach(function(g) {
		    processPoints(g, callback, thisArg);
		  });
		}
	};

	$scope.goSkyhook = function(){
		if ($scope.ipaddress) {
			$scope.loading = true;
			$http.get("http://10.96.162.34:5555/"+$scope.ipaddress) 
			        .then(function(response){
			          var data = response.data;
			          console.log(data);

			          $scope.map.data.forEach(function(feature){
			            $scope.map.data.remove(feature);
			          });
			          $scope.map.data.addGeoJson(data);
			          if (data.features.length !== 0) {
			          	$scope.ips = data.features;
			            zoom($scope.map);
			          } else {
			          	$scope.ips = [{properties:{ip:"No Skyhook."}}];
			          };
			          $scope.loading = false;
			        });

			$scope.ipPlaceholder = $scope.ipaddress;
			$scope.ipaddress = "";
		};
	};

	$scope.mouseoverList = function(ip){
		$scope.mouseoverItem = ip;
		$scope.map.data.setStyle(function(feature){
			return markerStyler(feature, ip);
		});
	};

	$scope.map.data.addListener("click", function(event){
		$scope.map.data.setStyle(function(feature){
			return markerStyler(feature, event.feature.f.ip);
		});
		$scope.$apply(function(){
			$scope.mouseoverItem = event.feature.f.ip;
			// console.log($scope.mouseoverItem);
		});
	});

	$scope.neustarGreen = function(ip){
		if ($scope.mouseoverItem === ip) {
			return "neustar-green";
		};
	};

	var markerStyler = function(feature, ip) {
		var date = new Date(feature.getProperty("date"));
		if ( date >= $scope.defaultDate) {
			// return ({visible: false});
		
			if (feature.getProperty("ip") === ip) {
				// console.log(feature.getProperty("ip"));
				return ({
					icon: {url:'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
						   scaledSize: new google.maps.Size(50,50)},
					zIndex: 1000
				});
			} else {
				return ({visible: true});
			};
		} else {
			return ({visible: false});
		};
	};
});

skyhookMap.directive("datepicker", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "yy-mm-dd",
        onSelect: function (dateText) {
          var d = new Date(dateText);
          updateModel(d);
        }
      };
      elem.datepicker(options);
    }
  }
});