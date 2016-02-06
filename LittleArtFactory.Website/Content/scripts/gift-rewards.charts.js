Chart.defaults.global.scaleLabel = '<%=numberWithCommas( value )%>';
Chart.defaults.global.tooltipTemplate = '<%if (label){%><%=label%>: <%}%><%= numberWithCommas( value ) %>';
Chart.defaults.global.multiTooltipTemplate = '<%= numberWithCommas( value ) %>';

function Charts( options )
{

    var that = this;

    var defaults =
    {
    };

    this.options = $.extend( {}, defaults, options );

    /** ---------------------------------------------------------------------------------------------
     *  performs all the chart initialisation functions
     **/
    this.init = function()
    {

        // wrap in a timer or sometimes the pie charts throw an error on resize if they
        // are not visible at the point they are created
        setTimer( 300, function()
        {
            initialiseDoughnutCharts();
            initialiseLineCharts();
        } );

    }

    /* ----------------------------------------------------------------
     * initialises doughnut charts
     */
    function initialiseDoughnutCharts()
    {
        $( '.chart-doughnut' ).each( function()
        {
            var canvas = $( this ).find( 'canvas' );
            var ctx = canvas[ 0 ].getContext( '2d' );
            var data = canvas.data( 'chart-json' );
            var options = $( this ).data();
            var chart = new Chart( ctx ).Doughnut( data, options );

        } );
    }

    /* ----------------------------------------------------------------
     * initialises line charts
     */
    function initialiseLineCharts()
    {
        $( '.chart-line' ).each( function()
        {
            var canvas = $( this ).find( 'canvas' );
            var ctx = canvas[0].getContext( '2d' );
            var data = canvas.data( 'chart-json' );
            var options = $( this ).data();
            var chart = new Chart( ctx ).Line( data, options );
        } );
    }

}

