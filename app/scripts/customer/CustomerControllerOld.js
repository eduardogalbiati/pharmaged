/*
        function getAllCustomers() {
            ClientesActiveRecord.getCustomers().then(function (customers) {
                console.log(customers);
                $scope.clientes = [].concat(customers);
                $scope.selected = customers[0];

                $scope.clientesRepo = $scope.clientes.map( function (repo) {
                  repo.value = repo.nome.toLowerCase();
                  return repo;
                });
            });
        }

        getAllCustomers();

        */
        //$scope.setFocus = function(id){
          //  $timeout(function(){$document.getElementById(id).focus()},100)
        //};
        

        /*var self = this;
        
        $scope.selected = null;
        $scope.customers = [];
        $scope.selectedIndex = 0;
        $scope.filterText = null;
        $scope.selectCustomer = selectCustomer;
        $scope.deleteCustomer = deleteCustomer;
        $scope.saveCustomer = saveCustomer;
        $scope.createCustomer = createCustomer;
        $scope.filter = filterCustomer;
        
        // Load initial data
        getAllCustomers();
        
        //----------------------
        // Internal functions 
        //----------------------
        
        function selectCustomer(customer, index) {
            $scope.selected = angular.isNumber(customer) ? $scope.customers[customer] : customer;
            $scope.selectedIndex = angular.isNumber(customer) ? customer: index;
        }
        
        function deleteCustomer($event) {
            var confirm = $mdDialog.confirm()
                                   .title('Are you sure?')
                                   .content('Are you sure want to delete this customer?')
                                   .ok('Yes')
                                   .cancel('No')
                                   .targetEvent($event);
            
            
            $mdDialog.show(confirm).then(function () {
                customerService.destroy($scope.selected.customer_id).then(function (affectedRows) {
                    $scope.customers.splice($scope.selectedIndex, 1);
                });
            }, function () { });
        }
        
        function saveCustomer($event) {
            if ($scope.selected != null && $scope.selected.customer_id != null) {
                customerService.update($scope.selected).then(function (affectedRows) {
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Success')
                            .content('Data Updated Successfully!')
                            .ok('Ok')
                            .targetEvent($event)
                    );
                });
            }
            else {
                //$scope.selected.customer_id = new Date().getSeconds();
                customerService.create($scope.selected).then(function (affectedRows) {
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Success')
                            .content('Data Added Successfully!')
                            .ok('Ok')
                            .targetEvent($event)
                    );
                });
            }
        }
        
        function createCustomer() {
            $scope.selected = {};
            $scope.selectedIndex = null;
        }
        
        function getAllCustomers() {
            customerService.getCustomers().then(function (customers) {
                console.log(customers);
                $scope.customers = [].concat(customers);
                $scope.selected = customers[0];
            });
        }
        
        function filterCustomer() {
            if ($scope.filterText == null || $scope.filterText == "") {
                getAllCustomers();
            }
            else {
                customerService.getByName($scope.filterText).then(function (customers) {
                    $scope.customers = [].concat(customers);
                    $scope.selected = customers[0];
                });
            }
        }*/
      /*  function loadAll() {
      var repos = [
        {
          'name'      : 'Angular 1',
          'url'       : 'https://github.com/angular/angular.js',
          'watchers'  : '3,623',
          'forks'     : '16,175',
        },
        {
          'name'      : 'Angular 2',
          'url'       : 'https://github.com/angular/angular',
          'watchers'  : '469',
          'forks'     : '760',
        },
        {
          'name'      : 'Angular Material',
          'url'       : 'https://github.com/angular/material',
          'watchers'  : '727',
          'forks'     : '1,241',
        },
        {
          'name'      : 'Bower Material',
          'url'       : 'https://github.com/angular/bower-material',
          'watchers'  : '42',
          'forks'     : '84',
        },
        {
          'name'      : 'Material Start',
          'url'       : 'https://github.com/angular/material-start',
          'watchers'  : '81',
          'forks'     : '303',
        }
      ];
      return repos.map( function (repo) {
        repo.value = repo.name.toLowerCase();
        return repo;
      });
    }*/


      
/*
        $scope.uf = {};
        $scope.domUf = [
            {id: 54, nome: 'ACRE'},
            {id: 66, nome: 'ALAGOAS'},
            {id: 58, nome: 'AMAPÁ'},
            {id: 55, nome: 'AMAZONAS'},
            {id: 68, nome: 'BAHIA'},
            {id: 62, nome: 'CEARÁ'},
            {id: 79, nome: 'DISTRITO FEDERAL'},
            {id: 70, nome: 'ESPÍRITO SANTO'},
            {id: 78, nome: 'GOIÁS'},
            {id: 60, nome: 'MARANHÃO'},
            {id: 77, nome: 'MATO GROSSO'},
            {id: 76, nome: 'MATO GROSSO DO SUL'},
            {id: 69, nome: 'MINAS GERAIS'},
            {id: 80, nome: 'PAÍSES ESTRANGEIROS'},
            {id: 57, nome: 'PARÁ'},
            {id: 64, nome: 'PARAÍBA'},
            {id: 73, nome: 'PARANÁ'},
            {id: 65, nome: 'PERNAMBUCO'},
            {id: 61, nome: 'PIAUÍ'},
            {id: 71, nome: 'RIO DE JANEIRO'},
            {id: 63, nome: 'RIO GRANDE DO NORTE'},
            {id: 75, nome: 'RIO GRANDE DO SUL'},
            {id: 53, nome: 'RONDÔNIA'},
            {id: 56, nome: 'RORAIMA'},
            {id: 74, nome: 'SANTA CATARINA'},
            {id: 72, nome: 'SÃO PAULO'},
            {id: 67, nome: 'SERGIPE'},
            {id: 59, nome: 'TOCANTINS'},
            
        ]*/


       /*   $scope.repos = loadAll();
         $scope.nameSearch = [];
      $scope.nameSearch.simulateQuery = false;
      $scope.nameSearch.isDisabled    = false;
      $scope.nameSearch.repos         = $scope.clientesRepo;
      $scope.nameSearch.querySearch   = querySearch;
      $scope.nameSearch.selectedItemChange = selectedItemChange;
      $scope.nameSearch.searchTextChange   = searchTextChange;*/
      // *******************************/
      // Internal methods
      // ******************************
      /**
       * Search for repos... use $timeout to simulate
       * remote dataservice call.
       */
     /* function querySearch (query) {
        var results = query ? $scope.nameSearch.repos.filter( createFilterFor(query) ) : $scope.nameSearch.repos,
            deferred;
        if ($scope.nameSearch.simulateQuery) {
          deferred = $q.defer();
          $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
          return deferred.promise;
        } else {
          return results;
        }
      }
      function searchTextChange(text) {
        $log.info('Text changed to ' + text);
      }
      function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
      }*/
      /**
       * Build `components` list of key/value pairs
       */
     /* function loadAll() {
        var repos = getAllCustomers();
        //repos = $scope.clientes
        console.log($scope.clientes)
       
      }*/
      /**
       * Create filter function for a query string
       */
     /* function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
          return (item.value.indexOf(lowercaseQuery) === 0);
        };
      }*/