popSong="";
popGenres="";
songOpinion="";



$(function() {
	console.log("Library.js Loaded");
	if(window.navigator.userAgent.indexOf("MSIE ") > 0 || window.navigator.userAgent.indexOf("Trident") > 0) {
		alert("Due to growing security concerns with Internet Explorer, this site will nolonger load on this browser.");
		console.log("IE");
		rStyle = $('#rootStyles').text();
		rStyle = rStyle.substring(rStyle.indexOf('{')+1,rStyle.indexOf('}'));
		rArray = rStyle.split(';');
		rObject = {};
		for(var i=0;i<rArray.length-1;i++) {
			if(rArray[i].length > 3) {
				thisPair = [];
				thisPair = rArray[i].split(':');
				thisPair[0] = thisPair[0].replace(/[\s\n]/g,"");
				thisPair[1].replace(/[\s\n]/g,"").substring(1,-2);
				rObject[thisPair[0]] = thisPair[1];
			}
		}
		$('style').each(function() {
			if($(this).text().indexOf('var(--') != -1) {
				theseStyles = $(this);
				$.each(rObject, function(key,value) {
					k = 'var(' + key + ')';
					kReg = new RegExp(k,'g');
					replaceAll(theseStyles,k,value);
				});
			}
		})
	} else {
		console.log(window.navigator.userAgent);
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

function sendEventToAnalytics(x,y,z,f,d) {		//Sends event to Google Analytics - requires analytics
	console.log(x,y,z);
	if(d) {
		console.log(f,d);
		sumbitData(f,d);
	}
	gtag('event',y, {
		'event_category': x,
		'event_label': z
	});
}

function sumbitData(f,d) {
	$('body').append('<iframe style="display:none" src="' + f + d + '">');
}

function updateChannel(x) {
	console.log(x);
	for(var i=0;i<myChannels.length;i++) {
		if(myChannels[i].chanID==x.chanID) {
			console.log(myChannels[i]);
		}
	}
}

function isLiked(x) {
	if(thisChannel.likes.indexOf(x.songID)!=-1) {
		return " liked";
	} else {
		return "";
	}
}
