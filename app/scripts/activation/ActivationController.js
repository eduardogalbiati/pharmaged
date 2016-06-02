(function () {
    'use strict';

    angular.module('app')
        .controller('ActivationController', [
            'ActivationService',
            '$q',
            '$scope',
            '$log',
            '$timeout',
            '$mdDialog',
            '$location',
            ActivationController
        ]);
    
    function ActivationController(ActivationService, $q, $scope, $log, $timeout, $mdDialog, $location) {


    $scope.codigoInstalacao = '';
    $scope.codigoAtivacao = '';
    $scope.status = '';

    $scope.getCodigoInstalacao = function() {
      ActivationService.getCodigoInstalacao().then(function(data){
        $scope.codigoInstalacao = data;
      })
    }  
    $scope.checkCodigoAtivacao = function() {
      ActivationService.checkCodigoAtivacao().then(function(data){
        $scope.status = data;
      })
    }
    $scope.putCodigoAtivacao = function() {
      ActivationService.putCodigoAtivacao($scope.codigoAtivacao).then(function(data){
        ActivationService.checkCodigoAtivacao().then(function(ativo){
          if(ativo == 1){
            $scope.showSuccessDialog();
          }else{
            $scope.showErrorDialog();
          }
        })
        //$scope.codigoInstalacao = data;
      })
    }

    $scope.showErrorDialog = function() {
       var dialog = $mdDialog;

        var customTemplate =  '<md-dialog style="max-width:30%;" flex>' +
                              '  <md-dialog-content class="md-padding open-file-dialog">' +
                              '   <br> ' +
                              ' <h4>Chave Inválida</h4>' +
                              '    </md-dialog-content>' +
                              '  <md-dialog-actions>' +
                               '    <md-button  ng-click="closeDialog();" class="md-primary">' +
                              '     Fechar' +
                              '    </md-button>' +
                              '  </md-dialog-actions>' +
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
                  }
               });
    }

     $scope.showSuccessDialog = function() {
       var dialog = $mdDialog;

        var customTemplate =  '<md-dialog style="max-width:30%;" flex>' +
                              '  <md-dialog-content class="md-padding open-file-dialog">' +
                              '   <br> ' +
                              ' <h4>Produto ativado com sucesso!</h4>' +
                              '    </md-dialog-content>' +
                              '  <md-dialog-actions>' +
                               '    <md-button  ng-click="closeDialog();gotoProduto();" class="md-primary">' +
                              '     Começar a usar' +
                              '    </md-button>' +
                              '  </md-dialog-actions>' +
                              '</md-dialog>';
           dialog.show({
                  clickOutsideToClose: true,
                  scope: $scope,        // use parent scope in template
                  preserveScope: true,  // do not forget this if use parent scope
                  template: customTemplate,
                  controller: function DialogController($scope, $mdDialog, $location) {
                    $scope.closeDialog = function() {
                      $mdDialog.hide();
                    }
                    $scope.gotoProduto = function(){
                      $location.url("/")
                    }
                  }
               });
    }

    $scope.getCodigoInstalacao();
    $scope.checkCodigoAtivacao();
   


  }

})();