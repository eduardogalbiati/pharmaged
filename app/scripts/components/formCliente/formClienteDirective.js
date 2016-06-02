

angular.module('app')
	.controller('formClienteController', '$scope', 'ClientesActiveRecord', '$mdToast', 'appUtils', formClienteController );


	function formClienteController($scope, ClientesActiveRecord, $mdToast, appUtils) {
		var vm = this;
		vm.scope = $scope;

		vm.scope.update = update
		vm.scope.loadCliente = loadCliente

      	function loadCliente(idCliente) {
            ClientesActiveRecord.getClienteById(idCliente).then(function (data) {
                //Aplicar a tratativa de erros, estudar como manipular as promisses
                vm.scope.clienteSelected = data[0];
                vm.scope._clienteSelected = angular.copy(vm.scope.clienteSelected);
                appUtils.setFocusTime('nomeCliente');
            });
        }


		function update(field){

            if(vm.scope._clienteSelected[field] != vm.scope.clienteSelected[field]){
                ClientesActiveRecord.updateClientesField(vm.scope.clienteSelected.idCliente, field, vm.scope.clienteSelected[field], vm.scope._clienteSelected[field] ).then(function (data) {
                    //realizar a tratativa da promisse
                    showActionToast('Campo Atualizado', 'success');
                    vm.scope._clienteSelected = angular.copy($scope.clienteSelected);
                }).catch(function(err){
                	showActionToast('Erro ao atualizar', 'error')
                });
            }
		}

		function showActionToast(title, status) {
	        
	        var toast = $mdToast.simple()
	            .content(title)
	            .highlightAction(false)
	            .position('top right')
	            .parent('md-mark-for-toast')
	            .theme(status+'-toast');
	        
	        $mdToast.show(toast);

	    }


	}

	angular.module('app')
		.directive('formClienteFull', function() {
		    return {
		  	    controller : formClienteController,
		  	    controllerAs : '_ctrl',
		        restrict: 'AE',
		        replace: 'true',
		        scope: {
		        	clienteSelected : '=?clienteSelected'
		        },
		        templateUrl: _templateBase + '/components/formCliente/formClienteFull.html',
		        link: function(scope, elem, attrs) { 
		        	scope.clienteSelected = [];
		        	scope._clienteSelected = [];
		        	scope.loadCliente('8635');
		        },

		    };
	  	})

	  angular.module('app')
		.directive('formClienteSimple', function() {
		    return {
		  	    controller : formClienteController,
		  	    controllerAs : '_ctrl',
		        restrict: 'AE',
		        replace: 'true',
		        scope: {
		        	clienteSelected : '=?clienteSelected'
		        	
		        },
		        templateUrl: _templateBase + '/components/formCliente/formClienteSimple.html',
		        link: function(scope, elem, attrs) { 
		        	scope.clienteSelected = [];
		        	scope._clienteSelected = [];
		        	//scope.loadCliente('8635');
		        },

		    };
	  	})
   