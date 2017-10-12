angular.module('Jhu.controllers')
  .controller('SignupCtrl', ['$rootScope', '$scope', '$state', '$user', 'cfpLoadingBar', '$ionicViewSwitcher', '$localStorage', '$race', '$education', 'AuthCtrl', '$sessionStorage', '$userSurvey', '$ionicLoading','$setting',
    function($rootScope, $scope, $state, $user, cfpLoadingBar, $ionicViewSwitcher, $localStorage, $race, $education, AuthCtrl, $sessionStorage, $userSurvey, $ionicLoading,$setting) {
      var me = $scope;
      $scope.signupData = {};
      $scope.scrollConfig = {
        autoHideScrollbar: false,
        theme: 'light',
        advanced: {
          updateOnContentResize: true
        },
        setHeight: $(document).height() - 40,
        scrollInertia: 0
      }
      $scope.today = new Date();

      $scope.min_date = new Date(
        $scope.today.getFullYear(),
        $scope.today.getMonth(),
        $scope.today.getDate()+1
      );

      $scope.max_date=new Date(
        $scope.today.getFullYear(),
        $scope.today.getMonth()+9,
        $scope.today.getDate()+1
      );

      $scope.min_date_mobile = $scope.min_date.toISOString().split('T')[0];
      $scope.max_date_mobile = $scope.max_date.toISOString().split('T')[0];

      var stateChangeSuccess = $scope.$on('$stateChangeSuccess', function() {
        if (AuthCtrl.isAuthenticated()) {
          if ($sessionStorage.user.role == 'administrator') {
            $state.go('admin');
          } else if ($sessionStorage.user.role == 'patient') {
            $scope.getPatientSurvey();
          } else if ($sessionStorage.user.role == 'health_care_provider') {
            $state.go('home.healthCare');
          }
        }
      });
      $scope.signedUpUserName = $localStorage.signedUpUserName;
      $scope.doSignup = function(pSignupForm) {
        console.log(pSignupForm.$valid);
        if (pSignupForm.$valid) {
          $scope.showActivityIndicator();
          //cfpLoadingBar.start();//start activity indicator
          //cfpLoadingBar.inc(); // increment the activity indicator
          var instance = $user.create();
          instance.clinician_code = $scope.signupData.clinician_code_id;
          instance.first_name = $scope.signupData.first_name;
          instance.last_name = $scope.signupData.last_name;
          instance.email = $scope.signupData.email;
          instance.password = $scope.signupData.password;
          instance.password_confirmation = $scope.signupData.password_confirmation;
          instance.cell_phone = $scope.signupData.cell_phone;
          instance.home_phone = $scope.signupData.home_phone;
          // instance.address = $scope.signupData.address;
          // instance.city = $scope.signupData.city;
          // instance.state = $scope.signupData.state;
          // instance.postal_code = $scope.signupData.postal_code;
          // instance.contact_name = $scope.signupData.contact_name;
          // instance.contact_cell_phone = $scope.signupData.contact_cell_phone;
          // instance.contact_email = $scope.signupData.contact_email;
          // instance.contact_home_phone = $scope.signupData.contact_home_phone;
          instance.expected_child_birth = $scope.signupData.expected_child_birth;
          instance.race_id = $scope.signupData.race;
          instance.education_id = $scope.signupData.education;
          // To save the instance do
          instance.$save()
            .then(function(success, error) {
              
              $localStorage.signedUpUserName = $scope.signupData.email;
              
              AuthCtrl.login({
                    email: $scope.signupData.email,
                    password: $scope.signupData.password
                  });
              setTimeout(function(){
                $scope.signupData = {};
                pSignupForm.$setUntouched(true);
                pSignupForm.$setDirty(false);
                pSignupForm.$setPristine(true);      
                $scope.hideActivityIndicator();
              },1300);
              
              
            })
            .catch(function(err) {
              $scope.hideActivityIndicator();
              
              $scope.signupData.message = (err.data && err.data.message != undefined ? err.data.message : err.statusText);
            });
        } else {
          $scope.signupData.message = "There are still invalid fields";
        }
      };

      $scope.cancelSignup = function() {
        $ionicViewSwitcher.nextDirection('back');
        delete $localStorage.signedUpUserName;
        $state.go("login");
      }

      //state management
      self = this;
      $scope.states = loadAll();
      // console.log('states are', $scope.states);
      $scope.querySearch = querySearch;
      //self.selectedItemChange = selectedItemChange;
      //self.searchTextChange   = searchTextChange;
      $scope.newState = newState;

      function newState(state) {
        alert("Sorry! You'll need to create a Constituion for " + state + " first!");
      }
      // ******************************
      // Internal methods
      // ******************************
      /**
       * Search for states... use $timeout to simulate
       * remote dataservice call.
       */
      function querySearch(query) {
        var results = query ? self.states.filter(createFilterFor(query)) : self.states,
          deferred;
        if (self.simulateQuery) {
          deferred = $q.defer();
          $timeout(function() {
            deferred.resolve(results);
          }, Math.random() * 1000, false);
          return deferred.promise;
        } else {
          return results;
        }
      }
      // function searchTextChange(text) {
      //   $log.info('Text changed to ' + text);
      // }
      // function selectedItemChange(item) {
      //   $log.info('Item changed to ' + JSON.stringify(item));
      // }
      /**
       * Build `states` list of key/value pairs
       */
      function loadAll() {
        var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware, \
		              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, \
		              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, \
		              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina, \
		              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, \
		              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, \
		              Wisconsin, Wyoming';
        return allStates.split(/, +/g).map(function(state) {
          return {
            value: state.toLowerCase(),
            display: state
          };
        });
      }
      /**
       * Create filter function for a query string
       */
      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
          return (state.value.indexOf(lowercaseQuery) === 0);
        };
      }


      $scope.races = $race.sorted_by_id();
      $scope.educations = $education.sorted_by_id();

      $scope.$on('auth-loginSuccess', function(event, args) {
      
        
        var lOriginalArgs=args.data;
        //save user data in session storage to be used later for update profile etc.
        args.data=JSON.parse(args.data);
        $sessionStorage.user=args.data;
        setTimeout(function(){
          if ($sessionStorage.user) {
            $scope.displayName = $sessionStorage.user.firstName.charAt(0)+"."+$sessionStorage.user.lastName+" ("+$sessionStorage.user.id+")";
            $scope.enrollmentId= $sessionStorage.user.enrollmentId;
          }
        },1000);
        

        $sessionStorage.user.showBirthModal = false;
        //save display name in session storage so that it is available on the home page.
        
        if(args.data.resetPassword){
          $state.go('updatePassword');
          $scope.hideActivityIndicator();
          //cfpLoadingBar.complete();//complete the activity indicator.
        }else if(args.data.parentUserId>0 && !args.data.consentAcceptedOn){
          $scope.showConsentAccepted();
          $scope.hideActivityIndicator();
          //cfpLoadingBar.complete();//complete the activity indicator.
        }else{
          
          if($sessionStorage.user.role == 'administrator') {
            
              $state.go('admin');
              $scope.hideActivityIndicator();
              //cfpLoadingBar.complete();//complete the activity indicator.
          } else if($sessionStorage.user.role == 'patient') {
            $scope.getUserSettings();
            $scope.getPatientSurvey();  
            //timeout set,due to issue in safari and internet explorer
            
          } else if ($sessionStorage.user.role == 'health_care_provider') {
            if(_isNotMobile){
              $state.go('home.healthCare');
            }else{
              $state.go('healthCare');
            }
            $scope.getUserSettings();
            $scope.hideActivityIndicator();
            //cfpLoadingBar.complete();//complete the activity indicator.
          } 
        }
        
        args.data=lOriginalArgs;
    });
    $scope.getUserSettings=function(){
      $setting.all({
          }, function(collection) { // Success callback
              // Use the collection data returned
              $sessionStorage.setting = collection[0];
              
          }, function(err) { // Error callback
              // There was an error while fetching the data
          });
    }

      $scope.getPatientSurvey=function(){
          $userSurvey.get_patients_survey({
              }, function(collection) { // Success callback
                // Use the collection data returned
                
                // console.log('collection is ', collection);
                // console.log('collection length is ', collection.length);
                
                $ionicViewSwitcher.nextDirection('forward');

                // console.log('what is the session storage user', $sessionStorage.user);
                if(collection.length > 0 && !collection[0].is_complete) {
                    $sessionStorage.survey=collection;
                    //take user to the home page and then display the survey partial view
                    // console.log("login page state set survey status");
                    stateChangeSuccess();
                    $state.go('home.surveyStatus'); 

                 } else {
                  
                    //take user to home page and then display the videos partial view
                    if(collection.length == 0) {
                      if($sessionStorage.user.patientType==0){
                        stateChangeSuccess();
                        $state.go("home.controluser");
                      }else{
                            $userSurvey.get_video_survey({}, function(collection) { // Success callback
                            if(collection.length > 0) {
                              if(!$sessionStorage.survey){
                                $sessionStorage.survey=[];
                              }
                              $sessionStorage.survey[0] = collection[0];
                              stateChangeSuccess();
                              $state.go('home.videoSurvey');
                            } else {
                              stateChangeSuccess();
                                $state.go('home.videoTiles');
                            }
                        });
                          }
                      } else {
                        if(collection[0].hasOwnProperty('matched_videos')){
                          var lVideos=collection[0].matched_videos;
                          if(lVideos.maternals.length > 0 || lVideos.pediatrics.length > 0 ) {
                            
                            var incompleteLength=_.filter(lVideos.maternals,function(video){ return video.is_complete==0;}).length+_.filter(lVideos.pediatrics,function(video){ return video.is_complete==0;}).length;
                            if(incompleteLength>1){
                              stateChangeSuccess();
                              $state.go("home.videos");
                            }else if(incompleteLength >0) {
                              stateChangeSuccess();
                                $state.go("home.videos2");
                            } else if(collection[0].maternal_video_complete == true && collection[0].pediatric_video_complete == true) {
                                if(collection[0].is_complete == true) { 
                                stateChangeSuccess();
                                  $state.go("home.videoTiles");
                                }
                              
                            } else if(collection[0].is_complete == true) {  
                              stateChangeSuccess();
                                  $state.go("home.videoTiles");
                                
                            }

                          } else if(collection[0].is_complete == true) {
                            stateChangeSuccess();
                              $state.go("home.videoTiles");
                             
                          }
                        } else if(collection[0].is_complete == true) {
                          stateChangeSuccess();
                            $state.go('home.videoTiles');
                          
                        }
                      
                    }
                    
                    
                 }
                 $scope.hideActivityIndicator();
                 //cfpLoadingBar.complete();//complete the activity indicator.
                 
              }, function(err) { // Error callback
                $scope.hideActivityIndicator();
                  //cfpLoadingBar.complete();//complete the activity indicator.
                  console.log('', err);
                  //$scope.loginData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
                // There was an error while fetching the data
              });
        
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
