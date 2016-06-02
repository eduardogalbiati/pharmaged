
    angular.module('app')
      .controller('appContainer', '$scope', 'VendasActiveRecord', '$mdToast', 'appUtils', '$mdDialog', '$q', formVendaDocumentosController );

      function formVendaDocumentosController(appContainer, $scope, VendasActiveRecord, $mdToast, appUtils, $mdDialog, $q){

        //Inicialização
        var vm = this;
        vm.scope = $scope;
        vm.scope.appUtils = appUtils;

        //Propriedade extendida do controller pai
        vm.scope.vendaEfetuada;
        vm.scope.filesForVenda;

        //Visibilidade no escopo para os métodos
        vm.scope.construct = construct;
        vm.scope.getArquivoTipo = getArquivoTipo;
        vm.scope.listVendaId = listVendaId;
        vm.scope.openFileExplorer = openFileExplorer;


       //Método de inicialização
        function construct(){
          //loadFilesForVenda();
        }

        //Métodos internos
        function listVendaId(id){
          VendasActiveRecord.getFilesForVenda(id).then(function(data){
            vm.scope.filesForVenda = data
            vm.scope.arqDocumentos = getArquivoTipo(1);
            vm.scope.arqReceitas = getArquivoTipo(2);
            vm.scope.arqCupons = getArquivoTipo(3);
          }).catch(function(err){
            appUtils.showErrorDialog(err);
          })
        }

        function getArquivoTipo(tipo){
          var files = vm.scope.filesForVenda;
          var out = [];
          //console.log(files)
          for (var x in files){
            //console.log(files[x].idTipoArquivo)
            if(files[x].idTipoArquivo == tipo){
              out.push(files[x]);
            }
          }
          return out;
        }

       function openFileExplorer(){
           var dialog = $mdDialog;

            var customTemplate =  '<md-dialog style="" class="fullscreen-dialog" flex>' +
                                  '  <md-dialog-content class="md-padding open-file-dialog">' +
                                  '   Confirma o lançamento de uma venda para o cliente<br> ' +
                                  ' <file-explorer app-container="appContainer"></file-explorer>' +
                                  '    </md-dialog-content>' +
                                  '  <md-dialog-actions>' +
                                  '    <md-button ng-click="closeDialog();" class="md-primary">' +
                                  '     VOLTAR' +
                                  '    </md-button>' +
                                   '    <md-button  ng-click="closeDialog();abreVenda();" id="confirmaAberturaVenda"class="md-primary">' +
                                  '     OK! CONFIRMO' +
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
                      },
                      onComplete: function onCompleteF(){
                          appUtils.setFocus('confirmaAberturaVenda')
                      }
                   });
        }

        //Listener externo, caso a venda seja selecionada
        vm.scope.$watch(
          function(){
            return appContainer.getAction(vm.scope, 'venda', 'select');
          },
          function(newValue) {
            console.log('<form-venda-documentos> disparo:venda.select acao:listVendaId');
            if(newValue != undefined)
              vm.scope.listVendaId(vm.scope.appContainer.elements.venda.idVenda);
        });



    }

  
  angular.module('app')
     .directive('formVendaDocumentos', function() {
        return {
            controller: formVendaDocumentosController,
            controllerAs: '_ctrl', 
            restrict: 'AE',
            scope: {
                appContainer : '=?appContainer'
            },
            templateUrl:  _templateBase + '/components/formVendaDocumentos/formVendaDocumentosView.html',
            link: function(scope, elem, attrs) {
              
                scope.construct();
            }
        };
    });