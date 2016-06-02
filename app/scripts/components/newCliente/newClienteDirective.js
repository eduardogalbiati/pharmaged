
    angular.module('app')
      .controller('$scope', 'ClientesActiveRecord', '$mdToast', 'appUtils', '$mdDialog', newClienteController );

      function newClienteController($scope, ClientesActiveRecord, $mdToast, appUtils, $mdDialog){
        var vm = this;

        vm.scope = $scope;

        vm.scope.consultaCpf = consultaCpf;
        vm.scope.openDialog = openDialog;
        vm.scope.newClienteModalDisabled = newClienteModalDisabled;
        vm.scope.initNewClienteModal  = initNewClienteModal ;
        vm.scope.selectModalCliente  = selectModalCliente ;
        vm.scope.addNovoCliente  = addNovoCliente ;
        vm.scope.hitEnterOnName  = hitEnterOnName ;


        vm.scope.newClienteModal = {
          cpf : '',
          nome : ''
        }

        function addNovoCliente() {
            if(vm.scope.newClienteModal.approved == true){
                var cliente = {
                  nomeCliente : appUtils.trataNome(vm.scope.newClienteModal.nomeCliente),
                  cpf: vm.scope.newClienteModal.cpf,
                  dataHoraCadastro: appUtils.getDataHora()
                }
                ClientesActiveRecord.create(cliente).then(function (data) {
                    vm.scope.sonarTo = !vm.scope.sonarTo;
                    vm.scope.newClienteModal.idCliente = data;
                    console.log(data);
                    selectModalCliente();
                    initNewClienteModal();

                });
                vm.scope.closeDialog();
            }

          }
        
        function hitEnterOnName(){
          if(!vm.scope.newClienteModal.openApproved){
            vm.scope.addNovoCliente();
          }else{
            vm.scope.selectModalCliente();
          }
        }

        function initNewClienteModal(){
            vm.scope.newClienteModal.cpf = '';
            vm.scope.newClienteModal.nomeCliente = '';
            vm.scope.newClienteModal.approved = false;
            vm.scope.newClienteModal.openApproved = false;
            vm.scope.newClienteModal.icon = 'keyboard_control';
            vm.scope.newClienteModal.idCliente ='';
        }
        
        function consultaCpf(){
           if(vm.scope.newClienteModal.cpf != ''){
              ClientesActiveRecord.getClienteByCpf(vm.scope.newClienteModal.cpf).then(function (data) {
                  //Aplicar a tratativa de erros, estudar como manipular as promisses
                  if(data.length == 0){
                    vm.scope.newClienteModal.approved = true;
                    vm.scope.newClienteModal.openApproved = false;
                    vm.scope.newClienteModal.icon = 'note_add';
                    vm.scope.newClienteModal.nomeCliente = '';
                    vm.scope.newClienteModal.idCliente ='';

                  }else{
                    vm.scope.newClienteModal.nomeCliente = data[0].nomeCliente;
                    vm.scope.newClienteModal.idCliente = data[0].idCliente;
                    vm.scope.newClienteModal.approved = false;
                    vm.scope.newClienteModal.openApproved = true;
                    vm.scope.newClienteModal.icon = 'perm_contact_cal';

                  }

              });
            }else{
                initNewClienteModal();
            }
        }

        function newClienteModalDisabled() {
          if(vm.scope.newClienteModal.approved == true && vm.scope.newClienteModal.nomeCliente != '' && vm.scope.newClienteModal.cpf != ''){
              return false;
          }
          return true;
        }

        function selectModalCliente() {
          ClientesActiveRecord.getClienteById(vm.scope.newClienteModal.idCliente).then(function (data) {
              //Aplicar a tratativa de erros, estudar como manipular as promisses
              vm.scope.clienteSelected = data[0];
              vm.scope._clienteSelected = angular.copy(vm.scope.clienteSelected);
               
          });
        
          vm.scope.closeDialog();
          initNewClienteModal();
        }
        function openDialog(){

           vm.scope.sonarTo = !vm.scope.sonarTo;
            var dialog = $mdDialog;

            var customTemplate =  '<md-dialog style="max-width:40%;" flex>' +
                                  '  <md-dialog-content class="md-padding open-file-dialog">' +
                                  '     <form name="userForm" class="padding-medium">' +
                                  '       <div layout layout-sm="column">' +
                                  '         <md-input-container>' +
                                  '           <label>CPF</label>' +
                                  '           <input next-on-enter="newClienteModalNomeCliente" id="newClienteModalCpf" ui-mask="999.999.999-99" ui-options="{clearOnBlur:false}" placeholder="" class="n" ng-model="newClienteModal.cpf" type="text" ng-blur="consultaCpf()">' +
                                  '         </md-input-container>' +
                                  '         <md-input-container >' +
                                  '           <ng-md-icon  icon="{{newClienteModal.icon}}" options=\'{"duration": 375}\'></ng-md-icon>'+
                                  '         <h5 style="margin:10px 0 0 25px;" ng-if="newClienteModal.icon == \'note_add\'" flex> Cadastrar cliente  </h5>' +
                                  '         <h5 style="margin:10px 0 0 25px;" ng-if="newClienteModal.icon == \'perm_contact_cal\'" flex> Cliente encontrado!  </h5>' +

                                  '         </md-input-container>' +
                                  '       </div>' +
                                  '       <div layout layout-sm="column">' +
                                  '         <md-input-container class="input-uppercase" flex>' +
                                  '           <label>Nome</label>' +
                                  '           <input remove-acento id="newClienteModalNomeCliente" function-on-enter="hitEnterOnName()" id="newClienteModalNome" ng-model="newClienteModal.nomeCliente" ng-blur="consultaNome()" type="text" flex>' +
                                  '         </md-input-container>' +
                                  '       </div>' +
                                  '       </form>' +
                                  '    </md-dialog-content>' +
                                  '  <md-dialog-actions>' +
                                  '    <md-button ng-click="closeDialog();" class="md-primary">' +
                                  '     Voltar' +
                                  '    </md-button>' +
                                   '    <md-button ng-if="!newClienteModal.openApproved" ng-disabled="newClienteModalDisabled()" ng-click="addNovoCliente();" class="md-primary">' +
                                  '     Cadastrar' +
                                  '    </md-button>' +
                                   '    <md-button ng-if="newClienteModal.openApproved" ng-disabled="false" ng-click="selectModalCliente();" class="md-primary">' +
                                  '     Abrir' +
                                  '    </md-button>' +
                                  '  </md-dialog-actions>' +
                                  '</md-dialog>';
          dialog.show({
              clickOutsideToClose: true,
              scope: vm.scope, 
              focusOnOpen:false,       // use parent scope in template
              preserveScope: true,  // do not forget this if use parent scope
              template: customTemplate,
              controller: function DialogController($scope, $mdDialog) {
                  $scope.closeDialog = function() {
                      $mdDialog.hide();
                  }
              },
              onComplete: function onCompleteF(){
                  appUtils.setFocus('newClienteModalCpf')
              }
            });

        }

    }

  
  angular.module('app')
     .directive('newCliente', function() {
        return {
            controller: newClienteController,
            controllerAs: '_ctrl', 
            restrict: 'AE',
            scope: {
                sonarTo : '=?sonarTo',
                clienteSelected : '=?clienteSelected',
            },
            templateUrl:  _templateBase + '/components/newCliente/newClienteView.html',
            link: function(scope, elem, attrs) {
              scope.initNewClienteModal();
             

             // elem.bind('click', function() {
             //   scope.openDialog();
             // });
            }
        };
    });