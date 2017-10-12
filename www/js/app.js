var _isNotMobile = (function() {
  var check = false;
  (function(a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) check = true
  })(navigator.userAgent || navigator.vendor || window.opera);
  return !check;
})();
var baseUrl = "https://quiet-wildwood-94007.herokuapp.com"; //heroku
//var baseUrl="http://localhost:1337";//heroku
//var baseUrl="https://64.28.103.28";//OnRamp Production
//var baseUrl="https://trout-prepare-wawa.anypresencecloud.com";//anypresence
//var baseUrl="http://localhost:1337";
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('Jhu', ['ui.router','ui.bootstrap', 'ngScrollbars', 'ngMaterial', 'ngAnimate', 'infinite-scroll', 'ngMessages', 'ngStorage', 
    'cfp.loadingBar', 'ionic', 'ionic.service.core', 'Jhu.factories', 'VaccineSurveySdk', 'Jhu.controllers', 
    'Jhu.services', 'ngSanitize', 'com.2fdevs.videogular', 'com.2fdevs.videogular.plugins.controls', 
    'com.2fdevs.videogular.plugins.poster', 'com.2fdevs.videogular.plugins.overlayplay', 
    'dibari.angular-ellipsis','as.sortable'
  ])
  .run(['$ionicPlatform', '$rootScope', '$vaccineSurveySdkConfig',
    function($ionicPlatform, $rootScope, $vaccineSurveySdkConfig) {
      $vaccineSurveySdkConfig.baseUrl.set(baseUrl);

      $vaccineSurveySdkConfig.offlineCache.enable();

      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        //if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        //
        ionic.Platform.ready(function() {
          // hide the status bar using the StatusBar plugin


          var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
          if (iOS) {
            document.getElementById("main-view").className += " iOS-status-bar";
            ionic.Platform.fullScreen(true, true);
          }

        });


        // $rootScope.loadingTracker = promiseTracker();
        //$surveynewquestionskiplogicSdkConfig.baseUrl.set("https://shrouded-earth-89283.herokuapp.com");
      });
    }
  ])

  .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
    function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
      if (!ionic.Platform.isIOS()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
      }
      $ionicConfigProvider.views.maxCache(5);



      $stateProvider

        .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: (_isNotMobile) ? 'templates/desktop/login.html' : 'templates/mobile/login.html',
          controller: (_isNotMobile) ? 'LoginCtrl' : 'LoginCtrl'
        })

        .state('app.blank', {
          url: '/blank'
        })
        .state('login', {
          url: '/login',
          templateUrl: (_isNotMobile) ? 'templates/desktop/login.html' : 'templates/mobile/login.html',
          controller: (_isNotMobile) ? 'LoginCtrl' : 'LoginCtrl'
        })
        .state('app.admin', {
          url: '/admin',
          templateUrl: 'templates/desktop/admin.html',
          controller: "AdminCtrl"
        })
        .state('admin', {
          url: '/admin',
          templateUrl: 'templates/desktop/admin.html',
          controller: "AdminCtrl"
        })
        .state('patientsurveydata', {
          url: 'admin/surveyDetail/:surveyId',
          templateUrl: 'templates/desktop/admin/surveyDetail.html',
          controller: "SurveyDetailCtrl"
        })
        .state('signupsuccess', {
          url: '/signup-success',
          templateUrl: (_isNotMobile) ? 'templates/desktop/signup-success.html' : 'templates/mobile/signup-success.html',
          controller: 'SignupCtrl'
        })
        .state('signup', {
          url: '/signup',
          templateUrl: (_isNotMobile) ? 'templates/desktop/signup.html' : 'templates/mobile/signup.html',
          controller: 'SignupCtrl'
        })
        .state('updatePassword', {
          url: '/changePassword',
          templateUrl: 'templates/desktop/changePassword.html',
          controller: 'ChangePasswordCtrl'
        })
        .state('app.home', {
          url: '/home',
          views: {
            'menuContent': {
              templateUrl: (_isNotMobile) ? 'templates/desktop/home.html' : 'templates/mobile/home.html',
              controller: (_isNotMobile) ? 'HomeCtrl' : 'HomeCtrl'
            }
          },
          templateUrl: (_isNotMobile) ? 'templates/desktop/home.html' : 'templates/mobile/home.html',
          controller: (_isNotMobile) ? 'HomeCtrl' : 'HomeCtrl'

        })
        .state('home', {
          url: '/home',
          templateUrl: (_isNotMobile) ? 'templates/desktop/home.html' : 'templates/mobile/home.html',
          controller: (_isNotMobile) ? 'HomeCtrl' : 'HomeCtrl'
        })
        .state('home.surveyStatus', {
          url: '/survey',
          views: {
            'homeContent': {
              templateUrl: (_isNotMobile) ? "templates/desktop/surveyStatus.html" : "templates/mobile/surveyStatus.html",
              controller: "HomeCtrl"
            }
          }
        })
        .state('home.videoSurvey', {
          url: '/survey',
          views: {
            'homeContent': {
              templateUrl: (_isNotMobile) ? "templates/desktop/surveyStatus.html" : "templates/mobile/surveyStatus.html",
              controller: "HomeCtrl"
            }
          }
        })
        .state('home.videoTiles', {
          url: '/videoTiles',
          views: {
            'homeContent': {
              templateUrl: (_isNotMobile) ? "templates/desktop/videoTiles.html" : "templates/mobile/videoTiles.html",
              controller: "VideoTileCtrl"
            }
          }
        })
        .state('home.videos', {
          url: '/videos',
          views: {
            'homeContent': {
              templateUrl: (_isNotMobile) ? "templates/desktop/videoGallary.html" : "templates/mobile/videoGallary.html",
              controller: "VideoCtrl"
            }
          }
        })
        .state('home.videos2', {
          url: '/videos2',
          views: {
            'homeContent': {
              templateUrl: (_isNotMobile) ? "templates/desktop/videoGallary2.html" : "templates/mobile/videoGallary2.html",
              controller: "Video2Ctrl"
            }
          }
        })
        .state('home.controluser', {
          url: '/',
          views: {
            'homeContent': {
              templateUrl: (_isNotMobile) ? "templates/desktop/controlUserHome.html" : "templates/mobile/controlUserHome.html",
              controller: "HomeCtrl"
            }
          }
        })
        .state('home.updateProfile', {
          /*url: '/profile',
          views:{
            'homeContent':{
              templateUrl:'templates/desktop/updateProfile.html',
              controller: 'HomeCtrl'
            }
          }*/
        })
        .state('home.notification', {
          /*url: '/notifications',
          views:{
            'homeContent':{
              templateUrl:'templates/desktop/notificationSettings.html',
              controller: 'HomeCtrl'
            }
          }*/

        })
        .state('home.inviteContacts', {
          /*url: '/invite',
          views:{
            'homeContent':{
              templateUrl:'templates/desktop/inviteContact.html',
              controller: 'HomeCtrl'
            }
          }*/
        })
        .state('home.healthCare', {
          url: '/healthcare/:tab',
          views: {
            'homeContent': {
              templateUrl: 'templates/desktop/healthCare.html',
              controller: 'HealthCareCtrl'
            }
          }
        })
        .state('app.healthCare', {
          url: '/healthCare',
          templateUrl: 'templates/mobile/healthCare.html',
          controller: 'HealthCareCtrl'

        })
        .state('healthCare', {
          url: '/healthcare/:tab',
          templateUrl: 'templates/mobile/healthCare.html',
          controller: 'HealthCareCtrl'
        });
        // .state('app.search', {
        //   url: '/search',
        //   views: {
        //     'menuContent': {
        //       templateUrl: (_isNotMobile )?'templates/desktop/search.html':'templates/mobile/search.html'
        //     }
        //   }
        // })
        // .state('app.browse', {
        //     url: '/browse',
        //     views: {
        //       'menuContent': {
        //         templateUrl: (_isNotMobile )?'templates/desktop/browse.html': 'templates/mobile/browse.html'
        //       }
        //     }
        //   })
        //   .state('app.playlists', {
        //     url: '/playlists',
        //     views: {
        //       'menuContent': {
        //         templateUrl: (_isNotMobile )?'templates/desktop/playlists.html':'templates/mobile/playlists.html',
        //         controller: 'PlaylistsCtrl'
        //       }
        //     }
        //   })
        //   .state('app.invite', {
        //   url: '/invite',
        //   views: {
        //     'menuContent': {
        //       templateUrl: 'templates/mobile/invite-list.html',
        //       controller: 'InviteCtrl'
        //     }
        //   }
        // })

        // .state('app.notifications', {
        //   url: '/notifications',
        //   views: {
        //     'menuContent': {
        //       templateUrl: 'templates/mobile/notifications.html',
        //       controller: 'NotificationsCtrl'
        //     }
        //   }
        // })

        // .state('app.videos', {
        //   url: '/videos',
        //   views: {
        //     'menuContent': {
        //       templateUrl: 'templates/mobile/videos.html'
        //     }
        //   }
        // });


      // if none of the above states are matched, use this as the fallback
      if (_isNotMobile) {
        $urlRouterProvider.otherwise('login');

      } else {
        $urlRouterProvider.otherwise('/app/blank');
      }
    }
  ])
  .directive('stickyFooter', [
    '$timeout',
    function($timeout) {
      return {
        restrict: 'A',
        link: function(scope, iElement, iAttrs) {
          var stickyFooterWrapper = $(iAttrs.stickyFooter);

          // Quite often you will occur a few wrapping `<div>`s in the
          // top level of your DOM, so we need to set the height
          // to be 100% on each of those. This will also set it on
          // the `<html>` and `<body>`.
          stickyFooterWrapper.parents().css('height', '100%');
          stickyFooterWrapper.css({
            'min-height': '100%',
            'height': 'auto'
          });

          // Append a pushing div to the stickyFooterWrapper.
          var stickyFooterPush = $('<div class="push"></div>');
          stickyFooterWrapper.append(stickyFooterPush);

          var setHeights = function() {
            var height = iElement.outerHeight();
            stickyFooterPush.height(height);
            stickyFooterWrapper.css('margin-bottom', -(height));
          };

          $timeout(setHeights, 0);
          $(window).on('resize', setHeights);
        }
      };
    }
  ])
  .constant('_',
    window._
  )
  
  .directive('validFile', function() {
    return {
      restrict: 'A',
      require: "ngModel",
      link: function(scope, el, attrs, ctrl) {

        setTimeout(function() {
          if (el[0].required) {

            ctrl.$setValidity('validFile', el.val() != '');

            //change event is fired when file is selected
            el.bind('change', function() {
              ctrl.$setValidity('validFile', el.val() != '');
              scope.$apply(function() {
                ctrl.$setViewValue(el.val());
                ctrl.$render();
              });
            });
          }
        }, 100);
        ctrl.$setValidity('validFile', true);
        scope.$on('$destroy',function(){
          if(el){
            el.unbind('change');
          }
        });
      }
    };
  })
  .directive('futureDate', function() {
    return {
      restrict: 'A',
      require: "ngModel",
      link: function(scope, elm, attrs, ctrl) {

        ctrl.$validators.futureDate = function(modelValue) {
          var date = new Date();
          date.setMonth(date.getMonth() + 9);
          date.setHours(0, 0, 0, 0);
          var isValid = (modelValue <= date) && (modelValue >= (new Date()).setHours(0, 0, 0, 0));
          ctrl.$setValidity("futureDate", isValid);
          delete date;
          return isValid;

        };

      }
    };
  })
  .directive('input', ['$ionicScrollDelegate', function($ionicScrollDelegate) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        if (ionic.Platform.isIOS()) {
          element.bind('focus', focusInput);

          function focusInput(pEvent, pTarget) {
            if ((window.innerHeight < $(pEvent.target).offset().top + 45) || ($(pEvent.target).offset().top < 50)) {
              
              if ((Math.abs(Math.abs($($(pEvent.target).closest(".scroll")).position().top) + $(pEvent.target).offset().top) - window.innerHeight) < 90) {
                $ionicScrollDelegate.scrollTo(0, $($(pEvent.target).closest(".scroll")).position().top - 45);
              } else {
                //$ionicScrollDelegate.scrollTo(0,$(pEvent.target).offset().top*-1);
                $ionicScrollDelegate.scrollTo(0, $($(pEvent.target).closest(".scroll")).position().top - 90);
              }
            }
          };
        }
        scope.$on('$destroy',function(){
          if(element && ionic.Platform.isIOS())
            element.unbind('focus', focusInput);
        });
      }
    };
  }])

  .config(["$mdIconProvider", function($mdIconProvider) {
    $mdIconProvider

      .defaultIconSet('img/icons/mdi.svg')
      .iconSet("social", 'img/icons/social.svg');

  }])
  .config(["$httpProvider", function($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
  }]);
