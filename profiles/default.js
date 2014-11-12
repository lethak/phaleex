/*

#############################################################
#							PHALEEX							#
#############################################################
Phantomjs Leekwars Experience

 a phantomjs autoplay to be used with leekwars.com
 based on Entonoir web app for leekwars

##### Profile File ##### */




phal.profile.define(
{

	name: 'default',
	
	/*----------------------------------------------------------- 
	##### Automatic Upgrade Settings ##### */

	upgrade:
	{
		enabled: false, // enable the auto-upgrade feature all together

		isLeekSpecific: false, // TRUE if all the leeks available should be in the scope of the upgrade mechanics,
		listOfLeekId: // Defines a list of leek Id that will be in the scope of the upgrade mechanics; not used if 'isLeekSpecific' is FALSE.
		[
			// Array of Leek Id here...
		]
	},

	/*----------------------------------------------------------- 
	##### Solo Fight Settings ##### */

	solo:
	{
		enabled: true,
		alwaysEngage: false,

		// Defines an array of my leekId that will be used within the range of the autoplay. !!! If the first element is 'all', they will be all used.
		playlistOfLeekId: ['all'],
		
		/**
			A ruleset is an 'Array of function'.
			The autoplay will execute each rule function of the ruleset and determine if the attack will happen or not.
			A typical rule function recieves 2 parametters and have 3 possible return value:
				@params myLeek is an object containing your current leek datas, stats and history.
				@params targetLeek is an object containing the targeted 'enemy' leek datas, stats and history.
				@returns TRUE to allow an attack.
				@returns FALSE to disallow an attack. If one rule return FALSE, the entire ruleset will return FALSE and no attack will happen.
				@returns NULL|void to make the autoplay aware that the rule is not TRUE. Unlike false, if one rule returns NULL, it will be ignored when making a decision about attacking or not.
				@see phal.leek.evaluate.datas for more information on how both params are generated
		*/
		ruleset:[
			function(myLeek, targetLeek){ return null; }, // Default empty exemple


			// TRUE If myleek has more weapons than targetLeek
			function(myLeek, targetLeek)
			{
				if(myLeek.weapons.totalCount > targetLeek.weapons.totalCount)
					return true;
			},

			// TRUE if targetLeek has no weapons
			function(myLeek, targetLeek)
			{
				if(targetLeek.weapons.totalCount<=0)
					return true;
			},

			// TRUE if targetLeek has only a pistol and myLeek has at least an other weapon
			function(myLeek, targetLeek)
			{
				var haveMyLeekMoreThanAPistol = false;
				jQuery.each(myLeek.weapons.list, function(i,weap){ if(weap.type!=phal.weapons.PISTOL) haveMyLeekMoreThanAPistol = true; });

				if(haveMyLeekMoreThanAPistol && targetLeek.weapons.totalCount==1){
					jQuery.each(targetLeek.weapons.list, function(i,weap){ if(weap.type==phal.weapons.PISTOL) return true; });
				}
			},

			// TRUE if targetLeek ratios are negatives
			function(myLeek, targetLeek)
			{
				if(targetLeek.ratio<0 && targetLeek.history.victoryRatio<0)
					return true;
			},

			// TRUE if targetLeek ratios are zero
			function(myLeek, targetLeek)
			{
				if(targetLeek.ratio==0 && targetLeek.history.victoryRatio==0)
					return true;
			},

			// TRUE if targetLeek ratio is negative
			function(myLeek, targetLeek)
			{
				if(targetLeek.ratio<0)
					return true;
			},

			// TRUE if targetLeek history.victoryRatio ratio is negative
			function(myLeek, targetLeek)
			{
				if(targetLeek.history.victoryRatio<0)
					return true;
			},

			// TRUE if targetLeek history.victoryRatio is zero
			function(myLeek, targetLeek)
			{
				if(targetLeek.history.victoryRatio==0)
					return true;
			},

			// TRUE if targetLeek ratio is zero
			function(myLeek, targetLeek)
			{
				if(targetLeek.ratio==0)
					return true;
			},

			// TRUE if targetLeek has no chips and myLeek have more than one.
			function(myLeek, targetLeek)
			{
				if(targetLeek.chips.totalCount <= 0 && myLeek.chips.totalCount > 1)
					return true;
			},

			// TRUE if targetLeek has no chips and no weapons while myleek have at least one of them.
			function(myLeek, targetLeek)
			{
				if(targetLeek.chips.totalCount <= 0 && targetLeek.weapons.totalCount <=0 && (myLeek.chips.totalCount>0 || myLeek.weapons.totalCount>0) )
					return true;
			},

		],

	},

	/*----------------------------------------------------------- 
	##### Farmer Fight Settings ##### */

	farmer:
	{
		enabled: false,

	},

	/*----------------------------------------------------------- 
	##### Team Fight Settings ##### */

	team:
	{
		enabled: false,

	},

});
