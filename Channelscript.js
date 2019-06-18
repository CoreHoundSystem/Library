function like(x) {
	if($(x).hasClass('liked')) {
		newLikes=[];
		oldLikes=thisChannel.likes.split("|");
		for(var i=0;i<oldLikes.length;i++) {
			if(oldLikes[i]!=currentSong.songID) {
				newLikes.push(oldLikes[i]);
			}
		}
		thisChannel.likes=newLikes.join("|");
	} else {
		if(rLiked.indexOf(currentSong.songID)==-1) {
			rLiked.push(currentSong.songID);
			sendEventToAnalytics("channelFilter","like",currentSong.songID,songOpinion,currentSong.songID+"+");
		}
		delimiter=""
		if(thisChannel.likes.length>0) {
			delimiter="|";
		}
		thisChannel.likes=thisChannel.likes + delimiter + currentSong.songID;
	}
	$(x).toggleClass('liked');
	updateChannel(thisChannel);
	cL(rLiked);
}

function dislike(x) {
	if($(x).hasClass('disliked')) {
		
	} else {
		if($(x).next().hasClass('liked')) {
			like($(x).next());
		}
		if(rDisliked.indexOf(currentSong.songID)==-1) {
			rDisliked.push(currentSong.songID);
			sendEventToAnalytics("channelFilter","dislike",currentSong.songID,songOpinion,currentSong.songID+"-");
		}
		delimiter=""
		if(thisChannel.likes.length>0) {
			delimiter="|";
		}
		thisChannel.dislikes=thisChannel.dislikes + delimiter + currentSong.songID;
		playSong();
	}
	updateChannel(thisChannel);
	cL(rDisliked);
}

function togglePause() {
	audio=document.getElementById("activeSong");
	if(audio.paused) {
		$('#pause').addClass('pause');
		$('#pause').removeClass('play');
		audio.play();
	} else {
		$('#pause').addClass('play');
		$('#pause').removeClass('pause');
		audio.pause();
	}
}

function addRecentPlay(x) {
	rPlayed.push(x);
	if(rPlayed.length>=rPMax) {
		rPlayed=rPlayed.slice(rPlayed.length-rPMax,rPlayed.length);
	}
}

function trackTime(x) {
	$('#trackTime').css('background-image','linear-gradient(to right, var(--tColor) ' + ((x.currentTime / x.duration) * 100) + '%, var(--bColor) 0%)');
	$('#trackTime').prev('span').text(secondsToTime(x.currentTime));
	$('#trackTime').next('span').text(secondsToTime(x.duration));
}

function buildActiveSong(x) {
	$('#activeChannel').empty();
	$('#activeChannel').append('<audio id="activeSong" src="' + songURL + x.link + '" autoplay="true" type="audio/mp3" volume="1.0" ontimeupdate="trackTime(this)"></audio>');
	$('#activeChannel').append('<div class="backOrMin arrow"><div><div></div><div></div></div></div><div class="activeChannelName">' + thisChannel.name + '</div>');	//active channel name
	$('#activeChannel').append('<div class="activeArtistDetails"><div class="activeArtistImage" style="background-image: url(' + getArtist(x.artist).image + ');"></div></div>');		//add artist image
	$('#activeChannel').append('<div class="activeSongDetails"><span>' + x.title + '</span><span>' + getArtist(x.artist).name + '</span><span>' + x.albumEvent + '</span></div><div class="activeSongActions"></div>');
	$('#activeChannel').append('<div id="trackControls"><div class="upperRow"></div><div class="lowerRow"></div></div>');
	$('.upperRow').append('<div><span></span><div id="trackTime"></div><span></span></div>');
	$('.lowerRow').append('<div id="dislike" class="trackControls dislike"><div><div></div></div></div><div id="like" class="trackControls like' + isLiked(x) + '"><div><div></div></div><div><div></div></div><div></div></div><div id="pause" class="trackControls pause"><div><div></div></div><div><div></div></div></div><div id="nextTrack" class="trackControls nextTrack"><div><div></div></div><div><div></div></div><div><div></div></div></div>');
	
	
	$('.backOrMin').click(function() {
		$(this).parent().toggleClass('minimize');
	});
	$('.activeSongDetails').click(function() {
		if($(this).parent().hasClass('minimize')) {
			$(this).parent().removeClass('minimize');
		}
	});
	$('#dislike').click(function() {
		dislike(this);
	});
	$('#like').click(function() {
		like(this);
	});
	$('#pause').click(function() {
		togglePause();
	});
	$('#nextTrack').click(function() {
		playSong();
	});
	
	audio=document.getElementById("activeSong");
	//audio.play();
	$('#activeSong').on('ended',function() {
		playSong();
	});
}

function playSong() {
	songNumber=Math.round(Math.random()*cSongs.length);
	cL(rDisliked);
	cL(rPlayed);
	console.log(songNumber)
	console.log(cSongs[songNumber]);
	if(songNumber==cSongs.length||rPlayed.indexOf(cSongs[songNumber].songID)!=-1||(songNumber<0||songNumber>=cSongs.length)||rDisliked.indexOf(cSongs[songNumber].songID)!=-1) {
		playSong();
	} else {
		commercialTicker++;
		window["currentSong"]=cSongs[songNumber];
		addRecentPlay(currentSong.songID);
		songMedia=getArtist(currentSong.artist).image;
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
			if ('mediaSession' in navigator) {
				navigator.mediaSession.metadata = new MediaMetadata({
					title: currentSong.title,
					artist: getArtist(currentSong.artist).name,
					album: currentSong.albumEvent,
					artwork: [
						{src:songMedia,sizes:'96x96',type:'image/png'},
						{src:songMedia,sizes:'128x128',type:'image/png'},
						{src:songMedia,sizes:'192x192',type:'image/png'},
						{src:songMedia,sizes:'256x256',type:'image/png'},
						{src:songMedia,sizes:'384x384',type:'image/png'},
						{src:songMedia,sizes:'512x512',type:'image/png'},
					]
				});
				navigator.mediaSession.setActionHandler('play',function() {togglePause()});
				navigator.mediaSession.setActionHandler('pause',function() {togglePause()});
				navigator.mediaSession.setActionHandler('nexttrack',function() {playSong()});
			}
		}
		buildActiveSong(currentSong);
		sendEventToAnalytics("playSong",profile.gID,currentSong,popSong,currentSong.songID);
	}
}

function areThereLikes(c) {
	if(c.likes) {
		return c.likes.split("|");
	} else {
		return [];
	}
}

function areThereDislikes(c) {
	if(c.dislikes) {
		return c.likes.split("|");
	} else {
		return [];
	}
}

function startChannel(c) {
	$('#activeChannel').empty();
	window["thisChannel"]=c;
	cArtists=c.artist.split("|");
	likes=[];
	likes=areThereLikes(c);
	dislikes=areThereDislikes(c);
	genres=[];
	window["cSongs"]=[];
	window["rPlayed"]=[];
	window["rDisliked"]=dislikes;
	window["rLiked"]=likes;
	window["commercialTicker"]=0;
	for(var i=0;i<songs.length;i++) {
		thisSong=0;
		if(cArtists.indexOf(songs[i].artist)!=-1||likes.indexOf(songs[i].songID)!=-1) {
			if(genres.indexOf(songs[i].genre)==-1) {
				genres.push(songs[i].genre);
			}
		}
	}
	for(var i=0;i<songs.length;i++) {
		console.log(songs[i].artist);
		console.log(cArtists);
		if((cArtists.indexOf(songs[i].artist)!=-1||genres.indexOf(songs[i].genre)!=-1)&&dislikes.indexOf(songs[i].songID)==-1&&(songs[i].state=="available"||songs[i].state=="requested")) {
			cSongs.push(songs[i]);
		}
	}
	if(rPMax>=cSongs.length) {
		rPMax=cSongs.length-2;
	}
	sendEventToAnalytics("channelStart","rPMax",rPMax);
	sendEventToAnalytics("channelStart","genres",genres,popGenres,genres.join("|"));
	console.log(genres);
	console.log(cSongs.length);
	if(cSongs.length>0) {
		playSong();
	}
}
