function Initialiser( options )
{

    var that = this;

    var defaults =
    {
    };

    this.options = $.extend( {}, defaults, options );

    /** ---------------------------------------------------------------------------------------------
     *  performs all the page initialisation functions
     **/
    this.init = function( url, callback )
    {

        var afterTableInitialisation = function()
        {

            initialiseDropdowns();
            initialiseScrollContent();
            initialiseToggles();
            initialiseDatePickers();
            initialiseDisabledContainers();
            attachAjaxLinks();
            attachModalLinks();
            attachFormEvents();

            if( typeof ( callback ) == 'function' )
            {
                callback.call();
            }

        }

        initialiseTables( url, afterTableInitialisation );

        $( window ).resize();

        /* easter egg! */
        $( 'h3 > span.glyphicon-hand-left' ).addClass( 'coach-point' )
                                            .on( 'dblclick', function() { console.log( 'Finger Bang!' ); } );

    }

    /** ---------------------------------------------------------------------------------------------
     *  attaches events to the anchors in the page
     **/
    function attachAjaxLinks()
    {

        $( 'a[ajax]' ).off( 'mousedown click' )

        .on( 'mousedown', function( event )
        {
            event = event || window.event;
            window.event = event;
        } )

        .on( 'click', function( event )
        {
            if( $(this).closest('#sidebar').length > 0 )
            {
                $( '#sidebar' ).addClass( 'loading' );
            }
            event.preventDefault();
            var url = $( this ).attr( 'href' );
            if( url == '#' ) return;
            _giftRewards.openPage( { url: url } );
        } );

    }

    /** ---------------------------------------------------------------------------------------------
     *  attaches modal events to the anchors in the page
     **/
    function attachModalLinks()
    {

        $( 'a[modal]' ).off( 'mousedown click' )

        .on( 'mousedown', function( event )
        {
            event = event || window.event;
            window.event = event;
        } )

        .on( 'click', function( event )
        {
            event.preventDefault();
            var url = $( this ).attr( 'href' );
            if( url == '#' ) return;
            modal( { url: url } );
        } );

    }

    /** ---------------------------------------------------------------------------------------------
     *  attaches the form events
     **/
    function attachFormEvents()
    {

        var form = $( '.content form' );

        form.on( 'submit', function()
        {

            event.preventDefault();
            event.stopImmediatePropagation();
            form.removeData( "validator" );
            form.removeData( "unobtrusiveValidation" );
            $.validator.unobtrusive.parse( form );

            if( form.valid() )
            {
                var options = { form: form, addToHistory: true };
                _giftRewards.postForm( options, function( data )
                {
                    options.url = data.url;
                    _giftRewards.renderHtml( options, $( data.html ) );
                } );
            }

            return false;

        } );

        form.find( 'input[data-val-required]:not([placeholder])' ).each( function()
        {
            $( this ).attr( 'placeholder', 'Required' );
        } );

        $( 'button[ajax][type="submit"]' ).off( 'mousedown' ).off( 'click' )

        .on( 'mousedown', function( event )
        {
            event = event || window.event;
            window.event = event;
        } );

    }

    /* ----------------------------------------------------------------
     * initialises disabled containers
     */
    function initialiseDisabledContainers()
    {
        $( '.disabled a, .disabled button' ).addClass( 'disabled' );
        $( '.disabled input, .disabled textarea' ).attr( 'readonly', 'true' );
    }

    /* ----------------------------------------------------------------
     * initialises toggles
     */
    function initialiseToggles()
    {
        $( 'input[type=checkbox][data-toggle^=toggle]' ).bootstrapToggle();
    }
    
    /* ----------------------------------------------------------------
     * initialises slimscroll on dropdowns and other scroll content
     */
    that.updateScrollbars = function()
    {
        initialiseScrollContent();
    }

    /* ----------------------------------------------------------------
     * initialises slimscroll on dropdowns and other scroll content
     */
    function initialiseScrollContent()
    {

        $( '#page-wrapper' ).slimScroll(
        {
            height: 'auto',
            width: function() { return 'calc(100% - ' + $( '#sidebar' ).width + 'px)' },
            size: '8px',
            color: '#ffffff',
            distance: '0px',
            opacity: 0.8,
            alwaysVisible: true,
            railVisible: true,
            railColor: '#000000',
            railOpacity: 0.2,
            railBorderRadius: 0,
            borderRadius: 0
        } );

        $( '.bootstrap-select .dropdown-menu.inner' ).slimScroll(
        {
            height: function() { return 'auto' },
            size: '6px',
            color: function() { return $('#var-color-primary').css('color') },
            distance: '2px',
            opacity: 1,
            alwaysVisible: true,
            railVisible: true,
            railColor: '#000000',
            railOpacity: 0.1,
            railBorderRadius: 1,
            borderRadius: 1
        } );

        $( '.table > tbody.scroll-content, .indicator-list.scroll-content' ).slimScroll(
        {

            height: function()
            {
                var firstRow = $( this ).find( 'tr,.indicator.row' )[0];
                var rowHeight = firstRow == undefined ? 30 : $( firstRow ).outerHeight();
                var rows = $( this ).data( 'display-rows' );
                return ( rows * ( rowHeight + 1 ) ) + 'px';
            },

            width: '100%',
            size: '4px',
            color: function() { return $( '#var-color-primary' ).css( 'color' ) },
            distance: '0px',
            opacity: 0.9,
            alwaysVisible: false,
            railVisible: true,
            railColor: '#000000',
            railOpacity: 0.1,
            railBorderRadius: 0,
            borderRadius: 0
        } );

        if( $( '#page-wrapper' ).siblings( '.slimScrollBar' ).is( ':visible' ) == false )
        {
            $( '#page-wrapper' ).siblings( '.slimScrollRail' ).css( 'display', 'none' );
        }

    }

    /* ----------------------------------------------------------------
     * initialises dropdown lists
     */
    function initialiseDropdowns()
    {

        $( 'select' ).on( 'change', function()
        {
            $( this ).parent().find( '.btn.dropdown-toggle' ).removeClass( 'input-validation-error' );
            $( this ).siblings( 'span.field-validation-error' ).css( 'display', 'none' );
        } ).each( function()
        {
            $( this ).parent().siblings( 'span.field-validation-valid' ).insertBefore( $( this ) );
        });

        $( '.selectpicker' ).each( function()
        {
            $( this ).find( 'option[value=""]' ).attr( 'disabled', '' );
            $( this ).selectpicker( { width: '100%' });
            $(this).on( 'change', function()
            {
                $( this ).trigger( 'blur' );
            } );
        } );

        $( 'select[data-depends-on]' ).each( function()
        {

            var dropDown = $(this);
            var dependsOn = $( dropDown.data( 'depends-on' ) );
            var dataUrl = dropDown.data( 'data-url' );
            var eventName = 'change';
            var debounceTime = 1;

            if( dependsOn[0].localName == 'input' )
            {
                eventName = 'keyup';
                debounceTime = 250
            }

            dependsOn.attr( 'data-trigger', eventName );
            dependsOn.attr( 'has-dependants', '' ).on( eventName, debounce( function()
            {

                var readonlyAttribute = $( this ).attr( 'readonly' );
                var isReadOnly = ( typeof ( readonlyAttribute ) !== typeof ( undefined ) && readonlyAttribute !== false ) || dependsOn.hasClass( 'disabled' );

                if( isReadOnly ) return;

                if( dependsOn.val())
                {
                    fillDropDown( eventName, dropDown, dataUrl + '/' + dependsOn.val() + ( dropDown.val() ? '/' + dropDown.val() : '' ) );
                }
                else
                {
                    dropDown.empty();
                    dropDown.selectpicker( 'val', null );
                    dropDown.prop( 'disabled', true );
                    dropDown.selectpicker( 'refresh' );
                }
            }, debounceTime ) );

            if( dropDown.find( ':not(option[value=""])' ).length == 0 )
            {
                dropDown.prop( 'disabled', true );
            }

            dropDown.selectpicker( 'refresh' );
            dropDown.removeAttr( 'disabled' );

        } );

    }


    /* ----------------------------------------------------------------
     * loads data from the url and inserts it into the dropdown
     */
    function fillDropDown( triggerEventName, dropDown, url )
    {

        dropDown.empty();

        $.get( url )
        .success( function( data )
        {
            var items = $( data.items );
            if( items.length > 0 )
            {
                items.each( function() { $( "<option />", { val: this.Value, text: this.Text } ).appendTo( dropDown ); } );
                dropDown.find( 'option[value=""]' ).attr( 'disabled', '' );
                dropDown.prop( 'disabled', false );
                dropDown.selectpicker( 'val', '' );
                dropDown.trigger( triggerEventName );
            }

            if( dropDown.find( ':not(option[value=""])' ).length == 0 )
            {
                dropDown.selectpicker( 'val', '' );
                dropDown.prop( 'disabled', true );
            }

            dropDown.selectpicker( 'refresh' );
            dropDown.removeAttr( 'disabled' );
        } );

    }

    /* ----------------------------------------------------------------
     * initialises tables on the page with default settings. can be overriden
     * in the init event of the page
     */
    function initialiseTables( url, callback )
    {

        var tables = $( '.table.table-ajax' );

        $.fn.dataTable.moment( 'DD/MM/YYYY' );

        var tablesLoaded = 0;
        var tableCount = tables.length;

        var tableLoaded = function( callback )
        {

            tablesLoaded += 1;

            if( tablesLoaded >= tableCount )
            {

                $( '#toggle-active' ).on( 'change', function()
                {
                    tables.each( function()
                    {
                        var table = $( this ).data( 'table' );
                        if( table == undefined ) return;
                        table.setDisplayInactive( $( this ).is( ':checked' ) );
                    } );
                } );

                $( '#search-table' ).on( 'keyup', debounce( function()
                {

                    var search = $( this );
                    var term = search.val();
                    var oldLength = search.data( 'length' ) || 0;
                    var newLength = term.length;

                    $( '#clear-search' ).toggleClass( 'on', newLength > 0 );
                    search.data( 'length', newLength );

                    if( newLength >= 3 || ( newLength < 3 && oldLength >= 3 ) )
                    {
                        if( newLength < 3 ) { term = ''; }
                        var table = $( '.table.table-ajax' ).data( 'table' );
                        if( table == undefined ) return;
                        table.search( term );
                    }

                }, 300 ) );

                if( typeof ( callback ) == 'function' )
                {
                    callback.call();
                }

            }

        }

        // create each table on the page
        tables.each( function()
        {
            var options =
            {
                refreshUrl: url,
                tableLoadedCallback: function() { tableLoaded( callback ); },
                tableDrawCallback: initialiseToggles
            };
            $( this ).table( options );
        } );
            
        if( tables.length == 0 ) tableLoaded( callback );

    }

    /* ----------------------------------------------------------------
     * date pickers
     */
    function initialiseDatePickers()
    {

        /* Single date pickers */
        $( 'input[date-picker]' ).daterangepicker();

        /* Date range pickers */
        $( 'input[date-range-picker]' ).daterangepicker(
        {
            showDropdowns: true,
            format: 'DD/MM/YYYY'/*,
            minDate: '06/01/2015',
            maxDate: '06/30/2015',
            dateLimit: { days: 6 }*/
        } );

    }


}

