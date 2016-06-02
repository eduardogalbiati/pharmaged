(function () {
    'use strict';
    var fs = require('fs');
   var mysql = require('mysql');

    var uuid = require('node-uuid');
    
    var config = JSON.parse(fs.readFileSync(configFileLocation,'utf8'))

    // Creates MySql database connection
    var connection = mysql.createConnection({
        host: config.dbServer,
        user: config.dbUser,
        password: config.dbPass,
        database: config.dbName
    });
    
    angular.module('app')
        .service('FilesService', ['$q', FilesService]);
    
    function FilesService($q) {
        return {
    
            getFilesForFolder: getFilesForFolder,
            getFilesDigitalizados: getFilesDigitalizados,
            getConfigFile: getConfigFile,
            openFile : openFile,
            openFolder : openFolder

        };

        function getFilesDigitalizados(){
            return getFilesForFolder(config.desktopFolder);
        }
        
        function getFilesForFolder(folder) {
            var deferred = $q.defer();
            var filtered = [];
            try{
            var files = fs.readdirSync(folder);
            }catch(err){
                deferred.reject(err);
                return deferred.promise;
            };
            var tmp;
            for (var x in files) {
                if( files[x].toLowerCase().indexOf('.jpg') > 0 
                    ||  files[x].toLowerCase().indexOf('.jpeg') > 0 
                    ||  files[x].toLowerCase().indexOf('png') > 0 
                    ||  files[x].toLowerCase().indexOf('gif') > 0 
                    ||  files[x].toLowerCase().indexOf('bmp') > 0 
                    ||  files[x].toLowerCase().indexOf('tif') > 0 
                ){
                    tmp = {
                        "id":x,
                        "value":files[x]
                    };
                    filtered.push(tmp);
                }

            }

            deferred.resolve(filtered);
            return deferred.promise;
        }

        var filesToImport = [];

         function create(customer,x) {
            var deferred = $q.defer();
            var query = "INSERT INTO clientes SET ?";
            connection.query(query, customer, function (err, res) {
                if (err) deferred.reject(err);
                deferred.resolve({
                    id: res.insertId,
                    xValue: x});
            });
            return deferred.promise;
        }


        function openFile(filePath) {
            //Abrindo o PDF
            var deferred = $q.defer();

            console.log('abrindo arquivo'+filePath);
            var util = require("util");

            var child = require('child_process').spawn("cmd",["/c",filePath],{ 
              windowsVerbatimArguments: true,
              stdio: ['ignore', 'pipe', 'ignore']
            });

            child.stdout.on('data', function (data) {
                deferred.resolve(data.toString());
            });

            return deferred.promise;
        }
         function openFolder(folderPath) {
            //Abrindo o PDF
            var deferred = $q.defer();

            console.log('abrindo pasta '+folderPath);
            var util = require("util");
            var command = 'explorer '+folderPath
            var child = require('child_process').spawn("cmd",["/c",command],{ 
              windowsVerbatimArguments: true,
              stdio: ['ignore', 'pipe', 'ignore']
            });

            child.stdout.on('data', function (data) {
                deferred.resolve(data.toString());
            });

            return deferred.promise;
        }
/*
         function importFilesAuto(folder)
        {
             var filesToIgnore = [];
            var files = [];
            var count = 0;
            var retorno = '';
            var config = {
                storeFolder : 'c:/PharmaGed/Documentos Armazenados'
            }
            var filePath  = 'c:/PharmaGed/Documentos Digitalizados';

            getFilesForFolder(folder).then(function(data){
                console.log('files');
                filesToImport = data;
                files = data
                console.log(files);
                for (var x in files){

                    //console.log('Count = ');
                    //console.log(count);
                    retorno = checkIfHasCliente(files[x].value.toLowerCase(), files[x].id);
                    if(retorno == true){
                        filesToIgnore.push(files[x].id);
                    }
                }
            });
        }

        function importFilesAuto2(folder)
        {
            var filesToIgnore = [];
            var files = [];
            var count = 0;
            var retorno = '';
            var config = {
                storeFolder : 'c:/PharmaGed/Documentos Armazenados'
            }
            var filePath  = 'c:/PharmaGed/Documentos Digitalizados';

            getFilesForFolder(folder).then(function(data){
                console.log('files');
                filesToImport = data;
                files = data
                console.log(files);
                for (var x in files){

                    //console.log('Count = ');
                    //console.log(count);
                    retorno = checkIfHasCliente(files[x].value.toLowerCase(), files[x].id);
                    if(retorno == true){
                        filesToIgnore.push(files[x].id);
                    }
                }
                console.log(filesToIgnore);

                var ignore = false;
                var fileName ='';
                var nomeAGravar ='';
                var ext ='';
                var unique ='';
                var td ='';
                var query = '';
                var query2 = '';
                 var idClienteInserted = ''
                 var customer ='';
                 var asd = '';
                for (var x in files){
                    ignore = false;
                    for(var y in filesToIgnore ){
                        if(filesToIgnore[y] == files[x].id){
                            ignore = true;
                        }
                   }  
                   if(!ignore){
                   
                    customer = {
                        nomeCliente: files[x].value,
                        atualizarDados: '1',

                    }
                   
                    create(customer, x).then(function(res){
                            idClienteInserted= res.id;
                            fileName = files[res.xValue].value;
                            td = new Date();
                            unique = td.getFullYear()+'-'+(td.getMonth()+1)+'-'+td.getDate()+'_'+td.getHours()+'-'+td.getMinutes()+'-'+td.getSeconds();
                            ext = fileName.substr(fileName.length - 4);
                            nomeAGravar = fileName.substr(0,fileName.length - 4);

                            nomeAGravar = nomeAGravar+'_'+unique+ext;

                            console.log(idClienteInserted);
                            console.log('--')
                            console.log(nomeAGravar)
                            //Inserindo o registro no banco
                            var arquivo = {
                                idCliente:idClienteInserted,
                                nomeArquivo:nomeAGravar,
                                caminho:config.storeFolder
                            }
                            insertFiles(arquivo, filePath, fileName, config.storeFolder, nomeAGravar).then(function(res2){
                                 fs.createReadStream(res2.rFilePath+'/'+res2.rFileName).pipe(fs.createWriteStream(res2.rStoreFolder+'/'+res2.rNomeArquivo));
                                    fs.unlink(res2.rFilePath+'/'+res2.rFileName);
                            })
                           
                             
                    });

 


        
                   }
                }
            })
                
           
        }
*/
        function insertFiles(customer, filePath, fileName, storeFolder, nomeArquivo)
        {
             var deferred = $q.defer();
            var query = "INSERT INTO arquivos SET ?";
            connection.query(query, customer, function (err, res) {
                if (err) console.log(err);
                deferred.resolve({
                    rFilePath: filePath,
                    rFileName: fileName,
                    rStoreFolder: storeFolder,
                    rNomeArquivo: nomeArquivo
                    });
            });
            return deferred.promise;
        }

        function checkIfHasCliente(fileName, index){
            var fileCutted = '';
            var fileCuttedCompare = '';
            var tmp = [];
            for (var x in filesToImport) {

                    fileCutted = filesToImport[x].value.toLowerCase().substr(0, filesToImport[x].value.length -6)
                    fileCuttedCompare = fileName.substr(0, (fileName.length-6))
                if(fileCutted.indexOf(fileCuttedCompare) >= 0 || fileCuttedCompare.indexOf(fileCutted) >= 0){
                   if(index != filesToImport[x].id){
                     return true;
                }

                }
            }
            return false        
        }

        function getConfigFile(){
             var deferred = $q.defer();
                fs.readFile(configFileLocation,'utf8', function read(err, data) {
                    if (err) {
                        deferred.reject(err);
                    }
                    deferred.resolve(data);
                });
             return deferred.promise;

        }

       
    }
})();