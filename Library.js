



//chanKey="1i9SfwLkDj40yOqOmRMAhe4FXI5fjjjyufx8Nz_IPKbg";
//songArtistKey="1EHmHCY8-n9wVSkimbL2k7d7NMZDo8xSsrtIuaRRJwNM";



$(function() {
	console.log("Library.js Loaded");
	if(window.navigator.userAgent.indexOf("MSIE ") > 0 || window.navigator.userAgent.indexOf("Trident") > 0) {
		cL("IE");
		rStyle = $('#rootStyles').text();
		rStyle = rStyle.substring(rStyle.indexOf('{')+1,rStyle.indexOf('}'));
		rArray = rStyle.split(';');
		rObject = {};
		for(var i=0;i<rArray.length;i++) {
			if(rArray[i].length > 3) {
				thisPair = [];
				thisPair = rArray[i].split(':');
				rObject[thisPair[0].trim()] = thisPair[1].trim();
			}
		}
		cL(rObject);
		$('style').each(function() {
			if($(this).attr('id').length > 0 && $(this).text().indexOf('var(--') != -1) {
				theseStyles = $(this);
				$.each(rObject, function(key,value) {
					k = 'var(' + key + ')';
					kReg = new RegExp(k,'g');
					replaceAll(theseStyles,k,value);
				});
			}
		})
	} else {
		cL(window.navigator.userAgent);
	}
})

function replaceAll(x,k,value) {
	x.text(function () {
		x.text(x.text().replace(k,value)); 
	});
	if(x.text().indexOf(k) != -1) {
		replaceAll(x,k,value);
	}
}

function secondsToTime(x) {
	time=Math.round(Math.floor(x/60)) + ":";
	if(Math.round(x -= Math.floor(x/60)*60)<10) {
		time=time+"0" + Math.round(x -= Math.floor(x/60)*60);
	} else {
		time=time+Math.round(x -= Math.floor(x/60)*60);
	}
	return time;
}

function prepObjectForSubmission(x) {
	return JSON.stringify(x).replace(/"/g,"'")
}

function getArtist(x) {
	for(var i=0;i<artists.length;i++) {
		if(artists[i].uuid==x) {
			return artists[i];
		}
	}
}
