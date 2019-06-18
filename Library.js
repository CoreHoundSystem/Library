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
	$('#landingModal').find('.artistSearch').focus(function() {
		$(this).parent().next('.artistList').addClass('show');
	})
	$('.artistSearch').focus(function() {
		
	})
	$('.artistSearch').blur(function() {
		setTimeout(function() {
			$('.artistSearch').parent().next().removeClass('show');
		}, 200);
	})
	$('.artistSearch').on('input',function() {
		if($(this).val().length>=1) {
			$(this).parent().next('.artistList').addClass('show');
		}
		artistName=$(this).val();
		artistArray=[];
		$('.artistSearch').each(function() {
			if($(this).val().length>=1&&!$(this).parents('#landingModal').length) {
				artistArray.push($(this).val());
			}
		})
		console.log(artistArray);
		$('.artistList div.artistOption').each(function() {
			if($(this).text().toLowerCase().indexOf(artistName.toLowerCase())==-1||artistArray.indexOf($(this).text())!=-1) {
				$(this).addClass('hide');
			} else {
				if(artistArray.indexOf($(this).text())==-1) {
					$(this).removeClass('hide');
				}
			}
		});
		if(($(this).parent().next().find('.artistOption').length-$(this).find('.artistOption.hide').length)==1) {
			$('#createChannel').addClass('available');
		} else {
			$('#createChannel').removeClass('available');
		}
	});
	for(var i=0;i<artists.length;i++) {
		$('.artistList').append('<div class="artistOption" name="' + artists[i].uuid + '">' + artists[i].name + '</div>');
	}
	$('.artistSearch').change(function() {
		if(!$(this).parents('#landingModal').length&&$('.artistOption').text().indexOf($(this).val())!=-1) {
			$(this).addClass('chosen');
			if($(this).parent().parent().next().hasClass('hide')) {
				$(this).parent().parent().next().removeClass('hide');
			}
		}
	})
	$('.artistOption').click(function() {
		$(this).parent().prev().children('.artistSearch').val($(this).text());
		if($(this).parents('#landingModal').length) {
			$('#createChannel').addClass('available');
			startCreateChannel($(this).attr('name'));
		} else {
			$(this).parent().prev().children('.artistSearch').addClass('chosen');
			if($(this).parent().parent().next().hasClass('hide')) {
				$(this).parent().parent().next().removeClass('hide');
			}
		}
	})
	$('#createChannel').click(function() {
		if($('#createChannel').hasClass('available')) {
			$(this).parent().find('.artistOption').each(function() {
				if(!$(this).hasClass('hide')) {
					startCreateChannel($(this).attr('name'));
				}
			});
		}
	})
	$('#joinTether').click(function() {
		$('.abcRioButton').click();
	})
	$('#buildChannel').click(function() {
		newChannel=JSON.parse('{"chanID":"' + getUnixTimeStamp("C",profile.gID,Math.floor(new Date()/1000).toString(16)) + '","owner":"' + profile.gID+ '","artist":"' + theseArtists() + '","name":"' + $('#channelName').val() + '"}');
		profile.channels.push(newChannel);
		listChannels()
		submitData(channels,encodeURIComponent(JSON.stringify(newChannel)));
	})
}

function startCreateChannel(x) {
	if(typeof isSignedIn != 'undefined') {
		if(!profile.gID.isSignedIn()||profile=='undefined') {
			$('.abcRioButton').click();
		}
	} else {
		console.log("Not a function");
	}
	$('body').animate({
        scrollTop: $("#creationBox").offset().top
	},200);
	$('#creationBox').find('.artistSearch').first().val($('#landingModal .artistSearch').val());
	$('#creationBox').find('.artistSearch').first().addClass('chosen');
	$('#creationBox').find('.artistBox').first().next().removeClass('hide');
	$('#channelName').on('input',function() {
		firstFifteen=$(this).val().substring(0,15);
		checker=true;
		for(var i=0;i<firstFifteen.length;i++) {
			if(!firstFifteen.substring(i,i+1).replace(/[a-zA-Z0-9 ]/g,"")=="") {
				checker=false
			}
		}
		//typeof firstFifteen[i] == 'number'||
		if(checker&&$(this).val().length>0) {
			$('#buildChannel').addClass('available');
			$('#buildChannel').text("Build " + $(this).val());
			
		} else {
			$('#buildChannel').removeClass('available');
		}
	})
	
	
	//getUnixTimeStamp("C",profile.gID,Math.floor(new Date()/1000).toString(16));
}

function theseArtists() {
	artistList=[];
	$('#creationBox').find('.artistSearch').each(function() {
		console.log($(this).val());
		for(var i=0;i<artists.length;i++) {
			
			if(artists[i].name==$(this).val()) {
				console.log(artists[i].uuid);
				artistList.push(artists[i].uuid);
			}
		}
		console.log(artistList.join("|"));
		
	})
	return artistList.join("|");
}

function getUnixTimeStamp(c,i,t) {
	return c+i+"-"+t;
}

function listChannels() {
	for(var i=0;i<profile.channels.length;i++) {
		if(!$('#' + profile.channels[i].chanID).length) {
			console.log(profile.channels[i]);
			$('#myChannels').prepend('<div id="' + profile.channels[i].chanID + '" class="channelBox" name="' + i + '"><div style="background-image:url(' + getArtist(profile.channels[i].artist.substring(0,36)).image + ')"></div><div style="background-image:url(' + getArtist(profile.channels[i].artist.substring(0,36)).image + ')"></div><span>' + profile.channels[i].name + '</span></div>');
		}
	}
	$('.channelBox').click(function() {
		startChannel(myChannels[parseInt($(this).attr('name'))]);					
	});
}
