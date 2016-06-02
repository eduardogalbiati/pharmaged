(function () {
    'use strict';

    angular.module('app')
        .controller('ClientesController', [
            'ClientesActiveRecord',
            'PdfReporService',
            'FilesService',
            '$q',
            '$scope',
            '$log',
            '$timeout',
            '$mdToast',
            'toaster',
            '$mdDialog',
            'PanZoomService',
            '$mdSidenav',
            ClientesController
        ]);
    
    function ClientesController(ClientesActiveRecord, PdfReporService, FilesService, $q, $scope, $log, $timeout, $mdToast, toaster, $mdDialog, PanZoomService, $mdSidenav) {


        $scope.sideNavClose = function () {
          $mdSidenav('left').close()
        }

         $scope.sideNavOpen = function () {
          $mdSidenav('left').open()
        }
        $scope.getYear = function() {
          var td = new Date();
          var today = td.getFullYear();
          return today

        }
        $scope.getDataHora = function() {
          var td = new Date();
          var today = td.getFullYear()+'-'+(td.getMonth()+1)+'-'+td.getDate()+' '+td.getHours()+':'+td.getMinutes()+':'+td.getSeconds();
          return today

        }
        $scope.getData = function() {
          var td = new Date();
          var today = td.getFullYear()+'-'+(td.getMonth()+1)+'-'+td.getDate();
          return today

        }

        $scope.arrumaData = function(date) {
          return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        }
      
        $scope.panzoomConfig = {
            zoomLevels: 12,
            neutralZoomLevel: 0,
            scalePerZoomLevel: 1.5,
            useHardwareAcceleration: true,
            invertMouseWheel: true,
            zoomToFit: true
        };
        $scope.panzoomModel = {};

        $scope.fileFilter = [];
        $scope.fileFilter.dataDe = '';
        $scope.fileFilter.dataAte = '';

        // The panzoom model should initialle be empty; it is initialized by the <panzoom>
        // directive. It can be used to read the current state of pan and zoom. Also, it will
        // contain methods for manipulating this state.
        $scope.clientes
        $scope.clientesForSearch = [];
        $scope.clienteSelected = false;
        $scope._clienteSelected = false;
        $scope.count = 0;
        $scope.tmpFile = '';
        $scope.clientesArquivos = [];
        $scope.clientesCupons = [];
        $scope.fab = [];
        $scope.fab.primaryIcon = 'add';
        $scope.fab.isOpen = false
        $scope.fab.primaryColor = 'rgb(255, 64, 129);'
        $scope.fabReport = [];
        $scope.fabReport.primaryIcon = 'add';
        $scope.fabReport.isOpen = false
        $scope.fabReport.primaryColor = 'rgb(255, 64, 129);'

        $scope.uploadCupom = {
          'numeroCupom' : '',
          'dataCupom' : new Date()
        }

        $scope.fileColors = []
        $scope.imgToOpen = false
        $scope.cupomToOpen = false
        $scope.folderToExploreFilter = '';
        $scope.filesInFolder = [];
        $scope.configFile = [];
        $scope.imgRotate = 0;
        $scope.cupomRotate = 0;


    $scope.keyPressed = function(e) {
          //binding esc key
		  /*
        if(e.keyCode  == 112){

            $scope.showSearch = true;
            $timeout(function(){ $scope.setFocusAC()}) 
         }

         if(e.keyCode  == 27){
          $scope.showSearch = false;
            //$scope.setDomFocus
         }
         if(e.keyCode  == 192){
           e.preventDefault();
            $scope.openNovoClienteDialog();
         }*/
        };
		
    
        $scope.getConfigFile = function() {
            FilesService.getConfigFile().then(function (data) {
                $scope.configFile = JSON.parse(data);
            }).catch(function(err){
                $scope.showErrorDialog(err);
            });
        }

        $scope.getConfigFile();

        $scope.refreshFilesInFolder = function () {
              FilesService.getFilesForFolder($scope.configFile.desktopFolder).then(function (data) {
                $scope.filesInFolder = data;
            });
        }


        $scope.selectCliente = function (idCliente) {
            ClientesActiveRecord.getClienteById(idCliente).then(function (data) {
                //Aplicar a tratativa de erros, estudar como manipular as promisses
                $scope.imgToOpen = false;
                $scope.cupomToOpen = false;
                $scope.clienteSelected = data[0];
                $scope._clienteSelected = angular.copy($scope.clienteSelected);
                $scope.loadFilesForCliente(data[0].idCliente);
                $scope.loadCuponsForCliente(data[0].idCliente);
                //acForSearch .val()
                $scope.showSearch = false;
                $scope.setDomFocus('nomeCliente');
            });
        }

        $scope.showErrorDialog = function(err) {
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
                  scope: $scope,        // use parent scope in template
                  preserveScope: true,  // do not forget this if use parent scope
                  template: customTemplate,
                  controller: function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = function() {
                      $mdDialog.hide();
                    }
                  }
               });

        }

        $scope.loadClientesForSearch = function () {

            ClientesActiveRecord.getClientesForSearch().then(function (data, err) {
                  //Aplicar a tratativa de erros, estudar como manipular as promisses
                 $scope.clientesForSearch = data.map( function (state) {
                      return {
                        value: state.nomeCliente.toLowerCase()+' '+state.cpf,
                        display: state.nomeCliente+' - '+state.cpf,
                        idCliente: state.idCliente
                      };
                    });
                   
            }).catch(function (err){
                  $scope.showErrorDialog(err);
            });
        }

        $scope.checkIfHaveToLoad = function (index) {
          if($scope.clienteSelected[index] != $scope._clienteSelected[index]){
                    $timeout(function(){$scope.loadClientesForSearch();},2000)

            
          }
        }

        $scope.loadFilesForCliente = function (idCliente) {
            ClientesActiveRecord.getFilesForCliente(idCliente).then(function (data) {
                //aplicar a tratativa de erros, no promisse
                $scope.clientesArquivos = data;
            });
        }

        $scope.loadCuponsForCliente = function (idCliente) {
            ClientesActiveRecord.getCuponsForCliente(idCliente).then(function (data) {
                //aplicar a tratativa de erros, no promisse
                $scope.clientesCupons = data;
            });
        }

        $scope.selecionaCliente = function selecionaCliente(item) {
            $scope.selectCliente(item.idCliente)
        }

        $scope.update = function update(field) {

            if($scope._clienteSelected[field] != $scope.clienteSelected[field]){
                ClientesActiveRecord.updateClientesField($scope.clienteSelected.idCliente, field, $scope.clienteSelected[field], $scope._clienteSelected[field] ).then(function (data) {
                    //realizar a tratativa da promisse
                    $scope.showActionToast('Campo Atualizado');
                    $scope._clienteSelected = angular.copy($scope.clienteSelected);
                });
            }
        }

         var last = {
              bottom: false,
              top: true,
              left: false,
              right: true
        };
        $scope.toastPosition = angular.extend({},last);
        $scope.getToastPosition = function() {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
                  .filter(function(pos) { return $scope.toastPosition[pos]; })
                  .join(' ');
        };
        function sanitizePosition() {
            var current = $scope.toastPosition;
            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;
            last = angular.extend({},current);
        }


        $scope.showActionToast = function(title) {
            

            var toast = $mdToast.simple()
                  .content(title)
                  .highlightAction(false)
                  .position('top right')
                  .parent('md-mark-for-toast')
                  .theme('success-toast');
            
           // toast.
            $mdToast.show(toast).then(function(response) {
              if ( response == 'ok' ) {
                alert('You clicked \'OK\'.');
              }
            });

            
     
          };

        
           $scope.showUploadToast = function() {
            

            var toast = $mdToast.simple()
                  .content('Imagem Adicionada')
                  .highlightAction(false)
                  .position('top right')
                  .parent('md-mark-for-toast')
                  .theme('success-toast');
            
           // toast.
            $mdToast.show(toast).then(function(response) {
              if ( response == 'ok' ) {
                alert('You clicked \'OK\'.');
              }
            });

            
             //toaster.pop('success', "Alteração salva", "");
          };

         $scope.loadImage = function (imageFile) {
            $scope.count = $scope.count +1;

            var retorno = ''
            $scope.imageFile=imageFile;
            ClientesActiveRecord.loadImage(imageFile).then(function (data) {
                //aplicar a tratativa de erros, no promisse
                $scope.teste = data
                retorno = data
            });
            return retorno;

        }

        $scope.convertImageObjectIntoText = function(object){
          var out = '<table>' +
                      '<tr>' +
                        '<td>' +
                          '<label class="list-label">Nome do Arquivo:</label><br>' + 
                          '<label class="list-value">'+object.nomeArquivo+'</label>' + 
                        '</td>' +
                      '</tr>' +
                      '<tr>' +
                        '<td>' +
                          '<label class="list-label">Local:</label><br>' + 
                          '<label class="list-value">'+object.caminho+'</label>' + 
                        '</td>' +
                      '</tr>' +
                      '<tr>' +
                        '<td>' +
                          '<label class="list-label">Data Upload:</label><br>' + 
                          '<label class="list-value">'+$scope.arrumaData(object.dataUpload)+'</label>' + 
                        '</td>' +
                      '</tr>' +
                    '</table>';
          if(object.dataCupom != undefined){
            out +=  '<hr>' +
                    '<table>' +
                      '<tr>' +
                        '<td>' +
                          '<label class="list-label">Data Cupom:</label><br>' + 
                          '<label class="list-value">'+$scope.arrumaData(object.dataCupom)+'</label>' + 
                        '</td>' +
                      '</tr>' +
                       '<tr>' +
                        '<td>' +
                          '<label class="list-label">Número Cupom:</label><br>' + 
                          '<label class="list-value">'+(object.numeroCupom)+'</label>' + 
                        '</td>' +
                      '</tr>' +
                      '</table>';
          }
          return out;
        }

        $scope.openDialogImage = function(image) {
           $mdDialog.show({
                  clickOutsideToClose: true,
                  scope: $scope,        // use parent scope in template
                  preserveScope: true,  // do not forget this if use parent scope
                  // Since GreetingController is instantiated with ControllerAs syntax
                  // AND we are passing the parent '$scope' to the dialog, we MUST
                  // use 'vm.<xxx>' in the template markup
                  template: '<md-dialog  style="max-width:80%;" flex>' +
                            '  <md-dialog-actions>' +
                            '    <md-button ng-click="closeDialog()" class="md-primary">' +
                            '      Fechar' +
                            '    </md-button>' +
                            '  </md-dialog-actions>' +
                            '  <md-dialog-content>'+
                            '    <center>' +
                            '     <div layout="row">' +
                            '      <panzoom id="imageDialogPan" config="panzoomConfig" model="panzoomModel" style="width:100%; height: 500px; " flex>' +
                            '        <img src="'+image.imagemVirtual+'"/>' +
                            '      </panzoom>' +
                            '      <div class="image-info" flex="30">' +
                            '         <h3>Detalhes</h3> '+
                            $scope.convertImageObjectIntoText(image) +
                            '       </div>' +
                            '     </div>' +
                            '     </center>' +
                            '  </md-dialog-content>' +

                            '</md-dialog>',
                  controller: function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = function() {
                      $mdDialog.hide();
                    }
                  }
               });
        }
        $scope.openImage = function (image)
        {
          $scope.imgRotate = 0;
          $scope.imgToOpen = image;
        }

        $scope.openCupom = function (item)
        {
          $scope.cupomRotate = 0;
          $scope.cupomToOpen = item;
        }
        

        $scope.isOpen = false;
        $scope.tooltipVisible = false;
        $scope.$watch('fab.isOpen', function() {
        if ($scope.isOpen) {
          $timeout(function() {
            $scope.tooltipVisible = $scope.isOpen;
          }, 600);
        } else {
          $scope.tooltipVisible = $scope.isOpen;
        }
      });

        $scope.loadClientesForSearch();
        //$scope.selectCliente(8635);
        //$scope.loadFilesForCliente(1);
        $scope.refreshFilesInFolder();

        //Md-AutoComplete
        $scope.ctrl = [];
        $scope.ctrl.simulateQuery = false;
        $scope.ctrl.isDisabled    = false;
        $scope.ctrl.querySearch   = querySearch;
        $scope.ctrl.selectedItemChange = selectedItemChange;
        $scope.ctrl.searchTextChange   = searchTextChange;

        function querySearch (query) {
          var  deferred;
            deferred = $q.defer();
              var results = query ? $scope.clientesForSearch.filter( createFilterFor(query) ) : $scope.clientesForSearch
              deferred.resolve( results ); 
            return deferred.promise;
          
        }
        function searchTextChange(text) {
          //$log.info('Text changed to ' + text);
        }
        function selectedItemChange(item) {
          if(item !== undefined){
            //$log.info('Item changed to ' + JSON.stringify(item));
            $scope.selectCliente(item.idCliente);
            $scope.setDomValue('acForSearch', '');
			      $scope.ctrl.searchText = '';
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

        $scope.setDomFocus = function(idElemento) {
             $timeout(function(){angular.element( document.querySelector( '#'+idElemento ) ).focus();},200)
        }

        $scope.setDomValue = function(idElemento, value) {
             angular.element( document.querySelector( '#'+idElemento ) ).val(value);
        }
        $scope.setFocusAC = function(){
             angular.element( document.querySelector( '#acForSearch' ) ).focus()
        }

        $scope.setFocus = function(idElemento){
             angular.element( document.querySelector( '#'+idElemento ) ).focus()
        }

        $scope.showSearchFunction = function(){
            $scope.showSearch = !$scope.showSearch;
            $timeout(function(){$scope.setFocusAC();},100)

            
        }

        $scope.showFab = function() {
            $scope.fab.isOpen = true;
            $scope.fab.primaryIcon = 'person_add';
            $scope.fab.primaryColor = '#42bd41'

        }
        $scope.showFabReport = function() {
            $scope.fabReport.isOpen = true;
            $scope.fabReport.primaryIcon = 'image';
            $scope.fabReport.primaryColor = '#42bd41'

        }

        $scope.hideFab = function() {
            $scope.fab.primaryColor = 'rgb(255, 64, 129);'
            $scope.fab.isOpen = false;
            $scope.fab.primaryIcon = 'add';

        }
        $scope.hideFabReport = function() {
            $scope.fabReport.primaryColor = 'rgb(255, 64, 129);'
            $scope.fabReport.isOpen = false;
            $scope.fabReport.primaryIcon = 'add';

        }


    $scope.uploadFile = function(folder, file, tipoUpload) {
        var idCliente = $scope.clienteSelected.idCliente;
        var nomeCliente = $scope.clienteSelected.nomeCliente;
        if(tipoUpload == 'documento'){
         ClientesActiveRecord.addFileForCliente(idCliente, nomeCliente, folder, file, true).then(function (data) {
            //aplicar a tratativa de promisse
            $scope.showUploadToast();
            $scope.dialogConfirmationOpened = false;
            $timeout(function () { $scope.loadFilesForCliente(idCliente); }, 300);

            
         }).catch(function(err){
            $scope.showErrorDialog(err);
         });
       }
       if(tipoUpload == 'cupom'){
        var formData = {
          'dataCupom' : $scope.uploadCupom.dataCupom,
          'numeroCupom' : $scope.uploadCupom.numeroCupom
        }
         ClientesActiveRecord.addCupomForCliente(idCliente, nomeCliente, folder, file, true, formData).then(function (data) {
            //aplicar a tratativa de promisse
            $scope.showUploadToast();
            $scope.dialogConfirmationOpened = false;
            $timeout(function () { $scope.loadCuponsForCliente(idCliente); }, 100);

            
         }).catch(function(err){
            $scope.showErrorDialog(err);
         });;
       }


    }
    $scope.dialogConfirmationOpened = false;

     $scope.openUploadConfirmation = function(folder, file, tipoUpload) {
      $scope.uploadCupom.numeroCupom = '';
      if($scope.dialogConfirmationOpened == false){

          $scope.dialogConfirmationOpened = true;
          var dialog = $mdDialog;
          var customTemplate = '<md-dialog style="max-width:50%;" flex>' +
                              '  <md-dialog-content layout="column" class="md-padding open-file-dialog">' +
                                  '<div layout="row" style="margin-top:15px;text-allign:center;">';
          if(tipoUpload == 'cupom'){
                customTemplate += '<div flex="66">';
          }else{
                customTemplate += '<div flex>';
          }
                customTemplate +=   '<center>' +
                                      '<img alt="'+folder+'/'+file+'" src="'+folder+'/'+file+'" style="width:300px;" />' +
                                    '</center>'+
                                    '</div>';
          if(tipoUpload == 'cupom'){
                  customTemplate += '<div flex="33">' +
                                      '<md-input-container class="md-block" flex>' +
                                          '<label>Data do Cupom</label>' +
                                          '<input next-on-enter="numeroCupom" id="dataDoCupom" name="dataDoCupom" ng-model="uploadCupom.dataCupom" type="date">' +
                                      '</md-input-container><br>' +
                                      '<md-input-container class="md-block" flex>' +
                                          '<label>Número do Cupom</label>' +
                                          '<input next-on-enter="okVincular"  id="numeroCupom" name="numeroCupom" ng-model="uploadCupom.numeroCupom" type="text">' +
                                      '</md-input-container>' +
                                    '</div>';
          }
           customTemplate +=      '</div>' +
                                  '<div style="margin-top:15px;">' +
                                    'Vincular com <span style="font-weight:bold;"> ' +$scope.clienteSelected.nomeCliente +'</span>' +
                                  '</div>' +
                                 '</md-dialog-content>' +
                                 '<md-dialog-actions>' +
                                 '  <md-button ng-click="closeDialog();openFileDialog();" class="md-primary">' +
                                 '    Voltar' +
                                 '  </md-button>' +
                                 '  <md-button id="okVincular" ng-click="uploadFile(\''+folder+'\',\''+file+'\', \''+tipoUpload+'\');closeDialog();" class="md-primary">' +
                                 '     OK! Vincular' +
                                 '  </md-button>' +
                                 '</md-dialog-actions>' +
                                '</md-dialog>';
             dialog.show({
                    clickOutsideToClose: true,
                    scope: $scope,        // use parent scope in template
                    preserveScope: true,  // do not forget this if use parent scope
                    focusOnOpen:false,       // use parent scope in template
                    template: customTemplate,
                    controller: function DialogController($scope, $mdDialog) {
                      $scope.closeDialog = function() {
                        $mdDialog.hide();
                        $scope.dialogConfirmationOpened = false;
                      }
                    },
                    onComplete: function setFocusDialog(){
                      if(tipoUpload == 'cupom'){
                         $scope.setDomFocus('dataDoCupom');
                      }else{
                         $scope.setDomFocus('okVincular');
                      }
                    }

                 })
          }
    }


    $scope.openFileDialog = function(tipoUpload) {
        var folder = $scope.configFile.desktopFolder;
        $scope.refreshFilesInFolder();
            
            var customTemplate = '<md-dialog flex="percentage" >' +
                          '  <md-dialog-actions>' +
                          '    <md-button ng-click="closeDialog()" class="md-primary">' +
                          '      Fechar' +
                          '    </md-button>' +
                          '  </md-dialog-actions>' +
                          '  <md-dialog-content class="md-padding open-file-dialog">' +
                          '     <form name="userForm" class="padding-medium">' +
                          '       <md-input-container class="md-block" flex>' +
                          '        <label>Buscar</label>' +
                          '        <input ng-model="folderToExploreFilter" type="text" id="fileDialogBuscar">' +
                          '      </md-input-container>' +
                          '    ' +
                          '    <md-grid-list class="file-grid-list"' +
                          '     md-cols-sm="1" md-cols-md="2" md-cols-gt-md="6"' +
                          '     md-row-height-gt-md="1:1" md-row-height="2:2"' +
                          '     md-gutter="12px" md-gutter-gt-sm="8px" >';


                customTemplate += '<md-grid-tile dir-paginate="file in filesInFolder | itemsPerPage:20  | filter: {value:folderToExploreFilter}" class="{{fileColors[file.id]}}" ng-mouseenter="fileColors[file.id] = \'title-active\'" ng-mouseleave="fileColors[file.id] = \'title-inactive\'" ng-init="fileColors[file.id] = \'title-inactive\'" ng-click="openUploadConfirmation(\''+$scope.configFile.desktopFolder+'\',file.value, \''+tipoUpload+'\')" style="cursor:pointer;" pagination-id="curvaAbc">' +
                                    '<img alt="{{file.value}}" src="{{configFile.desktopFolder}}/{{file.value}}" class="cover" />' +
                                      '<md-grid-tile-footer>' +
                                      '<h3>{{file.value}}</h3>' +
                                    '</md-grid-tile-footer>' +
                                  '</md-grid-tile>';
               
            customTemplate += '    </md-grid-list>';
            customTemplate += '<br><center><dir-pagination-controls pagination-id="curvaAbc">    </mdir-pagination-controls></center>' +
                          '  </form></md-dialog-content>' +
                          '</md-dialog>';
             $mdDialog.show({
                clickOutsideToClose: true,
                focusOnOpen: false,
                scope: $scope,        // use parent scope in template
                preserveScope: true,  // do not forget this if use parent scope
                // Since GreetingController is instantiated with ControllerAs syntax
                // AND we are passing the parent '$scope' to the dialog, we MUST
                // use 'vm.<xxx>' in the template markup
                template: customTemplate,
                controller: function DialogController($scope, $mdDialog) {
                  $scope.closeDialog = function() {
                    $mdDialog.hide();
                  }
                }
             });

      $scope.setDomFocus('fileDialogBuscar')


    }


    
    $scope.newClienteModal = [];

    $scope.initNewClienteModal = function (){
        $scope.newClienteModal.cpf = '';
        $scope.newClienteModal.nomeCliente = '';
        $scope.newClienteModal.approved = false;
        $scope.newClienteModal.openApproved = false;
        $scope.newClienteModal.icon = 'keyboard_control';
        $scope.newClienteModal.idCliente ='';
    }

    $scope.initNewClienteModal();

    $scope.consultaCpf = function() {
      if($scope.newClienteModal.cpf != ''){
        ClientesActiveRecord.getClienteByCpf($scope.newClienteModal.cpf).then(function (data) {
            //Aplicar a tratativa de erros, estudar como manipular as promisses
            if(data.length == 0){
              $scope.newClienteModal.approved = true;
              $scope.newClienteModal.openApproved = false;
              $scope.newClienteModal.icon = 'note_add';
              $scope.newClienteModal.nomeCliente = '';
              $scope.newClienteModal.idCliente ='';

            }else{
              $scope.newClienteModal.nomeCliente = data[0].nomeCliente;
              $scope.newClienteModal.idCliente = data[0].idCliente;
              $scope.newClienteModal.approved = false;
              $scope.newClienteModal.openApproved = true;
              $scope.newClienteModal.icon = 'perm_contact_cal';

            }

        });
      }else{
          $scope.initNewClienteModal();
      }
    }

    $scope.newClienteModalDisabled = function() {
      if($scope.newClienteModal.approved == true && $scope.newClienteModal.nomeCliente != '' && $scope.newClienteModal.cpf != ''){
          return false;
      }
      return true;
    }

    $scope.addNovoCliente = function() {
      if($scope.newClienteModal.approved == true){
        var cliente = {
          nomeCliente : $scope.newClienteModal.nomeCliente,
          cpf: $scope.newClienteModal.cpf,
		  dataHoraCadastro: $scope.getDataHora()
        }
        ClientesActiveRecord.create(cliente).then(function (data) {
            //Aplicar a tratativa de erros, estudar como manipular as promisses
            $scope.loadClientesForSearch();
            $scope.selectCliente(data);
            $scope.initNewClienteModal();

        });
		$scope.closeDialog();
      }

    }
	
	$scope.hitEnterOnName = function(){
		if(!$scope.newClienteModal.openApproved){
			$scope.addNovoCliente();
		}else{
			$scope.selectModalCliente();
		}
	}

    $scope.selectModalCliente = function() {
      $scope.selectCliente($scope.newClienteModal.idCliente);
	  $scope.closeDialog();
    }


    $scope.openNovoClienteDialog = function() {
         var dialog = $mdDialog;
             $scope.initNewClienteModal();
        if(!isNaN(parseFloat( $scope.ctrl.searchText)) && isFinite( $scope.ctrl.searchText)){
            $scope.newClienteModal.cpf = $scope.ctrl.searchText
        }else{
            $scope.newClienteModal.nomeCliente = $scope.ctrl.searchText
        }

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
                  scope: $scope, 
                  focusOnOpen:false,       // use parent scope in template
                  preserveScope: true,  // do not forget this if use parent scope
                  template: customTemplate,
                  controller: function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = function() {
                      $mdDialog.hide();
                    }
                  },
                  onComplete: function onCompleteF(){
                    $scope.setDomFocus('newClienteModalCpf')
                  }
               });


    }

     $scope.openLancaVendaDialog = function() {
         var dialog = $mdDialog;

        var customTemplate =  '<md-dialog style="max-width:30%;" flex>' +
                              '  <md-dialog-content class="md-padding open-file-dialog">' +
                              '   Confirma o lançamento de uma venda para o cliente<br> ' +
                              ' <h4>'+$scope.clienteSelected.nomeCliente+'</h4>' +
                              '    </md-dialog-content>' +
                              '  <md-dialog-actions>' +
                              '    <md-button ng-click="closeDialog();" class="md-primary">' +
                              '     VOLTAR' +
                              '    </md-button>' +
                               '    <md-button  ng-click="closeDialog();lancaVenda()" class="md-primary">' +
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
                  }
               });
    }

    $scope.lancaVenda = function() {
      var venda = {
        dataHoraVenda :$scope.getDataHora(),
        idCliente: $scope.clienteSelected.idCliente
      }
      VendasActiveRecord.create(venda).then(function(data){
        //Aplicar a validação de promisse
        $scope.showActionToast('Venda Lançada');  
      })
      
    }

    $scope.reportFiles = [];

    $scope.addToReport = function(element, arraySource){

      var item = [];
      if(arraySource == 'clientesArquivos'){
          //item = $scope.clientesArquivos[index];
          for (var x in $scope.clientesArquivos){
            if($scope.clientesArquivos[x].idArquivo == element.idArquivo){
              item = $scope.clientesArquivos[x];
              $scope.clientesArquivos.splice(x, 1);
            }
          }
      }else{
          for (var x in $scope.clientesCupons){
            if($scope.clientesCupons[x].idCupom == element.idCupom){
              item = $scope.clientesCupons[x];
              $scope.clientesCupons.splice(x, 1);
            }
          }
      }

      var reportItem = {
        'src' : item.imagemVirtual,
        'nomeArquivo' : item.nomeArquivo, 
        'rotate': 0,
        'oldElement': item,
        'oldSource': arraySource
      }

      $scope.reportFiles.push(reportItem);
    }

    $scope.removeFromReport = function(index){
      var item = $scope.reportFiles[index];
      $scope.reportFiles.splice(index, 1);
      if(item.oldSource == 'clientesArquivos'){
        $scope.clientesArquivos.push(item.oldElement);
      }else{
        $scope.clientesCupons.push(item.oldElement);
      }
    }

    $scope.rotateImage = function(index){
      var item = $scope.reportFiles[index];
      if(item.rotate == 270){
        item.rotate = 0;
      }else{
        item.rotate += 90;
      }
      $scope.reportFiles[index] = item;
    }

    $scope.rotateImagePanzoom = function(index){
      if($scope.imgRotate == 270){
        $scope.imgRotate = 0;
      }else{
        $scope.imgRotate += 90;
      }
    }

    $scope.rotateCupomPanzoom = function(index){
      if($scope.cupomRotate == 270){
        $scope.cupomRotate = 0;
      }else{
        $scope.cupomRotate += 90;
      }
    }

    $scope.clearImgToOpen = function() {
      $scope.imgToOpen = false;
    }
    $scope.clearCupomToOpen = function() {
      $scope.cupomToOpen = false;
    }

    $scope.createPdf = function() {
      var content = '<html><body><h1>Teste de PDF</h1></body></html>'
      //angular.element('#div-maluca-de-teste');
      var teste = angular.element( document.querySelector('#div-to-export-pdf') );
      var dialog = $mdDialog;

        var customTemplate =  '<md-dialog style="max-width:30%;" flex>' +
                              '  <md-dialog-content class="md-padding open-file-dialog">' +
                              '  <md-progress-linear md-mode="indeterminate"></md-progress-linear>' +
                              '   <br><center>Aguarde Gerando PDF</center><br> ' +
                              ' ' +
                              '    </md-dialog-content>' +
                              '  <md-dialog-actions>' +
                              '    <md-button ng-click="closeDialog();" class="md-primary">' +
                              '     VOLTAR' +
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
                  }
               });

       PdfReporService.createPdf(teste.html(), $scope.clienteSelected.nomeCliente, $scope.reportFiles).then(function (data) {
                  //console.log(data);
                  dialog.hide();
                  $scope.showSuccessPdfDialog(data);
       }).catch(function (err){
                  $scope.showErrorDialog(err);
       });;
    }

    $scope.openFile = function(filePath){
      FilesService.openFile(filePath).then(function(){
        return;
      }).catch(function(err){
          $scope.showErrorDialog(err);
      })
    }

    $scope.openFolder = function(folderPath){
      FilesService.openFolder(folderPath).then(function(){
        return;
      }).catch(function(err){
          $scope.showErrorDialog(err);
      })
    }

    $scope.showSuccessPdfDialog = function(data) {
        var dialog = $mdDialog;

        var customTemplate =  '<md-dialog style="max-width:30%;" flex>' +
                              '  <md-dialog-content class="md-padding open-file-dialog">' +
                              '  ' +
                              '   <br><center><h4>PDF gerado com sucesso</h4></center><br> ' +
                              ' ' +
                              '    </md-dialog-content>' +
                              '  <md-dialog-actions>' +
                              '    <md-button ng-click="closeDialog();" class="md-primary">' +
                              '     FECHAR' +
                              '    </md-button>' +
                              '    <md-button ng-click="openFolder(\''+data.folderPath+'\');" class="md-primary">' +
                              '     ABRIR LOCAL' +
                              '    </md-button>' +
                              '    <md-button ng-click="openFile(\''+data.filePath+'\');" class="md-primary">' +
                              '     ABRIR' +
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
                  }
               });
    }


    $scope.getReportFilesCount = function(){
      return $scope.reportFiles.length;
    }


   



  }

})();