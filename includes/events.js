/*

#############################################################
#							PHALEEX							#
#############################################################
Phantomjs Leekwars Experience

 a phantomjs autoplay to be used with leekwars.com
 based on Entonoir web app for leekwars

*/



/*----------------------------------------------------------- 
##### Events ##### */


phal.events =
{
	get : function(feedName)
	{
		if(typeof feedName == "undefined")
			var feedName = "default";
		if(feedName== "get")
			feedName = "_get";
		if(typeof phal.events[''+feedName] == "undefined")
			phal.events[''+feedName] = jQuery('<dom></dom>');
		return phal.events[''+feedName];
	}
};
