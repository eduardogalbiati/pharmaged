(function () {
    'use strict';
    var fs = require('fs');
   var mysql = require('mysql');

    
    
    angular.module('app')
        .service('ErrorCheckService', ['$q', ErrorCheckService]);
    
    function ErrorCheckService($q) {
        return {
    
            checkForErrors : checkForErrors 


        };
        var errors = [];
        var status = 1;
     
        function addError(error)
        {
            status = 0;
            errors.push(error);

        }

        function getResponse(){
            return {
                'status':status,
                'errors':errors
            }
        }

        function checkConfigFile(){
             var deferred = $q.defer();
            /* if (configFileLocation.existsSync('config.js')) { 
                deferred.reject('Arquivo config.js não encontrado na pasta c:\\PharmaGed');
                return deferred.promisse;
            } */
                fs.readFile(configFileLocation,'utf-8', function read(err, data) {
                    if (err) {
                        deferred.reject(err);
                    }
                    deferred.resolve(data);
                });
             return deferred.promise;

        }

        function checkDatabaseConnection(configFile){
            // Creates MySql database connection
            var deferred = $q.defer();

            var config = JSON.parse(configFile)


            var connection = mysql.createConnection({
                host: config.dbServer,
                user: config.dbUser,
                password: config.dbPass,
                database: config.dbName
            });

            var query = "SELECT * FROM clientes";
            connection.query(query, function (err, rows) {
                if (err) {
                    deferred.reject(err);
                };
                deferred.resolve(rows);
            });

            return deferred.promise;

        }

        function checkForErrors(){
            var deferred = $q.defer();
            checkConfigFile().then(function(data){
                checkDatabaseConnection(data).then(function(data){

                }).catch(function(err){
                    deferred.reject('Erro ao abrir conectar no banco ('+err+')')
                })
            }).catch(function(err){
                deferred.reject('Erro ao abrir o arquivo config.js')
            })
           
            //deferred.resolve('')
            return deferred.promise;
        }

       
    }
})();