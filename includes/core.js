/*

#############################################################
#							PHALEEX							#
#############################################################
Phantomjs Leekwars Experience

 a phantomjs autoplay to be used with leekwars.com
 based on Entonoir web app for leekwars

*/



/*----------------------------------------------------------- 
##### Core ##### */


var phal = {};

/*
* Displays log message based on verbose level.
*/
phal.log = function(msg, level)
{
	if(typeof level=="undefined")
		var level = 1;

	if(phal.exec.params.verbose>=level)
	{
		if(typeof msg==="object"){
			console.log(JSON.stringify(msg));
		}
		else{
			console.log(msg);
		}
	}
};

/*
* Waits for testFx to be true before continuing.
*/
phal.waitFor = function(testFx, onReady, timeOutMillis)
{
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3600000, //< Default Max Timout is 1h
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    phal.log("!!! Timeout ("+testFx+")");
                    //phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    //console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};


phantom.onError = function(msg, trace)
{
	var msgStack = ['PHANTOM ERROR: ' + msg];
	if (trace && trace.length)
	{
		msgStack.push('TRACE:');
		trace.forEach(function(t) {
		msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
		});
	}
	phal.log(msgStack.join('\n'), 0);
	phantom.exit(1);
};