;( function ( $ ) {

$.fn.sequence = function( callback, interval, instantly ) {
	if ( typeof instantly !== "boolean" ) instantly = true;

	var done = false,
		index = 0,
		$elements = this,

		promise = $.Deferred(),

		settings = {
			paused: !instantly,
			interval: interval
		},

		currentRunTimeout = null,
		currentRunTimestamp = 0,
		remainingDelay = 0;


	// modify promise object
	// get / set interval
	promise.getInterval = function() {
		return settings.interval;
	};
	promise.setInterval = function( interval ) {
		if ( done ) return;

		settings.interval = interval;
	};


	// hold / release
	promise.hold = function() {
		if ( done ) return;

		remainingDelay = 1 - ( ( Date.now() - currentRunTimestamp ) / settings.interval );
		clearTimeout( currentRunTimeout );
		settings.paused = true;
	};
	promise.release = function( when ) {
		if ( done ) return;
		if ( typeof when === "undefined" ) when = "now";

		settings.paused = false;
		chain( when );
	};


	// run all at once
	promise.runAll = function() {
		if ( done ) return;

		promise.hold();

		var i = index,
			element;

		while ( element = $elements.get( i ) ) {
			callback.apply( element );
			$( element ).data( "sequence-done" , true );
			i++;
		}

		tidyUp( true );
	};


	// stop the sequence and 
	promise.clear = function() {
		if ( done ) return;

		promise.hold();
		tidyUp( false );
	};


	// clean up in here and handle our promise
	var tidyUp = function( successful ) {
		if ( typeof successful !== "boolean" ) successful = true;

		$elements
			.removeData( "sequence-queued" )
			.removeData( "sequence-done" );

		if ( successful )
			promise.resolve();
		else
			promise.reject();

		done = true;
	};


	// the actual sequence runner
	var chain = function( when ) {
		if ( settings.paused ) return;
		if ( typeof when === "undefined" ) when = "now";

		var interval = settings.interval;

		switch ( when ) {
		case "remaining":
			interval *= remainingDelay;
			break;

		case "now":
			var element = $elements.get( index );
			if ( typeof element === "undefined" ) return;

			callback.apply( element );
			$( element ).data( "sequence-done", true );
			index++;

			if ( index === $elements.length ) {
				tidyUp( true );
				return;
			}
			break;
		}

		currentRunTimestamp = Date.now();
		currentRunTimeout = setTimeout( function() {
			chain();
		}, interval );
	};

	// setTimeout is used before the first call to wait for a page to load completely
	// else the first call of the sequence would be run and then stutter to wait for the page to finish loading
	if ( instantly ) {
		setTimeout( function () {
			chain();
		} );
	}

	return promise;
};

} )( jQuery );