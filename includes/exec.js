/*

#############################################################
#							PHALEEX							#
#############################################################
Phantomjs Leekwars Experience

 a phantomjs autoplay to be used with leekwars.com
 based on Entonoir web app for leekwars

*/



/*----------------------------------------------------------- 
##### Exec tools ##### */

phal.exec = {
	system: require('system'),
	startDate: null,
	stopDate: null,
	span: null, // in seconds
	stopRequested: false,
	params: { // can be overrited as launch param
		authUrl: 'http://leekwars.com/index.php?page=login_form',
		gardenUrl: 'http://leekwars.com/garden',
		leekUrl: 'http://leekwars.com/leek/',
		verbose: 1, // ENUM(0,1,2,3)
		defaultProfile: 'default',
		profile: 'default',
	}
};

phal.exec.getArgs = function()
{
	if (phal.exec.system.args.length === 1)
	{
		phal.log('Usage: phantomjs phaleex.js login=foo password=bar profile=baz');
		phal.exec.stopSafe();
		phantom.exit();
	}
	else
	{
		phal.exec.system.args.forEach(function (arg, i)
		{
			var keyPairValue = arg.split('=');
			phal.exec.params[keyPairValue[0]] = keyPairValue[1];
		});
	}
};

phal.exec.start = function()
{
	phantom.cookiesEnabled = true;

	phal.exec.startDate = new Date();
	phal.exec.stopDate = null;
	phal.exec.span = 0;
	phal.log('!!! PHALEEX Starting now.',4);

	phal.exec.getArgs();
};

phal.exec.tick = function(){
	phal.exec.stopDate = new Date();
	phal.exec.span = (phal.exec.stopDate.getTime() - phal.exec.startDate.getTime()) /1000;
	return phal.exec.span;
};

phal.exec.stopSafe = function(){phal.stopRequested=true;};

phal.exec.waitForStop = function(){
	phal.waitFor(
		"phal.stopRequested",
		function(){
			phal.log('!!! PHALEEX elapsed seconds: '+phal.exec.span, 4);
			phal.log('!!! PHALEEX Terminated safely.');
			phantom.exit();
		}
	);
};