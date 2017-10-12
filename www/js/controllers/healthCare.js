(function() {

  angular.module('Jhu.controllers')
      .controller('HealthCareCtrl', [
        "$rootScope",
        "$scope",
        "$controller",
        "$state",
        "$stateParams",
        "$healthcareProviderContent",
        "cfpLoadingBar",
        function ($rootScope, $scope, $controller, $state, $stateParams, $healthcareProviderContent, cfpLoadingBar) {
          $controller('BaseCtrl', { $scope: $scope });
          
          // console.log("CONTROL POINT");
          // console.log($healthcareProviderContent);
          
          
          var availableCategories = {
            "maternal vaccines": true,
            "childhood vaccines": true,
            "safety issues": true,
            "paternal videos": true,
            "useful links": true
          }
         
          var tab = $stateParams.tab;
          var defaultCategory = "maternal vaccines";

          // console.log("Selected tab: "+tab);
          $scope.videoTab = false;
          $scope.currentCategory = defaultCategory;

          
          // Change category tab
          $scope.selectCategory = function(category) {
            if(isCategoryAvailable(category)) {
              $scope.currentCategory = category;
              fetchItems($scope.currentCategory);
            } else {
              $scope.currentCategory = defaultCategory;
              fetchItems($scope.currentCategory);
            }
          };

          // Check that category passed is one of the options available
          function isCategoryAvailable(category) {
            if(category && typeof category === "string") {
              return !!availableCategories[category];
            }
            return false;
          }
          
          $scope.setDelay = function(){
            $scope.delay = true;
            setTimeout(function(){
                $scope.delay = false;
            }, 200);
          };

          $scope.capitalizeWords = function(str)  
          {  
           return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});  
          }  

          function fetchItems(category) {
            if(isCategoryAvailable(category)) {
              if(category == 'paternal videos') {
                $scope.videoTab = true;
              } else {
                $scope.videoTab = false;
                $scope.showActivityIndicator();
                //cfpLoadingBar.start();
                $scope.items = $healthcareProviderContent
                  .sorted_by_name({
                    query: {
                      category_group: $scope.currentCategory
                    }
                  },
                    function(response) {
                      if(response && response.length>0){
                        _.each(response,function(content){
                          if(content.external_link){
                            content.external_link=decodeURIComponent(content.external_link);
                          }
                        });
                      }
                      // console.log("healthcareProviderContent sorted_by_name response is");
                      // console.log(response);
                      $scope.hideActivityIndicator();
                      //cfpLoadingBar.complete();
                    },
                    function(err) {
                      console.log("healthcareProviderContent error");
                      console.log(err);
                      $scope.hideActivityIndicator();
                      //cfpLoadingBar.complete();
                    });
              }
            }
          }
  	  if(!_isNotMobile)
  	  {
  		  $scope.menuOpened=false;
          $scope.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
            $scope.menuOpened=true;
          };
          $scope.$on("$mdMenuClose", function() {
            $scope.menuOpened=false;
          });
  	  }
          if(tab) {
            $scope.selectCategory(tab);
          } else {
            $scope.selectCategory(defaultCategory);
          }

        }
      ]);

})();
