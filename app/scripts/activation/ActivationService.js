(function () {
    'use strict';
   
    var fs = require('fs');
    var uuid = require('node-uuid');
    var crypto = require('crypto');
    var serialNumber = require('serial-number');
    var codigoFile = "c:/Pharmaged/atv.bin";
    serialNumber.preferUUID = true;
    
    angular.module('app')
        .service('ActivationService', ['$q', ActivationService]);
    
    function ActivationService($q) {
        return {
            //getCustomers: getCustomers,
            getCodigoInstalacao: getCodigoInstalacao,
            checkCodigoAtivacao: checkCodigoAtivacao,
            putCodigoAtivacao: putCodigoAtivacao
            //loadImage: loadImage
            //getByName: getCustomerByName,
            //create: createCustomer,
            //destroy: deleteCustomer,
            //update: updateCustomer
        };
        
       

        function getCodigoInstalacao() {
            var deferred = $q.defer();
            var command = 'wmic path win32_physicalmedia where tag="\\\\\\\\.\\\\PHYSICALDRIVE0" get serialnumber /format:list';
            var util = require("util");


            var child = require('child_process').spawn("cmd",["/c",command],{ 
              windowsVerbatimArguments: true,
              stdio: ['ignore', 'pipe', 'ignore']
            });

            child.stdout.on('data', function (data) {
                data = data.toString();
                if(data != ''){
                  //console.log('-stdouts: ' + data);
                  
                  var res = data.split("=");
                  //console.log(res)
                  res = res[1]
                  if(res != undefined){
                      res = res.replace(/(?:\r\n|\r|\n|\s)/g, '');
                      deferred.resolve(res)
                  }else{
                  }
                }
            });
             
            return deferred.promise;
        }

        function checkCodigoAtivacao()
        {
            var deferred = $q.defer();
            //var codigo = fs.readFileSync(codigoFile,'utf8');
            fs.readFile(codigoFile, "utf8", function(err, data) {
                if (err) {
                    deferred.resolve('0');
                    return deferred.promise;
                }
                var codigo = data
                getCodigoInstalacao().then(function(serial){
                    var crypto = require('crypto')
                  , shasum = crypto.createHash('sha1');
                shasum.update(serial);
                var cripted = shasum.digest('hex');
                if(cripted == codigo)
                    deferred.resolve('1');
                else
                    deferred.resolve('0')
                
                });
            });
            
          return deferred.promise;
            //if(codigo == )
        }

        function putCodigoAtivacao(codigo) {
            var deferred = $q.defer();
            //fs.unlink(codigoFile);
            fs.writeFile(codigoFile, codigo, function(err, data){
                if(err) deferred.resolve(err)
                    deferred.resolve(data);
            });
            return deferred.promise;
        }
    }

})();