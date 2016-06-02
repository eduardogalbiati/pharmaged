

    angular.module('app')
        .controller('FileExplorerController', [
            'appContainer',
            '$scope',
            'ClientesActiveRecord',
            'FilesService',
            'appUtils',
            '$mdDialog',
            'PanZoomService',
            FileExplorerController
        ]);
    
    function FileExplorerController(appContainer, $scope, ClientesActiveRecord, FilesService, appUtils, $mdDialog, PanZoomService) {

        var vm = this;
        vm.scope = $scope;
        vm.scope.appUtils = appUtils;

        vm.scope.construct = construct;
        vm.scope.close = close;
        vm.scope.files = {
            'digitalizados': [],
            'legado' : [],
            'recentes': []
        }

        vm.scope.panzoomConfig = {
            zoomLevels: 15,
            neutralZoomLevel: 7,
            initialZoomLevel:4,
            scalePerZoomLevel: 2,
            useHardwareAcceleration: true,
            invertMouseWheel: true,
            initialPanX:4.37,
            initialPanY: 11.55
        };
        vm.scope.panzoomModel = {};

        function construct(){
            //var idCliente = appContainer.getElement('cliente').idCliente;
            var idCliente = '1';
            loadFilesDigitalizados();
            loadFilesRecentes(idCliente);
            loadFilesLegado(idCliente);
        }

        function close(){
            $mdDialog.hide();
           // console.log(vm.scope.panzoomModel);
        }

        function loadFilesDigitalizados(){
            FilesService.getFilesDigitalizados().then(function (data) {
                vm.scope.files.digitalizados = data;
            });

        }

        function loadFilesRecentes(idCliente) {
            ClientesActiveRecord.getFilesForClienteRecentes(idCliente).then(function (data) {
                //aplicar a tratativa de erros, no promisse
                vm.scope.files.recentes = data;
            }).catch(function(err){
                appUtils.showErrorDialog(err)
            });
        }

        function loadFilesLegado(idCliente) {
             ClientesActiveRecord.getFilesForClienteLegado(idCliente).then(function (data) {
                //aplicar a tratativa de erros, no promisse
                vm.scope.files.legado = data;
            }).catch(function(err){
                appUtils.showErrorDialog(err)
            });
        }

    }


     angular.module('app')
         .directive('fileExplorer', function() {
            return {
                controller: FileExplorerController,
                controllerAs: '_ctrl', 
                restrict: 'AE',
                scope: {
                    appContainer : '=?appContainer'
                },
                templateUrl:  _templateBase + '/components/fileExplorer/fileExplorerView.html',
                link: function(scope, elem, attrs) {
                  
                    scope.construct();
                }
            };
        });
