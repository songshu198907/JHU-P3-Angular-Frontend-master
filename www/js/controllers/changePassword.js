angular.module('Jhu.controllers')
    .controller('ChangePasswordCtrl', ['$scope','$controller','$mdDialog','AuthCtrl','$state','$user','cfpLoadingBar','$sessionStorage','$ionicViewSwitcher','$setting',
    	function ($scope,$controller,$mdDialog,AuthCtrl,$state,$user,cfpLoadingBar,$sessionStorage,$ionicViewSwitcher,$setting) {

    	$controller('BaseCtrl', { $scope: $scope });

		var me = $scope;
        
        $scope.changePassword={};

        $scope.doChangePassword = function(pIsValid){

        	if(pIsValid){
        		$scope.changePassword.message="";
	      
	      		cfpLoadingBar.start();//start activity indicator

		  		$user.myprofile({ },function(response) { // Success callback
		  			
		  			if(response[0].password!=$scope.changePassword.password){
			  			response[0].password = $scope.changePassword.password;
			  			response[0].password_confirmation = $scope.changePassword.password_confirmation;
			  			response[0].reset_password=false;
			  			response[0].$save().then(function(pSuccess) {
			              //Saved user profile data
			              cfpLoadingBar.complete();
			              AuthCtrl.logout();
			              setTimeout(function(){
			              	$state.go('login');	
			              	$scope.changePassword={};
			              },2000);
			              
			          	})
			          	.catch(function(pError){
			          		cfpLoadingBar.complete();
			          	});
		  			}else{
		  				$scope.changePassword.message="please enter a different password";		
		  			}
		  		}, function(err) { // Error callback
			        // There was an error while fetching the data
			        cfpLoadingBar.complete();
		        });
    		}else{
    			 $scope.changePassword.message="There are still invalid fields";
    		}
        };

        /*$scope.showConsentAccepted=function(){
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
	          	cfpLoadingBar.start();
	          	$setting.all({},function(response){
	          		if(response && response.length>0){
	          			$scope.consent.term_conditions=response[0].terms_and_conditions;
	          		}
	          		cfpLoadingBar.complete();
	          	},function(error){
	          		cfpLoadingBar.complete();
	          	});
	          	$scope.resetHandler= function(pIsValid){
	          		cfpLoadingBar.start();
	          		$user.myprofile({ },function(response) { // Success callback
			          response[0].consent_accepted_on=new Date().toString();
			          
			          response[0].$save().then(function(pSuccess) {
			              //Saved user profile data
			              $mdDialog.hide();
			              $state.go('login');
			              cfpLoadingBar.complete();
			              
			          }).catch(function(err){
			          	cfpLoadingBar.complete();
			          });
			        }, function(err) { // Error callback
				        // There was an error while fetching the data
				        cfpLoadingBar.complete();
			        });
	          		
	          	}
	            $scope.closeDialog = function() {
	              $mdDialog.hide();
	              AuthCtrl.logout();
	              setTimeout(function(){
	              	$state.go('login');	
	              },2000);
  				  
	            }
        	}
          });
       };*/



    }]);