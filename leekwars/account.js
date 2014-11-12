/*

#############################################################
#							PHALEEX							#
#############################################################
Phantomjs Leekwars Experience

 a phantomjs autoplay to be used with leekwars.com
 based on Entonoir web app for leekwars

*/



/*----------------------------------------------------------- 
##### Account ##### */

phal.account =
{
	isAuthed: 0,
	login: null,
	leeks: [],
	leekFightRemaining:[],
};

phal.account.auth = function()
{
	
	phal.log('Authenticating...');
	var data = 'login='+phal.exec.params.login+'&pass='+phal.exec.params.password+'&token=';
	var loginPage = new WebPage();
	loginPage.open(phal.exec.params.authUrl, 'post', data, function(status)
	{
		if (status !== 'success')
		{
			phal.log('!!! Auth failed (http)');
		}
		else
		{
			var body = this.evaluate(function(a){
				return document.getElementsByTagName('body')[0].innerHTML+'';
			});
			if (body === "1")
			{
				phal.log('Authed successfully');
				phal.account.isAuthed = 1;
				phal.account.login = ''+phal.exec.params.login;
			}
			else
			{
				phal.log('!!! Auth failed (response body)');
			}
		}
	});
	
	loginPage.onLoadFinished = function(){};
};


