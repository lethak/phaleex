/*

#############################################################
#							PHALEEX							#
#############################################################
Phantomjs Leekwars Experience

 a phantomjs autoplay to be used with leekwars.com
 based on Entonoir web app for leekwars

*/


/*----------------------------------------------------------- 
##### Includes external dependencies ##### */

phantom.injectJs('includes/jquery.min.js');

/*----------------------------------------------------------- 
##### Includes for PHALEEX CORE ##### */

phantom.injectJs('includes/core.js');
phantom.injectJs('includes/events.js');
phantom.injectJs('includes/exec.js');
phantom.injectJs('includes/profileManager.js');
phantom.injectJs('includes/autoplay.js');

/*----------------------------------------------------------- 
##### Includes for LeekWars support ##### */

phantom.injectJs('leekwars/account.js');
phantom.injectJs('leekwars/garden.js');
phantom.injectJs('leekwars/leek.js');

phantom.injectJs('leekwars/ref.weapons.js');
phantom.injectJs('leekwars/ref.chips.js');

/*----------------------------------------------------------- 
##### What to do ? ##### */

/*
* Main function as an entry point for the application.
*/
phal.main = function()
{

	phal.exec.start();

	// Loading profiles ...

	phal.profile.get(phal.exec.params.defaultProfile);
	if(phal.exec.params.profile!=phal.exec.params.defaultProfile)
	{
		if(!phal.profile.get(phal.exec.params.profile))
		{
			phal.exec.stopSafe();
			phantom.exit();
		}
	}


	// Authenticating ...
	

	/**/
	phal.account.auth();

	phal.waitFor("phal.account.isAuthed", phal.garden.init);
	phal.waitFor("phal.garden.isInit", phal.leek.init);
	phal.waitFor("phal.leek.isInit", phal.autoplay.init);
	phal.waitFor("phal.autoplay.isInit", phal.autoplay.solo.run);
	/**/


	// 59 minutes max runtime (ms)
	setTimeout(function(){
		phal.exec.stopSafe();
	}, 59*60*1000 );

	phal.exec.waitForStop();
};



/*----------------------------------------------------------- 
DO IT NOW ! */
phal.main();

