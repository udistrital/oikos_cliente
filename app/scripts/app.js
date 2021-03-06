'use strict';

/**
 * @ngdoc overview
 * @name oikosClienteApp
 * @description
 * # oikosClienteApp
 *
 * Main module of the application.
 */
angular
  .module('oikosClienteApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'afOAuth2',
    'treeControl',
    'ngMaterial',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.treeView',
    'ui.grid.selection',
    'ui.grid.exporter',
    'ngStorage',
    'ngWebSocket',
    'angularMoment',
    'ui.utils.masks'
  ])
    .run(function(amMoment) {
      amMoment.changeLocale('es');
    })
    .config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix("");
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/notificaciones', {
        templateUrl: 'views/notificaciones.html',
        controller: 'NotificacionesCtrl',
        controllerAs: 'notificaciones'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/crear_edificio', {
        templateUrl: 'views/edificio/crear_edificio.html',
        controller: 'CrearEdificioCtrl',
        controllerAs: 'crearEdificio'
      })
      .when('/consultar_edificio', {
        templateUrl: 'views/edificio/consultar_edificio.html',
        controller: 'ConsultarEdificioCtrl',
        controllerAs: 'consultarEdificio'
      })
      .when('/consultar_sede', {
        templateUrl: 'views/sede/consultar_sede.html',
        controller: 'ConsultarSedeCtrl',
        controllerAs: 'consultarSede'
      })
      .when('/consultar_espacio_fisico', {
        templateUrl: 'views/espacio_fisico/consultar_espacio_fisico.html',
        controller: 'ConsultarEspacioFisicoCtrl',
        controllerAs: 'consultarEspacioFisico'
      })
      .when('/consultar_dependencia', {
        templateUrl: 'views/dependencia/consultar_dependencia.html',
        controller: 'ConsultarDependenciaCtrl',
        controllerAs: 'consultarDependencia'
      })
      .when('/crear_dependencia', {
        templateUrl: 'views/dependencia/crear_dependencia.html',
        controller: 'CrearDependenciaCtrl',
        controllerAs: 'crearDependencia'
      })
      .when('/crear_espacio_fisico', {
        templateUrl: 'views/espacio_fisico/crear_espacio_fisico.html',
        controller: 'CrearEspacioFisicoCtrl',
        controllerAs: 'crearEspacioFisico'
      })
      .when('/crear_sede', {
        templateUrl: 'views/sede/crear_sede.html',
        controller: 'CrearSedeCtrl',
        controllerAs: 'crearSede'
      })
      .when('/gestionar_tipo_espacio', {
        templateUrl: 'views/gestionar_tipos/gestionar_tipo_espacio.html',
        controller: 'GestionarTipoEspacioCtrl',
        controllerAs: 'gestionarTipoEspacio'
      })
      .when('/gestionar_tipo_dependencia', {
        templateUrl: 'views/gestionar_tipos/gestionar_tipo_dependencia.html',
        controller: 'GestionarTipoDependenciaCtrl',
        controllerAs: 'gestionarTipoDependencia'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
