angular.module('Jhu.controllers')
    .controller('HomeCtrl', ['$rootScope', '$scope','$controller', '$http','$state','$userSurvey','$userSurveyAnswer','$user','AuthCtrl','$sessionStorage', '$ionicViewSwitcher','cfpLoadingBar','$mdDialog','$race','$education','$window','$ionicPopover',
      function ($rootScope, $scope,$controller, $http,$state,$userSurvey,$userSurveyAnswer,$user,AuthCtrl,$sessionStorage, $ionicViewSwitcher,cfpLoadingBar,$mdDialog,$race,$education,$window,$ionicPopover) {

    $controller('BaseCtrl', { $scope: $scope });
    $scope.hideAnswers = true;
    if(typeof cordova!=="undefined"){
      cordova.plugins.Keyboard.disableScroll(true);
    }
    $scope.today=new Date();
    $scope.today_mobile= $scope.today.toISOString().split('T')[0];
  	$scope.updateProfileScrollConfig = {
			autoHideScrollbar: false,
			theme: 'light',
			advanced:{
				updateOnContentResize: true
			},
			setHeight: $(document).height()-40,
			scrollInertia: 0
		}
    if(!_isNotMobile)
    {
      $ionicPopover.fromTemplateUrl('templates/mobile/popover.html', {
        scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
        $scope.notificationsEnabled=$sessionStorage.user.vaccinationReminders?1:0;
      });
    }
    angular.element($window).bind('resize', function () {
      $scope.$apply(function () {
        if($window.innerWidth>760){
          $scope.landscapeMode=true;
        }else{
          $scope.landscapeMode=false;
        }
      });
    });
      
    if($window.innerWidth>760){
      $scope.landscapeMode=true;
    }else{
      $scope.landscapeMode=false;
    }
    $scope.isVideoSurvey=false;
		$scope.question = [];
  	$scope.questionData = {};
    $scope.homeData={};
  	$scope.$state=$state;
    $scope.showQuestions=false;
    $scope.isComplete=false;
    $scope.currentQuestion = {};
    $scope.questionIdArray = [];
    
    if($sessionStorage && $sessionStorage.user){
      $scope.hasContacts=$sessionStorage.user.hasContactUsers;

    }else{//user session not available  
      return;
    }

    $scope.take_first_survey_text="";
    
    if($sessionStorage && $sessionStorage.setting){

      $scope.take_first_survey_text=$sessionStorage.setting.take_first_survey_text; 
    }
    
    $scope.contactList={};
    $scope.canAddContacts=false;
    $scope.getContactList = function(){
      //cfpLoadingBar.start();
      $scope.showActivityIndicator();
      $user.get_my_contacts({limit: 5 },function(response) { // Success callback
        $scope.contactList=response;
        if(response && response.length>=5){
          $scope.canAddContacts=false;
        }else{
          $scope.canAddContacts=true;
        }
        $scope.hideActivityIndicator();
        //cfpLoadingBar.complete();
      },
      function(){
        //cfpLoadingBar.complete();
        $scope.hideActivityIndicator();
      });
    };

    $scope.updateProfile=function(){
      setTimeout(function(){
        var parentEl = angular.element(document).find("#main-view");
        $mdDialog.show({
          parent: parentEl,
          scope:$scope,
          preserveScope: true,  // do not forget this if use parent scope
          //targetEvent: $event,
          templateUrl : (_isNotMobile )?'templates/desktop/updateProfile.html':'templates/mobile/updateProfile.html',
          controller: 'HomeCtrl',
          disableParentScroll: true
          
        });
      },0);
      

      

      
      function dlgSizeAndScrollManagement(){
        var height=($window.innerHeight-((20*$window.innerHeight)/100))+"px";
        var lScrollContainer=document.getElementById('scrollcontainer');
        var lProfileContent=document.getElementById('updateProfileContentBdy');
        if(lScrollContainer)
        {
          lScrollContainer.style.height=height;//($window.innerHeight)+"px";
        }
        //set height for diealog.
        if(lProfileContent){
          lProfileContent.style.height=height;
        }
        // if($window.innerWidth>760){
        //   document.getElementsByTagName('md-dialog')[0].style.width="70%"
        // }else{
        //   document.getElementsByTagName('md-dialog')[0].style.width="90%"
        // }
      }

      angular.element($window).bind('resize',dlgSizeAndScrollManagement);
      setTimeout(function(){
        dlgSizeAndScrollManagement();

        $scope.updateProfileData=$sessionStorage.user;
      
        if($sessionStorage.user.role == 'patient') {
          var lExpChildBirth=$scope.updateProfileData.expectedChildBirth;
          var lActChildBirth=$scope.updateProfileData.actualChildBirth;
          if (!_.isNull(lExpChildBirth) && !_.isUndefined(lExpChildBirth) && !isNaN(Date.parse(lExpChildBirth)))
          {
              var expDate=new Date(Date.parse(lExpChildBirth));
              expDate.setMinutes(expDate.getTimezoneOffset());//don't adjust timezone
              $scope.updateProfileData.expectedChildBirth = expDate;
              
          }
          if (!_.isNull(lActChildBirth) && !_.isUndefined(lActChildBirth) && !isNaN(Date.parse(lActChildBirth)))
          {
              var actDate=new Date(Date.parse(lActChildBirth));
              actDate.setMinutes(actDate.getTimezoneOffset());//don't adjust timezone
              $scope.updateProfileData.actualChildBirth = actDate;

          }
          
          $scope.showCalendars = true;
          
          if($sessionStorage.user.patientType == 2) {
            $scope.showCalendars = false;
          }
        } else {
          $scope.showCalendars = false;
        }

        if(parseInt($scope.updateProfileData.postalCode)){
          $scope.updateProfileData.postalCode=parseInt($scope.updateProfileData.postalCode);
        }
        
        $scope.updateProfileData.message="";
      },700);
      
    };

    $scope.getPatientSurvey=function(){
      
      $userSurvey.get_patients_survey({
      }, function(collection) { // Success callback
        // Use the collection data returned
        
        $scope.loginData={};//empty the fields for login view
        $ionicViewSwitcher.nextDirection('forward');
        //$state.go('home');
        
        if(collection.length > 0 && !collection[0].is_complete) {
          $sessionStorage.survey=collection;
          //take user to the home page and then display the survey partial view
          if($state.is('home.surveyStatus')){
             $scope.surveyStart();
          }else{
            $state.go('home.surveyStatus');
          }
        } else {
          //take user to home page and then display the videos partial view
          
          if(collection.length == 0) {
            
            if($sessionStorage.user.patientType==0){
              // $state.go("home.videoTiles");
              
              $state.go("home.controluser");
            }else{
              
              $state.go("home.videoTiles");
            }
          } else {
            
            $scope.checkVideoStatusAndNavigate(collection);
          }
        }
      });
    };

    $scope.showPromptForActualChildBirth = function(ev) {

        if(angular.element(document).find('md-dialog').length == 0){
          var lDateControl=(_isNotMobile )?'<md-datepicker name="actualDate" md-max-date="today" ng-model="ActualBirthDate.date">/md-datepicker>':'<input type="date" name="actualDate" min="1970-01-01" max="{{today_mobile}}" ng-model="ActualBirthDate.date">';
                      
          $mdDialog.hide();
          $mdDialog.show({

            //clickOutsideToClose: true,
            scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            
            template: '<md-dialog class="md-transition-in dialog-border">' +
                      '<form ng-cloak style="margin:0px;padding:0px;">'+
                      '  <md-dialog-content >' +
                      
                      '  <div layout="row" layout-align="center center" class="dialog-header">'+
                      '   <div class="text24 white" >Actual Delivery Date </div>'+
                      '  </div>'+
                      
                      ' <div class="md-dialog-content-body" style="width:500px">'+
                      '        <div style="margin:10px;" class="text16">Please provide actual delivery date if possible.</div>' +
                      lDateControl+
                      '<div class="server-error-msg text16" flex="60" style="margin-top:10px;">{{ActualBirthDate.message}}</div>'+
                      ' </div>'+
                      
                      '  </md-dialog-content>'+
                      '</form>'+
                      '  <md-dialog-actions layout-align="center center">'+
                      '   <md-button aria-label="Cancel" class="md-raised grey-button" ng-click="closeDialog()"><span class="ng-binding ng-scope">Cancel</span></md-button>'+
                      '   <div style="width:19px"></div>' +
                      '   <md-button aria-label="Save" class="md-raised md-primary text16" ng-click="resetHandler()"><span class="ng-binding ng-scope">Save</span></md-button>' +
                      '  </md-dialog-actions>'+
                      '</md-dialog>',
            controller: function DialogController($scope, $mdDialog) {
              $scope.ActualBirthDate={};
              $scope.today=new Date();
              $scope.today_mobile=new Date().toISOString().split('T')[0];
              $scope.resetHandler= function(){
                
                $scope.showActivityIndicator();//start activity indicator
                //send reset password request
                var lDate=this.ActualBirthDate.date;
                $user.myprofile({ },function(response) { // Success callback
                  response[0].actual_child_birth=lDate;
                  response[0].$save().then( function(pSuccess) { // Success callback
                      $sessionStorage.user.actualChildBirth = lDate;
                      //cfpLoadingBar.complete();
                      $scope.hideActivityIndicator();
                      $mdDialog.hide();
                      $mdDialog.show({
                          //clickOutsideToClose: true,
                          scope: $scope,        // use parent scope in template
                          preserveScope: true,  // do not forget this if use parent scope
                          templateUrl: 'templates/desktop/alertDlgTmpl.html',
                          controller: function DialogController($scope, $mdDialog) {
                            $scope.title='Record Updated';
                            $scope.body='The record was updated.';
                            $scope.closeDialog = function() {
                              $mdDialog.hide();
                            }
                          }
                      });
                      
                    
                    })
                    .catch(function(err) { // Error callback
                      //cfpLoadingBar.complete();
                      $scope.hideActivityIndicator();
                      if(err.data.message){
                        $scope.ActualBirthDate.message=err.data.message;
                      }
                    }); 
                }); 
              };
              $scope.closeDialog = function() {
                $mdDialog.hide();
              };
            }
         });
        } 
       
    };
    $scope.surveyStart= function () {
        $scope.showActivityIndicator();
        //cfpLoadingBar.start();//start activity indicator
         /*this code added due to an issue where the front end was not updating*/
         
         if($state.is("home.videoSurvey") && !$scope.isVideoSurvey){
           setTimeout(function() {
            $scope.isVideoSurvey=true;
              angular.element('#takeSurvey').triggerHandler('click');
            }, 10);
           return;
          }
          if($sessionStorage.survey && $sessionStorage.survey[0].id){

            $userSurvey.getfirstquestion({
              query: { // In query go the parameters for the scope
                usersurveyid: $sessionStorage.survey[0].id
              },
            }, function(firstQuestion) { // Success callback
              $scope.question={};
              $scope.questionData={};
              $scope.hideActivityIndicator();
              //cfpLoadingBar.complete();// complete the activity indicator
              $scope.question = firstQuestion[0];
              
              if($scope.question.first_question.sort_order==1)//then its the first question
              {
                $scope.questionIdArray.push($scope.question.id);  
              }else if($scope.question.first_question.prevSurveyQuesIds && $scope.question.first_question.prevSurveyQuesIds.length>0){
                $scope.questionIdArray=_.pluck($scope.question.first_question.prevSurveyQuesIds,"user_survey_answer_id");  
              }
              
              // Use the collection data returned
              
              if($scope.question.is_complete){
                $userSurvey.get_patients_survey({}, function(collection) { // Success callback
                  if(collection.length == 0) {
                    if($sessionStorage.user.patientType==0){
                      $state.go("home.controluser");
                    }else{
                      $state.go("home.videoTiles");
                    }
                  } else {
                    
                    $scope.checkVideoStatusAndNavigate(collection);
                  }
                });
              }else{
                
                $scope.currentQuestion = $scope.question.first_question;
                  $scope.question.nextquestion=$scope.question.first_question;
                  $scope.question.nextquestion.surveyStats={};
                  $sessionStorage.questionCount=$scope.question.question_count;
                  $scope.questionCount = $sessionStorage.questionCount;
                  $scope.percentage = Math.round((($scope.currentQuestion.sort_order-1)/$scope.questionCount)*100);
                  $scope.question.nextquestion.surveyStats.percentCompleted=0;
                  $scope.question.nextquestion.surveyStats.totalQuestionsAnswered=0;
                  if($scope.currentQuestion.survey_answer_id != null) {
                    
                    $scope.questionData.answer = $scope.currentQuestion.survey_answer_id;
                  }

                  $scope.questionData.primarykey = $scope.question.nextquestion.user_survey_answer_id;
                  $scope.showQuestions=true;
                  
                
              }

            }, function(err) { // Error callback
              $scope.hideActivityIndicator();
              //cfpLoadingBar.complete();// complete the activity indicator
              
            });

          }else{//may be user has changed browser tab so session storage might not be available,refetch
            $scope.getPatientSurvey();
          }
          
    };

    var lUser=$sessionStorage.user;
    if(lUser){
      
      if((lUser.patientType==0 || lUser.patientType==1 ) && !lUser.actualChildBirth && lUser.expectedChildBirth && (new Date(lUser.expectedChildBirth))<(new Date()) && $sessionStorage.user.showBirthModal == false){
        setTimeout(function(){
          
            $scope.showPromptForActualChildBirth();
            $sessionStorage.user.showBirthModal = true;
        },1000); 
        
      }
      
      if(lUser.role == 'health_care_provider') {
        $scope.isHealthcareProvider=true; 
      } else {
        $scope.isHealthcareProvider=false;
      }
      if($state.is("home") || $state.is('app.home')){
        
        $scope.getPatientSurvey();
      }else if($state.is("home.videoSurvey")){
        $scope.showQuestions=true;
        $scope.surveyStart();  
        
      }else if($state.is("home.surveyStatus")){
        $scope.profileNotUpdated=true;
      }
    }


    $scope.checkVideoStatusAndNavigate =function(pSurveys){
  
    var collection=pSurveys;
    if(collection[0].hasOwnProperty('matched_videos')){
      var lVideos=collection[0].matched_videos;
      if(lVideos.maternals.length > 0 || lVideos.pediatrics.length > 0 ) {
        
        var incompleteLength=_.filter(lVideos.maternals,function(video){ return video.is_complete==0;}).length+_.filter(lVideos.pediatrics,function(video){ return video.is_complete==0;}).length;
        if(incompleteLength>1){
          $state.go("home.videos");
        }else if(incompleteLength >0) {
            $state.go("home.videos2");
        } else if(collection[0].maternal_video_complete == true && collection[0].pediatric_video_complete == true) {
            if(collection[0].is_complete == true) {  
              $state.go("home.videoTiles");
            } else if(collection[0].is_complete == false) {
              $scope.surveyStart();
            }
          
        } else {
          if(collection[0].is_complete == true) {  
              $state.go("home.videoTiles");
            } else if(collection[0].is_complete == false) {
              $scope.surveyStart();
            }
        }

      } else {
        if(collection[0].is_complete == true) {
          $state.go("home.videoTiles");
        } else if(collection[0].is_complete == false) {
          $scope.surveyStart();
        }
      }
    } else {
      if(collection[0].is_complete == true) {
        $state.go('home.videoTiles');
      } else {
        $scope.surveyStart();
      }
    }

  }
    
    $scope.onNotificationChange=function(){
      
      $sessionStorage.user.vaccinationReminders=$scope.notificationsEnabled;
      
      if($sessionStorage.user.vaccinationReminders){
        if(_.isNull($sessionStorage.user.cellPhone)|| _.isEmpty($sessionStorage.user.cellPhone) || _.isUndefined($sessionStorage.user.cellPhone) ) {
          $scope.cellNotificationsEnabled=true;
        } else {
          $scope.cellNotificationsEnabled=false;
          
        }
      } else {
        $scope.cellNotificationsEnabled=false;
      }
      $scope.notificationData.cellPhone=$sessionStorage.user.cellPhone;

    };
    $scope.toggleNotifications=function(){
      
      $scope.notificationsEnabled=$sessionStorage.user.vaccinationReminders?1:0;
      $scope.cellNotificationsEnabled = false;
      if($sessionStorage.user.vaccinationReminders){
        if($sessionStorage.user.cellPhone == null || $sessionStorage.user.cellPhone == '') {
          $scope.cellNotificationsEnabled=true;

        } else {
          $scope.cellNotificationsEnabled=false;
        }
      } else {
        $scope.cellNotificationsEnabled=false;
      }
      $scope.notificationData.cellPhone=$sessionStorage.user.cellPhone;
      var parentEl = angular.element(document).find("#main-view");
      $mdDialog.show({
        parent: parentEl,
        scope:$scope,
        //targetEvent: $event,
        preserveScope: true,  // do not forget this if use parent scope
        templateUrl : (_isNotMobile )?'templates/desktop/notificationSettings.html':'templates/mobile/notificationSettings.html',
        controller: 'HomeCtrl'
        
      });
      //$state.go('home.notification');
      // setTimeout(function(){
      //  $("#homeContent").mCustomScrollbar("update");
      // },1000)
    };
    $scope.notificationData={};
    $scope.updateCellPhone=function(pValid){
      
      
        if(pValid){
          $scope.showActivityIndicator();
          //cfpLoadingBar.start();//start activity indicator
          
          
          $user.myprofile({ },function(response) { // Success callback
            if(response[0].cell_phone==$scope.notificationData.cellPhone && response[0].vaccination_reminders==$sessionStorage.user.vaccinationReminders){
              $mdDialog.hide();
              $scope.hideActivityIndicator();
              //cfpLoadingBar.complete();
              return;
            }
            response[0].cell_phone=$scope.notificationData.cellPhone;
            response[0].vaccination_reminders=$sessionStorage.user.vaccinationReminders;
            $sessionStorage.user.cellPhone=$scope.notificationData.cellPhone;
            response[0].$save().then(function(pSuccess) {
                
                
                //Saved user profile data
                //$scope.getPatientSurvey();
                //cfpLoadingBar.complete();
                $scope.hideActivityIndicator();
                $mdDialog.hide();
            });
          }, function(err) { // Error callback
            $scope.hideActivityIndicator();
            //cfpLoadingBar.complete();
          });
        }else{
          $scope.notificationData.message="Cell phone is required to enable notifications";
          setTimeout(function(){
            $scope.notificationData.message="";
          },2000)
         //$mdDialog.hide();
        }

    };
  	
    
    
    $scope.healthcareContent=function() {
      $state.go('home.healthCare');
    }

    $scope.menuOpened=false;
  	$scope.openMenu = function($mdOpenMenu, ev) {
      $scope.notificationsEnabled=$sessionStorage.user.vaccinationReminders?1:0;
      originatorEv = ev;
      $mdOpenMenu(ev);
      $scope.menuOpened=true;
    };
    $scope.$on("$mdMenuClose", function() {
      $scope.menuOpened=false;
    });

  	

    $scope.deactivate= function() {
      $mdDialog.hide();
      $mdDialog.show({
          //clickOutsideToClose: true,
          //scope: $scope,        // use parent scope in template
           locals: {
                   parentScope: $scope
           },
          preserveScope: true,  // do not forget this if use parent scope
          
          template: '<md-dialog  class="md-transition-in dialog-border ">' +
                    '  <md-dialog-content class="dialog-content">' +
                    '    <div layout="row" layout-align="center center" class="dialog-header">'+
                    '      <div class="text24 white" layout-margin >Warning</div>'+
                    '    </div>'+
                    ' <div class="md-dialog-content-body">'+
                    '   <p></p>' +
                    '   <div layout="row" layout-align="center center">'+
                    '     <div layout="column" class="text16" flex="95">'+
                    '       By closing this account, you will no longer be able to log in and participate in this clinic trial.  Are you sure you want to close your account?'+
                    '     </div>'+
                    '   <p></p>' +
                    '   </div> '+
                    ' </div>'+
                    '  </md-dialog-content>'+
                    '  <md-dialog-actions layout-align="center center">'+
                    '   <md-button type="button" aria-label="Cancel" class=" md-default-theme grey-button" ng-click="closeDialog()"><span class="ng-binding ng-scope">Cancel</span></md-button>'+
                    '   <div style="width:19px"></div>'+
                    '   <md-button type="button" aria-label="Ok" class="md-primary md-raised text16" ng-click="deactivateForm()"><span class="ng-binding ng-scope">Ok</span></md-button>'+
                    '  </md-dialog-actions>'+
                    '</md-dialog>',
          controller: function DialogController($scope, $mdDialog,locals) {
            
              $scope.parentScope=locals.parentScope;
              $scope.closeDialog = function() {
                
                $mdDialog.hide();
              }
              $scope.deactivateForm = function() {
                
                $mdDialog.hide();
                $scope.parentScope.deactivateTheForm();
              }
          }
      });
    }

    $scope.deactivateTheForm = function(ev) {
      $mdDialog.show({
            //clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            locals: {
              parentScope: $scope
            },
            preserveScope: true,  // do not forget this if use parent scope
            
            template: '<md-dialog class="md-transition-in dialog-border">' +
                      '  <md-dialog-content class="dialog-content">' +
                      '  <div layout="row" layout-align="center center" class="dialog-header">'+
                      '      <div class="text24 white" layout-margin >Why are you closing your account?</div>'+
                      '  </div>'+
                      ' <div class="md-dialog-content-body" >'+
                      '        <md-input-container>' +
                                '<label class="match-input-font">Reason</label>' +
                                '<md-select ng-model="reasonsData.reason">' +
                                  '<md-option ng-value="reason.value" ng-repeat="reason in reasons">{{ reason.label }}</md-option>' +
                                '</md-select>' +
                              '</md-input-container>' +
                              '<p></p>' +
                              '<md-input-container style="padding-left:15px;">' +
                              '<input name="Other" placeholder="Details" ng-model="reasonsData.otherReason" ng-if="reasonsData.reason == \'other\'"></input>' +
                              '</md-input-container>' +
                              '<div class="server-error-msg text16" flex="60" style="margin-top:10px;">{{reasonsData.message}}</div>'+
                      ' </div>'+
                      '  </md-dialog-content>'+
                      '  <md-dialog-actions layout-align="center center">'+
                      '   <md-button type="button" aria-label="Cancel" class="md-default-theme grey-button" ng-click="closeDialog()"><span class="ng-binding ng-scope">Cancel</span></md-button>'+
                      '   <div style="width:19px"></div>'+
                      '   <md-button type="button" aria-label="Close Account" class="md-primary md-raised " ng-click="resetHandler()"><span class="ng-binding ng-scope">Close Account</span></md-button>' +
                      '  </md-dialog-actions>'+
                      '</md-dialog>',
            controller: function DialogController($scope, $mdDialog,locals) {
              $scope.parentScope=locals.parentScope;
              $scope.reasons = loadReasons();
              function loadReasons() {
                        var allReasons = 'Consent Withdrawn, Stillbirth, Other';
                        return allReasons.split(/, +/g).map( function (reason) {
                          return {
                            value: reason.toLowerCase(),
                            label: reason
                          };
                        });
              }
              $scope.resetHandler= function(){
                $scope.parentScope.showActivityIndicator();
                //cfpLoadingBar.start();//start activity indicator
                //send reset password request
                $user.myprofile({ },function(response) { // Success callback
                  response[0].deactivated_on= new Date();
                  response[0].is_deactive=1;
                  if($scope.reasonsData.reason == 'other') {
                    response[0].reason_for_deactivation=$scope.reasonsData.otherReason;
                  } else {
                    response[0].reason_for_deactivation=$scope.reasonsData.reason; 
                  }
                  response[0].$save().then( function(pSuccess) { // Success callback
                      $scope.parentScope.hideActivityIndicator();
                      //cfpLoadingBar.complete();
                      $mdDialog.hide();
                      $scope.parentScope.logout();
                      
                    })
                    .catch(function(err) { // Error callback
                      $scope.parentScope.hideActivityIndicator();
                      //cfpLoadingBar.complete();
                      if(err.data.message){
                        $scope.reasonsData.message=err.data.message;
                      }
                    }); 
                });
                
              }
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
         });
    }
    $scope.profileCancel=function(){
      if(!$sessionStorage.user.updatedUserProfile){
        $scope.showActivityIndicator();
        //cfpLoadingBar.start();
        $user.myprofile({ },function(response) { // Success callback
            
            response[0].updated_user_profile=true;
            
            response[0].$save().then(function(pSuccess) {
                $sessionStorage.user.updatedUserProfile=true;
                $scope.profileNotUpdated=true;
                $scope.hideActivityIndicator();
                //cfpLoadingBar.complete();
                $mdDialog.hide();
            });
        }, function(err) { // Error callback
          // There was an error while fetching the data
            $scope.hideActivityIndicator();
            //cfpLoadingBar.complete();
        });
      }else{
        $mdDialog.hide();
      }
    }

    $scope.profileUpdate=function(pValid){

      if(pValid){
        
        $scope.showActivityIndicator();
        //cfpLoadingBar.start();//start activity indicator
        $user.myprofile({ },function(response) { // Success callback
          response[0].first_name=$scope.updateProfileData.firstName;
          response[0].last_name=$scope.updateProfileData.lastName;
          response[0].cell_phone=$scope.updateProfileData.cellPhone;
          response[0].home_phone=$scope.updateProfileData.homePhone;
          response[0].city=$scope.updateProfileData.city;
          response[0].state=$scope.updateProfileData.state;
          response[0].address=$scope.updateProfileData.address;
          response[0].postal_code=$scope.updateProfileData.postalCode;
          response[0].contact_cell_phone=$scope.updateProfileData.contactCellPhone;
          response[0].contact_email=$scope.updateProfileData.contactEmail;
          response[0].contact_home_phone=$scope.updateProfileData.contactHomePhone;
          response[0].contact_name=$scope.updateProfileData.contactName;
          response[0].expected_child_birth= $scope.updateProfileData.expectedChildBirth;
          response[0].actual_child_birth= $scope.updateProfileData.actualChildBirth;
          response[0].race_id=$scope.updateProfileData.race;
          response[0].education_id=$scope.updateProfileData.education;
          response[0].password=$scope.updateProfileData.password;
          response[0].password_confirmation=$scope.updateProfileData.passwordConfirmation;
          response[0].updated_user_profile=true;

          response[0].$save().then(function(pSuccess) {
              //Saved user profile data
              //cfpLoadingBar.complete();
              $scope.hideActivityIndicator();
              $scope.updateUserObject(pSuccess[0],$sessionStorage.user);
              //$scope.displayName=$sessionStorage.user.firstName + ' ' + $sessionStorage.user.lastName;
              $scope.displayName = $sessionStorage.user.firstName.charAt(0)+"."+$sessionStorage.user.lastName+" ("+$sessionStorage.user.id+")";
              $mdDialog.hide();
          });
        }, function(err) { // Error callback
        // There was an error while fetching the data
          $scope.hideActivityIndicator();
          //cfpLoadingBar.complete();
        });
      }else{
        $scope.updateProfileData.message="There are still invalid fields";
      }

    }
    $scope.races=$race.sorted_by_id();
    $scope.educations=$education.sorted_by_id();

  	

    $scope.closeDialog=function(){
      $mdDialog.hide();
    }

  	$scope.InviteContacts=function(){
      $scope.getContactList();

      var parentEl = angular.element(document).find("#main-view");
      $mdDialog.show({
        parent: parentEl,
        scope:$scope,
        preserveScope: true,  // do not forget this if use parent scope
        //targetEvent: $event,
        templateUrl : (_isNotMobile )?'templates/desktop/inviteContact.html':'templates/mobile/inviteContact.html',
        controller: 'HomeCtrl',
        disableParentScroll: true
        
      });
      

      function dlgSizeAndScrollManagement(){
        var height=($window.innerHeight-((40*$window.innerHeight)/100))+"px";
        var lScrollContainer=document.getElementById('inviteScrollcontainer');
        if(lScrollContainer){
          lScrollContainer.style.height=height;  
        }
        var lContentBody=document.getElementById('inviteContactContentBdy');
        if(lContentBody){
          lContentBody.style.height=height;  
        }
      }
      angular.element($window).bind('resize', dlgSizeAndScrollManagement);
      setTimeout(dlgSizeAndScrollManagement,500);
  	}

  	$scope.whichPossibleAnswer = function(answerId) {
      
      return false;
    }


    
  $scope.nextQuestion = function(pQuestion,pSurveyCompleted,pSurveyId,pAnswer) {
    
    
    $scope.questionCount = $sessionStorage.questionCount;
    var lQuestion=pQuestion;
    var lSurveyCompleted=pSurveyCompleted;
    var lSurveyId=pSurveyId;
    if($scope.questionData.answer == undefined && pAnswer){
      $scope.questionData.answer=pAnswer;
    }
    if($scope.questionData.answer == undefined && lQuestion.required_answer){
      
        $mdDialog.show({
            //clickOutsideToClose: true,
            scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.title='Answer Required';
              $scope.body='Please provide an answer to continue.';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
        });

    }else{
      $scope.showActivityIndicator();
      //cfpLoadingBar.start();//start activity indicator
      $userSurveyAnswer.get({ id: $scope.questionData.primarykey }).then(function(response) {
            
            
            //cfpLoadingBar.complete();// complete the activity indicator
            $scope.completeSurveyButton = false;
            if(lQuestion.question_type_id==2 || lQuestion.question_type_id==6){
              response.free_form_response= $scope.questionData.answer;
            }else{
              response.survey_answer_id = $scope.questionData.answer;
            }
            response.$save()
            .then(function(response) {
                $scope.hideAnswers = false;
               $scope.questionData.answer = null; //reset the answer field
               
               if(lSurveyCompleted || _.isEmpty(response[0].nextquestion)){
                $scope.completeSurvey(lSurveyId);
                $scope.showQuestions=false;
                $scope.isComplete=true;
               }else{
                $scope.question = response[0];
                $scope.user_survey_id = $scope.question.user_survey_id;
                $scope.questionIdArray.push($scope.question.nextquestion.user_survey_answer_id);
                $scope.currentQuestion = $scope.question.nextquestion; 
                  
                if($scope.currentQuestion.question_type_id==2 || $scope.currentQuestion.question_type_id==6){
                  $scope.questionData.answer = $scope.currentQuestion.free_form_response;  
                }else if($scope.currentQuestion.survey_answer_id != null){
                  $scope.questionData.answer = $scope.currentQuestion.survey_answer_id;  
                }
                  
                
                if($scope.currentQuestion.sort_order <= $scope.questionCount){
                  if($scope.currentQuestion.sort_order == $scope.questionCount){
                    $scope.completeSurveyButton = true;
                  }
                  $scope.percentage = Math.round((($scope.currentQuestion.sort_order-1)/$scope.questionCount)*100);
                  $scope.questionData.primarykey = $scope.question.nextquestion.user_survey_answer_id;
                  
                  $scope.showQuestions=true;

                }
               }
              $scope.hideActivityIndicator();
              //cfpLoadingBar.complete();// complete the activity indicator
              $scope.hideAnswers = true;
            })
            .catch(function(err){
              $scope.hideActivityIndicator();
              //cfpLoadingBar.complete();
              
            });

      })
        .catch(function(err){
          $scope.hideActivityIndicator();
          //cfpLoadingBar.complete();
        });
    }
  }

  $scope.previousQuestion = function() {
    $scope.questionCount = $sessionStorage.questionCount;
    $scope.showActivityIndicator();
    //cfpLoadingBar.start();//start activity indicator
    // $userSurvey.get_patients_survey({
    // }, function(collection) { // Success callback
    //   // Use the collection data returned
    //   if(collection.length > 0) {
    
        $userSurveyAnswer.previousquestion({
          query: { // In query go the parameters for the scope
            currentquestionid: $scope.questionIdArray.slice(-1)[0],
            usersurveyid: $sessionStorage.survey[0].id
          },
        }, function(collection1) { // Success callback
          // Use the collection data returned
          $scope.hideAnswers = false;
          $scope.questionIdArray.pop();
          
          $scope.question={};
          $scope.questionData={};
          $scope.question = collection1[0];
          // $scope.possibleAnswers = $scope.question.previousquestion.possibleAnswers;
          // if($scope.question.previousquestion.question_type_id==1 || $scope.question.previousquestion.question_type_id==3){
          //   var arrayLength = $scope.question.previousquestion.possibleAnswers.length;
          //   for (var i = 0; i < arrayLength; i++) {
          //     if($scope.question.previousquestion.possibleAnswers[i].id == $scope.question.previousquestion.survey_answer_id) {
          //       $scope.possibleAnswers[i].checked = true;
          //     } else {
          //       $scope.possibleAnswers[i].checked = false;
          //     }
          //   }
          // }
          // $scope.question.previousquestion.possibleAnswers = $scope.possibleAnswers;
          $scope.currentQuestion = $scope.question.previousquestion;
          
          $scope.percentage = Math.round((($scope.currentQuestion.sort_order-1)/$scope.questionCount)*100);
          
          // $scope.question.nextquestion=$scope.question.previousquestion;
          $scope.questionData.primarykey = $scope.question.previousquestion.user_survey_answer_id;
          if($scope.currentQuestion.question_type_id==2 || $scope.currentQuestion.question_type_id==6){
            $scope.questionData.answer = $scope.currentQuestion.free_form_response;  
          }else{
            $scope.questionData.answer = $scope.currentQuestion.survey_answer_id;  
          }
          
          $scope.completeSurveyButton=false;
          $scope.hideActivityIndicator();
          //cfpLoadingBar.complete();
          $scope.hideAnswers = true;
        }, function(err) { // Error callback
	       $scope.hideActivityIndicator();
          //cfpLoadingBar.complete();
          // There was an error while fetching the data
        });
      // } else {
      //   cfpLoadingBar.complete();
      //   $state.go('home.videos');
      // }
    // }, function(err) { // Error callback
    //   // There was an error while fetching the data
    //   cfpLoadingBar.complete();
    //   if(err.status===401 && err.statusText==="Unauthorized"){
    //   	$scope.logout();
    //   }
    // });
  }

  $scope.completeSurvey = function(user_survey_id) {
    //cfpLoadingBar.start();
    $scope.showActivityIndicator();
    $userSurvey.compelete_survey({
      query: { // In query go the parameters for the scope
          usersurveyid:  $scope.question.user_survey_id
      }
    }, function(collection) { // Success callback
        // Use the collection data returned
         
         $userSurvey.get_patients_survey({
          }, function(collection) { // Success callback
            // Use the collection data returned

            if(collection.length == 0) {
              if($sessionStorage.user.patientType==0){
                  // $state.go("home.videoTiles");
                  $state.go("home.controluser");
              }else{
                $state.go("home.videoTiles");
              }
            } else {
              $sessionStorage.survey=collection;
              $scope.checkVideoStatusAndNavigate(collection);
            }
            $scope.hideActivityIndicator();
            //cfpLoadingBar.complete();// complete the activity indicator
             // return collection;
          }, function(err) { // Error callback
            $scope.hideActivityIndicator();
            //cfpLoadingBar.complete();// complete the activity indicator
            console.log('there was an error FETCHING VIDEOS', err);
            // There was an error while fetching the data
          });
        
    }, function(err) { // Error callback
        // There was an error while fetching the data
    });
  }

  $scope.getCSV=function(){
    
    $userSurvey.getcsv({

        }, function(data) { // Success callback
          
        var anchor = angular.element('<a/>');
         anchor.attr({
             href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
             target: '_blank',
             download: 'filename.csv'
         })[0].click();
      }, function(err) { // Error callback
        $scope.hideActivityIndicator();
        //cfpLoadingBar.complete();// complete the activity indicator
        // There was an error while fetching the data
        

      });

  }

  
    $scope.inviteData={};
    $scope.doInvite=function(pIsValid){
      if(pIsValid){
        //cfpLoadingBar.start();
        $scope.showActivityIndicator();
        var instance = $user.create();
        instance.first_name = $scope.inviteData.first_name;
        instance.last_name = $scope.inviteData.last_name;
        instance.email = $scope.inviteData.email;
        instance.cell_phone = $scope.inviteData.cell_phone;
        instance.home_phone = $scope.inviteData.home_phone;
        instance.parent_relationship_type = $scope.inviteData.parent_relationship_type;
        // To save the instance do
        instance.$save()
        .then(function(success,error) {
          $scope.hideActivityIndicator();
          //cfpLoadingBar.complete();
          
          $scope.inviteData={};
          $scope.inviteForm.$setUntouched();
          $scope.getContactList();
          $scope.inviteData.message="Contact has been invited.";
          setTimeout(function(){
            $scope.inviteData.message="";
          },1000);
              
        })
        .catch(function(err){
          if(err.data && err.data.message=="duplicate email"){
            $scope.inviteData.message=err.data.message;
          }
          //cfpLoadingBar.complete();
          $scope.hideActivityIndicator();
          
        });
      }else{
        $scope.inviteData.message="There are still invalid fields";
        setTimeout(function(){
          $scope.inviteData.message="";
        },1000);
      }
    };

    $scope.navigateToHome=function(){
      //cfpLoadingBar.start();
      $scope.showActivityIndicator();
      $userSurvey.get_patients_survey({}, function(collection) { // Success callback
          $ionicViewSwitcher.nextDirection('forward');
          
          if(collection.length > 0 && !collection[0].is_complete) {
              $sessionStorage.survey=collection;
              //take user to the home page and then display the survey partial view
              $scope.hideActivityIndicator();
              //cfpLoadingBar.complete();
              $scope.showQuestions=false;
              $state.go('home.surveyStatus'); 


           } else {
              if(collection.length == 0) {
                    $state.go("home.videoTiles");
              } else {
                
                  //take user to home page and then display the videos partial view
                $scope.checkVideoStatusAndNavigate(collection);
              }
              setTimeout(function(){
                $scope.hideActivityIndicator();
              //cfpLoadingBar.complete();

              },500);//it takes time to load videos
           }
           
        }, function(err) { // Error callback
          console.log('', err);
          $scope.loginData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
          $scope.hideActivityIndicator();
          //cfpLoadingBar.complete();
          // There was an error while fetching the data
        });

    };

    $scope.updateUserObject=function(fromObj,ToObj){
      
      ToObj.firstName=fromObj.first_name;
      ToObj.lastName=fromObj.last_name;
      ToObj.cellPhone=fromObj.cell_phone;
      ToObj.homePhone=fromObj.home_phone;
      ToObj.city=fromObj.city;
      ToObj.state=fromObj.state;
      ToObj.address=fromObj.address;
      ToObj.postalCode=fromObj.postal_code;
      ToObj.contactCellPhone=fromObj.contact_cell_phone;
      ToObj.contactEmail=fromObj.contact_email;
      ToObj.contactHomePhone=fromObj.contact_home_phone;
      ToObj.contactName=fromObj.contact_name;
      ToObj.expectedChildBirth= fromObj.expected_child_birth;
      ToObj.actualChildBirth= fromObj.actual_child_birth;
      ToObj.raceId=fromObj.race_id;
      ToObj.educationId=fromObj.education;
      ToObj.password=fromObj.password;
      ToObj.passwordConfirmation=fromObj.password_confirmation;
      ToObj.vaccinationReminders=fromObj.vaccination_reminders;

    }
  
    $scope.relationships = loadAllRelationships();
    function loadAllRelationships() {
          
          var allRelationships = 'Spouse, Child, Parent, Friend, Other';
          return allRelationships.split(/, +/g).map( function (relationship) {
            return {
              value: relationship.toLowerCase(),
              label: relationship
            };
          });
        }
    $scope.states = loadAll();
    function loadAll() {
          var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware, \
                  Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, \
                  Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, \
                  Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina, \
                  North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, \
                  South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, \
                  Wisconsin, Wyoming';
          return allStates.split(/, +/g).map( function (state) {
            return {
              value: state.toLowerCase(),
              display: state
            };
          });
        };
}]);
