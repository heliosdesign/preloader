(function(window, angular, undefined) {'use strict';

angular.module('heliosPreloader', ['ng'])

    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])

    .factory('preloader', ['$window', '$rootScope', '$http',
    function($window, $rootScope, $http) {

        $http.defaults.useXDomain = true;
        delete $http.defaults.headers.common['X-Requested-With'];

        %%% REPLACE %%%

    }]);

})(window, window.angular);