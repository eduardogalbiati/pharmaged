   
    angular.module('app')
        .service('appUtils', ['$timeout', '$mdDialog', appUtils]);
    
    function appUtils($timeout, $mdDialog) {
        return {
            //getCustomers: getCustomers,
            setFocusTime: setFocusTime,
            setValue: setValue,
            getValue: getValue,
            setFocus: setFocus,
            getYear: getYear,
            getDataHora: getDataHora,
            getData: getData,
            arrumaData: arrumaData,
            trataNome: trataNome,
            showErrorDialog: showErrorDialog

            //loadImage: loadImage
            //getByName: getCustomerByName,
            //create: createCustomer,
            //destroy: deleteCustomer,
            //update: updateCustomer
        };

        function setFocusTime(idElemento) {
             $timeout(function(){angular.element( document.querySelector( '#'+idElemento ) ).focus();},200)
        }

        function setValue(idElemento, value) {
             angular.element( document.querySelector( '#'+idElemento ) ).val(value);
        }

        function getValue(idElemento) {
             return angular.element( document.querySelector( '#'+idElemento ) ).val();
        }

        function setFocus(idElemento){
             angular.element( document.querySelector( '#'+idElemento ) ).focus()
        }

        function getYear() {
            var td = new Date();
            var today = td.getFullYear();
            return today
        }

        function getDataHora() {
            var td = new Date();
            var today = td.getFullYear()+'-'+(td.getMonth()+1)+'-'+td.getDate()+' '+td.getHours()+':'+td.getMinutes()+':'+td.getSeconds();
            return today
        }

        function getData() {
            var td = new Date();
            var today = td.getFullYear()+'-'+(td.getMonth()+1)+'-'+td.getDate();
            return today
        }

        function arrumaData(date) {
            return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        }

        function trataNome(str){
            str_acento = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
            str_sem_acento = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
            var nova = "";
            for (var i = 0; i < str.length; i++) {
                if (str_acento.indexOf(str.charAt(i)) != -1) {
                    nova += str_sem_acento.substr(str_acento.search(str.substr(i, 1)), 1);
                } else {
                    nova += str.substr(i, 1);
                }
            }
            nova = nova.toUpperCase();
            return nova;
        }

        function showErrorDialog(err) {
            var dialog = $mdDialog;

            var customTemplate =  '<md-dialog style="max-width:30%;" flex>' +
                                  '  <md-dialog-content class="md-padding open-file-dialog">' +
                                  '   Erro ao processar a requisição<br> ' +
                                  ' <h4>'+err+'</h4>' +
                                  '    </md-dialog-content>' +
                                  '  <md-dialog-actions>' +
                                  '    <md-button ng-click="closeDialog();" class="md-primary">' +
                                  '     FECHAR' +
                                  '    </md-button>' +
                                  '  </md-dialog-actions>' +
                                  '</md-dialog>';
               dialog.show({
                      clickOutsideToClose: true,
                      template: customTemplate,
                      controller: function DialogController($scope, $mdDialog) {
                        $scope.closeDialog = function() {
                          $mdDialog.hide();
                        }
                      }
                   });

        }


    }

/*

 <div search-cliente cliente-selected="cliente" refresh-listener="refreshList"></div>
      <div new-cliente sonar-to="refreshList" cliente-selected="cliente"></div>

 */