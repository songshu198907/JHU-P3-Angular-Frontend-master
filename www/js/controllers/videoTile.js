angular.module('Jhu.controllers')
    .controller('VideoTileCtrl', ['$rootScope', '$scope','$controller','$state','$user', '$video' ,'cfpLoadingBar','$ionicViewSwitcher','$localStorage','$userSurvey','$userSurveyAnswer', '$sce' , '$mdDialog', '$videoAuditLogging','AuthCtrl','$sessionStorage','$window',
    	function ($rootScope, $scope,$controller,$state,$user, $video ,cfpLoadingBar,$ionicViewSwitcher,$localStorage,$userSurvey,$userSurveyAnswer, $sce , $mdDialog, $videoAuditLogging,AuthCtrl,$sessionStorage,$window) {
    	var me = $scope;
        $scope.scrollConfig = {
			autoHideScrollbar: false,
			theme: 'light',
			advanced:{
				updateOnContentResize: true
			},
			setHeight: $(document).height()-40,
			scrollInertia: 0
		}


	  angular.element($window).bind('resize', function () {
          if($window.innerWidth>760){
	      	angular.element('.video-container').removeClass('flex-90').addClass('flex-40');	
	      }else{
	      	angular.element('.video-container').removeClass('flex-40').addClass('flex-90');	
	      }
      });
      $scope.flexMedia=function(){
      	setTimeout(function(){
	      	if($window.innerWidth>760){
	      		angular.element('.video-container').removeClass('flex-90').addClass('flex-40');	
		     }else{
		      	angular.element('.video-container').removeClass('flex-40').addClass('flex-90');	
		     }
	     },1000);
      }
      
      



		$scope.noSourceVideos=false;
		$controller('BaseCtrl', { $scope: $scope });
		$scope.readMoreModal = function (descriptionData) {
			if(angular.element(document).find('md-dialog').length == 0){
                $mdDialog.show({
                  clickOutsideToClose: true,
                  scope: $scope,        // use parent scope in template
                  preserveScope: true,  // do not forget this if use parent scope
                  
                  template: '<md-dialog class="md-transition-in dialog-border">' +
                            '  <md-dialog-content>' +
                            ' <div layout="row" layout-align="center center" class="dialog-header">'+
                  '     <div class="text24 white">Details</div>'+
                  ' </div>'+

                            ' <div class="md-dialog-content-body" style="padding:20px;" >'+

                            '   <p></p>'+
          						descriptionData +
                            ' </div>'+
                            '  </md-dialog-content>'+
                            '  <md-dialog-actions layout-align="center center">'+
                            '   <md-button aria-label="Ok" class="md-raised md-primary text16" ng-click="closeDialog()"><span class="ng-binding ng-scope">Ok</span></md-button>'+
                            '  </md-dialog-actions>'+
                            '</md-dialog>',
                  controller: function DialogController($scope, $mdDialog, $state) {
                      $scope.closeDialog = function() {
                        $mdDialog.hide();
                 //        $userSurvey.get_video_survey({//TOTO: change to get_video_survey after deployment
                    // }, function(collection) { // Success callback
                       
                    //  $scope.user_survey = collection[0];
                    //  if(collection.length > 0) {
                    //    $sessionStorage.survey[0] = collection[0];

                    //    $state.go('home.videoSurvey');
                    //  } else {
                    //    $state.go('home.videoTiles');
                    //  }
                    // });

                      }
                  }
                  });
            }
		}
		var controller = this;
		$scope.filterCartoList = function (searchTerm) {
			$video.search_video_by_keyword({
				query: {
					search: searchTerm
				}
			}, function(collection) {
				var videos = collection;
			    var arrayLength = videos.length;
			    controller.sources = [];
				var aVideo = {};
		        for (var i = 0; i < arrayLength; i++) {
		    		aVideo = {src: $sce.trustAsResourceUrl(videos[i].video_url), type: 'video/mp4'}
					controller.sources.push(aVideo);

		   		}
		   		// console.log('controller.sources are area re aer are a re', controller.sources);
		   		controller.videoConfigs = [];
		        for (var i = 0, l = controller.sources.length; i < l; i++) {
		            var config = angular.copy(controller.commonConfig);
		            config.sources = [];
		            config.sources.push(controller.sources[i]);

		            controller.videoConfigs.push(config);
		        }
		        $scope.flexMedia();
			});
		}
		
		if($sessionStorage && $sessionStorage.user && $sessionStorage.user.role=="health_care_provider"){
			$video.all({
			    }, function(collection) { // Success callback
			      // Use the collection data returned
			    	// console.log('collection is ', collection);
			    	// console.log('collection length is ', collection.length);
			    	var videos = collection;
			    	var arrayLength = videos.length;

			   		// console.log('what is the video_url', videos[0].video_url);

					controller.commonConfig = {
			            sources: null,
			            theme: "lib/videogular-themes-default/videogularTiles.css",
			            plugins: {
			                controls: {
			                    autoHide: true,
			                    autoHideTime: 3000
			                }
			            }
			        };
			        controller.sources = [];
			        var aVideo = {};
			        
			        for (var i = 0; i < arrayLength; i++) {
			        	var decoded_video_url=decodeURIComponent(videos[i].video_url)
			            var file_name=decoded_video_url.split("/").pop();
			            var file_name_without_ext=file_name.split(".")[0];
			            var base_url=decoded_video_url.substring(0,decoded_video_url.lastIndexOf("/"));
			            var hls_video_url=base_url+"/transcoded/"+file_name_without_ext+"/"+file_name_without_ext+".m3u8";
			            var mp4_video_url=base_url+"/"+file_name;
			            
			            if(_isNotMobile){
			            	aVideo = [{src: $sce.trustAsResourceUrl(hls_video_url), type: 'application/x-mpegURL'},
				    			{src: $sce.trustAsResourceUrl(mp4_video_url), type: 'video/mp4'}
	    					];	
			            }else{
			            	aVideo = [{src: $sce.trustAsResourceUrl(hls_video_url), type: 'application/x-mpegURL'}
	    					];
			            }
			    		//aVideo = {src: $sce.trustAsResourceUrl(decodeURIComponent(videos[i].video_url)), type: 'video/mp4'}
						controller.sources.push(aVideo);
			   		}
		   			// console.log('what the fuck is controller.videos', controller.sources);
			        controller.videoConfigs = [];

			        for (var i = 0, l = controller.sources.length; i < l; i++) {
			            var config = angular.copy(controller.commonConfig);
			            config.sources = [];
			            config.videoDetails = videos[i];
			            config.sources.push(controller.sources[i]);
			            // console.log('THIS IS THE VIDEO CONFIG JSON', config);
			            /*create a thumbnail video url*/
			            var decoded_video_url=decodeURIComponent(videos[i].video_url);
			            var file_name=decoded_video_url.split("/").pop();
			            var file_name_without_ext=file_name.split(".")[0];
			            var base_url=decoded_video_url.substring(0,decoded_video_url.lastIndexOf("/"));
			            
			            config.plugins={poster: base_url+"/transcoded/"+file_name_without_ext+"/"+file_name_without_ext+"-00002.png"};
			            /*thumbnail added to poster plugin*/

			            controller.videoConfigs.push(config);
			        }
			        $scope.flexMedia();
			
				});
			}else{
				$userSurvey.get_patients_survey({
			    }, function(collection) { // Success callback
			      // Use the collection data returned
			    	// console.log('collection is ', collection);
			    	// console.log('collection length is ', collection.length);
			    	// var videos = collection[0].matched_videos;
			    	// var arrayLength = videos.length;
			    	// if(videos[0].video_watched === true) {											TOOOOOOO DOOOOOOOOOOOO
			    	$scope.user_survey = collection[0];

					if($sessionStorage && $sessionStorage.user){
						$scope.$parent.profileNotUpdated=$sessionStorage.user.updatedUserProfile;	
					}
			    });
				$video.video_gallery({
			    	}, function(collection) { // Success callback
			      // Use the collection data returned
			      	if(collection && collection.length==0)
			      	{
			      		$scope.noSourceVideos=true;
			      	}else{
			      		// console.log('collection is ', collection);
				    	// console.log('collection length is ', collection.length);
				    	var videos = collection;
				    	var arrayLength = videos.length;

				   		// console.log('what is the video_url', videos[0].video_url);

						controller.commonConfig = {
				            sources: null,
				            theme: "lib/videogular-themes-default/videogularTiles.css",
				            plugins: {
				                controls: {
				                    autoHide: true,
				                    autoHideTime: 3000
				                }
				            }
				        };
				        controller.sources = [];
				        var aVideo = {};
				        
				        for (var i = 0; i < arrayLength; i++) {
				        	
				        	var decoded_video_url=decodeURIComponent(videos[i].video_url)
				            var file_name=decoded_video_url.split("/").pop();
				            var file_name_without_ext=file_name.split(".")[0];
				            var base_url=decoded_video_url.substring(0,decoded_video_url.lastIndexOf("/"));
				            var hls_video_url=base_url+"/transcoded/"+file_name_without_ext+"/"+file_name_without_ext+".m3u8";
				            var mp4_video_url=base_url+"/"+file_name;
				            
				            if(_isNotMobile){
				            	aVideo = [{src: $sce.trustAsResourceUrl(hls_video_url), type: 'application/x-mpegURL'},
					    			{src: $sce.trustAsResourceUrl(mp4_video_url), type: 'video/mp4'}
		    					];	
				            }else{
				            	aVideo = [{src: $sce.trustAsResourceUrl(hls_video_url), type: 'application/x-mpegURL'}
		    					];
				            }
					    	
							controller.sources.push(aVideo);
				   		}
			   			// console.log('what the fuck is controller.videos', controller.sources);
				        controller.videoConfigs = [];

				        for (var i = 0, l = controller.sources.length; i < l; i++) {
				            var config = angular.copy(controller.commonConfig);
				            config.sources = [];
				            config.videoDetails = videos[i];
				            /*create a thumbnail video url*/
				            var decoded_video_url=decodeURIComponent(videos[i].video_url);
				            var file_name=decoded_video_url.split("/").pop();
				            var file_name_without_ext=file_name.split(".")[0];
				            var base_url=decoded_video_url.substring(0,decoded_video_url.lastIndexOf("/"));
				            
				            config.plugins={poster: base_url+"/transcoded/"+file_name_without_ext+"/"+file_name_without_ext+"-00002.png"};
				            /*thumbnail added to poster plugin*/

				            config.sources.push(controller.sources[i]);
				            // console.log('THIS IS THE VIDEO CONFIG JSON', config);

				            controller.videoConfigs.push(config);
				        }

				        $scope.flexMedia();
			      	}
			    	
			
				});
			}
				controller.onPause = function(state, video_id) {
			// console.log('is the user survey coming through here', $scope.user_survey);
			if(state == 'pause') {
				var videoAudit;
				videoAudit = $videoAuditLogging.by_video_and_user_id({
				    query: { // In query go the parameters for the scope
				        video_id: video_id,
				        user_id: $sessionStorage.user.id
				    },
				}, function(collection) { // Success callback
				    // Use the collection data returned
				    // console.log('what is the video audit log?', collection);
				    if(collection.length > 0 ){ 
				    	// console.log('what is the current time', $scope.currentTime);
				    	console.log('what is the created at ', collection[0].created_at);
				    	console.log('what is the js date', new Date().toISOString().slice(0, 10).replace('T', ' '));
				    	if(collection[0].created_at.slice(0, 10).replace('T', ' ') == new Date().toISOString().slice(0, 10).replace('T', ' ')){
					    	collection[0].watched_entire_video = false;
					    	collection[0].duration = $scope.currentTime;
					    	collection[0].$save().then(function() {
					    		//the instance was saved
					    	});
				    	} else {
				    		var instance = $videoAuditLogging.create({ watched_entire_video: false });
						    instance.duration = $scope.currentTime;
						    instance.user_id = $sessionStorage.user.id;
						    instance.video_id = video_id;
							// To save the instance do
							instance.$save().then(function() {
							    // The instance got saved
							});
				    	}
				    } else {
				    	// console.log('what is the current time', $scope.currentTime);
					    var instance = $videoAuditLogging.create({ watched_entire_video: false });
					    instance.duration = $scope.currentTime;
					    instance.user_id = $sessionStorage.user.id;
					    instance.video_id = video_id;
						// To save the instance do
						instance.$save().then(function() {
						    // The instance got saved
						});	
				    }
				}, function(err) { // Error callback
				    // There was an error while fetching the data
				});
					// var instance = $videoAuditLogging.create({ watched_entire_video: false });
					// // To save the instance do
					// instance.$save().then(function() {
					//     // The instance got saved
					// });
				}
			}
		
		controller.onUpdateTime = function (currentTime, totalTime, video_id) {
	        setTimeout(function(){
	        	$scope.currentTime = currentTime;
        		controller.currentTime = currentTime;
		        controller.totalTime = totalTime;
		        if(currentTime == totalTime) {
		        	videoAudit = $videoAuditLogging.by_video_and_user_id({
					    query: { // In query go the parameters for the scope
					        video_id: video_id,
					        user_id: $sessionStorage.user.id
					    },
					}, function(collection) { // Success callback
				    // Use the collection data returned
					    // console.log('what is the video audit log?', collection);
					    if(collection.length > 0 ){ 
					    	// console.log('what is the current time', $scope.currentTime);
				    		collection[0].watched_entire_video = true;
					    	collection[0].duration = totalTime;
					    	collection[0].$save().then(function() {
					    		//the instance was saved
					    	});
				    	}
				    }, function(err) { // Error callback
				    // There was an error while fetching the data
					});
		        }
      		},1000);
	        };

	 //    };
		// 	    }.bind(this), function(err) { // Error callback
		// 	      console.log('there was an error FETCHING VIDEOS WTF', err);
		// 	      // There was an error while fetching the data
		// 	    }.bind(this));


	
    }]);
	 
	// .controller('VideoCtrl',
	// 	["$sce", "$scope", "GetVideos", function ($sce, $scope, GetVideos, $userSurvey) {
	// 		$scope.getVideo = function () {
	// 			$userSurvey.get_patients_survey({
 //        }, function(collection) { // Success callback
 //          // Use the collection data returned
 //            console.log('collection is ', collection);
 //            console.log('collection length is ', collection.length);
 //            var videos = collection[0].matched_videos;
 //            var arrayLength = videos.length;
 //            for (var i = 0; i < arrayLength; i++) {
 //                console.log('videos are', videos[i]);
 //            }
 //            return videos[0].video_url;
           
 //        }, function(err) { // Error callback
 //          console.log('there was an error FETCHING VIDEOS WTF', err);
 //          // There was an error while fetching the data
 //        });

	// 		}
	// 		console.log('what is the url', $scope.getVideo());
	// 	    this.config = {
	// 					sources: [
	// 						{src: $sce.trustAsResourceUrl($scope.getVideo()), type: "video/mp4"},
	// 						{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
	// 						{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
	// 					],
	// 					tracks: [
	// 						{
	// 							src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
	// 							kind: "subtitles",
	// 							srclang: "en",
	// 							label: "English",
	// 							default: ""
	// 						}
	// 					],
	// 					theme: "lib/videogular-themes-default/videogular.css",
	// 					plugins: {
	// 						poster: "http://www.videogular.com/assets/images/videogular.png"
	// 					}
	// 				};
	// 	}]
	// )

	// .controller('VideoContainerCtrl2',
	// 		["$sce", function ($sce, $rootScope, $scope) {
	// 			this.config = {
	// 				sources: [
	// 					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
	// 					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
	// 					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
	// 				],
	// 				tracks: [
	// 					{
	// 						src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
	// 						kind: "subtitles",
	// 						srclang: "en",
	// 						label: "English",
	// 						default: ""
	// 					}
	// 				],
	// 				theme: "lib/videogular-themes-default/videogular.css",
	// 				plugins: {
	// 					poster: "http://www.videogular.com/assets/images/videogular.png"
	// 				}
	// 			};
	// 		}]
	// 	);