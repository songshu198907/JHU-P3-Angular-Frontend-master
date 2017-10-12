angular.module('Jhu.controllers')
    .controller('VideoCtrl',['$rootScope', '$scope','$controller','$state','$user','cfpLoadingBar','$ionicViewSwitcher','$localStorage', '$sessionStorage','$userSurvey','$userSurveyAnswer','$userSurveyVideo','$sce' , '$mdDialog', '$videoAuditLogging',
     function ($rootScope, $scope,$controller,$state,$user,cfpLoadingBar,$ionicViewSwitcher,$localStorage, $sessionStorage,$userSurvey,$userSurveyAnswer,$userSurveyVideo, $sce , $mdDialog, $videoAuditLogging) {
      
      $controller('BaseCtrl', { $scope: $scope });
      
      var controller = this;
      $scope.video={};
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

    $scope.getPatientSurvey=function(){
      $userSurvey.get_patients_survey({}, function(collection) { // Success callback
      // Use the collection data returned
        if(typeof $scope.$parent !=="undefined" && $scope.$parent!=null){
          $scope.$parent.profileNotUpdated=true;
        }
        if(!collection || collection.length ==0 ){
          $userSurvey.get_video_survey({
            }, function(collection) { // Success callback
              $scope.hideActivityIndicator();
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
            },function(err){
              $scope.hideActivityIndicator();
            });
        }else{
              
          var lVideos=collection[0].matched_videos;
          var arrayLength = lVideos.pediatrics.length + lVideos.maternals.length;
          var lNumOfMaternals=_.filter(lVideos.maternals,function(video){ return video.is_complete==0;});
          var lNumbOfPediatrics=_.filter(lVideos.pediatrics,function(video){ return video.is_complete==0;});
          $scope.incomplete=lNumOfMaternals.length+lNumbOfPediatrics.length;
          console.log($scope.incomplete);
          if($scope.incomplete == 0) {
            $userSurvey.get_video_survey({
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
              },function(err){
                $scope.hideActivityIndicator();
              });
          } else {
              $scope.user_survey = collection[0];
            
              for (var i = 0; i < arrayLength; i++) {
                var videoNumber = i + 1;
              }

                if(lVideos.maternals.length > 0 || lVideos.pediatrics.length > 0 ) {
                  if(lVideos.maternals.length >0) {
                    var lVideo=_.filter(lVideos.maternals,function(video){ return video.is_complete==0;});
                    lVideo=_.sortBy(lVideo,function(video){return video.sort_order;});
                    
                    if(lVideo.length>0){
                      $scope.video=lVideo[0];
                      if($scope.video.video_position != null) {
                        $scope.startTime = $scope.video.video_position
                      }
                    } else if(lVideos.pediatrics.length >0) {
                      var lVideo=_.filter(lVideos.pediatrics,function(video){ return video.is_complete==0;});
                      lVideo=_.sortBy(lVideo,function(video){return video.sort_order;});
                      
                      if(lVideo.length>0){
                        $scope.video=lVideo[0];
                        if($scope.video.video_position != null) {
                          $scope.startTime = $scope.video.video_position
                        }
                      }
                    }
                  } else if(lVideos.pediatrics.length >0) {
                    var lVideo=_.filter(lVideos.pediatrics,function(video){ return video.is_complete==0;});
                    lVideo=_.sortBy(lVideo,function(video){return video.sort_order;});
                    
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
                  title:$scope.video.title,
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
          console.log($scope.video);

          $scope.hideActivityIndicator();

          
        }
      }, function(err) { // Error callback
        console.log('there was an error FETCHING VIDEOS', err);
        $scope.hideActivityIndicator();
      // There was an error while fetching the data
      });
    }

    controller.onPause = function(state) {
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
    };

    controller.onUpdateTime = function (currentTime, totalTime) {
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
                console.log($scope.video.id);
                $scope.video={};
                pUserSurveyVideo[0].is_complete=1;
                pUserSurveyVideo[0].video_position=$scope.currentTime;

                pUserSurveyVideo[0].$save().then(function(){
                  $scope.hideActivityIndicator();
                  if($scope.incomplete>2){
                    //$state.reload();  
                    setTimeout(function(){
                      $scope.$applyAsync(function(){//so that values update because its in timeout
                        $scope.getPatientSurvey();

                      });
                    },200);
                    
                  }else if($scope.incomplete>1){
                    $state.go('home.videos2');
                  }else{
                    $userSurvey.get_video_survey({
                      }, function(collection) { // Success callback
                        
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
          
    };
    $scope.showActivityIndicator();
    $scope.getPatientSurvey();

  }]);
   
  