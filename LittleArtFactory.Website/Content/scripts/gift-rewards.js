function GiftRewards( options )
{

    var that = this;

    var defaults =
    {
        background: 'red',
        notificationTimeout: 30000
    };

    this.options = $.extend( {}, defaults, options );

    this.sidebar = null;
    this.charts = new Charts();
    this.initialiser = new Initialiser();
    this.background = null;
    this.pageData = undefined;
    this.notifications = new Notifications( this.options );


    /* ----------------------------------------------------------------
     * initialises giftrewards client
     */
    this.init = function()
    {

        $( document ).ready( function()
        {
            initialisePage();
        } );

        initialiseAjax();
        history.replaceState( { url: window.location.href }, "", window.location.href );

        that.background = new Background( { initialBackground: that.options.background } );
        that.background.init();

        window.onpopstate = function( event )
        {
            if( event != null && event.state != null )
            {
                that.openPage( { 'page-title': document.title, url: event.state.url, addToHistory: false } );
            };
        };

        $( window ).debounceResize( function()
        {
            $( '#sidebar' ).height( $( '#page-wrapper' ).height() );
            that.initialiser.updateScrollbars();
            that.background.render();
            $( '.scroll-content' ).mouseover();
        } );

        handlePageChange( { url: window.location.pathname, oldUrl: '' } );

    }

    /* ----------------------------------------------------------------
     * initialises the page, creating any bootstrap ui elements and handling event hookups
     */
    function initialisePage( url, callback )
    {

        url = url || window.location.pathname;

        that.sidebar = new Sidebar();
        that.initialiser.init( url, function()
        {

            that.charts.init();

            retrievePageData();
            that.notifications.handleResponseNotifications( JSON.parse( $( '#server-notifications' ).val() ) );

            if( _page != null && typeof ( _page.init ) == 'function' )
            {
                _page.init();
            }

            // animate any numbers that have the animation attribute
            $( '*[data-animate-number]' ).each( function()
            {
                $( this ).animateNumber();
            } )

            if( typeof(callback) == 'function')
            {
                callback.call();
            }
        
        } );

    }

    /* ----------------------------------------------------------------
     * sets the active state of the specified entity
     */
    this.setActiveState = function( el )
    {
        var table = el.closest( '.table' );
        if( table.length == 0 ) return;
        var dataTable = table.data( 'table' ).dataTable;
        var name = table.data('entity-name');
        var row = dataTable.row( el.closest( 'tr' ) ).index();
        var col = dataTable.column( 'thead > tr > th[data-map="IsActive"]' ).index();
        var state = ( dataTable.cell( row, col ).data().toString().toLowerCase() == 'true' ? false : true );

        $.post( '/admin/set-active-state', { entityName: name, primaryKey: el.data( 'id' ), activeState: state } )
        .done( function( data )
        {
            el.closest( 'tr' ).toggleClass( 'inactive', state == false )
            el.text( state ? 'Disable' : 'Enable' );
            dataTable.cell( row, col ).data( state ).draw();
        } );
    }

    /* ----------------------------------------------------------------
     * makes a copy of the specified entity
     */
    this.copyEntity = function( el )
    {
        var table = el.closest( '.table' );
        if( table.length == 0 ) return;
        var name = table.data( 'entity-name' );
        var editorPath = table.data( 'editor-path' );
        $.post( '/admin/copy-entity', { entityName: name, primaryKey: el.data( 'id' ) } )
        .done( function( data )
        {
            if( data.success ) that.openPage( { url: editorPath + '/' + data.Key + '?copy=true' } )
        } );
    }

    /* ----------------------------------------------------------------
     * loads a page using ajax and renders the results
     */
    this.openPage = function( options )
    {

        if( $( '#sidebar' ).hasClass( 'open' ) )
        {
            $('#sidebar').addClass('loading');
        }

        var defaults =
        {
            url: '/',
            addToHistory: true
        };

        options = $.extend( {}, defaults, options );

        $.get( options.url )

        .success( function( data )
        {
            setTimer( 100, function()
            {
                that.renderHtml( options, $( data.html ) );
            } );
        } );

    }

    /* ----------------------------------------------------------------
     * posts a form using ajax and renders the results
     */
    this.postForm = function( options, callback )
    {

        var defaults =
        {
            url: options.form.attr('action'),
            addToHistory: true
        };

        options = $.extend( {}, defaults, options );

        $.post( options.url, options.form.serialize() )

        .fail( function( data )
        {
            log( 'error' );
            log( data );
        } )

        .done( function( data )
        {

            // User has just logged in
            if( options.url == "/login" )
            {
                that.notifications.clear();
            }

            if( typeof ( callback ) == 'function' )
            {
                callback.call( this, data );
            }
        } );

    }


    this.logoff = function()
    {
        var options = {
            form: $( '#logout-form' ),
            addToHistory: false
        };

        that.postForm( options, function( data )
        {
            options.url = data.url;
            _giftRewards.renderHtml( options, $( data.html ) );
            window.history.replaceState( null, 'Login', '/login' );
        } );
    }

    /* ----------------------------------------------------------------
     * retrieves any page data that was sent to the client
     */
    function retrievePageData()
    {
        that.pageData = undefined;
        var encoded = $( '#page-data' ).val();
        if( encoded.length > 0 )
        {
            that.pageData = JSON.parse( atob( encoded ) );
        }
    }

    /* ----------------------------------------------------------------
     * renders html that was returned from a get or post action
     */
    this.renderHtml = function( options, html )
    {

        if( html && html.length == 0 )
        {
            that.notifications.add( 'Unfortunately there has been an error and the requested action could not be completed. The page request did not return any data from the server.', 'alert-danger' )
            return;
        }

        options.oldUrl = options.oldUrl || window.location.pathname;

        var pageTitle = html.find( '#ajax-page-title' ).val();
        var bodyClass = html.find( '#ajax-body-class' ).val();
        var pageData = html.find( '#ajax-page-data' ).val();
        var pageBackground = html.find( '#ajax-page-background' ).val();
        var sidebarClass = ( $( '#sidebar' ).attr( 'class' ) || '' ).replace('open','');

        var transitionOut = function()
        {
            $( '#page-wrapper .content' ).removeClass( 'on' );
            that.background.render( pageBackground );
        }

        var replaceContent = function( callback )
        {

            // The page has an onleave event, so call it before the page object is destroyed.
            if( _page != null && typeof( _page.onLeave ) == 'function' )
            {
                _page.onLeave();
            }

            _page = null;
      
            setTimer( 120, function()
            {
                $( '#page-wrapper .content' ).replaceWith( html.find( '#page-wrapper .content' ) );
                $( '#page-header' ).replaceWith( html.find( '#page-header' ) );
                $( '#server-notifications' ).replaceWith( html.find( '#server-notifications' ) );
                $( '#sidebar' ).replaceWith( html.find( '#sidebar' ) );
                $( '#page-data' ).val( html.find( '#ajax-page-data' ).val() );
                $( 'body' ).attr( 'class', bodyClass + ' ' + pageBackground );

                if( sidebarClass && sidebarClass.length > 0 )
                {
                    $( '#sidebar' ).addClass( sidebarClass );
                }

                var script = html.find( 'script[type!="text/x-jQuery-tmpl"]' ).text();
                if( script.length > 0 )
                {
                    eval( script );
                }

                initialisePage( options.url, callback );
                document.title = pageTitle;

                if( options.addToHistory )
                {
                    history.pushState( { 'page-title': pageTitle, url: options.url }, "", options.url );
                }

                //callback.call();
            } );

        }

        var transitionIn = function()
        {

            var cascade = 0;
            $( '#page-wrapper .content' ).addClass( 'on' );

            $( "*[class$='-animation'],*[class*='-animation ']" ).each( function()
            {
                var animate = function( el )
                {
                    el.removeClassSuffix( '-animation' );
                };
                setTimeout( animate, cascade, $(this) );
                cascade += 0;//50;
            } );

            setTimer( 1000, function()
            {
                $( '#sidebar' ).removeClass( 'loading' );
            } );

        }

        handlePageChange( options, html, function()
        {
            transitionOut();
            setTimeout( replaceContent, 220, transitionIn );
        } );

    }


    /* ----------------------------------------------------------------
     * gives us a chance to detect the page change and take according action
     */
    function handlePageChange( options, html, callback )
    {

        var newUrl = options.url.replace( window.location.origin, '' );
        var oldUrl = options.oldUrl;

        // successful login
        if( oldUrl.startsWith( '/login' ) && newUrl.startsWith( '/login' ) == false )
        {
            $( '.login-outer-wrapper' ).addClass( 'success' );
            setTimer( 300, callback );
            return;
        }

        // failed login
        else if( oldUrl.startsWith( '/login' ) && newUrl.startsWith( '/login' ) )
        {

            $( '.login-wrapper' ).replaceWith( html.find( '.login-wrapper' ) );

            setTimer( 300, function()
            {
                initialisePage();
                $( '.login-wrapper' ).addClass( 'shake' );
                $( '#Password' ).val( '' ).focus();
                setTimer( 1000, function() { $( '.login-wrapper' ).removeClass( 'shake' ); } );
            } );

            return;
        }

        // returning to login or first load
        else if( oldUrl.startsWith( '/login' ) == false && newUrl.startsWith( '/login' ) )
        {
            setTimer( 750, function()
            {
                $( '.login-outer-wrapper.off' ).removeClass( 'off' );
            } );
        }

        if( typeof(callback) == 'function') callback.call();

    }

    /* ----------------------------------------------------------------
     * locks the page so that it cannot receive mouse events
     */
    this.lock = function()
    {
        $( 'body' ).addClass( 'locked' );
    }

    /* ----------------------------------------------------------------
     * unlocks the page so that it can receive mouse events
     */
    this.unlock = function()
    {
        $( 'body' ).removeClass( 'locked' );
    }

}

