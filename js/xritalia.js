var animateScrollToElement = function(jelement){
    var navheight = $('nav').height();
    if(!(navheight>0))
        navheight = 0;
    $('html, body').stop().animate({
        scrollTop: (jelement.offset().top - navheight)
    }, 1250, 'easeInOutExpo');
};
var setOffset = function(){
    var navheight = $('nav').outerHeight();
    $("#page-content").css('top', navheight);
}
var municipalities = {
    "Lombardia": [],
    "Piemonte": [],
    "Veneto": [],
    "Campania": [],
    "Calabria": [],
    "Sicilia": [],
    "Lazio": [],
    "Sardegna": [],
    "Emilia-Romagna": [],
    "Abruzzo": [],
    "Trentino-Alto Adige": [],
    "Toscana": [],
    "Puglia": [],
    "Liguria": [],
    "Marche": [],
    "Friuli-Venezia Giulia": [],
    "Molise": [],
    "Basilicata": [],
    "Umbria": [],
    "Valle d'Aosta": [],
};
var fillMunicipalities = function(munlist){
    $('#city').autocomplete({
        source: munlist
    }).removeAttr('disabled');
};
(function($) {
    "use strict"; // Start of use strict

    setOffset();
    $(window).resize(function(){
        setOffset();
    });
    if(location.hash.length > 0){
        animateScrollToElement($(location.hash));
    }

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this).prop('href');
        var url = new URL($anchor)
        animateScrollToElement($(url.hash)); 
    });
    // Highlight the top nav as scrolling occurs
    // $('body').scrollspy({
    //     target: '.navbar-fixed-top',
    //     offset: 51
    // });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function(){
        $('.navbar-toggle:visible').click();
    });

    $('#city')
        .attr('disabled', true)
        .val("");
    $('#regione').val('');
    // when selecting region, download municipality list
    $('#regione').change(function(){
        $('#city').attr('disabled', true).val("").addClass('loading');
        var selected = $(this).val();
        if(selected.length === 0) return;
        var regionlist = municipalities[selected];
        if(regionlist.length > 0){
            fillMunicipalities(regionlist);
        }else{
            var url = "/php/municipalities.php"
            $.ajax({
                url: url,
                method: 'GET',
                data: {region: selected},
                dataType: 'json',
                success: function(data){
                    if(data.error){
                        console.log(data.error);
                    }else{
                        var clist = [];
                        $(data.htmldata).find('table').eq(2).find('tbody a').each(function(id, el){
                            var href = $(el).prop('href');
                            if(href.search('comune=') >= 0){
                                clist.push($(el).html());
                            }
                        });
                        fillMunicipalities(clist);
                        municipalities[selected] = clist;
                    }
                },
                complete: function(){
                    $('#city').removeClass('loading');
                }
            });
        }
    });
    $('#gdpr-consent').change(function(event){
        if ($(this).prop("checked")) {
            // checked
            $('#submit').removeClass('disabled');
            return;
        }
        // not checked
        $('#submit').addClass('disabled');
    }).change();
    $('#contactForm').submit(function(event){
        $(this).removeClass('was-validated');
        if(this.checkValidity() === true){
            var fr = $('#contactForm .form-response');
            fr.html('&nbsp;').addClass('loading loading-centered');
            $('#contactForm [type=submit]').attr('disabled', true);
            var data = $(this).serialize();
            $.ajax({
                url: "/php/contact.php",
                method: "POST",
                data: data,
                dataType: 'json',
                success: function(data){
                    fr.html("");
                    if(data.errors){
                        for(var i=0; i<data.errors.length; i++){
                            var err = data.errors[i];
                            fr.append('<p class="text-danger">' + err + '</p>');
                        }
                    }else if(data.message){
                        fr.append('<p class="text-primary">' + data.message + '</p>');
                    }
                },
                error: function(){
                    var altext = $('<div/>').html("Errore server. Riprova pi&ugrave; tardi.").text();
                    alert(altext);
                },
                complete: function(){
                    $('#contactForm [type=submit]').attr('disabled', null);
                    fr.removeClass('loading loading-centered');
                }
            });
        }
        event.preventDefault();
        $(this).addClass('was-validated');
    });

})(jQuery); // End of use strict
