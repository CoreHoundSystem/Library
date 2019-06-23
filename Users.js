registerURL="https://docs.google.com/forms/d/e/1FAIpQLSes-beRIp1-A2SgZP9CS-8F1dr0E71Z63RlwjaS1nnWuafQ5w/formResponse?usp=pp_url&entry.762123824="	//register gID
syncURL="https://docs.google.com/forms/d/e/1FAIpQLSe-bJWth2cKQ7-jo0vOHD_mSaIQIQfJN4aFcskKBfMaeH7zhw/formResponse?usp=pp_url&entry.762123824=";	//sync gID to UUID
artist="https://docs.google.com/forms/d/e/1FAIpQLSdkyoQyqkHLjMPNbYa18RwcTLdP4ViqJXUt259MM4xUs_BCaw/formResponse?usp=pp_url&entry.762123824=";	//Adding artist uuid
channels="https://docs.google.com/forms/d/e/1FAIpQLSdlQGMcv_XxMOywJUWwFVVDKOG2elnR247wVMsggyFjUgZhZQ/formResponse?usp=pp_url&entry.762123824=";	//Channel list
songs="https://docs.google.com/forms/d/e/1FAIpQLSf2TJ7YVxt1cqVSBoQIJysDuBFpJ-WMTgnNUvj5lU7xj-PhZQ/formResponse?usp=pp_url&entry.762123824=";	//Song list

userRegistry="1pg-HrcwZZc26c5d9DIyG1AKqCUG-rwEQAc_Zh7aVXZ8";	//TRUE get info from registry
userSyncs="1GDyPff8QkQynVWfOWZIFNli4Lz8NtScWPc1U5uIwOOM";		//TRUE get syncd uuid for gID
syncdProfile="1wXxggUlx2td4EatduNW47cgxVX91xN5k7EYcFtjzoak";
//syncdProfile="1zylDFVqtUmkMFULDmxzhLyi6JZr0lRhE4Kir4dt0yrk"	//TRUE get artists profiles
//channelKey="1i9SfwLkDj40yOqOmRMAhe4FXI5fjjjyufx8Nz_IPKbg";	//temp
channelKey="1uBEt-sN0Ah00fu2Y9q8BfFMOzWyetaTLfZ0AAyp9Mro";	//TRUE get channels
//songKey="1EHmHCY8-n9wVSkimbL2k7d7NMZDo8xSsrtIuaRRJwNM";
songKey="1TyvPyzsS43sGyANpbeOjwP3HSQFpH9JtcxXYbe8Aj6w";		//TRUE get songs

function dataPulls(x) {
	dP[x]=1;
	dPSum=0;
	for(var i=0;i<Object.keys(dP).length;i++) {
		dPSum+=dP[Object.keys(dP)[i]];
	}
	if(dPSum==Object.keys(dP).length) {
		console.log(x);
		pSongs=[];
		listChannels();
		updateArtsitObjects();
		if(profile.uuid.length==36) {
			for(var i=0;i<songs.length;i++) {
				if(songs[i].artist==profile.uuid) {
					pSongs.push(songs[i].songID);
				}
			}
			if(pSongs.length>0) {
				$('#soundCloudThird').css('display','none');
				profile.songs=pSongs;
			}
		}
		cL(profile);
	}
}

function getSongs(s,x,y) {
	checkSongs=[];
	window[s]=[];
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			$.each(data.feed.entry, function(i,entry) {
				thisEntry=JSON.parse(entry.gsx$data.$t.replace(/'/g,"\""));
				if(checkSongs.indexOf(thisEntry.songID)==-1) {
					checkSongs.push(thisEntry.songID);
					window[s].push(thisEntry);
				} else {
					window[s][checkSongs.indexOf(thisEntry.songID)]=thisEntry;
				}
			});
			dataPulls("getSongs");
		});
	});
}

function getChannels(g,c,x,y) {
	checkChannels=[];
	window[c]=[];
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			$.each(data.feed.entry, function(i,entry) {
				if((entry.gsx$data.$t.indexOf("'owner':'" + g)!=-1||entry.gsx$data.$t.indexOf('"owner":"' + g)!=-1)&&entry.gsx$data.$t.indexOf("chanID")!=-1) {
					thisEntry=JSON.parse(entry.gsx$data.$t.replace(/'/g,"\""));
					if(thisEntry.chanID.length>4) {
						if(checkChannels.indexOf(thisEntry.chanID)==-1) {
							checkChannels.push(thisEntry.chanID);
							window[c].push(thisEntry);
						} else {
							window[c][checkChannels.indexOf(thisEntry.chanID)]=thisEntry;
						}
					}
				}
			});
			profile.channels=window[c];
			dataPulls("getChannels");
		});
	});
}

function getProfile(a,x,y) {
	window[a]=[];
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			$.each(data.feed.entry, function(i,entry) {
				thisImage=entry.gsx$image.$t;
				thisEntry=JSON.parse('{"uuid":"' + entry.gsx$data.$t + '","name":"' + entry.gsx$name.$t + '","image":"' + thisImage.replace("/1)","/2)") + '"}');
				window[a].push(thisEntry);
			});
			dataPulls("getProfile");
			buildArtistSearch();
		});
	});
}

function checkSync(g,a,x,y) {
	var syncChecker=0;
	window[a]=[];
	window["sync"]="NA";
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			$.each(data.feed.entry, function(i,entry) {
				window[a].push(entry.gsx$data.$t);
				if(entry.gsx$data.$t.indexOf(g)===0) {
					window["sync"]=entry.gsx$data.$t.split("|");
					profile.uuid=window["sync"][1];
					$('#syncSecond').css('display','none');
					$('#soundCloudThird').css('display','block');
				}
				//add an array to push all entries ["gID|uuid"]
			});
			if(syncChecker==0) {
				//prompt user to sync
			}
			if(syncChecker>1) {
				//error?
			}
			dataPulls("checkSync");
		});
	});
}

function checkRegistry(g,m,f,l,a,x,y) {
	var regChecker=0;
	window[a]=[];
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			$.each(data.feed.entry, function(i,entry) {
				window[a].push(entry.gsx$data.$t);
				if(entry.gsx$data.$t.indexOf(g)!=-1) {
					regChecker++;
				}
				//add an array to push all entries [{gID,gMail}]
			});
			console.log(regChecker);
			if(regChecker==0) {
				sendEventToAnalytics("user","register",g,registerURL,encodeURIComponent(g+"|"+m+"|"+f+"|"+l));
			} else {
				//what to do if checker is > 0
			}
			dataPulls("checkRegistry");
		});
	});
}

function loadUser(p) {
	console.log(p);
	window["profile"]=p;
	cL([profile.gID,profile.gMail,profile.firstName,profile.lastName].join("|"));
	$('#loginFirst').css('display','none');
	$('#syncSecond').css('display','block');
	getChannels(p.gID,"myChannels",channelKey,"1");
	checkRegistry(p.gID,p.gMail,p.firstName,p.lastName,"registered",userRegistry,"1");
	checkSync(p.gID,"syncd",userSyncs,"1");	
}

$(function() {
	dP=JSON.parse('{"checkRegistry":0,"checkSync":0,"getProfile":0,"getChannels":0,"getSongs":0}');
	getProfile("artists",syncdProfile,"1");
	getSongs("songs",songKey,"1");
	$('#loginFirst button').click(function() {
		$('.abcRioButton').click();
	})
	$('#syncSecond input').on('input',function() {
		decrypt($('#syncSecond input').val(),$(this));
	})
	$('#syncSecond button').click(function() {
		if($(this).hasClass('available')) {
			sendEventToAnalytics("user","sync",$('#syncSecond input').val(),syncURL,encodeURIComponent(profile.gID+"|"+$(this).attr('name')+"|"+$('#syncSecond input').val()));
			$('#syncSecond').css('display','none');
			$('#soundCloudThird').css('display','block');
		}
	})
	$('#soundCloudThird input').on('input',function() {
		if($('#soundCloudThird input').val().indexOf("https://soundcloud.com/")==0) {
			$('#soundCloudThird button').addClass('available');
		} else {
			$('#soundCloudThird button').removeClass('available');
		}
	})
	$('#soundCloudThird button').click(function() {
		if($(this).hasClass('available')) {
			sendEventToAnalytics("user",profile.gID,$('#soundCloudThird input').val());
			$('#soundCloudThird').css('display','none');
		}
	})
	$('#tetherFooter button.signOut').click(function() {
		$('#signOut').click();
	})
})
