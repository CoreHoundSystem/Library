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
	if(d) {
		submitData(f,d);
	}
	gtag('event',y, {
		'event_category': x,
		'event_label': z
	});
}

function submitData(f,d) {
	getPostTimeID='i'+new Date().getTime();
	$('#trashCan').append('<iframe id="' + getPostTimeID + '" class="posting" style="display:none" src="' + f + d + '">');
	$('#' + getPostTimeID).queue('q'+getPostTimeID,deleteMe($('#' + getPostTimeID)));
}

function deleteMe(x) {
	setTimeout(function() {
		$(x).remove();
	},30000)
}

function updateChannel(x) {
	for(var i=0;i<myChannels.length;i++) {
		if(myChannels[i].chanID==x.chanID) {
		}
	}
	submitData(channels,encodeURIComponent(JSON.stringify(x)));
}

function isLiked(x) {
	if(thisChannel.likes.length>0&&thisChannel.likes.indexOf(x.songID)!=-1) {
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
		$('.artistList').append('<div class="artistOption option" name="' + artists[i].uuid + '">' + artists[i].name + '</div>');
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
		canAnimate=0;
		if($('#createChannel').hasClass('available')) {
			$(this).parent().find('.artistOption').each(function() {
				if(!$(this).hasClass('hide')) {
					canAnimate++;
				}
			});
		}
		if(canAnimate>0) {
			startCreateChannel($(this).attr('name'));
		}
	})
	$('#joinTether').click(function() {
		if($(this).hasClass('signedIn')) {
			$('html body').animate({
				scrollTop: $('#creationBox').offset().top
			},1000);
		} else {
			$('.abcRioButton').click();
		}
	})
	$('#buildChannel').click(function() {
		newChannel=JSON.parse('{"chanID":"' + getUnixTimeStamp("C",profile.gID,Math.floor(new Date()/1000).toString(16)) + '","owner":"' + profile.gID+ '","artist":"' + theseArtists() + '","name":"' + $('#channelName').val() + '","likes":"","dislikes":"","genres":""}');
		profile.channels.push(newChannel);
		listChannels();
		submitData(channels,encodeURIComponent(JSON.stringify(newChannel)));
	})
}

function startCreateChannel(x) {
	setTimeout(function() {
		if(typeof profile==='object') {
		} else {
			$('.abcRioButton').click();
		}
		$('html body').animate({
			scrollTop: $('#creationBox').offset().top
		},1000);
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
			if(checker&&$(this).val().length>0) {
				$('#buildChannel').addClass('available');
				$('#buildChannel').text("Build " + $(this).val());
				
			} else {
				$('#buildChannel').removeClass('available');
			}
		})
	},500)
}

function theseArtists() {
	artistList=[];
	$('#creationBox').find('.artistSearch').each(function() {
		for(var i=0;i<artists.length;i++) {
			if(artists[i].name==$(this).val()) {
				artistList.push(artists[i].uuid);
			}
		}
	})
	return artistList.join("|");
}

function getUnixTimeStamp(c,i,t) {
	return c+i+"-"+t;
}

function listChannels() {
	for(var i=0;i<profile.channels.length;i++) {
		if(!$('#' + profile.channels[i].chanID).length) {
			$('#myChannels').prepend('<div id="' + profile.channels[i].chanID + '" class="channelBox" name="' + i + '"><div style="background-image:url(' + getArtist(profile.channels[i].artist.substring(0,36)).image + ')"></div><div style="background-image:url(' + getArtist(profile.channels[i].artist.substring(0,36)).image + ')"></div><span>' + profile.channels[i].name + '</span></div>');
		}
	}
	$('.channelBox').click(function() {
		startChannel(myChannels[parseInt($(this).attr('name'))]);					
	});
}

function calendarURL(x) {
	//x = artist UUID, use this to get gID and then gMail
	s='https://calendar.google.com/calendar/embed?src=';
	e='&ctz=America/Los_Angeles&pli=1&showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA&bgcolor=%23008B8B';
	return s+x+e;
}

function updateArtsitObjects() {
	for(var i=0;i<syncd.length;i++) {
		thisSync=syncd[i].split("|");
		for(var j=0;j<artists.length;j++) {
			if(artists[j].uuid==thisSync[1]) {
				artists[j].gID=thisSync[0];
				for(var k=0;k<registered.length;k++) {
					thisRegister=registered[k].split("|");
					if(artists[j].gID.toString()==thisRegister[0].toString()) {
						artists[j].gMail=thisRegister[1];
					}
				}
			}
		}
	}
	if(profile.uuid.length==36) {
		for(var i=0;i<songs.length;i++) {
			if(songs[i].artist==profile.uuid) {
				pSongs.push(songs[i]);
			}
		}
		if(pSongs.length>0) {
			$('#soundCloudThird').css('display','none');
			profile.songs=pSongs;
			getMetrics(metrics,"1")
			//buildMySongs();
		}
	}
}

function getCalendar(x) {
	if('gMail' in getArtist(x.artist)) {
		return '<iframe src="' + calendarURL(getArtist(x.artist).gMail) + '"></iframe><div></div>';
	} else {
		return "";
	}
}

function decrypt(x,y) {
	$(y).parent().next().attr('name','');
	$(y).parent().next().html('');
	$(y).parent().next().next().text("Waiting..");
	$(y).parent().next().next().removeClass('available');
	if(x.length==44) {
		dKey=x.substring(40);
		u=x.substring(0,32);
		r=x.substring(32,40);
		fullDKey="";
		for(var i=0;i<11;i++) {
			fullDKey=fullDKey+dKey;
		}
		newData="";
		for(var i=0;i<fullDKey.length;i++) {
			testFigure=(parseInt(x.substring(i,i+1),16)-fullDKey[i]);
			if(testFigure<0) {
				testFigure=testFigure+16;
			}
			newData=newData+(testFigure).toString(16);
		}
		newUUID=newData.substring(0,32);
		d="-";
		dashList = [8,13,18,23];
		for(var i=0;i<dashList.length;i++) {
			newUUID = newUUID.slice(0,dashList[i]) + d + newUUID.slice(dashList[i]);
		}
		$(y).parent().next().next().attr('name',newUUID);
		getDateFromHex(newData.substring(35,40),2003,y);
	}
}

function getDateFromHex(x,y,z) {
	rezDate=['January','February','March','April','May','June','July','August','September','October','November','December'][parseInt(x.substring(2,3),16)-1] + " " + x.substring(3,6) + ", " + (parseInt(x.substring(0,2),16) + y);
	$(z).parent().next().html('Is your SL rez date<br><span class="highlight">' + rezDate + '</span>?');
	$(z).parent().next().next().text("Yes, Sync My Avatar!");
	$(z).parent().next().next().addClass('available');
}

function buildMySongs() {
	$('#landingModal').append('<button id="goToMySongs">My Songs</button>');
	$('#goToMySongs').click(function() {
		$('html body').animate({
			scrollTop: $('#tetherArtistJoin').offset().top
		},1000);
	})
	$('#tetherArtistJoin .content').css('display','none');
	states=['requested','available','submitted','pending'];
	console.log(profile);
	for(var i=0;i<profile.songs.length;i++) {
		thisSong=profile.songs[i];
		console.log(thisSong);
		if(!$('#mySongs #'+thisSong.state+'.exists').length) {
			$('#mySongs #'+thisSong.state).addClass('exists');
			$('#mySongs #'+thisSong.state).append('<h3>' + thisSong.state + '</h3>');
		}
		if(states.indexOf(thisSong.state)!=-1) {
			$('#mySongs #'+thisSong.state).append('<div id="'+thisSong.songID+'" class="songBox"><div class="songHeader"><div class="songTitle"><input type="text" placeholder="Song Title" value="' + thisSong.title + '"></div><div class="songSource"><input type="text" placeholder="Album or Event" value="' + thisSong.albumEvent + '"></div></div><div class="songDetails"><div class="songGenre"><input type="text" placeholder="Song Genre" value="' + thisSong.genre + '"><div class="genreList list"></div></div><div class="songAd"><input type="text" placeholder="Song Ad" value="' + thisSong.ad + '"><div class="adList list"></div></div><div class="songType"><input type="text" placeholder="Song Type" value="' + thisSong.type + '"><div class="typeList list"></div></div><div class="songState"><input type="text" placeholder="Song State" value="' + thisSong.state + '"><div class="stateList list"></div></div><div class="metric">' + thisSong.plays + '<span>Play(s)</span></div><div class="metric">' + thisSong.likes + '<span>Like(s)</span></div><div class="songTest" name="' + thisSong.link + '"><button>Test Song</button></div></div><div class="songActions"><button>Save Changes</button></div></div>');
		}
	}
	
	$('.songHeader').click(function() {
		$(this).parent().toggleClass('expand');
	})
	
	songGenres=['Rap','R&B','Country','Rock','Blues','Electronic','Accoustic','Latin','Adult Contemporary','Portugese','Reggae','Gospel','Native American','Celtic','Pop','Ballad','Triphop','French','','Hip Hop','Soul','Western','Metal','Ragtime','Dance','Indi','Ska','Spoken Word','Funk','Folk','Alternative','Jazz','Dubstep','Bluegrass','Punk','Techno'];
	for(var i=0;i<songGenres.length;i++) {
		$('.genreList').append('<div class="genreOption option">' + songGenres[i] + '</div>');
	}
	$('.songGenre input').focus(function() {
		$(this).parents('.songGenre').find('.genreList').addClass('show')
	})
	$('.songGenre input').blur(function() {
		t=$(this);
		setTimeout(function() {
			t.parent().parent().find('.genreList').removeClass('show');
		}, 200);
	})
	$('.songGenre input').on('focus input',function() {
		thisText=$(this).val().toLowerCase();
		$(this).parent().parent().find('.genreOption').each(function() {
			if($(this).text().toLowerCase().indexOf(thisText)==-1) {
				$(this).addClass('hide')
			} else {
				$(this).removeClass('hide');
			}
		})
	})
	$('.genreOption').click(function() {
		$(this).parent().parent().find('input').val($(this).text());
	})
	songAds=['ad-free','ads-only'];
	for(var i=0;i<songAds.length;i++) {
		$('.adList').append('<div class="adOption option">' + songAds[i] + '</div>');
	}
	$('.songAd input').focus(function() {
		$(this).parents('.songAd').find('.adList').addClass('show')
	})
	$('.songAd input').blur(function() {
		t=$(this);
		setTimeout(function() {
			t.parent().parent().find('.adList').removeClass('show');
		}, 200);
	})
	$('.songAd input').on('focus input',function() {
		thisText=$(this).val().toLowerCase();
		$(this).parent().parent().find('.adOption').each(function() {
			if($(this).text().toLowerCase().indexOf(thisText)==-1) {
				$(this).addClass('hide')
			} else {
				$(this).removeClass('hide');
			}
		})
	})
	$('.adOption').click(function() {
		$(this).parent().parent().find('input').val($(this).text().toLowerCase());
	})
	
	songTypes=['cover','original'];
	for(var i=0;i<songTypes.length;i++) {
		$('.typeList').append('<div class="typeOption option">' + songTypes[i] + '</div>');
	}
	$('.songType input').focus(function() {
		$(this).parents('.songType').find('.typeList').addClass('show')
	})
	$('.songType input').blur(function() {
		t=$(this);
		setTimeout(function() {
			t.parent().parent().find('.typeList').removeClass('show');
		}, 200);
	})
	$('.songType input').on('focus input',function() {
		thisText=$(this).val().toLowerCase();
		$(this).parent().parent().find('.typeOption').each(function() {
			if($(this).text().toLowerCase().indexOf(thisText)==-1) {
				$(this).addClass('hide')
			} else {
				$(this).removeClass('hide');
			}
		})
	})
	$('.typeOption').click(function() {
		$(this).parent().parent().find('input').val($(this).text().toLowerCase());
	})
	
	songStates=['available','unavailable'];
	for(var i=0;i<songStates.length;i++) {
		$('.stateList').append('<div class="stateOption option">' + songStates[i] + '</div>');
	}
	$('.songState input').focus(function() {
		$(this).parents('.songState').find('.stateList').addClass('show')
	})
	$('.songState input').blur(function() {
		t=$(this);
		setTimeout(function() {
			t.parent().parent().find('.stateList').removeClass('show');
		}, 200);
	})
	$('.songState input').on('focus input',function() {
		thisText=$(this).val().toLowerCase();
		$(this).parent().parent().find('.stateOption').each(function() {
			if($(this).text().toLowerCase().indexOf(thisText)==-1) {
				$(this).addClass('hide')
			} else {
				$(this).removeClass('hide');
			}
		})
	})
	$('.stateOption').click(function() {
		$(this).parent().parent().find('input').val($(this).text().toLowerCase());
	})
	
	$('.songTest').click(function() {
		if($(this).text()=="Test Song") {
			$(this).parent().append('<audio src="' + songURL + $(this).attr('name') + '" class="testSong" autoplay="true" type="audio/mp3" volume="1.0"></audio>');
			$(this).find('button').text('End Test');
		} else {
			$(this).parent().find('audio').remove();
			$(this).find('button').text('Test Song');
		}
	})
	
	$('.songActions button').click(function() {
		thisSongBox=$(this).parent().parent();
		thisSongID=thisSongBox.attr('id');
		for(var i=0;i<profile.songs.length;i++) {
			if(profile.songs[i].songID==thisSongID) {
				thisSong=profile.songs[i];
				thisSong.title=thisSongBox.find('.songTitle input').val();
				thisSong.albumEvent=thisSongBox.find('.songSource input').val();
				partList=['Genre','Ad','Type','State'];
				for(var j=0;j<partList.length;j++) {
					if(window["song" + partList[j] + "s"].indexOf(thisSongBox.find('.song' + partList[j] + ' input').val())!=-1) {
						console.log(thisSongBox.find('.song' + partList[j] + ' input').val());
						thisSong[partList[j].toLowerCase()]=thisSongBox.find('.song' + partList[j] + ' input').val();
					}
				}
				sendEventToAnalytics("song","update",encodeURIComponent(JSON.stringify(profile.songs[i])),song,encodeURIComponent(JSON.stringify(profile.songs[i])));
			}
		}
		
		console.log(profile.songs);
	})
}
