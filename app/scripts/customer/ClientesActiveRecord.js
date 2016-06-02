(function () {
    'use strict';
    var mysql = require('mysql');
    var fs = require('fs');
    var uuid = require('node-uuid');
    try{
        var config = JSON.parse(fs.readFileSync(configFileLocation,'utf8'))
    }catch(err){
        
    }

    // Creates MySql database connection
    var connection = mysql.createConnection({
        host: config.dbServer,
        user: config.dbUser,
        password: config.dbPass,
        database: config.dbName
        //debug: true  
    });
    
    angular.module('app')
        .service('ClientesActiveRecord', ['$q', ClientesActiveRecord]);
    
    function ClientesActiveRecord($q) {
        return {
            //getCustomers: getCustomers,
            getClientesForSearch: getClientesForSearch,
            getClientesForSearchWithoutCpf: getClientesForSearchWithoutCpf,
            getClienteById: getClienteById,
            getById: getClienteById,
            getClienteByCpf : getClienteByCpf    ,
            updateClientesField: updateClientesField,
            getFilesForCliente: getFilesForCliente,
            getFilesForClienteLegado: getFilesForClienteLegado,
            getFilesForClienteRecentes: getFilesForClienteRecentes,
            getCuponsForCliente: getCuponsForCliente,
            addFileForCliente: addFileForCliente,
            addCupomForCliente: addCupomForCliente,
            create: create,
            createUpdate: createUpdate,
            //loadImage: loadImage
            //getByName: getCustomerByName,
            //create: createCustomer,
            //destroy: deleteCustomer,
            //update: updateCustomer
        };
        
        function getClientesForSearch() {
            var deferred = $q.defer();
            var query = "SELECT idCliente, nomeCliente, cpf FROM clientes";
            connection.query(query, function (err, rows) {
                if (err) {
                    deferred.reject(err);
                };
                deferred.resolve(rows);
            });
            return deferred.promise;
        }

        function getClientesForSearchWithoutCpf(){
            var deferred = $q.defer();
            var query = "SELECT idCliente, nomeCliente, cpf FROM clientes WHERE cpf is null OR cpf = ''";
            connection.query(query, function (err, rows) {
                if (err) {
                    deferred.reject(err);
                };
                deferred.resolve(rows);
            });
            return deferred.promise;

        }

        function getClienteById(id) {
            var deferred = $q.defer();
            var query = "SELECT * FROM clientes WHERE idCliente = ?";
            connection.query(query, [id], function (err, rows) {
                if (err) deferred.reject(err);
                deferred.resolve(rows);
            });
            return deferred.promise;
        }

        function getClienteByCpf(cpf) {
            var deferred = $q.defer();
            var query = "SELECT * FROM clientes WHERE cpf = ?";
            connection.query(query, [cpf], function (err, rows) {
                if (err) deferred.reject(err);
                deferred.resolve(rows);
            });
            return deferred.promise;
        }

        function updateClientesField(idCliente, index, newValue, oldValue) {
            var deferred = $q.defer();
            var array ={
                'index' : index,
                'value': newValue
            }

            var query = "UPDATE clientes SET "+index+" = ? WHERE idCliente = ?";
            connection.query(query, [newValue, idCliente], function (err, res) {
                if (err) {
                    deferred.reject(err);
                }else{
                    updateLog(idCliente, index, newValue, oldValue)
                }
                deferred.resolve(res);
            });
            return deferred.promise;
        }

        function updateLog(idCliente, index, newValue, oldValue) {
            var deferred = $q.defer();
            var query = "INSERT INTO clientesLog SET field = ?, idCliente = ?, oldValue = ?, newValue = ? ";
            connection.query(query, [index, idCliente, oldValue, newValue], function (err, res) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(res);
            });
            return deferred.promise;
        }

        function getFilesForCliente(idCliente) {
            var deferred = $q.defer();
            var query = "SELECT * FROM arquivos WHERE idCliente = ?";
            connection.query(query, [idCliente], function (err, res) {
                if(err){
                    deferred.reject(err);
                }
                for(var x in res){
                    
                    res[x].imagemVirtual = (res[x].caminho+'/'+res[x].nomeArquivo);
                }
                deferred.resolve(res);
            });
            return deferred.promise;
        }

         function getFilesForClienteLegado(idCliente) {
            var deferred = $q.defer();
            var query = "SELECT * FROM arquivos a WHERE a.idCliente = ?  AND a.idArquivo not in (select idArquivo from arquivosvendas)";
            connection.query(query, [idCliente], function (err, res) {
                if(err){
                    deferred.reject(err);
                }
                for(var x in res){
                    
                    res[x].imagemVirtual = (res[x].caminho+'/'+res[x].nomeArquivo);
                }
                deferred.resolve(res);
            });
            return deferred.promise;
        }

         function getFilesForClienteRecentes(idCliente) {
            var deferred = $q.defer();
            var query = "SELECT * FROM arquivos a INNER JOIN arquivosvendas av ON av.idArquivo = a.idArquivo WHERE a.idCliente = ?";
            connection.query(query, [idCliente], function (err, res) {
                if(err){
                    deferred.reject(err);
                }
                for(var x in res){
                    
                    res[x].imagemVirtual = (res[x].caminho+'/'+res[x].nomeArquivo);
                }
                deferred.resolve(res);
            });
            return deferred.promise;
        }

         function getCuponsForCliente(idCliente) {
            var deferred = $q.defer();
            var query = "SELECT * FROM cupons WHERE idCliente = ?";
            connection.query(query, [idCliente], function (err, res) {
                if(err){
                    deferred.reject(err);
                }
                for(var x in res){
                    
                    res[x].imagemVirtual = (res[x].caminho+'/'+res[x].nomeArquivo);
                }
                deferred.resolve(res);
            });
            return deferred.promise;
        }

        function addFileForCliente(idCliente, nomeCliente, filePath, fileName, moveFile) {

            var deferred = $q.defer();

            var erro = false
            //pegando o caminho a ser utilizado
            var id='';
            var resOut;
            var nomeArquivo = nomeCliente;
           
            var td = new Date();
            var unique = td.getFullYear()+'-'+(td.getMonth()+1)+'-'+td.getDate()+'_'+td.getHours()+'-'+td.getMinutes()+'-'+td.getSeconds();
            var ext = fileName.substr(fileName.length - 4);
            nomeArquivo = nomeArquivo+'_'+unique+ext;
            //Inserindo o registro no banco
            var query = "INSERT INTO arquivos SET idCliente = ?, nomeArquivo = ?, caminho = ?, dataUpload = ?";
            connection.query(query, [idCliente, nomeArquivo, config.storeFolder, unique], function (err, res) {
                if (err) {
                    deferred.reject(err);
                id = res.insertId;
                }else{

                    fs.createReadStream(filePath+'/'+fileName).pipe(fs.createWriteStream(config.storeFolder+'/'+nomeArquivo));
                    if(moveFile)
                        fs.unlink(filePath+'/'+fileName);
                }   
            });    

            deferred.resolve(id);
            return deferred.promise;
        }

         function addCupomForCliente(idCliente, nomeCliente, filePath, fileName, moveFile, formData ) {

            var deferred = $q.defer();

            var erro = false
            //pegando o caminho a ser utilizado
            var id='';
            var resOut;
            var nomeArquivo = nomeCliente;
           
            var td = new Date();
            var unique = td.getFullYear()+'-'+(td.getMonth()+1)+'-'+td.getDate()+'_'+td.getHours()+'-'+td.getMinutes()+'-'+td.getSeconds();
            var ext = fileName.substr(fileName.length - 4);
            nomeArquivo = 'CUPOM_'+nomeArquivo+'_'+unique+ext;
            //Inserindo o registro no banco
            var query = "INSERT INTO cupons SET idCliente = ?, nomeArquivo = ?, caminho = ?, dataUpload = ?, dataCupom = ?, numeroCupom =?";
            connection.query(query, [idCliente, nomeArquivo, config.storeFolder, unique, formData.dataCupom, formData.numeroCupom], function (err, res) {
                if (err) {
                    deferred.reject(err);
                }else{
                    id = res.insertId;
                    fs.createReadStream(filePath+'/'+fileName).pipe(fs.createWriteStream(config.storeFolder+'/'+nomeArquivo));
                    if(moveFile)
                        fs.unlink(filePath+'/'+fileName);
                }   
                deferred.resolve(id);
            });    

            return deferred.promise;
        }

        function deleteRealFileById(id)
        {
            var query = "DELETE FROM arquivos WHERE idArquivo = ?";
            connection.query(query, [id], function (err, res) {
                if (err) deferred.reject(err);
 
            });

        }

        function create(customer) {
            var deferred = $q.defer();
            var query = "INSERT INTO clientes SET ?";
            connection.query(query, customer, function (err, res) {
                if (err) deferred.reject(err);
                deferred.resolve(res.insertId);
            });
            return deferred.promise;
        }

        function createUpdate(customer) {
            var deferred = $q.defer();
            if(customer.idCliente != ''){
                var query = "UPDATE clientes SET nomeCliente = ?, tel = ?, cel1=?, email=?, cep=?, endereco=?, cpf = ? WHERE idCliente = ?";
                connection.query(query, [customer.nomeCliente, customer.tel, customer.cel1, customer.email, customer.cep, customer.endereco, customer.cpf, customer.idCliente], function (err, res) {
                    if (err) deferred.reject(err);
                    deferred.resolve(customer.idCliente);
                });
            }else{
                
                delete customer.idCliente;
                var query = "INSERT INTO clientes SET ?";
                var con = connection.query(query, customer, function (err, res) {
                    if (err){
                        deferred.reject(err)
                    }else{
                        deferred.resolve(res.insertId);
                    }
                });
            }
            return deferred.promise;
        }

        function getDate() {
          var td = new Date();
          var today = td.getFullYear()+'-'+(td.getMonth()+1)+'-'+td.getDate()+' '+td.getHours()+':'+td.getMinutes()+':'+td.getSeconds();
          return today

        }

/*
        function loadImage(imageFile) {
            var deferred = $q.defer();
            fs.readFile(imageFile, function(err, data) {
                  if (err) throw err; // Fail if the file can't be read.

                  var out = '<img width="25px" src="data:image/jpeg;base64,';
                out += new Buffer(data).toString('base64');
                out += '"/>';
                    deferred.resolve(out);
            });
            return deferred.promise;

        }
*/

/*
        function getCustomers() {
            var deferred = $q.defer();
            var query = "SELECT * FROM clientes";
            connection.query(query, function (err, rows) {
                if (err) deferred.reject(err);
                deferred.resolve(rows);
            });
            return deferred.promise;
        }
        
        
        
        function getCustomerByName(name) {
            var deferred = $q.defer();
            var query = "SELECT * FROM customers WHERE name LIKE  '" + name + "%'";
            connection.query(query, [name], function (err, rows) {
                console.log(err)
                if (err) deferred.reject(err);
                
                deferred.resolve(rows);
            });
            return deferred.promise;
        }
        
        function createCustomer(customer) {
            var deferred = $q.defer();
            var query = "INSERT INTO customers SET ?";
            connection.query(query, customer, function (err, res) {
                console.log(err)
                if (err) deferred.reject(err);
                console.log(res)
                deferred.resolve(res.insertId);
            });
            return deferred.promise;
        }
        
        function deleteCustomer(id) {
            var deferred = $q.defer();
            var query = "DELETE FROM customers WHERE customer_id = ?";
            connection.query(query, [id], function (err, res) {
                if (err) deferred.reject(err);
                console.log(res);
                deferred.resolve(res.affectedRows);
            });
            return deferred.promise;
        }
        
        function updateCustomer(customer) {
            var deferred = $q.defer();
            var query = "UPDATE customers SET name = ? WHERE customer_id = ?";
            connection.query(query, [customer.name, customer.customer_id], function (err, res) {
                if (err) deferred.reject(err);
                deferred.resolve(res);
            });
            return deferred.promise;
        }

        */
    }
})();