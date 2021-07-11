(function() {
    var ytlink = window.location.href;
    var videoID = ytlink.split('v=').pop().split('&')[0];
    if (window.location.host != 'www.youtube.com') {
        alert('[ytdl] Only works on youtube');
        return
    };
    if (ytlink.split('v=').length == 1 && ytlink.split('/channel/').length == 1 && ytlink.split('/c/').length == 1 && ytlink.split('/user/').length == 1 ) {
        alert('[ytdl] Please open a video');
        return
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
        var urls = info.streamingData.formats;
        var adaptiveUrls = info.streamingData.adaptiveFormats;
        var videoTitle = info.videoDetails.title;
        if (urls.length > 0 ) {
            if (! urls[0].url) {
                alert('[ytdl] This video contains copyrighted content');
                return
            };
        } else if (adaptiveUrls.length > 0) {
            if (! adaptiveUrls[0].url) {
                alert('[ytdl] This video contains copyrighted content');
                return
            };
        } else {
            alert('[ytdl] No URLs have been found (How is this possible)');
            if (confirm('[ytdl] Do you want to open github?')) {
                window.open('https://github.com/ethanaobrien/youtube-downloader');
            };
        };
        var blobData = '<p>YouTube Downloader Version 1.3</p>\n\n<p>Title: ' + videoTitle + '</p>\n\n';
        for (var i=0; i<urls.length; i++) {
            blobData += '<p>Quality: ' +urls[i].qualityLabel + '; fps: ' + urls[i].fps + '; Mimetype: ' +urls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + urls[i].url + '">Open</a></p>\n\n';
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
        var blobData = new TextEncoder('utf-8').encode(blobData).buffer;
        var blob = new Blob([blobData], {type : 'text/html'});
        window.open(URL.createObjectURL(blob), "Download", "width=600,height=600");
    };
    try {
        fetch('https://raw.githack.com/ethanaobrien/youtube-downloader/main/version.json').then(response => {
            if (response.ok) {
                response.text().then(body => {
                    var version = JSON.parse(body);
                    var usingVersion = '1.3';
                    if (usingVersion != version.current_version) {
                        alert('[ytdl] You have version '+usingVersion+' but the newest version is ' + version.current_version);
                        if (confirm('[ytdl] Do you want to update? (Github Pages will open)')) {
                            window.open('https://ethanaobrien.github.io/youtube-downloader/index.html');
                        };
                    };
                });
            };
        });
    } catch(e) {
        console.log('[ytdl] failed to check for updates')
    };
    if (ytlink.split('v=').length == 1) {
        membersOnlyPlaylist();
        return
    };
    if (typeof getPageData != 'undefined' && typeof getPageData == 'function') {
        var info = getPageData().data.playerResponse;
        if (info && info != 'undefined') {
            gotVideoInfo(info);
            return
        };
    } else if (typeof window.getPageData != 'undefined' && typeof window.getPageData == 'function') {
        var info = getPageData().data.playerResponse;
        if (info && info != 'undefined') {
            gotVideoInfo(info);
            return
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
        fetch(ytlink).then(response => {
            if (response.ok) {
                response.text().then(body => {
                    var scriptPt1 = body.split('<script' + body.split('var ytInitialPlayerResponse = ')[0].split('<script').pop() + 'var ytInitialPlayerResponse = ')[1].split('</script>')[0];
                    if (scriptPt1.split('var meta = ').length > 1) {
                        var scriptPt1 = scriptPt1.split('var meta = ')[0];
                    };
                    if (! scriptPt1.endsWith(';')) {
                        var scriptPt1 = scriptPt1 + ';';
                    };
                    gotVideoInfo(eval('(function() {return ' + scriptPt1 + '})();'));
                });
            } else {
                alert('[ytdl] Please reload page and try again')
            };
        });
    } else {
        gotVideoInfo(info)
    };
})();
