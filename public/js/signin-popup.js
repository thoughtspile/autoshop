(function() {
    $('.popup-holder').each(function() {
        var popupBody = $('.popup', this);
        var popupCtrl = $('.popup-control', this);
        popupCtrl.on('click', function() { popupBody.toggleClass('hide'); });
    });
}());
