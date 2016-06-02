

angular.module('app')
	.controller('appContainer','$scope', 'VendasActiveRecord', 'ClientesActiveRecord', '$mdToast', 'appUtils', sideLastVendasController );


	function sideLastVendasController(appContainer, $scope, VendasActiveRecord, ClientesActiveRecord, $mdToast, appUtils) {
		var vm = this;
		vm.scope = $scope;

		vm.scope.lastVendas = [];

		vm.scope.construct = construct;
		vm.scope.loadLastVendas = loadLastVendas;
		vm.scope.selectVenda = selectVenda;
		vm.scope.createVendaRequest = createVendaRequest;


		function construct(){
			loadLastVendas();
			appContainer.setAction(vm.scope, 'venda', 'list');
			//vm.scope.appContainer.actions.venda.list =! vm.scope.appContainer.actions.venda.list

		}

      	function loadLastVendas() {
           VendasActiveRecord.getLast().then(function (data) {
                //Aplicar a tratativa de erros, estudar como manipular as promisses
                vm.scope.lastVendas = data;

            }).catch(function(err){
            	appUtils.showErrorDialog(err);
            });
        }

        function selectVenda(id){
        	VendasActiveRecord.getById(id).then(function (data){
                //Aplicar a tratativa de erros, estudar como manipular as promisses
        		appContainer.setAction(vm.scope, 'venda', 'select');
        		appContainer.setElement(vm.scope, 'venda', data[0]);
        		ClientesActiveRecord.getById(data[0].idCliente).then(function(dataCli){
        			appContainer.setElement(vm.scope, 'cliente', dataCli[0]);
        			appContainer.setAction(vm.scope, 'cliente', 'select');
        		}).catch(function(err){
            		appUtils.showErrorDialog(err);
            	});
        		//vm.scope.appContainer.actions.venda.select =! vm.scope.appContainer.actions.venda.select

            }).catch(function(err){
            	appUtils.showErrorDialog(err);
            });
        }

        function createVendaRequest(){
        		appContainer.setAction(vm.scope, 'venda', 'createRequest');
        }

        vm.scope.$watch(
        	function(){
        		return vm.scope.appContainer.actions.venda.create
        	}, 
            function(newValue) {
              if(newValue != false && newValue != undefined){
              		console.log('<side-last-vendas> disparo:venda.create acao:listVendas');
              		vm.scope.construct();

              		console.log('<side-last-vendas> disparo:venda.create acao:selectVendas');
              		vm.scope.selectVenda(vm.scope.appContainer.elements.venda.idVenda)

              }
            }
        );


	}


	  angular.module('app')
		.directive('sideLastVendas', function() {
		    return {
		  	    controller : sideLastVendasController,
		  	    controllerAs : '_ctrl',
		        restrict: 'AE',
		        replace: 'true',
		        scope: {
		        	appContainer : '=?appContainer'
		        },
		        templateUrl: _templateBase + '/components/sideLastVendas/sideLastVendasView.html',
		        link: function(scope, elem, attrs) { 
		        	scope.loadLastVendas()
		        },

		    };
	  	})
   