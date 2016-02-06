function Background( options )
{

    var that = this;

    var defaults =
    {
        initialBackground: 'black',
        transitionSteps: 20
    };

    this.options = $.extend( {}, defaults, options );
    this.key = '';
    this.background = null;
    this.backgroundImage = null;


    /** ---------------------------------------------------------------------------------------------
     *  performs all the page initialisation functions
     **/
    this.init = function()
    {
        that.background = $( '#background' );
        that.render( that.options.initialBackground );
    }


    /* ----------------------------------------------------------------
     * loads a background image or creates an image from a solid color and then calls the renderBackground function.
     * the function can take a color, a relative image url, or a css class containing one of those attributes.
     */
    this.render = function( key )
    {

        if( !key ) // no key was provided, redraw the current background
        {
            renderBackground( null );
            return;
        }

        var color = '';
        var url = '';

        // Its a color
        if( key.lastIndexOf( '#', 0 ) === 0 || key.lastIndexOf( 'rgb(', 0 ) === 0 )
        {
            color = key;
        }

        // Its a relative file, treat it as an image
        else if( key.lastIndexOf( '/', 0 ) === 0 )
        {
            url = key;
        }

        // Its a class, grab the image and color attributes from the class
        else
        {
            url = getCssProperty( 'background-image', key );
            if( url == null || url == 'initial' )
            {
                url = null;
                color = getCssProperty( 'background-color', key );
            }
        }

        // Favour images over colors, if we have an image, load it and render it
        if( url != null )
        {
            url = url.replace( /url\(+/, '' ).replace( /\)$/, '' ).replace(/"/g, ''); // remove the url wrapper from the path

            if( that.key == url ) return;
            if( url == 'none' ) return;

            that.key = url;

            var img = new Image();

            img.onload = function()
            {
                renderBackground( img );
            };

            img.onerror = function()
            {
                log( "failed to load background image: " + url );
            }

            img.src = url;

        }

            // Create an image with a solid color and render it
        else if( color != null )
        {

            if( that.key == color ) return;
            that.key = color;

            var canvas = $( '<canvas width="' + that.background.width() + '" height="' + that.background.height() + '"></canvas>' )[0];
            var ctx = canvas.getContext( "2d" );
            ctx.fillStyle = color;
            ctx.fillRect( 0, 0, canvas.width, canvas.height );
            renderBackground( canvas );
        }

    }


    /* ----------------------------------------------------------------
     * renders the image to the background
     */
    function renderBackground( image )
    {

        image = image || that.backgroundImage;
        if( image == null ) return;
                
        var fadePct = 0;
        var ctx = that.background[0].getContext( '2d' );
        var size = { width: that.background.width(), height: that.background.height() };

        // performs the draw
        function draw( img, opacity )
        {
            ctx.save();
            ctx.globalAlpha = opacity;
            drawImageCover( ctx, img, 0, 0, size.width, size.height );
            ctx.restore();
        }

        // loops within animation frames until the transition hits 100%
        function animateFade()
        {

            if( fadePct > 100 )
            {
                draw( image, 1 );
                return;
            }

            requestAnimationFrame( animateFade );
            draw( image, fadePct / 100 );
            fadePct += 100 / that.options.transitionSteps;

        }

        ctx.canvas.width = size.width;
        ctx.canvas.height = size.height;

        // changing the canvas dimensions will have cleared the background, so we need to immediately 
        // redraw the previous background or it will appear to flicker
        if( that.backgroundImage != null )
        {
            draw( that.backgroundImage, 1 );
        }

        animateFade();

        that.backgroundImage = image;

    }


    /* ----------------------------------------------------------------
     * draws an image onto a context simulating the css style of background: cover
     */
    function drawImageCover( ctx, img, x, y, w, h, offsetX, offsetY )
    {

        if( arguments.length === 2 )
        {
            x = y = 0;
            w = ctx.canvas.width;
            h = ctx.canvas.height;
        }

        // default offset is center
        offsetX = typeof offsetX === "number" ? offsetX : 0.5;
        offsetY = typeof offsetY === "number" ? offsetY : 0.5;

        // keep bounds [0.0, 1.0]
        if( offsetX < 0 ) offsetX = 0;
        if( offsetY < 0 ) offsetY = 0;
        if( offsetX > 1 ) offsetX = 1;
        if( offsetY > 1 ) offsetY = 1;

        var iw = img.width,
            ih = img.height,
            r = Math.min( w / iw, h / ih ),
            nw = iw * r,   // new prop. width
            nh = ih * r,   // new prop. height
            cx, cy, cw, ch, ar = 1;

        // decide which gap to fill    
        if( nw < w ) ar = w / nw;
        if( nh < h ) ar = h / nh;
        nw *= ar;
        nh *= ar;

        // calc source rectangle
        cw = iw / ( nw / w );
        ch = ih / ( nh / h );

        cx = ( iw - cw ) * offsetX;
        cy = ( ih - ch ) * offsetY;

        // make sure source rectangle is valid
        if( cx < 0 ) cx = 0;
        if( cy < 0 ) cy = 0;
        if( cw > iw ) cw = iw;
        if( ch > ih ) ch = ih;

        // fill image in dest. rectangle
        ctx.drawImage( img, cx, cy, cw, ch, x, y, w, h );
    }

}

