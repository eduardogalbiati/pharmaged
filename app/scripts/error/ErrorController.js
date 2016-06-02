(function () {
    'use strict';

    angular.module('app')
        .controller('ErrorController', [ '$rootScope', '$scope', '$routeParams', '$route', 
          function ErrorController( $rootScope, $scope, $routeParams, $route) {

        $scope.erro = $routeParams.error

      }]);
    
      

})();