angular.module('Jhu.controllers')
  .controller('Video2Ctrl',['$rootScope', '$scope','$controller','$state','$user','cfpLoadingBar','$ionicViewSwitcher','$localStorage', '$sessionStorage','$userSurvey','$userSurveyAnswer','$userSurveyVideo', '$sce' , '$mdDialog', '$videoAuditLogging', 
    function ($rootScope, $scope,$controller,$state,$user,cfpLoadingBar,$ionicViewSwitcher,$localStorage, $sessionStorage,$userSurvey,$userSurveyAnswer,$userSurveyVideo, $sce , $mdDialog, $videoAuditLogging) {
    
    $controller('BaseCtrl', { $scope: $scope });
    var me = $scope;
    var controller = this;

    $scope.scrollConfig = {
      autoHideScrollbar: false,
      theme: 'light',
      advanced:{
        updateOnContentResize: true
      },
      setHeight: $(document).height()-40,
      scrollInertia: 0
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
    $userSurvey.get_patients_survey({}, function(collection) { // Success callback
      // Use the collection data returned
      
      if(typeof $scope.$parent !=="undefined" && $scope.$parent!=null){
        $scope.$parent.profileNotUpdated=true;  
      }
      if(!collection || collection.length ==0 ){
        $userSurvey.get_video_survey({}, function(collection) { // Success callback
            if(collection.length > 0) {
              if(!$sessionStorage.survey){
                $sessionStorage.survey=[];
              }
              $sessionStorage.survey[0] = collection[0];
              $state.go('home.videoSurvey');
            } else {
              if($sessionStorage.user.patientType==0){
                $state.go("home.controluser");
              }else{
                $state.go('home.videoTiles');
              }
            }
          });
      }else{
        
        var lVideos=collection[0].matched_videos;
        var arrayLength = lVideos.pediatrics.length + lVideos.maternals.length;
        var lNumOfMaternals=_.filter(lVideos.maternals,function(video){ return video.is_complete==0;});
        var lNumbOfPediatrics=_.filter(lVideos.pediatrics,function(video){ return video.is_complete==0;});
        $scope.incomplete = lNumOfMaternals.length+lNumbOfPediatrics.length;
        if($scope.incomplete == 0) {
          $userSurvey.get_video_survey({//TOTO: change to get_video_survey after deployment
            }, function(collection) { // Success callback
              // Use the collection data returned
              if(collection.length > 0) {
                if(!$sessionStorage.survey){
                  $sessionStorage.survey=[];
                }
                $sessionStorage.survey[0] = collection[0];
                $state.go('home.videoSurvey');
              } else {
                if($sessionStorage.user.patientType==0){
                  $state.go("home.controluser");
                }else{
                  $state.go('home.videoTiles');
                }
              }
            });
        } else {
          $scope.user_survey = collection[0];
          if(lVideos.maternals.length > 0 || lVideos.pediatrics.length > 0 ) {
            if(lVideos.maternals.length >0) {
              var lVideo=_.filter(lVideos.maternals,function(video){ return video.is_complete==0;})
              if(lVideo.length>0){
                $scope.video=lVideo[0];
                if($scope.video.video_position != null) {
                  $scope.startTime = $scope.video.video_position
                }
              }else if(lVideos.pediatrics.length >0) {
                var lVideo=_.filter(lVideos.pediatrics,function(video){ return video.is_complete==0;})
                if(lVideo.length>0){
                  $scope.video=lVideo[0];
                  if($scope.video.video_position != null) {
                    $scope.startTime = $scope.video.video_position
                  }
                }
              }
            }else if(lVideos.pediatrics.length >0) {
              var lVideo=_.filter(lVideos.pediatrics,function(video){ return video.is_complete==0;})
              if(lVideo.length>0){
                $scope.video=lVideo[0];
                if($scope.video.video_position != null) {
                  $scope.startTime = $scope.video.video_position
                }
              }
            }
          }
          var decoded_video_url=decodeURIComponent($scope.video.video_url)
          var file_name=decoded_video_url.split("/").pop();
          var file_name_without_ext=file_name.split(".")[0];
          var base_url=decoded_video_url.substring(0,decoded_video_url.lastIndexOf("/"));
          var hls_video_url=base_url+"/transcoded/"+file_name_without_ext+"/"+file_name_without_ext+".m3u8";
          var mp4_video_url=base_url+"/"+file_name;
          
          if(_isNotMobile){
            controller.videos = [
              {sources:[{src: hls_video_url, type: 'application/x-mpegURL'},
                        {src: mp4_video_url, type: 'video/mp4'}
                        ]}
            ];  
          }else{
            controller.videos = [{sources:[{src: hls_video_url, type: 'application/x-mpegURL'}]}];
          }

          $scope.number=arrayLength;
          $scope.after_first_survey_complete_text="";
          if($sessionStorage && $sessionStorage.setting){
            $scope.after_first_survey_complete_text=$sessionStorage.setting.after_first_survey_complete_text.replace("{{number}}",$scope.number);
            
          }
          
          controller.config = {
            preload: "none",
            sources: controller.videos[0].sources,
            tracks: [
              {
                src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                kind: "subtitles",
                srclang: "en",
                label: "English",
                default: ""
              }
            ],
            startTime: $scope.startTime,
            theme: "lib/videogular-themes-default/videogularTiles.css",
            plugins: {
              poster: base_url+"/transcoded/"+file_name_without_ext+"/"+file_name_without_ext+"-00002.png"
            }
          };
        }
      }
        controller.setVideo = function() {
          if($scope.incomplete > 1) {
            $state.go('home.videos');
          } else { 
              $userSurvey.get_video_survey({}, function(collection) { // Success callback
                  // Use the collection data returned
                  if(collection.length > 0) {
                    if(!$sessionStorage.survey){
                      $sessionStorage.survey=[];
                    }
                    $sessionStorage.survey[0] = collection[0];
                    $state.go('home.videoSurvey');
                  } else {
                    if($sessionStorage.user.patientType==0){
                            $state.go("home.controluser");
                          }else{
                      $state.go('home.videoTiles');
                    }
                  }
                });
            }
        };

        this.onPause = function(state) {
          if(state == 'pause') {
            
            if($scope.video){
              $userSurveyVideo.get_video_by_id({
                  query: { // In query go the parameters for the scope
                    video_id: $scope.video.id
                  },
                }, function(pUserSurveyVideo) { 
                  if(pUserSurveyVideo && pUserSurveyVideo.length>0){
                    pUserSurveyVideo[0].video_position=$scope.currentTime;
                    pUserSurveyVideo[0].$save().then(function(){
                      
                    });  
                  }
                }, function(err) { // Error callback
                  console.log("user survey video not found");
                  
                });
            }
        }

        this.onUpdateTime = function (currentTime, totalTime) {
            setTimeout(function(){
            $scope.currentTime = currentTime;
            if(currentTime == totalTime) {
              $scope.showActivityIndicator();
              if($scope.video && $scope.video.id){
                $userSurveyVideo.get_video_by_id({
                  query: { // In query go the parameters for the scope
                    video_id: $scope.video.id
                  },
                }, function(pUserSurveyVideo) { 
                  if(pUserSurveyVideo && pUserSurveyVideo.length>0 && $scope.video.id){
                    $scope.video={};
                    pUserSurveyVideo[0].is_complete=1;
                    pUserSurveyVideo[0].video_position=$scope.currentTime;
                    
                    pUserSurveyVideo[0].$save().then(function(){

                      $scope.hideActivityIndicator();
                      if($scope.incomplete>1){
                        $state.reload();
                      }else{
                        var post_video_thanking_text="";
                        if($sessionStorage && $sessionStorage.setting){
                          post_video_thanking_text=$sessionStorage.setting.post_video_thanking_text;
                        }
                        $mdDialog.hide();
                        $mdDialog.show({
                          clickOutsideToClose: true,
                          scope: $scope,        // use parent scope in template
                          preserveScope: true,  // do not forget this if use parent scope
                          template: '<md-dialog class="md-transition-in dialog-border">' +
                                    '  <md-dialog-content>' +
                                    ' <div layout="row" layout-align="center center" class="dialog-header">'+
                                    '     <div class="text24 white">Great!</div>'+
                                    ' </div>'+
                                    ' <div class="md-dialog-content-body" style="padding:20px;" >'+
                                    '   <p></p>'+post_video_thanking_text+
                                    ' </div>'+
                                    '  </md-dialog-content>'+
                                    '  <md-dialog-actions layout-align="center center">'+
                                    '   <md-button aria-label="Ok" class="md-raised md-primary text16" ng-click="controller.setVideo();"><span class="ng-binding ng-scope">Ok</span></md-button>'+
                                    '  </md-dialog-actions>'+
                                    '</md-dialog>',
                          controller: function DialogController($scope, $mdDialog, $state) {
                            $scope.closeDialog = function() {
                              $mdDialog.hide();
                            }
                          }
                        });
                          
                      }

                    });
                  }

                }, function(err) { // Error callback
                  console.log("user survey video not found");
                });
              }else{
                $scope.hideActivityIndicator();
              }
              
            }
          },100);
        }
      }
      
      }.bind(this), function(err) { // Error callback
        console.log('there was an error FETCHING VIDEOS WTF', err);
        // There was an error while fetching the data
      }.bind(this));
    }]);