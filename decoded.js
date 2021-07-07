(function() {
	var ytlink = window.location.href;
	var videoID = ytlink.split('v=').pop().split('&')[0];
	if (window.location.host != 'www.youtube.com') {
		alert('Only works on youtube');
		return
	};
	if (ytlink.split('v=').length == 1) {
		alert('Please open a video');
		return
	};
	if (String.prototype.replaceAll === undefined) {
		String.prototype.replaceAll = function(a, b) {
			return this.split(a).join(b);
		};
	};
	function gotVideoInfo(info) {
		var urls = info.streamingData.formats;
		var adaptiveUrls = info.streamingData.adaptiveFormats;
		var videoTitle = info.videoDetails.title;
		if (urls.length > 0 ) {
			if (! urls[0].url) {
				alert('This video contains copyrighted content');
				return
			};
		} else if (adaptiveUrls.length > 0) {
			if (! adaptiveUrls[0].url) {
				alert('This video contains copyrighted content');
				return
			};
		} else {
			alert('No URLs have been found (How is this possible)');
			if (confirm('Do you want to open github?')) {
				window.open('https://github.com/ethanaobrien/youtube-downloader');
			};
		};
		var blobData = '<p>YouTube Downloader Version 1.1</p>\n\n<p>Title: ' + videoTitle + '</p>\n\n';
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
					var usingVersion = '1.1';
					if (usingVersion != version.current_version) {
						alert('You have version '+usingVersion+' but the newest version is ' + version.current_version);
						if (confirm('Do you want to update? (Github Pages will open)')) {
							window.open('https://ethanaobrien.github.io/youtube-downloader/index.html');
						};
					};
				});
			};
		});
	} catch(e) {
		console.log('[ytdl] failed to check for updates')
	};
	if (typeof ytInitialPlayerResponse != 'undefined') {
		var info = ytInitialPlayerResponse;
	} else if (typeof window.ytInitialPlayerResponse != 'undefined') {
		var info = window.ytInitialPlayerResponse;
	} else {
		var info = { };
		info.videoDetails = { };
		info.videoDetails.videoId = undefined;
	};
	if (videoID != info.videoDetails.videoId) {
		fetch(ytlink).then(response => {
			if (response.ok) {
				response.text().then(body => {
					var body = body.replaceAll('%'+'22', '"').replaceAll('%'+'28', '(').replaceAll('%'+'29', ')').replaceAll('%'+'5D', ']').replaceAll('%'+'5B', '[').replaceAll('%'+'20', ' ').replaceAll('%'+'3A', ':').replaceAll('%'+'7B', '{').replaceAll('%'+'7D', '}').replaceAll('%'+'2C', ',').replaceAll('%'+'3D', '=').replaceAll('%'+'2F', '/').replaceAll('%'+'3F', '?').replaceAll('%'+'5C', '\\').replaceAll('%'+'25', '%').replaceAll('%'+'2C', ',').replaceAll('\\u0026', '&').replaceAll('%'+'26', '&').replaceAll('%'+'3B', ';').replaceAll('%'+'22', '"').replaceAll('%'+'28', '(').replaceAll('%'+'29', ')').replaceAll('%'+'5D', ']').replaceAll('%'+'5B', '[').replaceAll('%'+'20', ' ').replaceAll('%'+'3A', ':').replaceAll('%'+'7B', '{').replaceAll('%'+'7D', '}').replaceAll('%'+'2C', ',').replaceAll('%'+'3D', '=').replaceAll('%'+'2F', '/').replaceAll('%'+'3F', '?').replaceAll('%'+'5C', '\\').replaceAll('%'+'25', '%').replaceAll('%'+'2C', ',').replaceAll('\\u0026', '&').replaceAll('%'+'26', '&').replaceAll('%'+'3B', ';');
					var scriptPt1 = body.split('<script' + body.split('var ytInitialPlayerResponse = ')[0].split('<script').pop() + 'var ytInitialPlayerResponse = ')[1].split('</script>')[0];
					if (scriptPt1.split('var meta = ').length > 1) {
						var scriptPt1 = scriptPt1.split('var meta = ')[0];
					};
					if (scriptPt1.endsWith(';')) {
						var scriptPt1 = scriptPt1.substring(0, scriptPt1.length - 1);
					};
					var sd = scriptPt1.split('"streamingData":')[1];
					try {
						var info = {streamingData: JSON.parse(sd.split('}]},')[0]+'}]}'), videoDetails: {title: body.split('<title').pop().split('>')[1].split('</title>')[0].split(' - YouTube')[0]}};
					} catch(e) {
						alert('Please reload page and try again')
						return
					}
					gotVideoInfo(info);
				});
			} else {
				alert('Please reload page and try again')
			};
		});
	} else {
		gotVideoInfo(info)
	};
})();
