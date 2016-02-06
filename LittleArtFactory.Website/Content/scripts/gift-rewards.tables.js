( function( $ )
{

    $.table = function( element, options )
    {

        var _el = $( element );
        var _dataTable = null;
        var _columns = null;
        var _hasReceivedInitialData = false;
        var _hasRaisedLoadedEvent = false;
        
        this.dataTable = null;
        var _defaults =
        {
            refreshUrl: window.location.pathname,
            serverSide: true,
            ordering: false,
            autoWidth: false,
            responsive: true,
            rowTemplate: null,
            tableLoadedCallback: null,
            tableDrawCallback: null,
            columns: getColumns(),
            createdRow: onRowCreated,
            ajax:
            {
                url: options.refreshUrl,
                type: 'POST',
                data: function( d )
                {
                    d = getFilters( d );
                }
            }
        }

        var plugin = this;
        plugin.settings = $.extend( {}, _defaults, options );

        /* ----------------------------------------------------------------
         * constructor
         */
        plugin.init = function()
        {

            if( plugin.settings.rowTemplate == null )
            {
                plugin.settings.rowTemplate = getRowTemplate();
            }

            _el.on( 'init.dt', function()
            {
                _el.addClass( 'loaded' );
            } )

            .on( 'draw.dt', function()
            {
                if( typeof ( plugin.settings.tableDrawCallback ) == 'function' )
                {
                    plugin.settings.tableDrawCallback.call( _el );
                }

                if( _hasReceivedInitialData && _hasRaisedLoadedEvent == false )
                {
                    _hasRaisedLoadedEvent = true;
                    if( typeof ( plugin.settings.tableLoadedCallback ) == 'function' )
                    {
                        plugin.settings.tableLoadedCallback.call( _el );
                    }
                }
            } )

            .on( 'xhr.dt', function( e, settings, json, xhr )
            {
                _hasReceivedInitialData = true;
            } );

            plugin.dataTable = _el.DataTable( plugin.settings );

        }

        /* ----------------------------------------------------------------
         * gets the columns for the table
         */
        function getColumns()
        {
            var result = [];
            _columns = _el.find( 'thead > tr > *[data-map]' );
            _columns.each( function()
            {
                var column = $( this );
                var isVisible = column.data( 'hidden' ) == undefined;
                if( isVisible == false ) column.css( 'display', 'none' );
                result.push( { data: column.data( 'map' ) } );
            } );
            return result;
        }

        /* ----------------------------------------------------------------
         * gets the filters applied to the table headers
         */
        function getFilters( d )
        {
            d.filters = [];
            var filters = _el.find( 'thead > tr > *[data-filter]' );
            filters.each( function() { d.filters.push( { Key: $( this ).data( 'map' ), Value: $( this ).data( 'filter' ) } ) } );
            return d;
        }


        /* ----------------------------------------------------------------
         * gets the tables row template if it has one
         */
        function getRowTemplate()
        {
            var rowTemplate = _el.data( 'row-template' );
            if( rowTemplate.length == 0 ) return null;
            return  _el.data( 'row-template' );
        }

        /* ----------------------------------------------------------------
         * event that fires when a row is created
         */
        function onRowCreated( row, data, index )
        {

            if( plugin.settings.rowTemplate == null ) return;

            var template = $( plugin.settings.rowTemplate );
            var html = '';
            var templateRow = template.tmpl( data );
            var templateCols = templateRow.children( 'td,th' );
            var rowAttributes = templateRow.prop( "attributes" );

            $.each( rowAttributes, function()
            {
                $( row ).attr( this.name, this.value );
            } );

            for( var i = 0; i < templateCols.length; i += 1 )
            {
                var column = $( _columns[i] );
                var isVisible = column.data( 'hidden' ) == undefined;
                if( isVisible ) html += $( '<div/>' ).append( templateCols[i] ).html();
            }

            $( row ).html( html );

        }

        /* ----------------------------------------------------------------
         * refreshes the table
         */
        plugin.refresh = function( resetPage, callback )
        {
            resetPage = resetPage || false;
            plugin.dataTable.ajax.reload( callback, resetPage );
        }

        /* ----------------------------------------------------------------
         * toggles the filtering of the IsActive column if it exists in the table
         */
        plugin.toggleDisplayInactive = function()
        {
            this.setDisplayInactive();
        }

        /* ----------------------------------------------------------------
         * sets the filtering of the IsActive column if it exists in the table to a specific value
         */
        plugin.setDisplayInactive = function( isSet )
        {

            var column = _el.find( 'thead > tr > th[data-map="IsActive"]' );
            var displayInactive = false;

            if( column.length == 0 ) return;

            if( isSet || column.attr( 'data-filter' ) != undefined )
            {
                column.removeAttr( 'data-filter' );
                displayInactive = true;
            }

            else
            {
                column.attr( 'data-filter', 'true' );
            }

            $.cookie( 'DisplayInactive', displayInactive, { expires: 365 } );
            this.refresh();

        }

        /* ----------------------------------------------------------------
         * searches the table
         */
        plugin.search = function( term )
        {
            plugin.dataTable.search( term ).draw();
        }

        plugin.init();

    }

    // add the plugin to the jQuery.fn object
    $.fn.table = function( options )
    {
        return this.each( function()
        {
            // if plugin has not already been attached to the element
            if( undefined == $( this ).data( 'table' ) )
            {
                var plugin = new $.table( this, options );
                $( this ).data( 'table', plugin );
            }
        } );
    }

} )( jQuery );
