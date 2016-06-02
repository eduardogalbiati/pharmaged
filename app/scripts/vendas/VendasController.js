(function () {
    'use strict';

    angular.module('app')
        .controller('VendasController', [
            '$q',
            '$scope',
            '$log',
            '$timeout',
            '$mdDialog',
            '$location',
            'appUtils',
            'appContainer',
            VendasController
        ]);
    
    function VendasController( $q, $scope, $log, $timeout, $mdDialog, $location, appUtils, appContainer) {

        var vm = this;
        vm.scope = $scope;
        vm.scope.searchSomenteNome = false;

        appContainer.define(vm.scope, {
            'elements' :{
                'venda':false,
                'cliente':false
            },
            'actions':{
                'venda' :{
                    'create' : false,
                    'select' : false,
                    'update' : false,
                    'list' : false,
                },
                'cliente' : {
                    'create' : false,
                    'select' : false
                }
            }
        })
        //vm.scope.appContainer =


        appUtils.setFocusTime('newClienteModalCpf');

        //vm.scope.vendaEfetuada = false;
        //vm.scope.clienteSelected = false;

       /* function abreVenda(){
          console.log('venda foi aberta')
        }

        vm.scope.$watch(function(){
            return vm.scope.vendaEfetuada
        },function(newValue){
            if(newValue != ''){
                console.log('listener de VendasController acionado');
                abreVenda();

            }
        })


*/
    function openFileExplorer(){
           var dialog = $mdDialog;

            var customTemplate =  '<md-dialog style="" class="fullscreen-dialog" flex>' +
                                  '  <md-dialog-content style="height:100%;class="md-padding open-file-dialog">' +
                                  '    <file-explorer app-container="appContainer"></file-explorer>' +
                                  '  </md-dialog-content>' +
                                  '</md-dialog>';
               dialog.show({
                      clickOutsideToClose: true,
                      scope: $scope,        // use parent scope in template
                      preserveScope: true,  // do not forget this if use parent scope
                      template: customTemplate,
                      controller: function DialogController($scope, $mdDialog) {
                        $scope.closeDialog = function() {
                          $mdDialog.hide();
                        }
                      },
                      onComplete: function onCompleteF(){
                          appUtils.setFocus('confirmaAberturaVenda')
                      }
                   });
        }

        openFileExplorer();

  }

})();