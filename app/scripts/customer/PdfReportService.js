(function () {
    'use strict';
    var fs = require('fs');
    var pdf = require('html-pdf');
    try{
        var config = JSON.parse(fs.readFileSync(configFileLocation,'utf8'))
    }catch(err){
        
    }
    angular.module('app')
        .service('PdfReporService', ['$q', PdfReporService]);
    
    function PdfReporService($q) {
        return {
            createPdf: createPdf

        };

        function createPdf(content, nomeCliente, arrayFiles){


            var deferred = $q.defer();
            var options = {
                 format: 'Letter'
                 
             };

        
            var td = new Date();
            var today = td.getFullYear()+'-'+(td.getMonth()+1)+'-'+td.getDate()+'_'+td.getHours()+''+td.getMinutes()+''+td.getSeconds();
            var fileName = nomeCliente.replace(/ /g,'_')+'_'+today;
            var folderPath = config.reportFolder+'/'+fileName;
            var filePath = folderPath+'/'+fileName+'.pdf';

            //criando o diretorio
            try {
                fs.mkdirSync(config.reportFolder+'/'+fileName);
            } catch(e) {
                console.log(e);
                deferred.reject(e.code)
                return deferred.promise
            }

            //copiando os arquivos
                for(var x in arrayFiles){
                    fs.createReadStream(arrayFiles[x].src).pipe(fs.createWriteStream(config.reportFolder+'/'+fileName+'/'+arrayFiles[x].nomeArquivo));
                }

            pdf.create(content, options).toFile(filePath, function(err, res) {
                if (err){
                    deferred.reject(err)
                    deferred.resolve(res);
                    return deferred.promise
                } 

                //deferred.resolve(res);
                

                var item = {
                    'folderPath' : folderPath.replace(/\//g,'\\\\'),
                    'filePath' : filePath.replace(/\//g,'\\\\')
                }

                deferred.resolve(item);
                
            });
            return deferred.promise

        }
        
      
    }
})();