angular.module('Jhu.controllers')
    .controller('SurveyDetailCtrl', ['$rootScope','$scope','$controller', '$state','$user','AuthCtrl','$sessionStorage', '$ionicViewSwitcher','cfpLoadingBar','$mdDialog','$window','$stateParams','$surveyQuestion','$survey','$surveyAnswer','$userSurvey','$questionCode','$questionCategory','$questionType','$surveyQuestionSkipLogic','$timeout',
      function ($rootScope,$scope,$controller, $state,$user,AuthCtrl,$sessionStorage, $ionicViewSwitcher,cfpLoadingBar,$mdDialog, $window,$stateParams,$surveyQuestion,$survey,$surveyAnswer,$userSurvey,$questionCode,$questionCategory,$questionType,$surveyQuestionSkipLogic,$timeout) {
    
      $controller('BaseCtrl', { $scope: $scope });
	$scope.patientSurveyFormData={};
    $scope.goBackToAdmin=function(){
      	$ionicViewSwitcher.nextDirection('back');
      	$state.go("admin");
    };
	$scope.updateQuestions=false;
	
	$scope.questionCodes=$questionCode.sorted_by_name();
	$scope.questionTypes=$questionType.sorted_by_name();
	$scope.questionCategories=$questionCategory.sorted_by_name();
	$scope.$on('surveyupdated', function (event, data) {
		$scope.patientSurveyFormData.survey=data;
		$scope.patientSurveyFormData.survey.survey_type=data.selected_survey_type;
		$scope.patientSurveyFormData.survey.patient_type=data.selected_patient_type;
		$timeout(function(){
			$scope.$apply();	
		});
		
	});
	$scope.$watch(
	    "updateQuestions",
	    function handleFooChange( newValue, oldValue ) {
	        // console.log( "vm.fooCount:", newValue );
	        if(newValue){
	        	$surveyQuestion.get_question_by_survey({query:{ "survey_id": $stateParams.surveyId }},function(collection){
		
					_.each(collection,function(item,index){
						item.show=false;
						item.busyLoadingAnswers=true;
					});
					$scope.patientSurveyFormData.answers=[collection.length];
					$scope.patientSurveyFormData.questions=collection;
					cfpLoadingBar.complete();
				},function(err){
					cfpLoadingBar.complete();
					console.log(err);
				});
	        }
	    }
	);
	$scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
      $scope.menuOpened=true;
	};
	
	$scope.patientSurveyFormData.patientTypes=[{id:0,name:"control user"},{id:1,name:"intervention"},{id:2,name:"Contact of Intervention"}]
	$survey.get({id:$stateParams.surveyId}).then(function(survey) {
		
		// console.log(survey);
		$scope.patientSurveyFormData.survey=survey;
	},function(err){
		console.log(err);
	});

	cfpLoadingBar.start();
	$surveyQuestion.get_question_by_survey({query:{ "survey_id": $stateParams.surveyId }},function(collection){
		
		_.each(collection,function(item,index){
			item.show=false;
			item.busyLoadingAnswers=true;
		});
		$scope.patientSurveyFormData.answers=[collection.length];
		$scope.patientSurveyFormData.questions=collection;
		cfpLoadingBar.complete();
	},function(err){
		cfpLoadingBar.complete();
		console.log(err);
	});

	$userSurvey.check_survey_count({query:{"survey_id":$stateParams.surveyId }},function(count){
		
		if(count && count.length>0){
			$scope.patientSurveyFormData.showDeleteBtn=false;	
		}else{
			$scope.patientSurveyFormData.showDeleteBtn=true;
		}
		

	},function(err){
		console.log(err);
	})
	
	$scope.copySurvey=function(){
		
		$mdDialog.show({
            
            locals: {
              parentScope: $scope
            },
            preserveScope: true,  // do not forget this if use parent scope
            
            template: '<md-dialog class="md-transition-in dialog-border">'+
                      '<md-dialog-content class="dialog-content">'+
                      '<div layout="row" layout-align="center center" class="dialog-header">'+
                          '<div class="text24 white">Copy Survey</div>'+
                      '</div>'+
                      '<div class="md-dialog-content-body" >'+
                       '<div class="text16" style="margin:10px;padding-right:50px;padding-bottom:20px;">Are you sure you want to make a copy of this survey?</div>'+
                      '</div>'+
                      
                      '  <md-dialog-actions layout-align="center center">'+
                      '   <md-button type="button" aria-label="Cancel" class="md-default-theme grey-button" ng-click="closeDialog()"><span class="ng-binding ng-scope">Cancel</span></md-button>'+
                      '   <div style="width:19px"></div>'+
                      '   <md-button type="button" aria-label="Copy" class="md-primary md-raised " ng-click="copyHandler()"><span class="ng-binding ng-scope">Copy</span></md-button>' +
                      '  </md-dialog-actions>'+
                      '</md-dialog-content>'+
                      '</md-dialog>',
            controller: function DialogController($scope, $mdDialog,locals) {
              $scope.parentScope=locals.parentScope;

              $scope.copyHandler= function(){
                                cfpLoadingBar.start();
                $survey.create_copy({query:{survey_id:$stateParams.surveyId}},function(pResponse){
					$mdDialog.show({
		                //clickOutsideToClose: true,
		                //scope: $scope,        // use parent scope in template
		                preserveScope: true,  // do not forget this if use parent scope
		                templateUrl: 'templates/desktop/alertDlgTmpl.html',
		                controller: function DialogController($scope, $mdDialog) {
		                  $scope.title='Copy Created!';
		                  $scope.body='Copy created successfully.';
		                  //$scope.btn='Close';
		                  $scope.closeDialog = function() {
		                    $mdDialog.hide();
		                  }
		                }
		            }).finally(function() {
		                $mdDialog.hide();
		            });
					cfpLoadingBar.complete();
				},function(pError){
					cfpLoadingBar.complete();
				});

              }
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
         });
		
	}

	$scope.editSurveyDetails=function($event){
		var parentEl = angular.element(document.body);
		$scope.patientSurveyFormData.survey.submitText = 'Update';
		$scope.patientSurveyFormData.survey.type= 'Patient Survey Data Edit';
		$scope.patientSurveyFormData.survey.patientTypes=[{id:0,name:"Control User"},{id:1,name:"Intervention"},{id:2,name:"Contact of Intervention"}];
		$scope.patientSurveyFormData.survey.showDeleteBtn=$scope.patientSurveyFormData.showDeleteBtn;
		$scope.patientSurveyFormData.survey.selected_patient_type=$scope.patientSurveyFormData.survey.patient_type;
		$mdDialog.show({
	        parent: parentEl,
	        targetEvent: $event,
	        templateUrl : 'templates/desktop/admin/updatePatientSurveyDetail.html',
	        controller: 'dialogCtrl',
	        locals: {
	          updateFormData: $scope.patientSurveyFormData.survey
	        }
	    });

	}
	$scope.cancelEditMode=function(){
		$scope.surveyEditMode=false;
	}

	$scope.deleteSurvey=function(){
		$mdDialog.show({
            
            locals: {
              parentScope: $scope
            },
            preserveScope: true,  // do not forget this if use parent scope
            
            template: '<md-dialog class="md-transition-in dialog-border">'+
                      '<md-dialog-content class="dialog-content">'+
                      '<div layout="row" layout-align="center center" class="dialog-header">'+
                          '<div class="text24 white">Delete Survey</div>'+
                      '</div>'+
                      '<div class="md-dialog-content-body" >'+
                       '<div class="text16" style="margin:10px;padding-right:50px;padding-bottom:20px;">Are you sure you want to delete this survey?</div>'+
                      '</div>'+
                      
                      '  <md-dialog-actions layout-align="center center">'+
                      '   <md-button type="button" aria-label="Cancel" class="md-default-theme grey-button" ng-click="closeDialog()"><span class="ng-binding ng-scope">Cancel</span></md-button>'+
                      '   <div style="width:19px"></div>'+
                      '   <md-button type="button" aria-label="Delete" class="md-primary md-raised " ng-click="copyHandler()"><span class="ng-binding ng-scope">Delete</span></md-button>' +
                      '  </md-dialog-actions>'+
                      '</md-dialog-content>'+
                      '</md-dialog>',
            controller: function DialogController($scope, $mdDialog,locals) {
              $scope.parentScope=locals.parentScope;

              $scope.copyHandler= function(){
                                cfpLoadingBar.start();
                $survey.delete_survey({query:{id:$stateParams.surveyId}},function(pResponse){
					$mdDialog.show({
		                //clickOutsideToClose: true,
		                //scope: $scope,        // use parent scope in template
		                preserveScope: true,  // do not forget this if use parent scope
		                templateUrl: 'templates/desktop/alertDlgTmpl.html',
		                controller: function DialogController($scope, $mdDialog) {
		                  $scope.title='Deleted!';
		                  $scope.body='Survey Delete successfully.';
		                  //$scope.btn='Close';
		                  $scope.closeDialog = function() {
		                    $mdDialog.hide();
		                    $ionicViewSwitcher.nextDirection('back');
      						$state.go("admin");
		                  }
		                }

		            }).finally(function() {
		                $mdDialog.hide();
		            });
		            
					cfpLoadingBar.complete();
				},function(pError){
					cfpLoadingBar.complete();
				});

              }
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
         });
	}

	$scope.saveSurveyDetails=function(){
		cfpLoadingBar.start();
		$scope.patientSurveyFormData.survey.patient_type=$scope.patientSurveyFormData.selected_patient_type;
		$survey.active_surveys_by_type_patient(
			{query:{patient_type:$scope.patientSurveyFormData.survey.patient_type,survey_type:$scope.patientSurveyFormData.survey.survey_type}},
			function(pResponse){
						if(pResponse && pResponse.length>0 && !$scope.patientSurveyFormData.survey.is_active)
			{
				$mdDialog.show({
	                //clickOutsideToClose: true,
	                //scope: $scope,        // use parent scope in template
	                preserveScope: true,  // do not forget this if use parent scope
	                templateUrl: 'templates/desktop/alertDlgTmpl.html',
	                controller: function DialogController($scope, $mdDialog) {
	                  $scope.title='No Active Survey!';
	                  $scope.body='Atleast one active survey of this patient and survey type is required.';
	                  //$scope.btn='Close';
	                  $scope.closeDialog = function() {
	                    $mdDialog.hide();
	                  }
	                }
	            }).finally(function() {
	                $mdDialog.hide();
	            });
				cfpLoadingBar.complete();
			}else{
				$scope.patientSurveyFormData.survey.$save().then(function(pSuccess) {
								cfpLoadingBar.complete();
				},function(pError){
										cfpLoadingBar.complete();
				});
				$scope.surveyEditMode=false;
			}
			
		},function(pError){

		});
		
	}

	$scope.addQuestionsAnswer=function($event,pQuestion){
		
		var parentEl = angular.element(document.body);
		var lAnswer={};
		lAnswer.submitText = 'Create';
		lAnswer.type= 'Answer';
		lAnswer.survey_question_id=pQuestion.id;
		lAnswer.question=pQuestion;
		lAnswer.updateView=$scope;
		//$scope.patientSurveyFormData.survey.patientTypes=[{id:0,name:"control user"},{id:1,name:"intervention"},{id:2,name:"Contact of Intervention"}];
		$mdDialog.show({
	        parent: parentEl,
	        targetEvent: $event,
	        templateUrl : 'templates/desktop/admin/updateSurveyAnswers.html',
	        controller: 'dialogCtrl',
	        locals: {
	          updateFormData: lAnswer
	        }
	    });
	}

	$scope.deleteQuestion=function($event,pQuestion){
		$mdDialog.show({
            
            locals: {
              parentScope: $scope
            },
            preserveScope: true,  // do not forget this if use parent scope
            
            template: '<md-dialog class="md-transition-in dialog-border">'+
                      '<md-dialog-content class="dialog-content">'+
                      '<div layout="row" layout-align="center center" class="dialog-header">'+
                          '<div class="text24 white">Delete Question</div>'+
                      '</div>'+
                      '<div class="md-dialog-content-body" >'+
                       '<div class="text16" style="margin:10px;padding-right:50px;padding-bottom:20px;">Are you sure you want to delete this question?</div>'+
                      '</div>'+
                      
                      '  <md-dialog-actions layout-align="center center">'+
                      '   <md-button type="button" aria-label="Cancel" class="md-default-theme grey-button" ng-click="closeDialog()"><span class="ng-binding ng-scope">Cancel</span></md-button>'+
                      '   <div style="width:19px"></div>'+
                      '   <md-button type="button" aria-label="Copy" class="md-primary md-raised " ng-click="copyHandler()"><span class="ng-binding ng-scope">Delete</span></md-button>' +
                      '  </md-dialog-actions>'+
                      '</md-dialog-content>'+
                      '</md-dialog>',
            controller: function DialogController($scope, $mdDialog,locals) {
              $scope.parentScope=locals.parentScope;

              $scope.copyHandler= function(){
                                cfpLoadingBar.start();
                // console.log("question id to be Deleted" + pQuestion.id);
                $surveyQuestion.delete_survey_question({query:{id:pQuestion.id}},function(pResponse){
                	$scope.parentScope.patientSurveyFormData.questions = _.without($scope.parentScope.patientSurveyFormData.questions, _.findWhere($scope.parentScope.patientSurveyFormData.questions, {id: pQuestion.id}));
					$mdDialog.show({
		                //clickOutsideToClose: true,
		                //scope: $scope,        // use parent scope in template
		                preserveScope: true,  // do not forget this if use parent scope
		                templateUrl: 'templates/desktop/alertDlgTmpl.html',
		                controller: function DialogController($scope, $mdDialog) {
		                  $scope.title='Delete Successful!';
		                  $scope.body='Question delete successfully.';
		                  //$scope.btn='Close';
		                  $scope.closeDialog = function() {
		                    $mdDialog.hide();
		                  }
		                }

		            }).finally(function() {
		                $mdDialog.hide();
		            });
		   //          $surveyQuestion.get_question_by_survey({query:{ "survey_id": $stateParams.surveyId }},function(collection){
		
					// 	_.each(collection,function(item,index){
					// 		item.show=false;
					// 		item.busyLoadingAnswers=true;
					// 	});
					// 	$scope.parentScope.$apply(function () {
					// 		$scope.parentScope.patientSurveyFormData.answers=[collection.length];
					// 		$scope.parentScope.patientSurveyFormData.questions=collection;
					// 	});
					// 	cfpLoadingBar.complete();
					// },function(err){
					// 	cfpLoadingBar.complete();
					// 	console.log(err);
					// });
					cfpLoadingBar.complete();
				},function(pError){
					cfpLoadingBar.complete();
				});

              }
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
         });
	}

	$scope.editQuestion=function($event,pQuestion){
				var parentEl = angular.element(document.body);
		pQuestion.submitText = 'Update';
		pQuestion.type= 'Survey Question';
		pQuestion.survey_id=$scope.patientSurveyFormData.survey.id;
		pQuestion.questionCodes=$scope.questionCodes;
		pQuestion.questionCategories=$scope.questionCategories;
		pQuestion.questionTypes=$scope.questionTypes;
	

		$mdDialog.show({
	        parent: parentEl,
	        targetEvent: $event,
	        templateUrl : 'templates/desktop/admin/updateSurveyQuestion.html',
	        controller: 'dialogCtrl',
	        locals: {
	          updateFormData: pQuestion
	        }
	    });
	}
	$scope.addQuestionToSurvey=function($event){
		var parentEl = angular.element(document.body);
		var lQuestion={};
		lQuestion.submitText = 'Create';
		lQuestion.type= 'Survey Question';
		lQuestion.survey_id=$scope.patientSurveyFormData.survey.id;
		lQuestion.questionCodes=$scope.questionCodes;
		lQuestion.questionCategories=$scope.questionCategories;
		lQuestion.questionTypes=$scope.questionTypes;

		lQuestion.updateView=$scope;
		//$scope.patientSurveyFormData.survey.patientTypes=[{id:0,name:"control user"},{id:1,name:"intervention"},{id:2,name:"Contact of Intervention"}];
		$mdDialog.show({
	        parent: parentEl,
	        targetEvent: $event,
	        templateUrl : 'templates/desktop/admin/updateSurveyQuestion.html',
	        controller: 'dialogCtrl',
	        locals: {
	          updateFormData: lQuestion
	        },
	        parentScope:$scope
	    });
	}
	$scope.saveQuestionDetails=function(){

	}

	$scope.editAnswer=function($event,pAnswer,pQuestion){
		var parentEl = angular.element(document.body);
		pAnswer.submitText = 'Update';
		pAnswer.type= 'Survey Answer';
		pAnswer.detail=pAnswer;
		pAnswer.detail.belongsToQuestion=pQuestion;
		pAnswer.updateView=$scope;
		
		$mdDialog.show({
	        parent: parentEl,
	        targetEvent: $event,
	        templateUrl : 'templates/desktop/admin/updateSurveyAnswers.html',
	        controller: 'dialogCtrl',
	        locals: {
	          updateFormData: pAnswer
	        }
	    });
	}

	$scope.deleteAnswer=function($event,pAnswer,pQuestion){
		$mdDialog.show({
            
            locals: {
              parentScope: $scope
            },
            preserveScope: true,  // do not forget this if use parent scope
            
            template: '<md-dialog class="md-transition-in dialog-border">'+
                      '<md-dialog-content class="dialog-content">'+
                      '<div layout="row" layout-align="center center" class="dialog-header">'+
                          '<div class="text24 white">Delete Answer</div>'+
                      '</div>'+
                      '<div class="md-dialog-content-body" >'+
                       '<div class="text16" style="margin:10px;padding-right:50px;padding-bottom:20px;">Are you sure you want to delete this answer?</div>'+
                      '</div>'+
                      
                      '  <md-dialog-actions layout-align="center center">'+
                      '   <md-button type="button" aria-label="Cancel" class="md-default-theme grey-button" ng-click="closeDialog()"><span class="ng-binding ng-scope">Cancel</span></md-button>'+
                      '   <div style="width:19px"></div>'+
                      '   <md-button type="button" aria-label="Copy" class="md-primary md-raised " ng-click="copyHandler()"><span class="ng-binding ng-scope">Delete</span></md-button>' +
                      '  </md-dialog-actions>'+
                      '</md-dialog-content>'+
                      '</md-dialog>',
            controller: function DialogController($scope, $mdDialog,locals) {
              $scope.parentScope=locals.parentScope;

              $scope.copyHandler= function(){
                                cfpLoadingBar.start();
                // console.log("answer id to be Deleted" + pAnswer.id);
                $surveyAnswer.delete_question_answer({query:{id:pAnswer.id}},function(pResponse){
					$mdDialog.show({
		                //clickOutsideToClose: true,
		                //scope: $scope,        // use parent scope in template
		                preserveScope: true,  // do not forget this if use parent scope
		                templateUrl: 'templates/desktop/alertDlgTmpl.html',
		                controller: function DialogController($scope, $mdDialog) {
		                  $scope.title='Deleted!';
		                  $scope.body='Answer delete successfully.';
		                  //$scope.btn='Close';
		                  $scope.closeDialog = function() {
		                    $mdDialog.hide();
		                  }
		                }
		            }).finally(function() {
		                $mdDialog.hide();
		            });
		            $scope.parentScope.getAnswers(pQuestion);
					cfpLoadingBar.complete();
				},function(pError){
					cfpLoadingBar.complete();
				});

              }
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
         });
	}

	/**handling the accordian*/

	$scope.surveyEditMode=false;
	  // initiate an array to hold all active tabs
    $scope.activeTabs = [];

    // check if the tab is active
    $scope.isOpenTab = function (tab) {
    	// console.log("is open tab called");        // check if this tab is already in the activeTabs array
        // if ($scope.activeTabs.indexOf(tab) > -1) {
        //     // if so, return true
        //     return true;
        // } else {
        //     // if not, return false
        //     return false;
        // }
        return false;
    }

    // function to 'open' a tab
    $scope.openTab = function ($event,question) {
    	    	if($event.target.nodeName !="MD-ICON")
    	{
    		if(question.show){

	    	}else{

	    		
	    		$scope.getAnswers(question);	

	    		question.busyLoadingAnswers=true;
	    	}
	    	question.show=!question.show;
    	}
    	
        // check if tab is already open
        // if ($scope.isOpenTab(tab)) {
        //     //if it is, remove it from the activeTabs array
        //     $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        // } else {
        //     // if it's not, add it!
        //     $scope.activeTabs.push(tab);
        // }

        
    }

    $scope.getAnswers=function(question){
    	$surveyAnswer.get_answers_by_question({query:{ survey_question_id: question.id }},function(collection){
    		_.each(collection,function(answer){
    			$scope.getSkipLogic(answer,question);
    		});
    		$scope.patientSurveyFormData.answers[question.sort_order]=collection;

    		question.busyLoadingAnswers=false;
		},function(err){
			
		});
    }
    
    $scope.getSkipLogic=function(pAnswer,question){
		
		delete pAnswer.skipLogicId;
    	$surveyQuestionSkipLogic.get_skip_logic_by_answers({query:{survey_answer_id:pAnswer.id}},function(response){
    		pAnswer.answerSkipLogic=[];
    		pAnswer.questionCodes= JSON.parse( JSON.stringify( $scope.questionCodes) );//Object.create($scope.questionCodes);//jQuery.extend(true,{}, $scope.questionCodes);;//create a clone
    		pAnswer.belongsToQuestion=question;
    		if(response && response.length>0){
    			var selectedCodes = response[0].skip_question_codes.split(',');
    			// console.log(selectedCodes);
    			 pAnswer.skipLogicId=response[0].id;
    			pAnswer.skipCodes=true;//flag to show icon on front end
    		

    				_.each(selectedCodes,function(c){
    					var count=0;
    					_.find(pAnswer.questionCodes,function(arrEl,index){ 
    						count = count +1;
			              if(arrEl.id ==c ){

			              	  arrEl.selected=true;
			              	  return count;
			              }
			            });
			            if(count>0){
			            	pAnswer.questionCodes[count-1].selected=true;
			            }

    				});
    			    			
    		}else{
    			
    			pAnswer.skipCodes=false;
    			_.each(pAnswer.questionCodes,function(code,index){
    					code.selected=false;
    			});
    			
    		}	

    	},function(err){

    	});
    	
    }

    $scope.openSkipView=function($event,answer){
    	var parentEl = angular.element(document.body);
		var lAnswer={};
		lAnswer.submitText = 'Update';
		lAnswer.type= 'Skip Questions';
		lAnswer.detail=answer;
		lAnswer.updateView=$scope;
		//lQuestion.updateView=$scope;
		// console.log(lAnswer);
		debugger;
		$mdDialog.show({
	        parent: parentEl,
	        targetEvent: $event,
	        templateUrl : 'templates/desktop/admin/updateSkipLogic.html',
	        controller: 'dialogCtrl',
	        locals: {
              updateFormData: lAnswer
            }
	    });
    }

    $scope.exportSurvey=function(){
    	cfpLoadingBar.start();
        var filename='export_survey_'+$stateParams.surveyId +'_log'+(new Date()).toISOString()+'.csv';
        $survey.generate_csv_results({query:{"id":$stateParams.surveyId}},function(pSuccess){
          if (window.navigator.msSaveOrOpenBlob) {
              var blob = new Blob([decodeURIComponent(encodeURI(pSuccess))], {
                type: "text/csv;charset=utf-8;"
              });
              // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
              window.navigator.msSaveBlob(blob, filename);
          } else if(navigator.userAgent.indexOf('Chrome') != -1){
              var link = angular.element('<a/>');
              link.attr({
                href: "data:attachment/csv;base64," + encodeURI($window.btoa(unescape(encodeURIComponent(pSuccess)))),
                target: '_blank',
                download: filename
              })[0].click();

              setTimeout(function(){
                link.remove();
              }, 50);
              
          }else{
            var iframe = document.createElement('iframe');
            iframe.src = 'data:attachment/csv;charset=utf-8,' + encodeURI(pSuccess);
            iframe.style.display = "none";
            iframe.download=filename;
            document.body.appendChild(iframe);  
            
          }
           cfpLoadingBar.complete();
           $mdDialog.hide();
        },function(pError){
          cfpLoadingBar.complete();
        });
    }

    
}]);
