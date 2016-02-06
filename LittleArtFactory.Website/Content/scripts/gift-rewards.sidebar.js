function Sidebar()
{

    var that = this;

    /* ----------------------------------------------------------------
     * initialises the sidebar
     */
    this.init = function()
    {

        // Collapse slide-menu if sidebar is closed
        $( '#sidebar,.sidebar-menu-toggle' ).off( 'hide.bs.dropdown' ).on( 'hide.bs.dropdown', function( e )
        {
            $( this ).find( '.dropdown' ).each( function()
            {
                if( $( this ).find( 'ul.sidebar-slide-menu.on' ).length == 1 )
                {
                    closeSlideMenu( $( this ).find( 'ul.sidebar-slide-menu.on' ) );
                }
            } );
        } );

        // Toggle slide-menus
        $( '.sidebar-menu-toggle' ).off( 'click' ).on( 'click', function( e )
        {
            if( $( 'body' ).hasClass( 'sidebar-fixed' ) == false )
            {
                e.stopPropagation(); // otherwise it will close the sidebar
            }
            if( $( this ).siblings( 'ul.sidebar-slide-menu' ).hasClass( 'on' ) )
            {
                closeSlideMenu( $( this ).siblings( 'ul.sidebar-slide-menu.on' ) );
            }

            else
            {
                openSlideMenu( $( this ).siblings( 'ul.sidebar-slide-menu' ) );
            }
        } );

    }

    /* ----------------------------------------------------------------
     * open a slide menu
     */
    function openSlideMenu( menu )
    {
        $( '#sidebar' ).addClass( 'open' );
        menu.css( 'display', 'block' );
        menu.addClass( 'on' );
    }

    /* ----------------------------------------------------------------
     * close a slide menu
     */
    function closeSlideMenu( menu )
    {

        menu.removeClass( 'on' );
        setTimer( 75, function() { menu.css( 'display', 'none' ); } )

        // if we're not loading a new page, dont remove the open state of the sidebar, it will be
        // removed on reload anyway and it makes the animation a little wierd
        if( $( '#sidebar' ).hasClass( 'loading' ) == false )
        {
            $( '#sidebar' ).removeClass( 'open' );
        }
    }

    that.init();

}

