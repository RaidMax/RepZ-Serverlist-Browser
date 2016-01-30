// event fired when user types in any of the parameter boxes
$('#filter input').on('input', function (e) {
    filterList($(this));
});

// event fired when user changes a text box  
$('#filter input:checkbox').change(function () {
	alert('test');
    filterList($(this));
});

// listener for hovereffect and info switch
$(document).on('mouseover', '.serverHolder', function (e) {
    $(this).find('.serverPrimary').hide(0);
    $(this).find('.serverSecondary').show(0);
	$(this).css( { 'opacity' : '0.75' } );
});

// listener for hovereffect and info switch - off
$(document).on('mouseout', '.serverHolder', function (e) {
    $(this).find('.serverPrimary').show(0);
    $(this).find('.serverSecondary').hide(0);
	$(this).css( { 'opacity' : '1' } );
});

// listener to copy ip to clipboard
$(document).on("click", ".serverHolder", function () {
    copyToClipboard($(this).find('.serverSecondary .address'));
    alert($(this).find('.serverPrimary .hostname').text() + '\'s IP was copied to your clipboard!');
	//For reference it\'s: ' + $(this).find('.serverSecondary .address').text());
});