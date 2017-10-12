// angular.module('starter.controllers', ['ajoslin.promise-tracker'])
angular.module('Jhu.controllers', [])

// .controller('AppCtrl', function($scope, $ionicModal, $timeout, AuthCtrl, $user, $location, $http, promiseTracker) {
.controller('AppCtrl', function($scope, $ionicModal, $timeout, AuthCtrl, $user, $userSurvey, $location, $state, $ionicHistory,$ionicLoading) {

  //Create a new tracker
  // $scope.loadingTracker = promiseTracker();
  //
  // //use `addPromise` to add any old promise to our tracker
  // $scope.delaySomething = function() {
  //   var promise = $timeout(function() {
  //     console.log('Delayed something!');
  //   }, 1000);
  //   $scope.loadingTracker.addPromise(promise);
  // };

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:

  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  //Check if authenticated on page load


  // Form data for the login modal
  $scope.loginData = {};
  $scope.signupData = {};

if(_isNotMobile){
  if(AuthCtrl.isAuthenticated()){
    $state.go('app.home');
  }else{
    $state.go('login');    
  }

}else{


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/mobile/login.html', {
    id: '1',
    // tracker: $scope.loadingTracker,
    scope: $scope,
    animation: 'slide-in-down',
    focusFirstInput: false,
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.oModal1 = modal;
    if(AuthCtrl.isAuthenticated()) {
      // console.log('this is already authenticated');
      $userSurvey.get_patients_survey({
      }, function(collection) { // Success callback
        // Use the collection data returned
        // console.log('collection is ', collection);
        // console.log('collection length is ', collection.length);
        if(collection.length > 0 && collection[0].is_complete === false) {
          $state.go('app.home');
        } else {
          $state.go('app.videos');
        }
      }, function(err) { // Error callback
        console.log('collection is ERRORROORO', err);
        // There was an error while fetching the data
      });
    } else {
      console.log('not authenticated yet');
      $scope.oModal1.show();
      
    }
  });

  // Create the registration modal that we will use later
  $ionicModal.fromTemplateUrl('templates/mobile/signup.html', {
    id: '2',
    // tracker: $scope.loadingTracker,
    scope: $scope,
    animation: 'slide-in-down',
    focusFirstInput: false,
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.oModal2 = modal;
  });

  // Create the signup success modal that we will use later
  $ionicModal.fromTemplateUrl('templates/mobile/signup-success.html', {
    id: '3',
    // tracker: $scope.loadingTracker,
    scope: $scope,
    animation: 'slide-in-down',
    focusFirstInput: false,
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.oModal3 = modal;
  });


}
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.oModal1.hide();
  };

  $scope.closeSignup = function() {
    $scope.oModal2.hide();
  };

  $scope.closeSignupSuccess = function() {
    $scope.oModal3.hide();
  };


  // Open the login modal
  $scope.login = function() {
    $scope.oModal1.show();
  };
  $scope.logout = function() {
    AuthCtrl.logout();
  };
  $scope.isAuthenticated = function() {
    return AuthCtrl.isAuthenticated();
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var isAuthenticated = AuthCtrl.login({
      email: $scope.loginData.username,
      password: $scope.loginData.password
    });
    $ionicLoading.show();
  };

  $scope.doSignup = function() {
    $ionicLoading.show();
    // console.log('what is the signup body?', $scope.signupData);
    // console.log('$user is', $user);
    var instance = $user.create();
    instance.clinician_code_id = $scope.signupData.clinician_code_id;
    instance.first_name = $scope.signupData.first_name;
    instance.last_name = $scope.signupData.last_name;
    instance.email = $scope.signupData.email;
    instance.password = $scope.signupData.password;
    instance.password_confirmation = $scope.signupData.password_confirmation;
    instance.cell_phone = $scope.signupData.cell_phone;
    instance.home_phone = $scope.signupData.home_phone;
    instance.address = $scope.signupData.address;
    instance.city = $scope.signupData.city;
    instance.state = $scope.signupData.state;
    instance.postal_code = $scope.signupData.postal_code;
    instance.contact_name = $scope.signupData.contact_name;
    instance.contact_cell_phone = $scope.signupData.contact_cell_phone;
    instance.contact_email = $scope.signupData.contact_email;
    instance.contact_home_phone = $scope.signupData.contact_home_phone;
    // To save the instance do
    // instance.$save({tracker: $scope.loadingTracker}).then(function() {
    instance.$save().then(function() {
      $ionicLoading.hide();
      $scope.closeSignup();
      $scope.oModal3.show();
    })
    .catch(function(err){
        $ionicLoading.hide();
      
    });
  };

  $scope.signup = function() {
    $scope.closeLogin();
    $scope.oModal2.show();
  };

  $scope.signupSuccess = function() {
    $scope.closeSignupSuccess();
    $scope.login();
  };

  $scope.incorrectLoginFunction = function(bool) {
    return bool;
  };

  $scope.takeSurvey = function (){
    $userSurvey.get_patients_survey({
    }, function(collection) { // Success callback
      // Use the collection data returned
      // console.log('collection is ', collection);
      // console.log('collection length is ', collection.length);
      if(collection.length > 0 && collection[0].is_complete === false) {
        $state.go('app.home');
      } else {
        $state.go('app.videos');
      }
    }, function(err) { // Error callback
      console.log('collection is ERRORROORO', err);
      // There was an error while fetching the data
    });
  };

  $scope.$on('$destroy', function() {
    // console.log('Destroying modals...');
    $scope.oModal1.remove();
    $scope.oModal2.remove();
  });

  $scope.$on('auth-loginRequired', function(event, args) {
    $scope.incorrectLogin = $scope.incorrectLoginFunction(true);
    // console.log(args.data.message);
    $ionicLoading.hide();
  });
  $scope.$on('auth-loginSuccess', function(event, args) {
    $scope.incorrectLogin = $scope.incorrectLoginFunction(false);
    $scope.closeLogin();
    // console.log(args.data.firstName + ' ' + args.data.lastName + ' has logged in.');
    $userSurvey.get_patients_survey({
    }, function(collection) { // Success callback
      // Use the collection data returned
      // console.log('collection is ', collection);
      // console.log('collection length is ', collection.length);
      if(collection.length > 0 && collection[0].is_complete === false) {
        $state.go('app.home');
      } else {
        $state.go('app.videos');
      }
      $ionicLoading.hide();
    }, function(err) { // Error callback
      console.log('collection is ERRORROORO', err);
      $ionicLoading.hide();
      // There was an error while fetching the data
    });
    // console.log('the auth settings? where is the role and shit', AuthCtrl.userRole());
  });
  $scope.$on('auth-logoutSuccess', function(event, args) {
    console.log(args.data.firstName + ' ' + args.data.lastName + ' has logged out.');
    $scope.login();
  });

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('InviteCtrl', function($scope, $ionicModal, AuthCtrl, $user, $userSurvey, $userSurveyAnswer, $location, $state, $ionicHistory) {
  $scope.profileData = {};
  // $ionicHistory.nextViewOptions({
  //   disableBack: false
  // });

  //var authData = AuthCtrl.getAuthData();
  //console.log('what is the auth data', authData);
  $scope.invite = function() {

    $state.go('app.invite');
  };

  $scope.addInvite = function() {
    $state.go('app.addInvite');
  }
  // $scope.save = function() {
  //
  // };
})


.controller('NotificationsCtrl', function($scope, $ionicModal, AuthCtrl, $user, $userSurvey, $userSurveyAnswer, $location, $state, $ionicHistory) {
  $scope.profileData = {};
  // $ionicHistory.nextViewOptions({
  //   disableBack: false
  // });

  //var authData = AuthCtrl.getAuthData();
  //console.log('what is the auth data', authData);
  $scope.notifications = function() {

    $state.go('app.notifications');
  };

  // $scope.save = function() {
  //
  // };
})

.controller('ProfileCtrl', function($scope, $ionicModal, AuthCtrl, $user, $userSurvey, $userSurveyAnswer, $location, $state, $ionicHistory) {
  $scope.profileData = {};
  $ionicHistory.nextViewOptions({
    disableBack: false
  });

  //var authData = AuthCtrl.getAuthData();
  //console.log('what is the auth data', authData);
  $scope.profile = function() {

    $state.go('app.profile');
  };

  // $scope.save = function() {
  //
  // };
})

.controller('SurveyCtrl', function($scope, $ionicModal, $userSurvey, $userSurveyAnswer, $location, $state, $ionicHistory,$ionicLoading) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  // Create the survey status modal that we will use later
  $scope.question = [];
  $scope.questionData = {};
  $ionicModal.fromTemplateUrl('templates/mobile/survey.html', {
    id: '4',
    // tracker: $scope.loadingTracker,
    scope: $scope,
    animation: 'slide-in-down',
    focusFirstInput: false,
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.oModal4 = modal;
  });

  $scope.closeSurvey = function() {
    $scope.oModal4.hide();
  };

  $scope.surveyStart= function () {
    $ionicLoading.show();
    $userSurvey.get_patients_survey({
    }, function(collection) { // Success callback
      // Use the collection data returned
      if(collection.length > 0 && collection[0].is_complete === false) {
        $userSurvey.nextquestion({
          query: { // In query go the parameters for the scope
            usersurveyid: collection[0].id
          },
        }, function(collection1) { // Success callback
          // Use the collection data returned
          $scope.question = collection1[0].nextquestion;
          // console.log('next question', $scope.question);
          if($scope.question !== null && $scope.question !== undefined) {
            // console.log('$scope.question is not null nor is it undefined');
            if('is_complete' in $scope.question) {
              if($scope.question.is_complete === true) {
                $scope.oModal4.hide();
                $state.go('app.videos');

              }
            } else {
              // console.log('$scope.question has a next question that is VALID WIJOIJEOFJWIOEFJOWEF');
              $scope.questionData.primarykey = $scope.question.user_survey_answer_pk_id;
              $scope.oModal4.show();
            }
            $ionicLoading.hide();
          } else {
            $state.go('app.videos');
          }
        }, function(err) { // Error callback
          // There was an error while fetching the data
          $ionicLoading.hide();
        });
      } else {
        $ionicLoading.hide();
        $scope.oModal4.hide();
        $state.go('app.videos');

      }
    }, function(err) { // Error callback
      // There was an error while fetching the data
    });
  }

  $scope.whichPossibleAnswer = function(answerId) {
    // console.log('lets check if we need to check bruh', answerId);
    return false;
  }

  $scope.nextQuestion = function() {
    // console.log('scope of questionData', $scope.questionData.answer);
    $ionicLoading.show();
    $userSurveyAnswer.get({ id: $scope.questionData.primarykey }).then(function(response) {
      // The instance with id = "1" got fetched
      // instance data is in response.data
      // console.log('scope of questionData', $scope.questionData.answer);
      response.survey_answer_id = $scope.questionData.answer;
      if("freeFormAnswer" in $scope.questionData){
        response.free_form_response = $scope.questionData.freeFormAnswer;
      }
      response.$save().then(function() {
          // console.log('scope is ', $scope);
          $scope.oModal4.show();
          $scope.surveyStart();
          $ionicLoading.hide();
      }).catch(function(err){
        $ionicLoading.hide();
      
      });
    });
  }

  $scope.previousQuestion = function() {
    $ionicLoading.show();
    $userSurvey.get_patients_survey({
    }, function(collection) { // Success callback
      // Use the collection data returned
      if(collection.length > 0) {
        $userSurvey.previousquestion({
          query: { // In query go the parameters for the scope
            usersurveyid: collection[0].id
          },
        }, function(collection1) { // Success callback
          // Use the collection data returned
          $scope.question = collection1[0].previousquestion;
          $scope.questionData.primarykey = $scope.question.user_survey_answer_pk_id;
          $scope.questionData.primarykey = $scope.question.user_survey_answer_pk_id;
          $scope.oModal4.show();
          $ionicLoading.hide();
        }, function(err) { // Error callback
          // There was an error while fetching the data
          $ionicLoading.hide();
        });
      } else {
        $ionicLoading.hide();
        $state.go('app.videos');
      }
    }, function(err) { // Error callback
      // There was an error while fetching the data
       $ionicLoading.hide();
    });
  }
  // $scope.surveyStart = function() {
  //   $scope.surveyStart = $userSurvey.UserSurveyGetPatientsSurvey();
  //
  // }
});
