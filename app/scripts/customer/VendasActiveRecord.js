(function () {
    'use strict';
    var mysql = require('mysql');
    var fs = require('fs');
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
        .service('VendasActiveRecord', ['$q', VendasActiveRecord]);
    
    function VendasActiveRecord($q) {
        return {
            //getCustomers: getCustomers,
            create: create,
            getLast: getLast,
            getFilesForVenda: getFilesForVenda,
            getById: getById
            //getByName: getCustomerByName,
            //create: createCustomer,
            //destroy: deleteCustomer,
            //update: updateCustomer
        };
        
       

        function create(venda) {
            var deferred = $q.defer();
            var query = "INSERT INTO vendas SET ?";
            connection.query(query, venda, function (err, res) {
                if (err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(res.insertId);
                }
            });
            return deferred.promise;
        }

        function getLast() {
            var deferred = $q.defer();
            var query = "SELECT v.*, c.*, a.idTipoArquivo " +
                "FROM vendas v "+
                "INNER JOIN clientes c ON c.idCliente=v.idCliente " +
                "LEFT JOIN arquivosVendas av ON av.idVenda = v.idVenda " +
                "LEFT JOIN arquivos a ON a.idArquivo = av.idArquivo " +
                "ORDER BY v.dataHora desc";
            connection.query(query, [name], function (err, rows) {
                if (err){
                  deferred.reject(err);  
                }else{
                     console.log(rows);
                    var files =[];
                    var files = {
                            'documento':false,
                            'receita':false,
                            'cupom':false,
                        }
                    var idVenda = rows[0].idVenda;
                    var lastVenda = false;
                    var obj
                    var out = [];
                   
                    for (var x in rows){
                       
                        if(rows[x].idVenda != idVenda){
                            obj = lastVenda
                            obj.files = files;

                            out.push(obj);

                            files = {
                                'documento':false,
                                'receita':false,
                                'cupom':false,
                            };
                            idVenda = rows[x].idVenda;
                       
                        }

                        if(rows[x].idTipoArquivo == '1'){
                            files.documento = true;
                        }
                        if(rows[x].idTipoArquivo == '2'){
                            files.receita = true;
                        }
                        if(rows[x].idTipoArquivo == '3'){
                            files.cupom = true;
                        }

                        lastVenda = rows[x];
                    }
                    //resolvendo por último
                    obj = lastVenda
                    obj.files = files;
                    out.push(obj);
                  deferred.resolve(out);
                }
            });
            return deferred.promise;
        }

         function getById(id) {
            var deferred = $q.defer();
            var query = "SELECT * FROM vendas WHERE idVenda = ?";
            connection.query(query, [id], function (err, rows) {
                if (err){
                  deferred.reject(err);  
                }else{
                  deferred.resolve(rows);
                }
            });
            return deferred.promise;
        }

        function getFilesForVenda(idVenda) {
            var deferred = $q.defer();

            var query = "SELECT * FROM arquivosVendas av INNER JOIN arquivos a ON a.idArquivo = av.idArquivo WHERE av.idVenda = ? ORDER by a.idTipoArquivo asc";
            connection.query(query, [idVenda], function (err, rows) {
                if (err) deferred.reject(err);
                
                deferred.resolve(rows);
            });
            return deferred.promise;
        }


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