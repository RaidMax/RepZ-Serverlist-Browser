// copy the passed in HTML element's text to the clipboard
// it's very dirty :/
function copyToClipboard(element) {
	$( "body" ).append( "<input type='text' id='copyPlaceholder' style='position:absolute;opacity:0;'>" );
	$( "#copyPlaceholder" ).val( 'connect ' + element.html() ).select();
	document.execCommand( "copy" );
	$( "#copyPlaceholder" ).remove();
}

// update the list of servers base on desired settings
// filterTrigger is HTML element that was triggered
function filterList(filterTrigger) {
    var numFound = 0;
    var numEmpty = 0;
    var numFull  = 0;
    // this could use some optimization
    $(".serverHolder").each(function (index) {
        var nameFilter, mapFilter, gametypeFilter, emptyFilter, hcFilter, modFilter = false;
        var serverName = $(this).find('.serverPrimary .hostname').html();
        var pattern = new RegExp(".*" + $('#searchName').val().toLowerCase() + ".*", "g");

        if (serverName.toLowerCase().match(pattern) == null)
            $(this).fadeOut(300);
        else
            nameFilter = true;

        var mapName = $(this).find('.serverPrimary .map').html();
        var pattern = new RegExp(".*" + $('#searchMap').val().toLowerCase() + ".*", "g");
		
        if (mapName.toLowerCase().match(pattern) == null)
            $(this).fadeOut(300);
        else
            mapFilter = true;
			
		var Gametype = $(this).find('.serverPrimary .gametype').html();
        var pattern = new RegExp(".*" + $('#searchGametype').val().toLowerCase() + ".*", "g");
		
        if (Gametype.toLowerCase().match(pattern) == null)
            $(this).fadeOut(300);
        else
            gametypeFilter = true;

        if ($(this).find('.serverPrimary .players').html().substring(0, 1) == '0' && $('#searchEmpty').prop('checked') == true)
            $(this).fadeOut(300);
        else
            emptyFilter = true;

        if ($(this).find('.serverSecondary .hardcore').html() == "Normal" && $('#searchHC').prop('checked') == true)
            $(this).fadeOut(300);
        else
            hcFilter = true;

        if ($(this).find('.serverSecondary .mod').html() != "Vanilla" && $('#searchMod').prop('checked') == true)
            $(this).fadeOut(300);
        else
            modFilter = true;

        if (mapFilter && nameFilter && emptyFilter && hcFilter && modFilter && gametypeFilter) {
            numFound++;
            var players = $(this).find('.serverPrimary .players').html().split('/');
            // count servers with the filtered data
            if (players.length == 2) {
                if (players[0] == '0')
                    numEmpty++;
                if (players[0] == players[1])
                    numFull++;
            }
            $(this).fadeIn(300);
        }
    });
    // update left bar and main counter statistics
    populateStatistics(String(numFound), String(numFull), String(numEmpty));
}

function populateServers(serverData) {
    var totalEmpty = 0;
    var totalFull = 0;
	var totalPlayers = 0;
	
    for (server in serverData) {
        var curServer = serverData[server].Info;
        var curSession = serverData[server].session;

        if (curServer == undefined || curSession == undefined)
            continue;

        if (curServer.clients == 0)
            totalEmpty++;
        else if (curServer.clients == curServer.sv_maxclients)
            totalFull++;
			totalPlayers += parseInt(curServer.clients);
			
        $('#serverBasket').append(
        '<a href="repziw4m://' + ipv4FromNumber(curSession.address) + ':' + curSession.port + '"><div class="serverHolder" id="' + serverData[server].session.npid + '"> \
                    <div class="mapImage" style="background-image: url(' + getImageForMapname(curServer.mapname) + ');"></div> \
                    <div class="mapSpacer"></div> \
                    <div class="serverPrimary"> \
                        <span class="hostname">'+ cleanColors(curServer.hostname) + '</span><br /> \
                        <span class="map">' + cleanColors(localizedMapname(curServer.mapname)) + '</span><br /> \
                        <span class="gametype">' + cleanColors(localizedGametype(curServer.gametype)) + '</span><br /> \
                        <span class="players">'+ curServer.clients + '/' + curServer.sv_maxclients + '</span> \
                    </div> \
                <div class="serverSecondary"> \
                    <span class="address" id="serverip_' + serverData[server].session.npid + '">' + ipv4FromNumber(curSession.address) + ':' + curSession.port + '</span><br /> \
                    <span class="version">' + curServer.shortversion + '</span><br /> \
                    <span class="hardcore">' + localizedHC(curServer.hc) + '</span><br /> \
                    <span class="mod">'+ localizedFSGame(curServer.fs_game) + '</span> \
                    <div style="clear: both;"></div> \
                </div> \
            </div></a>' );
    }
	
    populateStatistics(String(serverData.length), totalFull, totalEmpty, totalPlayers);
}

function populateStatistics(numServers, numFull, numEmpty, totalPlayers) {
    $('#serverCount').html('');
    for (digit in numServers) {
        $('#serverCount').append('<span>' + numServers.charAt(digit) + '</span><br/>');
    }

    if (numFull > -1 && numEmpty > -1) {
        $('#fullServersCount').html(String(numFull));
        $('#emptyServersCount').html(String(numEmpty));
    }
	
	if (totalPlayers > 0)
		$('#totalPlayerCount').text(totalPlayers);
}

$.getJSON("http://server.repziw4.de/api/findSessions/61586/1", function (Response) {
    if (Response[0] != undefined && Response[0].status == 204) {
        $('#subtitle h3').text("NO SERVERS FOUND!");
    }

    else {
        $('#subtitle h3').text("DEDICATED SERVERS");
        populateServers(Response);
    }
});