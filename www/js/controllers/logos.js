(function() {

  angular.module('Jhu.controllers')
      .controller('LogosCtrl', [
        "$rootScope",
        "$scope",
        "$controller",
        "$state",
        "$stateParams",
        "cfpLoadingBar",
        function ($rootScope, $scope, $controller, $state, $stateParams, cfpLoadingBar) {
          $controller('BaseCtrl', { $scope: $scope });
          
            $scope.isNotSurveyTemplate = true;

        }
      ]);

})();
