/*

#############################################################
#							PHALEEX							#
#############################################################
Phantomjs Leekwars Experience

 a phantomjs autoplay to be used with leekwars.com
 based on Entonoir web app for leekwars

*/



/*----------------------------------------------------------- 
##### Autoplay ##### */

phal.autoplay = {
	isInit: false,
	profile: null,
	pending: false,
	solo: {
		finished: null,
		interval: {},
	},
};

phal.autoplay.init = function()
{
	if(!phal.autoplay.isInit)
	{
		phal.autoplay.profile = phal.profile.get(phal.exec.params.profile);
		phal.autoplay.isInit = true;
	}
};

phal.autoplay.solo.run = function()
{
	phal.autoplay.init();


	if(!phal.autoplay.profile.solo.enabled){
		phal.log('Autoplay.solo IS DISABLED', 2);
		return false;
	}

	phal.log('Starting autoplay.solo.run ...');

	// Determines what leek is playable based on the current profile.
	var playableLeekIdList = [];
	if( phal.autoplay.profile.solo.playlistOfLeekId.length > 0 )
	{
		if(jQuery(phal.autoplay.profile.solo.playlistOfLeekId).get(0) == "all")
		{
			playableLeekIdList = phal.account.leeks;
		}
		else
		{
			jQuery.each(phal.autoplay.profile.solo.playlistOfLeekId, function(i,v){
				if(typeof phal.account.leeks[v] != "undefined" && v !=="all")
					playableLeekIdList.push(v);
			});
		}
	}
	phal.log('List of playable leeks:', 2);
	phal.log(playableLeekIdList, 2);


	// For each playable leek ...
	jQuery.each(playableLeekIdList, function(i, myLeekId)
	{

		// Refreshing targets
		phal.autoplay.pending = true;
		
		jQuery.each(phal.garden.soloEnemyIdListByLeek[''+myLeekId], function(i,targetLeekId){
			setTimeout( function(){
				phal.leek.query(targetLeekId, function(leek){
					phal.log('ennemy fetched', 2);
				});
			},92);
		});

		phal.autoplay.solo.interval[''+myLeekId] = setInterval( function()
		{
			var allFetched = true; 
			jQuery.each(phal.garden.soloEnemyIdListByLeek[''+myLeekId], function(i,targetLeekId){
				if(typeof phal.leek.list[''+targetLeekId]=="undefined")
					allFetched = false;
			});

			if(allFetched)
			{
				clearInterval(phal.autoplay.solo.interval[''+myLeekId]);

				var ennemies = phal.garden.soloEnemyIdListByLeek[''+myLeekId];
				
				phal.log('Playing with my leek: '+phal.leek.list[''+myLeekId].name+' ('+myLeekId+') having '+phal.account.leekFightRemaining[''+myLeekId]+' fight remaining');

				// Trying to determine the next best suitable target ...
				var nextTargetLeekId = null;
				while(nextTargetLeekId===null || (nextTargetLeekId!==null && nextTargetLeekId!==false))
				{
					nextTargetLeekId = phal.autoplay.solo.getNextTargetLeekId(myLeekId);
				}

				// No target deemed suitable
				if(nextTargetLeekId===false || nextTargetLeekId===null || nextTargetLeekId===true){
					phal.log('No target deemed suitable having '+phal.account.leekFightRemaining[''+myLeekId]+' fight remaining');
					return false;
				}

				phal.log('Next suitable target selected : '+phal.leek.list[''+nextTargetLeekId].name+' ('+nextTargetLeekId+')');

			}

		},3500);



	});


};


phal.autoplay.solo.getNextTargetLeekId = function(myLeekId)
{
	if(phal.account.leekFightRemaining[''+myLeekId]<=0)
		return false;

	var ennemies = phal.garden.soloEnemyIdListByLeek[''+myLeekId];

	jQuery.each(ennemies, function(i,targetLeekId){

		var poolScore = null;
		if(typeof phal.leek.list[''+targetLeekId]=="undefined")
		{
			
		}
		else{
			poolScore = phal.autoplay.getRulesetScore(phal.autoplay.profile.solo.ruleset, phal.leek.list[''+myLeekId], phal.leek.list[''+targetLeekId]);
		}

	});

	return false;
}

phal.autoplay.getRulesetScore = function(ruleset, myItem, targetItem)
{
	var trueCount = 0;
	var falseCount = 0;

	ruleset.forEach(function(rule)
	{
		var ruleExecutionResult = rule(myItem, targetItem);
		if(ruleExecutionResult===true){trueCount++;}
		if(ruleExecutionResult===false){falseCount++;}
	});

	if(falseCount>0){
		return -1;
	}

	return trueCount;
};

