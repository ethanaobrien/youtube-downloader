// Version 0.5

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
	var body = document.getElementsByTagName("HTML")[0].innerHTML;
	var body = body.replaceAll('%'+'22', '"').replaceAll('%'+'28', '(').replaceAll('%'+'29', ')').replaceAll('%'+'5D', ']').replaceAll('%'+'5B', '[').replaceAll('%'+'20', ' ').replaceAll('%'+'3A', ':').replaceAll('%'+'7B', '{').replaceAll('%'+'7D', '}').replaceAll('%'+'2C', ',').replaceAll('%'+'3D', '=').replaceAll('%'+'2F', '/').replaceAll('%'+'3F', '?').replaceAll('%'+'5C', '\\').replaceAll('%'+'25', '%').replaceAll('%'+'2C', ',').replaceAll('\\u0026', '&').replaceAll('%'+'26', '&').replaceAll('%'+'3B', ';').replaceAll('%'+'22', '"').replaceAll('%'+'28', '(').replaceAll('%'+'29', ')').replaceAll('%'+'5D', ']').replaceAll('%'+'5B', '[').replaceAll('%'+'20', ' ').replaceAll('%'+'3A', ':').replaceAll('%'+'7B', '{').replaceAll('%'+'7D', '}').replaceAll('%'+'2C', ',').replaceAll('%'+'3D', '=').replaceAll('%'+'2F', '/').replaceAll('%'+'3F', '?').replaceAll('%'+'5C', '\\').replaceAll('%'+'25', '%').replaceAll('%'+'2C', ',').replaceAll('\\u0026', '&').replaceAll('%'+'26', '&').replaceAll('%'+'3B', ';');
	var urls = body.split('"formats":')[1].split(',"adaptiveFormats"')[0];
	if (body.split('"adaptiveFormats":')[1].split(',"dashManifestUrl"').length > 1) {
		var toSplit = ',"dashManifestUrl"'
	} else {
		var toSplit = '},"playerAds":'
	}
	var adaptiveUrls = body.split('"adaptiveFormats":')[1].split(toSplit)[0];
	
	try {
		var urls = JSON.parse(urls);
		var adaptiveUrls = JSON.parse(adaptiveUrls);
	} catch(e) {
		alert('error, Please check for an update. If it still does not work, please open an issue');
		if (confirm('Do you want to open github?')) {
			window.open('https://github.com/ethanaobrien/youtube-downloader')
		};
		console.log('error, Please check for an update here: https://github.com/ethanaobrien/youtube-downloader. If it still does not work, please open an issue');
		return
	};
	if (urls.length > 0 && ! urls[0].url) {
		alert('Unsupported URL - The URL is encrypted');
		return
	};
	var blobData = '';
	console.log(urls)
	console.log(adaptiveUrls)
	for (var i=0; i<urls.length; i++) {
		blobData += '<p>Quality: ' +urls[i].qualityLabel + '; fps: ' + urls[i].fps + '; Mimetype: ' +urls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + urls[i].url + '">Click to Open</a></p>\n\n';
	};
	blobData += '\n\n\n';
	blobData += 'No Audio';
	for (var i=0; i<adaptiveUrls.length; i++) {
		if (adaptiveUrls[i].mimeType.split('/')[0] == 'video') {
			blobData += '<p>Quality: ' + adaptiveUrls[i].qualityLabel + '; fps: ' + adaptiveUrls[i].fps + '; Mimetype: ' + adaptiveUrls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + adaptiveUrls[i].url + '">Click to Open</a></p>\n\n';
		}
	};
	blobData += '\n\n\n';
	blobData += 'Only Audio';
	for (var i=0; i<adaptiveUrls.length; i++) {
		if (adaptiveUrls[i].mimeType.split('/')[0] == 'audio') {
			blobData += '<p>Bitrate: ' + adaptiveUrls[i].bitrate + '; Mimetype: ' + adaptiveUrls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + adaptiveUrls[i].url + '">Click to Open</a></p>\n\n';
		}
	};
	var blobData = new TextEncoder('utf-8').encode(blobData).buffer;
	var blob = new Blob([blobData], {type : 'text/html'});
	window.open(URL.createObjectURL(blob), "Download", "width=600,height=600");
})();

// Version 0.6

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
	var body = document.getElementsByTagName("HTML")[0].innerHTML;
	var urls = body.split('"formats":')[1].split(',"adaptiveFormats"')[0];
	if (body.split('"adaptiveFormats":')[1].split(',"dashManifestUrl"').length > 1) {
		var toSplit = ',"dashManifestUrl"'
	} else {
		var toSplit = '},"playerAds":'
	}
	var adaptiveUrls = body.split('"adaptiveFormats":')[1].split(toSplit)[0];
	
	try {
		var urls = JSON.parse(urls);
		var adaptiveUrls = JSON.parse(adaptiveUrls);
	} catch(e) {
		alert('error, Please check for an update. If it still does not work, please open an issue');
		if (confirm('Do you want to open github?')) {
			window.open('https://github.com/ethanaobrien/youtube-downloader')
		};
		console.log('error, Please check for an update here: https://github.com/ethanaobrien/youtube-downloader. If it still does not work, please open an issue');
		return
	};
	if (urls.length > 0 && ! urls[0].url) {
		alert('Unsupported URL - The URL is encrypted');
		return
	};
	var blobData = '';
	console.log(urls)
	console.log(adaptiveUrls)
	for (var i=0; i<urls.length; i++) {
		blobData += '<p>Quality: ' +urls[i].qualityLabel + '; fps: ' + urls[i].fps + '; Mimetype: ' +urls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + urls[i].url + '">Click to Open</a></p>\n\n';
	};
	blobData += '\n\n\n';
	blobData += 'No Audio';
	for (var i=0; i<adaptiveUrls.length; i++) {
		if (adaptiveUrls[i].mimeType.split('/')[0] == 'video') {
			blobData += '<p>Quality: ' + adaptiveUrls[i].qualityLabel + '; fps: ' + adaptiveUrls[i].fps + '; Mimetype: ' + adaptiveUrls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + adaptiveUrls[i].url + '">Click to Open</a></p>\n\n';
		}
	};
	blobData += '\n\n\n';
	blobData += 'Only Audio';
	for (var i=0; i<adaptiveUrls.length; i++) {
		if (adaptiveUrls[i].mimeType.split('/')[0] == 'audio') {
			blobData += '<p>Bitrate: ' + adaptiveUrls[i].bitrate + '; Mimetype: ' + adaptiveUrls[i].mimeType.split(';')[0] + '; Url: <a target="_blank" href="' + adaptiveUrls[i].url + '">Click to Open</a></p>\n\n';
		}
	};
	var blobData = new TextEncoder('utf-8').encode(blobData).buffer;
	var blob = new Blob([blobData], {type : 'text/html'});
	window.open(URL.createObjectURL(blob), "Download", "width=600,height=600");
})();
