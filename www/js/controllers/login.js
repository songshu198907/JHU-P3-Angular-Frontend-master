angular.module('Jhu.controllers')
    .controller('LoginCtrl', ['$rootScope','$scope','$mdDialog','AuthCtrl','$state','$user','$userSurvey','cfpLoadingBar','$sessionStorage','$ionicViewSwitcher','$setting','$authenticationStorageService','$ionicLoading','$setting',
    	function ($rootScope,$scope,$mdDialog,AuthCtrl,$state,$user,$userSurvey,cfpLoadingBar,$sessionStorage,$ionicViewSwitcher,$setting,$authenticationStorageService,$ionicLoading,$setting) {

    	var me = $scope;
		$scope.loginData={};

		$sessionStorage.user=$authenticationStorageService.getSession(baseUrl);
		console.log('hello is this the auth ctrl or not');
		if(AuthCtrl.isAuthenticated()){
			console.log('is authenticated already');
		}else{
			$mdDialog.hide();
		}
		$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			if(toState.name!=fromState.name && fromState.name != 'login' && AuthCtrl.isAuthenticated()){
				
				if($sessionStorage.user){
					
					if($sessionStorage.user.role == 'administrator') {
						$state.go('admin');
				    } else if(!$state.is('updatePassword') && $sessionStorage.user.role == 'patient') {
				    	$scope.showActivityIndicator();
				     	//cfpLoadingBar.start();
				     	$scope.getPatientSurvey();
				     	setTimeout(function(){
				     		$scope.hideActivityIndicator();
				     		//cfpLoadingBar.complete();
				     	},2000);
				    } else if ( !$state.is('updatePassword') && $sessionStorage.user.role == 'health_care_provider') {
				     	if(_isNotMobile){
				     		$state.go('home.healthCare');
			    			
				    	}else{
				    		$state.go('healthCare');	
				    	}
				    }
	     		}

	 		}
		});
		
        $scope.doLogin = function(pIsValid){

	        if(pIsValid){
	            $scope.loginData.message="";
	        
	            if(AuthCtrl.isAuthenticated()) {
	            	
	            	$scope.logout();
			      	  setTimeout(function(){
			      	  	AuthCtrl.login({
			            	email: $scope.loginData.username,
			            	password: $scope.loginData.password
			          	});
			      	  },1000);
			        
	            } else {
	            	AuthCtrl.login({
		            	email: $scope.loginData.username,
		            	password: $scope.loginData.password
		          	});
	            }
	            $scope.showActivityIndicator();
	            //cfpLoadingBar.start();//start activity indicator
	            
	        }else{
	           $scope.loginData.message="There are still invalid fields";
	        }
        };

        $scope.$on('auth-loginRequired', function(event, args) {
		    $scope.showLoginError();
		    
		    //in case session has expired logout the current user.
		    $scope.logout();
		    
		    $scope.loginData.message=args.data.message;//show error message to user in case of a login failure
		    $scope.hideActivityIndicator();
		    //cfpLoadingBar.complete();// complete the activity indicator
		 });
        $scope.logout=function(){
        	AuthCtrl.logout();
		    $sessionStorage.$reset();	
        }
		$scope.$on('auth-loginSuccess', function(event, args) {
			
		    $scope.loginData.message="";
		    var lOriginalArgs=args.data;
		    //save user data in session storage to be used later for update profile etc.
		    args.data=JSON.parse(args.data);
		    $sessionStorage.user=args.data;
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
			    	setTimeout(function(){
			    		$scope.getPatientSurvey();	
			    	},50);//timeout set,due to issue in safari and internet explorer
			     	$scope.getUserSettings();
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
		    
		    setTimeout(function(){
		    	$scope.loginData={};//empty the fields for login view
		    	
			},800);//so that the activity is completed after the getPatientsurvey call
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
				       	$state.go('home.surveyStatus');	

			       } else {
			       	
			       		//take user to home page and then display the videos partial view
		       			if(collection.length == 0) {
		       				if($sessionStorage.user.patientType==0){
		       					$state.go("home.controluser");
		       				}else{
              					$userSurvey.get_video_survey({}, function(collection) { // Success callback
						            if(collection.length > 0) {
						              if(!$sessionStorage.survey){
						                $sessionStorage.survey=[];
						              }
						              $sessionStorage.survey[0] = collection[0];
						              $state.go('home.videoSurvey');
						            } else {
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
			       		
			       		
			       }
			       $scope.hideActivityIndicator();
			       //cfpLoadingBar.complete();//complete the activity indicator.
			       
			    }, function(err) { // Error callback
			    	$scope.hideActivityIndicator();
			      	//cfpLoadingBar.complete();//complete the activity indicator.
			      	console.log('', err);
			      	$scope.loginData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
			      // There was an error while fetching the data
			    });
		}

	  	$scope.signup=function(){
	  		$scope.loginData={};
	  		$state.go('signup');
	  	}
		  
	  	$scope.showPrompt = function(ev) {
	
          $mdDialog.show({
	          //clickOutsideToClose: true,
	          scope: $scope,        // use parent scope in template
	          preserveScope: true,  // do not forget this if use parent scope
	          
	          template: '<md-dialog md-theme="default" class="dialog-border md-transition-in">' +
	                    '  <md-dialog-content class="dialog-content">' +
	                    
	                    '    <div layout="row" layout-align="center center" class="dialog-header">'+
        				'		<div class="text24 white" layout-margin >Reset Password</div>'+
    					'	 </div>'+

	                    '	<div class="md-dialog-content-body" >'+
	                    '	  <form name="resetPasswordForm">'	+	
	                    '        <div class="text16"> Please provide your email</div>' +
	                    '	  	<md-input-container class="md-block">'+
						'        <input type="email" name="Email" placeholder="Email" ng-model="resetPassword.email" ng-pattern="/^.+@.+\..+$/" ng-required="true">'+
						'        <div ng-messages="resetPasswordForm.Email.$error" ng-show="resetPasswordForm.Email.$touched">'+
						'          <div ng-message="required">This is required!</div>'+
						'          <div ng-message="pattern">Invalid Email</div>'+
						'        </div>'+
						'      </md-input-container>'+
						'     </form>'+
	                    '	</div>'+
	                    '  </md-dialog-content>'+
	                    '  <md-dialog-actions layout="row" layout-align="center center">'+
	                    '		<md-button type="button" aria-label="Cancel" class="md-raised grey-button" ng-click="closeDialog()"><span class="ng-binding ng-scope">Cancel</span></md-button>'+
	                    '		<md-button type="button" aria-label="Reset Password" class="md-primary md-raised md-default-theme" ng-click="resetHandler(resetPasswordForm.$valid)"><span class="ng-binding ng-scope">Reset Password</span></md-button>' +
	                    '  </md-dialog-actions>'+
	                    '</md-dialog>',
	          controller: function DialogController($scope, $mdDialog) {
	          	$scope.resetPassword={};
	          	$scope.resetHandler= function(pIsValid){
	          		if(pIsValid){
	          			//send reset password request
	          			var lEmail=this.resetPassword.email;
	          			$user.reset_password({"query":{"email":lEmail
		    					}}, function(pSuccess) { // Success callback
		          				
			          			$mdDialog.hide();
			          			$mdDialog.show({
			                          //clickOutsideToClose: true,
			                          scope: $scope,        // use parent scope in template
			                          preserveScope: true,  // do not forget this if use parent scope
			                          templateUrl: 'templates/desktop/alertDlgTmpl.html',
			                          controller: function DialogController($scope, $mdDialog) {
			                            $scope.title='Reset Password Successful';
			                            $scope.body='Please check your email';
			                            $scope.closeDialog = function() {
			                              $mdDialog.hide();
			                            }
			                          }
			                      });
			          			
			          		
			          	}, function(err) { // Error callback
			          	
					      if(err.data.message){
					      		$mdDialog.show({
		                          //clickOutsideToClose: true,
		                          scope: $scope,        // use parent scope in template
		                          preserveScope: true,  // do not forget this if use parent scope
		                          templateUrl: 'templates/desktop/alertDlgTmpl.html',
		                          controller: function DialogController($scope, $mdDialog) {
		                            $scope.title='Reset Password Failed';
		                            $scope.body=err.data.message;
		                            $scope.closeDialog = function() {
		                              $mdDialog.hide();
		                            }
		                          }
			                    });
					  		}
					      // There was an error while fetching the data
					    });
	          		}
	          		
	          	}
	            $scope.closeDialog = function() {
	              $mdDialog.hide();
	            }
	          }
	       });
	   
	  };

  
	  $scope.showConsentAccepted=function(){
  		$mdDialog.show({
          //clickOutsideToClose: true,
          escapeToClose: false,
          scope: $scope,        // use parent scope in template
          preserveScope: true,  // do not forget this if use parent scope
          
          template: '<md-dialog md-theme="default" class="dialog-border md-transition-in">' +
                    '    <div layout="row" layout-align="center center" class="dialog-header">'+
        			'		<div class="text24 white" layout-margin >CONSENT AND ACCEPTANCE</div>'+
    				'	 </div>'+
    				'  <md-dialog-content style="padding:10px;">' +
                    '	<div class="md-dialog-content-body" >'+
                    '        <div class="text16" style="overflow:scroll;" ng-bind-html="consent.term_conditions"></div>' +
                    '	</div>'+
                    '  </md-dialog-content>'+
                    '  <md-dialog-actions layout="row" layout-align="center center" style="margin-top:10px;">'+
                    '		<md-button aria-label="Decline" class="md-raised grey-button" ng-click="closeDialog()"><span class="ng-binding ng-scope">Decline</span></md-button>'+
                    '		<md-button aria-label="Accept" class="md-primary md-raised" ng-click="resetHandler(resetPasswordForm.$valid)"><span class="ng-binding ng-scope">Accept</span></md-button>' +
                    '  </md-dialog-actions>'+
                    '</md-dialog>',
          	controller: function DialogController($scope, $mdDialog) {
	          	$scope.consent={};
	          	$scope.showActivityIndicator();
	          	//cfpLoadingBar.start();
	          	$setting.all({},function(response){
	          		if(response && response.length>0){
	          			$scope.consent.term_conditions=response[0].terms_and_conditions;
	          		}
	          		$scope.hideActivityIndicator();
	          		//cfpLoadingBar.complete();
	          	},function(error){
	          		$scope.hideActivityIndicator();
	          		//cfpLoadingBar.complete();
	          	});
	          	$scope.resetHandler= function(pIsValid){
	          		$scope.showActivityIndicator();
	          		//cfpLoadingBar.start();
	          		$user.myprofile({ },function(response) { // Success callback
			          response[0].consent_accepted_on=new Date().toString();
			          
			          response[0].$save().then(function(pSuccess) {
			              //Saved user profile data
			              $mdDialog.hide();
			              $scope.getPatientSurvey();
			              $scope.hideActivityIndicator();
			              //cfpLoadingBar.complete();
			              
			          }).catch(function(err){
			          	$scope.hideActivityIndicator();
			          	//cfpLoadingBar.complete();
			          });
			        }, function(err) { // Error callback
				        // There was an error while fetching the data
				        //cfpLoadingBar.complete();
				        $scope.hideActivityIndicator();
			        });
	          		
	          	}
	            $scope.closeDialog = function() {
	              $mdDialog.hide();
	              AuthCtrl.logout();
	              
	            }
        	}
          });
       };
	  	


  $scope.showLoginError=function(){
  	$mdDialog.hide();
  	$mdDialog.show({
          //clickOutsideToClose: true,
          scope: $scope,        // use parent scope in template
          preserveScope: true,  // do not forget this if use parent scope
          
          template: '<md-dialog class="dialog-border md-transition-in">' +
                    '  <md-dialog-content >' +
                    '    <div layout="row" layout-align="center center" class="dialog-header">'+
        			'		<div class="text24 white" layout-margin >Invalid Login</div>'+
    				'	 </div>'+
                    
                    '	<div class="md-dialog-content-body" layout="row" layout-align="center center">'+
					'     Please Try Again.'+
                    '	</div>'+
                    '  </md-dialog-content>'+
                    '  <md-dialog-actions layout="row" layout-align="center center">'+
                    '		<md-button type="button" aria-label="Ok" class="md-primary md-raised " ng-click="closeDialog()"><span class="ng-binding ng-scope">Ok</span></md-button>'+
                    '  </md-dialog-actions>'+
                    '</md-dialog>',
          controller: function DialogController($scope, $mdDialog) {
	            $scope.closeDialog = function() {
	              $mdDialog.hide();
	            }
        	}
          });
       };
		  
	$scope.showActivityIndicator=function(){
    	if(_isNotMobile){
    		cfpLoadingBar.start();
    	}else{
			$ionicLoading.show();
    	}
	    	
	}
    $scope.hideActivityIndicator=function(){
    	if(_isNotMobile){
    		cfpLoadingBar.complete();
    	}else{
    	 	$ionicLoading.hide();
    	}
    }  	

}]);



