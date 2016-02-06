/** ---------------------------------------------------------------------------------------------
 *  library for specifying logging helpers
 **/
var _logIndex = 1;

/** ---------------------------------------------------------------------------------------------
 *  log the specified values, optionally reset the log index
 **/
function log()
{
    performLog( arguments );
}


function performLog( args, prefix )
{

    var $ipad = $( '#ipad-console-log' );
    var result = _logIndex + '. ';

    if( prefix ) result += prefix;

    var beforeArgsLength = result.length;
    for( var i = 0; i < args.length; i += 1 )
    {

        if( typeof( args[i] ) == 'object' )
        {
            console.log( args[i] );
            if( $ipad.length > 0 )
            {
                $ipad.find( '.mCSB_container' ).append( '<p>' + args[i] + '</p>' );
            }
        }

        else
        {
            result += args[i];
            if( i < args.length - 1 ) result += ', ';
        }
    }

    if( beforeArgsLength < result.length || args.length == 0 )
    {
        console.log( result );
        if( $ipad.length > 0 )
        {
            $ipad.find( '.mCSB_container' ).append( '<p>' + result + '</p>' );
        }
    }

    _logIndex += 1;

}

/** ---------------------------------------------------------------------------------------------
 *  log 'here', optionally reset the log index
 **/
function here()
{
    if( arguments.length > 0 )
    {
        performLog( arguments, 'Here: ' );
        return;
    }
    performLog( [], 'Here' );
}

/** ---------------------------------------------------------------------------------------------
 *  log 'there', optionally reset the log index
 **/
function there( reset )
{
    if( arguments.length > 0 )
    {
        performLog( arguments, 'There: ' );
        return;
    }
    performLog( [], 'There' );
}


/** ---------------------------------------------------------------------------------------------
 *  log 'test', optionally reset the log index
 **/
function test()
{
    if( arguments.length > 0 )
    {
        performLog( arguments, 'Test: ' );
        return;
    }
    performLog( [], 'Test' );
}


/** ---------------------------------------------------------------------------------------------
 *  log 'test', optionally reset the log index
 **/
function one()
{
    if( arguments.length > 0 )
    {
        performLog( arguments, 'One: ' );
        return;
    }
    performLog( [], 'One' );
}


/** ---------------------------------------------------------------------------------------------
 *  log 'test', optionally reset the log index
 **/
function two()
{
    if( arguments.length > 0 )
    {
        performLog( arguments, 'Two: ' );
        return;
    }
    performLog( [], 'Two' );
}


/** ---------------------------------------------------------------------------------------------
 *  log 'test', optionally reset the log index
 **/
function three()
{
    if( arguments.length > 0 )
    {
        performLog( arguments, 'Three: ' );
        return;
    }
    performLog( [], 'Three' );
}


/** ---------------------------------------------------------------------------------------------
 *  log the value, optionally reset the log index
 **/
Number.prototype.log = function()
{
    log( this.valueOf() );
    return this;
};


/** ---------------------------------------------------------------------------------------------
 *  log the value, optionally reset the log index
 **/
String.prototype.log = function()
{
    log( this.valueOf());
    return this;
};


/** ---------------------------------------------------------------------------------------------
 *  log the value, optionally reset the log index
 **/
Boolean.prototype.log = function()
{
    log( this.valueOf() );
    return this;
};


/** ---------------------------------------------------------------------------------------------
 *  log the value, optionally reset the log index
 **/
Number.prototype.l = function()
{
    log( this.valueOf() );
    return this;
};


/** ---------------------------------------------------------------------------------------------
 *  log the value, optionally reset the log index
 **/
String.prototype.l = function()
{
    log( this.valueOf() );
    return this;
};

( function( $ )
{

    /** ---------------------------------------------------------------------------------------------
     *  log the value, optionally reset the log index
     **/
    $.fn.log = function()
    {
        console.log( _logIndex + ". jQuery Object" );
        console.log( $( this ) );

        _logIndex += 1;

        return $( this );
    };


    /** ---------------------------------------------------------------------------------------------
     *  log the length of the object, optionally reset the log index
     **/
    $.fn.logLen = function()
    {
        log( "Length: " + $( this ).length );

        return $( this );
    };

} )( jQuery );

