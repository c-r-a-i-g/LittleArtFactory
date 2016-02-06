function initialiseAjax()
{

    /* Disable ajax caching */
    $.ajaxSetup( { cache: false } );

    $( document )

    /* Ajax start, show the rail */
    .ajaxStart( function()
    {
        $( '.ajax-rail' ).addClass( 'on' );
        _giftRewards.lock();
    } )

    /* Ajax stop, hide the rail and attach validators to forms */
    .ajaxStop( function()
    {

        $( 'form' ).each( function()
        {
            $( this ).removeData( "validator" );
            $( this ).removeData( "unobtrusiveValidation" );
            $.validator.unobtrusive.parse( $( this ) );
        } );

        $( '.ajax-rail' ).removeClass( 'on' );
        _giftRewards.unlock();

    } )

    /* handle ajax successes globally - display any notifications returned in JSON responses 
     * and handle session timeouts
     */
    .ajaxSuccess( function( event, data, settings ) 
    {

        // The session has timed out, display an alert
        if( data && data.responseJSON && data.responseJSON.IsSessionExpired )
        {
            _giftRewards.notifications.clear();
            modal( { url: '/modals/session-timeout' } );
            return;
        }

        // Data has been returned, capture any messages in the response and display them
        if( data && data.responseJSON && data.responseJSON.notifications && data.responseJSON.notifications.length > 0 )
        {
            var forceToMainTray = data.responseJSON.success ? true : undefined;
            for( var i = 0; i < data.responseJSON.notifications.length; i += 1 )
            {
                var notification = data.responseJSON.notifications[i];
                _giftRewards.notifications.add( notification.Content, notification.CssClass, forceToMainTray );
            }
        }

    })

    /* handle ajax errors globally */
    .ajaxError( function( data )
    {
        _giftRewards.notifications.add( 'Unfortunately there has been an error and the requested action could not be completed.', 'alert-danger' )
    } );

}

