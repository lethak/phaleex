/*

#############################################################
#							PHALEEX							#
#############################################################
Phantomjs Leekwars Experience

 a phantomjs autoplay to be used with leekwars.com
 based on Entonoir web app for leekwars

*/



/*----------------------------------------------------------- 
##### Profile Manager ##### */

phal.profile = {
	defined: {},
};

/*
* Returns a profile object, and try to load it from its profile file if not already available.
*/
phal.profile.get = function(profileName)
{
	phal.log('Requesting profile ('+ profileName+')', 2);

	if(typeof phal.profile.defined[profileName]==="undefined")
	{
		if(phal.profile.load(profileName+'.js')!==false)
		{
			return phal.profile.get(profileName);
		}
		return false;
	}
	else
	{
		return phal.profile.defined[profileName];
	}
};

/*
* Returns a profile object, and try to load it from its profile file if not already available.
phal.profile.getLeek = function(leekId) // Not Yet finished
{
	for (var profileName in phal.profile.defined)
	{
		if (phal.profile.defined.hasOwnProperty(profileName))
		{
			var profile = phal.profile.get(profileName);
		}
	}
};*/

/*
* Load a javascript file defining a PHALEEX profile
*/
phal.profile.load = function(file)
{
	var filename = ''+file.replace(/\//ig,'');
	var r = phantom.injectJs('profiles/'+filename);
	if(r===false){
		phal.log('!!! Profile not loaded ( profiles/'+filename+' )');
	}
	else{
		phal.log('Profile loaded ( profiles/'+filename+' )', 2);
	}
	return r;
}

/*
* Define and store an object defining a PHALEEX profile, typicaly used from a profile file.
*/
phal.profile.define = function(profile)
{

	if(typeof profile.name == "undefined") throw('profile.name must be defined');

	if(typeof phal.profile.defined[profile.name]==="undefined")
	{
		phal.profile.defined[profile.name] = profile;
		phal.log('Profile defined successfully ('+profile.name+')', 2);
	}
	else
	{
		throw('Profile is already defined ('+profile.name+')', 2);
	}


};

