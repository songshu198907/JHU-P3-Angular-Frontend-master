angular.module('Jhu.controllers')
.controller('dialogCtrl', ['$rootScope', '$scope', 'updateFormData', '$mdDialog', '$clinicianCode', '$education', '$race', '$topic', '$questionType', '$questionCategory', '$questionCode', '$vaccinationReminder','cfpLoadingBar','$user','$clinicianBlockRandomizer','$videoAuditLogging','$userAuditLogging','$healthcareProviderContent','$survey','$surveyAnswer','$userSurvey','$surveyQuestion','$surveyQuestionSkipLogic','$video','$timeout',
  function($rootScope, $scope, updateFormData, $mdDialog, $clinicianCode, $education, $race, $topic, $questionType, $questionCategory, $questionCode, $vaccinationReminder,cfpLoadingBar,$user,$clinicianBlockRandomizer,$videoAuditLogging,$userAuditLogging,$healthcareProviderContent,$survey,$surveyAnswer,$userSurvey,$surveyQuestion,$surveyQuestionSkipLogic,$video,$timeout) {
  $scope.updateFormData = updateFormData;

  $scope.editCancel = function() {
    $mdDialog.hide();
  }

  $scope.vaccinationRemindersDelete = function(pValid){
    cfpLoadingBar.start();
    $vaccinationReminder.delete({ id: updateFormData.id }).then(function(response) { // Success callback
          $mdDialog.hide();
          $mdDialog.show({
              //clickOutsideToClose: true,
              //scope: $scope,        // use parent scope in template
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog) {
                $scope.title='Deleted!';
                $scope.body='The record was deleted successfully.';
                //$scope.btn='Close';
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
          });
          $rootScope.$emit('firstView', updateFormData.type);
          cfpLoadingBar.complete();

      }, function(err) { // Error callback
        // There was an error while fetching the data
        cfpLoadingBar.complete();
      });
    
  }
  $scope.vaccinationRemindersSubmit=function(pValid){
    if(updateFormData.submitText == 'Update'){
      cfpLoadingBar.start();
      $vaccinationReminder.get({ id: updateFormData.id }).then(function(response) { // Success callback
      console.log('what is the response', response);
      response.message_text=$scope.updateFormData.message_text;
      response.trigger_days_from_dob=$scope.updateFormData.trigger_days_from_dob;
      
      response.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
        $mdDialog.show({
              //clickOutsideToClose: true,
              //scope: $scope,        // use parent scope in template
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog) {
                $scope.title='Saved!';
                $scope.body='The record updated successfully.';
                //$scope.btn='Close';
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
          });
          $rootScope.$emit('firstView', updateFormData.type);
          cfpLoadingBar.complete();
        });
      }, function(err) { // Error callback
      // There was an error while fetching the data
        cfpLoadingBar.complete();
      });
    } else if(updateFormData.submitText == 'Create'){
      var newRecord = $vaccinationReminder.create({
        message_text: updateFormData.message_text,
        trigger_days_from_dob: updateFormData.trigger_days_from_dob
      });
      cfpLoadingBar.start();
      newRecord.$save().then(function(pSuccess) {
          //Saved user profile data
        $mdDialog.hide();
        $mdDialog.show({
              //clickOutsideToClose: true,
              //scope: $scope,        // use parent scope in template
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog) {
                $scope.title='Saved!';
                $scope.body='The record was created successfully.';
                //$scope.btn='Close';
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
          });
          $rootScope.$emit('firstView', updateFormData.type);
          cfpLoadingBar.complete();
        }, function(err) { // Error callback
        // There was an error while fetching the data
          cfpLoadingBar.complete();
        });
    }
  }
  $scope.questionTypesSubmit=function(pValid){
    if(updateFormData.submitText == 'Update'){
      cfpLoadingBar.start();
      $questionType.get({ id: updateFormData.id }).then(function(response) { // Success callback
      console.log('what is the response', response);
      response.name=$scope.updateFormData.name;
      response.control_type=$scope.updateFormData.control_type;
      
      response.$save().then(function(pSuccess) {

          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
              //clickOutsideToClose: true,
              //scope: $scope,        // use parent scope in template
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog) {
                $scope.title='Saved!';
                $scope.body='The record updated successfully.';
                //$scope.btn='Close';
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
          });
          cfpLoadingBar.complete();
          $rootScope.$emit('firstView', updateFormData.type);
        });
      }, function(err) { // Error callback
        // There was an error while fetching the data
        cfpLoadingBar.complete();
      });
    } else if(updateFormData.submitText == 'Create'){
      var newRecord = $questionType.create({
        name: updateFormData.name,
        control_type: updateFormData.control_type
      });
      cfpLoadingBar.start();
      newRecord.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
              //clickOutsideToClose: true,
              //scope: $scope,        // use parent scope in template
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog) {
                $scope.title='Saved!';
                $scope.body='The record was created successfully.';
                //$scope.btn='Close';
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
          });
          $rootScope.$emit('firstView', updateFormData.type);
          cfpLoadingBar.complete();
        }, function(err) { // Error callback
          // There was an error while fetching the data
          cfpLoadingBar.complete();
        });
    }
  }

  $scope.questionCategoriesSubmit=function(pValid){
    if(updateFormData.submitText == 'Update'){
      cfpLoadingBar.start();
      $questionCategory.get({ id: updateFormData.id }).then(function(response) { // Success callback
      console.log('what is the response', response);
      response.name=$scope.updateFormData.name;
      
      response.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
              //clickOutsideToClose: true,
              //scope: $scope,        // use parent scope in template
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog) {
                $scope.title='Saved!';
                $scope.body='The record updated successfully.';
                //$scope.btn='Close';
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
          });
          $rootScope.$emit('firstView', updateFormData.type);
          cfpLoadingBar.complete();
          
        });
      }, function(err) { // Error callback
        // There was an error while fetching the data
        cfpLoadingBar.complete();
      });
    } else if(updateFormData.submitText == 'Create'){
      var newRecord = $questionCategory.create({
        name: updateFormData.name
      });
      cfpLoadingBar.start();
      newRecord.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
            //clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.title='Saved!';
              $scope.body='The record was created successfully.';
              //$scope.btn='Close';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
        });
        $rootScope.$emit('firstView', updateFormData.type);
        cfpLoadingBar.complete();
        
        }, function(err) { // Error callback
          // There was an error while fetching the data
          cfpLoadingBar.complete();
        });
    }
  }

  $scope.questionCodesSubmit=function(pValid){
    if(updateFormData.submitText == 'Update'){
      cfpLoadingBar.start();
      $questionCode.get({ id: updateFormData.id }).then(function(response) { // Success callback
      console.log('what is the response', response);
      response.name=$scope.updateFormData.name;
      
      response.$save().then(function(pSuccess) {

          //Saved user profile data
        $mdDialog.hide();
        $mdDialog.show({
            //clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.title='Saved!';
              $scope.body='The record updated successfully.';
              //$scope.btn='Close';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
        });
        $rootScope.$emit('firstView', updateFormData.type);
        cfpLoadingBar.complete();
        
      });
        
      }, function(err) { // Error callback
        // There was an error while fetching the data
        cfpLoadingBar.complete();

      });
    } else if(updateFormData.submitText == 'Create'){
      var newRecord = $questionCode.create({
        name: updateFormData.name
      });
      cfpLoadingBar.start();
      newRecord.$save().then(function(pSuccess) {
          //Saved user profile data
        $mdDialog.hide();
        $mdDialog.show({
            //clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.title='Saved!';
              $scope.body='The record was created successfully.';
              //$scope.btn='Close';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
        });
        $rootScope.$emit('firstView', updateFormData.type);
        cfpLoadingBar.complete();

        
      }, function(err) { // Error callback
        // There was an error while fetching the data
        cfpLoadingBar.complete();

      });
    }
  }

  $scope.deleteQuestionCode=function(){
    
    if(updateFormData.submitText == 'Update'){
      
      $surveyQuestion.get_question_by_question_code({query:{"question_code_id": updateFormData.id}},function(response){

      //.then(function(response) { // Success callback
        if(response && response.length>0){
          $mdDialog.show({
              locals: {
                parentScope: $rootScope
              },
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog,locals) {
                $scope.parentScope=locals.parentScope;
                $scope.title='Delete Failed';
                $scope.body='Survey Question with label "'+response[0].label+'" contains this question code';
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
           });
        }else{

            $mdDialog.show({
              locals: {
                parentScope: $rootScope
              },
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/deleteDlgTpl.html',
              controller: function DialogController($scope, $mdDialog,locals) {
                $scope.parentScope=locals.parentScope;
                $scope.title='Delete Question Code';
                $scope.body='Are you sure you want to delete?';
                $scope.deleteHandler= function(){
                    cfpLoadingBar.start();
                    console.log(updateFormData.id);
                    $questionCode.delete({id:updateFormData.id}).
                        then(function(pResponse) { 
                        
                          
                          $mdDialog.hide();
                          
                          $mdDialog.show({
                              //clickOutsideToClose: true,
                              //scope: $scope,        // use parent scope in template
                              preserveScope: true,  // do not forget this if use parent scope
                              templateUrl: 'templates/desktop/alertDlgTmpl.html',
                              controller: function DialogController($scope, $mdDialog) {
                                $scope.title='Saved!';
                                $scope.body='The record updated successfully.';
                                //$scope.btn='Close';
                                $scope.closeDialog = function() {
                                  $mdDialog.hide();
                                }
                              }
                          });     
                          $rootScope.$emit('firstView', updateFormData.type);       
                        cfpLoadingBar.complete();
                        
                      },function(pError){

                      });

                }
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
           });
        }
      },function(err){
        cfpLoadingBar.complete();
      });
    }
    
  }

  $scope.racesSubmit=function(pValid){
    if(updateFormData.submitText == 'Update'){
      cfpLoadingBar.start();
      $race.get({ id: updateFormData.id }).then(function(response) { // Success callback
      console.log('what is the response', response);
      response.name=$scope.updateFormData.name;
      
      response.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
            clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            //preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function($scope, $mdDialog) {
              $scope.title='Saved!';
              $scope.body='The record updated successfully.';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
          });
          $rootScope.$emit('firstView', updateFormData.type);
          cfpLoadingBar.complete();
          
        });

      }, function(err) { // Error callback
      // There was an error while fetching the data
        cfpLoadingBar.complete();
      });
    } else if(updateFormData.submitText == 'Create'){
      var newRecord = $race.create({
        name: updateFormData.name
      });
      cfpLoadingBar.start();
      newRecord.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
            //clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.title='Saved!';
              $scope.body='The record was created successfully.';
              //$scope.btn='Close';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
          });
          $rootScope.$emit('firstView', updateFormData.type);
          cfpLoadingBar.complete();
          
        }, function(err) { // Error callback
          // There was an error while fetching the data
          cfpLoadingBar.complete();
        });
    }
  }

  $scope.deleteRace=function(){
    if(updateFormData.submitText == 'Update'){
      debugger;
      cfpLoadingBar.start();
      $user.get_users_by_race({query:{"race_id": updateFormData.id}},function(response){
        cfpLoadingBar.complete();
      //.then(function(response) { // Success callback
        if(response && response.length>0){
          $mdDialog.show({
              locals: {
                parentScope: $rootScope
              },
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog,locals) {
                $scope.parentScope=locals.parentScope;
                $scope.title='Delete Failed';
                $scope.body='This race/ethnicity is currently being used';
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
           });
        }else{

            $mdDialog.show({
              locals: {
                parentScope: $rootScope
              },
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/deleteDlgTpl.html',
              controller: function DialogController($scope, $mdDialog,locals) {
                $scope.parentScope=locals.parentScope;
                $scope.title='Delete Race';
                $scope.body='Are you sure you want to delete?';
                $scope.deleteHandler= function(){
                    cfpLoadingBar.start();
                    console.log(updateFormData.id);
                    $race.delete({id:updateFormData.id}).
                        then(function(pResponse) { 
                        
                          
                          $mdDialog.hide();
                          
                          $mdDialog.show({
                              //clickOutsideToClose: true,
                              //scope: $scope,        // use parent scope in template
                              preserveScope: true,  // do not forget this if use parent scope
                              templateUrl: 'templates/desktop/alertDlgTmpl.html',
                              controller: function DialogController($scope, $mdDialog) {
                                $scope.title='Deleted!';
                                $scope.body='The record deleted successfully.';
                                //$scope.btn='Close';
                                $scope.closeDialog = function() {
                                  $mdDialog.hide();
                                }
                              }
                          });     
                          $rootScope.$emit('firstView', updateFormData.type);       
                        cfpLoadingBar.complete();
                        
                      },function(pError){

                      });

                }
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
           });
        }
      },function(err){
        cfpLoadingBar.complete();
      });
    }
  }

  $scope.dragEducationControlListeners=$scope.dragRaceControlListeners = {
    accept: function (sourceItemHandleScope, destSortableScope) {
      return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
      //return true;
    },//override to determine drag is allowed or not. default is true.
    itemMoved: function (event) {
      console.log(event);
    },//Do what you want},
    orderChanged: function(event) {
      console.log(event);
    },//Do what you want},
    containment: '#scrollable-container',
    scrollableContainer: '#scrollable-container',
    //clone: true, //optional param for clone feature.
    //allowDuplicates: false //optional param allows duplicates to be dropped.
  };
  $scope.sortRaceUpdate=function(){
    
    cfpLoadingBar.start();
    var updateItems=findUpdateOrder(updateFormData.original,updateFormData.sort);
    console.log(updateItems);
    if(updateItems.length>0){
      _.each(updateItems,function(item,index){
        $race.get({ id: item.id }).then(function(response) { // Success callback
          response.name=item.name;
          debugger;
          response.$save().then(function(pSuccess) {
            debugger;
            if(index==updateItems.length-1){
              cfpLoadingBar.complete();
              $mdDialog.hide();  
            }
            
          });
        }, function(err) { // Error callback
        // There was an error while fetching the data
          cfpLoadingBar.complete();
          $mdDialog.hide();
        });
      });  
    }else{
      cfpLoadingBar.complete();
      $mdDialog.hide();  
    }
    

  }
  $scope.sortEducationUpdate=function(){
    
    cfpLoadingBar.start();
    var updateItems=findUpdateOrder(updateFormData.original,updateFormData.sort);
    console.log(updateItems);
    if(updateItems.length>0){
      _.each(updateItems,function(item,index){
        $education.get({ id: item.id }).then(function(response) { // Success callback
          response.name=item.name;
          debugger;
          response.$save().then(function(pSuccess) {
            debugger;
            if(index==updateItems.length-1){
              cfpLoadingBar.complete();
              $mdDialog.hide();  
            }
            
          });
        }, function(err) { // Error callback
        // There was an error while fetching the data
          cfpLoadingBar.complete();
          $mdDialog.hide();
        });
      });  
    }else{
      cfpLoadingBar.complete();
      $mdDialog.hide();  
    }
    

  }

  findUpdateOrder=function(original,sorted){
    var updateItems=[];
    for(var i=0;i<original.length;i++){
      if(original[i].id !==sorted[i].id){
        original[i].name=sorted[i].name;
        updateItems.push(original[i]);
      }
    }
    return updateItems;

  }
  $scope.deleteEducation=function(){
      if(updateFormData.submitText == 'Update'){
      debugger;
      cfpLoadingBar.start();
      $user.get_users_by_education({query:{"education_id": updateFormData.id}},function(response){
        cfpLoadingBar.complete();
      //.then(function(response) { // Success callback
        if(response && response.length>0){
          $mdDialog.show({
              locals: {
                parentScope: $rootScope
              },
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog,locals) {
                $scope.parentScope=locals.parentScope;
                $scope.title='Delete Failed';
                $scope.body='This Education is currently being used';
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
           });
        }else{

            $mdDialog.show({
              locals: {
                parentScope: $rootScope
              },
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/deleteDlgTpl.html',
              controller: function DialogController($scope, $mdDialog,locals) {
                $scope.parentScope=locals.parentScope;
                $scope.title='Delete Education';
                $scope.body='Are you sure you want to delete?';
                $scope.deleteHandler= function(){
                    cfpLoadingBar.start();
                    console.log(updateFormData.id);
                    $education.delete({id:updateFormData.id}).
                        then(function(pResponse) { 
                          $mdDialog.hide();
                          $mdDialog.show({
                              //clickOutsideToClose: true,
                              //scope: $scope,        // use parent scope in template
                              preserveScope: true,  // do not forget this if use parent scope
                              templateUrl: 'templates/desktop/alertDlgTmpl.html',
                              controller: function DialogController($scope, $mdDialog) {
                                $scope.title='Deleted!';
                                $scope.body='The record deleted successfully.';
                                //$scope.btn='Close';
                                $scope.closeDialog = function() {
                                  $mdDialog.hide();
                                }
                              }
                          });     
                          $rootScope.$emit('firstView', updateFormData.type);       
                        cfpLoadingBar.complete();
                        
                      },function(pError){

                      });

                }
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
           });
        }
      },function(err){
        cfpLoadingBar.complete();
      });
    }
  }

  $scope.educationsSubmit=function(pValid){
    if(updateFormData.submitText == 'Update'){
      cfpLoadingBar.start();
      $education.get({ id: updateFormData.id }).then(function(response) { // Success callback
      console.log('what is the response', response);
      response.name=$scope.updateFormData.name;
      
      response.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
            //clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.title='Saved!';
              $scope.body='The record updated successfully.';
              //$scope.btn='Close';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
          });
          $rootScope.$emit('firstView', updateFormData.type);
          cfpLoadingBar.complete();
          
        });
      }, function(err) { // Error callback
      // There was an error while fetching the data
        cfpLoadingBar.complete();
      });
    } else if(updateFormData.submitText == 'Create'){
      var newRecord = $education.create({
        name: updateFormData.name
      });
      cfpLoadingBar.start();
      newRecord.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
            //clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.title='Saved!';
              $scope.body='The record was created successfully.';
              //$scope.btn='Close';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
          });
          $rootScope.$emit('firstView', updateFormData.type);
          cfpLoadingBar.complete();
          
        }, function(err) { // Error callback
          // There was an error while fetching the data
          cfpLoadingBar.complete();
        });
    }
  }

  $scope.topicsSubmit=function(pValid){
    if(updateFormData.submitText == 'Update'){
      cfpLoadingBar.start();
      $topic.get({ id: updateFormData.id }).then(function(response) { // Success callback
      console.log('what is the response', response);
      response.name=$scope.updateFormData.name;
      
      response.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
            //clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.title='Saved!';
              $scope.body='The record updated successfully.';
              //$scope.btn='Close';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
          });
          $rootScope.$emit('firstView', updateFormData.type);
          cfpLoadingBar.complete();  
          
        });

      }, function(err) { // Error callback
        // There was an error while fetching the data
        cfpLoadingBar.complete();
      });
    } else if(updateFormData.submitText == 'Create'){
      var newRecord = $topic.create({
        name: updateFormData.name
      });
      cfpLoadingBar.start();
      newRecord.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
            //clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.title='Saved!';
              $scope.body='The record was created successfully.';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
          });
          $rootScope.$emit('firstView', updateFormData.type);
          cfpLoadingBar.complete();

        }, function(err) { // Error callback
          // There was an error while fetching the data
          cfpLoadingBar.complete();
        });
    }
  }
  $scope.deleteClinicCode=function(){
    
    if(updateFormData.submitText == 'Update'){
      
      //$user.get_patients_by_clinics({ "clinic_code_id": updateFormData.id,"is_deactivate":0 }).then(function(response) { // Success callback


            $mdDialog.show({
              locals: {
                parentScope: $rootScope
              },
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/deleteDlgTpl.html',
              controller: function DialogController($scope, $mdDialog,locals) {
                $scope.parentScope=locals.parentScope;
                $scope.title='Delete Clinic Code';
                $scope.body='Are you sure you want to delete?';
                $scope.deleteHandler= function(){
                    cfpLoadingBar.start();
                    console.log(updateFormData.id);
                    $clinicianCode.delete({id:updateFormData.id}).
                        then(function(pResponse) { 
                          $mdDialog.hide();
                          
                          $mdDialog.show({
                              //clickOutsideToClose: true,
                              //scope: $scope,        // use parent scope in template
                              preserveScope: true,  // do not forget this if use parent scope
                              templateUrl: 'templates/desktop/alertDlgTmpl.html',
                              controller: function DialogController($scope, $mdDialog) {
                                $scope.title='Deleted!';
                                $scope.body='The record deleted successfully.';
                                //$scope.btn='Close';
                                $scope.closeDialog = function() {
                                  $mdDialog.hide();
                                }
                              }
                          });     
                          $rootScope.$emit('firstView', "clinicianCode");       
                        cfpLoadingBar.complete();
                        
                      },function(pError){
                        $mdDialog.show({
                              //clickOutsideToClose: true,
                              //scope: $scope,        // use parent scope in template
                              preserveScope: true,  // do not forget this if use parent scope
                              templateUrl: 'templates/desktop/alertDlgTmpl.html',
                              controller: function DialogController($scope, $mdDialog) {
                                $scope.title='Failed!';
                                $scope.body='The clinic code is being used by a registered user account.';
                                //$scope.btn='Close';
                                $scope.closeDialog = function() {
                                  $mdDialog.hide();
                                }
                              }
                          });  
                          cfpLoadingBar.complete();  
                      });

                }
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
           });
    }
    
  }
  $scope.clinicCodeSubmit=function(pValid){
    if(updateFormData.submitText == 'Update'){
      cfpLoadingBar.start();
      $clinicianCode.get({ id: updateFormData.id }).then(function(response) { // Success callback
      console.log('what is the response', response);
      response.name=$scope.updateFormData.name;
      response.code=$scope.updateFormData.code;
      
      response.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
            //clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.title='Saved!';
              $scope.body='The record updated successfully.';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
          });
          $rootScope.$emit('firstView', "clinicianCode");
          cfpLoadingBar.complete();
          
        });
        
      }, function(err) { // Error callback
        // There was an error while fetching the data
        cfpLoadingBar.complete();
      });
    } else if(updateFormData.submitText == 'Create'){
      var newRecord = $clinicianCode.create({
        name: updateFormData.name,
        code: updateFormData.code
      });
      cfpLoadingBar.start();
      newRecord.$save().then(function(pSuccess) {
          //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
            //clickOutsideToClose: true,
            //scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/alertDlgTmpl.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.title='Saved!';
              $scope.body='The record was created successfully.';
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
          });
          $rootScope.$emit('firstView', "clinicianCode");
          cfpLoadingBar.complete();
          
        }, function(err) { // Error callback
        // There was an error while fetching the data
          cfpLoadingBar.complete();
        });
    }
  }
  $scope.patientsSubmit=function(pValid){
    
    if(pValid){
      if(updateFormData.submitText == 'Update'){
        cfpLoadingBar.start();
        $user.get({ id: updateFormData.id }).then(function(response) { // Success callback
        console.log('what is the response', response);
        response.email=$scope.updateFormData.email;
        response.first_name=$scope.updateFormData.first_name;
        response.last_name=$scope.updateFormData.last_name;
        response.cell_phone=$scope.updateFormData.cell_phone;
        response.home_phone=$scope.updateFormData.home_phone;
        response.city=$scope.updateFormData.city;
        response.state=$scope.updateFormData.state;
        response.address=$scope.updateFormData.address;
        response.postal_code=$scope.updateFormData.postal_code;
        response.contact_cell_phone=$scope.updateFormData.contact_cell_phone;
        response.contact_email=$scope.updateFormData.contactEmail;
        response.contact_home_phone=$scope.updateFormData.contact_home_phone;
        response.contact_name=$scope.updateFormData.contact_name;
        response.expected_child_birth= $scope.updateFormData.expected_child_birth;
        response.actual_child_birth= $scope.updateFormData.actual_child_birth;
        response.race_id=$scope.updateFormData.race_id;
        response.education_id=$scope.updateFormData.education_id;
        response.password=$scope.updateFormData.password;
        response.password_confirmation=$scope.updateFormData.password_confirmation;

        response.$save().then(function(pSuccess) {
            //Saved user profile data
            $mdDialog.hide();
          $mdDialog.show({
                //clickOutsideToClose: true,
                //scope: $scope,        // use parent scope in template
                preserveScope: true,  // do not forget this if use parent scope
                templateUrl: 'templates/desktop/alertDlgTmpl.html',
                controller: function DialogController($scope, $mdDialog) {
                  $scope.title='Saved!';
                  $scope.body='The record updated successfully.';
                  //$scope.btn='Close';
                  $scope.closeDialog = function() {
                    $mdDialog.hide();
                  }
                }
            });
            $rootScope.$emit('firstView', "patients");
            cfpLoadingBar.complete();
          },function(err){
            updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
            
            cfpLoadingBar.complete();
          });
        }, function(err) { // Error callback
        // There was an error while fetching the data
        
        updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
            
          cfpLoadingBar.complete();
        });
      } else if(updateFormData.submitText == 'Create'){
        var newRecord = $user.create({
          clinician_code : updateFormData.clinician_code_id,
          first_name : updateFormData.first_name,
          last_name : updateFormData.last_name,
          email : updateFormData.email,
          password : updateFormData.password,
          password_confirmation : updateFormData.password_confirmation,
          cell_phone : updateFormData.cell_phone,
          home_phone : updateFormData.home_phone,
          address : updateFormData.address,
          city : updateFormData.city,
          state : updateFormData.state,
          postal_code: updateFormData.postal_code,
          contact_name: updateFormData.contact_name,
          contact_cell_phone: updateFormData.contact_cell_phone,
          contact_email: updateFormData.contact_email,
          contact_home_phone : updateFormData.contact_home_phone,
          expected_child_birth: updateFormData.expected_child_birth,
          actual_child_birth: updateFormData.actual_child_birth,
          race_id:$scope.updateFormData.race_id,
          education_id:$scope.updateFormData.education_id,
          role:'patient'
        });
        cfpLoadingBar.start();
        newRecord.$save().then(function(pSuccess) {
            //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
                //clickOutsideToClose: true,
                //scope: $scope,        // use parent scope in template
                preserveScope: true,  // do not forget this if use parent scope
                templateUrl: 'templates/desktop/alertDlgTmpl.html',
                controller: function DialogController($scope, $mdDialog) {
                  $scope.title='Saved!';
                  $scope.body='The record was created successfully.';
                  //$scope.btn='Close';
                  $scope.closeDialog = function() {
                    $mdDialog.hide();
                  }
                }
            });
            $rootScope.$emit('firstView', "patients");
            cfpLoadingBar.complete();
          }, function(err) { // Error callback
          // There was an error while fetching the data
            updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
            cfpLoadingBar.complete();
          });
      }
    }
  }

  $scope.deactivate =function(){
    $mdDialog.hide();
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
                      '      <div class="text24 white" layout-margin >Why are you closing this account?</div>'+
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

                cfpLoadingBar.start();//start activity indicator
                //send reset password request
                $user.get({ id: updateFormData.id }).then(function(response) { // Success callback
                  response.deactivated_on= new Date();
                  response.is_deactive=1;
                  if($scope.reasonsData.reason == 'other') {
                    response.reason_for_deactivation=$scope.reasonsData.otherReason;
                  } else {
                    response.reason_for_deactivation=$scope.reasonsData.reason; 
                  }
                  response.$save().then( function(pSuccess) { // Success callback
                      cfpLoadingBar.complete();
                      $mdDialog.hide();
                     
                      
                    })
                    .catch(function(err) { // Error callback
                      cfpLoadingBar.complete();
                      if(err.data.message){
                        $scope.reasonsData.message=err.data.message;
                      }
                    }); 
                }, function(err) { // Error callback
                  // There was an error while fetching the data
                      
                    cfpLoadingBar.complete();
                });
                
              }
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
         });
    
  }

  $scope.healthcareSubmit=function(pValid){
    
    if(pValid){
      if(updateFormData.submitText == 'Update'){
        cfpLoadingBar.start();
        $user.get({ id: updateFormData.id }).then(function(response) { // Success callback
          
        response.clinician_code_id=$scope.updateFormData.selected_clinic.id;
        response.first_name = $scope.updateFormData.first_name;
        response.last_name = $scope.updateFormData.last_name;
        response.email = $scope.updateFormData.email;  
        response.cell_phone = $scope.updateFormData.cell_phone;
        response.home_phone = $scope.updateFormData.home_phone;

        response.$save().then(function(pSuccess) {
            //Saved user profile data
            $mdDialog.hide();
          $mdDialog.show({
                //clickOutsideToClose: true,
                //scope: $scope,        // use parent scope in template
                preserveScope: true,  // do not forget this if use parent scope
                templateUrl: 'templates/desktop/alertDlgTmpl.html',
                controller: function DialogController($scope, $mdDialog) {
                  $scope.title='Saved!';
                  $scope.body='The record updated successfully.';
                  //$scope.btn='Close';
                  $scope.closeDialog = function() {
                    $mdDialog.hide();
                  }
                }
            });
            $rootScope.$emit('firstView', "healthcareuser");
            cfpLoadingBar.complete();
          }, function(err) { // Error callback
              // There was an error while fetching the data
              updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
                
              cfpLoadingBar.complete();
          });
        }, function(err) { // Error callback
        // There was an error while fetching the data
        updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
            
          cfpLoadingBar.complete();
        });
      } else if(updateFormData.submitText == 'Create'){
        
          var newRecord = $user.create({
            clinician_code : updateFormData.selected_clinic.code,
            first_name : updateFormData.first_name,
            last_name : updateFormData.last_name,
            email : updateFormData.email,
            // password : updateFormData.password,
            // password_confirmation : updateFormData.password_confirmation,
            cell_phone : updateFormData.cell_phone,
            home_phone : updateFormData.home_phone,
            address : updateFormData.address,
            city : updateFormData.city,
            state : updateFormData.state,
            postal_code: updateFormData.postal_code,
            race_id:updateFormData.race,
            education_id:updateFormData.education,
            reset_password:true
          });
          cfpLoadingBar.start();
          newRecord.$save().then(function(pSuccess) {
              //Saved user profile data
              $mdDialog.hide();
            $mdDialog.show({
                //clickOutsideToClose: true,
                //scope: $scope,        // use parent scope in template
                preserveScope: true,  // do not forget this if use parent scope
                templateUrl: 'templates/desktop/alertDlgTmpl.html',
                controller: function DialogController($scope, $mdDialog) {
                  $scope.title='Saved!';
                  $scope.body='The record was created successfully.';
                  //$scope.btn='Close';
                  $scope.closeDialog = function() {
                    $mdDialog.hide();
                  }
                }
              });
              $rootScope.$emit('firstView', "healthcareuser");
              cfpLoadingBar.complete();
            }, function(err) { // Error callback
            // There was an error while fetching the data
              updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
              cfpLoadingBar.complete();
            });
      }
    }else{
        updateFormData.message="There are still invalid fields";
      }
  }
  $scope.clinicBlockRandomizerSubmit=function(pValid){
    
    if(pValid){
      if(updateFormData.submitText == 'Update'){
        cfpLoadingBar.start();
        $clinicianBlockRandomizer.get({ id: updateFormData.id }).then(function(response) { // Success callback
          
        response.clinician_code_id=$scope.updateFormData.selected_clinic.id;
        response.patient_type=$scope.updateFormData.selected_patient;
        response.intervention_group=$scope.updateFormData.intervention_group;
        response.$save().then(function(pSuccess) {
            //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
                
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog) {
                $scope.title='Saved!';
                $scope.body='The record updated successfully.';
                
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
            });
            $rootScope.$emit('firstView', "clinicianBlockRandomizer");
            cfpLoadingBar.complete();
          });
        }, function(err) { // Error callback
          // There was an error while fetching the data
          updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
            
          cfpLoadingBar.complete();
        });
      } else if(updateFormData.submitText == 'Create'){
          
          if($scope.updateFormData.create_count>100){// don't allow more then 100 creation at most
            return;
          }
          var newRecord = $clinicianBlockRandomizer.create({
            clinician_code_id: $scope.updateFormData.selected_clinic.id,
            patient_type : $scope.updateFormData.selected_patient,
            intervention_group:$scope.updateFormData.intervention_group,
            create_count:$scope.updateFormData.create_count
          });
          cfpLoadingBar.start();
          newRecord.$save().then(function(pSuccess) {
              //Saved user profile data
            $mdDialog.hide();
            $mdDialog.show({
                  //clickOutsideToClose: true,
                  //scope: $scope,        // use parent scope in template
                  preserveScope: true,  // do not forget this if use parent scope
                  templateUrl: 'templates/desktop/alertDlgTmpl.html',
                  controller: function DialogController($scope, $mdDialog) {
                    $scope.title='Saved!';
                    $scope.body='The record was created successfully.';
                    //$scope.btn='Close';
                    $scope.closeDialog = function() {
                      $mdDialog.hide();
                    }
                  }
              });
              $rootScope.$emit('firstView', "clinicianBlockRandomizer");
              cfpLoadingBar.complete();
            }, function(err) { // Error callback
            // There was an error while fetching the data
              updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
              cfpLoadingBar.complete();
            });
      
      }
    }else{
        updateFormData.message="There are still invalid fields";
    }
  }

  $scope.healthcareContentSubmit=function(pValid){
    
    if(pValid){
      if(updateFormData.submitText == 'Update'){
        cfpLoadingBar.start();
        var updateList=false;
        $healthcareProviderContent.get({ id: updateFormData.id }).then(function(response) { // Success callback

          if(response.category_group!==$scope.updateFormData.selected_category_group){
            updateList=true;
          }
          response.category_group=$scope.updateFormData.selected_category_group;
          response.title=$scope.updateFormData.title;
          response.desc=$scope.updateFormData.desc;
          response.keywords=$scope.updateFormData.keywords;
          response.external_link=$scope.updateFormData.external_link;
          response.content_type=$scope.file?$scope.file.type:"";
        //response.topic_id=$scope.updateFormData.selected_topic.id;

        response.$save().then(function(pSuccess) {
            if($scope.file){
               jQuery.ajax({
                     url : decodeURIComponent(pSuccess[0].external_link),
                     type : "PUT",
                     data :  $scope.file,
                     cache : false,
                     contentType : $scope.file.type,
                     processData : false,
                     success: function(err,success,response) { 
                      
                        $mdDialog.hide();

                        if(response.status=200){
                            $mdDialog.hide();
                            $mdDialog.show({
                                //clickOutsideToClose: true,
                                //scope: $scope,        // use parent scope in template
                                preserveScope: true,  // do not forget this if use parent scope
                                templateUrl: 'templates/desktop/alertDlgTmpl.html',
                                controller: function DialogController($scope, $mdDialog) {
                                  $scope.title='Saved!';
                                  $scope.body='The record updated successfully.';
                                  //$scope.btn='Close';
                                  $scope.closeDialog = function() {
                                    $mdDialog.hide();
                                  }
                                }
                            });            
                            $rootScope.$emit('firstView', 'healthcareProviderContent');
                            cfpLoadingBar.complete();
                        }else{
                          $mdDialog.hide();
                          $mdDialog.show({
                            //clickOutsideToClose: true,
                            //scope: $scope,        // use parent scope in template
                            preserveScope: true,  // do not forget this if use parent scope
                            templateUrl: 'templates/desktop/alertDlgTmpl.html',
                            controller: function DialogController($scope, $mdDialog) {
                              $scope.title='Failed to Upload File!';
                              $scope.body='Failed to upload File.';
                              //$scope.btn='Close';
                              $scope.closeDialog = function() {
                                $mdDialog.hide();
                              }
                            }
                          });
                        }
                    }
                 })
                 .done(function(err,success,pResponse){
                   
                     console.info('YEAH');
                 })
                 .fail(function(error){
                   
                      $mdDialog.hide();                    
                     $mdDialog.show({
                          preserveScope: true,  // do not forget this if use parent scope
                          templateUrl: 'templates/desktop/alertDlgTmpl.html',
                          controller: function DialogController($scope, $mdDialog) {
                            $scope.title='Failed to Upload File!';
                            $scope.body='Failed to upload File.';
                            //$scope.btn='Close';
                            $scope.closeDialog = function() {
                              $mdDialog.hide();
                            }
                          }
                      });
                });
              
              }else{
                $mdDialog.hide();
                $rootScope.$emit('firstView', 'healthcareProviderContent');
                $mdDialog.show({
                    //clickOutsideToClose: true,
                    //scope: $scope,        // use parent scope in template
                    preserveScope: true,  // do not forget this if use parent scope
                    templateUrl: 'templates/desktop/alertDlgTmpl.html',
                    controller: function DialogController($scope, $mdDialog) {
                      $scope.title='Saved!';
                      $scope.body='The record updated successfully.';
                      
                      $scope.closeDialog = function() {
                        $mdDialog.hide();
                      }
                    }
                });
                cfpLoadingBar.complete();
              }
          });
        }, function(err) { // Error callback
          // There was an error while fetching the data
          updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
          cfpLoadingBar.complete();
        });
      } else if(updateFormData.submitText == 'Create'){
        
          var newRecord = $healthcareProviderContent.create({
            category_group: $scope.updateFormData.selected_category_group,
            title : $scope.updateFormData.title,
            desc:$scope.updateFormData.desc,
            keywords:$scope.updateFormData.keywords,
            content_type:$scope.file?$scope.file.type:"",
            external_link:$scope.updateFormData.external_link
            //topic_id:$scope.updateFormData.selected_topic.id
          });

          cfpLoadingBar.start();
          
          newRecord.$save().then(function(pSuccess) {
              //Saved user profile data
              if(pSuccess){
                if(pSuccess.category_group!="useful links" && $scope.file && pSuccess.length>0){
                    jQuery.ajax({
                       url : decodeURIComponent(pSuccess[0].external_link),
                       type : "PUT",
                       data :  $scope.file,
                       cache : false,
                       contentType : $scope.file.type,
                       processData : false,
                      //  xhr: function(){
                      //       // get the native XmlHttpRequest object
                      //       var xhr = $.ajaxSettings.xhr() ;
                      //       // set the onprogress event handler
                      //       xhr.upload.onprogress = function(evt){ 
                      //         console.log('progress', evt.loaded/evt.total*100) 
                      //       } ;
                      //       // set the onload event handler
                      //       //xhr.upload.onload = function(){ console.log('DONE!') } ;
                      //       // return the customized object
                      //       return xhr ;
                      // },
                       success: function(err,success,response) { 
                        
                        
                          $rootScope.$emit('firstView', 'healthcareProviderContent');
                          
                          $mdDialog.hide();
                          cfpLoadingBar.complete();
                          if(response.status=200){
                              $mdDialog.hide();
                              $mdDialog.show({
                              //clickOutsideToClose: true,
                              //scope: $scope,        // use parent scope in template
                              preserveScope: true,  // do not forget this if use parent scope
                              templateUrl: 'templates/desktop/alertDlgTmpl.html',
                              controller: function DialogController($scope, $mdDialog) {
                                $scope.title='Saved!';
                                $scope.body='The record was created successfully.';
                                //$scope.btn='Close';
                                $scope.closeDialog = function() {
                                  $mdDialog.hide();
                                }
                              }
                            });
                          }else{
                            $mdDialog.hide();
                            $mdDialog.show({
                              //clickOutsideToClose: true,
                              //scope: $scope,        // use parent scope in template
                              preserveScope: true,  // do not forget this if use parent scope
                              templateUrl: 'templates/desktop/alertDlgTmpl.html',
                              controller: function DialogController($scope, $mdDialog) {
                                $scope.title='Failed to Upload File!';
                                $scope.body='Failed to upload File.';
                                //$scope.btn='Close';
                                $scope.closeDialog = function() {
                                  $mdDialog.hide();
                                }
                              }
                            });
                          }
                          
                          
                        //console.log('Uploaded data successfully.'); 
                        }
                   })
                   .done(function(err,success,pResponse){
                     
                       console.info('YEAH');
                   })
                   .fail(function(error){
                        $mdDialog.hide();
                       $mdDialog.show({
                        //clickOutsideToClose: true,
                        //scope: $scope,        // use parent scope in template
                        preserveScope: true,  // do not forget this if use parent scope
                        templateUrl: 'templates/desktop/alertDlgTmpl.html',
                        controller: function DialogController($scope, $mdDialog) {
                          $scope.title='Failed!';
                          $scope.body='Failed to upload content.';
                          //$scope.btn='Close';
                          $scope.closeDialog = function() {
                            $mdDialog.hide();
                          }
                        }
                        });
                        cfpLoadingBar.complete();
                  });
                 }else{
                  $mdDialog.hide();
                    $mdDialog.show({
                        //clickOutsideToClose: true,
                        //scope: $scope,        // use parent scope in template
                        preserveScope: true,  // do not forget this if use parent scope
                        templateUrl: 'templates/desktop/alertDlgTmpl.html',
                        controller: function DialogController($scope, $mdDialog) {
                          $scope.title='Saved!';
                          $scope.body='The record was created successfully.';
                          //$scope.btn='Close';
                          $scope.closeDialog = function() {
                            $mdDialog.hide();
                          }
                        }
                    });
                    cfpLoadingBar.complete();
                 }
              
              }
              
              //$rootScope.$emit('firstView', updateFormData.type);
              
            }, function(err) { // Error callback
            // There was an error while fetching the data
              updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
              cfpLoadingBar.complete();
            });
      
      }
    }else{
        updateFormData.message="There are still invalid fields";
    }
  }

  $scope.patientSurveyDetailSubmit=function(pValid){
    
    if(pValid){

      if(updateFormData.submitText == 'Update'){
        cfpLoadingBar.start();
        
        $survey.active_surveys_by_type_patient(
          {query:{id:$scope.updateFormData.id,survey_type:$scope.updateFormData.survey_type,patient_type:$scope.updateFormData.selected_patient_type}},
          function(pResponse){
          
          if(pResponse && pResponse.length==0 && $scope.updateFormData.is_active==false)
          {
            $mdDialog.hide();
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
              });
              $scope.updateFormData.is_active=true;
            cfpLoadingBar.complete();
          }else{
            cfpLoadingBar.start();
            
            $scope.updateFormData.patient_type=$scope.updateFormData.selected_patient_type;
            $survey.get({id:$scope.updateFormData.id}).then(function(pResponse){
                //select intervention group to null when id is 0
                console.log($scope.updateFormData.selected_patient_type);
                var lInterventionGroup=($scope.updateFormData.selected_patient_type==0)?null:$scope.updateFormData.selected_intervention_group;
                $scope.updateFormData.intervention_group=lInterventionGroup;
                pResponse.intervention_group=lInterventionGroup
                pResponse.is_active=$scope.updateFormData.is_active;
                pResponse.name=$scope.updateFormData.name;
                pResponse.patient_type=$scope.updateFormData.selected_patient_type;
                pResponse.survey_type=$scope.updateFormData.selected_survey_type;
                pResponse.total_questions=$scope.updateFormData.total_questions;
                pResponse.version=$scope.updateFormData.version;

                pResponse.$save().then(function(pSuccess) {
                  $mdDialog.hide();
                  $rootScope.$broadcast('surveyupdated', $scope.updateFormData);

                  
                  $mdDialog.show({
                      //clickOutsideToClose: true,
                      //scope: $scope,        // use parent scope in template
                      preserveScope: true,  // do not forget this if use parent scope
                      templateUrl: 'templates/desktop/alertDlgTmpl.html',
                      controller: function DialogController($scope, $mdDialog) {
                        $scope.title='Saved!';
                        $scope.body='The record updated successfully.';
                        
                        
                        //$scope.btn='Close';
                        $scope.closeDialog = function() {
                          $mdDialog.hide();
                        }
                      }
                  });
                  cfpLoadingBar.complete();
                },function(pError){
                  
                  cfpLoadingBar.complete();
                });
              });
            
          }
          
        },function(pError){
          
        });
      
    } else if(updateFormData.submitText == 'Create'){
        var newRecord = $survey.create({
            intervention_group: $scope.updateFormData.selected_intervention_group,
            is_active : $scope.updateFormData.is_active,
            name:$scope.updateFormData.name,
            patient_type:$scope.updateFormData.selected_patient_type,
            survey_type:$scope.updateFormData.selected_survey_type,
            total_questions:$scope.updateFormData.total_questions,
            version:$scope.updateFormData.version
        });

        cfpLoadingBar.start();
        newRecord.$save().then(function(pSuccess) {
            //Saved user profile data
          $mdDialog.hide();
          $mdDialog.show({
                //clickOutsideToClose: true,
                //scope: $scope,        // use parent scope in template
                preserveScope: true,  // do not forget this if use parent scope
                templateUrl: 'templates/desktop/alertDlgTmpl.html',
                controller: function DialogController($scope, $mdDialog) {
                  $scope.title='Saved!';
                  $scope.body='The record was created successfully.';
                  //$scope.btn='Close';
                  $scope.closeDialog = function() {
                    $mdDialog.hide();
                  }
                }
            });

            $rootScope.$emit('firstView', "patientsurveydata");
            cfpLoadingBar.complete();
          }, function(err) { // Error callback
            // There was an error while fetching the data
            updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
            cfpLoadingBar.complete();
          });
      
      }
    }else{
        updateFormData.message="There are still invalid fields";
    }
    
  }

  $scope.surveyQuestionSubmit=function(pValid){
    
    if(pValid){
      if(updateFormData.submitText == 'Update'){
        cfpLoadingBar.start();
        $mdDialog.hide();
        $surveyQuestion.get({id:$scope.updateFormData.id}).
          then(function(pResponse) { 
          
            pResponse.did_you_know_text=$scope.updateFormData.did_you_know_text;
            pResponse.label=$scope.updateFormData.label;
            pResponse.question_category_id=$scope.updateFormData.selected_category.id;
            pResponse.question_code_id=$scope.updateFormData.selected_code?$scope.updateFormData.selected_code.id:null;
            pResponse.question_group=$scope.updateFormData.selected_question_group;
            pResponse.question_text=$scope.updateFormData.question_text;
            pResponse.question_type_id=$scope.updateFormData.selected_question_type.id;
            pResponse.required_answer=$scope.updateFormData.required_answer?$scope.updateFormData.required_answer:0;
            pResponse.sort_order=$scope.updateFormData.sort_order;
            pResponse.survey_id=$scope.updateFormData.survey_id;
                  
            pResponse.$save().then(function(pSuccess) {
              
              $mdDialog.hide();
              $mdDialog.show({
                  
                  preserveScope: true,  // do not forget this if use parent scope
                  templateUrl: 'templates/desktop/alertDlgTmpl.html',
                  controller: function DialogController($scope, $mdDialog) {
                    $scope.title='Saved!';
                    $scope.body='The record updated successfully.';
                    //$scope.btn='Close';
                    $scope.closeDialog = function() {
                      $mdDialog.hide();
                    }
                  }
              });            
              cfpLoadingBar.complete();
          },function(pError){
              
              cfpLoadingBar.complete();
              $mdDialog.hide();
          });
            
          
          
        },function(pError){

        });
      
    } else if(updateFormData.submitText == 'Create'){
      
        var newRecord = $surveyQuestion.create({
          did_you_know_text:$scope.updateFormData.did_you_know_text,
          label:$scope.updateFormData.label,
          question_category_id:$scope.updateFormData.selected_category.id,
          question_code_id:$scope.updateFormData.selected_code?$scope.updateFormData.selected_code.id:null,
          question_group:$scope.updateFormData.selected_question_group,
          question_text:$scope.updateFormData.question_text,
          question_type_id:$scope.updateFormData.selected_question_type.id,
          required_answer:$scope.updateFormData.required_answer?$scope.updateFormData.required_answer:0,
          sort_order:$scope.updateFormData.sort_order,
          survey_id:$scope.updateFormData.survey_id
        });
        cfpLoadingBar.start();
        newRecord.$save().then(function(pSuccess) {
            //Saved user profile data
          $scope.updateFormData.updateView.updateQuestions=true;
          $mdDialog.hide();  
          $mdDialog.show({
                //clickOutsideToClose: true,
                //scope: $scope,        // use parent scope in template
                preserveScope: true,  // do not forget this if use parent scope
                templateUrl: 'templates/desktop/alertDlgTmpl.html',
                controller: function DialogController($scope, $mdDialog) {
                  $scope.title='Saved!';
                  $scope.body='The record was created successfully.';
                  //$scope.btn='Close';
                  $scope.closeDialog = function() {
                    $mdDialog.hide();
                  }
                }
            });

            //$rootScope.$emit('firstView', updateFormData.type);
            cfpLoadingBar.complete();
          }, function(err) { // Error callback
          // There was an error while fetching the data
            updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
            cfpLoadingBar.complete();
          });
      
      }
    }else{
        updateFormData.message="There are still invalid fields";
    }
    
  }

  $scope.surveyAnswerSubmit=function(updateForm){
    
    if(updateForm.$valid){
      if(updateFormData.submitText == 'Update'){
        cfpLoadingBar.start();    
        $surveyAnswer.get({id:$scope.updateFormData.id}).
          then(function(pResponse) { 
          
          pResponse.allow_free_form=$scope.updateFormData.allow_free_form;
          pResponse.free_form_data_type=$scope.updateFormData.free_form_data_type;
          pResponse.label=$scope.updateFormData.label;
          pResponse.sort_order=$scope.updateFormData.sort_order;
          pResponse.survey_question_id=$scope.updateFormData.survey_question_id;
          pResponse.video_target_number=$scope.updateFormData.video_target_number;
          pResponse.weight=$scope.updateFormData.weight;
            
          pResponse.$save().then(function(pSuccess) {
            

              
              $mdDialog.hide();
              $mdDialog.show({
                  //clickOutsideToClose: true,
                  //scope: $scope,        // use parent scope in template
                  preserveScope: true,  // do not forget this if use parent scope
                  templateUrl: 'templates/desktop/alertDlgTmpl.html',
                  controller: function DialogController($scope, $mdDialog) {
                    $scope.title='Saved!';
                    $scope.body='The record updated successfully.';
                    //$scope.btn='Close';
                    $scope.closeDialog = function() {
                      $mdDialog.hide();
                    }
                  }
              });            
              cfpLoadingBar.complete();
            },function(pError){
              
              cfpLoadingBar.complete();
              $mdDialog.hide();
            });
            
          //$scope.updateFormData.updateView.getAnswers($scope.updateFormData.survey_question_id);
          
        },function(pError){

        });
      
    } else if(updateFormData.submitText == 'Create'){
        var newRecord = $surveyAnswer.create({
            allow_free_form:$scope.updateFormData.allow_free_form,
            free_form_data_type:$scope.updateFormData.free_form_data_type,
            label:$scope.updateFormData.label,
            sort_order:$scope.updateFormData.sort_order,
            survey_question_id:$scope.updateFormData.survey_question_id,
            video_target_number:$scope.updateFormData.video_target_number,
            weight:$scope.updateFormData.weight
            
          });
          cfpLoadingBar.start();
          newRecord.$save().then(function(pSuccess) {
              //Saved user profile data
              $mdDialog.hide();
            $mdDialog.show({
                  //clickOutsideToClose: true,
                  //scope: $scope,        // use parent scope in template
                  preserveScope: true,  // do not forget this if use parent scope
                  templateUrl: 'templates/desktop/alertDlgTmpl.html',
                  controller: function DialogController($scope, $mdDialog) {
                    $scope.title='Saved!';
                    $scope.body='The record was created successfully.';
                    //$scope.btn='Close';
                    $scope.closeDialog = function() {
                      $mdDialog.hide();
                    }
                  }
              });

              $scope.updateFormData.updateView.getAnswers($scope.updateFormData.question);
              cfpLoadingBar.complete();
            }, function(err) { // Error callback
            // There was an error while fetching the data
              updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
              cfpLoadingBar.complete();
            });
      
      }
    }else{
        updateFormData.message="There are still invalid fields";
    }
    
  }

  $scope.healthCareContentDelete = function(pValid){
  

      $mdDialog.show({
            
            locals: {
              parentScope: $rootScope
            },
            preserveScope: true,  // do not forget this if use parent scope
            templateUrl: 'templates/desktop/deleteDlgTpl.html',
            
            controller: function DialogController($scope, $mdDialog,locals) {
              $scope.parentScope=locals.parentScope;
              $scope.title="Delete Health Care Content";
              $scope.body="Are you sure you want to delete?";

              $scope.deleteHandler= function(){
                
                cfpLoadingBar.start();
                $healthcareProviderContent.delete({ id: updateFormData.id }).then(function(response) { // Success callback
                  $scope.parentScope.$emit('firstView', 'healthcareProviderContent');
                      $mdDialog.hide();
                      $mdDialog.show({
                          //clickOutsideToClose: true,
                          //scope: $scope,        // use parent scope in template
                          preserveScope: true,  // do not forget this if use parent scope
                          templateUrl: 'templates/desktop/alertDlgTmpl.html',
                          controller: function DialogController($scope, $mdDialog) {
                            $scope.title='Deleted!';
                            $scope.body='The record was deleted successfully.';
                            //$scope.btn='Close';
                            $scope.closeDialog = function() {
                              $mdDialog.hide();
                            }
                          }
                      });

                      cfpLoadingBar.complete();

                  }, function(err) { // Error callback
                    // There was an error while fetching the data
                    cfpLoadingBar.complete();
                  });
                
                
              }
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }
            }
         });
    
    }
    $scope.openSkipView=function($event,answer,$scope){
      var parentEl = angular.element(document.body);
      var lAnswer={};
      lAnswer.submitText = 'Update';
      lAnswer.type= 'Skip Questions';
      lAnswer.detail=answer;
      

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

    $scope.skipLogicSubmit=function(pValid){
    
    if(pValid){
      if(updateFormData.submitText == 'Update'){
           
        var selectedCodes="";
          _.each($scope.updateFormData.detail.questionCodes,function(code,index){
            if(code.selected){
              if(index!=$scope.updateFormData.detail.questionCodes.length && selectedCodes!=""){
                selectedCodes+=",";
              }
              selectedCodes+=code.id;
            }
            
          });
          
          
        if($scope.updateFormData.detail.skipLogicId){
          cfpLoadingBar.start(); 
          $surveyQuestionSkipLogic.get({id:$scope.updateFormData.detail.skipLogicId}).then(function(pResponse) { 
          
          
          
          if(pResponse && selectedCodes!=null && selectedCodes!=""){
            pResponse.skip_question_codes=selectedCodes;
            
            pResponse.$save().then(function(pSuccess) {
              
                
                $mdDialog.hide();
                $mdDialog.show({
                    //clickOutsideToClose: true,
                    //scope: $scope,        // use parent scope in template
                    preserveScope: true,  // do not forget this if use parent scope
                    templateUrl: 'templates/desktop/alertDlgTmpl.html',
                    controller: function DialogController($scope, $mdDialog) {
                      $scope.title='Saved!';
                      $scope.body='The record updated successfully.';
                      //$scope.btn='Close';
                      $scope.closeDialog = function() {
                        $mdDialog.hide();
                      }
                    }
                });      
                $scope.updateFormData.updateView.getSkipLogic($scope.updateFormData.detail,$scope.updateFormData.detail.belongsToQuestion);      
                cfpLoadingBar.complete();
              },function(pError){
                
                cfpLoadingBar.complete();
                $mdDialog.hide();
              });
            }else{
              //selected codes is empty so delete the record.
              $surveyQuestionSkipLogic.delete({id:$scope.updateFormData.detail.skipLogicId}).then(function(result){
                $mdDialog.hide();
                $mdDialog.show({
                    //clickOutsideToClose: true,
                    //scope: $scope,        // use parent scope in template
                    preserveScope: true,  // do not forget this if use parent scope
                    templateUrl: 'templates/desktop/alertDlgTmpl.html',
                    controller: function DialogController($scope, $mdDialog) {
                      $scope.title='Skip Removed!';
                      $scope.body='Skip was removed successfully';
                      //$scope.btn='Close';
                      $scope.closeDialog = function() {
                        $mdDialog.hide();
                      }
                    }
                });          
                $scope.updateFormData.updateView.getSkipLogic($scope.updateFormData.detail,$scope.updateFormData.detail.belongsToQuestion);
                cfpLoadingBar.complete();

              },function(err){
                cfpLoadingBar.complete();
                $mdDialog.hide();
              });

              
            }
          });
        }else if(selectedCodes!=""){
          cfpLoadingBar.start(); 
            var newRecord = $surveyQuestionSkipLogic.create({
              skip_question_codes:selectedCodes,
              survey_answer_id:$scope.updateFormData.detail.id
            });
            cfpLoadingBar.start();
            newRecord.$save().then(function(pSuccess) {
              //Saved user profile data
              $mdDialog.hide();
              $mdDialog.show({
                  //clickOutsideToClose: true,
                  //scope: $scope,        // use parent scope in template
                  preserveScope: true,  // do not forget this if use parent scope
                  templateUrl: 'templates/desktop/alertDlgTmpl.html',
                  controller: function DialogController($scope, $mdDialog) {
                    $scope.title='Saved!';
                    $scope.body='The record was created successfully.';
                    //$scope.btn='Close';
                    $scope.closeDialog = function() {
                      $mdDialog.hide();
                    }
                  }
              });
              
              $scope.updateFormData.detail.updateView.getSkipLogic($scope.updateFormData.detail,$scope.updateFormData.detail.belongsToQuestion);
              //$rootScope.$emit('firstView', updateFormData.type);
              cfpLoadingBar.complete();
            }, function(err) { // Error callback
            // There was an error while fetching the data
              updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
              cfpLoadingBar.complete();
            });
          }else{
            cfpLoadingBar.complete();
            $mdDialog.hide();
          }
         
      }
    } else{
        updateFormData.message="There are still invalid fields";
    }
    
  }

  $scope.videoSubmit=function(updateForm){
    if(updateForm.$valid){
      if(updateFormData.submitText == 'Update'){
        
        // cfpLoadingBar.autoIncrement=false;
        // cfpLoadingBar.includeSpinner=false;
        cfpLoadingBar.start();

        
        $video.get({id:$scope.updateFormData.id}).
          then(function(pResponse) { 
          
          
          pResponse.title=$scope.updateFormData.title;
          pResponse.desc=$scope.updateFormData.desc;
          pResponse.length=$scope.updateFormData.length;
          pResponse.keywords=$scope.updateFormData.keywords;
          pResponse.source_version=$scope.updateFormData.selected_source_version;
          pResponse.target_number=$scope.updateFormData.target_number;
          pResponse.question_group=$scope.updateFormData.selected_question_group;
          pResponse.sort_order=$scope.updateFormData.sort_order;
          pResponse.content_type=$scope.file?$scope.file.type:"";
          //pResponse.is_active=$scope.updateFormData.is_active;

          pResponse.$save().then(function(pSuccess) {
            if($scope.file){
               jQuery.ajax({
                     url : decodeURIComponent(pSuccess[0].video_url),
                     type : "PUT",
                     data :  $scope.file,
                     cache : false,
                     contentType : $scope.file.type,
                     processData : false,
                     // xhr: function(){
                     //        // get the native XmlHttpRequest object
                     //        var xhr = $.ajaxSettings.xhr() ;
                     //        // set the onprogress event handler
                     //        xhr.upload.onprogress = function(evt){ 
                     //          console.log('progress', evt.loaded/evt.total*100);
                     //          cfpLoadingBar.set(evt.loaded/evt.total);
                     //          $scope.file.progress=evt.loaded/evt.total*100;
                     //        } ;
                     //        // set the onload event handler
                     //        //xhr.upload.onload = function(){ console.log('DONE!') } ;
                     //        // return the customized object
                     //        return xhr ;
                     //  },
                     success: function(err,success,response) { 
                      
                        $mdDialog.hide();
                        cfpLoadingBar.complete();
                        if(response.status=200){
                            $mdDialog.hide();
                            $mdDialog.show({
                                //clickOutsideToClose: true,
                                //scope: $scope,        // use parent scope in template
                                preserveScope: true,  // do not forget this if use parent scope
                                templateUrl: 'templates/desktop/alertDlgTmpl.html',
                                controller: function DialogController($scope, $mdDialog) {
                                  $scope.title='Saved!';
                                  $scope.body='The record updated successfully.';
                                  //$scope.btn='Close';
                                  $scope.closeDialog = function() {
                                    $mdDialog.hide();
                                  }
                                }
                            });            
                            $rootScope.$emit('firstView', 'video');

                        }else{
                          $mdDialog.hide();
                          $mdDialog.show({
                            //clickOutsideToClose: true,
                            //scope: $scope,        // use parent scope in template
                            preserveScope: true,  // do not forget this if use parent scope
                            templateUrl: 'templates/desktop/alertDlgTmpl.html',
                            controller: function DialogController($scope, $mdDialog) {
                              $scope.title='Failed to Upload File!';
                              $scope.body='Failed to upload File.';
                              //$scope.btn='Close';
                              $scope.closeDialog = function() {
                                $mdDialog.hide();
                              }
                            }
                          });
                        }
                    }
                 })
                 .done(function(err,success,pResponse){
                   
                     console.info('YEAH');
                 })
                 .fail(function(error){
                   
                     console.log('damn...');
                });
              
              }else{
                
                $mdDialog.hide();
                $mdDialog.show({
                    //clickOutsideToClose: true,
                    //scope: $scope,        // use parent scope in template
                    preserveScope: true,  // do not forget this if use parent scope
                    templateUrl: 'templates/desktop/alertDlgTmpl.html',
                    controller: function DialogController($scope, $mdDialog) {
                      $scope.title='Saved!';
                      $scope.body='The record updated successfully.';
                      //$scope.btn='Close';
                      $scope.closeDialog = function() {
                        $mdDialog.hide();
                      }
                    }
                });            
                $rootScope.$emit('firstView', 'video');
                cfpLoadingBar.complete();
              }

            
            
            
          },function(pError){
            
            cfpLoadingBar.complete();
            $mdDialog.hide();
          });
            
          
          
        },function(pError){

        });
      
    } else if(updateFormData.submitText == 'Create'){
        var newRecord = $video.create({
            title:$scope.updateFormData.title,
            desc:$scope.updateFormData.desc,
            length:$scope.updateFormData.length,
            keywords:$scope.updateFormData.keywords,
            source_version:$scope.updateFormData.selected_source_version,
            target_number:$scope.updateFormData.target_number,
            question_group:$scope.updateFormData.selected_question_group,
            sort_order:$scope.updateFormData.sort_order,
            content_type:$scope.file.type,
            is_active:true
          });

          cfpLoadingBar.start();
          newRecord.$save().then(function(pSuccess) {
            //Saved user profile data
            if(pSuccess && pSuccess.length>0){

                jQuery.ajax({
                     url : decodeURIComponent(pSuccess[0].video_url),
                     type : "PUT",
                     data :  $scope.file,
                     cache : false,
                     contentType : $scope.file.type,
                     processData : false,
                     success: function(err,success,response) { 
                      
                     
                        $rootScope.$emit('firstView', 'video');
                     
                        $mdDialog.hide();

                        if(response.status=200){
                          $mdDialog.hide();
                            $mdDialog.show({
                            //clickOutsideToClose: true,
                            //scope: $scope,        // use parent scope in template
                            preserveScope: true,  // do not forget this if use parent scope
                            templateUrl: 'templates/desktop/alertDlgTmpl.html',
                            controller: function DialogController($scope, $mdDialog) {
                              $scope.title='Saved!';
                              $scope.body='The record was created successfully.';
                              //$scope.btn='Close';
                              $scope.closeDialog = function() {
                                $mdDialog.hide();
                              }
                            }
                          });
                          cfpLoadingBar.complete();
                        }else{
                          $mdDialog.hide();
                          $mdDialog.show({
                            //clickOutsideToClose: true,
                            //scope: $scope,        // use parent scope in template
                            preserveScope: true,  // do not forget this if use parent scope
                            templateUrl: 'templates/desktop/alertDlgTmpl.html',
                            controller: function DialogController($scope, $mdDialog) {
                              $scope.title='Failed to Upload File!';
                              $scope.body='Failed to upload File.';
                              //$scope.btn='Close';
                              $scope.closeDialog = function() {
                                $mdDialog.hide();
                              }
                            }
                          });
                          cfpLoadingBar.complete();
                        }
                    }
                 })
                 .done(function(err,success,pResponse){
                   
                     console.info('YEAH');
                 })
                 .fail(function(error){
                   $mdDialog.hide();
                  $mdDialog.show({
                    //clickOutsideToClose: true,
                    //scope: $scope,        // use parent scope in template
                    preserveScope: true,  // do not forget this if use parent scope
                    templateUrl: 'templates/desktop/alertDlgTmpl.html',
                    controller: function DialogController($scope, $mdDialog) {
                      $scope.title='Failed!';
                      $scope.body='Failed to upload content.';
                      //$scope.btn='Close';
                      $scope.closeDialog = function() {
                        $mdDialog.hide();
                      }
                    }
                  });
                  cfpLoadingBar.complete();
                });
              
              }else{
                $mdDialog.hide();
                $mdDialog.show({
                    //clickOutsideToClose: true,
                    //scope: $scope,        // use parent scope in template
                    preserveScope: true,  // do not forget this if use parent scope
                    templateUrl: 'templates/desktop/alertDlgTmpl.html',
                    controller: function DialogController($scope, $mdDialog) {
                      $scope.title='Failed!';
                      $scope.body='Failed to create content.';
                      //$scope.btn='Close';
                      $scope.closeDialog = function() {
                        $mdDialog.hide();
                      }
                    }
                  });
                  cfpLoadingBar.complete();
              }
              
            
            }, function(err) { // Error callback
            // There was an error while fetching the data
              updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
              cfpLoadingBar.complete();
            });
      
      }
    }else{
        updateFormData.message="There are still invalid fields";
    }
    
  }
  $scope.deleteVideo=function(){
    $mdDialog.show({
        
        locals: {
          parentScope: $rootScope
        },

        preserveScope: true,  // do not forget this if use parent scope
        
        templateUrl: 'templates/desktop/deleteDlgTpl.html',
        controller: function DialogController($scope, $mdDialog,locals) {
          $scope.parentScope=locals.parentScope;
          $scope.title='Delete Video';
          $scope.body='Are you sure you want to delete?';
          $scope.deleteHandler= function(){
              cfpLoadingBar.start();
              console.log(updateFormData.id);
              $video.delete({id:updateFormData.id}).
                  then(function(pResponse) { 
                  
                    $scope.parentScope.$emit('firstView', 'video');
                    $mdDialog.hide();
                    
                    $mdDialog.show({
                        //clickOutsideToClose: true,
                        //scope: $scope,        // use parent scope in template
                        preserveScope: true,  // do not forget this if use parent scope
                        templateUrl: 'templates/desktop/alertDlgTmpl.html',
                        controller: function DialogController($scope, $mdDialog) {
                          $scope.title='Saved!';
                          $scope.body='The record updated successfully.';
                          //$scope.btn='Close';
                          $scope.closeDialog = function() {
                            $mdDialog.hide();
                          }
                        }
                    });            
                  cfpLoadingBar.complete();
                  
                },function(pError){

                });

                
            
          }
          $scope.closeDialog = function() {
            $mdDialog.hide();
          }
        }
     });
  }

}]);