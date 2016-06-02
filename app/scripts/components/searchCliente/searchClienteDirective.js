

angular.module('app')
	.controller('searchClienteController', '$scope', 'ClientesActiveRecord', '$mdToast', 'appUtils', '$q', searchClienteController );


	function searchClienteController($scope, ClientesActiveRecord, $mdToast, appUtils, $q) {
		var vm = this;
		vm.scope = $scope;

		vm.scope.searchTextChange = searchTextChange
		vm.scope.selectedItemChange = selectedItemChange
		vm.scope.createFilterFor = createFilterFor
		vm.scope.querySearch = querySearch
		vm.scope.loadClientes = loadClientes
		vm.scope.clientesForSearch = [];



		function selectCliente(idCliente) {
            ClientesActiveRecord.getClienteById(idCliente).then(function (data) {
                //Aplicar a tratativa de erros, estudar como manipular as promisses
                vm.scope.clienteSelected = data[0];
                vm.scope._clienteSelected = angular.copy(vm.scope.clienteSelected);
               
            });
        }

		function loadClientes() {
			ClientesActiveRecord.getClientesForSearchWithoutCpf().then(function (data, err) {

	                  //Aplicar a tratativa de erros, estudar como manipular as promisses
                if(vm.scope.somenteNome == true){
                	vm.scope.clientesForSearch = data.map( function (state) {
	                    return {
	                        value: state.nomeCliente.toLowerCase()+' '+state.cpf,
	                        display: state.nomeCliente,
	                        idCliente: state.idCliente
	                    };
	                });
                }else{
	                vm.scope.clientesForSearch = data.map( function (state) {
	                    return {
	                        value: state.nomeCliente.toLowerCase()+' '+state.cpf,
	                        display: state.nomeCliente+' - '+state.cpf,
	                        idCliente: state.idCliente
	                    };
	                });
	            }
	                 
	        }).catch(function (err){
	              vm.scope.showErrorDialog(err);
	        });
		}

        function querySearch (query) {
        	console.log('query')
          var  deferred;
            deferred = $q.defer();
              var results = query ? vm.scope.clientesForSearch.filter( createFilterFor(query) ) : vm.scope.clientesForSearch
              deferred.resolve( results ); 
            return deferred.promise;
          
        }

		function searchTextChange(text) {
          //$log.info('Text changed to ' + text);
        }
        function selectedItemChange(item) {
        	console.log('Item changed to ' + JSON.stringify(item));

        	if(vm.scope.somenteNome != true){
				if(item !== undefined){
					selectCliente(item.idCliente);
					appUtils.setValue('acForSearch', '');
					appUtils.setFocus('hiddenToSkip');
					//vm.scope.ctrl.searchText = '';
				}
			}else{
				if(item !== undefined){
					selectCliente(item.idCliente);
					appUtils.setFocus('telefone1');
					//vm.scope.ctrl.searchText = '';
				}
				appUtils.setFocus('telefone1');
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

	angular.module('app')
		.directive('searchCliente', function() {
		    return {
		  	    controller : searchClienteController,
		  	    controllerAs : 'ctrl',
		        restrict: 'AE',
		        replace: 'true',
		        scope: {
		        	clienteSelected : '=?clienteSelected',
		        	refreshListener : '=?refreshListener',
		        	somenteNome : '?=somenteNome'
		        },
		        templateUrl: _templateBase + '/components/searchCliente/searchClienteView.html',
		        link: function(scope, elem, attrs) { 
		        	console.log(scope.refreshListener);
		        	scope.$watch(
		        	 	function(){
		        	 		return scope.refreshListener
		        	 	}, 
		        	 	function(newValue) {
		                	scope.loadClientes();
					 	}
					);
		        	
		        },

		    };
	  	})



	  angular.module('app')
		.directive('searchClienteForm', function() {
		    return {
		  	    controller : searchClienteController,
		  	    controllerAs : 'ctrl',
		        restrict: 'AE',
		        replace: 'true',
		        scope: {
		        	clienteSelected : '=?clienteSelected',
		        	refreshListener : '=?refreshListener',
		        	somenteNome : '=somenteNome'
		        },
		        templateUrl: _templateBase + '/components/searchCliente/searchClienteFormView.html',
		        link: function(scope, elem, attrs) { 
		        	console.log(scope.refreshListener);
		        	scope.$watch(
		        	 	function(){
		        	 		return scope.refreshListener
		        	 	}, 
		        	 	function(newValue) {
		                	scope.loadClientes();
					 	}
					);
		        	
		        },

		    };
	  	})

   