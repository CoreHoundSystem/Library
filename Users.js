registerURL="https://docs.google.com/forms/d/e/1FAIpQLSes-beRIp1-A2SgZP9CS-8F1dr0E71Z63RlwjaS1nnWuafQ5w/formResponse?usp=pp_url&entry.762123824="
syncURL="https://docs.google.com/forms/d/e/1FAIpQLSe-bJWth2cKQ7-jo0vOHD_mSaIQIQfJN4aFcskKBfMaeH7zhw/formResponse?usp=pp_url&entry.762123824=";

userRegistry="1pg-HrcwZZc26c5d9DIyG1AKqCUG-rwEQAc_Zh7aVXZ8";
userSyncs="1GDyPff8QkQynVWfOWZIFNli4Lz8NtScWPc1U5uIwOOM";
syncdProfile="1wXxggUlx2td4EatduNW47cgxVX91xN5k7EYcFtjzoak";
channelKey="1i9SfwLkDj40yOqOmRMAhe4FXI5fjjjyufx8Nz_IPKbg";	//temp
songKey="1EHmHCY8-n9wVSkimbL2k7d7NMZDo8xSsrtIuaRRJwNM";

function dataPulls(x) {
	dP[x]=1;
	dPSum=0;
	for(var i=0;i<Object.keys(dP).length;i++) {
		dPSum+=dP[Object.keys(dP)[i]];
	}
	if(dPSum==Object.keys(dP).length) {
		console.log(x);
		pSongs=[];
		if(profile.uuid.length==36) {
			for(var i=0;i<songs.length;i++) {
				if(songs[i].artist==profile.uuid) {
					pSongs.push(songs[i].songID);
				}
			}
			profile.songs=pSongs;
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
				thisEntry=JSON.parse(entry.gsx$item.$t.replace(/'/g,"\""));
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
				if(entry.gsx$item.$t.indexOf("'owner':'" + g)!=-1&&entry.gsx$item.$t.indexOf("chanID")!=-1) {
					thisEntry=JSON.parse(entry.gsx$item.$t.replace(/'/g,"\""));
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
				thisEntry=JSON.parse(`{"uuid":"` + entry.gsx$data.$t + `","name":"` + entry.gsx$name.$t + `","image":"` + entry.gsx$image.$t + `"}`);
				window[a].push(thisEntry);
			});
			dataPulls("getProfile");
		});
	});
}

function checkSync(g,x,y) {
	var syncChecker=0;
	window["sync"]="NA";
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			$.each(data.feed.entry, function(i,entry) {
				if(entry.gsx$data.$t.indexOf(g)===0) {
					window["sync"]=entry.gsx$data.$t.split("|");
					profile.uuid=window["sync"][1];
				}
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

function checkRegistry(g,m,f,l,x,y) {
	var regChecker=0;
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			$.each(data.feed.entry, function(i,entry) {
				if(entry.gsx$data.$t.toString()==g.toString()) {
					regChecker++;
				}
			});
			if(regChecker==0) {
				$('body').append('<iframe style="display:none" src="' + registerURL + g + '">');
				//setTimeout(function() {
					//checkRegistry(g,m,f,l,q,x,y);
				//},2000);
			} else {
				//what to do if checker is > 0
			}
			dataPulls("checkRegistry");
		});
	});
}

function loadUser(p) {
	console.log(p);
	dP=JSON.parse(`{"checkRegistry":0,"checkSync":0,"getProfile":0,"getChannels":0,"getSongs":0}`)
	window["profile"]=p;
	cL([profile.gID,profile.gMail,profile.firstName,profile.lastName].join("|"));
	checkRegistry(p.gID,p.gMail,p.firstName,p.lastName,userRegistry,"1");
	checkSync(p.gID,userSyncs,"1");
	getProfile("artists",syncdProfile,"1");
	getChannels(p.gID,"myChannels",channelKey,"1");
	getSongs("songs",songKey,"1");	
	//fix this...
	buildChannelStart(0);
}
