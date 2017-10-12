angular.module('Jhu.factories', []);
angular.module('Jhu.factories').factory('myHttpInterceptor',['$rootScope', '$q',
 function($rootScope, $q) {
    return {
      'request': function(config) {
        // do something on success
        return config;
      },

     'requestError': function(rejection) {
        // do something on error
        console.log('request error this is the rejection', rejection);
        if(rejection.status == 403 || rejection.status == 401) {
          $rootScope.$broadcast('auth-loginRequired', rejection);
        }
        return $q.reject(rejection);
      },

      'response': function(response) {
        // do something on success
        // console.log('response success this is the response', response);
        if(response.config.url.substr(response.config.url.length - 23) == '/auth/password/callback'){
          $rootScope.$broadcast('auth-loginSuccess', response);
        }
        if(response.config.url.substr(response.config.url.length - 13) == '/auth/signout'){
          $rootScope.$broadcast('auth-logoutSuccess', response);
        }
        return response;
      },

     'responseError': function(rejection) {
        // do something on error
        // console.log('response error this is the rejection', rejection);
        if(rejection.status == 401 || rejection.status == 403) {
          $rootScope.$broadcast('auth-loginRequired', rejection);
        }
        if(rejection.data != undefined) {
          if(rejection.data.message && rejection.data.message.substring(0,12) == 'Unknown user') {
            console.log('this error is due to an unauthorized login attempt');
            $rootScope.$broadcast('auth-loginRequired', rejection);
          }
        }
        return $q.reject(rejection);
      }
    };
  }]);
