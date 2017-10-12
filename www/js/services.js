angular.module('Jhu.services', [])
.service("AuthCtrl", ["$vaccineSurveySdkAuthentication", function($vaccineSurveySdkAuthentication) {
  // To login
 var AuthObj = $vaccineSurveySdkAuthentication.password;
  var login = function(user) {
        

    return AuthObj.login({
      email: user.email,
      password: user.password
    });

  }
  var logout = function() {
    return AuthObj.logout();
  }
  var isAuthenticated = function() {
    return AuthObj.isAuthenticated();
  }

  var userRole = function() {
    return AuthObj.getUserRole();
  }


  var getAuthData = function() {
    return AuthObj.getAuthSessionData();
  }

  return {
    login: login,
    logout: logout,
    isAuthenticated: isAuthenticated,
    userRole: userRole,
    getAuthData: getAuthData
  };
}])
.service('Videos', function($userSurvey) {
  var getVideos = function() {
    return $userSurvey.get_patients_survey()
  };

  return {
    getVideos: getVideos
  };
})
.service("Pagination", function($clinicianCode, $race, $education, $topic, $questionType, $questionCategory, $questionCode, $vaccinationReminder,$user,AuthCtrl,$clinicianBlockRandomizer,$healthcareProviderContent,$survey,$video) {
  var Pagination = function(apObject) {
    this.items = [];
    this.busy = false;
    this.after = 0;
    this.ap = apObject;
    this.dataExists=false;
    this.filterData=null;
  };
  Pagination.prototype.nextPage = function() {
    
    if(AuthCtrl.isAuthenticated()){
      if (this.busy) return;
      this.busy = true;
      // console.log('what the fuck', this);
      if(this.ap == 'clinicianCode') {
        var lPageSize=50;

        $clinicianCode.sorted_by_name({
          limit: lPageSize, // Max amount of results
          offset: this.after,  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
              // console.log('this clinician code', this);
              var items = collection;
              for (var i = 0; i < items.length; i++) {
               
                this.items.push(items[i]);
              }

              this.after = this.items.length-1;
              if(collection.length==0 || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;

          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      } else if(this.ap == 'clinicianBlockRandomizer') {
        var lPageSize=50;
        $clinicianBlockRandomizer.filter_by_clinic_id({
            query:{
              "clinician_code_id":this.filterData?this.filterData:null
            },
            limit: lPageSize, // Max amount of results
            offset: this.after,  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
        
              var items = collection;
              for (var i = 0; i < items.length; i++) {
                var clinic=_.where(this.clinics, {"id": collection[i].clinician_code_id});
                if(clinic && clinic.length>0){
                  collection[i].clinicName=clinic[0].name;
                }
                this.items.push(items[i]);
              }

              this.after = this.items.length-1;
              if(collection.length==0 || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;

          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      } else if(this.ap == 'races') {
        var lPageSize=50;
        $race.sorted_by_id({
          limit: lPageSize, // Max amount of results
          offset: this.after,  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
              // console.log('this race', this);
              var items = collection;
              for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
              }
              this.after = this.items.length-1;
              if(collection.length==0 || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      } else if(this.ap == 'educations') {
        var lPageSize=50;
        $education.sorted_by_id({
          limit: lPageSize, // Max amount of results
          offset: this.after,  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
              // console.log('this education', this);
              var items = collection;
              for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
              }
              this.after = this.items.length-1;
              if(collection.length==0 || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      } else if(this.ap == 'topics') {
        var lPageSize=50;
        $topic.sorted_by_name({
          limit: lPageSize, // Max amount of results
          offset: this.after,  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
              // console.log('this topic', this);
              var items = collection;
              for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
              }
              this.after = this.items.length-1;
              if(collection.length==0  || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      } else if(this.ap == 'questionTypes') {
        var lPageSize=50;
        $questionType.sorted_by_name({
          limit: lPageSize, // Max amount of results
          offset: this.after,  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
              var items = collection
              // console.log('this question type', this);
              for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
              }
              this.after = this.items.length-1;
              if(collection.length==0  || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      } else if(this.ap == 'questionCategories') {
        var lPageSize=50;
        $questionCategory.all({
          limit: lPageSize, // Max amount of results
          offset: this.after,  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
              var items = collection
              // console.log('this question category', this);
              for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
              }
              this.after = this.items.length-1;
              if(collection.length==0  || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      } else if(this.ap == 'questionCodes') {
        var lPageSize=50;
        $questionCode.sorted_by_name({
          limit: lPageSize, // Max amount of results
          offset: this.after,  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
              var items = collection
              // console.log('this question code', this);
              for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
              }
              this.after = this.items.length-1;
              if(collection.length==0  || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      } else if(this.ap == 'vaccinationReminders') {
        var lPageSize=50;

        $vaccinationReminder.sorted_by_trigger_days({
          limit: lPageSize, // Max amount of results
          offset: this.after,  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
              var items = collection
              // console.log('this vaccination reminder', this);
              for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
              }
              this.after = this.items.length-1;
              if(collection.length==0  || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      }else if(this.ap == 'patients') {
        
        var lPageSize=30;
        $user.get_patients_by_clinics({
            query:{
              "clinician_code_id":this.filterData?this.filterData:null
            },
            limit: lPageSize, // Max amount of results
            offset: this.after,  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
            
              var items = collection
              // console.log('patients', this);
              for (var i = 0; i < items.length; i++) {
                var lExpChildBirth=items[i].expected_child_birth;
                var lActChildBirth=items[i].actual_child_birth;
                if (!_.isNull(lExpChildBirth) && !_.isEmpty(lExpChildBirth) && !_.isUndefined(lExpChildBirth) && !isNaN(Date.parse(lExpChildBirth)))
                {
                    items[i].expected_child_birth = new Date(Date.parse(lExpChildBirth));
                }
                if (!_.isNull(lActChildBirth) && !_.isEmpty(lActChildBirth) && !_.isUndefined(lActChildBirth) && !isNaN(Date.parse(lActChildBirth)))
                {
                    items[i].actual_child_birth = new Date(Date.parse(lActChildBirth));
                }
                this.items.push(items[i]);
              }

              this.after = this.items.length-1;
              if(collection.length==0  || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      }else if(this.ap == 'healthcareuser') {
        var lPageSize=30;
        $user.get_healthcare_by_clinic({
            // query:{
            //   "clinician_code_id":this.filterData?this.filterData:null
            // },
            limit: lPageSize, // Max amount of results
            offset: this.after  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
            
              var items = collection
              
              for (var i = 0; i < items.length; i++) {
                
                this.items.push(items[i]);
              }
             this.after = this.items.length-1;
              if(collection.length==0  || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      }else if(this.ap == 'healthcarecontent') {
        var lPageSize=30;
        $healthcareProviderContent.filter_by_category_group({
          query:{
             "category_group":this.filterData?this.filterData:null
          },
            limit: lPageSize, // Max amount of results
            offset: this.after  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
            
              var items = collection
              
              for (var i = 0; i < items.length; i++) {
                items[i].external_link=decodeURIComponent(items[i].external_link);
                this.items.push(items[i]);
              }
             this.after = this.items.length-1;
              if(collection.length==0  || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
              
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      }else if(this.ap == 'patientsurveydata') {
        var lPageSize=30;
        $survey.get_sorted_surveys({
            limit: lPageSize, // Max amount of results
            offset: this.after  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
            
              var items = collection
              
              for (var i = 0; i < items.length; i++) {
                
                this.items.push(items[i]);
              }
             this.after = this.items.length-1;
              if(collection.length==0  || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
              
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      }else if(this.ap == 'video') {
        var lPageSize=30;
        $video.sorted_by_name({
            limit: lPageSize, // Max amount of results
            offset: this.after  // The index from which to start reading the amount of elements
          }, function(collection) { // Success callback
            
              var items = collection
              
              for (var i = 0; i < items.length; i++) {
                items[i].video_url=decodeURIComponent(items[i].video_url);
                this.items.push(items[i]);
              }
             this.after = this.items.length-1;
              if(collection.length==0  || collection.length<lPageSize){//where 50 is the limit of data fetched
                this.dataExists=false;
              }else{
                this.dataExists=true;
              }
              this.busy = false;
              
          }.bind(this), function(err) { // Error callback
              // There was an error while fetching the data
              this.busy = false;
          }.bind(this));
      }
    }else{
      this.dataExists=false;
    }
  };

  Pagination.prototype.firstPage = function(type) {
    if (this.busy) return;
    this.busy = true;
    // console.log('what the fuck', this);
    if(type == 'clinicianCode') {
      $clinicianCode.sorted_by_name({
        limit: 50, // Max amount of results
        offset: 0,  // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            this.items = [];
            // console.log('this clinician code', this);
            for (var i = 0; i < collection.length; i++) {
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<50){//where 50 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
        }.bind(this));
    } else if(type == 'clinicianBlockRandomizer') {
      $clinicianBlockRandomizer.filter_by_clinic_id({
          query:{
            "clinician_code_id":this.filterData?this.filterData:null
          },
          limit: 50, // Max amount of results
          offset: 0,  // The index from which to start reading the amount of elements
        }, function(collection) {
      
            this.items = [];
            // console.log('this clinician code', this);
            for (var i = 0; i < collection.length; i++) {
              var clinic=_.where(this.clinics, {"id": collection[i].clinician_code_id});
              if(clinic && clinic.length>0){
                collection[i].clinicName=clinic[0].name;
              }
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<50){//where 50 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
        }.bind(this));
    }else if(type == 'Races') {
      $race.sorted_by_id({
        limit: 50, // Max amount of results
        offset: 0,  // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            this.items = [];
            // console.log('this race', this);
            for (var i = 0; i < collection.length; i++) {
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<50){//where 50 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
        }.bind(this));
    } else if(type == 'Educations') {
      $education.sorted_by_id({
        limit: 50, // Max amount of results
        offset: 0,  // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            this.items = [];
            // console.log('this education', this);
            for (var i = 0; i < collection.length; i++) {
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<50){//where 50 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
        }.bind(this));
    } else if(type == 'Topics') {
      $topic.sorted_by_name({
        limit: 50, // Max amount of results
        offset: 0,  // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            this.items = [];
            // console.log('this topic', this);
            for (var i = 0; i < collection.length; i++) {
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<50){//where 50 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
        }.bind(this));
    } else if(type == 'Question Types') {
      $questionType.sorted_by_name({
        limit: 50, // Max amount of results
        offset: 0,  // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            this.items = [];
            // console.log('this question type', this);
            for (var i = 0; i < collection.length; i++) {
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<50){//where 50 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
        }.bind(this));
    } else if(type == 'Question Categories') {
      $questionCategory.all({
        limit: 50, // Max amount of results
        offset: 0,  // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            this.items = [];
            // console.log('this question category', this);
            for (var i = 0; i < collection.length; i++) {
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<50){//where 50 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
        }.bind(this));
    } else if(type == 'Question Codes') {
      $questionCode.sorted_by_name({
        limit: 50, // Max amount of results
        offset: 0,  // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            this.items = [];
            // console.log('this question code', this);
            for (var i = 0; i < collection.length; i++) {
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
             if(collection.length==0  || collection.length<50){//where 50 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
        }.bind(this));
    }  else if(type == 'Vaccination Reminders') {
      $vaccinationReminder.sorted_by_trigger_days({
        limit: 50, // Max amount of results
        offset: 0,  // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            this.items = [];
            // console.log('this vaccination reminder', this);
            for (var i = 0; i < collection.length; i++) {
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<50){//where 50 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
        }.bind(this));
    }else if(type == 'patients') {
        $user.get_patients_by_clinics({
          query:{
            "clinician_code_id":this.filterData?this.filterData:null
          },
          limit: 50, // Max amount of results
          offset: 0,  // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            
            this.items = [];
            
            for (var i = 0; i < collection.length; i++) {
              var lExpChildBirth=collection[i].expected_child_birth;
              var lActChildBirth=collection[i].actual_child_birth;
              if (!_.isNull(lExpChildBirth) && !_.isEmpty(lExpChildBirth) && !_.isUndefined(lExpChildBirth) && !isNaN(Date.parse(lExpChildBirth)))
              {
                  collection[i].expected_child_birth = new Date(Date.parse(lExpChildBirth));
              }
              if (!_.isNull(lActChildBirth) && !_.isEmpty(lActChildBirth) && !_.isUndefined(lActChildBirth) && !isNaN(Date.parse(lActChildBirth)))
              {
                  collection[i].actual_child_birth = new Date(Date.parse(lActChildBirth));
              }
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<50){//where 50 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
            this.busy = false;
        }.bind(this));
    }else if(type == 'healthcareuser') {
        $user.get_healthcare_by_clinic({
          // query:{
          //   "clinician_code_id":this.filterData?this.filterData:null
          // },
          limit: 30, // Max amount of results
          offset: 0 // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            
            this.items = [];
            
            for (var i = 0; i < collection.length; i++) {
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<30){//where 30 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
            this.busy = false;
        }.bind(this));
    }else if(type == 'healthcareProviderContent') {
        $healthcareProviderContent.filter_by_category_group({
          query:{
             "category_group":this.filterData?this.filterData:null
          },
          limit: 30, // Max amount of results
          offset: 0 // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            
            this.items = [];
            
            for (var i = 0; i < collection.length; i++) {
              collection[i].external_link=decodeURIComponent(collection[i].external_link);
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<30){//where 30 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
            
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
            this.busy = false;
        }.bind(this));
    }else if(type == 'patientsurveydata') {
        $survey.get_sorted_surveys({
          
          limit: 30, // Max amount of results
          offset: 0 // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            
            this.items = [];
            
            for (var i = 0; i < collection.length; i++) {
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<30){//where 30 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
            
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
            this.busy = false;
        }.bind(this));
    }else if(type == 'video') {

        $video.sorted_by_name({
          
          limit: 30, // Max amount of results
          offset: 0 // The index from which to start reading the amount of elements
        }, function(collection) { // Success callback
            
            this.items = [];
            
            for (var i = 0; i < collection.length; i++) {
              collection[i].video_url=decodeURIComponent(collection[i].video_url);
              this.items.push(collection[i]);
            }
            this.after = this.items.length-1;
            if(collection.length==0  || collection.length<30){//where 30 is the limit of data fetched
              this.dataExists=false;
            }else{
              this.dataExists=true;
            }
            this.busy = false;
            
        }.bind(this), function(err) { // Error callback
            // There was an error while fetching the data
            this.busy = false;
        }.bind(this));
    }


  };
  return Pagination;

});
