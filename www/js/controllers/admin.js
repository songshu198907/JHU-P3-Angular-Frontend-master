angular.module('Jhu.controllers')
    .controller('AdminCtrl', ['$rootScope','$scope','$controller', '$state','$user','AuthCtrl','$sessionStorage', '$ionicViewSwitcher','cfpLoadingBar','$mdDialog','$mdSidenav', '$clinicianCode', '$race', '$education', '$topic', '$questionType', '$questionCategory', '$questionCode', '$setting','Pagination', '$vaccinationReminder','$videoAuditLogging','$userAuditLogging','$window','$topic','$userSurvey',
      function ($rootScope,$scope,$controller, $state,$user,AuthCtrl,$sessionStorage, $ionicViewSwitcher,cfpLoadingBar,$mdDialog, $mdSidenav, $clinicianCode, $race, $education, $topic, $questionType, $questionCategory, $questionCode, $setting,Pagination, $vaccinationReminder,$videoAuditLogging,$userAuditLogging,$window,$topic,$userSurvey) {
    
      $controller('BaseCtrl', { $scope: $scope });

      $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if(toState.name!=fromState.name && fromState.name == 'login' && AuthCtrl.isAuthenticated()){
          $scope.showClinicCodes();
          
        }else if(fromState.name=='patientsurveydata' && AuthCtrl.isAuthenticated()){
          $scope.showPatientSurveyData();
        }
      });


      //dynamically calcuate the height of left navigation menu and for lazy loading of data
      angular.element($window).bind('resize', function () {
          angular.element('#admin-menu-container').css('height', $window.innerHeight-170);
          angular.element('#admin-menu-container').css('max-height', $window.innerHeight-170);
          angular.element('.infite-scroll-container').css('height', $window.innerHeight-220);
          
          angular.element('.single-line-ellipsis').css('width', $window.innerWidth -($window.innerWidth>960?400:100));
      });
      angular.element('#admin-menu-container').css('height', $window.innerHeight-170);
      angular.element('#admin-menu-container').css('max-height', $window.innerHeight-170);
      angular.element('.infite-scroll-container').css('height', $window.innerHeight-220);
      

    $scope.toShow = 'cliniccodes';
    $scope.Pagination = new Pagination('clinicianCode');
    $scope.Pagination.dataExists=true;
    $scope.data={};
    $scope.clinics=$clinicianCode.sorted_by_name();
    $scope.busy = true;
    $scope.menuOpened=false;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
      $scope.menuOpened=true;
    };

    $scope.edit = function($event, apObject, item) {
      
      item.submitText = 'Update';
      $scope.updateFormData = Object.create(item);
      console.log('what is the item', item);
      if(apObject == 'clinicianCode') {
        var templateURL = 'ClinicCode';
        item.type = 'Clinician Code';
      } else if(apObject == 'clinicianBlockRandomizer') {
        var templateURL = 'ClinicBlockRandomizer';

        item.type = 'Clinic Block Randomizer';
        $scope.updateFormData.clinics=$clinicianCode.sorted_by_name();
      } else if(apObject == 'races') {
        var templateURL = 'Races';
        item.type = 'Races';
      } else if(apObject == 'educations') {
        var templateURL = 'Educations';
        item.type = 'Educations';
      } else if(apObject == 'topics') {
        var templateURL = 'Topics';
        item.type = 'Topics';
      } else if(apObject == 'questionTypes') {
        var templateURL = 'QuestionTypes';
        item.type = 'Question Types';
      } else if(apObject == 'questionCodes') {
        var templateURL = 'QuestionCodes';
        item.type = 'Question Codes';
      } else if(apObject == 'questionCategories') {
        var templateURL = 'QuestionCategories';
        item.type = 'Question Categories';
      } else if(apObject == 'vaccinationReminders') {
        var templateURL = 'VaccinationReminders';
        item.type = 'Vaccination Reminders';
        $scope.updateFormData.deleteVaccinationReminder = true;
      }else if(apObject=='patients'){
        
        var templateURL = 'Patients';
        item.type = 'Patient';
        $scope.updateFormData.deletePatient = true;
        $scope.updateFormData.showClinic=false;
        $scope.updateFormData.racelist=$race.sorted_by_name();
        $scope.updateFormData.educationlist=$education.sorted_by_name();
        $scope.updateFormData.states = loadAllStates();

      }else if(apObject=='healthcareuser'){
        
        var templateURL = 'HealthcareUsers';
        item.type = 'Healthcare';
        
        //$scope.updateFormData.racelist=$race.sorted_by_name();
        //$scope.updateFormData.educationlist=$education.sorted_by_name();
        $scope.updateFormData.states = loadAllStates();

      $scope.updateFormData.clinics=$clinicianCode.sorted_by_name();

      }else if(apObject=='healthcareContent'){
        
        var templateURL = 'HealthCareContent';
        item.type = 'Health Care Content';
        $scope.updateFormData.topics=$topic.sorted_by_name();
        $scope.updateFormData.selected_category_group=item.category_group;
      }else{
        var templateURL='Video'
        item.type='video'
        $scope.updateFormData.topics=$topic.sorted_by_name();
      }


      console.log('is this edit happening?');
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl : 'templates/desktop/admin/update'+ templateURL + '.html',
        controller: 'dialogCtrl',
        locals: {
          updateFormData: $scope.updateFormData
        }
      });
    };

    $scope.openVideoAuditExportDlg =function(){
      $scope.updateFormData={}
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        //targetEvent: $event,
        templateUrl : 'templates/desktop/admin/videoAuditExport.html',
        controller: 'dialogCtrl',
        locals: {
          updateFormData: $scope.updateFormData
        }
      });
    };

    $scope.openUserAuditExportDlg =function(){
      $scope.updateFormData={}
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        //targetEvent: $event,
        templateUrl : 'templates/desktop/admin/userAuditExport.html',
        controller: 'dialogCtrl',
        locals: {
          updateFormData: $scope.updateFormData
        }
      });
    };



    $scope.openPatientSurveyDetails=function(event,item){
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('patientsurveydata',{surveyId: item.id});
    }

    $scope.new = function($event, apObject) {
      $scope.updateFormData = {};
      $scope.updateFormData.submitText = 'Create';
      if(apObject == 'clinicianCode') {
        var templateURL = 'ClinicCode';
        $scope.updateFormData.type = 'Clinician Code';
      }else if(apObject == 'clinicianBlockRandomizer') {
        var templateURL = 'ClinicBlockRandomizer';
        $scope.updateFormData.type = 'Clinic Block Randomizer';
        $scope.updateFormData.clinics=$clinicianCode.sorted_by_name();
        $scope.updateFormData.patient_type = [
          { id: 1, name: 'Group A' },
          { id: 2, name: 'Group B' }
        ];

      }else if(apObject == 'races') {
        var templateURL = 'Races';
        $scope.updateFormData.type = 'Races';
      } else if(apObject == 'educations') {
        var templateURL = 'Educations';
        $scope.updateFormData.type = 'Educations';
      } else if(apObject == 'topics') {
        var templateURL = 'Topics';
        $scope.updateFormData.type = 'Topics';
      } else if(apObject == 'questionTypes') {
        var templateURL = 'QuestionTypes';
        $scope.updateFormData.type = 'Question Types';
      } else if(apObject == 'questionCodes') {
        var templateURL = 'QuestionCodes';
        $scope.updateFormData.type = 'Question Codes';
      } else if(apObject == 'questionCategories') {
        var templateURL = 'QuestionCategories';
        $scope.updateFormData.type = 'Question Categories';
      } else if(apObject == 'vaccinationReminders') {
        var templateURL = 'VaccinationReminders';
        $scope.updateFormData.type = 'Vaccination Reminders';
        $scope.updateFormData.deleteVaccinationReminder = false;
      }else if(apObject=='patients'){
        
        var templateURL = 'Patients';
        $scope.updateFormData.type = 'Patient';
        $scope.updateFormData.deletePatient = false;

        $scope.updateFormData.showClinic=true;
        $scope.updateFormData.racelist=$race.sorted_by_name();
        $scope.updateFormData.educationlist=$education.sorted_by_name();
        $scope.updateFormData.states = loadAllStates();

      }else if(apObject=='healthcareuser'){
        
        var templateURL = 'HealthcareUsers';
        $scope.updateFormData.type = 'Health Care';
        //$scope.updateFormData.showClinic=true;
        //$scope.updateFormData.racelist=$race.sorted_by_name();
        //$scope.updateFormData.educationlist=$education.sorted_by_name();
        $scope.updateFormData.states = loadAllStates();
        $scope.updateFormData.clinics=$clinicianCode.sorted_by_name();

      }else if(apObject=='healthcarecontent'){
        
        var templateURL = 'HealthCareContent';
        $scope.updateFormData.type = 'Health Care Content';
        $scope.updateFormData.topics = $topic.sorted_by_name();
        
        
      }else if(apObject == 'patientsurveydata'){
        var templateURL = 'PatientSurveyDetail';
        $scope.updateFormData.type= 'Patient Survey Data Create';
        $scope.updateFormData.patientTypes=[{id:0,name:"Control User"},{id:1,name:"Intervention"},{id:2,name:"Contact of Intervention"}];
      }else{
        var templateURL = 'Video';
        $scope.updateFormData.type='video';
        $scope.updateFormData.topics=$topic.sorted_by_name();
      }

      
      console.log('is this edit happening?');
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl : 'templates/desktop/admin/update'+ templateURL + '.html',
        controller: 'dialogCtrl',
        locals: {
          updateFormData: $scope.updateFormData
        }
      });
    };
    $scope.openEducationSorter=function($event){
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl : 'templates/desktop/admin/sortEducation.html',
        controller: 'dialogCtrl',
        locals: {
          updateFormData: {sort:JSON.parse(JSON.stringify($scope.Pagination.items)),original:$scope.Pagination.items}
        }
      });
    };
    
    $scope.openRaceSorter=function($event){
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl : 'templates/desktop/admin/sortRace.html',
        controller: 'dialogCtrl',
        locals: {
          updateFormData: {sort:JSON.parse(JSON.stringify($scope.Pagination.items)),original:$scope.Pagination.items}
        }
      });
    };

    function loadAllStates() {
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
    // $scope.Pagination = function(apObject) {
    //   var Pagination = function() {
    //     this.items = [];
    //     this.busy = false;
    //     this.after = '';
    //   };

    //   Pagination.prototype.nextPage = function() {
    //     if (this.busy) return;
    //     this.busy = true;
    //     console.log('what is the ap object', apObject);
    //     if(apObject == 'clinicianCodes') {
    //       $clinicianCode.all({
    //         limit: 1, // Max amount of results
    //         offset: this.after,  // The index from which to start reading the amount of elements
    //         }, function(collection) { // Success callback
    //             console.log('this clinician code', collection);
    //             var items = collection;
    //             for (var i = 0; i < items.length; i++) {
    //               this.items.push(items[i].data);
    //             }
    //             this.after = this.items[this.items.length - 1];
    //             this.busy = false;
    //         }, function(err) { // Error callback
    //             // There was an error while fetching the data
    //         }
    //       );
    //     }
    //   };
    //   return Pagination;

    // };

    $scope.$on("$mdMenuClose", function() {
      $scope.menuOpened=false;
    });

    $rootScope.$on('refreshView', function(event, type) {
      
      setTimeout(function(){
        $scope.$apply(function(){
          $scope.Pagination.nextPage();
        });
        $scope.busy = false;
      },1000);
    });


    $rootScope.$on('firstView', function(event, type) {
      
      setTimeout(function(){
        $scope.$apply(function(){
          $scope.Pagination.firstPage(type);
        });
        $scope.busy = false;
      },1000);
    });

    $scope.editSettings = function() {
      $scope.toShow = 'settings';
      $scope.Pagination = new Pagination('settings');
      $setting.all({
      }, function(collection) { // Success callback
          // Use the collection data returned
          
          $scope.settingsData = collection[0];
          $scope.settingsData.type = "Settings";
      }, function(err) { // Error callback
          // There was an error while fetching the data
      });
    };

    $scope.settingsSubmit = function(isValid, settingsData) {
      if(isValid){
        cfpLoadingBar.start();//start activity indicator
        cfpLoadingBar.inc(); // increment the activity indicator
        
        var instance = settingsData;
        // To save the instance do
        instance.$save()
        .then(function(success,error) {
          cfpLoadingBar.complete();
          // $scope.settingsData={};
          
        })
        .catch(function(err){
          cfpLoadingBar.complete();
          updateFormData.message=(err.data && err.data.message != undefined? err.data.message:err.statusText);
        });
      }else{
        updateFormData.message="There are still invalid fields";
      }
    };
    $scope.showClinicCodes = function() {
      delete $scope.Pagination;
      cfpLoadingBar.start();
      $scope.toShow = 'cliniccodes';
      $scope.Pagination = new Pagination('clinicianCode');
      
      $rootScope.$emit('firstView', 'clinicianCode');
      setTimeout(function(){
          cfpLoadingBar.complete();
        },1000);
    };
    $scope.showClinicBlockRandomizer = function() {
      delete $scope.Pagination;
      cfpLoadingBar.start();
      $scope.toShow = 'clinicblockrandomizer';
      $scope.Pagination = new Pagination('clinicianBlockRandomizer');

      if($scope.clinics)
      {
        $scope.Pagination.clinics=$scope.clinics;
        $scope.blockRandomzierFilter=$scope.clinics;
      }else{
        $scope.Pagination.clinics=$clinicianCode.sorted_by_name();
        $scope.blockRandomzierFilter=$scope.Pagination.clinics;
      }
      $scope.selectedBlockRandomizer=null;
      if($scope.blockRandomzierFilter && $scope.blockRandomzierFilter.length>0 && $scope.blockRandomzierFilter[0].id!==null){
        $scope.blockRandomzierFilter.splice(0, 0, {"id":null,"name":"All"});
      }
      $rootScope.$emit('firstView', 'clinicianBlockRandomizer');
      
      
      angular.element("infite-scroll-container").scrollTop = 0;
      setTimeout(function(){
          cfpLoadingBar.complete();
        },1000);
    };
    $scope.showRaces = function() {
      delete $scope.Pagination;
      cfpLoadingBar.start();
      $scope.toShow = 'races';
      $scope.Pagination = new Pagination('races');
      $rootScope.$emit('firstView', 'Races');
      setTimeout(function(){
          cfpLoadingBar.complete();
        },1000);
    };
    $scope.showEducations = function() {
      delete $scope.Pagination;
      cfpLoadingBar.start();
      $scope.toShow = 'educations';
      $scope.Pagination = new Pagination('educations');
      $rootScope.$emit('firstView', 'Educations');
      setTimeout(function(){
          cfpLoadingBar.complete();
        },1000);
    };
    $scope.showTopics = function() {
      delete $scope.Pagination;
      cfpLoadingBar.start();
      $scope.toShow = 'topics';
      $scope.Pagination = new Pagination('topics');
      $rootScope.$emit('firstView', 'Topics');
      setTimeout(function(){
          cfpLoadingBar.complete();
        },1000);
    };
    $scope.showQuestionTypes = function() {
      delete $scope.Pagination;
      cfpLoadingBar.start();
      $scope.toShow = 'questiontypes';
      $scope.Pagination = new Pagination('questionTypes');
      $rootScope.$emit('firstView', 'Question Types');
      setTimeout(function(){
          cfpLoadingBar.complete();
        },1000);
    };
    $scope.showQuestionCodes = function() {
      delete $scope.Pagination;
      cfpLoadingBar.start();
      $scope.toShow = 'questioncodes';
      $scope.Pagination = new Pagination('questionCodes');
      $rootScope.$emit('firstView', 'Question Codes');
      setTimeout(function(){
          cfpLoadingBar.complete();
        },1000);
    };
    $scope.showQuestionCategories = function() {
      delete $scope.Pagination;
      cfpLoadingBar.start();
      $scope.toShow = 'questioncategories';
      $scope.Pagination = new Pagination('questionCategories');
      $rootScope.$emit('firstView', 'Question Categories');
      setTimeout(function(){
          cfpLoadingBar.complete();
        },1000);
    };
    $scope.showVaccinationReminders = function() {
      delete $scope.Pagination;
      cfpLoadingBar.start();
      $scope.toShow = 'vaccinationreminders';
      $scope.Pagination = new Pagination('vaccinationReminders');
      $rootScope.$emit('firstView', 'Vaccination Reminders');
      setTimeout(function(){
          cfpLoadingBar.complete();
        },1000);
    };
    $scope.showHealthCareContent = function() {
      cfpLoadingBar.start();
      $scope.toShow = 'healthcarecontent';
      $scope.Pagination = new Pagination('healthcarecontent');
      $scope.Pagination.filterData="maternal vaccines";
      $rootScope.$emit('firstView', 'healthcareProviderContent');
      setTimeout(function(){
          cfpLoadingBar.complete();
          angular.element('.single-line-ellipsis').css('width', $window.innerWidth -($window.innerWidth>960?400:100));
        },3000);
    };
    $scope.maternalClass='pill-button pressed';
    $scope.childhoodClass='pill-button';
    $scope.safetyClass='pill-button';
    $scope.usefulClass='pill-button';

    $scope.healthcareContentFilter=function(filter){
      cfpLoadingBar.start();
      switch(filter){
        case 1:
          $scope.maternalClass='pill-button pressed';
          $scope.childhoodClass='pill-button';
          $scope.safetyClass='pill-button';
          $scope.usefulClass='pill-button';
          $scope.Pagination.filterData="maternal vaccines";
          $rootScope.$emit('firstView', 'healthcareProviderContent');
          break;
        case 2:
          $scope.maternalClass='pill-button';
          $scope.childhoodClass='pill-button pressed';
          $scope.safetyClass='pill-button';
          $scope.usefulClass='pill-button';
          $scope.Pagination.filterData="childhood vaccines";
          $rootScope.$emit('firstView', 'healthcareProviderContent');
          break;
        case 3:
          $scope.maternalClass='pill-button';
          $scope.childhoodClass='pill-button';
          $scope.safetyClass='pill-button pressed';
          $scope.usefulClass='pill-button';
          $scope.Pagination.filterData="safety issues";
          $rootScope.$emit('firstView', 'healthcareProviderContent');
          break;
        case 4:
          $scope.maternalClass='pill-button';
          $scope.childhoodClass='pill-button';
          $scope.safetyClass='pill-button';
          $scope.usefulClass='pill-button pressed';
          $scope.Pagination.filterData="useful links";
          $rootScope.$emit('firstView', 'healthcareProviderContent');
          break;
      }
      setTimeout(function(){
          cfpLoadingBar.complete();
          angular.element('.single-line-ellipsis').css('width', $window.innerWidth -($window.innerWidth>960?400:100));

      },2500);
    }
    $scope.showVideos = function() {
      $scope.toShow = 'Videos';
      cfpLoadingBar.start();
      $scope.Pagination = new Pagination('video');
      $rootScope.$emit('firstView', 'video');
      setTimeout(function(){
          cfpLoadingBar.complete();
      },1000);
    };
    $scope.showHealthCareUser = function() {
      delete $scope.Pagination;
      cfpLoadingBar.start();
      $scope.toShow = 'healthcareuser';
      $scope.Pagination = new Pagination('healthcareuser');
      $rootScope.$emit('firstView', 'healthcareuser');
      angular.element("infite-scroll-container").scrollTop = 0;
      setTimeout(function(){
          cfpLoadingBar.complete();
      },1000);
    };

  
    $scope.showPatients = function() {
      delete $scope.Pagination;
      cfpLoadingBar.start();
      $scope.toShow = 'patients';
      $scope.Pagination = new Pagination('patients');
      $rootScope.$emit('firstView', 'patients');
      angular.element("infite-scroll-container").scrollTop = 0;
      $scope.patientClinic=null;
      if(!$scope.clinics)
      {
        $scope.clinics=$clinicianCode.sorted_by_name();
      }
      //$scope.clinics=$clinicianCode.sorted_by_name();
      if($scope.clinics[0].id!==null){
        $scope.clinics.splice(0, 0, {"id":null,"name":"Filter by Clinic"});
      }
      setTimeout(function(){
          cfpLoadingBar.complete();
        },2000);
    
    };
    $scope.$watch('patientClinic', function (newValue, oldValue) {
      if(newValue !== oldValue){
        
        $scope.Pagination.items=[];
        $scope.Pagination.after=0;
        $scope.busy=true;
        $scope.Pagination.dataExists=true;
        console.log("filter value =",newValue);
        $scope.Pagination.filterData=newValue;
        setTimeout(function(){
          $scope.$apply(function(){
            $scope.Pagination.firstPage('patients');
          });
          $scope.$emit('list:filtered');
          $scope.busy=false;
        },1000);
      }
    });
    //clinic block randomizer filter
    $scope.$watch('selectedBlockRandomizer', function (newValue, oldValue) {
      if(newValue !== oldValue){
        
        $scope.Pagination.items=[];
        $scope.Pagination.after=0;
        $scope.busy=true;
        $scope.Pagination.dataExists=true;
        console.log("filter value =",newValue);
        $scope.Pagination.filterData=newValue;
        setTimeout(function(){
          $scope.$apply(function(){
            $scope.Pagination.firstPage('clinicianBlockRandomizer');
          });
          $scope.$emit('list:filtered');
          $scope.busy=false;
        },1000);
      }
    });
    $scope.$watch('Pagination.dataExists', function (newValue, oldValue) {
      if(newValue!=oldValue){
        setTimeout(function(){
          $scope.$apply(function(){
            if(!newValue){
              $scope.busy=false;
            }
          });
          
        },1000);
      }
    });



    $scope.showPatientSurveyData = function() {
      cfpLoadingBar.start();
      $scope.toShow = 'patientsurveydata';
      $scope.Pagination = new Pagination('patientsurveydata');
      $rootScope.$emit('firstView', 'patientsurveydata');
      setTimeout(function(){
          cfpLoadingBar.complete();
        },1000);
    };
   
     $scope.showVideoAuditExport = function() {
      $scope.toShow = 'videoauditexport';
      $scope.videoFormData={}
    };
    $scope.showUserAuditExport = function() {
      $scope.toShow = 'userauditexport';
      $scope.userFormData={}
    };

    $scope.showSurveyTemplateExport =function(){
      $scope.toShow = 'exportsurveytemplate';
      $scope.surveyFormData={}
    }

    $scope.exportSurveyTemplate=function(pValid){
      
      if(pValid){
        cfpLoadingBar.start();
        var filename='survey_export_log'+(new Date()).toISOString()+'.csv';
        var selection_criteria={};
        debugger;
        if($scope.exportFormData && $scope.exportFormData.ClinicName && $scope.exportFormData.ClinicName.name){
          selection_criteria={query:{"clinic_name":encodeURIComponent($scope.exportFormData.ClinicName.name)}};
        }
        $userSurvey.generate_csv_results(selection_criteria,function(pSuccess){
          /*if (window.navigator.msSaveOrOpenBlob) {
              var blob = new Blob([decodeURIComponent(encodeURI(pSuccess))], {
                type: "text/csv;charset=utf-8;"
              });
              // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
              window.navigator.msSaveBlob(blob, filename);
          } else if(navigator.userAgent.indexOf('Chrome') != -1){
              var link = angular.element('<a/>');
              link.attr({
                href: 'data:attachment/csv;base64,' + encodeURI($window.btoa(unescape(encodeURIComponent(pSuccess)))),
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
            
          }*/
          $mdDialog.hide();
          $mdDialog.show({
              //clickOutsideToClose: true,
              //scope: $scope,        // use parent scope in template
              preserveScope: true,  // do not forget this if use parent scope
              templateUrl: 'templates/desktop/alertDlgTmpl.html',
              controller: function DialogController($scope, $mdDialog) {
                $scope.title='Survey Export In Progress!';
                $scope.body='After survey export is completed it will be sent to your email.';
                //$scope.btn='Close';
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
              }
          });
           cfpLoadingBar.complete();
           $mdDialog.hide();
        },function(pError){
          cfpLoadingBar.complete();
        });
      }else{
        //$scope.videoFormData.message="Please provide a valid date";
      }
    };

    $scope.exportVideoAuditLog=function(pValid){

      if(pValid){
        cfpLoadingBar.start();
        var filename='video_audit_log'+(new Date()).toISOString()+'.csv';
        $videoAuditLogging.export_video_log({query:{"created_at":(new Date($scope.videoFormData.fromDate))}},function(pSuccess){
          if (window.navigator.msSaveOrOpenBlob) {
              var blob = new Blob([decodeURIComponent(encodeURI(pSuccess))], {
                type: "text/csv;charset=utf-8;"
              });
              // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
              window.navigator.msSaveBlob(blob, filename);
          } else if(navigator.userAgent.indexOf('Chrome') != -1){
              var link = angular.element('<a/>');
              link.attr({
                href: 'data:attachment/csv;base64,' + encodeURI($window.btoa(unescape(encodeURIComponent(pSuccess)))),
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
      }else{
        $scope.videoFormData.message="Please provide a valid date";
      }
    };

    $scope.exportUserAuditLog=function(pValid){

      if(pValid){
        cfpLoadingBar.start();
        //baseUrl+"api/api/user_audit_loggings?scope=user_audit_export&query[logged_in_at]="+(new Date(updateFormData.fromDate);
        var filename='user_audit_log'+(new Date()).toISOString()+'.csv';
        
        $userAuditLogging.user_audit_export({query:{"logged_in_at":(new Date($scope.userFormData.fromDate))}},function(pSuccess){
          if (window.navigator.msSaveOrOpenBlob) {
              var blob = new Blob([decodeURIComponent(encodeURI(pSuccess))], {
                type: "text/csv;charset=utf-8;"
              });
              // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
              window.navigator.msSaveBlob(blob, filename);
          } else if(navigator.userAgent.indexOf('Chrome') != -1){
              var link = angular.element('<a/>');
              link.attr({
                href: 'data:attachment/csv;base64,' + encodeURI($window.btoa(unescape(encodeURIComponent(pSuccess)))),
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
      }else{
        $scope.userFormData.message="Please provide a valid date";
      }
    };
    $scope.updateProfile=function(){
      $scope.updateProfileData=$sessionStorage.user;
      setTimeout(function(){
        var parentEl = angular.element(document).find("#main-view");
        $mdDialog.show({
          parent: parentEl,
          scope:$scope,
          preserveScope: true,  // do not forget this if use parent scope
          //targetEvent: $event,
          templateUrl : 'templates/desktop/updateAdminProfile.html',
          controller: 'AdminCtrl',
          disableParentScroll: true
          
        });
      },0);
    }
    $scope.profileUpdate=function(pValid){

      if(pValid && $scope.updateProfileData.password===$scope.updateProfileData.passwordConfirmation){
        
        $scope.showActivityIndicator();
        //cfpLoadingBar.start();//start activity indicator
        $user.myprofile({ },function(response) { // Success callback
          response[0].first_name=$scope.updateProfileData.firstName;
          response[0].last_name=$scope.updateProfileData.lastName;
          response[0].password=$scope.updateProfileData.password;
          response[0].password_confirmation=$scope.updateProfileData.passwordConfirmation;
          response[0].updated_user_profile=true;

          response[0].$save().then(function(pSuccess) {
              //Saved user profile data
              //cfpLoadingBar.complete();
              $scope.hideActivityIndicator();
              $scope.updateUserObject(pSuccess[0],$sessionStorage.user);
              $scope.displayName = $sessionStorage.user.firstName.charAt(0)+"."+$sessionStorage.user.lastName+" ("+$sessionStorage.user.id+")";
              $mdDialog.hide();
          },function(err){
            $scope.hideActivityIndicator();
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
    $scope.profileCancel=function(){
      
        $scope.hideActivityIndicator();
         
        $mdDialog.hide();
      
    }
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
  }]);
