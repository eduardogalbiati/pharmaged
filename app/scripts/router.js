

  var _templateBase = './scripts';
  var _appBasePath = './';

  angular.module('app')
  .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
             .when('/vendas', {
                  templateUrl: _templateBase + '/vendas/default.html' ,
                  controller: 'VendasController',
                  controllerAs: '_ctrl'
              })
              .when('/clientes', {
                  templateUrl: _templateBase + '/customer/customer.html' ,
                  controller: 'ClientesController',
                  controllerAs: '_ctrl'
              })
			       .when('/relatorio', {
                  templateUrl: _templateBase + '/relatorio/relatorio.html' ,
                  controller: 'ClientesController',
                  controllerAs: '_ctrl'
              })
              .when('/activation', {
                  templateUrl: _templateBase + '/activation/default.html' ,
                  controller: 'ActivationController',
                  controllerAs: '_ctrl'
              })
              .when('/errorPage/:error', {
                  templateUrl: _templateBase + '/error/default.html' ,
                  controller: 'ErrorController',
                  controllerAs: '_ctrl'
              });
            $routeProvider.otherwise({ redirectTo: '/vendas' });
        }
    ])
    .run(['$rootScope', '$location', '$timeout', 'ActivationService', 'ErrorCheckService',
      function($rootScope, $location, $timeout, ActivationService, ErrorCheckService) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
          ActivationService.checkCodigoAtivacao().then(function(data){
            if(data == '0' && $location.path() != '/activation' && $location.path() != '/errorPage'){
              $timeout(function() {
              $rootScope.$apply(function() {
                  $location.url('/activation');
                })
              })
            }
          })
          ErrorCheckService.checkForErrors().then(function(data){
                  console.log(data);
              }).catch(function(err){
              if($location.path() != '/activation'){

                $timeout(function() {
                $rootScope.$apply(function() {
                    $location.url('/errorPage/'+err);
                  })
                })
                 }
              })

        })
      }
    ]);
