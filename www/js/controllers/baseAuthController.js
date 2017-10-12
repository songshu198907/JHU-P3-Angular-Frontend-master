angular.module('Jhu.controllers')
  .controller('BaseCtrl', ['$scope', '$mdDialog', 'AuthCtrl', '$state', '$user', 'cfpLoadingBar', '$sessionStorage', '$ionicViewSwitcher', '$authenticationStorageService', '$ionicLoading','$setting',
    function($scope, $mdDialog, AuthCtrl, $state, $user, cfpLoadingBar, $sessionStorage, $ionicViewSwitcher, $authenticationStorageService, $ionicLoading,$setting) {
      if (AuthCtrl.isAuthenticated()) {
        

        if (!$sessionStorage.user) {
          

          $sessionStorage.user = $authenticationStorageService.getSession(baseUrl);
          $user.myprofile({}, function(response) { // Success callback

            
            $scope.updateUserObject(response[0], $sessionStorage.user);
            $scope.displayName = $sessionStorage.user.firstName + ' ' + $sessionStorage.user.lastName;
          });
        }
        if(!$sessionStorage.setting){
            $setting.all({
                }, function(collection) { // Success callback
                    // Use the collection data returned
                    $sessionStorage.setting = collection[0];
                    
                }, function(err) { // Error callback
                    // There was an error while fetching the data
                });
        }
      } else {
        $state.go('login');
      }

      if ($sessionStorage.user) {
        var user = $sessionStorage.user
        $scope.displayName = user.firstName.charAt(0)+"."+user.lastName+" ("+user.id+")";
        $scope.enrollmentId= user.enrollmentId;
      }

      $scope.logout = function() {
        
        //cfpLoadingBar.start();
        $scope.showActivityIndicator();
        AuthCtrl.logout();
        $sessionStorage.$reset();

        setTimeout(function() {
          $scope.hideActivityIndicator();
          //cfpLoadingBar.complete();
        }, 2000);

      };
      sessionExpired = function(event, args) {
        
        $mdDialog.hide();
        setTimeout(function() {


          $mdDialog.hide();
          // console.log("dilaog shown");
          if (!$state.is('login')) {
            $mdDialog.show({
              //clickOutsideToClose: true,
              scope: $scope, // use parent scope in template
              preserveScope: true, // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog) {
                $scope.title = 'Session Timeout';
                $scope.body = 'Your session has timed out.  You must login again.';
                $scope.closeDialog = function() {
                  $scope.logout();
                  $mdDialog.hide();
                  var length = angular.element(document).find('md-dialog').length;
                  
                  for (var i = 0; i < length; i++) {
                    $mdDialog.hide();
                  }

                }
              }
            });
          }

          $scope.hideActivityIndicator();
          //cfpLoadingBar.complete();// complete the activity indicator
        }, 500);

      }

      if (typeof deregisterListener !== "undefined") {
        deregisterListener();
      }
      deregisterListener = $scope.$on('auth-loginRequired', sessionExpired);


      $scope.$on('auth-logoutSuccess', function(event, args) {
        $ionicViewSwitcher.nextDirection('back'); // 'forward', 'back', etc.
        $state.go('login');
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.close();
        }
        $scope.hideActivityIndicator();
        //cfpLoadingBar.complete();// complete the activity indicator
        $mdDialog.hide();
      });

      $scope.updateUserObject = function(fromObj, ToObj) {

        ToObj.firstName = fromObj.first_name;
        ToObj.lastName = fromObj.last_name;
        ToObj.cellPhone = fromObj.cell_phone;
        ToObj.homePhone = fromObj.home_phone;
        ToObj.city = fromObj.city;
        ToObj.state = fromObj.state;
        ToObj.address = fromObj.address;
        ToObj.postalCode = fromObj.postal_code;
        ToObj.contactCellPhone = fromObj.contact_cell_phone;
        ToObj.contactEmail = fromObj.contact_email;
        ToObj.contactHomePhone = fromObj.contact_home_phone;
        ToObj.contactName = fromObj.contact_name;
        ToObj.expectedChildBirth = fromObj.expected_child_birth;
        ToObj.actualChildBirth = fromObj.actual_child_birth;
        ToObj.raceId = fromObj.race_id;
        ToObj.educationId = fromObj.education;
        ToObj.password = fromObj.password;
        ToObj.passwordConfirmation = fromObj.password_confirmation;
        ToObj.vaccinationReminders = fromObj.vaccination_reminders;

      }
      $scope.showActivityIndicator = function() {
        if (_isNotMobile) {
          cfpLoadingBar.start();
        } else {
          $ionicLoading.show();
        }

      }
      $scope.hideActivityIndicator = function() {
        if (_isNotMobile) {
          cfpLoadingBar.complete();
        } else {
          $ionicLoading.hide();
        }
      }

    }
  ]);
