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

	name: 'lethak',
	
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

	},

	/*----------------------------------------------------------- 
	##### Farmer Fight Settings ##### */

	farmer:
	{

	},

	/*----------------------------------------------------------- 
	##### Team Fight Settings ##### */

	team:
	{

	},

});