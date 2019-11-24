var sendsign = function() {
    var form = $('#signform');
    var url = "/php/sign.php";
    var sbutton = $('submit-button');
    sbutton.prop("disabled", true);
    $.post(url, form.serialize(), 'json').done(function(data) {
        var resblock = $('#responseblock');
        var error = data.error; //array
        if (error.length === 0) {
            resblock.html("<p>Sottoscrizione registrata</p>");
            resblock.removeClass('text-warning');
            resblock.addClass('text-success');
        } else {
            resblock.removeClass('text-success');
            resblock.addClass('text-warning');
            for (i = 0; i < error.length; i++) {
                err = error[i];
                resblock.append('<p>' + err + '</p>');
            }
        }
    }).fail(function() {
        altext = $('<div/>').html("Errore server. Riprova pi&ugrave; tardi.").text();
        alert(altext);
    });
    return false; // to prevent default form behaviour
};
var shortlistcount = 50;
var showmore = false;
var getsignings = function() {
    var list = $('#xhritalist');
    var listextra = $('#xhritalist-extra');
    var url = "/php/sign.php";
    $.get({
        url: url,
        success: function(data) {
            list.removeClass('error');
            var resobj = data;
            var error = resobj.error;
            var data = resobj.data;
            if (error.length === 0) {
                if (data.length > 0) {
                    list.html("");
                    listextra.html("");
                    $('#signcounter').html(data.length);
                }
                for (i = 0; i < data.length; i++) {
                    el = data[i];
                    line = "<b>" + el.name + " " + el.surname + "</b>, " + el.organisation + " ";
                    if (i < shortlistcount) {
                        list.append("<p>" + line + "</p>");
                    } else {
                        listextra.append("<p>" + line + "</p>");
                    }
                }
            } else {
                list.addClass('error');
                list.html('<p>' + error.join('</p><p>') + '</p>');
            }
        }
    });
}
var showmoretoggle = function() {
    var newshow = !showmore;
    linkelement = $('#showmorelink');
    listextra = $('#xhritalist-extra');
    if (newshow) {
        listextra.removeAttr('hidden');
        linkelement.html("mostra meno");
    } else {
        listextra.attr('hidden', '1');
        linkelement.html("mostra tutti");
    }
    showmore = newshow;
}

$(function(){
    getsignings();
    $('#signform').submit(function(event){
        $(this).removeClass('was-validated');
        if(this.checkValidity() === true){
            sendsign();
        }
        event.preventDefault();
        $(this).addClass('was-validated');
    });
})