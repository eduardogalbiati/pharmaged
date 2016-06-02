
    angular.module('app')
      .controller('appContainer', '$scope', 'ClientesActiveRecord', 'VendasActiveRecord', '$mdToast', 'appUtils', '$mdDialog', '$q',formVendaController );

      function formVendaController(appContainer, $scope, ClientesActiveRecord, VendasActiveRecord, $mdToast, appUtils, $mdDialog, $q){
        var vm = this;

        vm.scope = $scope;
        vm.scope.appUtils = appUtils;

        vm.scope.showCard = false;
        vm.scope.clienteTop = 'center';
        vm.scope.consultaCpf = consultaCpf;
        vm.scope.newClienteModalDisabled = newClienteModalDisabled;
        vm.scope.construct    = construct ;
        vm.scope.isVendaDisabled  = isVendaDisabled ;
        vm.scope.abreVendaDialog  = abreVendaDialog ;
        vm.scope.abreVenda  = abreVenda ;

       
        vm.scope.newClienteModal = {
          cpf : '',
          nome : ''
        }

       function resetEntity(){
          appContainer.setElement(vm.scope, 'cliente' ,{
              idCliente: '',
              nomeCliente: '',
              cpf:''
          })
       }
        
      
        function construct(){
            resetEntity()
            vm.scope.newClienteModal.isNew = true;
            vm.scope.newClienteModal.cpf = '';
            vm.scope.newClienteModal.nomeCliente = '';
            vm.scope.newClienteModal.approved = false;
            vm.scope.newClienteModal.openApproved = false;
            vm.scope.newClienteModal.icon = 'search';
            vm.scope.newClienteModal.idCliente ='';
            appUtils.setValue('newClienteModalNomeClienteMd','');
            appContainer.setElement(vm.scope, 'venda', false);
            appContainer.setElement(vm.scope, 'cliente', false);
        }
        
        function consultaCpf(){
           resetEntity();
           vm.scope.appContainer.elements.cliente.cpf = vm.scope.newClienteModal.cpf;
           if(vm.scope.newClienteModal.cpf != '' && vm.scope.newClienteModal.cpf != undefined){
              ClientesActiveRecord.getClienteByCpf(vm.scope.newClienteModal.cpf).then(function (data) {
                  //Aplicar a tratativa de erros, estudar como manipular as promisses
                  if(data.length == 0){
                    vm.scope.newClienteModal.isNew = true;
                    vm.scope.newClienteModal.icon = 'note_add';
                    vm.scope.newClienteModal.nomeCliente = ''
                    appUtils.setFocusTime('newClienteModalNomeClienteMd');

                  }else{
                    vm.scope.appContainer.elements.cliente = data[0];
                    //console.log(vm.scope.appContainer.elements.cliente)
                    vm.scope.newClienteModal.isNew = false;
                    vm.scope.newClienteModal.icon = 'perm_contact_cal';
                    vm.scope.newClienteModal.nomeCliente = data[0].nomeCliente;
                    appUtils.setFocusTime('newClienteModalNomeCliente');


                  }
                  vm.scope.showCard = true;
              });
            }else{
                //appUtils.setFocusTime('newClienteModalCpf');
                construct();
            }
        }

        function newClienteModalDisabled() {
          if(vm.scope.newClienteModal.approved == true && vm.scope.appContainer.elements.cliente.nomeCliente != '' && vm.scope.appContainer.elements.cliente.cpf != ''){
              return false;
          }
          return true;
        }

        function isVendaDisabled() {
          if(vm.scope.appContainer.elements.cliente.cpf == '' || vm.scope.appContainer.elements.cliente == false)
            return true;
          return false;
        }


        

        function abreVenda(){
            var cpf = vm.scope.newClienteModal.cpf;
            if(vm.scope.newClienteModal.nomeCliente == ''){
              var value = appUtils.getValue('newClienteModalNomeClienteMd');
            }else{
              var value = vm.scope.newClienteModal.nomeCliente;
            }
            if(value == ''){
              if(vm.scope.isNew == false)
              appUtils.setFocusTime('newClienteModalNomeClienteMd');
              else
              appUtils.setFocusTime('newClienteModalNomeCliente');
              return;
            }else{
              vm.scope.appContainer.elements.cliente.nomeCliente = appUtils.trataNome(value);
              vm.scope.appContainer.elements.cliente.cpf = cpf;
            }
        
           ClientesActiveRecord.createUpdate(vm.scope.appContainer.elements.cliente).then(function(insertId){
             
            var venda = {
              idCliente: insertId,
              dataHora : appUtils.getDataHora()
             }
             VendasActiveRecord.create(venda).then(function (data){
              //console.log(data);

              appContainer.setElement(vm.scope, 'venda', {'idVenda':data});
              appContainer.setAction(vm.scope, 'venda', 'create');
              //vm.scope.vendaEntity = data;
              //vm.scope.vendaEfetuada = data;

                //vm.scope.vendaShow = true;
             }).catch(function(err){
                appUtils.showErrorDialog(err);
             })

            
           }).catch(function(err){
              appUtils.showErrorDialog(err);
           })

        }

        function abreVendaDialog(){
           var dialog = $mdDialog;

            var customTemplate =  '<md-dialog style="max-width:30%;" flex>' +
                                  '  <md-dialog-content class="md-padding open-file-dialog">' +
                                  '   Confirma o lançamento de uma venda para o cliente<br> ' +
                                  ' <h4>'+$scope.newClienteModal.nomeCliente+'</h4>' +
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

        

         vm.scope.$watch(
            function(){
                return appContainer.getAction(vm.scope, 'cliente', 'select');
            }, 
            function(newValue) {
              if(newValue != undefined)

                vm.scope.newClienteModal.cpf = appContainer.getElement(vm.scope, 'cliente').cpf;
                vm.scope.newClienteModal.nomeCliente = appContainer.getElement(vm.scope, 'cliente').nomeCliente;
                appUtils.setValue('newClienteModalNomeClienteMd',appContainer.getElement(vm.scope, 'cliente').nomeCliente)
                vm.scope.newClienteModal.approved = true;
                vm.scope.newClienteModal.openApproved = true;
                vm.scope.newClienteModal.isNew = true;
                vm.scope.newClienteModal.idCliente = appContainer.getElement(vm.scope, 'cliente').idCliente;
                //appUtils.setFocusTime('telefone1')
            }
        );

          vm.scope.$watch(
            function(){
                return appContainer.getAction(vm.scope, 'venda', 'createRequest');
            }, 
            function(newValue) {
              if(newValue != undefined)
                console.log('<form-venda> disparo:venda.createRequest acao:construct');
                construct();
                        appUtils.setFocusTime('newClienteModalCpf');

            }
        );


    }

  
  angular.module('app')
     .directive('formVenda', function() {
        return {
            controller: formVendaController,
            controllerAs: '_ctrl', 
            restrict: 'AE',
            scope: {
                appContainer : '=?appContainer'
            },
            templateUrl:  _templateBase + '/components/formVenda/formVendaView.html',
            link: function(scope, elem, attrs) {
                scope.construct();
                //scope.appUtils.setFocusTime('newClienteModalCpf');
            }
        };
    });