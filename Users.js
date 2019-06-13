registerURL="https://docs.google.com/forms/d/e/1FAIpQLSes-beRIp1-A2SgZP9CS-8F1dr0E71Z63RlwjaS1nnWuafQ5w/formResponse?usp=pp_url&entry.762123824="
syncURL="https://docs.google.com/forms/d/e/1FAIpQLSe-bJWth2cKQ7-jo0vOHD_mSaIQIQfJN4aFcskKBfMaeH7zhw/formResponse?usp=pp_url&entry.762123824=";

userRegistry="1pg-HrcwZZc26c5d9DIyG1AKqCUG-rwEQAc_Zh7aVXZ8";
userSyncs="1GDyPff8QkQynVWfOWZIFNli4Lz8NtScWPc1U5uIwOOM";
syncdProfile="1wXxggUlx2td4EatduNW47cgxVX91xN5k7EYcFtjzoak";
channelKey="1i9SfwLkDj40yOqOmRMAhe4FXI5fjjjyufx8Nz_IPKbg";	//temp
songKey="1EHmHCY8-n9wVSkimbL2k7d7NMZDo8xSsrtIuaRRJwNM";



function getSongs(s,x,y) {
	cL("Getting Songs");
	checkArray=[];
	window[s]=[];
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			$.each(data.feed.entry, function(i,entry) {
				thisEntry=JSON.parse(entry.gsx$item.$t.replace(/'/g,"\""));
				console.log(thisEntry);
				if(checkArray.indexOf(thisEntry.songID)==-1) {
					checkArray.push(thisEntry.songID);
					window[s].push(thisEntry);
				} else {
					window[s][checkArray.indexOf(thisEntry.songID)]=thisEntry;
				}
			});
		});
	});
}

function getChannels(g,c,x,y) {
	cL("Getting channels");
	checkArray=[];
	window[c]=[];
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			$.each(data.feed.entry, function(i,entry) {
				if(entry.gsx$item.$t.indexOf("'owner':'" + g)!=-1) {
					thisEntry=JSON.parse(entry.gsx$item.$t.replace(/'/g,"\""));
					console.log(thisEntry);
					if(checkArray.indexOf(thisEntry.chanID)==-1) {
						checkArray.push(thisEntry.chanID);
						window[c].push(thisEntry);
					} else {
						window[c][checkArray.indexOf(thisEntry.chanID)]=thisEntry;
					}
				}
			});
		});
	});
}

function getProfile(s,p,a,x,y) {
	window[a]=[];
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			$.each(data.feed.entry, function(i,entry) {
				if(entry.gsx$data.$t==s) {
					window[p]=JSON.parse(`{"uuid":"` + entry.gsx$data.$t + `","name":"` + entry.gsx$name.$t + `","image":"` + entry.gsx$image.$t + `"}`);
					cL(window[p]);
				}
				thisEntry=JSON.parse(`{"uuid":"` + entry.gsx$data.$t + `","name":"` + entry.gsx$name.$t + `","image":"` + entry.gsx$image.$t + `"}`);
				window[a].push(thisEntry);
			});
			cL(window[a]);
		});
	});
}

function checkSync(g,q,x,y) {
	var syncChecker=0;
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			$.each(data.feed.entry, function(i,entry) {
				if(entry.gsx$data.$t.indexOf(g)===0) {
					sync=entry.gsx$data.$t.split("|");
					cL(q);
					window[q](sync[1],"artistProfile","artists",syncdProfile,"1");
				}
			});
			if(syncChecker==0) {
				cL(syncChecker);
				//prompt user to sync
			}
			getChannels(g,"myChannels",channelKey,"1");
		});
	});
}

function checkRegistry(g,m,f,l,q,x,y) {
	var regChecker=0;
	$(function() {
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
		function (data) {
			
			cL("This is " + g);
			$.each(data.feed.entry, function(i,entry) {
				cL(entry.gsx$data.$t);
				if(entry.gsx$data.$t.toString()==g.toString()) {
					console.log(g + " matches " + entry.gsx$data.$t);
					regChecker++;
					cL(regChecker);
					cL(q);
					window[q](g,"getProfile",userSyncs,"1");
				}
			});
			if(regChecker==0) {
				cL(regChecker);
				$('body').append('<iframe style="display:none" src="' + registerURL + g + '">');
			}
		});
	});
}

function loadUser(g,f,l,m) {
	cL([g,m,f,l].join("|"));
	checkRegistry(g,m,f,l,"checkSync",userRegistry,"1");
	getSongs("songs",songKey,"1");
	
	buildChannelStart(0);
}
