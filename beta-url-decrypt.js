var jG = function(a){a.reverse()}
var F3 = function(a,b){a.splice(0,b)}
var Wp = function(a,b){var c=a[0];a[0]=a[b%a.length];a[b%a.length]=c}
var decryptSig = function(a){a=a.split("");F3(a,3);Wp(a,4);F3(a,2);jG(a,35);F3(a,1);Wp(a,37);F3(a,3);return a.join("")}
try {
	var response = await fetch('https://www.youtube.com/watch?v=FDR0rsaQhfs');
	var body = await response.text();
	var scriptPt1 = body.split('<script' + body.split('var ytInitialPlayerResponse = ')[0].split('<script').pop() + 'var ytInitialPlayerResponse = ')[1].split('</script>')[0];
	var info = eval('(function() {return ' + scriptPt1 + '})();');
	var urls = info.streamingData.formats;
	var url = urls[0];
	var url = url.signatureCipher.split('&')
	var a = { }
	for (var i=0; i<url.length; i++) {
		var b = url[i].split('=')
		a[b[0]] = b[1]
	}
	a.s = decodeURIComponent(a.s)
	a.url = decodeURIComponent(a.url)
	console.log(a)
	var url = a.url + '&' + a.sp + '=' + decryptSig(a.s)
	console.log(url)
} catch(e) {
	console.log(e)
};
