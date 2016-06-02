 angular.module('app')
        .service('EntitiesRepository', ['$q', EntitiesRepository]);
    
    function EntitiesRepository($q) {
        return {
            //getCustomers: getCustomers,
            getEntity: getEntity
            //loadImage: loadImage
            //getByName: getCustomerByName,
            //create: createCustomer,
            //destroy: deleteCustomer,
            //update: updateCustomer
        };

        function getEntity(entityName){
            if(entityName == 'vendas'){
                return getEntityVendas();
            }

        }

        function getEntityVendas(){
            var out = {
                
            }
            return 
        }
    }
        
       