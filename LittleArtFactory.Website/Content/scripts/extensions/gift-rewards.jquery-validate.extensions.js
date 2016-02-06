$.validator.setDefaults({ 
    ignore: []
} );


$.fn.addError = function( element, message )
{
    var val = $.data( this.closest('form')[0], "validator" );
    var error = {};
    error[element.attr('name')] = message;
    val.showErrors( error );
}

jQuery().ready( function()
{
    // jQuery date validate fix: Chrome (at v22) validates as US date so fails UK (etc) dates like 13/1/2012
    //      - This is contrary to Validate docs which say order doesn't matter: http://docs.jquery.com/Plugins/Validation/Methods/date
    //      - To workaround, if validation fails, accept any string in "x/x/xx" format, where x = one or more digits
    //      - Credit: Neogic Web Solutions Ltd - www.neogic.com
    jQuery.validator.methods.date = function( value, element )
    {
        return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ) ) || /^(\d+)\/(\d+)\/(\d{2,})$/.test( value );
        // OLD: return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
    }

} );


jQuery.validator.unobtrusive.adapters.add( "brequired", function( options )
{
    //b-required for checkboxes
    if( options.element.tagName.toUpperCase() == "INPUT" && options.element.type.toUpperCase() == "CHECKBOX" )
    {
        //setValidationValues(options, "required", true);
        options.rules["required"] = true;
        if( options.message )
        {
            options.messages["required"] = options.message;
        }
    }
} );

$.validator.setDefaults(
{
    showErrors: function( errorMap, errorList )
    {

        var form = $( $( this )[0].currentForm );
        var submitButton = null;
        var otherSubmitButtons = null;

        if( form.data( 'submit-button' ) == null )
        {
            submitButton = form.find( 'input[type="submit"].btn-success,button[type="submit"].btn-success,#submit-form.btn-success,#save-modal.btn-success' ).not( '.no-error-highlight' ).first();
            form.data( 'submit-button', submitButton );
        }

        else
        {
            submitButton = form.data( 'submit-button' );
        }

        if( form.data( 'other-submit-buttons' ) == null )
        {
            otherSubmitButtons = form.find( 'a.submit.btn-success,input.submit.btn-success,button.submit.btn-success' ).not( submitButton ).not( '.no-error-highlight' );
            form.data( 'other-submit-buttons', otherSubmitButtons );
        }

        else
        {
            otherSubmitButtons = form.data( 'other-submit-buttons' );
        }

        if( errorList.length < 1 )
        {
            // clear the error if validation succeeded
            this.defaultShowErrors();

            $( '.field-error' ).each( function()
            {
                var parent = $( this ).parent();
                if( parent.find( '.field-validation-error' ).length == 0 )
                {
                    parent.find( '.field-error' ).remove();
                    errors -= 1;
                }
            } );

            // clear any tabs that no longer have errors
            $( '.nav-tabs>li.has-error' ).each( function()
            {
                var anchor = $( this ).find( 'a[data-toggle="tab"]' );
                var pane = $( anchor.attr( 'href' ) );
                errors = pane.find( '.field-error' );
                if( errors.length == 0 )
                {
                    anchor.closest( 'li' ).removeClass( 'has-error' );
                }
            } );

            var errors = $( '.field-error' ).length;
            if( errors == 0 )
            {
                var label = submitButton.data('label');
                submitButton.removeClass( 'btn-danger disabled' )
                            .addClass('btn-success')
                            .text( label );
                otherSubmitButtons.each( function()
                {
                    $( this ).removeClass( 'btn-danger disabled' )
                             .addClass( 'btn-success' );
                } );
            }

            else
            {
                var label = errors == 1 ? '1 error to resolve' : errors + ' errors to resolve';
                submitButton.text( label );
            }

            return;
        }

        $.each( errorList, function( index, error )
        {

            $( error.element ).parent().find( '.field-error' ).remove();

            var icon = $( '<div class="validation-error-icon glyphicon glyphicon-pencil"/>' );
            var message = $( '<span class="error-message">' + error.message + '</span>' );
            var fieldError = $( '<span/>' )
                    .addClass( 'field-error' )
                    .append( icon )
                    .append( message );

            $( error.element ).after( fieldError );

            icon.bind( 'mouseenter mouseout click', function() { message.toggleClass( 'on' ); } );

            var el;

            // Dropdowns
            if( error.element.localName == 'select' )
            {
                el = $( error.element ).parent().find( '.btn.dropdown-toggle' );
                el.addClass( 'input-validation-error' );
            }

            // Checkboxes
            else if( error.element.localName == 'input' && $(error.element).attr('type') == 'checkbox' )
            {
                el = $( error.element ).closest( '.checkbox' );
                el.addClass( 'input-validation-error' );
            }

            // Inputs
            else
            {
                el = $( error.element );
            }

            if( el != undefined )
            {
                fieldError.css( { 'width': el.outerWidth() } );
                message.css( { 'height': el.outerHeight(), 'line-height': el.outerHeight() + 'px' } );
            }

            // Tabs with errors
            var tabPane = $( error.element ).closest( '.tab-pane' );
            if( tabPane.length > 0 )
            {
                var tabId = tabPane.attr( 'id' );
                var tab = $( 'a[href="#' + tabId + '"]' );
                tab.closest('li').addClass( 'has-error' );
            }

        } );

        var errors = $( '.field-error' ).length;

        //var errors = errorList.length;
        var label = errors == 1 ? '1 error to resolve' : errors + ' errors to resolve';
        if( submitButton.hasClass( 'btn-danger' ) == false )
        {
            submitButton.addClass( 'btn-danger disabled' )
                        .removeClass( 'btn-success' )
                        .data( 'label', submitButton.text() );
            otherSubmitButtons.each( function()
            {
                $( this ).removeClass( 'btn-success' )
                         .addClass( 'btn-danger disabled' );
            } );
        }
        submitButton.text( label );

        this.defaultShowErrors();
    }
} );
