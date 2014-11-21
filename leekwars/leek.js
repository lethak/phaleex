/*

#############################################################
#							PHALEEX							#
#############################################################
Phantomjs Leekwars Experience

 a phantomjs autoplay to be used with leekwars.com
 based on Entonoir web app for leekwars

*/



/*----------------------------------------------------------- 
##### Leek page ##### */

phal.leek = {
	list: {},
	isInit: false,
};

/*
* Go and find the stats of the current account leeks.
*/
phal.leek.init = function()
{
	phal.log('Leek init',2);
	phal.leek.updateSelf();
};

phal.leek.updateSelf = function()
{

	phal.account.leeks.forEach(function(leekId,i)
	{
		setTimeout(function()
		{

			phal.log('Updating my leek page ('+leekId+')...', 2);
			phal.leek.query(leekId, function(leek){

				var allAvailable = true;
				phal.account.leeks.forEach(function(leekId_,i_){
					if(typeof phal.leek.list[''+leekId_] == "undefined")
						allAvailable = false;
				});

				if(allAvailable)
					phal.leek.isInit = true;

			});

		},350);
	});
};



phal.leek.query = function(leekId, callback)
{
	phal.log('Leek query ('+leekId+')',2);

	if(typeof callback != "function")
		var callback = function(){};

	var leekPage = new WebPage();
	leekPage.onConsoleMessage = function(m)
	{
		phal.log("//( leek/"+leekId+" says )//   "+ m, 3);
	};
	leekPage.onLoadFinished = function(){};

	leekPage.onError = function(msg, trace)
	{
		var msgStack = ['ERROR: ' + msg];
		if (trace && trace.length)
		{
			msgStack.push('TRACE:');
			trace.forEach(function(t) {
				msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
			});
		}
		phal.log(msgStack.join('\n'),3);
	};

	var url = phal.exec.params.leekUrl+'/'+leekId;
	leekPage.open(url, function(status){
		if (status === 'success')
		{
			phal.leek.onLoadedSucessfully(this, callback);
		}
		else
		{
			phal.log('!!! Leek page failed to load (http)');
			this.close();
		}
	});
};

phal.leek.onLoadedSucessfully = function(phantomPage, callback)
{
	phal.log('Leek page loaded successfully');

	var datas = phantomPage.evaluate(phal.leek.evaluate.datas);
	phal.leek.list[datas.leekId] = datas;

	phal.log(datas ,2);

	if(typeof callback == "function")
		callback(datas);

	phantomPage.close();

	//console.log('DEBUG: '+phal.leek.list[stats.leekId].ai.solo.tooltip ,0)
};

phal.leek.evaluate = 
{
	challenge: function(myLeekId, targetLeekid) // Dry-run attack
	{
		console.log('!!! LeekwarsEntonoirEmbed.LeekContext.challenge', [myLeekId, targetLeekid]);
		submitForm("garden_update", [
			['leek_id', myLeekId],
			['challenge_id', targetLeekid]
		]);
	},

	attack: function(myLeekId, targetLeekid) // Garden attack
	{
		console.log('!!! LeekwarsEntonoirEmbed.LeekContext.attack', [myLeekId, targetLeekid]);
		submitForm("garden_update", [
			['leek_id', myLeekId],
			['enemy_id', targetLeekid]
		]);
	},

	datas: function()
	{

		var $leekWeapons = jQuery('#leek-weapons .weapon[weapon]');
		var $leekChips = jQuery('#leek-chips .chip.available[chip]');

		var $leekFight = jQuery('#history .fight-history');
		var $leekFightDefeat = jQuery('#history .fight-history.defeat');
		var $leekFightWin = jQuery('#history .fight-history.win');
		
		var $leekIA = jQuery('#leek-ai #leekai-solo');
		var $leekIAtooltipA = jQuery('#tt_leekai-solo.tooltip:first span:first');
		var $leekIAtooltipB = jQuery('#tt_leekai-solo.tooltip:first span:last');


		var leek =
		{
			name: null,
			leekId: null,
			ai: {solo:{name:'',tooltip:''},team:{name:'',tooltip:''}},
			ratio: null,
			history: {totalCount:0,winCount:0,defeatCount:0,victoryRatio:null},
			stats: {list:{}},
			weapons: {list:{},totalCount:0},
			chips: {list:{},totalCount:0},
		};

		// LEEK Infos -----------------
		leek.leekId = __LEEK_ID;
		leek.name = jQuery('#leek h1').text().trim();
		
		// Ratio -----------------
		leek.ratio = jQuery('#tt_fights').text().trim();
		leek.ratio = leek.ratio.replace(/Ratio\ \:\ /ig,'').trim();

		// IA -----------------
		leek.ai.solo.name = $leekIA.text().trim();
		leek.ai.solo.tooltip = $leekIAtooltipA.text().trim()+', '+$leekIAtooltipB.text().trim();

		// Stats -----------------
		var $leekStats = jQuery('#stats-table div');
		jQuery.each($leekStats, function(i,v){
			var $statDiv = jQuery(v);
			var $statSpan = jQuery('span span[id]', $statDiv);
			if($statSpan.text().trim()!=""){
				leek.stats.list[$statSpan.attr('id')] = {
					value:$statSpan.text().trim(),
					image:$statSpan.parent().find('img').attr('src'),
				};
			}
		});

		// Weapons ---------------
		leek.weapons.totalCount = $leekWeapons.length;
		jQuery.each($leekWeapons, function(i,v){
			var $weapon = jQuery(v);
			var weaponObject = {image: $weapon.find('img').attr('src')};
			weaponObject.type = jQuery(weaponObject.image.split('/')).last().get(0).split('.')[0]; // Trying to guess the weapon type using the image url
			leek.weapons.list[$weapon.attr('weapon')] = weaponObject;
		});

		// Chips ---------------
		leek.chips.totalCount = $leekChips.length;
		jQuery.each($leekChips, function(i,v){
			var $chip = jQuery(v);
			var chipObject = {image: $chip.find('img').attr('src')};
			chipObject.type = jQuery(chipObject.image.split('/')).last().get(0).split('.')[0]; // Trying to guess the chip type using the image url
			leek.chips.list[$chip.attr('chip')] = chipObject;
		});
		

		// Fights History ---------------
		leek.history.totalCount = $leekFight.length;
		leek.history.winCount = $leekFightWin.length;
		leek.history.defeatCount = $leekFightDefeat.length;
		leek.history.victoryRatio = Math.round( ((leek.history.winCount*100) / (leek.history.totalCount) ) *100)/100;

		return leek;
	},

};