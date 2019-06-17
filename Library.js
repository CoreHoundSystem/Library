popSong="https://docs.google.com/forms/d/e/1FAIpQLScBJbUX_ddqJexIpcHXAAB1dNfytH46KCp-jazfGl8kktaIlA/formResponse?usp=pp_url&entry.762123824=";
popGenres="https://docs.google.com/forms/d/e/1FAIpQLSf5qoAw2zz7LAs6nXOfKaZB2fMqMzi6k8Kmx4s57opwP0JW1Q/formResponse?usp=pp_url&entry.762123824=";
songOpinion="https://docs.google.com/forms/d/e/1FAIpQLSeS_aRew-vd3OgJ-SQPHkPhh-M_oliItmEgbRvYISvaVjxs6w/formResponse?usp=pp_url&entry.762123824=";


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
		submitData(f,d);
	}
	gtag('event',y, {
		'event_category': x,
		'event_label': z
	});
}

function submitData(f,d) {
	$('body').append('<iframe style="display:none" src="' + f + d + '">');
}

function updateChannel(x) {
	console.log(x);
	for(var i=0;i<myChannels.length;i++) {
		if(myChannels[i].chanID==x.chanID) {
			console.log(myChannels[i]);
		}
	}
	submitData(channels,encodeURIComponent(JSON.stringify(x)));
}

function isLiked(x) {
	if(thisChannel.likes.indexOf(x.songID)!=-1) {
		return " liked";
	} else {
		return "";
	}
}

function buildArtistSearch() {
	$('#artistSearch').focus(function() {
		$('#artistList').addClass('show');
	})
	$('#artistSearch').blur(function() {
		setTimeout(function() {
			$('#artistList').removeClass('show');
		}, 200);
	})
	$('#artistSearch').on('input',function() {
		artistName=$(this).val();
		$('#artistList div.artistOption').each(function() {
			$(this).removeClass('hide');
			if($(this).text().toLowerCase().indexOf(artistName.toLowerCase())==-1) {
				$(this).addClass('hide');
			}
		});
		if(($('.artistOption').length-$('.artistOption.hide').length)==1) {
			$('#createChannel').addClass('available');
		} else {
			$('#createChannel').removeClass('available');
		}
	});
	for(var i=0;i<artists.length;i++) {
		$('#artistList').append('<div class="artistOption" name="' + artists[i].uuid + '">' + artists[i].name + '</div>');
	}
	$('.artistOption').click(function() {
		$('#artistSearch').val($(this).text());
		$('#createChannel').addClass('available');
		startCreateChannel($(this).attr('name'));
	})
	$('#createChannel').click(function() {
		if($('#createChannel').hasClass('available')) {
			$('.artistOption').each(function() {
				if(!$(this).hasClass('hide')) {
					startCreateChannel($(this).attr('name'));
				}
			});
		}
	})
	$('#joinTether').click(function() {
		$('.abcRioButton').click();
	})
}

function startCreateChannel(x) {
	if($('.g-signin2')=="Signed in"&&profile.gID) {
		console.log("Huh?");
	} else {
		$('.abcRioButton').click();
	}
}
