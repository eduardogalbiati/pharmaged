(function () {
    'use strict';

    angular.module('app')
        .controller('RelatorioController', [
            'ClientesActiveRecord',
            'FilesService',
            '$q',
            '$scope',
            '$log',
            '$timeout',
            '$mdToast',
            'toaster',
            '$mdDialog',
            'PanZoomService',
            '$mdSidenav',
            RelatorioController
        ]);
    
    function RelatorioController( ClientesActiveRecord, FilesService, $q, $scope, $log, $timeout, $mdToast, toaster, $mdDialog, PanZoomService, $mdSidenav) {

         $scope.selectCliente = function (idCliente) {
            ClientesActiveRecord.getClienteById(idCliente).then(function (data) {
                //Aplicar a tratativa de erros, estudar como manipular as promisses
                $scope.imgToOpen = false;
                $scope.cupomToOpen = false;
                $scope.clienteSelected = data[0];
                $scope._clienteSelected = angular.copy($scope.clienteSelected);
                $scope.loadFilesForCliente(data[0].idCliente);
                $scope.loadCuponsForCliente(data[0].idCliente);
                //acForSearch .val()
                $scope.showSearch = false;
                $scope.setDomFocus('nomeCliente');
            });
        }

        $scope.loadClientesForSearch = function () {

            ClientesActiveRecord.getClientesForSearch().then(function (data, err) {
                  //Aplicar a tratativa de erros, estudar como manipular as promisses
                 $scope.clientesForSearch = data.map( function (state) {
                      return {
                        value: state.nomeCliente.toLowerCase()+' '+state.cpf,
                        display: state.nomeCliente+' - '+state.cpf,
                        idCliente: state.idCliente
                      };
                    });
                   
            }).catch(function (err){
                  $scope.showErrorDialog(err);
            });
        }

        $scope.loadClientesForSearch();
         //Md-AutoComplete
        $scope.ctrl = [];
        $scope.ctrl.simulateQuery = false;
        $scope.ctrl.isDisabled    = false;
        $scope.ctrl.querySearch   = querySearch;
        $scope.ctrl.selectedItemChange = selectedItemChange;
        $scope.ctrl.searchTextChange   = searchTextChange;

        function querySearch (query) {
          var  deferred;
            deferred = $q.defer();
              var results = query ? $scope.clientesForSearch.filter( createFilterFor(query) ) : $scope.clientesForSearch
              deferred.resolve( results ); 
            return deferred.promise;
          
        }
        function searchTextChange(text) {
          $log.info('Text changed to ' + text);
        }
        function selectedItemChange(item) {
          if(item !== undefined){
            $log.info('Item changed to ' + JSON.stringify(item));
            $scope.selectCliente(item.idCliente);
            $scope.setDomValue('acForSearch', '');
                  $scope.ctrl.searchText = '';
          }


        }
 
        /**
         * Create filter function for a query string
         */
         function splitQuery(query){
          return [{value:query}];
          return query.split(" ").map( function (word) {
                  return {
                    value: word,
                  };
                });
         }
        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(state) {
                var arrS = splitQuery(lowercaseQuery);
                for(var x in arrS){

                  if(state.value.indexOf(arrS[x].value) >= 0){
                      return true
                  }
                }
                return false;
          };
        }



  }

})();