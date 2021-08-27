(async function() {
    var ytlink = window.location.href;
    var videoID = ytlink.split('v=').pop().split('&')[0];
    if (window.location.host != 'www.youtube.com' && window.location.host != 'youtube.com') {
        alert('[ytdl] Only works on youtube');
        return;
    };
    if (ytlink.split('v=').length == 1 && ytlink.split('/channel/').length == 1 && ytlink.split('/c/').length == 1 && ytlink.split('/user/').length == 1 && ytlink.split('list=').length == 1) {
        alert('[ytdl] Please open a video');
        return
    };
    if (! String.prototype.replaceAll) {
        String.prototype.replaceAll = function(a, b) {
            return this.split(a).join(b);
        };
    };
    function error(e) {
        console.error(e);
        alert('[ytdl] Please reload page and try again');
    };
    function decryptURL(e) {
        var jG = function(a){a.reverse()};
        var F3 = function(a,b){a.splice(0,b)};
        var Wp = function(a,b){var c=a[0];a[0]=a[b%a.length];a[b%a.length]=c};
        var decryptSig = function(a){a=a.split("");F3(a,3);Wp(a,4);F3(a,2);jG(a,35);F3(a,1);Wp(a,37);F3(a,3);return a.join("")};
        var url = e.split('&');
        var a = { };
        for (var i=0; i<url.length; i++) {
            var b = url[i].split('=');
            a[b[0]] = b[1];
        };
        a.s = decodeURIComponent(a.s);
        a.url = decodeURIComponent(a.url);
        return a.url + '&' + a.sp + '=' + decryptSig(a.s);
    };
    async function playlist(id) {
        try {
            var mainPage = await fetch('https://www.youtube.com/playlist?list=' + id);
            var body = await mainPage.text();
            var pageInfo = body.split('<script' + body.split('var ytInitialData = ')[0].split('<script').pop() + 'var ytInitialData = ')[1].split('</script>')[0];
            var pageInfo = eval('(function() {return ' + pageInfo + '})();');
            var info = pageInfo.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;
        } catch(e) {
            error(e);
            return;
        };
        var baseURL = 'https://www.youtube.com/watch?v=';
        var blobData = '<p>YouTube Downloader Version 1.7</p>\n\n<p>Title: ' + pageInfo.metadata.playlistMetadataRenderer.title + '</p>\n\n';
        blobData += '<style>diz {width: 119px; border: solid 1px; float: left; padding: 10px 0;}</style>\n';
        blobData += '<script>function updateUI(e) {var a=document.getElementsByName("a");var b=document.getElementsByName("b");var c=document.getElementsByName("c");for (var i=0; i<a.length; i++) {if (e == "a") {a[i].style="display:block;";} else {a[i].style="display:none;";};};for (var i=0; i<b.length; i++) {if (e == "b") {b[i].style="display:block;";} else {b[i].style="display:none;";};};for (var i=0; i<c.length; i++) {if (e == "c") {c[i].style="display:block;";} else {c[i].style="display:none;";};};};function updateUIa() {updateUI("a")};function updateUIb() {updateUI("b")};function updateUIc() {updateUI("c")};</script>\n';
        blobData += '<nav style="text-align: center;"><a href="javascript:void(0);" onClick="javascript:updateUIa()"><diz>Video & Audio</diz></a><a href="javascript:void(0);" onClick="javascript:updateUIb()"><diz>Only Video</diz></a><a href="javascript:void(0);" onClick="javascript:updateUIc()"><diz>Only Audio</diz></a></nav>\n<br><br><br>\n';
        for (var q=0; q<info.length; q++) {
            var error = false;
            var videoNum = q + 1;
            try {
                var page = await fetch(baseURL + info[q].playlistVideoRenderer.videoId);
                var body = await page.text();
                var body = body.split('<script' + body.split('var ytInitialPlayerResponse = ')[0].split('<script').pop() + 'var ytInitialPlayerResponse = ')[1].split('</script>')[0];
                var pageInfo = eval('(function() {return ' + body + '})();');
                var urls = pageInfo.streamingData.formats;
                var adaptiveUrls = pageInfo.streamingData.adaptiveFormats;
                var videoTitle = pageInfo.videoDetails.title;
            } catch(e) {
                var error = true;
                blobData += '<p>Video ' + videoNum + ': error fetching or parsing data</p>';
            };
            if (! error) {
                blobData += '<p>Video ' + videoNum + ': ' + videoTitle + '</p>\n';
                for (var i=0; i<urls.length; i++) {
                    var a = urls[i].cipher || urls[i].signatureCipher;
                    if (a) {
                        urls[i].url = decryptURL(a);
                    };
                };
                for (var i=0; i<adaptiveUrls.length; i++) {
                    var a = adaptiveUrls[i].cipher || adaptiveUrls[i].signatureCipher;
                    if (a) {
                        adaptiveUrls[i].url = decryptURL(a);
                    };
                };
                if (! error) {
                    blobData += '<div name="a">';
                    for (var i=0; i<urls.length; i++) {
                        blobData += '<p>Quality: ' +urls[i].qualityLabel + '; fps: ' + urls[i].fps + '; Mimetype: ' +urls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + urls[i].url + '">Open</a> <a target="_blank" href="' + urls[i].url + '&title=' +
videoTitle.replaceAll(' ', '+') + '">Download</a></p>\n';
                    };
                    blobData += '</div>\n';
                    blobData += '<div name="b" style="display:none;">';
                    blobData += '\n';
                    for (var i=0; i<adaptiveUrls.length; i++) {
                        if (adaptiveUrls[i].mimeType.split('/')[0] == 'video') {
                            blobData += '<p>Quality: ' + adaptiveUrls[i].qualityLabel + '; fps: ' + adaptiveUrls[i].fps + '; Mimetype: ' + adaptiveUrls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + adaptiveUrls[i].url + '">Open</a></p>\n';
                        };
                    };
                    blobData += '</div>\n';
                    blobData += '<div name="c" style="display:none;">';
                    blobData += '\n';
                    for (var i=0; i<adaptiveUrls.length; i++) {
                        if (adaptiveUrls[i].mimeType.split('/')[0] == 'audio') {
                            blobData += '<p>Bitrate: ' + adaptiveUrls[i].bitrate + '; Mimetype: ' + adaptiveUrls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + adaptiveUrls[i].url + '">Open</a></p>\n';
                        };
                    };
                    blobData += '</div>\n';
                    blobData += '<br>';
                };
            };
        };
        window.open(URL.createObjectURL(new Blob([blobData], {type : 'text/html; chartset=utf-8'})), "Download", "width=600,height=600");
    };
    async function membersOnlyPlaylist(){
            const channelId = await async function () {
            const channelUrlLead = ["https://www.youtube.com/channel/", "http://www.youtube.com/channel/"];
            const targets = [location.href];
            for(const t of targets){
                for(const c of channelUrlLead){
                    if (t && t.startsWith(c)){
                        return t.split(/[?#]/)[0].substr(c.length);
                    }
                }
            };
            const resp = await fetch(location.href);
            const doc = new DOMParser().parseFromString(await resp.text(), "text/html");
            try {
                return doc.querySelector("meta[itemprop='channelId']").getAttribute("content");
            } catch (_) {};
        }();
        if (channelId) {
            window.open(`https://www.youtube.com/playlist?list=UUMO${channelId.substr(2, 22)}`, "_blank");
        } else {
            console.log(`[MEMBERSHIP PLAYLIST REDIRECT] Cannot get channel ID on ${location.href}`);
            var chanId = function () {
                if (
                    window.hasOwnProperty('ytInitialPlayerResponse') &&
                    window['ytInitialPlayerResponse'] != null &&
                    window['ytInitialPlayerResponse'].hasOwnProperty('videoDetails') &&
                    window['ytInitialPlayerResponse']['videoDetails'].hasOwnProperty('channelId')
                ) {
                    console.log('Found channel in ytInitialPlayerResponse');
                    return window['ytInitialPlayerResponse']['videoDetails']['channelId'];
                }
                var id;
                Array.prototype.slice.call(document.getElementsByTagName('link')).forEach(function (element) {
                    if (element.getAttribute('rel') === 'canonical') {
                        console.log('Found channel link');
                        id = element.getAttribute('href').substr(32);
                    }
                });
                return id;
            }();
            if (chanId === undefined) {
                console.warn(`Could not find a channel ID at ${location.href}`);
            } else {
                console.log('Going to membership playlist URL');
                window.open('https://www.youtube.com/playlist?list=UUMO' + chanId.substring(channelId.length-22), '_blank');
            };
        };
    };
    function gotVideoInfo(info) {
        if (! info.streamingData) {
            alert('[ytdl] This video requires membership');
            return
        };
        try {
            var urls = info.streamingData.formats;
            var adaptiveUrls = info.streamingData.adaptiveFormats;
            var videoTitle = info.videoDetails.title;
        } catch(e) {
            error(e);
            return;
        };
        for (var i=0; i<urls.length; i++) {
            var a = urls[i].cipher || urls[i].signatureCipher;
            if (a) {
                urls[i].url = decryptURL(a);
            };
        };
        for (var i=0; i<adaptiveUrls.length; i++) {
            var a = adaptiveUrls[i].cipher || adaptiveUrls[i].signatureCipher;
            if (a) {
                adaptiveUrls[i].url = decryptURL(a);
            };
        };
        var blobData = '<p>YouTube Downloader Version 1.7</p>\n\n<p>Title: ' + videoTitle + '</p>\n\n';
        for (var i=0; i<urls.length; i++) {
            blobData += '<p>Quality: ' +urls[i].qualityLabel + '; fps: ' + urls[i].fps + '; Mimetype: ' +urls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + urls[i].url + '">Open</a> <a target="_blank" href="' + urls[i].url + '&title=' +
videoTitle.replaceAll(' ', '+') + '">Download</a></p>\n\n';
        };
        blobData += '\n\n\n';
        blobData += 'No Audio';
        for (var i=0; i<adaptiveUrls.length; i++) {
            if (adaptiveUrls[i].mimeType.split('/')[0] == 'video') {
                blobData += '<p>Quality: ' + adaptiveUrls[i].qualityLabel + '; fps: ' + adaptiveUrls[i].fps + '; Mimetype: ' + adaptiveUrls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + adaptiveUrls[i].url + '">Open</a></p>\n\n';
            };
        };
        blobData += '\n\n\n';
        blobData += 'Only Audio';
        for (var i=0; i<adaptiveUrls.length; i++) {
            if (adaptiveUrls[i].mimeType.split('/')[0] == 'audio') {
                blobData += '<p>Bitrate: ' + adaptiveUrls[i].bitrate + '; Mimetype: ' + adaptiveUrls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + adaptiveUrls[i].url + '">Open</a></p>\n\n';
            };
        };
        var blob = new Blob([blobData], {type : 'text/html'});
        window.open(URL.createObjectURL(blob), "Download", "width=600,height=600");
    };
    (async function() {
        try {
            var response = await fetch('https://raw.githack.com/ethanaobrien/youtube-downloader/main/version.json');
            var body = await response.text();
            var usingVersion = '1.7';
            var version = JSON.parse(body);
        } catch(e) {
            error(e);
            return;
        };
        if (usingVersion < version.current_version) {
            alert('[ytdl] You have version '+usingVersion+' but the newest version is ' + version.current_version);
            if (confirm('[ytdl] Do you want to update? (Github Pages will open)')) {
                window.open('https://ethanaobrien.github.io/youtube-downloader/index.html');
            };
        };
    })();
    if (ytlink.split('v=').length == 1) {
        if (ytlink.split('list=').length != 1) {
            playlist(ytlink.split('list=').pop().split('&')[0]);
            return;
        }
        membersOnlyPlaylist();
        return;
    };
    if (typeof getPageData == 'function') {
        var info = getPageData().data.playerResponse;
        if (info && info != 'undefined' && videoID == info.videoDetails.videoId) {
            gotVideoInfo(info);
            return;
        };
    } else if (typeof window.getPageData == 'function') {
        var info = getPageData().data.playerResponse;
        if (info && info != 'undefined' && videoID == info.videoDetails.videoId) {
            gotVideoInfo(info);
            return;
        };
    };
    if (typeof ytInitialPlayerResponse != 'undefined') {
        var info = ytInitialPlayerResponse;
    } else if (typeof window.ytInitialPlayerResponse != 'undefined') {
        var info = window.ytInitialPlayerResponse;
    } else {
        var info = {videoDetails:{videoId:undefined}};
    };
    if (videoID != info.videoDetails.videoId) {
        try {
            var response = await fetch(ytlink);
            var body = await response.text();
            var scriptPt1 = body.split('<script' + body.split('var ytInitialPlayerResponse = ')[0].split('<script').pop() + 'var ytInitialPlayerResponse = ')[1].split('</script>')[0];
            gotVideoInfo(eval('(function() {return ' + scriptPt1 + '})();'));
        } catch(e) {
            error(e);
            return;
        };
    } else {
        gotVideoInfo(info)
    };
})();
