'use strict';

/**
 * @ngdoc service
 * @name oikosClienteApp.oikosRequest
 * @description
 * # oikosRequest
 * Factory in the oikosClienteApp.
 */
angular.module('oikosClienteApp')
  .factory('oikosRequest', function ($http) {

      // Service logic
    // ...
    var path = "https://autenticacion.udistrital.edu.co:8244/oikos_api/";

    var cabecera = {
      headers: {
        'Authorization': 'Bearer aaf8c00a-a2ac-3989-84b7-6a917986892c'
      }
    };
    // Public API here
    return {
      get: function (tabla,params) {
        return $http.get(path+tabla+"/?"+params, cabecera);
      },
      post: function (tabla,elemento) {
        return $http.post(path+tabla,elemento);
      },
      put: function (tabla,id,elemento) {
        return $http.put(path+tabla+"/"+id,elemento);
      },
      delete: function (tabla,id) {
        return $http.delete(path+tabla+"/"+id);
      }
    };
  });



      //curl -X GET --header 'Accept: application/json' --header 'Authorization: Bearer 803847ce-479d-366a-9e3d-7d4e00744f09' 'https://autenticacion.udistrital.edu.co:8244/oikos_api/tipo_uso/?limit=-1'
