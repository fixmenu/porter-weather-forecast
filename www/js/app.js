// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])
  .controller('weatherController', function ($scope, $ionicModal, $cordovaGeolocation, $http, $ionicPopup) {
    $scope.view = 'currentlyView';
    $scope.weatherInfo = {};
    $scope.weatherInfoDaily = {};
    $scope.weatherInfoHourly = {};
    $scope.myPlaces = [];
    $scope.city = {};
    $scope.state = 'current';
    $scope.selectedDateData = {};

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    isToday = (date) => {
      var today = new Date();
      if (date.getDate() == today.getDate()) {
        return true;
      }
      else {
        return false;
      }
    }

    $scope.getDateAndMonthName = function (timestamp) {
      var date = new Date(timestamp * 1000);
      return date.getDate() + " " + shortMonths[date.getMonth() + 1];
    }

    $scope.getDayName = function (timestamp) {
      var date = new Date(timestamp * 1000);
      if (isToday(date)) {
        return 'TODAY';
      } else {
        return days[date.getDay()];
      }
    }

    $scope.getTimestampAsHour = function (timestamp) {
      var date = new Date(timestamp * 1000);
      return date.getHours() + ":00";
    }


    this.$onInit = () => {
      $scope.city.selected = 'current';
      setCurrentPositionWeatherInfo();
      console.log("WeatherInfo Log");
      console.log($scope.weatherInfo);
    }

    $scope.doRefresh = function () {
      if ($scope.city.selected == 'current') {
        setCurrentPositionWeatherInfo();
      } else {
        var city = $scope.myPlaces.find(function (element) {
          return element.name == $scope.city.selected;
        });
        $scope.weatherInfo = {};
        setWeatherInfo(city.name, city.data.latitude, city.data.longitude);
      }
    }

    var setWeatherInfo = function (name, lat, long) {
      var url = 'https://mighty-journey-37381.herokuapp.com/getWeatherInfo/' + lat + '/' + long;
      $http.get(url).success(function (data) {
        $scope.weatherInfo = data;
        if (name != null) {
          $scope.weatherInfo.timezone = name;
        }
      }).error(function (error) {
        console.log("Current Weather Info Request Error");
      })
    }

    $scope.openMyPlaces = function () {
      $scope.view = 'currentlyView';
    }

    $scope.openPlaces = function () {
      $scope.view = 'weeklyView';
    }

    $scope.openSettingsView = function () {
      $scope.view = 'settingsView';
    }

    $scope.openHourlyView = function (item) {
      $scope.selectedDateData = item;
      console.log($scope.selectedDateData);
      $scope.view = 'hourlyView';
    }

    $scope.checkIfThereIsACity = function () {
      $scope.myPlaces.$isEmpty();
    }

    $scope.checkIfThereIsACity = function () {
      return $scope.myPlaces != null;
    }

    var setCurrentPositionWeatherInfo = function () {
      $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: false}).then(
        function (position) {
          var lat = position.coords.latitude;
          var long = position.coords.longitude;
          setWeatherInfo(null, lat, long);
        }
      )
    }

    $scope.convertToDate = function (timestamp) {
      var date = new Date(timestamp * 1000);
      return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    }

    $scope.showPopup = function () {
      var myPopup = $ionicPopup.show({
        templateUrl: '../views/popup.html',
        scope: $scope,
        buttons: [
          {
            text: '<b>Confirm</b>',
            type: 'button-positive',
            onTap: function (e) {
              $scope.doRefresh();
            }
          }
        ]
      });

      myPopup.then(function (res) {
      });
    };


    var addPlaceHandler = function (cityName) {
      var url = 'https://mighty-journey-37381.herokuapp.com/getCityCoord/' + cityName;
      var myplaceData = {};
      $http.get(url).success(function (data) {
        var url2 = 'https://mighty-journey-37381.herokuapp.com/getWeatherInfo/' + data.latitude + '/' + data.longitude;
        $http.get(url2).success(function (weatherData) {
          myplaceData.name = data.name;
          myplaceData.data = weatherData;
        });
        $scope.myPlaces.push(myplaceData)
      })

    }

    $scope.addPlace = function () {
      $ionicPopup.show({
        title: 'Add a city',
        template: '<input ng-model="city.name"/>', // the preset value show 0, which is expected.
        scope: $scope,
        buttons: [{text: 'Cancel'}, {
          text: '<b>Confirm</b>',
          type: 'button-positive',
          onTap: function (e) {
            $scope.state = $scope.city.selected;
            addPlaceHandler($scope.city.name);
          }
        }]
      });
    }
  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs).
      // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
      // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
      // useful especially with forms, though we would prefer giving the user a little more room
      // to interact with the app.
      if (window.cordova && window.Keyboard) {
        window.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        // Set the statusbar to use the default style, tweak this to
        // remove the status bar on iOS or change it to use white instead of dark colors.
        StatusBar.styleDefault();
      }
    });
  })
