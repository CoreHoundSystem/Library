function like(x) {
	if($(x).hasClass('liked')) {
		newLikes=[];
		oldLikes=thisChannel.liked.split("|");
		for(var i=0;i<oldLikes.length;i++) {
			if(oldLikes[i]!=currentSong.id) {
				newLikes.push(oldLikes[i]);
			}
		}
		thisChannel.liked=newLikes.join("|");
	} else {
		thisChannel.liked=thisChannel.liked + "|" + currentSong.id;
	}
	$(x).toggleClass('liked');
	//updateData(channelForm,thisChannel);		//??	formURL,object
}

function dislike(x) {
	if($(x).hasClass('disliked')) {
		
	} else {
		thisChannel.liked=thisChannel.liked + "|" + currentSong.id;
		//updateData(channelForm,thisChannel);	//??
		playSong();
	}
}

//fix this function?
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
	console.log(rPlayed);
}

function trackTime(x) {
	$('#trackTime').css('background-image','linear-gradient(to right, var(--tColor) ' + ((x.currentTime / x.duration) * 100) + '%, var(--bColor) 0%)');
}

function buildActiveSong(x) {
	console.log(x);
	$('#activeChannel').empty();
	$('#activeChannel').append('<audio id="activeSong" src="' + songURL + x.link + '" autoplay="true" type="audio/mp3" volume="1.0" ontimeupdate="trackTime(this)"></audio>');
	$('#activeChannel').append('<div class="backOrMin"><div><div></div><div></div></div></div><div class="activeChannelName">' + thisChannel.name + '</div>');	//active channel name
	$('#activeChannel').append('<div class="activeArtistDetails"><div class="activeArtistImage"></div></div>');		//add artist image
	$('#activeChannel').append('<div class="activeSongDetails"><span>' + x.title + '</span><span>' + x.artist + '</span><span>' + x.albumEvent + '</span></div><div class="activeSongActions"></div>');
	$('#activeChannel').append('<div id="trackControls"><div class="upperRow"></div><div class="lowerRow"></div></div>');
	$('.upperRow').append('<div><span></span><div></div><span></span></div>');
	$('.lowerRow').append('<div id="dislike" class="trackControls dislike"><div><div></div></div></div><div id="like" class="trackControls like"><div><div></div></div><div><div></div></div><div></div></div><div id="pause" class="trackControls pause"><div><div></div></div><div><div></div></div></div><div id="nextTrack" class="trackControls nextTrack"><div><div></div></div><div><div></div></div><div><div></div></div></div>');
	
	
	$('.backOrMin').click(function() {
		$(this).parent().toggleClass('minimize');
	});
	$('#dislike').click(function() {
		dislike(this);
	});
	$('#like').click(function() {
		like(this);
	});
	$('#pause').click(function() {
		console.log("Clicky");
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
	if(rPlayed.indexOf(cSongs[songNumber])!=-1||(songNumber<0||songNumber>=cSongs.length)) {
		playSong();
	} else {
		commercialTicker++;
		window["currentSong"]=cSongs[songNumber];
		addRecentPlay(currentSong);
		songMedia="";
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
			if ('mediaSession' in navigator) {
				navigator.mediaSession.metadata = new MediaMetadata({
					title: currentSong.title,
					artist: currentSong.artist,
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
				//navigator.mediaSession.setActionHandler('seekbackward', function() {});
				//navigator.mediaSession.setActionHandler('seekforward', function() {});
				navigator.mediaSession.setActionHandler('nexttrack',function() {playSong()});
			}
		}
		buildActiveSong(currentSong);
	}
}

function startChannel(c) {
	window["thisChannel"]=c;
	artist=c.artist;
	likes=[];
	likes=c.likes.split("|");
	dislikes=c.dislikes.split("|");
	genres=[];
	window["cSongs"]=[];
	window["rPlayed"]=[];
	window["commercialTicker"]=0;
	for(var i=0;i<likes.length;i++) {
		sIndex=0;
		for(var j=0;j<songs.length;j++) {
			if(songs[j].songID==likes[i]) {
				sIndex==j;
			}
		}
		if(genres.indexOf(songs[sIndex].genre)==-1) {
			genres.push(songs[sIndex].genre);
		}
	}
	console.log(genres);
	for(var i=0;i<songs.length;i++) {
		console.log(songs[i]);
		console.log(dislikes.indexOf(songs[i].songID));
		console.log(songs[i].genre);
		if((songs[i].artist==artist||genres.indexOf(songs[i].genre)!=-1)&&dislikes.indexOf(songs[i].songID)==-1) {
			cSongs.push(songs[i]);
			console.log("Sorted " + songs[i]);
		}
	}
	if(rPMax>=cSongs.length) {
		rPMax=cSongs.length-2;
	}
	playSong();
}
