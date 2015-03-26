var netherTest = angular.module('NetherTest', ['ngResource']);

netherTest.controller('NetherTestController', function($scope, $resource, $interval) {

  var interval = 1000;

  $scope.locCoords = {lat: 0, lon: 0}
  $scope.destCoords = {lat: 0, lon: 0}
  $scope.sleeping = false;


  function updateLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
    getDistanceFromLatLonInKm($scope.locCoords.lat, $scope.locCoords.lon, $scope.destCoords.lat, $scope.destCoords.lon);
    getEstimatedSleep();
    getCurrentLocation();
    if ($scope.locCoords.lat != 0) {
      getCurrentLocation();
    }
  };

  function showPosition(position) {
    $scope.locCoords = {lat: position.coords.latitude,
                        lon: position.coords.longitude}
  };

  $scope.sleep = function() {
    $scope.sleeping = true;
    $scope.promise = $interval(updateLocation, interval);
    var searchResource = $resource('https://api.postcodes.io/postcodes/' + $scope.destination)

    searchResource.get(function (data) {
      $scope.destCoords = {lat: data.result.latitude,
                           lon: data.result.longitude};
      $scope.destination = '';
      getDestinationLocation();
    });
  };

  $scope.cancelSleep = function() {
    $scope.sleeping = false;
    $interval.cancel($scope.promise);
    $scope.locCoords = {lat: 0, lon: 0}
    $scope.destCoords = {lat: 0, lon: 0}
  }

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    $scope.distanceBetween = d;
    if (d < 1) {
      navigator.notification.vibrate(2500);
      navigator.notification.beep(3);
        };
  };

  function getEstimatedSleep() {
    var avSpeed = 30;
    $scope.estimatedSleep = Math.round(60 * $scope.distanceBetween / avSpeed);
  };

  function getCurrentLocation() {
    var areaSearch = $resource('http://pelias.mapzen.com/reverse?', {lat: $scope.locCoords.lat, lon: $scope.locCoords.lon});

    areaSearch.get(function (data) {
      $scope.currentLocation = data.features[0].properties.text;
    });
  };

  function getDestinationLocation() {
    var areaSearch = $resource('http://pelias.mapzen.com/reverse?', {lat: $scope.destCoords.lat, lon: $scope.destCoords.lon});
    areaSearch.get(function (data) {
      $scope.destLocation = data.features[0].properties.text;
    });
  };

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  };

    // $scope.alert = function() {
    //   navigator.notification.vibrate(2500);
    // }

    // Show a custom alert
    //
    // $scope.showAlert = function showAlert() {
    //     navigator.notification.alert(
    //         'You are the winner!',  // message
    //         'Game Over',            // title
    //         'Done'                  // buttonName
    //     );
    // }

    // // Beep three times
    // //
    // $scope.playBeep = function playBeep() {
    //     navigator.notification.beep(3);
    // }

    // // Vibrate for 2 seconds
    // //
    // $scope.vibrate =function vibrate() {
    //       navigator.notification.vibrate(2500);
    // }

});