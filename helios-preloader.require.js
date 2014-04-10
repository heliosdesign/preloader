define(['jquery'], function($){

    var parallel_max = 6,
    parallel_current = 0,

    manifest = {},
    index    = {},
    loaded   = {},

    events   = {},
    complete = {},
    audioType;

var debug = false;

var log = function(msg){
    if(debug) console.log(msg);
}

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

    if(!path) return;

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


    log('[Preloader] start "%s" -> %O', set, manifest[set]);

    load(set);


    // trigger('start', set, manifest[set] );
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

            trigger('progress', {
                'file': file.filename,
                'percent': ( loaded[set] / manifest[set].length )
            });

            loaded[set] += 1;
            if( loaded[set] >= manifest[set].length ) {
                if(complete[set]) return;
                
                log('[Preloader] set "%s" complete %s/%s', set, loaded[set], manifest[set].length);
                complete[set] = true;
                trigger( set + '-complete' );

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

var whenReady = function( opts ){

    if(typeof opts.callback !== 'function') return;
    if( ! manifest[opts.set] ) return;

    if( opts.file ){

        var file;

        for (var i = manifest[opts.set].length - 1; i >= 0; i--) {
            if(manifest[opts.set][i].filename === opts.file) {
                file = manifest[opts.set][i];
                break;
            }
        };

        if(!file) {
            console.warn('Can’t add ready callback, no file filed "%s" exists.', opts.file)
            return;
        }

        if(file.ready === true) {
            opts.callback(); // do it now
        } else {
            file.callback = opts.callback; // store for delayed execution
        }

    } else {

        if(complete[opts.set] === true) opts.callback();
        else                            on(opts.set + '-complete', opts.callback);

    }

    
    
}

return {
    add:       add,
    start:     start,
    whenReady: whenReady,
    complete:  complete,

    on: on,
    off: off,

    log : log
}

});