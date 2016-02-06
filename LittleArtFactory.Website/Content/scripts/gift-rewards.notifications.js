function Notifications( options )
{

    var that = this;

    var defaults =
    {
    };

    this.options = $.extend( {}, defaults, options );

    var _notificationIndex = 0;

    /* ----------------------------------------------------------------
     * displays a notification
     */
    this.add = function( content, cssClass, forceToMainTray )
    {

        var existing = $( '.notification div.' + cssClass + ':contains(' + content + ')' );

        if( existing.length > 0 )
        {
            var timer = existing.closest( '.notification' ).data( 'timer' );
            timer.reset( that.options.notificationTimeout );
            var counter = existing.siblings( '.counter' );
            counter.text( parseInt( counter.text() ) + 1 ).addClass( 'on' );
            return;
        }

        _notificationIndex += 1;

        content = '<a href="javascript:void(0)" class="close" data-dismiss="alert">&times;</a>' + content;

        var modalTray = $( '#modal-notification-tray' );
        var tray = modalTray.length > 0 && forceToMainTray != true ? modalTray : $( '#notification-tray' );

        var id = '#notification' + _notificationIndex;
        var notification = $( '<div id="' + id + '" class="notification"><div class="counter">1</div><div class="alert ' + cssClass + '">' + content + '</div></div>' );

        tray.append( notification );

        notification.find( 'a.close' ).on( 'click', function()
        {
            $( this ).closest( '.notification' ).remove();
        } );

        setTimeout( function() // small delay to allow the item to be added to dom
        {
            notification.addClass( 'on' );
            var timer = setTimer( that.options.notificationTimeout, function()
            {
                notification.removeClass( 'on' );
                setTimeout( function() { notification.remove(); }, 300 );
            } );
            notification.data( 'timer', timer );
        }, 100 );

    }

    /* ----------------------------------------------------------------
     * takes the notifications returned in a response and displays them
     */
    this.handleResponseNotifications = function( notifications )
    {
        if( notifications == null ) return;

        setTimeout( function() // small delay for aesthetics
        {
            for( var i = 0; i < notifications.length; i += 1 )
            {
                that.add( notifications[i].Content, notifications[i].CssClass );
            }
        }, 750 );
    }

    /* ----------------------------------------------------------------
     * clears any visible notifications
     */
    this.clear = function()
    {
        var trays = $( '#notification-tray,#modal-notification-tray' );
        trays.empty();
    }

}

