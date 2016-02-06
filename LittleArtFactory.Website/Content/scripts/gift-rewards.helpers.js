function debounce( fn, delay )
{
    var timer = null;
    return function()
    {
        var context = this, args = arguments;
        clearTimeout( timer );
        timer = setTimeout( function()
        {
            fn.apply( context, args );
        }, delay );
    };
}

( function( $, sr )
{
    var debounce = function( func, threshold, execAsap )
    {
        var timeout;

        return function debounced()
        {
            var obj = this, args = arguments;
            function delayed()
            {
                if( !execAsap )
                    func.apply( obj, args );
                timeout = null;
            };

            if( timeout )
                clearTimeout( timeout );
            else if( execAsap )
                func.apply( obj, args );

            timeout = setTimeout( delayed, threshold || 100 );
        };
    }
    // smartresize 
    jQuery.fn[sr] = function( fn ) { return fn ? this.bind( 'resize', debounce( fn ) ) : this.trigger( sr ); };

} )( jQuery, 'debounceResize' );

function setTimer( delay, f )
{
    var obj =
    {
        firetime: delay + ( +new Date() ), // the extra + turns the date into an int 
        called: false,
        canceled: false,
        callback: f
    };

    // this function will set obj.called, and then call the function whenever
    // the timeout eventually fires.
    var callfunc = function() { obj.called = true; f(); };

    // calling .extend(1000) will add 1000ms to the time and reset the timeout.
    // also, calling .extend(-1000) will remove 1000ms, setting timer to 0ms if needed
    obj.extend = function( ms )
    {
        // break early if it already fired
        if( obj.called || obj.canceled ) return false;
        // clear old timer, calculate new timer
        clearTimeout( obj.timeout );
        obj.firetime += ms;
        var newDelay = obj.firetime - new Date(); // figure out new ms
        if( newDelay < 0 ) newDelay = 0;
        obj.timeout = setTimeout( callfunc, newDelay );
        return obj;
    };


    // sets the timeout to occur after the specified ms
    obj.reset = function( ms )
    {
        return obj.extend( +new Date() + ms - obj.firetime );
    };

    // Cancel the timer...  
    obj.cancel = function()
    {
        obj.canceled = true;
        clearTimeout( obj.timeout );
    };

    // call the initial timer...
    obj.timeout = setTimeout( callfunc, delay );

    // return our object with the helper functions....
    return obj;

}

$.fn.removeClassPrefix = function( prefix )
{
    this.each( function( i, el )
    {
        var classes = el.className.split( " " ).filter( function( c )
        {
            return c.lastIndexOf( prefix, 0 ) !== 0;
        } );
        el.className = $.trim( classes.join( " " ) );
    } );
    return this;
};

$.fn.removeClassSuffix = function( suffix )
{
    this.each( function( i, el )
    {
        var classes = el.className.split( " " ).filter( function( c )
        {
            return c.indexOf( suffix, this.length - suffix.length ) == -1;
        } );
        el.className = $.trim( classes.join( " " ) );
    } );
    return this;
};


$.fn.animateNumber = function()
{

    var el = $(this);
    var start = el.data( 'start' ) || 0;
    var end = parseFloat( el.data( 'end' ) );
    var decimals = el.data( 'decimals' ) || 0;

    $( { percentage: start } ).stop( true ).animate( { percentage: end },
    {
        duration: 200 + Math.floor( Math.random() * 1000 ),
        easing: "easeOutQuint",
        step: function()
        {
            el.text( numberWithCommas( this.percentage.toFixed( decimals ) ) );
        }
    } ).promise().done( function()
    {
        el.text( numberWithCommas( end.toFixed( decimals ) ) );
    } );
};

function numberWithCommas( x )
{
    return x.toString().replace( /\B(?=(\d{3})+(?!\d))/g, "," );
}


function getCssProperty( style, selector, sheet )
{
    var sheets = typeof sheet !== 'undefined' ? [sheet] : document.styleSheets;
    for( var i = 0, l = sheets.length; i < l; i++ )
    {
        var sheet = sheets[i];
        try
        {
            var rules = sheet.cssRules;
            for( var j = 0, k = rules.length; j < k; j++ )
            {
                var rule = rules[j];
                if( rule.selectorText && rule.selectorText.split( ',' ).indexOf( selector ) !== -1 )
                {
                    return rule.style[style];
                }
            }
        }
        catch( e ) {  } // Firefox freaks out if the css is from another domain

    }
    return null;
}

function ImageDropZone( el, ownerId, key, success )
{

    var options =
    {

        url: '/admin/upload-image',
        maxFileSize: 2,
        uploadMultiple: false,
        acceptedFiles: 'image/*',
        autoProcessQueue: true,
        addRemoveLinks: true,

        init: function()
        {
            if( typeof ( success ) == 'function' )
            {
                this.on( "complete", function( data )
                {
                    data = JSON.parse( data.xhr.responseText );
                    el.css( 'background-image', 'url(' + data.path + ')' );
                    success.call( this, data );
                } );
            }
        },

        sending: function( file, xhr, formData )
        {
            formData.append( 'OwnerId', ownerId );
            formData.append( 'Key', key );
        }

    };

    el.addClass( 'dropzone' );

    if( el.attr( 'placeholder' ) )
    {
        el.append( $( '<span class="dz-message">' + el.attr('placeholder') + '</span>' ) );
    }

    return el.dropzone( options );

}

function LinkDropZone( el, options, callback )
{

    var defaults =
    {

        maxFileSize: 2,
        uploadMultiple: false,
        autoProcessQueue: true,
        addRemoveLinks: false,
        previewTemplate: '<div/>',

        init: function()
        {
            this.on( "complete", function( data )
            {
                data = JSON.parse( data.xhr.responseText );
                callback.call( this, data );
                $( '.ajax-rail' ).removeClass( 'on' );
                _giftRewards.unlock();
            } );
        },

        sending: function( file, xhr, formData )
        {
            $( '.ajax-rail' ).addClass( 'on' );
            _giftRewards.lock();
        }

    };

    options = $.extend( {}, defaults, options );
    return el.dropzone( options );

}

if( typeof String.prototype.startsWith != 'function' )
{
    String.prototype.startsWith = function( str )
    {
        return this.slice( 0, str.length ) == str;
    };
}

if( typeof String.prototype.endsWith != 'function' )
{
    String.prototype.endsWith = function( str )
    {
        return this.slice( -str.length ) == str;
    };
}