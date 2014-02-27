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

        var parallel_max = 5,
    parallel_current = 0,
    // index    = -1,
    // loaded   = 0,

    manifest = {},
    index    = {},
    loaded   = {},

    events   = {},
    complete = {},
    audioType;

// Events

var on = function( type, callback ){
    events[type] = events[type] || [];
    events[type].push( callback );
};

var off = function( type ){
    events[type] = [];
};

var trigger = function( type ){
    if ( !events[type] ) return;
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, l = events[type].length; i < l;  i++)
        if ( typeof events[type][i] == 'function' ) 
            events[type][i].apply(this, args);
};


var add = function(set, path, filename){

    if( ! manifest[set] ) {
        manifest[set] = [];
        index[set] = -1;
        loaded[set] = 0;
        complete[set] = false;
    }

    manifest[set].push({
        path:  path,
        filename:    filename,
        ready: false
    })
}


var start = function(set){


    console.log('[Preloader] start "%s" -> %O', set, manifest[set])

    load(set);


    trigger('start', manifest);
};



var load = function(set){

    parallel_current++;
    index[set] ++;

    if( index[set] >= manifest[set].length ) return;

    var file = manifest[set][ index[set] ];

    var g = $.get(file.path)
        .done(function(){

            file.ready = true; 

            if(file.callback) {
                file.callback();
                file.callback = undefined;
            }

            trigger('progress', file.filename)

            loaded[set] += 1;
            if( loaded[set] >= manifest[set].length ) {
                if(complete[set]) return;
                
                console.log('[Preloader] set "%s" complete %s/%s', set, loaded[set], manifest[set].length)
                complete[set] = true;
                trigger('complete', set);

                return;
            }

            parallel_current--;
            load(set);
        })
        .fail(function(){
            console.warn(file.path + ' FAILED')
            parallel_current--;
            load(set);
        })

    if(parallel_current < parallel_max) load(set);
}






// ********************************************************

var getPath = function(name){
    for (var i = manifest.length - 1; i >= 0; i--) {
        if(manifest[i].filename === name) {
            return manifest[i].path;
            break;
        }
    };
}

var whenReady = function(set, name, callback){

    if(typeof callback !== 'function') return;

    var file;

    for (var i = manifest[set].length - 1; i >= 0; i--) {
        if(manifest[set][i].filename === name) {
            file = manifest[set][i];
            break;
        }
    };

    if(!file) {
        console.warn('Can’t add ready callback, no file named "%s" exists.', name)
        return;
    }

    console.log('whenready : %O', file)

    if(file.ready === true) callback(); // do it now
    else                    file.callback = callback; // store for delayed execution

}

return {
    start : start,

    add : add,

    getPath : getPath,
    whenReady : whenReady,

    on: on,
    off: off,

    complete: complete
}

    }]);

})(window, window.angular);