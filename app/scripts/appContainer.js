  
    angular.module('app')
        .service('appContainer', ['$q', appContainerService]);
    
    function appContainerService($q) {
        return {
            define: define,
            setAction:setAction,
            setElement:setElement,
            getElement:getElement,
            getAction:getAction
        };

        function define(scope, options){
            scope.appContainer = options;
        }

        function setAction(scope, module, action)
        {
            scope.appContainer.actions[module][action] = ! scope.appContainer.actions[module][action]
        }

        function setElement(scope, element, value)
        {
            scope.appContainer.elements[element] = value;
        }

        function getElement(scope, element){
            return scope.appContainer.elements[element];
        }

        function getAction(scope, module, action){
            return scope.appContainer.actions[module][action];
        }

    }

