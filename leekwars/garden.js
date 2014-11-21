/*

#############################################################
#							PHALEEX							#
#############################################################
Phantomjs Leekwars Experience

 a phantomjs autoplay to be used with leekwars.com
 based on Entonoir web app for leekwars

*/



/*----------------------------------------------------------- 
##### Garden ##### */

phal.garden = {
	page: null,
	isInit: false,
	soloEnemyIdListByLeek: {},
};

phal.garden.init = function()
{
	phal.log('Garden init',2);
	phal.garden.page = new WebPage();
	phal.garden.page.onConsoleMessage = function(m)
	{
		phal.log("//(garden says)//   "+ m, 3);
	};
	phal.garden.page.onLoadFinished = function(){};
	phal.garden.page.onError = function(msg, trace)
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

	phal.garden.query();
};

phal.garden.query = function()
{
	phal.log('Garden query',2);
	phal.garden.page.open(phal.exec.params.gardenUrl, function(status)
	{
		if (status === 'success'){	phal.garden.onLoadedSucessfully(this);	}
		else{ phal.log('!!! Garden failed to load (http)'); }
	});
};

phal.garden.onLoadedSucessfully = function(phantomPage)
{
	phal.log('Garden loaded successfully');
	phal.account.leeks = phantomPage.evaluate(phal.garden.evaluate.accountLeeks);
	phal.account.leekFightRemaining = phantomPage.evaluate(phal.garden.evaluate.leekFightRemaining);
	phal.garden.soloEnemyIdListByLeek = phantomPage.evaluate(phal.garden.evaluate.soloEnemyIdListByLeek);

	phal.garden.isInit = true;
};

phal.garden.evaluate = 
{
	accountLeeks: function()
	{
		var r = [];
		jQuery('.leek.myleek[id]').each(function(i,v){
			r.push(jQuery(this).attr('id'));
			parseInt(jQuery('.fights', this).text().trim());
		});
		return r;
	},

	leekFightRemaining: function()
	{
		var r = {};
		jQuery('.leek.myleek[id]').each(function(i,v)
		{
			var leekId = jQuery(this).attr('id');
			r[''+leekId] = parseInt(jQuery('.fights', this).text().trim());
		});
		return r;
	},

	soloEnemyIdListByLeek: function()
	{
		var r = {};
		jQuery('.enemies[leek]').each(function(i,v){
			var $this = jQuery(this);
			var enemies = [];
			var $enemies = jQuery('.leek.enemy[id]', $this);
			$enemies.each(function(ii,vv){
				enemies.push(jQuery(this).attr('id'));
			});
			r[''+$this.attr('leek')] = enemies;
		});
		return r;
	}
};