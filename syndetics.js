/* testing a fix to enterprise */
/* loading Unbound settings with account id: 1982, i_id:0 */ 
Unbound_browserClassesAA = {"shortName":"webkit","brand":"chrome","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/110.0.0.0 Safari\/537.36","classes":{"chrome":1,"webkit":1,"windows":1},"png_compatible":1,"touchDevice":0,"os":"windows","version":4};
				/*
				$backend_connector_filename_minified = /var/www/html/connector/connector_unbound_infiniti.min.js
				*/
				/* not cached or minified */
/* su connector version: latest */
/* including file: /var/www/html/syndeticsunbound/connector/syndeticsunbound_connector.js */	LibraryThingConnector = {
		loglevel: 1,
		metadata: null,
		metadataSource: null,
		errors: [],
		stats : {
			enrichments_shown : [],
			errors: [],
			enrichments_count : 0
		},
		sessions:{},
		enrichments_count: 0,
		enrichments_shown : [],
		metadataTypes: [
			'title',
			'author',
			'isbns',
			'upc',
			'issns',
			'itemInfo',
			'accession',
			'coverurl',
		],
		SEARCHRESULT_LIGHTBOX_WIDTH: 700,
		SEARCHRESULT_LIGHTBOX_HEIGHT: 700,
		utils: {},
		widgets: {
			stackMap: {},
			shouldWatchForUrlChange: true // triggers bdw js to link
		},
		isbn_identifiers : {}, // standard identifiers returned from widgets
		upc_identifiers : {}, // UPC standard identifiers returned from widgets
		issn_identifiers : {}, // ISSN standard identifiers returned from widgets
		bestidentifiersAA : {
		isbnA: [],
			upcA: []
		}, // returned from LT widgets for syndeticsNoData
		browser : {
			classesAA: {}
		}, // browser type classes
		timing: { // timing, included in stats
			init: {},
			loads: {},
			hover: {
				api: {
					lt: {},
					pq: {}
				},
				javascript: []
			},
			searchresults: {
				api: {
					lt: {},
					pq: {}
				},
				javascript: []
			},
			widgets: {
				lt: {},
				pq: {}
			},
			metadata: { },
			content: [ ]

		},
	};

// console fallback for IE8 or less
// from: http://stackoverflow.com/questions/690251/what-happened-to-console-log-in-ie8
(function (fallback) {

    fallback = fallback || function () { };

    // function to trap most of the console functions from the FireBug Console API.
    var trap = function () {
        // create an Array from the arguments Object
        var args = Array.prototype.slice.call(arguments);
        // console.raw captures the raw args, without converting toString
        console.raw.push(args);
        var message = args.join(' ');
        console.messages.push(message);
        fallback(message);
    };

    // redefine console
    if (typeof console === 'undefined') {
        console = {
            messages: [],
            raw: [],
            dump: function() { return console.messages.join('\n'); },
            log: trap,
            debug: trap,
            info: trap,
            warn: trap,
            error: trap,
            assert: trap,
            clear: function() {
                  console.messages.length = 0;
                  console.raw.length = 0 ;
            },
            dir: trap,
            dirxml: trap,
            trace: trap,
            group: trap,
            groupCollapsed: trap,
            groupEnd: trap,
            time: trap,
            timeEnd: trap,
            timeStamp: trap,
            profile: trap,
            profileEnd: trap,
            count: trap,
            exception: trap,
            table: trap
        };
    }

})(null); // to define a fallback function, replace null with the name of the function (ex: alert)




LibraryThingConnector.info = function (msg, level)
	{
	level = level || 1;
	if (typeof LibraryThingConnector.loglevel !== "undefined" && level >= LibraryThingConnector.loglevel)
		{
		try {
		console.info(msg);
		}
		catch(err) {}
		}
	};
LibraryThingConnector.log = function (msg, level)
	{
		level = level || 1;
		if (typeof LibraryThingConnector.loglevel !== "undefined" && level >= LibraryThingConnector.loglevel)
		{
			try {
				console.info(msg);
			}
			catch(err) {}
		}
	};
LibraryThingConnector.debug = function (msg, level)
	{
	level = level || 1;
	if (typeof LibraryThingConnector.loglevel !== "undefined" && level >= LibraryThingConnector.loglevel)
		{
		try {
		console.debug(msg);
		}
		catch(err) {}
		}
	};

LibraryThingConnector.warn = function (msg, level)
	{
	level = level || 1;
	if (level >= LibraryThingConnector.loglevel)
		{
		console.warn(msg);
		}
	};
LibraryThingConnector.error = function (msg, level)
{
	level = level || 1;
	if (level >= LibraryThingConnector.loglevel)
	{
		console.error(msg);
	}
};



/* ported from syndetics widget_connector */
if( typeof $syndetics === "undefined" )
	{
	$syndetics = {};
	// $syndetics.jQuery loaded by initiator setup
	}
$syndetics.callback = function() {}; // stub

// wrapper for opening unbound lightbox called by syndetics unbound widgets
LibraryThingConnector.syndetics_open_unbound_lightbox = function (url, clicked_link, title)
	{
	LibraryThingConnector.debug('open_unbound_lightbox to url: ' + url);
	if( !title )
		{
		var title = LibraryThingConnector.utils.jQuery(clicked_link)
			.closest('div.unbound_element')
			.children('h3.unbound_header')
			.text();
		}
	if( LibraryThingConnector.backend.name == 'eds' )
		{
		window.LibraryThingConnector.openLightbox(url, {'title': title});
		}
	else
		{
		LibraryThingConnector.openLightbox(url, {'title': title});
		}
	return;
	};
$syndetics.open_unbound_lightbox = LibraryThingConnector.syndetics_open_unbound_lightbox;

LibraryThingConnector.get_all_upcs = function(html) {
	LibraryThingConnector.debug('get_all_upcs');
	LibraryThingConnector.debug(html);
	var upcs = html.match(/\D(([0-9]{12}))\D/g) || [];
	return LibraryThingConnector.utils.jQuery.unique(LibraryThingConnector.utils.jQuery.grep(
      LibraryThingConnector.utils.jQuery.map(
        upcs,
        function(upc) {
          return upc.substring(1, upc.length - 1);
        }
      ),
      LibraryThingConnector.valid_upc
    )
  ).sort();
};


LibraryThingConnector.get_all_issns = function (html)
	{
	LibraryThingConnector.debug('get_all_issns');
	LibraryThingConnector.debug(html);
	var issns = html.match(/\D([0-9]{8}|[0-9]{7}[xX])\D/g) || [];
	return LibraryThingConnector.utils.jQuery.unique(
		LibraryThingConnector.utils.jQuery.grep(
			LibraryThingConnector.utils.jQuery.map(
				issns,
				function (issn)
				{
				return issn.substring(1, issn.length - 1);
				}
			),
			LibraryThingConnector.valid_issn
		)
	).sort();
	};

LibraryThingConnector.valid_isbn = function (isbn)
	{
	switch (isbn.length)
	{
		case 10:
			return LibraryThingConnector.valid_isbn10(isbn);
		case 13:
			return LibraryThingConnector.valid_isbn13(isbn);
		default:
			return false;
	}
	};

LibraryThingConnector.valid_isbn10 = function (isbn)
	{
	var total = 0;
	for (var i = 0; i < 10; i++)
		{
		var digit = isbn.charAt(i).toUpperCase();
		if (digit == 'X')
			{
			total += 10;
			}
		else
			{
			total += parseInt(digit) * (10 - i);
			}
		}
	return total % 11 == 0;
	};

LibraryThingConnector.valid_isbn13 = function (isbn)
	{
	var total = 0;
	for (var i = 0; i < 13; i++)
		{
		var digit = parseInt(isbn.charAt(i));
		if (i % 2 == 0)
			{
			total += digit;
			}
		else
			{
			total += digit * 3;
			}
		}
	return total % 10 == 0;
	};

LibraryThingConnector.valid_upc = function (upc)
	{
	var total = 0;
	for (var i = 0; i < 12; i++)
		{
		var digit = parseInt(upc.charAt(i));
		if (i % 2 == 0)
			{
			total += digit * 3;
			}
		else
			{
			total += digit;
			}
		}
	return total % 10 == 0;
	};

LibraryThingConnector.valid_issn = function (issn)
	{
	issn = issn.replace(/[^\dX]/gi, '');
	if (issn.length != 8)
		{
		return false;
		}
	var chars = issn.split('');
	if (chars[7].toUpperCase() == 'X')
		{
		chars[7] = 10;
		}
	var sum = 0;
	for (var i = 0; i < chars.length; i++)
		{
		sum += ((8 - i) * parseInt(chars[i]));
		}
	;
	return ((sum % 11) == 0);
	};

LibraryThingConnector.attachInitOnDomLoaded = function (func)
	{


	if (typeof(window.Unbound_loaded) == "undefined")
		{
		if (document.addEventListener)
			{
			if (document.readyState == "complete"
				|| document.readyState == "loaded"
				|| document.readyState == "interactive"
			)
				{
				func();
				}
			else
				{
				document.addEventListener("DOMContentLoaded", func, false);
				}
			}
		else if (window.addEventListener)
			{
			window.addEventListener("load", func, false);
			}
		else if (window.attachEvent)
			{
			window.attachEvent("onload", func);
			}
		}
	window.Unbound_loaded = 1;
	};

if(typeof LibraryThingConnector.inited === 'undefined')
	{
	LibraryThingConnector.inited = false;
	}
if(typeof LibraryThingConnector.lightbox_inited === 'undefined')
	{
	LibraryThingConnector.lightbox_inited = false;
	}
if( typeof LibraryThingConnector.unboundInitCalledB === 'undefined')
	{
	LibraryThingConnector.unboundInitCalledB = false;
	}

/**
 * intiialize LibraryThingConnector within lightbox context, does subset of LibraryThingConnector.init()
 */
LibraryThingConnector.init_lightbox = function()
	{
	if (LibraryThingConnector.lightbox_inited )
		{
		LibraryThingConnector.debug('lightbox js already inited');
		return;
		}
	LibraryThingConnector.info('init_lightbox');

	// collect information from lightbox url for stats purposes
	var query_hash = LibraryThingConnector.utils.parse_queries();

	// for determine stats type
	var enrichment_type = query_hash['type'];
	if( !enrichment_type )
		{
		enrichment_type = query_hash['enrichment_type'];
		}
	if( !enrichment_type )
		{
		enrichment_type = query_hash['enhancement'];
		if( typeof enrichment_type !== "undefined" )
			{
			enrichment_type = enrichment_type.replace('unbound_','');
			}
		}

	// set metadata so it can be recorded in stats
	var metadata = {
		'isbns': query_hash['su_isbns'],
		'title' : query_hash['su_title'],
		'author' : query_hash['su_author'],
		'itemInfo' : query_hash['su_itemInfo'],
		'catalog_url' : query_hash['su_catalog_url']
	};
	LibraryThingConnector.setMetadata(metadata, 'lightbox');
	LibraryThingConnector.globals.enrichment_opened = query_hash['type'];

	LibraryThingConnector.initContainerQueries();

	// enrichment-specific stats collection
	LibraryThingConnector.attachTagBrowseHandlers();
	LibraryThingConnector.attachBookProfileHandlers();
	LibraryThingConnector.attachAwardsBrowserHandlers();
	LibraryThingConnector.attachLookInsideBrowserHandlers();

//	LibraryThingConnector.attachScrollHandler();
// 	LibraryThingConnector.attachBeforeUnLoadHandler();
	LibraryThingConnector.attachHashChangeHandler();

	// Harvest identifiers (for building hovers)
	LibraryThingConnector.harvestIdentifiers('body', LibraryThingConnector.globals.enrichment_opened);

	LibraryThingConnector.requestLTAPI();
	LibraryThingConnector.requestSyndeticsAPI();

	// for author lightbox
	LibraryThingConnector.insertAuthorImage();

	// add in hover div HTML
	LibraryThingConnector.debug('adding hoverDiv into body for lightbox');
	LibraryThingConnector.addHoverToBody();

	// // add in hovers
	LibraryThingConnector.attachHoverToCovers('body');


	// // add in expand see more in .unbound_truncate
	LibraryThingConnector.attachExpands('body');
	//LibraryThingConnector.addExpands('.unbound_award_text',50,'more','');
	LibraryThingConnector.addExpands('.unbound_award_text',50,LibraryThingConnector.translationstringsA.readmore,'');
	LibraryThingConnector.addFooterHtml();
	LibraryThingConnector.attachLibrarianPowerHandlers();

	if ( typeof LibraryThingConnector.backend.init_lightbox !== 'undefined' )
		{
		LibraryThingConnector.info('running LibraryThingConnector.backend.init_lightbox hook');
		LibraryThingConnector.backend.init_lightbox();
		}
	if ( typeof LibraryThingConnector.backend.unboundLoaded !== 'undefined' )
		{
		LibraryThingConnector.info('running LibraryThingConnector.backend.unboundLoaded hook');
		LibraryThingConnector.backend.unboundLoaded();
		}

	LibraryThingConnector.lightbox_inited = true;
	};

LibraryThingConnector.addFooterHtml = function()
	{
	if(LibraryThingConnector.footerHTML)
		{
		LibraryThingConnector.info('addFooterHtml');
		if( LibraryThingConnector.utils.jQuery('.unbound_lightbox_content').length)
			{
			LibraryThingConnector.utils.jQuery('.unbound_lightbox_content').append(LibraryThingConnector.footerHTML);
			}
		else
			{
			LibraryThingConnector.utils.jQuery('body').append(LibraryThingConnector.footerHTML);
			}
		}
	};
/* shim for existing LTFL backend code that requires LibraryThingConnector.widgets.run() method
*/
LibraryThingConnector.widgets.run = function(isbn,containingDivId)
	{
	LibraryThingConnector.info('widgets.run called. running .init');
	LibraryThingConnector.init_variables();
	LibraryThingConnector.init();
	};

/* shim for catalogs that call old LTFL function directly
 */
function LT_get_widget_logic()
	{
	if ( LibraryThingConnector.inited )
		{
		LibraryThingConnector.info('LT_get_widget_logic called, already inited, not re-running');
		}
	else
		{
		LibraryThingConnector.info('LT_get_widget_logic called. running .init');
		LibraryThingConnector.init_variables();
		LibraryThingConnector.init();
		}
	}

if( typeof LibraryThingConnector.backend === "undefined" )
	{
	LibraryThingConnector.backend = {};
	LibraryThingConnector.backend.widgets = {};
	LibraryThingConnector.backend.widgets.run = function(isbn,containingDiv)
		{
		LibraryThingConnector.debug('backend.widgets.run: isbn: ' + isbn + ' containingDiv: ' + containingDiv);
		LibraryThingConnector.backends.enterprise.widgets.run(isbn,containingDiv);
		LibraryThingConnector.setMetadata(LibraryThingConnector.metadata,'backend');
		};
	}

LibraryThingConnector.syndeticsNoData = function()
	{
	LibraryThingConnector.info('syndeticsNoData:');
	if ( LibraryThingConnector.syndeticsNoDataCalledB)
		{
		LibraryThingConnector.info('syndetics already retried, not calling again');

		// make sure page stats gets called in this case
		LibraryThingConnector.statsRecordLPQ = true;
		LibraryThingConnector.recordPageStats();
		return;
		}
	LibraryThingConnector.syndeticsNoDataCalledB = true;

	if( typeof LibraryThingConnector.bestidentifiersAA !== 'undefined' && (LibraryThingConnector.bestidentifiersAA.isbnA.length || LibraryThingConnector.bestidentifiersAA.upcA.length ) && LibraryThingConnector.workcode)
		{
		LibraryThingConnector.info('got bestidentifiersAA from LT widgets, reloading syndetics widgets');
		LibraryThingConnector.stats.syndeticsNoData = 1; // record in stats
		var _metadata = LibraryThingConnector.metadata;
		_metadata.isbns = LibraryThingConnector.bestidentifiersAA.isbnA;
		_metadata.upcs = LibraryThingConnector.bestidentifiersAA.upcA;
		LibraryThingConnector.setMetadata(_metadata, 'ltwidgets');
		LibraryThingConnector.loadSyndeticsWidgets();
		}
	else
		{
		LibraryThingConnector.retrySyndeticsB = true;
		LibraryThingConnector.info('LT widgets not yet loaded, setting flag to reload syndetics when they do');
		}
	};


// called by custom Enterprise js to start up Unbound and LTFL
doLibraryThingConnector = function(isbn,elementName) {
	if (LibraryThingConnector.enrichments_disabledB)
		{
		LibraryThingConnector.info('enrichments_disabledB is true so not initing')
		return;
		}
	if(!LibraryThingConnector.backend.onModalPage())
		{
		LibraryThingConnector.info('doLibraryThingConnector onModalPage is false, just setting metadata');
		LibraryThingConnector.containingEl = LibraryThingConnector.utils.jQuery('#'+elementName).get(0);
		LibraryThingConnector.containingDivId = elementName;
		LibraryThingConnector.setMetadata(LibraryThingConnector.metadata,'backend');
		return;
		}
	if( !elementName )
		{
		LibraryThingConnector.info('no elementName passed into doLibraryThingConnector, getting from backend');
		modalPanelAA = LibraryThingConnector.backend.getModalPanel();
		if ( modalPanelAA )
			{
			isbn = modalPanelAA['isbn'];
			elementName = modalPanelAA['id'];
			}
		}
	LibraryThingConnector.info('doLibraryThingConnector modalPage');
	LibraryThingConnector.init_variables(); // re-init variales
	// force full pagetype
	LibraryThingConnector.pagetype = 'full';
	// LibraryThingConnector.inited = false;
	// LibraryThingConnector.pagetype = 'full'; // TODO from backend
	// LibraryThingConnector.pageStatsRecordedB = false;
	// LibraryThingConnector.LTFLWidgetsLoadedB = false;
	// LibraryThingConnector.unboundContentAddedCalledB = false;
	// LibraryThingConnector.SyndeticsWidgetsLoadedB = false;
	LibraryThingConnector.shouldLoadSyndeticsWidgets = true; // force loading of syndetics widgets
	delete LibraryThingConnector.ISBNS;
	LibraryThingConnector.info('doLibraryThingConnector with isbn: ' + isbn + 'elementName: ' + elementName);
	var ranB = LibraryThingConnector.backends.enterprise.widgets.run(isbn,elementName);
	if( ranB )
		{
		LibraryThingConnector.containingEl = LibraryThingConnector.utils.jQuery('#'+elementName).get(0);
		LibraryThingConnector.containingDivId = elementName;
		LibraryThingConnector.setMetadata(LibraryThingConnector.metadata,'backend');
		LibraryThingConnector.init();
		}
};

/* legacy code for book display widgets */
LibraryThingConnector.widgets.watchForUrlChange = function ()
	{
	LibraryThingConnector.debug('watchForUrlChange');
	if (typeof window.onpageshow != 'undefined' && LibraryThingConnector.browser.classesAA['ipad']) // for ipads, refresh the page if we're coming back from a fwd/back cache event
		{
		window.onpageshow = function (event)
			{
			if (event.persisted)
				{
				window.location.reload()
				}
			};
		}
	LibraryThingConnector.widgets.urlChangeTimer = setInterval(function ()
	{
	// LibraryThingConnector.log("checking for url change");
	var curHash = '';
	try
		{
		curHash = window.top.location.hash;
		}
	catch (err)
		{
		LibraryThingConnector.log('unable to check current window.top hash', 10);
		LibraryThingConnector.log(err, 10);
		}
	//LibraryThingConnector.log(curHash);
	if (curHash.match(/LTGoto/))
		{
		var hashAndKey = curHash.split(':');
		if (hashAndKey.length > 1 && LibraryThingConnector.widgets.shouldWatchForUrlChange)
			{
			LibraryThingConnector.log('found haskAndKey, setting to _ and adding to history.pushState');
			// add to browser history in case we're coming from an iframe link that has to use window.location.replace -- that removes the current page from history
			// change hash to mean do nothing
			if( LibraryThingConnector.browser.brand == 'chrome')
				{
				LibraryThingConnector.log('not changing hash to _ for chrome');
				}
			else
				{
				LibraryThingConnector.log('changing hash to _');
				window.top.location.hash = '_';
				}
			var raw_page_url = window.top.location.href.split('#')[0];
			if( history && history.pushState )
				{
				history.pushState(null, raw_page_url, raw_page_url); // note, don't include the hash b/c that would cause the page to go right back to LTGoto
				}
			else
				{
				// IE does not support history.pushState.  But....it doesn't seem to break the back button, either.
				}
			LibraryThingConnector.widgets.shouldWatchForUrlChange = false;
			var cacheKey = hashAndKey[1];
			LibraryThingConnector.log('checking for url to go to at key:' + cacheKey);
			var LTGotoUrl = LibraryThingConnector.LTFL_BASE_URL + 'get_url.php?key=' + cacheKey;
			LibraryThingConnector.utils.requestContent(LTGotoUrl);
			}
		}
	}, 100);
	};

LibraryThingConnector.reinit = function()
	{
	LibraryThingConnector.info('reinit');
	LibraryThingConnector.init_variables();
	LibraryThingConnector.init();
	};

LibraryThingConnector.init_variables = function()
	{
	LibraryThingConnector.info('re-init variables');
	// LibraryThingConnector.megaDivHTML = '';
	// LibraryThingConnector.hoverDivHTML = '';
	// LibraryThingConnector.megadiv_id = '';
	var _current_megadiv_id = LibraryThingConnector.utils.jQuery('.unbound_mega').attr('id');

	// TODO see if we can just hide the old one
	if ( LibraryThingConnector.backend.name == 'summon' || LibraryThingConnector.backend.name == 'accessit' || LibraryThingConnector.backend.name == 'soutron')
		{
		// detach existing hovers
		var existing_hovers = LibraryThingConnector.utils.jQuery('.unbound_mega').next('.unbound_hover');
		if( existing_hovers )
			{
			LibraryThingConnector.info('detaching existing unbound_hover next to megadiv');
			LibraryThingConnector.utils.jQuery(existing_hovers).detach();
			}
		// remove old megadiv, needs !important bc regular unbound.css does so
		LibraryThingConnector.debug('removing old megadiv');
		LibraryThingConnector.utils.jQuery('#'+_current_megadiv_id).remove();
		LibraryThingConnector.hoverAddedB = false; // reset this so that addHoverToBody knows it needs to re-do
		}

	var startTime = new Date().getTime();
	if( LibraryThingConnector.utils.jQuery('.unbound_mega').length )
		{
		LibraryThingConnector.info('renaming old megadiv id');
		LibraryThingConnector.utils.jQuery('.unbound_mega').each(function(n)
		{
		LibraryThingConnector.utils.jQuery(this).attr('id', startTime);
		});

		}
	LibraryThingConnector.inited = false;
	LibraryThingConnector.megaDivInsertedB = false;
	LibraryThingConnector.metadataExtractedB = false;
	LibraryThingConnector.LTFLWidgetsLoadedB = false;
	LibraryThingConnector.loadingLTFLWidgetsB = false;
	LibraryThingConnector.loadingSyndeticsWidgetsB = false;
	LibraryThingConnector.contentReadyB = false;
	LibraryThingConnector.SyndeticsWidgetsLoadedB = false;
	LibraryThingConnector.syndeticsNoDataCalledB = false;
	LibraryThingConnector.workcode = 0;
	LibraryThingConnector.pagetype = null;
	LibraryThingConnector.isbn_identifiers = {};
	LibraryThingConnector.upc_identifiers = {};
	LibraryThingConnector.issn_identifiers = {};
	LibraryThingConnector.ISBNS = [];
	LibraryThingConnector.bestidentifiersAA = {
		isbnA : [],
		upcA: []
	};
	LibraryThingConnector.pageStatsRecordedB = false;
	LibraryThingConnector.statsRecordLTB = false;
	LibraryThingConnector.statsRecordLPQ = false;
	LibraryThingConnector.searchStatsRecordedB = false;
	LibraryThingConnector.searchStatsRecordLTB = false;
	LibraryThingConnector.searchStatsRecordLPQ = false;
	LibraryThingConnector.contentReady_Intervalh  = null;
	LibraryThingConnector.BDW_loadedB = false;
	LibraryThingConnector.contentReady_tries  = 0;
	LibraryThingConnector.contentReady_max_tries  = 500;
	LibraryThingConnector.unboundContentAddedCalledB = false;
	LibraryThingConnector.containingDivId = null;
	LibraryThingConnector.catalog_language_raw = null;
	LibraryThingConnector.catalog_language = null;
	LibraryThingConnector.catalog_language_code = null;
	LibraryThingConnector._hoverElement = {}; // need to reset this so that getHover() gets a new #unbound_hover
	LibraryThingConnector.containingEl = null;
	LibraryThingConnector.init_abortedB  = false;
	LibraryThingConnector.contentReadyInterval = 500; // ms to retry extracting metadata and inserting mega div if content not ready
	LibraryThingConnector.metadata = null;
	LibraryThingConnector.timing = { // timing, included in stats
		init: {},
		loads: {},
		hover: {
		api: {
		lt: {},
		pq: {}
		},
		javascript: []
		},
		searchresults: {
		api: {
		lt: {},
		pq: {}
		},
		javascript: []
		},
		widgets: {
		lt: {},
		pq: {}
		},
		metadata: { },
		content: [ ]

		};
	var currentTime = new Date().getTime();
	LibraryThingConnector.su_session = Math.random().toString(24);
	LibraryThingConnector.stats = {
		enrichments_shown : [],
		enrichments_count: 0,
		errors: []
	}; // houses enrichment/load/lightbox statistics
	LibraryThingConnector.errors = [];
	LibraryThingConnector.globals = {

	}; // container for globals

	if( typeof LibraryThingConnector.sessions !== 'undefined')
		{
		LibraryThingConnector.sessions[LibraryThingConnector.su_session] = {};
		}
	if ( typeof LibraryThingConnector.backend.init_variables !== 'undefined' )
		{
		LibraryThingConnector.info('running backend init_variables hook');
		LibraryThingConnector.backend.init_variables();
		}
	}


	/**
 * initialize LibraryThingConnector
 * called for regular in-catalog enhancements
 */
LibraryThingConnector.init = function ()
	{
		if (LibraryThingConnector.inited )
		{
		return;
		}
		LibraryThingConnector.loadBDW();

	try {
		LibraryThingConnector.clearDebugPanel();
	}
	catch (e)
		{
		LibraryThingConnector.info(e);
		}
	if (LibraryThingConnector.enrichments_disabledB)
		{
		// run unboundInit in this case as well
		if (typeof unboundInit !== 'undefined' && typeof unboundInit == 'function' && !LibraryThingConnector.unboundInitCalledB)
			{
			LibraryThingConnector.info('found unboundInit function, running');
			LibraryThingConnector.unboundInitCalledB = true;
			unboundInit();
			return;
			}
		LibraryThingConnector.info('enrichments_disabledB is true so not initing')
		return;
		}

	// LibraryThingConnector.debug('connector: init started');
	// allow backend to detect content or URL changes and respond appropriately (e.g. reload unbound content for newly clicked page/url)
	if(!LibraryThingConnector.contentChangedHandlerAddedB && LibraryThingConnector.backend && LibraryThingConnector.backend.contentChanged )
		{
		LibraryThingConnector.info('url: ' + location.href);
		LibraryThingConnector.contentChangedHandlerAddedB = true;
		LibraryThingConnector.backend.contentChanged();
		}



	if ( LibraryThingConnector.init_abortedB )
		{
		// LibraryThingConnector.debug('init aborted');
		return;
		}
	if( LibraryThingConnector.pagetype && LibraryThingConnector.backend.name != 'bibliovation' && LibraryThingConnector.backend.name != 'leganto')
		{
		LibraryThingConnector.info('pagetype already set to: ' + LibraryThingConnector.pagetype);
		}
	else
		{
		LibraryThingConnector.info('getting pagetype from backend');
		LibraryThingConnector.pagetype = LibraryThingConnector.backend.pageTypeDetector();
		}
		try {
			LibraryThingConnector.logDebugPanelCustomer();
		} catch(e) {
			LibraryThingConnector.info(e);
		}
		LibraryThingConnector.info('pagetype returned as:' + LibraryThingConnector.pagetype);
	if( LibraryThingConnector.backend.name == 'enterprise' && LibraryThingConnector.containingEl === null && LibraryThingConnector.lsa_id != 2110)
		{
			var isUnboundInfrastructureMigrationB = LibraryThingConnector.backend.isUnboundInfrastructureMigration();
			if (isUnboundInfrastructureMigrationB === 0)
				{
				LibraryThingConnector.info('infra isUnboundInfrastructureMigrationB is OFF, aborting SU init');
				return false;
				}
			else if (isUnboundInfrastructureMigrationB === 1)
				{
				LibraryThingConnector.info('infra isUnboundInfrastructureMigrationB is ON, allowing SU init to continue');
				}
		if( LibraryThingConnector.backend.onModalPage() && LibraryThingConnector.pagetype == 'full')
			{
			if( LibraryThingConnector.backend.isUnboundInfrastructureMigration())
				{
				LibraryThingConnector.info('enterprise: infra migration on modal detecting modal and running on it');
				var enterprise_modalAA = LibraryThingConnector.backend.getModalPanel();
				LibraryThingConnector.info(enterprise_modalAA);
				if (enterprise_modalAA.isbn && typeof enterprise_modalAA.isbn !== 'undefined')
					{
					LibraryThingConnector.info('metadata found, running with unbound');
					LibraryThingConnector.backend.widgets.run(enterprise_modalAA.isbn,enterprise_modalAA.id);
					}
				}
			else
				{
				if( typeof LibraryThingConnector.backend.widgets.runUnboundFromModalPageB !== 'undefined' && LibraryThingConnector.backend.widgets.runUnboundFromModalPageB === true)
					{
					LibraryThingConnector.backend.widgets.runUnboundFromModalPageB = false; // reset
					LibraryThingConnector.info('onModalPage and init called for by enteprrise, running');
					}
				else
					{
					LibraryThingConnector.info('onModalPage and init from enterprise aborted - awaiting callback from Enterprise js but loading BDW');
					return;
					}
				}
			}
		else
			{
			LibraryThingConnector.info('Enterprise and not on modal page, allowing init to continue');
			}
		}
	if( LibraryThingConnector.backend.name == 'iguana' && !LibraryThingConnector.metadata)
		{
		LibraryThingConnector.info('aborting .init for infor with no metadata set');
		return;
		}
	// for new primo, don't run .init if metadata not set
	if( LibraryThingConnector.backend.name == 'primo' && LibraryThingConnector.backend.getPrimoVersion() == 'new' && LibraryThingConnector.pagetype != 'summary' && LibraryThingConnector.metadata === null)
		{
		LibraryThingConnector.info('aborting .init for primo with no metadata set');
		return;
		}
		if( LibraryThingConnector.backend.name == 'summonoveralma' && !LibraryThingConnector.metadata && /discovery/.test(window.location.href) && LibraryThingConnector.pagetype != 'summary')
			{
			LibraryThingConnector.info('aborting .init for primo with no metadata set');
			return;
			}

		if (typeof unboundInit !== 'undefined' && typeof unboundInit == 'function' && !LibraryThingConnector.unboundInitCalledB)
			{
			LibraryThingConnector.info('found unboundInit function, running');
			LibraryThingConnector.unboundInitCalledB = true;
			unboundInit();
			return;
			}

		var startTime = new Date().getTime();
	LibraryThingConnector.timing.init.start = startTime;

	if( LibraryThingConnector.backend && LibraryThingConnector.backend.getContainingEl )
		{
		LibraryThingConnector.debug('containingEl from backend');
		LibraryThingConnector.containingEl = LibraryThingConnector.backend.getContainingEl();
		LibraryThingConnector.debug(LibraryThingConnector.containingEl);
		}
	else if( typeof LibraryThingConnector.containingEl !== 'undefined')
		{
		LibraryThingConnector.info('containingEl already set, using that');
		LibraryThingConnector.info(LibraryThingConnector.containingEl);
		}
	else
		{
		LibraryThingConnector.info('containingEl not set, using document.body');
		LibraryThingConnector.containingEl = document.body;
		}

		if (typeof LibraryThingConnector.backend.contentReady_Intervalh !== 'undefined' )
			{
			LibraryThingConnector.info('contentReady_Intervalh from backend');
			LibraryThingConnector.contentReadyInterval = LibraryThingConnector.backend.contentReadyInterval;
			}
		if (typeof LibraryThingConnector.backend.contentReady_max_tries !== 'undefined' )
			{
			LibraryThingConnector.info('contentReady_max_tries from backend');
			LibraryThingConnector.contentReady_max_tries = LibraryThingConnector.backend.contentReady_max_tries;
			}
	if( LibraryThingConnector.backend && LibraryThingConnector.backend.contentReady )
		{
		LibraryThingConnector.debug('init: checking with backend for contentReady');
		LibraryThingConnector.contentReadyB = LibraryThingConnector.backend.contentReady(LibraryThingConnector.containingEl);
		}
	else // assume content is ready if backend does not support contentReady() method
		{
		LibraryThingConnector.contentReadyB = true;
		}

	if( !LibraryThingConnector.contentReadyB )
		{
		// LibraryThingConnector.debug('content not ready, trying in ' + LibraryThingConnector.contentReadyInterval + 'ms');
		if( LibraryThingConnector.backend.name == 'polaris' )
			{
			LibraryThingConnector.contentReadyInterval = 1500; // ms to retry extracting metadata and inserting mega div if content not ready
			LibraryThingConnector.contentReady_max_tries = 500;
			}
		LibraryThingConnector.contentReady_Intervalh = setInterval(LibraryThingConnector.init,LibraryThingConnector.contentReadyInterval);
		LibraryThingConnector.inited = false;
		LibraryThingConnector.contentReady_tries++;

		if ( LibraryThingConnector.contentReady_tries > LibraryThingConnector.contentReady_max_tries)
			{
			LibraryThingConnector.warn('content never reported ready by backend, aborting');
			LibraryThingConnector.init_abortedB  = true;
			LibraryThingConnector.inited = true;
			clearInterval(LibraryThingConnector.contentReady_Intervalh);
			if( LibraryThingConnector.backend && LibraryThingConnector.backend.contentNeverReady )
				{
				LibraryThingConnector.backend.contentNeverReady();
				}
			}
		return;
		}
	else
		{
		LibraryThingConnector.info('backend reports content ready (or we assume it is if backend does not support contentReady method)');
		LibraryThingConnector.loadBDW();
		}
	if (typeof LibraryThingConnector.backend.detectLanguage !== 'undefined')
		{
		LibraryThingConnector.info('detecting language');
		var language = LibraryThingConnector.backend.detectLanguage();
		if ( language )
			{
			LibraryThingConnector.info('language detected: ' + language);
			LibraryThingConnector.catalog_language_raw = language;
			var lang_key = language;
			if ( typeof LibraryThingConnector.languagestrings_to_codesAA[lang_key] != 'undefined' )
				{
				LibraryThingConnector.catalog_language_code = LibraryThingConnector.languagestrings_to_codesAA[lang_key];
				LibraryThingConnector.catalog_language = LibraryThingConnector.catalog_language_code;
				}
			else
				{
				LibraryThingConnector.warn('no language code found for raw language string: ' + language);
				}
			}
		else
			{
			LibraryThingConnector.catalog_language = 'eng';
			LibraryThingConnector.catalog_language_raw = 'eng';
			LibraryThingConnector.catalog_language_code = 'eng';
			}
		}
	var searchDivRanB = false;
	if( LibraryThingConnector.pagetype == 'summary' )
		{
		LibraryThingConnector.info('summary pagetype found');
		if( typeof LibraryThingConnector.run_search_div !== 'undefined' && LibraryThingConnector.run_search_div)
			{
			LibraryThingConnector.info('running unbound on search results');
			searchDivRanB = LibraryThingConnector.init_searchresults(); // NB only actually runs if the backend has implemented the required methods
			}
		}

	if( !LibraryThingConnector.eventListenersAddedB )
		{
		LibraryThingConnector.info('adding event listeners');
		LibraryThingConnector.addEventListeners();
		LibraryThingConnector.eventListenersAddedB = true;
		}
	else
		{
		LibraryThingConnector.info('not re-adding event listeners');
		}
	// check for existing unbound divs that are split out and mark them
	if (typeof LibraryThingConnector.backend.beforeInsertMegaDiv !== 'undefined')
		{
		LibraryThingConnector.info('found backend beforeInsertMegaDiv, calling');
		LibraryThingConnector.backend.beforeInsertMegaDiv();
		}

		// LibraryThingConnector.widgets.stackMap.paramsA = [];
	LibraryThingConnector.info('megaDiv insertion');
	LibraryThingConnector.insertMegaDiv(LibraryThingConnector.megaDivHTML);
	if( typeof LibraryThingConnector.backend.afterInsertMegaDiv !== 'undefined' )
		{
		LibraryThingConnector.info('found backend afterInsertMegaDiv, calling');
		LibraryThingConnector.backend.afterInsertMegaDiv();
		}

	LibraryThingConnector.debug('browser type');
	LibraryThingConnector.debug(LibraryThingConnector.getBrowserType());

	// Metadata Extraction
	// TODO decide if we want top level COiNS or not
	/*
	var metadataFromCoins = LibraryThingConnector.getMetadataFromCoins(document.body);
	if (metadataFromCoins)
		{
		LibraryThingConnector.log('metadata from coins');
		LibraryThingConnector.setMetadata(metadataFromCoins, 'coins');
		}
	*/


	LibraryThingConnector.salestoolB = false;
	//if we are on the syndeticsunbound demo default to fullpage
	if(/syndeticsunbound\/demo/.test(window.location.href))
		{
		LibraryThingConnector.pagetype = 'full';
		LibraryThingConnector.salestoolB = true;
		}
	if(/\/tests\/manual\/opacs/.test(window.location.href))
		{
		LibraryThingConnector.pagetype = 'full';
		}
	if( LibraryThingConnector.a_id == 22 )
		{
		LibraryThingConnector.info('forcing pagetype of full for test account 22');
		LibraryThingConnector.pagetype = 'full';
		}

	var startTime = new Date().getTime();
	if (LibraryThingConnector.backend && LibraryThingConnector.backend.extractMetadata)
		{
		var el = document.body;
		if ( LibraryThingConnector.containingEl && typeof LibraryThingConnector.containingEl !== "undefined")
			{
			el = LibraryThingConnector.containingEl;
			LibraryThingConnector.debug('extract metadata from containingEl');
			LibraryThingConnector.debug(el);
			}
		var data = LibraryThingConnector.backend.extractMetadata(el);
		if( LibraryThingConnector.metadata && typeof LibraryThingConnector.metadata['upc'] == 'undefined')
			{
			LibraryThingConnector.info('no upc found in metadata, extracting from top level');
			var upcs = LibraryThingConnector.get_all_upcs(el.innerHTML);
			data['upc'] = upcs;
			}
		if( LibraryThingConnector.metadata && typeof LibraryThingConnector.metadata['issns'] == 'undefined')
			{
			LibraryThingConnector.info('no issns found in metadata, extracting from top level');
			var issns = LibraryThingConnector.get_all_issns(el.innerHTML);
			data['issns'] = issns;
			}
		if( LibraryThingConnector.metadata ) // can come in from backend
			{
			LibraryThingConnector.info('metadata directly from backend');
			data = LibraryThingConnector.metadata;
			}
		if(typeof LibraryThingConnector.oaisbn !== 'undefined')
			{
			LibraryThingConnector.debug('using oaisbn: ' + LibraryThingConnector.oaisbn);
			data['isbns'] = ["" + LibraryThingConnector.oaisbn];
			data['first_isbn'] = ["" + LibraryThingConnector.oaisbn];
			}

		if (data)
			{
			LibraryThingConnector.debug('metadata from backend');
			LibraryThingConnector.setMetadata(data, LibraryThingConnector.backend.name);
			}
		}
	else
		{
		LibraryThingConnector.warn('no backend found');
		var isbns = LibraryThingConnector.utils.extract_ISBNs(document.body.innerHTML);
		if( isbns )
			{
			var metadata = {};
			metadata['isbns'] = isbns;
			LibraryThingConnector.setMetadata(metadata,'generic');
			}
		}
	LibraryThingConnector.timing.metadata.total = new Date().getTime() - startTime;

	if (LibraryThingConnector.metadata)
		{
		// signal metadata is loaded
		LibraryThingConnector.info('metadata loaded');
		LibraryThingConnector.info(LibraryThingConnector.metadata);

		// Load LTFL Widgets
		LibraryThingConnector.loadWidgets();
		}
	else
		{
		LibraryThingConnector.info('metadata not loaded, not loading widgets');
		}
	// clobber timeouts so page does not auto refresh
	if( typeof LibraryThingConnector.backend.clobberTimeout !== 'undefined' )
		{
		LibraryThingConnector.info('clobbering timeout');
		LibraryThingConnector.backend.clobberTimeout();
		}

	// redefine $syndetics.unbound_lightbox_open method in case other syndetics content overwrite the $syndetics object
	setTimeout(function ()
	{
	LibraryThingConnector.debug('redefining $syndetics.open_unbound_lightbox function');
	// wrapper for opening unbound lightbox called by syndetics unbound widgets, ultimately to be removed in favor of the wrapper include in connector
	$syndetics.open_unbound_lightbox = LibraryThingConnector.syndetics_open_unbound_lightbox;
	}, 2000);
	LibraryThingConnector.initContainerQueries();
	LibraryThingConnector.supportHandler(); // adds classes to megadiv and splitdiv to indicate various css feature support.

	LibraryThingConnector.inited = true;
	var endTime = new Date().getTime();
	LibraryThingConnector.timing.init.total = endTime - startTime;
	LibraryThingConnector.timing.init.end = endTime;
	LibraryThingConnector.info('connector: init completed');
	if( typeof LibraryThingConnector.backend.initCompleted !== 'undefined' )
		{
		LibraryThingConnector.backend.initCompleted();
		}

		if (!LibraryThingConnector.pageStatsRecordedB)
		{
		// make sure recordPageStats is run eventually
		setTimeout(function () {
			if ( !LibraryThingConnector.pageStatsRecordedB )
				{
				// report error here, depending content script failed
				if (LibraryThingConnector.loadingSyndeticsWidgetsB && !LibraryThingConnector.statsRecordLPQ && !LibraryThingConnector.PQWidgetsLoadedB && !LibraryThingConnector.syndeticsNoDataCalledB && !LibraryThingConnector.init_abortedB)
					{
					LibraryThingConnector.info('pq stats not recorded');
					LibraryThingConnector.errors.push(LibraryThingConnector.error_types.WidgetsPQFailed);
					}
				if (LibraryThingConnector.loadingLTFLWidgetsB && !LibraryThingConnector.statsRecordLTB && !LibraryThingConnector.LTFLWidgetsLoadedB && !LibraryThingConnector.init_abortedB)
					{
					LibraryThingConnector.info('lt stats not recorded');
					LibraryThingConnector.errors.push(LibraryThingConnector.error_types.WidgetsLTFailed);
					}
				// now allow recording of page stats
				LibraryThingConnector.info('trying recordPageStats a final time');
				LibraryThingConnector.statsRecordLPQ = true;
				LibraryThingConnector.statsRecordLTB = true;
				LibraryThingConnector.recordPageStats();
				}
		}, 4000);
		}
	if( LibraryThingConnector.suDemoModeB  )
		{
		LibraryThingConnector.showDemoMode();
		}
	};

LibraryThingConnector.init_searchresults = function()
	{
	LibraryThingConnector.info('init_searchresults');
	LibraryThingConnector.metadata = {};
	var searchresults = [];
	var isbn_identifiers = [];
	var upc_identifiers = [];
	var issn_identifiers = [];
	var supportsSearchResultsB = typeof LibraryThingConnector.backend.getSummaryChunks !== 'undefined'
		&&
		typeof LibraryThingConnector.backend.getUnboundInsertNodeSummary !== 'undefined'
		&&
		typeof LibraryThingConnector.backend.unboundInsertSummaryContent !== 'undefined';
	if(supportsSearchResultsB)
		{
		LibraryThingConnector.logDebugPanelMetadata();
		LibraryThingConnector.info('backend supports search results, getting results');
		LibraryThingConnector.info('running getSummaryChunks');
		var summaryChunks = LibraryThingConnector.backend.getSummaryChunks();
		LibraryThingConnector.debug(summaryChunks);
		if( summaryChunks.length )
			{
			LibraryThingConnector.info('found ' + summaryChunks.length + ' search results, running Unbound on them');
			// TODO chunk requests
			var MAX_RESULTS = 15;
			LibraryThingConnector.utils.jQuery(summaryChunks).each( function(i,n )
				{
				LibraryThingConnector.info('running Unbound on search result:'+i);
				LibraryThingConnector.info(n);
				// check if already run on this summaryChunk
				if( LibraryThingConnector.utils.jQuery(n).find('.unbound_searchresult').length )
					{
					LibraryThingConnector.info('search-div already on this chunk, skipping');
					return false; // stop jquery.each
					}


				// harvest identifiers
				var _html = LibraryThingConnector.utils.jQuery(n).html();

				var _isbns = LibraryThingConnector.utils.extract_ISBNs(_html);
				var _upcs = LibraryThingConnector.get_all_upcs(_html);
				var _issns = LibraryThingConnector.get_all_issns(_html);
				var _metadata = LibraryThingConnector.backend.extractMetadata(n);
				// prefer backend's own isbns if we have
				if (typeof _metadata.isbns !== 'undefined')
					{
					LibraryThingConnector.info('using backend isbns from _metadata');
					_isbns = _metadata.isbns;
					}

				// harvest metadata


				var isbn = null;
				var isbn13 = null;
				var upc = null;
				var issn = null;
				// if identifiers found, harvest
				if( _metadata )
					{
					isbn13 = '';
					isbn = _isbns[0];
					if ( isbn )
						{
						LibraryThingConnector.info('found isbns for chunk: ' + _isbns);
						isbn13 = LibraryThingConnector.utils.ISBN_convert10to13(isbn);
						isbn_identifiers.push(isbn13);
						}
					if( _upcs.length )
						{
						upc = _upcs[0];
						upc_identifiers.push(upc);
						}
					if( _issns.length )
						{
						issn = _issns[0];
						issn_identifiers.push(issn);
						}
					// can be used in lieu of identifier
					currentTime = new Date().getTime();
					// only include keys for which we found data to cut down on request size
					var searchDivMetadataKeyA = ['isbns', 'title', 'author', 'upcs', 'issns','upc'];
					var encodeKeysFor = ['title', 'author']
					var _result = {'id': currentTime};
					LibraryThingConnector.utils.jQuery.each(searchDivMetadataKeyA, function (k, key) {
						var metadata_val = _metadata[key];
						if (typeof metadata_val != 'undefined')
							{
							if( typeof metadata_val === 'string')
								{
								metadata_val = LibraryThingConnector.utils.stripControlChars(metadata_val);
								}
							if (typeof encodeKeysFor[key] != 'undefined')
								{
								_result[key] = encodeURIComponent(metadata_val);
								}
							else
								{
								_result[key] = metadata_val;
								}
							}
						}); // each metadata key
					_result['upcs'] = _result['upc']; // searchresults apis except upcs but metadata returns upc
					delete _result['upc'];
					LibraryThingConnector.info('final searchresult _result');
					LibraryThingConnector.info(_result);
					searchresults.push(_result);
					// set up insertNode
					var insertNode = null;
					insertNode = LibraryThingConnector.backend.getUnboundInsertNodeSummary(n);
					LibraryThingConnector.info('insertNode');
					LibraryThingConnector.info(insertNode);

					var summary_html = LibraryThingConnector.searchresults_summaryHTML;
					// transform into dom nodes
					var summary_node = summary_html; // no longer run parseHTML
					// set the identifier for it
					LibraryThingConnector.info('summary_node');
					LibraryThingConnector.info(summary_node);

					if( insertNode )
						{
						// put it in the right place and contaianer
						LibraryThingConnector.info('running unboundInsertSummaryContent');
						LibraryThingConnector.backend.unboundInsertSummaryContent(summary_node, insertNode);

						// var id_attribute = '';
						// if( isbn )
						// 	{
						// 	LibraryThingConnector.debug('found isbn, using it');
						// 	id_attribute = 'isbn:'+isbn13;
						// 	}
						// else
						// 	{
							var id_attribute = 'id:'+currentTime;
							// }
						var summary = LibraryThingConnector.utils.jQuery('.unbound_searchresult',insertNode);
						LibraryThingConnector.utils.jQuery(summary).data('id',id_attribute);
						LibraryThingConnector.utils.jQuery(summary).data('title',_metadata.title);
						LibraryThingConnector.utils.jQuery(summary).attr('data-title',_metadata.title);
						if( _result['upcs'])
							{
							LibraryThingConnector.utils.jQuery(summary).attr('data-upc',_result['upcs']);
							}
						if( _result['issn'])
							{
							LibraryThingConnector.utils.jQuery(summary).attr('data-issn',_result['issn']);
							}
						// also update attribute so it's findable by data-id in dom
						LibraryThingConnector.utils.jQuery(summary).attr('data-id',id_attribute);
						var id = LibraryThingConnector.utils.jQuery(summary).data('id');
						LibraryThingConnector.info('id: ' + id);
						if( isbn13 )
							{
							var isbn_attribute = 'isbn:'+isbn13;
							LibraryThingConnector.utils.jQuery(summary).data('isbn',isbn_attribute);
							// also update attribute so it's findable by data-id in dom
							LibraryThingConnector.utils.jQuery(summary).attr('data-isbn',isbn_attribute);
							}
						}
					} // metadata found
				else
					{
					LibraryThingConnector.info('no metadata found, marking as checked');
					LibraryThingConnector.utils.jQuery(n).addClass('unbound_searchresult').addClass('unbound_searchresult_none');
					}
				});
			} // foreach search result

		// prepare identifiers
		LibraryThingConnector.info('adding identifiers from searchresults: isbn:'+isbn_identifiers.length+' upc:'+upc_identifiers.length+ ' issn:'+issn_identifiers.length)
		LibraryThingConnector.addIdentifiers('searchresults', 'isbn', isbn_identifiers);
		LibraryThingConnector.addIdentifiers('searchresults', 'upc',upc_identifiers);
		LibraryThingConnector.addIdentifiers('searchresults', 'issn',issn_identifiers);

		// request the data
		LibraryThingConnector.requestLTSearchResultsAPI(searchresults);
		LibraryThingConnector.requestSyndeticsSearchResultsAPI(searchresults);
		LibraryThingConnector.searchresults = searchresults;
		if( LibraryThingConnector.backend && LibraryThingConnector.backend.unboundContentAdded && !LibraryThingConnector.unboundContentAddedCalledB)
			{
			LibraryThingConnector.info('running backend.unboundContentAdded');
			LibraryThingConnector.backend.unboundContentAdded(LibraryThingConnector.containingDivId);
			LibraryThingConnector.unboundContentAddedCalledB = true;
			}
		// make sure recordPageStats is run eventually
		setTimeout(function () {
			if (!LibraryThingConnector.searchStatsRecordLTB)
				{
				LibraryThingConnector.info('lt search page stats not recorded');
				LibraryThingConnector.errors.push(LibraryThingConnector.error_types.WidgetsLTFailed);
				}
			if (!LibraryThingConnector.searchStatsRecordPQB)
				{
				LibraryThingConnector.info('pq search page stats not recorded');
				LibraryThingConnector.errors.push(LibraryThingConnector.error_types.WidgetsPQFailed);
				}
				// now allow recording of page stats
				LibraryThingConnector.info('trying recordSearchPageStats a final time');
				LibraryThingConnector.searchStatsRecordLPQ = true;
				LibraryThingConnector.searchStatsRecordLLT = true;
				LibraryThingConnector.recordSearchPageStats();
		}, 4000);
		return true;
		}
	else
		{
		LibraryThingConnector.info('backend: ' + LibraryThingConnector.backend.name + ' does not support searchresults');
		return false;
		}
	};

LibraryThingConnector.getBrowserType = function ()
	{
	return LibraryThingConnector.browserClassesAA;
	};

	LibraryThingConnector.handleHashChange = function (ev) {
		try
			{
			LibraryThingConnector.recordTime(ev);
			} catch (error)
			{
			console.error(error);
			}
	};

LibraryThingConnector.attachHashChangeHandler = function()
{
LibraryThingConnector.info('attachHashChangeHandler');
LibraryThingConnector.utils.jQuery(window).off('hashchange',LibraryThingConnector.handleHashChange).on('hashchange',LibraryThingConnector.handleHashChange);
};

LibraryThingConnector.attachBeforeUnLoadHandler = function()
{
LibraryThingConnector.info('attachBeforeUnloadHandler');
window.onbeforeunload = function(ev) {
    return LibraryThingConnector.handleBeforeUnLoad(ev);
}
};

LibraryThingConnector.recordTime = function (ev) {
	if (LibraryThingConnector.backend.name == 'ebookcentral')
		{
		return;
		}
	try
		{
		LibraryThingConnector.info('recordTime');
		if( typeof LibraryThingConnector.timing.init !== 'undefined' )
			{
			var stats_key = 'timeonpage';
			var endTime = new Date().getTime();
			var totalTime = endTime - LibraryThingConnector.timing.init.start;
			var data = {'type':'timeonpage'};
			data[stats_key] = totalTime;
			LibraryThingConnector.recordStats(data);
			}
		} catch (error)
		{
		console.info('recordTime error');
		console.info(error);
		}

};

LibraryThingConnector.handleBeforeUnLoad = function(ev) {
	try
		{
		LibraryThingConnector.recordTime(ev);
		} catch (error)
		{
		console.error(error);
		}
};

LibraryThingConnector.attachScrollHandler = function()
{
	LibraryThingConnector.info('attachScrollHandler');
	LibraryThingConnector.utils.jQuery(document).off('scroll',LibraryThingConnector.scrollHandler).on('scroll',LibraryThingConnector.utils.jQuery.throttle(1200,LibraryThingConnector.scrollHandler));
};

LibraryThingConnector.scrollHandler = function() {
	LibraryThingConnector.info('unbound: scroll handler');
	var currentTime = new Date().getTime();
	if (typeof LibraryThingConnector.stats['seen'] == 'undefined')
		{
		LibraryThingConnector.stats['seen'] = {};
		}

	var megadiv_el = LibraryThingConnector.getMegaDivEl();
	LibraryThingConnector.stats['seen'][currentTime] = {};
	LibraryThingConnector.stats['seen'][currentTime]['megadiv'] = LibraryThingConnector.utils.isInViewport(megadiv_el);
	if (LibraryThingConnector.enrichmentsShown())
		{
		LibraryThingConnector.utils.jQuery.each(LibraryThingConnector.enrichmentsShown(), function (i, n) {
				var enrichment_el = LibraryThingConnector.utils.jQuery('.unbound_' + n).get(0);
				var enrichment_seen = LibraryThingConnector.utils.isInViewport(enrichment_el);
				LibraryThingConnector.stats['seen'][currentTime][n] = enrichment_seen;
			}
		);
		}

	LibraryThingConnector.recordScrollStat(currentTime);
};

LibraryThingConnector.recordScrollStat = function(currentTime)
{
	LibraryThingConnector.info('recordScrollStat');
	var stats_key = 'seen';
	var data = {
		type:'scroll'
	};
	data[stats_key] = LibraryThingConnector.stats.seen[currentTime];
	LibraryThingConnector.recordStats(data);
};

LibraryThingConnector.recordHoverStat = function(enrichment)
{
// not for ebc yet until we get integrated into ga
if (LibraryThingConnector.backend.name == 'ebookcentral')
	{
	return;
	}
	LibraryThingConnector.info('recordHoverStat');
	var stats_key = 'shown';
	var data = {
		type:'hover',
		enrichment:enrichment
	};
	data[stats_key] = 1;
	LibraryThingConnector.recordStats(data);
};

LibraryThingConnector.attachScrollJumps = function()
{
if( LibraryThingConnector.backend.name == 'enterprise'
	|| LibraryThingConnector.backend.name == 'atriuum'
	|| LibraryThingConnector.backend.name == 'apollo'
)
	{
	LibraryThingConnector.info('not attaching scroll jumps');
	return;
	}
	LibraryThingConnector.debug('attachScrollJumps');
	var _sig = '.unbound_mega .unbound_nav a';
    var scrolling_target_selector = 'body';
    if ( typeof LibraryThingConnector.backend.getContainingDivId !== 'undefined')
		{
		LibraryThingConnector.containingDivId = LibraryThingConnector.backend.getContainingDivId();
		LibraryThingConnector.info('containingDiv for scrollJumps from backend: ' + LibraryThingConnector.containingDivId);
		}
	if ( LibraryThingConnector.containingDivId )
		{
		LibraryThingConnector.debug('srolling divid: ' + LibraryThingConnector.containingDivId + ' rather than body');
		scrolling_target_selector = LibraryThingConnector.containingDivId;
		}
	LibraryThingConnector.utils.jQuery(scrolling_target_selector).not('.unbound_loaded').on('click', _sig, function(event) {
		var _hash = LibraryThingConnector.utils.jQuery(this).attr('href').replace('#','');

		//Yams project
		if( LibraryThingConnector.backend.name == 'apollo' ) //because I can't figure out how to fork this; or rather how to fork and then minimize it appropriately.
			{
			var target = LibraryThingConnector.utils.jQuery('a[name=' + _hash + ']');
			if (target.length)
				{
				LibraryThingConnector.utils.jQuery('html, body').stop().animate({
					scrollTop: target.offset().top
				}, 1000);
				}

			if (event.preventDefault)
				{
				event.preventDefault();
				}
			}
		else
			{
			var target = LibraryThingConnector.utils.jQuery('.unbound_mega a[name='+_hash+']');
			if( target.length )
				{
				LibraryThingConnector.utils.jQuery('html, body').stop().animate({
					scrollTop: target.offset().top
					}, 1000);
				}

			if (event.preventDefault)
				{
				event.preventDefault();
				}
			}
		return false;
	});
};

LibraryThingConnector.seeFullShelf = function(rows, columns, lsi_id, anchor) {
	LibraryThingConnector.debug('seeFullShelf');
	var params = LibraryThingConnector.getParams();
	LibraryThingConnector.debug(LibraryThingConnector.config);
	params['lsa_id'] = LibraryThingConnector.config.accountAA.lsom_lsa_id;
	params['callnumber'] = LibraryThingConnector.metadata['call_nums'].join(',');
	params['ss'] = 'ltfl_shelf_large';
	if ( anchor )
		{
		params['anchor'] = anchor;
		}
if ( lsi_id )
	{
	params['lsi_id'] = lsi_id;
	}
	params['sr'] = rows;
	params['sc'] = columns;
	params['product'] = 'unbound';
	params['enrichment_type'] = 'shelf';
	params['theme'] = 'grey'; // clean theme
	params['client'] = LibraryThingConnector.config.accountAA.syndetics_client;
	delete params['itemInfo'];
	delete params['container_widths'];
	delete params['container_widthAAS'];
	delete params['divs'];
	LibraryThingConnector.debug(params);

	var _lightbox_params = {
		title : LibraryThingConnector.translationstringsA.title_shelfbrowse
	}
	var url = LibraryThingConnector.LTFL_BASE_URL + 'shelfbrowse.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.debug('final seeFullShelf url: ' + url);
	LibraryThingConnector.openLightbox(url, _lightbox_params);
};

LibraryThingConnector.seeAward = function(ck_id) {
	var data = {
		type:'awards_award_clicked'
	};
	LibraryThingConnector.recordStats(data);

	LibraryThingConnector.debug('seeMoreAwards');
	var params = {};
	params['workcode'] = LibraryThingConnector.workcode;
	params['ck_id'] = ck_id;
	params['type'] = 'award';

	var _lightbox_params = {
		title : LibraryThingConnector.translationstringsA.title_awards
	};
	var url = LibraryThingConnector.BASE_URL + 'syndeticsunbound_lightbox.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.debug('final seeMoreAwards url: ' + url);
	LibraryThingConnector.openLightbox(url, _lightbox_params);
};

/* ################################################## */

LibraryThingConnector.seeAuthorAuthorRec = function(workid,authorid, relative_request) {
	LibraryThingConnector.debug('seeAuthorAuthorRec');
	var data = {
		type: 'lightbox_opened',
		'similar.authorauthorrec.lightbox':1,
	};
	relative_request = relative_request || false;
	LibraryThingConnector.recordStats(data);
	var params = {
		workcode: 	workid,
		version: 	LibraryThingConnector.version,
		authorid: 	authorid,
		type: 		'authorauthorrec'
		};

	params['su_a_id'] = LibraryThingConnector.a_id;
	var _lightbox_params = {
		xtitle : LibraryThingConnector.translationstringsA.title_awards,
		title : 'About the Author'
		};
	if (relative_request) {
		params['breadcrumb_back_url'] = relative_request;
	}
	params['su_catalog_url'] = encodeURIComponent(window.location.href);
	var url = LibraryThingConnector.BASE_URL + 'syndeticsunbound_lightbox.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.debug('final seeMoreAwards url: ' + url);
	if (relative_request) {
		LibraryThingConnector.goToURL(url);
		// TODO: change the lightbox title since we'd be calling this from within the lightbox
	}
	else {
		LibraryThingConnector.openLightbox(url, _lightbox_params);
	}
};

LibraryThingConnector.lb_librarianpower_list = function(workid,listid,lslw_id)
	{
	if( LibraryThingConnector.context == 'lightbox')
		{
		LibraryThingConnector.info('lp lightbox from within lightbox - posting to top')
		window.top.parent.postMessage({"type":"lp_lightbox_open","workid":workid,"listid":listid,"lslw_id":lslw_id}, "*");
		return;
		}
	LibraryThingConnector.debug('lb_librarianpower_list');
	LibraryThingConnector.recordLightboxOpenedStat('lists');
	if( lslw_id )
		{
		LibraryThingConnector.info('recording ldw lb opened stat');
		LibraryThingConnector.recordLightboxOpenedStat('bdw_listwidget');
		}
	var params = {
		workcode: 	workid,
		listid	: 	listid,
		type	: 	'librarianpower_list',
		page	: 	'list'
		};

	var _lightbox_params = {
		xtitle : LibraryThingConnector.translationstringsA.title_awards,
		title : 'Librarian Recommends'
		}
	LibraryThingConnector.info('loading Lists at ' + LibraryThingConnector.LIBRARIAN_POWER_DOMAIN);
	var url = LibraryThingConnector.LIBRARIAN_POWER_DOMAIN + 'libpow_controller.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.openLightbox(url, _lightbox_params);
	};

LibraryThingConnector.lb_librarianpower_addtolist = function()
	{
	LibraryThingConnector.debug('lb_librarianpower_list');
	var params = {
		type: 					'librarianpower_addtolist',
		'callnumber_resolved':	LibraryThingConnector.callnumber_resolved,
		//page	: 				'list'
		};

	var _lightbox_params = {
		title : 'Lists',
		}
	LibraryThingConnector.info('loading Lists at ' + LibraryThingConnector.LIBRARIAN_POWER_DOMAIN);
	var url = LibraryThingConnector.LIBRARIAN_POWER_DOMAIN + 'lp/'+LibraryThingConnector.a_id+'.'+LibraryThingConnector.i_id+'/catalogaddtolist?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	//alert(url);
	LibraryThingConnector.openLightbox(url, _lightbox_params);
	};

	LibraryThingConnector.seeMoreSimilar = function() {
		LibraryThingConnector.debug('seeMoreSimilar');
		var params = {};
		params['workcode'] = LibraryThingConnector.workcode;
		params['type'] = 'similar';
		LibraryThingConnector.globals.enrichment_opened = 'similar';

		var _lightbox_params = {
			title : LibraryThingConnector.translationstringsA.title_similar
		}
		var url = LibraryThingConnector.BASE_URL + 'syndeticsunbound_lightbox.php?';
		url += LibraryThingConnector.utils.jQuery.param(params);
		LibraryThingConnector.debug('final seeMoreSimilar url: ' + url);
		LibraryThingConnector.openLightbox(url, _lightbox_params);
	};

LibraryThingConnector.lb_librarianpower_seemorelists = function()
{
	var params = LibraryThingConnector.getParams();

	// not sure if we even need this part for this function
	if( LibraryThingConnector.context == 'lightbox')
	{
		LibraryThingConnector.info('lp lightbox from within lightbox - posting to top');
		var args = Object.assign({}, params, {"type":"lp_lightbox_open","page":"item"})
		window.top.parent.postMessage(args, "*");
		return;
	}
	LibraryThingConnector.debug('lb_librarianpower_list item');
	LibraryThingConnector.recordLightboxOpenedStat('lists_item');

	//params['workcode'] = LibraryThingConnector.workcode;
	params['type'] = 'librarianpower_list';
	params['page'] = 'item';

	var _lightbox_params = {
		title : 'Librarian Recommends'
	}

	LibraryThingConnector.info('loading more Lists for item at ' + LibraryThingConnector.LIBRARIAN_POWER_DOMAIN);
	var url = LibraryThingConnector.LIBRARIAN_POWER_DOMAIN + 'libpow_controller.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);

	LibraryThingConnector.openLightbox(url, _lightbox_params);
}

LibraryThingConnector.lb_librarianpower_testpage = function()
	{
	LibraryThingConnector.debug('lb_librarianpower_list');
	var params = {
		type: 					'librarianpower_addtolist',
		'callnumber_resolved':	LibraryThingConnector.callnumber_resolved,
		page	: 				'test_items'
		};

	var _lightbox_params = {
		title : 'Lists',
		}
	LibraryThingConnector.info('loading Lists at ' + LibraryThingConnector.LIBRARIAN_POWER_DOMAIN);
	var url = LibraryThingConnector.LIBRARIAN_POWER_DOMAIN + 'libpow_controller.php?';
	//var url = LibraryThingConnector.BASE_URL + 'action_libpow_catalogaddtolist.php?';

	url += LibraryThingConnector.utils.jQuery.param(params);
	//alert(url);
	LibraryThingConnector.openLightbox(url, _lightbox_params);
	};

LibraryThingConnector.lb_librarianpower_lists = function()
	{
	var url = '/librarianpower_lists.php';

	var params = {
		type: 		'librarianpower_lists'
		};
	var params = {
		type: 		'librarianpower_user',
		id:			1
		};
	var _lightbox_params = {
		title : 'Lists'
		}

	LibraryThingConnector.info('loading Lists at ' + LibraryThingConnector.LIBRARIAN_POWER_DOMAIN);
	var url = LibraryThingConnector.LIBRARIAN_POWER_DOMAIN + 'syndeticsunbound_lightbox.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.openLightbox(url, _lightbox_params);
	};


/* ################################################## */

LibraryThingConnector.seeMoreAwards_textonly = function() {

	var theLink = LibraryThingConnector.utils.jQuery('a.unbound_seeMoreAwards_textonly');
	if( LibraryThingConnector.utils.jQuery('.unbound_books_textonly').hasClass('unbound_seemore_overflow_show') )
		{
		LibraryThingConnector.utils.jQuery('.unbound_books_textonly').removeClass('unbound_seemore_overflow_show');
		theLink.html( theLink.data('texton') )
		}
	else
		{
		LibraryThingConnector.utils.jQuery('.unbound_books_textonly').addClass('unbound_seemore_overflow_show');
		theLink.html( theLink.data('textoff') )
		}

	return false;
	};

LibraryThingConnector.seeMoreAwards = function() {
	LibraryThingConnector.debug('seeMoreAwards');
	var params = {};
	params['workcode'] = LibraryThingConnector.workcode;
	params['type'] = 'awards';

	var _lightbox_params = {
		title : LibraryThingConnector.translationstringsA.title_awards
	}
	var url = LibraryThingConnector.BASE_URL + 'syndeticsunbound_lightbox.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.debug('final seeMoreAwards url: ' + url);
	LibraryThingConnector.openLightbox(url, _lightbox_params);
};

LibraryThingConnector.seeMoreLTSeries = function() {
	alert('not made');
	return false;
	}

LibraryThingConnector.goToURL = function(url, target) {
	if (target === '_top') {
		window.top.location = url;
	}
	else if (target === '_parent') {
		parent.location = url;
	}
	else if (target != null) {
		window.open(url, target);
	}
	else {
		window.location.href = url;
	}
};

// relative_request = true if you are calling this from within the ligthbox already.
LibraryThingConnector.seeLTSeries = function(ck_id, relative_request) {
	var data = {
		type:'ltseries_series_clicked'
	};
	relative_request = relative_request || false;
	LibraryThingConnector.recordStats(data);

	LibraryThingConnector.debug('seeMoreLTSeries');
	var params = {};
	params['workcode'] = LibraryThingConnector.workcode;
	params['ck_id'] = ck_id;
	params['version'] = LibraryThingConnector.version;
	params['type'] = 'ltseriesone';
	params['su_a_id'] = LibraryThingConnector.a_id;
	params['itemdetailsA_lang'] = LibraryThingConnector.itemdetailsA_lang;
	params['itemdetailsA_media'] = LibraryThingConnector.itemdetailsA_media;
	if (relative_request) {
		params['breadcrumb_back_url'] = relative_request;
	}

	var _lightbox_params = {
		title : LibraryThingConnector.translationstringsA.title_ltseries
	};
	var url = LibraryThingConnector.BASE_URL + 'syndeticsunbound_lightbox.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.debug('final seeMoreLTSeries url: ' + url);
	// relative
	// "https://athena.librarything.com/syndeticsunbound/syndeticsunbound_lightbox.php?workcode=0&ck_id=379351&type=ltseriesone&itemdetailsA_lang=&itemdetailsA_media="
	// openlightbox
	// "https://athena.librarything.com/syndeticsunbound/syndeticsunbound_lightbox.php?workcode=2742161&ck_id=1102663&type=ltseriesone&itemdetailsA_lang=eng&itemdetailsA_media=1.1.2"
	//LibraryThing.lightbox.off();
	if (relative_request) {
		LibraryThingConnector.goToURL(url);
		// TODO: change the lightbox title since we'd be calling this from within the lightbox
	}
	else {
		LibraryThingConnector.openLightbox(url, _lightbox_params);
	}
	location.replace
};


	// relative_request = true if you are calling this from within the ligthbox already.
LibraryThingConnector.seeLTnewSeries = function(sg_id, relative_request,enrichment_type) {
	relative_request = relative_request || false;
	enrichment_type = enrichment_type || false;
	var data = {
		type: 'lightbox_opened'
	};
	if ( enrichment_type )
		{
		data[enrichment_type] = 1;
		}
	LibraryThingConnector.recordStats(data);

	LibraryThingConnector.debug('seeMoreLTSeries');
	var params = {};
	params['workcode'] = LibraryThingConnector.workcode;
	params['sg_id'] = sg_id;
	params['version'] = LibraryThingConnector.version;
	params['type'] = 'ltnewseriesone';
	params['su_a_id'] = LibraryThingConnector.a_id;
	params['su_catalog_url'] = LibraryThingConnector.metadata.catalog_url;
	params['itemdetailsA_lang'] = LibraryThingConnector.itemdetailsA_lang;
	params['itemdetailsA_media'] = LibraryThingConnector.itemdetailsA_media;
	if (relative_request) {
		params['breadcrumb_back_url'] = relative_request;
	}

	var _lightbox_params = {
		title : LibraryThingConnector.translationstringsA.title_ltseries
	};
	var url = LibraryThingConnector.BASE_URL + 'syndeticsunbound_lightbox.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.debug('final seeMoreLTSeries url: ' + url);
	// relative
	// "https://athena.librarything.com/syndeticsunbound/syndeticsunbound_lightbox.php?workcode=0&ck_id=379351&type=ltseriesone&itemdetailsA_lang=&itemdetailsA_media="
	// openlightbox
	// "https://athena.librarything.com/syndeticsunbound/syndeticsunbound_lightbox.php?workcode=2742161&ck_id=1102663&type=ltseriesone&itemdetailsA_lang=eng&itemdetailsA_media=1.1.2"
	//LibraryThing.lightbox.off();
	if (relative_request) {
		LibraryThingConnector.goToURL(url);
		// TODO: change the lightbox title since we'd be calling this from within the lightbox
	}
	else {
		LibraryThingConnector.openLightbox(url, _lightbox_params);
	}
	location.replace
};


LibraryThingConnector.seeMoreReviews = function() {
	LibraryThingConnector.debug('seeMoreReviews');
	var connnectorParams = LibraryThingConnector.getParams();
	var params = {};
	params['workcode'] = LibraryThingConnector.workcode;
	params['type'] = 'reviews';
	params['product'] = 'unbound';
	params['a_id'] = LibraryThingConnector.a_id;
	params['enrichment_type'] = 'reviews';
	params['lstoken'] = LibraryThingConnector.lsa_id;
	if (LibraryThingConnector.a_id == 359 && LibraryThingConnector.metadata.scope[0] == 'nelson')
		{
		LibraryThingConnector.info('using Nelson 350 for reviews lsa_id');
		params['lstoken'] = 350;
		}
	params['author'] = connnectorParams['author'];
	params['title'] = connnectorParams['title'];
	params['client'] = LibraryThingConnector.config.accountAA.syndetics_client;
	if( LibraryThingConnector.metadata['accession'] && LibraryThingConnector.utils.jQuery.isArray(LibraryThingConnector.metadata['accession'])) {
		params['accession'] = LibraryThingConnector.metadata['accession'][0];
	}
	else if ( LibraryThingConnector.metadata['accession'])
		{
		params['accession'] = LibraryThingConnector.metadata['accession'];
		}



	if(typeof LibraryThingConnector.metadata.first_isbn !== 'undefined') {
		params['winning_isbn'] = LibraryThingConnector.metadata.first_isbn;
	}

	if(typeof LibraryThingConnector.isbns !== 'undefined') {
		params['isbn'] = LibraryThingConnector.isbns.join();
	}


	var _lightbox_params = {
		title : LibraryThingConnector.translationstringsA.title_patronreviews
	}

	var url = LibraryThingConnector.LTFL_BASE_URL + 'reviews.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.debug('final seeMoreReviews url: ' + url);
	LibraryThingConnector.openLightbox(url, _lightbox_params);
};

LibraryThingConnector.seeMoreSimilar = function() {
	LibraryThingConnector.debug('seeMoreSimilar');
	var params = {};
	params['workcode'] = LibraryThingConnector.workcode;
	params['type'] = 'similar';
	LibraryThingConnector.globals.enrichment_opened = 'similar';

	var _lightbox_params = {
		title : LibraryThingConnector.translationstringsA.title_similar
	}
	var url = LibraryThingConnector.BASE_URL + 'syndeticsunbound_lightbox.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.debug('final seeMoreSimilar url: ' + url);
	LibraryThingConnector.openLightbox(url, _lightbox_params);
};

LibraryThingConnector.openSyndeticsLightbox = function(title,params, args) {
	//var url = LibraryThingConnector.SYNDETICS_DOMAIN + '/unbound_lightbox.php?su_catalog_language_code='+params['su_catalog_language_code']+'&enhancement='+params['enrichment_type']+'&id='+LibraryThingConnector.client+'&isbn='+params['isbn']+'&su_isbns='+params['su_isbns']+'&su_workcode='+params['workcode']+'&su_enrichment_type='+params['enrichment_type']+'&su_catalog_url'+'&su_a_id='+LibraryThingConnector.a_id+'&active_id=toc&su_catalog_url='+encodeURIComponent(window.location.href);
	var url = LibraryThingConnector.SYNDETICS_DOMAIN + '/unbound_lightbox.php?su_catalog_language_code='+params['su_catalog_language_code']+'&enhancement='+params['enrichment_type']+'&id='+LibraryThingConnector.client+'&isbn='+params['isbn']+'&su_isbns='+params['su_isbns']+'&itemdetailsA_lang='+LibraryThingConnector.itemdetailsA_lang+'&itemdetailsA_media='+LibraryThingConnector.itemdetailsA_media+'&su_workcode='+params['workcode']+'&su_enrichment_type='+params['enrichment_type']+'&su_catalog_url'+'&su_a_id='+LibraryThingConnector.a_id+'&active_id=toc&su_catalog_url='+encodeURIComponent(window.location.href)+'&su_i_id='+LibraryThingConnector.i_id+'&su_upcs='+encodeURIComponent(params['su_upc'])+'&su_issns='+encodeURIComponent(params['su_issn']);
	if ( typeof args != 'undefined')
		{
		LibraryThingConnector.info('including args ' + args);
		url += args;
		}
	// var url = LibraryThingConnector.SYNDETICS_DOMAIN + '/unbound_lightbox.php?';
	// url += LibraryThingConnector.utils.jQuery.param(params);

	LibraryThingConnector.debug('final syndetics lightbox url: ' + url);
	LibraryThingConnector.openSearchResultLightbox(title,url);
};

LibraryThingConnector.attachLightboxFocusHandler = function() {
	LibraryThingConnector.info('attachLightboxFocusHandler);')
	LibraryThingConnector.utils.jQuery(document).bind('focusin', function (ev) {

		if (LibraryThingConnector.utils.jQuery(ev.target).parents('#LT_LB').length === 0 )
			{
			LibraryThingConnector.info('preventing focus move out of lightbox');
			/* TODO: ch - this is causing errors because it is an infinite loop of focus events. */
			//LibraryThingConnector.utils.jQuery('#LT_LB_title').focus();

			return false;
			}
	});
};

LibraryThingConnector.detachLightboxFocusHandler = function() {
	LibraryThingConnector.info('detachLightboxFocusHandler');
	LibraryThingConnector.utils.jQuery(document).unbind('focusin');
};

LibraryThingConnector.lightboxCallbackReady = function () {
	LibraryThingConnector.info('lightbox callbackReady');

	// maintain focus within lightbox modal
	LibraryThingConnector.attachLightboxFocusHandler();

	var LT_LB = LibraryThingConnector.utils.jQuery('#LT_LB').get(0);
	LibraryThingConnector.utils.jQuery(LT_LB).focus();


	setTimeout(function () {
		// ENTER on lightbox close
		var LT_LB_close = LibraryThingConnector.utils.jQuery('#LT_LB_close').get(0);
		LibraryThingConnector.utils.jQuery('#LT_LB_close').click(function(ev) {
			LibraryThingConnector.detachLightboxFocusHandler();
		});
		LibraryThingConnector.utils.jQuery(document).keypress(function (ev) {
			var keycode = ev.keyCode || ev.which;
			if (ev.target == LT_LB_close && keycode == '13')
				{
				LibraryThingConnector.info('ENTER on lightbox close');
				LibraryThing.lightbox.off();
				LibraryThingConnector.detachLightboxFocusHandler();
				// return focus to opening button
				var last_enrichment_opened = LibraryThingConnector.globals.enrichment_opened;
				LibraryThingConnector.info('returning focus to last enrichment btn opened:'+last_enrichment_opened);
				var content_selector = 'unbound_'+last_enrichment_opened;
				LibraryThingConnector.utils.jQuery('.'+content_selector).find('.unbound_seemore_link,.unbound_lightbox').focus();
				}
		});
	}, 2000);
};
/**
 * wraps lt_lightbox code
 * @param url
 * @param params
 */
LibraryThingConnector.openLightbox = function (url, params, rawUrlB)
	{
		if( !params )
		{
			params = {
				width: 300,
				height: 300
			};
		}
	if ( typeof rawUrlB == 'undefined' )
		{
		rawUrlB = false;
		}
	LibraryThingConnector.debug('rawUrlB: ' + rawUrlB);

		// override these for sure.
		params.fullscreen = true;
		params.method = 'iframe';
		params.modal = false;
		params.callbackReady = LibraryThingConnector.lightboxCallbackReady();
		//params.title = params.title | 'Syndetics Unbound';

	// if you don't supply the params object then it uses a default width and
	// then resizes vertically to fit the content.

	// pass through metadata so Connector within lightbox has access
	var urlparams = LibraryThingConnector.getParams();
	// cull params we don't need
//	delete urlparams['itemInfo'];
	delete urlparams['container_widths'];
	delete urlparams['container_widthAAS'];
	delete urlparams['divs'];
	urlparams['workcode'] = LibraryThingConnector.workcode;
	urlparams['enrichment_type'] = LibraryThingConnector.globals.enrichment_type;
	urlparams['catalog_url'] = window.location.href;
		var urlparams_temp = {};
		for (var key in urlparams) {
			if (!urlparams.hasOwnProperty(key)) continue;
			var val = urlparams[key];
			if ( key.match(/su_/))
				{
				urlparams_temp[key] = val;
				}
			else
				{
				urlparams_temp['su_'+key] = val;
				}
		}
		urlparams = urlparams_temp;
		/*
	LibraryThingConnector.utils.jQuery.each(urlparams, function(key, value) {
		urlparams['su_'+key] = value;
		delete urlparams[key];
	});
	*/

	LibraryThingConnector.debug('params for lightbox url:');
	LibraryThingConnector.debug(urlparams);
	if( !rawUrlB )
		{
		url += '&' + LibraryThingConnector.utils.jQuery.param(urlparams);
		}
	LibraryThingConnector.debug('openLightbox to url: ' + url);

	//$ = LibraryThingConnector.utils.jQuery;
	if( LibraryThingConnector.backend.name == 'eds' )
		{
		// this runs from within iframe so we don't want window.top
		window.LibraryThing.lightbox.open(url, params);
		}
	else
		{
		LibraryThing.lightbox.open(url, params);
		}

	LibraryThingConnector.utils.jQuery('#LT_LB_title').focus();
	};

LibraryThingConnector.megaDivHTML = '';
LibraryThingConnector.footerHTML = '';
LibraryThingConnector.hoverDivHTML = '';
LibraryThingConnector.megadiv_id = '';
LibraryThingConnector.megaDivInsertedB = false;
LibraryThingConnector.metadataExtractedB = false;
LibraryThingConnector.LTFLWidgetsLoadedB = false;
LibraryThingConnector.loadingLTFLWidgetsB = false;
LibraryThingConnector.loadingSyndeticsWidgetsB = false;
LibraryThingConnector.retrySyndeticsB = false;
LibraryThingConnector.syndeticsNoDataCalledB  = false;
LibraryThingConnector.contentReadyB = false;
LibraryThingConnector.eventListenersAddedB = false;
LibraryThingConnector.linkContext = {};
LibraryThingConnector.contentChangedHandlerAddedB = false;
LibraryThingConnector.SyndeticsWidgetsLoadedB = false;
LibraryThingConnector.shouldLoadSyndeticsWidgets = true;
LibraryThingConnector.hoverData = {};
LibraryThingConnector.i_id = null;
LibraryThingConnector.workcode = 0;
LibraryThingConnector.pageStatsRecordedB = false;
LibraryThingConnector.statsRecordLTB = false;
LibraryThingConnector.statsRecordLPQ = false;
LibraryThingConnector.searchStatsRecordedB = false;
LibraryThingConnector.searchStatsRecordLTB = false;
LibraryThingConnector.searchStatsRecordLPQ = false;
LibraryThingConnector.contentReady_Intervalh  = null;
LibraryThingConnector.BDW_loadedB = false;
LibraryThingConnector.contentReady_tries  = 0;
LibraryThingConnector.contentReady_max_tries  = 50;
LibraryThingConnector.unboundContentAddedCalledB = false;
LibraryThingConnector.containingDivId = null;
LibraryThingConnector.containingEl = null;
LibraryThingConnector.init_abortedB  = false;
LibraryThingConnector.hoverAddedB  = false;
LibraryThingConnector.contentReadyInterval = 500; // ms to retry extracting metadata and inserting mega div if content not ready
LibraryThingConnector.stats = {

}; // houses enrichment/load/lightbox statistics
LibraryThingConnector.errors = []; // errors
LibraryThingConnector.globals = {

}; // container for globals

LibraryThingConnector.isMegaDivInserted = function ()
	{
	return LibraryThingConnector.megaDivInsertedB;
	};

LibraryThingConnector.isMetadataExtracted = function ()
	{
	return LibraryThingConnector.metadataExtractedB;
	};

LibraryThingConnector.areLTFLWidgetsLoaded = function()
	{
	return LibraryThingConnector.LTFLWidgetsLoadedB;
	};

LibraryThingConnector.areSyndeticsWidgetsLoaded = function()
	{
	return LibraryThingConnector.SyndeticsWidgetsLoadedB;
	};

LibraryThingConnector.insertMegaDiv = function (html)
	{
	LibraryThingConnector.info('inserting megadiv with html');
	LibraryThingConnector.info(html);

	// check for existing syndeticsunbound megadiv
	var syndetics_unbound_div = LibraryThingConnector.utils.jQuery('#syndetics_unbound');
	var insertNodeDetail = null;
	if ( syndetics_unbound_div.length )
		{
		LibraryThingConnector.info('existing su megadiv found');
		insertNodeDetail = LibraryThingConnector.utils.jQuery(syndetics_unbound_div).get(0);
		}
	else if(typeof LibraryThingConnector.metadata !== 'undefined' && LibraryThingConnector.metadata && typeof LibraryThingConnector.metadata.unbound_insertNode !== 'undefined' &&
		LibraryThingConnector.utils.jQuery(LibraryThingConnector.metadata.unbound_insertNode).length > 0	)
		{
		// a straight jquery selector rather than an #id
		insertNodeDetail = LibraryThingConnector.utils.jQuery(LibraryThingConnector.metadata.unbound_insertNode).get(0);
		}
	else if(typeof LibraryThingConnector.metadata !== 'undefined' && LibraryThingConnector.metadata && typeof LibraryThingConnector.metadata.unbound_insertNode !== 'undefined' &&
		LibraryThingConnector.utils.jQuery("#" + LibraryThingConnector.metadata.unbound_insertNode).length > 0	)
		{
		insertNodeDetail = LibraryThingConnector.utils.jQuery("#" + LibraryThingConnector.metadata.unbound_insertNode).get(0);
		}
	else
		{
		LibraryThingConnector.info('su megadiv from getinsertNodeFull');
		insertNodeDetail = LibraryThingConnector.getInsertNodeFull();
		}
	if (insertNodeDetail)
		{
		LibraryThingConnector.info('inserting mega div into element');
		LibraryThingConnector.info(insertNodeDetail);
		LibraryThingConnector.utils.jQuery(insertNodeDetail).append(html);

		// set flag to say inserted
		LibraryThingConnector.megaDivInsertedB = true;

		LibraryThingConnector.addHoverToBody();

		// Custom Event to say that MegaDiv is ready
		LibraryThingConnector.dispatchEvent('megaDivReadyEvent');
		}
	else
		{
		// still add hover for split divs
		LibraryThingConnector.addHoverToBody();
		LibraryThingConnector.info('no div found for insertNodeDetail');
		}
	LibraryThingConnector.dispatchEvent('LibraryThingConnectorInitedEvent');
	};

/**
 * handle custom events dispatching for IE and non-IE
 * @param eventName
 * @param data
 */
LibraryThingConnector.dispatchEvent = function (eventName, data)
	{
	LibraryThingConnector.utils.jQuery(document).trigger(eventName,data);
	};

LibraryThingConnector.addIdentifiers = function(element_class, identifier_type, identifiers)
	{
	LibraryThingConnector.info('addIdentifiers for identifier_type: '+identifier_type+' for element_class: ' + element_class);
	LibraryThingConnector.debug(identifiers);
	LibraryThingConnector.debug(identifier_type);
	if( identifier_type == 'isbn')
		{
		LibraryThingConnector.isbn_identifiers[element_class] = identifiers;
		}
	if( identifier_type == 'upc')
		 {
		 LibraryThingConnector.upc_identifiers[element_class] = identifiers;
		 }
	if( identifier_type == 'issn')
		 {
		 LibraryThingConnector.issn_identifiers[element_class] = identifiers;
		 }
	};

LibraryThingConnector.getIdentifiers = function (identifier_type)
	{
	LibraryThingConnector.info('getIdentifiers type:'+identifier_type);
	var all_identifiers = [];
	if( identifier_type == 'isbn')
		{
		LibraryThingConnector.utils.jQuery.each(LibraryThingConnector.isbn_identifiers, function (element_class, identifiers)
		{
			LibraryThingConnector.utils.jQuery.each(identifiers, function (i, identifier)
				 {
				 if( identifier != '')
					 {
					 LibraryThingConnector.debug('found identifier: '+identifier + ' for identifier_type:'+identifier_type);
					 all_identifiers.push(identifier);
					 }
				 });
		});
		}
	else if(identifier_type == 'upc')
		{
		LibraryThingConnector.utils.jQuery.each(LibraryThingConnector.upc_identifiers, function (element_class, identifiers)
		{
			LibraryThingConnector.utils.jQuery.each(identifiers, function (i, identifier)
			{
				LibraryThingConnector.debug('found identifier: '+identifier + ' for identifier_type:'+identifier_type);
				all_identifiers.push(identifier);
			});
		});
		}
	else if(identifier_type == 'issn')
		{
		LibraryThingConnector.utils.jQuery.each(LibraryThingConnector.issn_identifiers, function (element_class, identifiers)
		{
			LibraryThingConnector.utils.jQuery.each(identifiers, function (i, identifier)
			{
				LibraryThingConnector.debug('found identifier: '+identifier + ' for identifier_type:'+identifier_type);
				all_identifiers.push(identifier);
			});
		});
		}

	LibraryThingConnector.info('getIdentifiers: returning '+all_identifiers.length + ' identifiers of type:'+identifier_type);
	return all_identifiers;
	};

LibraryThingConnector.harvestIdentifiers = function (element_selector, element_class)
{
	// harvest idenifiers
	LibraryThingConnector.info('finding identifiers for element_selector: ' + element_selector);
	var isbn_identifiers = [];
	var upc_identifiers = [];
	var issn_identifiers = [];
	LibraryThingConnector.utils.jQuery(element_selector).find('[data-id]').each(function(i,n) {
		var id = LibraryThingConnector.utils.jQuery(n).data('id');
		if( id )
			{
			var identifier = LibraryThingConnector.extractIdentifierFromIdString(id);
			var identifier_type = LibraryThingConnector.extractIdentifierTypeFromIdString(id);
			LibraryThingConnector.debug('identifier: ' + identifier  + ' identifier_type:'+identifier_type);

			if( identifier_type == 'isbn')
				 {
				 isbn_identifiers.push(identifier);
				 }
			else if( identifier_type == 'upc')
				 {
				 upc_identifiers.push(identifier);
				 }
			if( identifier_type == 'issn')
				 {
				 issn_identifiers.push(identifier);
				 }
			}
	});

	// Add the identifiers
	LibraryThingConnector.addIdentifiers(element_class, 'isbn', isbn_identifiers);
	LibraryThingConnector.addIdentifiers(element_class, 'upc', upc_identifiers);
	LibraryThingConnector.addIdentifiers(element_class, 'issn', issn_identifiers);
};

LibraryThingConnector.utils.base64decode = function(element_content)
	{
		// from: https://scotch.io/tutorials/how-to-encode-and-decode-strings-with-base64-in-javascript
		var Base64 = {
			_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e)
			{
				var t = "";
				var n, r, i, s, o, u, a;
				var f = 0;
				e = Base64._utf8_encode(e);
				while (f < e.length)
					{
					n = e.charCodeAt(f++);
					r = e.charCodeAt(f++);
					i = e.charCodeAt(f++);
					s = n >> 2;
					o = (n & 3) << 4 | r >> 4;
					u = (r & 15) << 2 | i >> 6;
					a = i & 63;
					if (isNaN(r))
						{
						u = a = 64
						}
					else if (isNaN(i))
						{
						a = 64
						}
					t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
					}
				return t
			}, decode: function (e)
			{
				var t = "";
				var n, r, i;
				var s, o, u, a;
				var f = 0;
				e = e.replace(/[^A-Za-z0-9+/=]/g, "");
				while (f < e.length)
					{
					s = this._keyStr.indexOf(e.charAt(f++));
					o = this._keyStr.indexOf(e.charAt(f++));
					u = this._keyStr.indexOf(e.charAt(f++));
					a = this._keyStr.indexOf(e.charAt(f++));
					n = s << 2 | o >> 4;
					r = (o & 15) << 4 | u >> 2;
					i = (u & 3) << 6 | a;
					t = t + String.fromCharCode(n);
					if (u != 64)
						{
						t = t + String.fromCharCode(r)
						}
					if (a != 64)
						{
						t = t + String.fromCharCode(i)
						}
					}
				t = Base64._utf8_decode(t);
				return t
			}, _utf8_encode: function (e)
			{
				e = e.replace(/rn/g, "n");
				var t = "";
				for (var n = 0; n < e.length; n++)
					{
					var r = e.charCodeAt(n);
					if (r < 128)
						{
						t += String.fromCharCode(r)
						}
					else if (r > 127 && r < 2048)
						{
						t += String.fromCharCode(r >> 6 | 192);
						t += String.fromCharCode(r & 63 | 128)
						}
					else
						{
						t += String.fromCharCode(r >> 12 | 224);
						t += String.fromCharCode(r >> 6 & 63 | 128);
						t += String.fromCharCode(r & 63 | 128)
						}
					}
				return t
			}, _utf8_decode: function (e)
			{
				var t = "";
				var n = 0;
				var r = c1 = c2 = 0;
				while (n < e.length)
					{
					r = e.charCodeAt(n);
					if (r < 128)
						{
						t += String.fromCharCode(r);
						n++
						}
					else if (r > 191 && r < 224)
						{
						c2 = e.charCodeAt(n + 1);
						t += String.fromCharCode((r & 31) << 6 | c2 & 63);
						n += 2
						}
					else
						{
						c2 = e.charCodeAt(n + 1);
						c3 = e.charCodeAt(n + 2);
						t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
						n += 3
						}
					}
				return t
			}
		}
		return Base64.decode(element_content);
	};

LibraryThingConnector.useMegadiv = function(element_class)
	{
	var enrichment_type = LibraryThingConnector.extractEnrichmentTypeFromClass(element_class);
	var enrichment_class = 'unbound_'+enrichment_type;
	var enrichment_class_count = LibraryThingConnector.utils.jQuery('.' + enrichment_class).length;
	if( LibraryThingConnector.backend.name == 'enterprise' ) // preserve containingEl scope for enterprise modals
		{
		enrichment_class_count = LibraryThingConnector.utils.jQuery('.' + enrichment_class,LibraryThingConnector.containingEl).length;
		}

	var usemegadivB = true;
	if ( typeof LibraryThingConnector.config.settingsA.advancedA.usemegadiv !== 'undefined' && LibraryThingConnector.config.settingsA.advancedA.usemegadiv == 0)
		{
		usemegadivB = false;
		}
	if ( enrichment_class_count > 1)
		{
		usemegadivB = false;
		}
	if( LibraryThingConnector.utils.jQuery('.unbound_ltseries').length == 1 && LibraryThingConnector.utils.jQuery('.unbound_series').length == 1 )
		{
		usemegadivB = false;
		}
	// force megadiv for biblionix/apollo
	if( LibraryThingConnector.backend.name == 'apollo' && enrichment_type != 'summary')
		{
		// except Summary
		usemegadivB = true;
		}

	return usemegadivB;
	};

LibraryThingConnector.getMegaDivEl = function()
{
	var megadiv_el = LibraryThingConnector.utils.jQuery('#'+LibraryThingConnector.megadiv_id).get(0);
	if (megadiv_el )
		{
		return megadiv_el;
		}
return null;
};

LibraryThingConnector.getEnrichmentElement = function(element_class)
	{
	var _unbound_element = null;
	LibraryThingConnector.debug('getEnrichmentElement: ' + element_class);
	var enrichment_type = LibraryThingConnector.extractEnrichmentTypeFromClass(element_class);
	// get the current megadiv which should have original megadiv_id, we need to scope content changes to that in case there are other megadivs showing
	var current_megadiv_el = LibraryThingConnector.getMegaDivEl();
	if( typeof LibraryThingConnector.backend.currentMegaDiv !== 'undefined' )
		{
		current_megadiv_el = LibraryThingConnector.backend.currentMegaDiv();
		}

	// Get the main content div
	// check for split out element of this element_class
	var enrichment_class = 'unbound_'+enrichment_type;
	var enrichment_class_count = LibraryThingConnector.utils.jQuery('.' + enrichment_class, current_megadiv_el).length;

	var usemegadivB = LibraryThingConnector.useMegadiv(element_class);
	if( !usemegadivB)
		{
		// remove existing one, if megadiv is found
		if( current_megadiv_el )
			{
			LibraryThingConnector.utils.jQuery('.' + enrichment_class, current_megadiv_el).remove();
			}
		// hide SU nav
		LibraryThingConnector.info('hiding SU nav for ' + enrichment_class + ' of enrichment_type: ' + enrichment_type);
		LibraryThingConnector.utils.jQuery('.unbound_nav_item_'+enrichment_type,current_megadiv_el).css('display','none');
		// adding content classes so found for hover harvesting
		if( enrichment_class == 'unbound_ltseries')
			{
			enrichment_class = 'unbound_series';
			}
		LibraryThingConnector.utils.jQuery('.'+enrichment_class).addClass('unbound_content').addClass('unbound_splitdiv').addClass(enrichment_class+'_content').addClass('unbound_mega_aid_'+LibraryThingConnector.a_id).addClass(LibraryThingConnector.backend.name);
		LibraryThingConnector.utils.jQuery('.'+enrichment_class).attr('breakpoints', '420 480 560 693 700 768 960 1200');

		_unbound_element = LibraryThingConnector.utils.jQuery('.'+enrichment_class);
		if( LibraryThingConnector.backend.name == 'apollo')
			{
			_unbound_element = LibraryThingConnector.utils.jQuery('.' + enrichment_class,LibraryThingConnector.containingEl);
			}

		// check for _header elements  like .unbound_similar_header
		var header_class = enrichment_class + '_header';
		if( LibraryThingConnector.utils.jQuery('.'+header_class).length && !LibraryThingConnector.utils.jQuery('h3.'+header_class).length)
			{
			LibraryThingConnector.info('found header class:'+header_class+', adding header h3');
			LibraryThingConnector.utils.jQuery('.'+header_class).append('<h3 class="unbound_header '+header_class+'"></h3>');

			}
		}
	else
		{
		_unbound_element = LibraryThingConnector.utils.jQuery('.'+element_class, current_megadiv_el).not('.unbound_loaded');
		}

	return {
		'_unbound_element':_unbound_element,
		'usemegadivB':usemegadivB
	};
	};

LibraryThingConnector.updateEnrichmentsShown = function(element_class,_unbound_element)
{
	var enrichment_type = LibraryThingConnector.extractEnrichmentTypeFromClass(element_class);
	LibraryThingConnector.stats.page_loaded = 1;
	if (typeof LibraryThingConnector.stats.enrichments_count == 'undefined')
		{
		LibraryThingConnector.stats.enrichments_count = 0;
		}
	if (!element_class.match(/nav_item|header/)) // only for content elements
		{
		if (typeof LibraryThingConnector.stats.enrichments_shown == 'undefined')
			{
			LibraryThingConnector.stats.enrichments_shown = [];
			}
		LibraryThingConnector.stats.enrichments_shown.push(enrichment_type);
		LibraryThingConnector.stats.enrichments_count += 1;
		var count = _unbound_element.find('.unbound_cover').length; // counting covers;
		if (enrichment_type == 'patronreviews')
			{
			count = _unbound_element.find('.unbound_review').length; // counting reviews
			}
		/*
		This is basically not doing anything. Not everything has covers, and it only counts two reviews
		for the patron reviews, max. If we want the data, we should collect it on the PHP side.
		(The review count is, however, used to determined whether to show the reviews box for libraries
		that want it. So keep that.)
		*/
		LibraryThingConnector.stats[element_class] = {
			'present': true,
			'count': count
		};

		if( enrichment_type == 'lists')
			{
			var count = LibraryThingConnector.utils.jQuery('.unbound_lists').find('.libpow_list_infobox').length;
			var listids = [];
			LibraryThingConnector.utils.jQuery('.unbound_lists').find('.libpow_list_infobox').each(function(i,n){
				 listids.push(LibraryThingConnector.utils.jQuery(n).data('listid'));
			});
			LibraryThingConnector.stats[element_class] = {
				'present': true,
				'count': count,
				'listids':listids,
			};
			}
		}

};

	LibraryThingConnector.addRawContent = function(element_class, element_content)
	{
	var element_megadivAA = LibraryThingConnector.getEnrichmentElement(element_class);
	element_megadivAA['_unbound_element'].html(element_content);
	var _unbound_element = element_megadivAA['_unbound_element'];
	// record stats
	LibraryThingConnector.updateEnrichmentsShown(element_class,_unbound_element);

		return element_megadivAA;
	};

LibraryThingConnector.addContent = function (element_class, element_content)
	{
	LibraryThingConnector.info('addContent: '+element_class);
	var _unbound_element = null;
	var usemegadivB = LibraryThingConnector.useMegadiv(element_class);
	if( typeof element_content !== 'undefined' )
		{
		if( !usemegadivB && element_class === 'unbound_ltseries_content')
			{
			LibraryThingConnector.info('addContent: using unbound_series for unbound_ltseries in splitdiv');
			element_class = 'unbound_series_content';
			}
		var content_decoded = LibraryThingConnector.utils.base64decode(element_content);

		// set the content
		if (content_decoded)
			{
			var element_megadivAA = LibraryThingConnector.addRawContent(element_class, content_decoded);
			_unbound_element = element_megadivAA['_unbound_element'];
			usemegadivB = element_megadivAA['usemegadivB'];
			}
		}
	LibraryThingConnector.debug('adding content for class: ' + element_class);

	var enrichment_type = LibraryThingConnector.extractEnrichmentTypeFromClass(element_class);
	var endTime = new Date().getTime();
	if( !_unbound_element)
		{
		var element_megadivAA = LibraryThingConnector.getEnrichmentElement(element_class);
		_unbound_element = element_megadivAA['_unbound_element'];
		usemegadivB = LibraryThingConnector.useMegadiv(element_class);
		}
	// LibraryThingConnector.timing.content.push({enrichment_type:enrichment_type, end:endTime});

	// show the element header?
		var current_megadiv_el = LibraryThingConnector.getMegaDivEl();
		if ( usemegadivB )
		{
		// show the Unbound Contents header
		var nav_selector = '.unbound_nav_item.unbound_nav_item_' + enrichment_type;
		var nav_selector_el = LibraryThingConnector.utils.jQuery(nav_selector);
		LibraryThingConnector.info('showing nav for selector: ' + nav_selector);
		if( LibraryThingConnector.backend.name === 'leganto' ) {
			LibraryThingConnector.info('Using leganto scroll fix');
			nav_selector_el.on('click', function() {
				LibraryThingConnector.utils.jQuery('.item-view').
				animate({ scrollTop: LibraryThingConnector.utils.jQuery("a[name=unbound_nav_"+enrichment_type+"]").offset().top }, 1000);
			});

		}
		LibraryThingConnector.utils.jQuery(nav_selector,current_megadiv_el).not('.unbound_loaded').fadeIn();

		var unbound_header = _unbound_element.parent('.unbound_element').find('.unbound_header');
		LibraryThingConnector.info('showing header:');
		LibraryThingConnector.info(unbound_header);
		unbound_header.fadeIn();

		// show badge if any html prsent
		var unbound_badge = _unbound_element.find('.unbound_badge');
		if( unbound_badge.html() != '' )
			{
			unbound_badge.show();
			}
		}
	else // show .unbound_header if found
		{
		var enrichment_type = LibraryThingConnector.extractEnrichmentTypeFromClass(element_class);
		var header_class = 'unbound_' + enrichment_type + '_header';
		LibraryThingConnector.info('showing header '+header_class);
		// do not scope to megadiv: also catch split div headers
		LibraryThingConnector.utils.jQuery('h3.unbound_header.'+header_class).css('display','block');
		}

	// Harvest identifiers (for building hovers)
	LibraryThingConnector.harvestIdentifiers('.'+element_class, element_class);

	// add in hovers
	LibraryThingConnector.attachHoverToCovers('.'+element_class);

	// add in expand see more in .unbound_truncate

		if (LibraryThingConnector.backend.name == 'enterprise' && LibraryThingConnector.backend.isUnboundInfrastructureMigration() && LibraryThingConnector.backend.delayExpandsAttaching())
			{
			// needs to happen later, in backend
			}
		else
			{
			LibraryThingConnector.attachExpands('.'+element_class);
			}


	// lightbox opening
	LibraryThingConnector.attachLightboxHandler(_unbound_element);



		if( _unbound_element == 'unbound_author_content')
		{
		LibraryThingConnector.insertAuthorImage();
		}


		/* turn off spotify support by turning off this loop (change true to false below) */
	if (false && element_class == 'unbound_audiovideo_content')
	{
		LibraryThingConnector.audio = new Audio();

		// do spotify lookups to provide previews
		var searchAlbums = function (query, element, trackOrAlbum) {
			trackOrAlbum = trackOrAlbum || 'track';
			query = query.replace(/\[.*\]/i, '');
			query = query.replace(/\(.*\)/i, '');
			query = query.replace(/,.*/i, '');
			query = query.replace(/\'/i, '');


			$.ajax({
				url: 'https://api.spotify.com/v1/search',
				data: {
				  q: query,
				  type: trackOrAlbum,
				  limit: 1
				  },
				success: function (response) {
					LibraryThingConnector.warn(response);
					try {
						if (trackOrAlbum == 'track' && response.tracks.items.length) {
							var track = response.tracks.items[0]; // use first response
							var _url = track.external_urls.spotify;
							var _preview_url = track.preview_url;

							var spotify = LibraryThingConnector.utils.jQuery('<div class="unbound_spotify_preview"></div>');
							if (false && _url.length) {
								spotify.append('<div class="unbound_spotify_preview_node"><a class="spotify" href="' + _url + '">Listen on Spotify</a></div>');
							}
							if (_preview_url.length) {
								spotify.append('<audio class="unbound_spotify_preview_node unbound_audio_preview" controls src="' + _preview_url + '"></audio>');
							}
							element.append(spotify);
						}
						else if (response.albums.items.length) {
							var album = response.albums.items[0]; // use first response
							var _uri = encodeURIComponent(album.uri);
							var player = LibraryThingConnector.utils.jQuery('<iframe src="https://embed.spotify.com/?uri=' + _uri + '&theme=white" width="99%" height="400" frameborder="0" allowtransparency="true"></iframe>');
							element.hide();
							player.insertAfter(element);

						}
					}
					catch(err) {
						LibraryThingConnector.error(err);
					}
				}
			});
		};

		LibraryThingConnector.utils.jQuery('.unbound_track_list').each(function() {
			try {
				var that = LibraryThingConnector.utils.jQuery(this);
				var _artist = LibraryThingConnector.metadata.author || '';
				var _album = LibraryThingConnector.metadata.title || '';
				_album = _album.replace(/:.*/i, '');
				var _searchString = _album;
				if (typeof _artist !== 'undefined' && _artist.trim().length && _artist !== 'undefined') {
					_searchString += '| ' + _artist;
				}
				searchAlbums(_searchString, that, 'album');
			} catch(err) {
				LibraryThingConnector.error(err);
			}
		});
	}

	// Show the content
	_unbound_element.show();
	_unbound_element.parent('.unbound_element').fadeIn();

	// show the mega contents area if there are more than 2 elements on the page now
	if(LibraryThingConnector.backend.name == 'atriuum' || LibraryThingConnector.backend.name == 'apollo')
		{
		var unbound_element_count = LibraryThingConnector.utils.jQuery('.unbound_element').not('.unbound_loaded').length;
		}
	else
		{
		var unbound_element_count = LibraryThingConnector.utils.jQuery('.unbound_element:visible').not('.unbound_loaded').length;
		}
	if ( unbound_element_count > LibraryThingConnector.MIN_UNBOUND_ELMENTS_FOR_NAV)
		{
		if( LibraryThingConnector.backend.name == 'atriuum' )
			{
			LibraryThingConnector.info('not showing SU Contents header for atriuum');
			LibraryThingConnector.utils.jQuery('.unbound_nav').hide();
			LibraryThingConnector.utils.jQuery('.unbound_mega_header').show();
			}
		if (LibraryThingConnector.backend.name == 'enterprise' && LibraryThingConnector.backend.onModalPage() )
			{
			LibraryThingConnector.info('not showing SU Contents header for enterprise, only footer');
			LibraryThingConnector.utils.jQuery('.unbound_mega_footer').show();
			}
		else if( LibraryThingConnector.backend.name == 'polaris' && LibraryThingConnector.backend.isUnboundInfrastructureMigration())
			{
			LibraryThingConnector.info('not showing unbound nav items for polaris infra');
			}
		else
			{
			LibraryThingConnector.debug('minimum number of unbound elements found, showing nav items, header and footer');
			LibraryThingConnector.utils.jQuery('.unbound_nav').show();
			LibraryThingConnector.utils.jQuery('.unbound_mega_header').show();
			LibraryThingConnector.utils.jQuery('.unbound_mega_footer').show();
			}
		if( LibraryThingConnector.backend.name == 'primo' )
			{
			LibraryThingConnector.info('not showing SU Contents header for primo');
			LibraryThingConnector.utils.jQuery('.unbound_mega_header').hide();
			LibraryThingConnector.utils.jQuery('.unbound_mega_footer').show();
			}
		if( LibraryThingConnector.enrichmentsOn().indexOf('lists') > -1 && LibraryThingConnector.enrichmentsShown().length > 0)
			{
			LibraryThingConnector.utils.jQuery('.unbound_mega_footer').show();
			}
		}
	else
		{
		if( LibraryThingConnector.enrichmentsOn().indexOf('lists') > -1 && LibraryThingConnector.enrichmentsShown().length > 0)
			{
			LibraryThingConnector.utils.jQuery('.unbound_mega_footer').show();
			}
		else
			{
			LibraryThingConnector.utils.jQuery('.unbound_nav').hide();
			LibraryThingConnector.utils.jQuery('.unbound_mega_header').hide();
			LibraryThingConnector.utils.jQuery('.unbound_mega_footer').hide();
			}
		}

	// mediatype alert box
	// prefer_ebooks
	if (LibraryThingConnector.add_eresource_message) {
		if (!LibraryThingConnector.utils.jQuery('#unbound_ebook_alert').length) {
			var ebook_alert_content = LibraryThingConnector.eresources_message_text;
			ebook_alert_content = ebook_alert_content.replace(/\(e\)/g, "<img alt=\"eresource icon\" class=\"unbound_mediatype_alert_img inline\" src=\"https://image.librarything.com/pics/cmxz_e@3x.png\">")
			LibraryThingConnector.utils.jQuery('.unbound_nav').after('<div id="unbound_ebook_alert"><img alt="eresource icon" class="unbound_mediatype_alert_img large bullet" src="https://image.librarything.com/pics/cmxz_e@3x.png"><p>' + ebook_alert_content + '</p></div>');
		}
	}
	// fire loaded event
	LibraryThingConnector.dispatchContentLoadedEvent(element_class, element_content);

	// if backend supports UnboundContentAdded method, run it.  For doing things like auto opening accordion or other post-unbound processing
	if( LibraryThingConnector.backend && LibraryThingConnector.backend.unboundContentAdded && !LibraryThingConnector.unboundContentAddedCalledB)
		{
		LibraryThingConnector.info('running backend.unboundContentAdded');
		LibraryThingConnector.backend.unboundContentAdded(LibraryThingConnector.containingDivId);
		LibraryThingConnector.unboundContentAddedCalledB = true;
		}

		LibraryThingConnector.authorblock.updateMoreByButton();


	LibraryThingConnector.debug('current stats');
	LibraryThingConnector.debug(LibraryThingConnector.stats);
	};

LibraryThingConnector.extractIdentifierFromIdString = function(identifierString)
	{
	id_parts = identifierString.split(':');
	return id_parts[1];
	};

LibraryThingConnector.extractIdentifierTypeFromIdString = function(identifierString)
	{
		id_parts = identifierString.split(':');
		return id_parts[0];
	};

LibraryThingConnector.extractEnrichmentTypeForChild = function (el)
	{
	LibraryThingConnector.debug('extractEnrichmentTypeForChild')
	var enrichment_type = LibraryThingConnector.utils.jQuery(el).attr('data-unbound-enrichmenttype');
	if (enrichment_type)
		{
		LibraryThingConnector.info('extractEnrichmentTypeFromChild:enrichmenttype from data attr: ' + enrichment_type);
		return enrichment_type;
		}
		var parent_selector = '.unbound_element';
	var parent_unbound_elements = LibraryThingConnector.utils.jQuery(el).parents(parent_selector);
	var parent_unbound_element =  null;
	if( parent_unbound_elements.length )
		{
		parent_unbound_element = parent_unbound_elements.get(0);
		}
	if( !parent_unbound_element)
		{
		LibraryThingConnector.debug('no parent unbound element found');
		return;
		}
	LibraryThingConnector.debug(parent_unbound_element);
	var enrichment = LibraryThingConnector.extractEnrichmentTypeFromElement(parent_unbound_element);
	if( !enrichment )
		{
		LibraryThingConnector.debug('no enrichment found');
		return;
		}
	return enrichment;
	};

LibraryThingConnector.extractEnrichmentTypeFromElement = function (element)
	{
	LibraryThingConnector.debug('extractEnrichmentTypeFromElement');
	// try data-unbound-enrichmentype first
	var enrichment_type = LibraryThingConnector.utils.jQuery(element).attr('data-unbound-enrichmenttype');
	if( enrichment_type )
		{
		LibraryThingConnector.info('extractEnrichmentTypeFromElement:enrichmenttype from data attr');
		return enrichment_type;
		}

	var classesS = LibraryThingConnector.utils.jQuery(element).attr('class');
	if( classesS )
		{
		var class_parts = classesS.split(' ');
		var element_class = class_parts[1];
		return LibraryThingConnector.extractEnrichmentTypeFromClass(element_class);
		}
	return null;
	};

LibraryThingConnector.extractEnrichmentTypeFromClass = function(element_class)
	{
	class_parts = element_class.split('_');
	return class_parts[1];
	};

LibraryThingConnector.addAutoAddParametersToLink = function (link)
	{
	// get keep parameters and add to link
	if( LibraryThingConnector.config.settingsA.linksA && LibraryThingConnector.config.settingsA.linksA.autoaddurlparameters)
		{
		var autoaddurlparameters = LibraryThingConnector.config.settingsA.linksA.autoaddurlparameters;
		if( autoaddurlparameters)
			{
			var current_url = window.location.href;
			if ( LibraryThingConnector.context == 'lightbox' )
				{
				current_url = LibraryThingConnector.su_catalog_url;
				}
			LibraryThingConnector.debug('current catalog url: ' + current_url);

			var query_hash = LibraryThingConnector.utils.parse_queries(current_url);
			LibraryThingConnector.debug('current query_hash');
			LibraryThingConnector.debug(query_hash);

			LibraryThingConnector.debug('checking keep_parameters to append to link: ' + autoaddurlparameters);
			var autoaddurlparametersA = autoaddurlparameters.split(',');
			LibraryThingConnector.debug(autoaddurlparametersA);
			LibraryThingConnector.utils.jQuery.each(autoaddurlparametersA, function (i,n)
			{
			LibraryThingConnector.debug('checking url for autoadd parameter: ' + n);
			if( query_hash[n])
				{
				LibraryThingConnector.debug('found current url has paremter: ' + n);
				LibraryThingConnector.debug('adding '+n+'='+query_hash[n] +' to linking url');
				var new_queryhash = LibraryThingConnector.utils.parse_queries(link);
				if ( new_queryhash[n])
					{
					LibraryThingConnector.debug('found autoadd parameter in new url, replacing it');
					link = link.replace(n+'='+new_queryhash[n],n+'='+query_hash[n]);
					}
				else
					{
					LibraryThingConnector.debug('did not find autoadd parameter in new url, appending it');
					link += '&'+n+'='+query_hash[n];
					}
				}
			});
			}
		}
	return link;
	};

LibraryThingConnector.openSearchResultLightbox = function(title,url)
	{
	LibraryThingConnector.info('openSearchResult to url: ' + url + ' with title: ' + title);
	var lbparams = {
		width: LibraryThingConnector.SEARCHRESULT_LIGHTBOX_WIDTH,
		height: LibraryThingConnector.SEARCHRESULT_LIGHTBOX_HEIGHT,
		callbackReady : LibraryThingConnector.lightboxCallbackReady(),
	};

	lbparams.method = 'iframe';
	lbparams.modal = false;
	lbparams.title = title;
	LibraryThing.lightbox.open(url, lbparams);
	};

LibraryThingConnector.truncateTitleForSearch = function(title)
	{
	if( !title )
		{
		return title;
		}
	LibraryThingConnector.info('truncateTitleForSearch');
	var title_truncated = title;
	var MAX_LENGTH = 50;
	title_truncated = title_truncated.replace(/[=:].*/,''); // remove rest of title following certain punctuation
	title_truncated = title_truncated.substring(0,MAX_LENGTH);

	return title_truncated;
	};

	LibraryThingConnector.clearDebugPanel = function () {
		var debugPanel = LibraryThingConnector.getDebugPanel();
		if (debugPanel)
			{
			debugPanel.find('#unbound_debug_metadata_table').html('');
			debugPanel.find('#unbound_debug_stats_table').html('');
			debugPanel.find('#unbound_debug_consortia_table').html('');
			debugPanel.find('#unbound_debug_params_table_lt').html('');
			debugPanel.find('#unbound_debug_params_table_pq').html('');
			debugPanel.find('#unbound_debug_run_table').html('');
			}
	};

	LibraryThingConnector.getDebugPanel = function () {
		var debugPanel = LibraryThingConnector.utils.jQuery('#unbound_debugpanel');
		if (!debugPanel)
			{
			return null;
			}
		return debugPanel;
	};

	LibraryThingConnector.logDebugPanelCustomer = function () {
		var debugPanel = LibraryThingConnector.getDebugPanel();
		if (!debugPanel)
			{
			return;
			}
		if (LibraryThingConnector.loggedDebugPanelCustomerB)
			{
			return;
			}
		LibraryThingConnector.loggedDebugPanelCustomerB = true;
		var unbound_debug_customer = debugPanel.find('#unbound_debug_customer');
		unbound_debug_customer.append('<h4 class="unbound_debug_heading">Customer</h4>');
		unbound_debug_customer.append('<table class="unbound_debug_table" id="unbound_debug_customer_table>');
		unbound_debug_customer.append('<tr><td>a_id</td><td>' + LibraryThingConnector.a_id + '</td></tr>');
		unbound_debug_customer.append('<tr><td>i_id</td><td>' + LibraryThingConnector.i_id + '</td></tr>');
		unbound_debug_customer.append('<tr><td>lsa_id</td><td>' + LibraryThingConnector.lsa_id + '</td></tr>');
		unbound_debug_customer.append('<tr><td>client</td><td>' + LibraryThingConnector.client + '</td></tr>');
		unbound_debug_customer.append('<tr><td>systype</td><td>' + LibraryThingConnector.backend.name + '</td></tr>');
		if (typeof LibraryThingConnector.f_id !== 'undefined')
			{
			unbound_debug_customer.append('<tr><td>f_id</td><td>' + LibraryThingConnector.f_id + '</td></tr>');
			}

		unbound_debug_customer.append('</table>');

	};

	LibraryThingConnector.logDebugPanelMetadata = function () {
		var debugPanel = LibraryThingConnector.getDebugPanel();
		if (!debugPanel)
			{
			return;
			}
	if( typeof LibraryThingConnector.debugPanelMetadataLoggedB !== 'undefined' && LibraryThingConnector.debugPanelMetadataLoggedB)
		{
		return;
		}
		LibraryThingConnector.debugPanelMetadataLoggedB = true;
		var metadata_table = LibraryThingConnector.utils.jQuery(debugPanel).find('#unbound_debug_metadata_table');
		metadata_table.append('<tr><td>pagetype</td><td>' + LibraryThingConnector.pagetype + '</td></tr>');
		if (LibraryThingConnector.pagetype == 'full')
			{
			if (LibraryThingConnector.metadata.isbns && LibraryThingConnector.metadata.isbns.length)
				{
				metadata_table.append('<tr><td>isbn</td><td>' + LibraryThingConnector.metadata.isbns.join(',') + '</td></tr>');
				}
			if (LibraryThingConnector.metadata.upcs && LibraryThingConnector.metadata.upc.length)
				{
				metadata_table.append('<tr><td>upc</td><td>' + LibraryThingConnector.metadata.upc.join(',') + '</td></tr>');
				}
			if (LibraryThingConnector.metadata.issns && LibraryThingConnector.metadata.issns.length)
				{
				metadata_table.append('<tr><td>issn</td><td>' + LibraryThingConnector.metadata.issns.join(',') + '</td></tr>');
				}
			if (LibraryThingConnector.metadata.title)
				{
				metadata_table.append('<tr><td>title</td><td>' + LibraryThingConnector.metadata.title + '</td></tr>');
				}
			if (LibraryThingConnector.metadata.author)
				{
				metadata_table.append('<tr><td>author</td><td>' + LibraryThingConnector.metadata.author + '</td></tr>');
				}
			if (LibraryThingConnector.metadata.call_nums)
				{
				metadata_table.append('<tr><td>call numbers</td><td>' + LibraryThingConnector.metadata.call_nums.join(',') + '</td></tr>');
				}
			}
		else
			{
			if (LibraryThingConnector.pageytpe == 'summary')
				{

				}
			}
		debugPanel.append('</table>');

	};

	LibraryThingConnector.logDebugPanel = function () {
		var debugPanel = LibraryThingConnector.getDebugPanel();
		if (!debugPanel)
			{
			return;
			}
		LibraryThingConnector.info('logDebugPanel');
		if( typeof LibraryThingConnector.lt_widget_url !== 'undefined')
			{
			LibraryThingConnector.utils.jQuery.each(LibraryThingConnector.lt_widget_params, function (i, n) {
				LibraryThingConnector.logToDebugPanel('unbound_debug_params_table_lt', i, n);
			});
			LibraryThingConnector.logToDebugPanel('unbound_debug_params_table_lt','<a target="_blank" href="' + LibraryThingConnector.lt_widget_url + '">LT Widgets URL</a>','');
			}
	if( typeof LibraryThingConnector.pq_widget_url !== 'undefined')
		{
		LibraryThingConnector.utils.jQuery.each(LibraryThingConnector.pq_widget_params, function (i, n) {
			LibraryThingConnector.logToDebugPanel('unbound_debug_params_table_pq', i, n);
		});
		LibraryThingConnector.logToDebugPanel('unbound_debug_params_table_pq', '<a target="_blank" href="' + LibraryThingConnector.pq_widget_url + '">PQ Widgets URL</a>', '');
		}
		if (typeof LibraryThingConnector.stats.enrichments_shown !== 'undefined')
			{
			LibraryThingConnector.utils.jQuery.each(LibraryThingConnector.stats.enrichments_shown, function (i, n) {
				LibraryThingConnector.logToDebugPanel('unbound_debug_run_table', i, n);
			});

			}
		LibraryThingConnector.logToDebugPanel('unbound_debug_run_table', 'Enrichments Count', LibraryThingConnector.stats.enrichments_count);

		debugPanel.append('<h4 class="unbound_debug_heading">Analytics</h4>');
		debugPanel.append('<table class="unbound_debug_table" id="unbound_debug_stats_table"></table>');

		// adjust for new content
		debugPanel.find('td').css('padding', '3px');
	};

	LibraryThingConnector.logToDebugPanel = function (table_id, firstcol, secondcol) {
		var debugPanel = LibraryThingConnector.getDebugPanel();
		if (!debugPanel)
			{
			return;
			}
		debugPanel.find('#' + table_id).append('<tr><td class="first">' + firstcol + '</td><td>' + secondcol + '</td></tr>');
	};

	LibraryThingConnector.debugPanelClose = function () {
		var debugPanel = LibraryThingConnector.getDebugPanel();
		debugPanel.hide();
	};

	LibraryThingConnector.setupDebugPanel = function () {
		LibraryThingConnector.info('loading debugPanel');
		LibraryThingConnector.utils.jQuery('body').append('<div id="unbound_debugpanel"></div>');
		var debugPanel = LibraryThingConnector.utils.jQuery('#unbound_debugpanel');

		debugPanel.append('<div onclick="LibraryThingConnector.debugPanelClose();" id="unbound_debug_close">X</div>');
		debugPanel.append('<h3 id="unbound_debug_title">Unbound Debug ('+LibraryThingConnector.environment+')</h3>');

		if (typeof LibraryThingConnector.environment !== 'undefined' && LibraryThingConnector.environment == 'dev' )
			{
			LibraryThingConnector.utils.jQuery('#unbound_debugpanel').css('background','lightgoldenrodyellow');
			}
		else if (typeof LibraryThingConnector.environment !== 'undefined' && LibraryThingConnector.environment == 'staging' )
			{
			LibraryThingConnector.utils.jQuery('#unbound_debugpanel').css('background','lightpink');
			}
		debugPanel.append('<div id="unbound_debug_customer">');
		debugPanel.append('</div>');
		debugPanel.append('<h4 class="unbound_debug_heading">Environment</h4>');
		debugPanel.append('<table class="unbound_debug_table" id="unbound_debug_environment_table">');
		var unbound_debug_environment_table = LibraryThingConnector.utils.jQuery('#unbound_debug_environment_table');

		unbound_debug_environment_table.append('<tr><td>BASE_URL</td><td>' + LibraryThingConnector.BASE_URL + '</td></tr>');
		unbound_debug_environment_table.append('<tr><td>SYNDETICS_DOMAIN</td><td>' + LibraryThingConnector.SYNDETICS_DOMAIN + '</td></tr>');
		unbound_debug_environment_table.append('<tr><td>LT_DOMAIN</td><td>' + LibraryThingConnector.LT_DOMAIN + '</td></tr>');
		unbound_debug_environment_table.append('<tr><td>LTFL_BASE_URL</td><td>' + LibraryThingConnector.LTFL_BASE_URL + '</td></tr>');
		unbound_debug_environment_table.append('<tr><td>LTFL_BASE_URL_RW</td><td>' + LibraryThingConnector.LTFL_BASE_URL_RW + '</td></tr>');
		unbound_debug_environment_table.append('<tr><td>STATS_URL</td><td>' + LibraryThingConnector.STATS_URL + '</td></tr>');
		unbound_debug_environment_table.append('<tr><td>LIBRARIAN_POWER_DOMAIN</td><td>' + LibraryThingConnector.LIBRARIAN_POWER_DOMAIN + '</td></tr>');
		unbound_debug_environment_table.append('<tr><td>su_session</td><td>' + LibraryThingConnector.su_session + '</td></tr>');

		unbound_debug_environment_table.append('</table');
		debugPanel.append('</div>');
		debugPanel.append('<h4 class="unbound_debug_heading">Metadata</h4>');
		debugPanel.append('<table class="unbound_debug_table" id="unbound_debug_metadata_table">');
		debugPanel.append('<h4 class="unbound_debug_heading">LT Widget</h4>');
		debugPanel.append('<table class="unbound_debug_table" id="unbound_debug_params_table_lt"></table>');
		debugPanel.append('<h4 class="unbound_debug_heading">PQ Widget</h4>');
		debugPanel.append('<table class="unbound_debug_table" id="unbound_debug_params_table_pq"></table>');
		debugPanel.append('<h4 class="unbound_debug_heading">Run</h4>');
		debugPanel.append('<table class="unbound_debug_table" id="unbound_debug_run_table"></table>');
		debugPanel.append('<h4 class="unbound_debug_heading">Consortia</h4>');
		debugPanel.append('<table class="unbound_debug_table" id="unbound_debug_consortia_table"></table>');
	};

LibraryThingConnector.showDemoMode = function()
	{
	LibraryThingConnector.info("showDemoMode");
	LibraryThingConnector.utils.jQuery(LibraryThingConnector.demoModeHTML).appendTo('body');
	};

LibraryThingConnector.linkToCatalog  = function (ev)
	{
	LibraryThingConnector.info('linkToCatalog');
	LibraryThingConnector.debug(ev);
	LibraryThingConnector.debug(ev.target);
	LibraryThingConnector.debug(LibraryThingConnector.utils.jQuery(ev.target).data());
	if( typeof LibraryThingConnector.suDemoModeB != 'undefined' && LibraryThingConnector.suDemoModeB )
		{
		LibraryThingConnector.info('demo mode check avail link');
		return;
		}


	var button_element = ev.target;
	if( !button_element ) // for bdw this can be the button_element
		{
		LibraryThingConnector.debug('no button_element, using ev for bdw');
		button_element = ev;
		}
	var button_data = LibraryThingConnector.utils.jQuery(ev.target).data()
	LibraryThingConnector.debug(button_data);
	var id = LibraryThingConnector.utils.jQuery(ev.target).data('id');
	// handle bdw linkToCatalog calls where the raw element is given as parameter rather than event
	if( !id && LibraryThingConnector.utils.jQuery(ev).data("enrichment_type"))
		{
		LibraryThingConnector.info('linkToCatalog using raw element rather than ev.target');
		id = LibraryThingConnector.utils.jQuery(ev).data('id');
		}

	LibraryThingConnector.debug('linking to item with id: ' + id);
	var raw_identifier = LibraryThingConnector.extractIdentifierFromIdString(id);
	var identifier_type = LibraryThingConnector.extractIdentifierTypeFromIdString(id);
	LibraryThingConnector.debug('raw identifier: ' + raw_identifier);
	LibraryThingConnector.debug('identifier type: ' + identifier_type);
	LibraryThingConnector.linkContext = {
		'raw_identifier': raw_identifier
	};
	if( typeof button_data !== 'undefined' && typeof button_data['bestlink_type'] !== 'undefined' && button_data['bestlink_identifier'] !== 'undefined')
		{
		var bestlink_type = button_data['bestlink_type'];
		var bestlink_identifier = button_data['bestlink_identifier'];

		if( bestlink_type )
			{
			LibraryThingConnector.info('bestlink type: ' + bestlink_type + ' bestlink identifier:'+bestlink_identifier);
			identifier_type = bestlink_type;
			raw_identifier = bestlink_identifier;
			}
		}

	// BDW hover btn clicks for non-Unbound customers needs to short-circuit this logic as stats and linking are done in legacy backend script
	if ( LibraryThingConnector.utils.jQuery(button_element).data('onclick'))
		{
		LibraryThingConnector.info('onclick found on ev, short circuiting normal unbound link logic for legacy bdw');
		LibraryThingConnector.info(LibraryThingConnector.utils.jQuery(button_element).data('onclick'));
		// return false should be removed from these onclicks by backend code, but doing here to be sure.
		// having a return false within an eval throws an illegal return statement js error
		var onclick = LibraryThingConnector.utils.jQuery(button_element).data('onclick');
		var bdw_link_url = LibraryThingConnector.utils.jQuery(button_element).data('url');
		var bdw_id = LibraryThingConnector.utils.jQuery(button_element).data('bdw-id');
		var bdw_extra_info = LibraryThingConnector.utils.jQuery(button_element).data('bdw-extra-info');
		LibraryThingConnector.debug('bdw_id: ' + bdw_id);
		LibraryThingConnector.debug('bdw_url: ' + bdw_link_url);
		LibraryThingConnector.debug('bdw_extra_info: ' + bdw_extra_info);
		LibraryThingConnector.debug('bdw_oncnlick: ' + onclick);
		onclick = onclick.replace('return false;','');
		LibraryThingConnector.debug('final bdw onclick: ' + onclick);
		LibraryThingConnector.info('running LibraryThingConnector.pingStats');
		LibraryThingConnector.info('running pushState to:'+ bdw_link_url);
		window.history.pushState({},bdw_link_url);
		LibraryThingConnector.pingStats(41,raw_identifier,'11',decodeURIComponent(bdw_link_url),bdw_id,bdw_extra_info);
		return;
		}

	LibraryThingConnector.debug(LibraryThingConnector.config);

	var linksA = LibraryThingConnector.config.settingsA.linksA;
	if( typeof linksA === "undefined")
		{
		LibraryThingConnector.debug('no settingsA.linksA set, unable to link');
		if(LibraryThingConnector.a_id == "86")
			{
			LibraryThingConnector.runLink();
			}
		return;
		}
	if( identifier_type == 'isbn')
		{
		LibraryThingConnector.info('isbn link');
		var isbn_link = linksA.isbn;
		if ( typeof LibraryThingConnector.isbnLinkingAA !== 'undefined')
			{
			LibraryThingConnector.info('isbnLinkingAA found, checking for 10-digit ness of ' + id);
			var isbn10 = LibraryThingConnector.isbnLinkingAA[id];
			if ( typeof isbn10 !== 'undefined' )
				{
				LibraryThingConnector.info('found isbn 10 for, using '+isbn10+' to link');
				raw_identifier = isbn10;
				}
			}
		var link = isbn_link.replace(/UNBOUNDREPLACE/g,raw_identifier);
		LibraryThingConnector.linkContext['isbn_link'] = isbn_link;
		}
	else if(identifier_type == 'upc' && typeof linksA.upc !== 'undefined')
		{
		LibraryThingConnector.info('upc link');
		var upc_link = linksA.upc;
		var link = upc_link.replace(/UNBOUNDREPLACE/g,raw_identifier);
		LibraryThingConnector.linkContext['upc_link'] = upc_link;
		}
	else if(identifier_type == 'issn' && typeof linksA.issn !== 'undefined')
		{
		LibraryThingConnector.info('issn link');
		var issn_link = linksA.issn;
		var link = issn_link.replace(/UNBOUNDREPLACE/g,raw_identifier);
		LibraryThingConnector.linkContext['issn_link'] = issn_link;
		}
	else if(identifier_type == 'titleauthor' && typeof linksA.keyword !== 'undefined')
		{
		LibraryThingConnector.info('titleuathor link');
		var kw_link = linksA.keyword;
		var link = kw_link.replace(/UNBOUNDREPLACE/g,raw_identifier);
		LibraryThingConnector.linkContext['kw_link'] = kw_link;
		}

	var enrichment = LibraryThingConnector.utils.jQuery(button_element).data('enrichment_type');
	// check if item is not held
	LibraryThingConnector.debug('button_element');
	LibraryThingConnector.debug(button_element);
	LibraryThingConnector.debug(LibraryThingConnector.utils.jQuery(button_element).data());
	var unbound_cover_unheld = LibraryThingConnector.utils.jQuery(button_element).data('unbound_cover_unheld');
	var requires_kw_linking = false;
	var requires_ti_linking = false;
	var requires_ti_plus_author_linking = false;
	var requiresKWLinkingAA = {
		206 : 1,
		240 : 1,
		324: 1,
		430: 1,
	};
	var requiresTitleLinkingAA = {
		440 : 1,
	};
	var requiresTitlePlusAuthorLinkingAA = {
		106 : 1,
		324: 1,
		430: 1,
		1529: 1,
	};
	// link on title on for shelf for 106
	if ( enrichment != 'shelf' && LibraryThingConnector.a_id == 106 && LibraryThingConnector.i_id == 323)
		{
		requiresKWLinkingAA[106] = 1;
		}
	if( typeof requiresKWLinkingAA[LibraryThingConnector.a_id] !== 'undefined' )
		{
		requires_kw_linking = true;
		}
	if( typeof requiresTitleLinkingAA[LibraryThingConnector.a_id] !== 'undefined' )
		{
		requires_ti_linking = true;
		}
	if (typeof requiresTitlePlusAuthorLinkingAA[LibraryThingConnector.a_id] !== 'undefined')
		{
		requires_ti_plus_author_linking = true;
		}
	if( LibraryThingConnector.backend.name == 'apollo' && unbound_cover_unheld)
		{
		LibraryThingConnector.info('unheld cover for biblionix, not linking');
		return false;
		}
	if( unbound_cover_unheld || !raw_identifier || requires_kw_linking || requires_ti_linking || requires_ti_plus_author_linking)
		{
		LibraryThingConnector.debug('item is not held or no raw_identifier, trying to use kw/ti url instead of isbn');
		LibraryThingConnector.debug(linksA);
		var kw_link = linksA.keyword;
		var ti_link = linksA.title;
		var title = LibraryThingConnector.utils.jQuery(button_element).data('title');
		var author = LibraryThingConnector.utils.jQuery(button_element).data('author');
		// possibly truncate title to allow opac title/kw search to work
		if( LibraryThingConnector.a_id == 455 || LibraryThingConnector.a_id == 1844)
			{
			LibraryThingConnector.debug('not truncating title');
			}
		else
			{
			title = LibraryThingConnector.truncateTitleForSearch(title);
			}
		if ( requires_ti_linking && ti_link && title )
			{
			LibraryThingConnector.info('linking on ti_link');
			link = ti_link.replace(/UNBOUNDREPLACE/g,encodeURIComponent(title));
			LibraryThingConnector.linkContext['ti_link'] = ti_link;
			LibraryThingConnector.linkContext['title'] = title;
			LibraryThingConnector.info('final ti link: ' + link);
			}
		else if( kw_link && title)
			{
			link = kw_link.replace(/UNBOUNDREPLACE/g,encodeURIComponent(title));
			if( typeof requiresTitlePlusAuthorLinkingAA[LibraryThingConnector.a_id] !== 'undefined' && title && author)
				{
				LibraryThingConnector.info('including author in kw link');
				var search_string = encodeURIComponent(title) + ' ' + encodeURIComponent(author);
				link = kw_link.replace(/UNBOUNDREPLACE/g,search_string);
				}
			LibraryThingConnector.linkContext['kw_link'] = kw_link;
			LibraryThingConnector.linkContext['title'] = title;
			LibraryThingConnector.debug('final kw link: ' + link);
			}
		}
	var isCustomUrl = false;
	if (LibraryThingConnector.utils.jQuery(button_element).data('url'))
		{
		// set this so that runLink from backend does not override
		var isCustomUrl = true;
		LibraryThingConnector.info('data-url found, using url for linking: ' + LibraryThingConnector.utils.jQuery(button_element).data('url'));
		link = decodeURIComponent(LibraryThingConnector.utils.jQuery(button_element).data('url'));
		LibraryThingConnector.info('final url: ' . link);
		}

	// add any auto add parameters that need sending from catalog url into each link
	link = LibraryThingConnector.addAutoAddParametersToLink(link);
	LibraryThingConnector.linkContext['link'] = link;


	LibraryThingConnector.info('setting button element href to ' + link);
	LibraryThingConnector.info(button_element);
	LibraryThingConnector.utils.jQuery(button_element).attr('href',link);

	if ( !enrichment)
		{
		LibraryThingConnector.debug('no enrichment found for stat: linking');
		LibraryThingConnector.runLink(link, isCustomUrl);
		return;
		}
	LibraryThingConnector.debug('enrichment type for link: ' + enrichment);
	LibraryThingConnector.linkContext['enrichment_type'] = enrichment;
	LibraryThingConnector.info('link:' + link);

	var stats_data = {
		item_id:raw_identifier,
		type:'clickthrough'
	};
	if ( enrichment == 'bdw' )
		{
		var bdw_id = LibraryThingConnector.utils.jQuery(button_element).data('bdw-id');
		stats_data['bdw_id'] = bdw_id;
		}
	var stats_key = enrichment+'.'+'clickthrough';
	stats_data[stats_key] = 1;
		LibraryThingConnector.recordStats(stats_data, function ()
		{
		LibraryThingConnector.debug('link to catalog post-stats callback');

		var cover_linking = LibraryThingConnector.utils.jQuery(button_element).data('cover_linking');
		LibraryThingConnector.debug('cover_linking: ' + cover_linking);
		LibraryThingConnector.info('final link: ' + link);
		var runLinkThroughBackendAA = {614: 1};
		// but not bdw links, they are set by bdw backend
		if (typeof runLinkThroughBackendAA[LibraryThingConnector.a_id] !== 'undefined' && LibraryThingConnector.backend && LibraryThingConnector.backend.runLink && !bdw_id)
			{
			LibraryThingConnector.info('runLink from backend');
			link = LibraryThingConnector.backend.runLink(link, raw_identifier, true);
			LibraryThingConnector.info('final url from backend: '+link);
			}
		if( (enrichment == 'bdw' || enrichment == 'similar') && cover_linking == 'new_window')
			{
			LibraryThingConnector.info('bdw opening new_window link:'+link);
			if (link.match(/new_window:/))
				{
				// for custom urls which contain the raw new_window: string
				link = link.replace('new_window:', '')
				}
			window.open(link);
			}
		else if( ev.which === 3 || ev.ctrlKey || ev.metaKey)
			{
			LibraryThingConnector.info('right click opening new_window link');
			window.open(link);
			}
		else
			{
			LibraryThingConnector.info('normal runLink');
			LibraryThingConnector.runLink(link, isCustomUrl,raw_identifier);
			}
		});
	};

/** do the actual linking
 *
 */
LibraryThingConnector.runLink = function (link, isCustomUrlB,raw_identifier)
	{
	if( typeof isCustomUrlB == 'undefined' )
		{
		isCustomUrlB = false;
		}
		if( typeof raw_identifier == 'undefined' )
			{
			raw_identifier = '';
			}
	LibraryThingConnector.info('isCustomUrlB: ' + isCustomUrlB);
	if( link )
		{
		LibraryThingConnector.debug('runLink: ' + link);
		if( !isCustomUrlB && LibraryThingConnector.backend && LibraryThingConnector.backend.runLink )
			{
			LibraryThingConnector.info('runLink from backend');
			LibraryThingConnector.backend.runLink(link,raw_identifier);
			}
		 else if ( link.startsWith('/')) // relative url
			{
			LibraryThingConnector.info('relative url, constructing new one');
			var catalog_url_decoded = decodeURIComponent(LibraryThingConnector.metadata.catalog_url);
			const url = new URL(catalog_url_decoded);
			LibraryThingConnector.info('URL constructed: ');
			LibraryThingConnector.info(url)
			var final_link = 'https://'+url.host + link;
			LibraryThingConnector.info('isCustomUrbB with relative url:'+link + 'final link:'+final_link);
			LibraryThingConnector.info('running pushState to link:'+final_link);
			window.history.pushState({},final_link);
			window.top.location.replace(final_link);
			}
		else
			{
			LibraryThingConnector.info('running pushState to link:'+link);
			window.history.pushState({},link);
			window.top.location.href = link;
			}
		}
	};

LibraryThingConnector.recordLightboxOpenedStat = function(enrichment)
	{
	LibraryThingConnector.info('recording lightbox opened stat for enrichment:' + enrichment);
	var stats_key = enrichment + '.' + 'lightbox';
	var data = {
		 type:'lightbox_opened'
	};
	data[stats_key] = 1;
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleLightboxOpened = function(ev)
	{
	LibraryThingConnector.debug('handleLightboxOpened');
	var element = ev.target;
	LibraryThingConnector.debug(element);

	var enrichment = LibraryThingConnector.extractEnrichmentTypeForChild(element);
	if ( !enrichment || typeof enrichment === "undefined")
		{
		LibraryThingConnector.debug('no enrichment found');
		return;
		}
	LibraryThingConnector.utils.jQuery(element).data('enrichment',enrichment);
	LibraryThingConnector.globals.enrichment_opened = enrichment;

	LibraryThingConnector.recordLightboxOpenedStat(enrichment);
	};

LibraryThingConnector.buildSearchResultsHover = function (ev)
	{
	var element = ev.target;
	LibraryThingConnector.debug('building hover for .unbound_cover element:');
	LibraryThingConnector.debug(element);


	var enrichment = null;
	if( LibraryThingConnector.utils.jQuery(element).data('enrichment-type'))
		{
		LibraryThingConnector.debug('enrichment type from hover elementi data-enrichment-type');
		enrichment = LibraryThingConnector.utils.jQuery(element).data('enrichment-type');
		}
	else
		{
		LibraryThingConnector.debug('enrichment type from parent .unbound_element');
		enrichment = LibraryThingConnector.extractEnrichmentTypeForChild(element);
		}
	LibraryThingConnector.debug('enrichment type for hover: ' + enrichment);

	var hoverData = null;

	var hoverData_from_title_author = {
		'title' : LibraryThingConnector.utils.jQuery(element).data('title'),
		'author' : LibraryThingConnector.utils.jQuery(element).data('author')
	};
	var id = LibraryThingConnector.utils.jQuery(element).data('id');
	var raw_identifier = LibraryThingConnector.extractIdentifierFromIdString(id);
	LibraryThingConnector.debug('id: ' + id + ' raw_identifier: ' + raw_identifier);
	if( !raw_identifier )
		{
		LibraryThingConnector.debug('no raw_identifier found, trying title+author for hover');
		hoverData = hoverData_from_title_author;
		}
	if( typeof id !== "undefined" && !hoverData)
		{
		LibraryThingConnector.debug('id: ' + id);
		hoverData = LibraryThingConnector.hoverData[id];
		}
	if( !hoverData )
		{
		LibraryThingConnector.debug('no hoverData found by id, using title+author hover data');
		hoverData = hoverData_from_title_author;
		}

	if (hoverData )
		{
		LibraryThingConnector.debug('hover data found');
		LibraryThingConnector.debug(hoverData);
		LibraryThingConnector.debug('title: ' + hoverData.title);
		LibraryThingConnector.debug('author: ' + hoverData.author);
		LibraryThingConnector.debug('summary: ' + hoverData.summary);
		LibraryThingConnector.debug('rating: ' + hoverData.rating);

		var jqelement = 	LibraryThingConnector.utils.jQuery(element);
		var unbound_hover = LibraryThingConnector.utils.jQuery('#unbound_hover');
		if( hoverData.title )
			{
			unbound_hover.find('.unbound_hover_title').html(hoverData.title);
			}
		else
			{
			unbound_hover.find('.unbound_hover_title').html('');
			}
		if( hoverData.author)
			{
			unbound_hover.find('.unbound_hover_author').html(hoverData.author);
			}
		else
			{
			unbound_hover.find('.unbound_hover_author').html('');
			}
		var customDetails = LibraryThingConnector.utils.jQuery(element).data('customdetails');
		if( customDetails )
			{
			LibraryThingConnector.debug('found customDetails, replacing summary with it');
			hoverData.summary = customDetails.trim();
			}
		// custom classes based on usage
		LibraryThingConnector.debug('Customizing hover based on main element classes');
		if( jqelement.hasClass('bdw-mini')) // small spaces
			{
			LibraryThingConnector.debug('adding bdw-mini');
			unbound_hover.addClass('bdw-mini');
			}
		if( jqelement.hasClass('bdw-narrow')) // small spaces
			{
			LibraryThingConnector.debug('adding bdw-narrow');
			unbound_hover.addClass('bdw-narrow');
			}
		if( jqelement.hasClass('bdw-vertical')) // vertical spaces
			{
			LibraryThingConnector.debug('adding bdw-vertical');
			unbound_hover.addClass('bdw-vertical');
			}
		if (hoverData.summary && hoverData.summary.trim().length) {
			unbound_hover.removeClass('no_summary');
			unbound_hover.find('.unbound_hover_summary').html(hoverData.summary);
		}
		else {
			unbound_hover.addClass('no_summary');
			unbound_hover.find('.unbound_hover_summary').html('');
		}
		if( hoverData.rating )
			{
			var stars_html = LibraryThingConnector.ratingImgAA[hoverData.rating];
			LibraryThingConnector.debug('stars_html: ' + stars_html);
			unbound_hover.find('.unbound_hover_rating').html(stars_html);
			}
		else
			{
			unbound_hover.find('.unbound_hover_rating').html('');
			}

		// Do e-resource label
			/*
		let isbnel = unbound_hover.find('.unbound_hover_isbn');
		let er = LibraryThingConnector.utils.jQuery('<div class="unbound_hover_eresource_label"><img alt="eresource icon" class="unbound_mediatype_alert_img large bullet" src="https://image.librarything.com/pics/cmxz_e@3x.png"> <span class="unbound_hover_eresource_label_text">Electronic Resource</span></div>');
		isbnel.after(er);
			 */

		// set up hover link button
		var unbound_hover_link_button = unbound_hover.find('.unbound_hover_link_button');
		var unbound_hover_link_button_element = unbound_hover_link_button.get(0);
		LibraryThingConnector.debug('hover link button');
		LibraryThingConnector.debug(unbound_hover_link_button);

		// linking id
		var id = jqelement.data('id');
		LibraryThingConnector.debug('setting id for linking button to: ' + id);
		LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('id', id);

		LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('id', id);

		// other link types for kw/ti linking
		LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('title', hoverData.title);
		LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('author', hoverData.author);

		// if the item is held, from img
		var img_el = LibraryThingConnector.utils.jQuery(element).parents('.unbound_book_container').find('.unbound_cover_area img');
		var unboundCoverUnheldB = LibraryThingConnector.utils.jQuery(img_el).hasClass('unbound_cover_unheld');
		if( unboundCoverUnheldB)
			{
			LibraryThingConnector.log('setting unbound_cover_unheld on button element dataset');
			LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('unbound_cover_unheld',true);
			}
		else
			{
			LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('unbound_cover_unheld', false);
			}

		// enrichment type
		LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('enrichment_type', 'search_div');

		LibraryThingConnector.debug('setting onclick');
		// unbound_hover_link_button.unbind('click').click(LibraryThingConnector.openSearchResult);
		// unbound_hover_link_button.unbind('touchstart').on('touchstart', LibraryThingConnector.openSearchResult);

		// doubleclick on cover?
		// LibraryThingConnector.utils.jQuery(element).off('dblclick.unbound').on('dblclick.unbound', LibraryThingConnector.openSearchResult);
		LibraryThingConnector.debug('final hover div html');
		LibraryThingConnector.debug(unbound_hover);
		LibraryThingConnector.debug(unbound_hover.html());
		LibraryThingConnector.showHover(ev, element);
		}
	else
		{
		LibraryThingConnector.debug('no hover data found for ' + id + ', hiding hover');
		LibraryThingConnector.hideHover();
		}
	};

LibraryThingConnector.buildHover = function (ev)
	{
	var element = ev.target;
	var jqelement = LibraryThingConnector.utils.jQuery(element);
	LibraryThingConnector.debug('building hover for .unbound_cover element:');
	LibraryThingConnector.debug(element);
	LibraryThingConnector.debug(jqelement);

	// CH: if we are mobile we don't even need to build the hovers now since we direct-link to items.
	if (LibraryThingConnector.supportsTouch || LibraryThingConnector.browser.classesAA['mobile']) {
		LibraryThingConnector.debug('setting single onclick for mobile');
		// don't add the dblclick on mobile devices, but we might want to do something else here.
		LibraryThingConnector.utils.jQuery(element).off('click.unbound').on('click.unbound', LibraryThingConnector.linkToCatalog);
	}
	else {
		var enrichment = null;
		// override from url parameter type (within lightbox)
		if ( window.location.href.match(/lightbox/))
			{
			LibraryThingConnector.debug('getting hover stats type from url');
			var query_hash = LibraryThingConnector.utils.parse_queries();
			if ( query_hash['enhancement'])
				{
				LibraryThingConnector.globals.enrichment_opened = LibraryThingConnector.extractEnrichmentTypeFromClass(query_hash['enhancement']);
				}
			else if ( query_hash['type'])
				{
				LibraryThingConnector.globals.enrichment_opened = query_hash['type'];
				}
			LibraryThingConnector.debug('enrichment_opened set to ' + LibraryThingConnector.globals.enrichment_opened);
			enrichment = LibraryThingConnector.globals.enrichment_opened;
			}
		else if( LibraryThingConnector.utils.jQuery(element).data('enrichment_type'))
			{
			LibraryThingConnector.debug('enrichment type from hover elementi data-enrichment-type');
			enrichment = LibraryThingConnector.utils.jQuery(element).data('enrichment_type');
			}
		else
			{
			LibraryThingConnector.debug('enrichment type from parent .unbound_element');
			enrichment = LibraryThingConnector.extractEnrichmentTypeForChild(element);
			}
		LibraryThingConnector.debug('enrichment type for hover: ' + enrichment);

		var hoverData = null;

		var hoverData_from_title_author = {
			'title' : LibraryThingConnector.utils.jQuery(element).data('title'),
			'author' : LibraryThingConnector.utils.jQuery(element).data('author')
		};
		var id = LibraryThingConnector.utils.jQuery(element).data('id');
		var raw_identifier = LibraryThingConnector.extractIdentifierFromIdString(id);
		LibraryThingConnector.debug('id: ' + id + ' raw_identifier: ' + raw_identifier);
		if( !raw_identifier )
			{
			LibraryThingConnector.debug('no raw_identifier found, trying title+author for hover');
			hoverData = hoverData_from_title_author;
			}
		if( typeof id !== "undefined" && !hoverData)
			{
			LibraryThingConnector.debug('id: ' + id);
			hoverData = LibraryThingConnector.hoverData[id];
			}
		if( !hoverData )
			{
			LibraryThingConnector.debug('no hoverData found by id, using title+author hover data');
			hoverData = hoverData_from_title_author;
			}
		if( !hoverData.title && hoverData_from_title_author.title )
			{
			LibraryThingConnector.debug('taking hover data title from hoverData_from_title_author');
			hoverData.title = hoverData_from_title_author.title;
			}
		if( !hoverData.author && hoverData_from_title_author.author )
			{
			LibraryThingConnector.debug('taking hover data author from hoverData_from_title_author');
			hoverData.author = hoverData_from_title_author.author;
			}

		if (hoverData )
			{
			LibraryThingConnector.debug('hover data found');
			LibraryThingConnector.debug(hoverData);
			LibraryThingConnector.debug('title: ' + hoverData.title);
			LibraryThingConnector.debug('author: ' + hoverData.author);
			LibraryThingConnector.debug('summary: ' + hoverData.summary);
			LibraryThingConnector.debug('rating: ' + hoverData.rating);

			var unbound_hover = LibraryThingConnector.utils.jQuery('#unbound_hover');
			if( hoverData.title )
				{
				unbound_hover.find('.unbound_hover_title').html(hoverData.title);
				}
			else
				{
				unbound_hover.find('.unbound_hover_title').html('');
				}
			if( hoverData.author)
				{
				unbound_hover.find('.unbound_hover_author').html(hoverData.author);
				}
			else
				{
				unbound_hover.find('.unbound_hover_author').html('');
				}
			if( LibraryThingConnector.utils.jQuery(element).hasClass('bdw-mini')) // small spaces
				{
				unbound_hover.addClass('bdw-mini');
				unbound_hover.addClass('no_summary');
				}

			// customizing based on bdw theme size and type
			if( jqelement.hasClass('bdw-narrow')) // small spaces
				{
				LibraryThingConnector.debug('adding bdw-narrow to unbound_hover classes');
				unbound_hover.addClass('bdw-narrow');
				}
			if( jqelement.hasClass('bdw-vertical')) // vertical spaces
			{
			LibraryThingConnector.debug('adding bdw-vertical to unbound_hover classes');
				unbound_hover.addClass('bdw-vertical');
			}
			if( enrichment == 'bdw' && hoverData.summary)
				{
				LibraryThingConnector.info('truncating text for bdw hover')
				hoverData.summary = LibraryThingConnector.utils.truncateText(hoverData.summary,150,'...');
				}

			if (hoverData.summary && hoverData.summary.trim().length) {
				unbound_hover.removeClass('no_summary');
				unbound_hover.find('.unbound_hover_summary').html(hoverData.summary);
			}
			else {
				unbound_hover.addClass('no_summary');
				unbound_hover.find('.unbound_hover_summary').html('');
			}
			var customDetails = LibraryThingConnector.utils.jQuery(element).data('customdetails');
			if( customDetails )
				{
				LibraryThingConnector.debug('found customDetails, replacing summary with it');
				hoverData.summary = customDetails.trim();
				unbound_hover.find('.unbound_hover_summary').html(hoverData.summary);
				unbound_hover.addClass('bdw-customDetails');
				}
			else if( enrichment == 'bdw' )
				{
				unbound_hover.removeClass('bdw-customDetails');
				}
			if( hoverData.rating )
				{
				var stars_html = LibraryThingConnector.ratingImgAA[hoverData.rating];
				LibraryThingConnector.debug('stars_html: ' + stars_html);
				unbound_hover.find('.unbound_hover_rating').html(stars_html);
				}
			else
				{
				unbound_hover.find('.unbound_hover_rating').html('');
				}
			// add in format for Other
			if ( enrichment == 'other' )
				{
				LibraryThingConnector.debug('Other element: checking for format string to put into hover');
				var format_el = LibraryThingConnector.utils.jQuery(element).parents('.unbound_book_container').find('.unbound_format');
				if( format_el.length )
					{
					LibraryThingConnector.debug('found .unbound_format');
					var format_string = LibraryThingConnector.utils.jQuery(format_el).text();
					if ( format_string )
						{
						LibraryThingConnector.debug('adding .unbound_format to hover: ' + format_string);
						unbound_hover.find('.unbound_hover_format').html(format_string);
						}
					else
						{
						unbound_hover.find('.unbound_hover_format').html('');
						}

					}

				}
			else
				{
				unbound_hover.find('.unbound_hover_format').html('');
				}

			// set up hover link button
			var unbound_hover_link_button = unbound_hover.find('.unbound_hover_link_button');
			var unbound_hover_link_button_element = unbound_hover_link_button.get(0);
			LibraryThingConnector.debug('hover link button');
			LibraryThingConnector.debug(unbound_hover_link_button);

			// Do e-resource label
				try {
					unbound_hover.find('.unbound_hover_eresource_label').hide();
						if (LibraryThingConnector.mark_eresources && hoverData.eresource !== 'undefined') {
							if (hoverData.eresource > 0) {
								if (unbound_hover.find('.unbound_hover_eresource_label').length === 0) {
									let isbnel = unbound_hover.find('.unbound_hover_isbn');
									let er = LibraryThingConnector.utils.jQuery('<div class="unbound_hover_eresource_label"><img alt="eresource icon" class="unbound_mediatype_alert_img" src="https://image.librarything.com/pics/cmxz_e@3x.png"><span class="unbound_hover_eresource_label_text">'+LibraryThingConnector.translationstringsA.eresource+'</span></div>');
									isbnel.after(er);
								}
								else {
									unbound_hover.find('.unbound_hover_eresource_label').show();
								}

							}
					}
				} catch(err) {  }


			LibraryThingConnector.debug('element data');
			LibraryThingConnector.debug(element);
			LibraryThingConnector.debug(LibraryThingConnector.utils.jQuery(element).data());

			// linking id
			var id = LibraryThingConnector.utils.jQuery(element).data('id');
			LibraryThingConnector.debug('setting id for linking button to: ' + id);
			LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('id', id);

			// bdw id
			var bdw_id = LibraryThingConnector.utils.jQuery(element).data('bdw-id');
			if( bdw_id )
				{
				LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('bdw-id', bdw_id);
				}
			// if a raw url is set, pass it to hover (for bdw linking)
			var url = LibraryThingConnector.utils.jQuery(element).data('url');
			if( url )
				{
				LibraryThingConnector.debug('setting data-url on unbound hover link: ' + url);
				LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('url', url);
				}
			var bdw_extra_info = LibraryThingConnector.utils.jQuery(element).data('bdw-extra-info');
			if( bdw_extra_info )
				{
				LibraryThingConnector.debug('setting data-bdw-extra-info on unbound hover link: ' + url);
				LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('bdw-extra-info', bdw_extra_info);
				}
			var onclick = LibraryThingConnector.utils.jQuery(element).data('onclick');
			if( onclick )
				{
				LibraryThingConnector.debug('setting data-onclick on unbound hover link: ' + onclick);
				LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('onclick', onclick);
				}
			// cover_linking type (new_window, direct)
			var cover_linking = LibraryThingConnector.utils.jQuery(element).data('cover_linking');
			if( cover_linking )
				{
				LibraryThingConnector.debug('setting cover_linking on unbound hover link: ' + cover_linking);
				LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('cover_linking', cover_linking);
				}
			LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('id', id);

			// bestlink data from librarian power
			var bestlink_type = LibraryThingConnector.utils.jQuery(element).data('bestlink_type');
			if( bestlink_type )
				{
				LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('bestlink_type', bestlink_type);
				}
			var bestlink_identifier = LibraryThingConnector.utils.jQuery(element).data('bestlink_identifier');
			if( bestlink_identifier )
				{
				LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('bestlink_identifier', bestlink_identifier);
				}

			// other link types for kw/ti linking
			LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('title', hoverData.title);
			LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).attr('data-title', hoverData.title);
			LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('author', hoverData.author);
			LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).attr('data-author', hoverData.author);

			// if the item is held, from img
			var img_el = LibraryThingConnector.utils.jQuery(element).parents('.unbound_book_container').find('.unbound_cover_area img');
			var unboundCoverUnheldB = LibraryThingConnector.utils.jQuery(img_el).hasClass('unbound_cover_unheld');
			// reset for below unheld logic
			if (LibraryThingConnector.backend.name == 'apollo')
				{
				unbound_hover.find('.unbound_hover_link').css('display', 'block');
				}
			if( unboundCoverUnheldB)
				{
				LibraryThingConnector.log('setting unbound_cover_unheld on button element dataset');
				LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('unbound_cover_unheld',true);
				// hide avail btn for biblionix
				if ( LibraryThingConnector.backend.name == 'apollo')
					{
					LibraryThingConnector.info('unheld cover for biblionix, hiding avail btn on hover');
					unbound_hover.find('.unbound_hover_link').css('display','none');
					}
				}
			else
				{
				LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('unbound_cover_unheld', false);
				}

			// enrichment type
			LibraryThingConnector.utils.jQuery(unbound_hover_link_button_element).data('enrichment_type', enrichment);

			LibraryThingConnector.debug('setting onclick');
			// set onclick on cover as well, for accessibility
			if (LibraryThingConnector.backend.name != 'ls2')
				{
				// exclude new_window linking for bdw
				LibraryThingConnector.utils.jQuery('.unbound_cover:not([data-cover_linking="new_window"])').unbind('click').click(function(ev) {
					LibraryThingConnector.info('click on SU cover, linking');
					LibraryThingConnector.utils.jQuery(ev).attr('data-title',hoverData.title);
					LibraryThingConnector.utils.jQuery(img_el).attr('data-title',hoverData.title);

					LibraryThingConnector.utils.jQuery(ev).attr('data-author',hoverData.author);
					LibraryThingConnector.utils.jQuery(img_el).attr('data-author',hoverData.author);

					LibraryThingConnector.utils.jQuery(img_el).data('unbound_cover_unheld',LibraryThingConnector.utils.jQuery(img_el).hasClass('unbound_cover_unheld'));

					LibraryThingConnector.linkToCatalog(ev);
				});
				// set kbd handler for enter for linkToCatalog
				LibraryThingConnector.utils.jQuery(document).keypress(function (ev) {
					var keycode = ev.keyCode || ev.which;
					if (LibraryThingConnector.utils.jQuery(ev.target).hasClass('unbound_cover') && keycode == '13')
						{
						LibraryThingConnector.info('ENTER on SU cover, linking');
						LibraryThingConnector.linkToCatalog(ev);
						}
				});
				}
			// TODO: I don't know if we need to bind to both 'click' and 'touchstart' here.
			unbound_hover_link_button.unbind('touchstart').on('touchstart', function (ev) {
				LibraryThingConnector.info('touchstart on SU cover, linking');
				LibraryThingConnector.utils.jQuery(ev).attr('data-title', hoverData.title);
				LibraryThingConnector.utils.jQuery(ev).attr('data-author', hoverData.author);
				LibraryThingConnector.linkToCatalog(ev);
			});

			unbound_hover_link_button.unbind('click').click(LibraryThingConnector.linkToCatalog);
			unbound_hover_link_button.unbind('contextmenu').on('contextmenu', function(ev) {
			LibraryThingConnector.info('contextmenu runLink');
				LibraryThingConnector.debug(LibraryThingConnector.utils.jQuery(ev.target).data());
				LibraryThingConnector.utils.jQuery(ev.target).data('cover_linking',1);
				ev.stopPropagation();
				LibraryThingConnector.linkToCatalog(ev);
				return false;
			});

			// doubleclick on cover?
				if (LibraryThingConnector.browser.classesAA['mobile'])
				{
					// don't add the dblclick on mobile devices, but we might want to do something else here.
				}
				else
					{
					if (unboundCoverUnheldB && LibraryThingConnector.backend.name == 'apollo')
						{
						LibraryThingConnector.info('apollo unheld cover. not setting dbl click handler');
						}
					else
						{
						LibraryThingConnector.utils.jQuery(element).off('dblclick.unbound').on('dblclick.unbound', function (ev) {
							LibraryThingConnector.info('double click on SU cover, linking');
							LibraryThingConnector.utils.jQuery(ev).attr('data-title', hoverData.title);
							LibraryThingConnector.utils.jQuery(ev).attr('data-author', hoverData.author);
							LibraryThingConnector.linkToCatalog(ev);
						});
						}
					}

			LibraryThingConnector.debug('final hover div html');
			LibraryThingConnector.debug(unbound_hover);
			LibraryThingConnector.debug(unbound_hover.html());
			LibraryThingConnector.showHover(ev, element,enrichment);
			}
		else
			{
			LibraryThingConnector.debug('no hover data found for ' + id + ', hiding hover');
			LibraryThingConnector.hideHover();
			}
	}
};


/**
 * show the (less) form of the truncated text
 */
LibraryThingConnector.expandTruncates = function()
	{
	LibraryThingConnector.utils.jQuery('.unbound_truncate_suless').parents('.unbound_truncate').show();
	LibraryThingConnector.utils.jQuery('.unbound_truncate_sumore').parents('.unbound_truncate').hide();
	};
/*
from jquery.truncator.js
 */
LibraryThingConnector.utils.truncateText = function (text, max_length, ellipses)
	{
	if( typeof ellipses == 'undefined' )
		{
		ellipses = '...';
		}
	text = text.replace(/^ /, '');  // node had trailing whitespace.
	text = text.replace(/...$/, '');  // node already had ellipses
	trailing_whitespace = !!text.match(/ $/);
	// Truncate text if it's longer then max length
	if (text.length >= max_length)
		{
		// Ensure text is not truncated in the middle of a word
		if (text.charAt(max_length - 1) != " ")
			{
			var next_space = text.indexOf(" ", max_length);
			text = next_space > 0 ? text.slice(0, next_space) : text;
			}
		else
			{
			var text = text.slice(0, max_length);
			}
		// Ensure HTML entities are encoded
		// http://debuggable.com/posts/encode-html-entities-with-jquery:480f4dd6-13cc-4ce9-8071-4710cbdd56cb
		text = $('<div/>').text(text).html();
		text += ellipses;
		}
	return text;
	};

LibraryThingConnector.showHover = function (ev, element,enrichment) {
	LibraryThingConnector.debug('showHover');
	LibraryThingConnector.debug(ev);
	LibraryThingConnector.debug(element);

	var unbound_hover = LibraryThingConnector.getHover();
	var _el = LibraryThingConnector.utils.jQuery(element);
	var _window = LibraryThingConnector.utils.jQuery(window);
	var offset = _el.offset();
	// TODO hmmm. this shouldn't be pagewidth, but container width in lightbox
	var _page_width = _window.width();
	var _page_height = _window.height();
	var _page_scrolltop = _window.scrollTop();

	/* Have to treat the iframe content slightly different because of scroll offsets. */
	var _iframe = ( window.self !== window.top ) ? true : false;
	var _body = LibraryThingConnector.utils.jQuery('body');
	if (_iframe) {
		var _wh = window.innerHeight;
		LibraryThingConnector.debug('showHover within iframe');
		_page_width = window.innerWidth;
		_page_height = window.innerHeight;
		_page_scrolltop = _body.scrollTop();
		//_iframe_height = _body.scrollHeight();
		LibraryThingConnector.debug('_page_width: ' + _page_width + ' page_height: ' + _page_height + ' page_scrolltop: ' + _page_scrolltop)
	}



	/* if primo we need to check for <sticky-scroll> to see if content is in the slideout
	if it is, then we need to measure the scroll offset of the slideout instead of the page.
	 */
	var _primo_body_offset = 0;
	if (LibraryThingConnector.backend.name == 'primo') {
		var primo_scroller = LibraryThingConnector.utils.jQuery('sticky-scroll');
		if (primo_scroller.length) {
			var _primo_body_offset_top = _body.css('top');
			_primo_body_offset = parseFloat(_primo_body_offset_top);
		}
		_primo_body_offset = _primo_body_offset - 7;
	}

	var _view_bottom = _page_height + _page_scrolltop - _primo_body_offset;

	var _w = _el.outerWidth(true);
	var _h = _el.outerHeight(true);

	if( _el.hasClass('unbound-hover-bdw'))
	{
		unbound_hover.addClass('unbound-hover-bdw');
		var _el_container = _el.parents('.LTFL_Book');
		_h = _el_container.height();

	}

	LibraryThingConnector.debug('offset for hover: ');
	LibraryThingConnector.debug(offset);
	LibraryThingConnector.debug('primo body offset: '+_primo_body_offset);

	var hover_left = offset.left;
	var hover_top = offset.top + _h - _primo_body_offset;
	var hover_width = unbound_hover.outerWidth(true) + 10;
	var hover_height = unbound_hover.outerHeight(true) + 10;
	var hover_bottom = hover_top + hover_height;
	var hover_right = hover_width + hover_left;

	var diff = 0;
	/* Handle left-right placement */
	if (hover_width > _page_width) {
		// wider than the page
		diff = offset.left;
		hover_left = 0;
		unbound_hover.css({width: _page_width});
		hover_width = _page_width;
	}
	else {
		if (hover_right > _page_width) {
			//hanging over
			diff = hover_right - _page_width + 20; // 10 is a fudge to give it some offset from the edge
			hover_left = hover_left - diff;
		}
	}

	/* Handle top-bottom placement of hover */
	if (hover_bottom > _view_bottom) {
		// TODO: check to see if we have room on top. We might not on a small device.
		if (1) {
			hover_top = offset.top - hover_height + 5 + _primo_body_offset;
			unbound_hover.addClass('above');
		}

	}
	else {
		unbound_hover.removeClass('above');
	}
	if( _el.hasClass('unbound-hover-vcenter'))
		{
		LibraryThingConnector.debug('forcing hover to center per class on img el')
		unbound_hover.removeClass('above');
		//hover_top = 30
		hover_top = offset.top + (_h * 0.5) - (hover_height * 0.5);
		LibraryThingConnector.debug(unbound_hover);
		}




	// Now move the little triangle to match
	var triangle_offset = 30;
	if (LibraryThingConnector.backend.name == "ebookcentral") {
		/* EBC uses smaller triangles */
		triangle_offset = 25;
	}
	LibraryThingConnector.utils.jQuery('#unbound_hover_triangle').css({'margin-left':Math.round((_w * 0.5) - triangle_offset + diff)});

	hover_left = Math.round(hover_left);
	hover_top = Math.round(hover_top);

	unbound_hover.hide(); // for some reason this fixed webkit bug where it didn't update render position of triangle
	unbound_hover.css({top:hover_top, left:hover_left});
	unbound_hover.show();
	LibraryThingConnector.recordHoverStat(enrichment);
};

LibraryThingConnector.hideHover = function()
	{
	LibraryThingConnector.debug('hideHover');
		LibraryThingConnector.getHover().removeClass('hover');
	LibraryThingConnector.getHover().fadeOut(100);
	};

LibraryThingConnector.hideHoverImmediate = function()
	{
	LibraryThingConnector.debug('hideHover');
		LibraryThingConnector.getHover().removeClass('hover');
	LibraryThingConnector.getHover().hide();
		return false;
	};

LibraryThingConnector.handleHoverIn = function (ev)
	{
	// LibraryThingConnector.log('handleHoverIn');
	// LibraryThingConnector.log(ev);
		clearTimeout(LibraryThingConnector.hoverTimeout);
		LibraryThingConnector.buildHover(ev);
		LibraryThingConnector.getHover().addClass('hover');
	};

LibraryThingConnector.hoverTimeout = {};
LibraryThingConnector._hoverElement = {};
LibraryThingConnector.getHover = function() {
	if (!LibraryThingConnector._hoverElement.length) {
		LibraryThingConnector._hoverElement = LibraryThingConnector.utils.jQuery('#unbound_hover');
	}
	return LibraryThingConnector._hoverElement;
}

LibraryThingConnector.handleHoverOut = function (ev)
	{
	LibraryThingConnector.debug('handleHoverOut');
	LibraryThingConnector.debug(ev);
	LibraryThingConnector.hoverTimeout = setTimeout( function () {
		var _hover = LibraryThingConnector.getHover();
		/* This is a horrible jquery bug hack: should just be _hover(':hover') here */
		if ( _hover.parent().find("#unbound_hover:hover").length ) {
			// we are hovering over the popup. attach a mouse out to it.
			_hover.off('mouseleave').mouseleave(function(e) {
				e.stopPropagation();
				LibraryThingConnector.hideHoverImmediate()
			});
		}
		else {
			// If you're not hovering over the popup, hide it immediately
			//LibraryThingConnector.log('hover outside of popup');
			_hover.off('mouseout');
			LibraryThingConnector.hideHoverImmediate();
		}
	}, 25);
	};


LibraryThingConnector.addSearchResultsHoverToBody = function()
	{
	megaDiv = LibraryThingConnector.hoverDivHTML;
	LibraryThingConnector.info('adding search results hover to body');
	LibraryThingConnector.utils.jQuery(document.body).append(LibraryThingConnector.searchresults_hoverDivHTML);

	LibraryThingConnector.hoverAddedB = true;
	};

LibraryThingConnector.addHoverToBody = function ()
	{

	if( LibraryThingConnector.hoverAddedB )
		{
		LibraryThingConnector.info('hoverdiv already added to body, skipping');
		var existing_hovers = LibraryThingConnector.utils.jQuery('.unbound_mega').next('.unbound_hover');
		if( existing_hovers )
			{
			LibraryThingConnector.info('detaching existing unbound_hover next to megadiv');
			LibraryThingConnector.utils.jQuery(existing_hovers).detach();
			}
		}

	else
		{
		// detach from megadiv
		LibraryThingConnector.info('addHoverToBody');
		LibraryThingConnector.info('detaching from megaDiv');
		var megaDiv = LibraryThingConnector.utils.jQuery('#unbound_hover').detach();
		if( !megaDiv.length )
			{
			LibraryThingConnector.info('hover div not detached, adding from static hoverDivHTML');
			megaDiv = LibraryThingConnector.hoverDivHTML;
			}

		// add to body
		LibraryThingConnector.info('adding hover to body');
		LibraryThingConnector.utils.jQuery(document.body).append(megaDiv);

		LibraryThingConnector.hoverAddedB = true;
		}

	};

LibraryThingConnector.addExpands = function(element_selector, max_length, more_text, less_text )
	{
	var containing_el = LibraryThingConnector.getMegaDivEl();
	// scope these to current element, or it can slow down page on catalogs with multiple closed modals
	var unbound_truncate = LibraryThingConnector.utils.jQuery(element_selector, containing_el);
	unbound_truncate.truncate({
		max_length: max_length,
		more: more_text,
		less: less_text,
		link_prefix: '',
		link_suffix: '',
		css_more_class: 'unbound_link unbound_truncate_sumore',
		css_less_class: 'unbound_link unbound_truncate_suless'
	});
	};

LibraryThingConnector.attachShowHideList = function(element_selector)
{
	LibraryThingConnector.info('attachShowHideList on :' + element_selector);
	LibraryThingConnector.utils.jQuery(element_selector).click(LibraryThingConnector.showHideList);
	LibraryThingConnector.utils.jQuery(element_selector).click();
};


LibraryThingConnector.attachExpands = function(element_selector)
	{
	if( LibraryThingConnector.utils.jQuery(element_selector).find('.unbound_truncate_sumore').length)
		{
		LibraryThingConnector.info('attachExpands: found .unbound_truncate_sumore in '+element_selector+' already, not attaching again');
		return;
		}

	var selector = element_selector + ' .unbound_truncate';
	LibraryThingConnector.debug('attaching expand js to .unbound_truncate to selector: ' + selector);
	//LibraryThingConnector.addExpands(selector, 400, 'read moreXXX','lessXXX');
	LibraryThingConnector.addExpands(selector, 400, LibraryThingConnector.translationstringsA.readmore,LibraryThingConnector.translationstringsA.less);

	var _element = LibraryThingConnector.utils.jQuery(element_selector).get(0);

	// record stat for expand
	var unbound_truncate_links = LibraryThingConnector.utils.jQuery('.unbound_truncate_suless,.unbound_truncate_sumore',_element);
	unbound_truncate_links.on('click', LibraryThingConnector.recordExpandStat);
	};

LibraryThingConnector.recordExpandStat = function (ev)
	{
	LibraryThingConnector.debug('recordExpandStat');
	var element = ev.target;
	var enrichment = LibraryThingConnector.extractEnrichmentTypeForChild(element);
	if ( !enrichment)
		{
		LibraryThingConnector.debug('no enrichment found for expand');
		return;
		}

	var stats_data = {
	'type':'expand'
	};
	stats_data[enrichment+'.expand'] = 1;
	LibraryThingConnector.recordStats(stats_data);
	};

LibraryThingConnector.recordBdwMultiWidgetLoaded = function (bdw_id)
	{
	LibraryThingConnector.debug('recordBdwMultiWidgetLoaded');
	var enrichment = 'bdw';
	var stats_data = {
		'type':'multi_bdw_loaded',
		'bdw_id':bdw_id
	};
	stats_data[enrichment+'.loaded'] = 1;
	LibraryThingConnector.recordStats(stats_data);
	};

LibraryThingConnector.recordBdwWidgetLoaded = function (bdw_id)
	{
	LibraryThingConnector.debug('recordBdwWidgetLoaded');
	var enrichment = 'bdw';
	var stats_data = {
		'type':'bdw_loaded',
		'bdw_id':bdw_id
	};
	stats_data[enrichment+'.loaded'] = 1;
	LibraryThingConnector.recordStats(stats_data);
	};

LibraryThingConnector.recordBdwListWidgetLoaded = function (lslw_id)
	{
		LibraryThingConnector.debug('recordBdwListWidgetLoaded');
		var enrichment = 'bdw';
		var stats_data = {
			'type':'bdw_listwidget_loaded',
			'lslw_id':lslw_id
		};
		stats_data[enrichment+'.loaded'] = 1;
		LibraryThingConnector.recordStats(stats_data);
	};

LibraryThingConnector.attachHoverToCovers = function (element_selector)
	{
	LibraryThingConnector.debug('attachHoverToCovers with element_selector: ' + element_selector);
	var cover_selector = '.unbound_cover';
	cover_selector = element_selector + ' .unbound_cover:not(.nohover)';
	LibraryThingConnector.debug('attaching hovers to cover selector: ' + cover_selector);

	var _el = LibraryThingConnector.utils.jQuery(cover_selector);

	_el.unbind('mouseenter').unbind('mouseleave');
	_el.mouseenter(LibraryThingConnector.handleHoverIn).mouseleave(LibraryThingConnector.handleHoverOut);
	//_el.hover(LibraryThingConnector.handleHoverIn, LibraryThingConnector.handleHoverOut);

	_el.on('touchstart', LibraryThingConnector.handleHoverIn);
	LibraryThingConnector.utils.jQuery(document.body).on('touchstart', LibraryThingConnector.handleHoverOut);
	// this messing up hover within lightbox
	// LibraryThingConnector.utils.jQuery(document.body).hover(LibraryThingConnector.handleHoverOut);
	};


LibraryThingConnector.handleEnterToClick = function(ev) {
		var keycode = ev.keyCode || ev.which;
		if (keycode == '13')
			{
			LibraryThingConnector.info('ENTER lightbox element, clicking ev.target');
			LibraryThingConnector.utils.jQuery(ev.target).click();
			}
};

LibraryThingConnector.attachAccessibilityItems = function ()
	{
	LibraryThingConnector.info('attachAccessibilityItems');
		// remove href attributes for accessibility
	LibraryThingConnector.utils.jQuery('.unbound_truncate_sumore').attr('href', '');

	// add tabindexes
	LibraryThingConnector.utils.jQuery('.unbound_seemore_link').attr('tabindex', '0');
	LibraryThingConnector.utils.jQuery('.unbound_lb_launch').attr('tabindex', '0');
	LibraryThingConnector.utils.jQuery('.unbound_shelf_end').attr('tabindex', '0');
	LibraryThingConnector.utils.jQuery('.unbound_tagblocktable').find('.unbound_lightbox').attr('tabindex', '0');

	// run additional accessibility items
	if (LibraryThingConnector.backend.name != 'ls2' )
		{
		LibraryThingConnector.attachAccessibilityItemsV2();
		}
	if (LibraryThingConnector.a_id == 406) // for testing
		{
		LibraryThingConnector.attachAccessibilityItemsV2();
		}
	};

LibraryThingConnector.attachAccessibilityItemsV2 = function()
	{
	LibraryThingConnector.info('attachAccessibilityItems2');
	LibraryThingConnector.utils.jQuery('.unbound_lightbox_section_header').attr('tabindex', '0');
	LibraryThingConnector.utils.jQuery('.unbound_cover_area_type_seriesrec').attr('tabindex', '0');
	LibraryThingConnector.utils.jQuery('.unbound_similar_display_subtype').attr('tabindex', '0');
	LibraryThingConnector.utils.jQuery('.unbound_lookinside_nav_item,.unbound_readinglevel_nav_item,.LTFL_shelf_large_nav,.unbound_review.lightbox,.unbound_review.catalog,.unbound_reviews_rating,.unbound_reviews_reviewdby,span.rw img,a.su_sd_title').attr('tabindex', '0');
	LibraryThingConnector.utils.jQuery('.unbound_cover_seriesrec').attr('aria-hidden','true');

	LibraryThingConnector.utils.jQuery('.unbound_author_photo_image').not('.unbound_loaded').addClass('unbound_default_photo').attr('alt', 'Author photo');
	LibraryThingConnector.utils.jQuery('.unbound_author_photo_image', LibraryThingConnector.containingEl).not('.unbound_loaded').addClass('unbound_default_photo').attr('src', LibraryThingConnector.default_author_img_url).attr('alt', 'Author photo');

	// handle keyboard ENTER -> click()
	LibraryThingConnector.utils.jQuery('.unbound_lookinside_nav_item,.unbound_readinglevel_nav_item,.LTFL_shelf_large_nav,span.rw img,a.su_sd_title,.unbound_cover_area_type_seriesrec,.unbound_authorauthorrec').keypress(LibraryThingConnector.handleEnterToClick);

	// SU headers, make focusable
	LibraryThingConnector.utils.jQuery('.unbound_header').attr('tabindex','0');

	// SU nav to scroll animation, switch focus
	LibraryThingConnector.utils.jQuery('.unbound_nav_item').click(function(ev) {
		var _hash = LibraryThingConnector.utils.jQuery(ev.target).attr('href').replace('#', '');
		var enrichment_type = _hash.replace('unbound_nav_', '');
		LibraryThingConnector.info('.unbound_header click, moving focus() down to SU section hash: ' + _hash + ' enrichment_type:'+enrichment_type);
		var target = LibraryThingConnector.utils.jQuery('.unbound_' + enrichment_type + '_header');
		LibraryThingConnector.utils.jQuery(target).focus();
	});

	// attach alt=
	var unbound_cover_alts_addedN = 0;
	var unbound_cover_alts_added_from_dataN = 0;
	var unbound_cover_alts_missedN = 0;
	LibraryThingConnector.utils.jQuery('img.unbound_cover:not(.unbound_cover_seriesrec)').each(function (i, n) {
		var that = LibraryThingConnector.utils.jQuery(this);
		// set tabindex for keyboard navigation among SU covers

		var _id = that.data('id');
		// add aria-hidden to non-visible covers (detected via empty src attr)
		if( typeof LibraryThingConnector.utils.jQuery(that).attr('src') === 'undefined')
			{
			LibraryThingConnector.utils.jQuery(that).attr('aria-hidden','true');
			LibraryThingConnector.utils.jQuery(that).removeAttr('tabindex');
			}
		else
			{
			LibraryThingConnector.utils.jQuery(that).attr('aria-hidden', 'false');
			LibraryThingConnector.utils.jQuery(that).attr('tabindex','0');
			}

		var hoverData = LibraryThingConnector.hoverData[_id];
		var dataTitle = LibraryThingConnector.utils.jQuery(that).data('title');
		var dataAuthor = LibraryThingConnector.utils.jQuery(that).data('author');
		var alt = '';
		if (typeof hoverData != 'undefined') {
		var dataRating = hoverData['rating'];
		var dataSummary = hoverData['summary'];
		var alt = hoverData.title;
			if (hoverData.author) {
				alt += ' by '+hoverData.author;
			}
		if (dataSummary !== null)
			{
//			dataSummary_truncated = LibraryThingConnector.utils.truncateText(dataSummary, 50, '...');
//			alt += dataSummary_truncated;
			}
		LibraryThingConnector.utils.jQuery(this).attr('alt',alt);
		unbound_cover_alts_addedN = unbound_cover_alts_addedN + 1;
		}
		else if(dataTitle)
			{
			var alt = dataTitle;
			if( dataAuthor)
				{
				alt += 'by '+dataAuthor; 
				}
			that.attr('alt', alt);
			unbound_cover_alts_added_from_dataN = unbound_cover_alts_added_from_dataN + 1;
			}
	else {
		that.attr('alt','Cover');
		unbound_cover_alts_missedN = unbound_cover_alts_missedN +1;
		}
	});
	LibraryThingConnector.info('attached '+unbound_cover_alts_addedN + ' alts to SU .unbound_cover');
	LibraryThingConnector.info('attached ' + unbound_cover_alts_added_from_dataN + ' alts from data- attrs to SU .unbound_cover');
	LibraryThingConnector.info('missed attaching ' + unbound_cover_alts_missedN + ' alts to SU .unbound_cover');

	// if we need to return focus after clicking See More
	if( typeof LibraryThingConnector.last_visible_cover_id !== 'undefined')
		{
		LibraryThingConnector.info('last visible cover id:' + LibraryThingConnector.last_visible_cover_id);
		LibraryThingConnector.utils.jQuery('[data-id="'+LibraryThingConnector.last_visible_cover_id+'"]').focus();
		}
	setTimeout(function() {
		LibraryThingConnector.utils.jQuery('#LT_LB_title').focus();
	},1000);
};

LibraryThingConnector.skipToNextRecsSection = function(clicked_el) {
	LibraryThingConnector.info('skipToNextSection');
	LibraryThingConnector.debug(clicked_el);
	var first_focusable_cover_in_next_section = LibraryThingConnector.utils.jQuery(clicked_el).parents('.unbound_rec_section').next('.unbound_rec_section').find('.unbound_cover,.unbound_authorrec_photo').first();
	LibraryThingConnector.info(first_focusable_cover_in_next_section);
	first_focusable_cover_in_next_section.focus();
};

LibraryThingConnector.handleViewMore = function (books_class) {
	LibraryThingConnector.debug('handle View More');
	LibraryThingConnector.last_visible_cover_id = null;
	if( books_class ) {
		LibraryThingConnector.debug('with books_class: ' + books_class);
		var books_area = LibraryThingConnector.utils.jQuery('.'+books_class);
		var viewmore_link = LibraryThingConnector.utils.jQuery('.unbound_viewmore_link.'+books_class);
		LibraryThingConnector.debug(books_area);

		// save the last visible book so we can return focus to it after this See More completes
	LibraryThingConnector.last_visible_cover_id =  LibraryThingConnector.utils.jQuery(books_area).find('[aria-hidden="true"]').first().prev().find('.unbound_cover').data('id');


		// fires the lazy image loader on css animation end.
		books_area.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
			setTimeout( function() {
				LibraryThingConnector.lazyload_data_images(books_class);
				LibraryThingConnector.unbound_check_seemores();
				setTimeout(function() {
					LibraryThingConnector.attachAccessibilityItems();
				},500);
			}, 100);

		});
		//viewmore_link.hide();
		var _hasClasses = {
			onerow : books_area.hasClass('unbound_books_onerow'),
			tworow : books_area.hasClass('unbound_books_tworow'),
			threerow : books_area.hasClass('unbound_books_threerow'),
			sixrow : books_area.hasClass('unbound_books_sixrow'),
			twelverow : books_area.hasClass('unbound_books_twelverow')
		}
		// books_area.addClass('unbound_books_threerows');
		if (_hasClasses.onerow) {
			books_area.removeClass('unbound_books_onerow');
			if ( _hasClasses.tworow || _hasClasses.threerow ||  _hasClasses.sixrow || _hasClasses.twelverow ) {}
			else {
				books_area.addClass('unbound_books_expander');
				viewmore_link.hide();
			}
		}
		else if (_hasClasses.tworow) {
			books_area.removeClass('unbound_books_tworow');
			if ( _hasClasses.threerow ||  _hasClasses.sixrow || _hasClasses.twelverow ) {}
			else {
				books_area.addClass('unbound_books_expander');
				viewmore_link.hide();
			}
		}
		else if (_hasClasses.threerow) {
			books_area.removeClass('unbound_books_threerow');
			if ( _hasClasses.sixrow || _hasClasses.twelverow ) {}
			else {
				books_area.addClass('unbound_books_expander');
				viewmore_link.hide();
			}
		}
		else if (_hasClasses.sixrow) {
			books_area.removeClass('unbound_books_sixrow');
			if ( _hasClasses.twelverow ) {}
			else {
				books_area.addClass('unbound_books_expander');
				viewmore_link.hide();
			}
		}
		else {
			books_area.addClass('unbound_books_expander');
			books_area.removeClass('unbound_books_twelverow');
			viewmore_link.hide();
		}

	}
	else
	{
		LibraryThingConnector.utils.jQuery('.unbound_viewmore_link').hide();
		LibraryThingConnector.utils.jQuery('.unbound_books').removeClass('unbound_books_threerows');
		LibraryThingConnector.utils.jQuery('.unbound_books').removeClass('unbound_books_onerow');
	}


	var stats_key = LibraryThingConnector.globals.enrichment_opened +'.viewmore';
	var data = {
		type:'viewmore_clicked'
	};
	data[stats_key] = 1;
	LibraryThingConnector.recordStats(data);
	return false;
};

LibraryThingConnector.getInsertNodeFull = function ()
	{
	LibraryThingConnector.debug('getInsertNodeFull');
	var el = null;
	if (LibraryThingConnector.backend && LibraryThingConnector.backend.getUnboundInsertNodeFull)
		{
		LibraryThingConnector.debug('unbound insertion into element from getUnboundInsertNodeFull');
		if ( LibraryThingConnector.containingEl )
			{
			LibraryThingConnector.info('insertion into containingEl');
			LibraryThingConnector.info(LibraryThingConnector.containingEl);
			el = LibraryThingConnector.backend.getUnboundInsertNodeFull(LibraryThingConnector.containingEl);
			}
		else
			{
			el = LibraryThingConnector.backend.getUnboundInsertNodeFull(document.body);
			}
		}
	else if (LibraryThingConnector.backend && LibraryThingConnector.backend.getInsertNodeFull) // fail back to insert node full if available
		{
		LibraryThingConnector.debug('unbound insertion into element from getInsertNodeFull');
		el = LibraryThingConnector.backend.getInsertNodeFull(document.body);
		}
	else // failover to body
		{
		LibraryThingConnector.debug('unbound insertion into element into body');
		el = document.body;
		}

	LibraryThingConnector.debug('insert node el');
	LibraryThingConnector.debug(el);
	return el;
	};

LibraryThingConnector.setMetadata = function (data, source)
	{
	if(typeof data === 'undefined' || data === null)
		{
		LibraryThingConnector.info('setMetadata: data object is null!');
		return;
		}
	LibraryThingConnector.debug('setting metadata from source: ' + source);
	LibraryThingConnector.debug(data);
	// add in current url to metadata
	if( typeof data['catalog_url'] === 'undefined' ) // can be set by lightbox
		{
		data['catalog_url'] = location.href;
		}
	LibraryThingConnector.metadata = data;
	LibraryThingConnector.metadataSource = source;

	if( LibraryThingConnector.metadata.first_isbn !== "undefined" )
		{
		LibraryThingConnector.isbn = LibraryThingConnector.metadata.first_isbn;
		}
	// set flag
	LibraryThingConnector.metadataExtractedB = true;

	LibraryThingConnector.dispatchMetadataLoadedEvent();
	};

LibraryThingConnector.dispatchContentLoadedEvent = function (type, content)
	{
	var data =
		{
			type: type,
			content: content
		};
	LibraryThingConnector.dispatchEvent('unboundContentLoaded',data);
	};

LibraryThingConnector.dispatchMetadataLoadedEvent = function ()
	{
	var data ={
			'metadata': LibraryThingConnector.metadata,
			'metadataSource': LibraryThingConnector.metadataSource
	};
	LibraryThingConnector.dispatchEvent('metadataLoadedEvent',data);
	};

LibraryThingConnector.getMetadata = function (type)
	{
	LibraryThingConnector.debug('getting metadata for type: ' + type);
	var _data = null;
	if (LibraryThingConnector.metadata && LibraryThingConnector.metadata[type])
		{
		_data = LibraryThingConnector.metadata[type];
		}
	else if(!type)
		{
		_data = LibraryThingConnector.metadata;
		}
	LibraryThingConnector.debug('final metadata returned');
	LibraryThingConnector.debug(_data);
	return _data;
	};

LibraryThingConnector.getMetadataFromCoins = function (someNode)
	{
	if (!someNode)
		{
		return null;
		}
	LibraryThingConnector.debug('trying to load metadata from coins');
	var data = LibraryThingConnector.utils.extractCoins(someNode);
	var metadata = {};
	if (data)
		{
		LibraryThingConnector.debug('metadata found in coins');
		LibraryThingConnector.debug(data);
		var coinsMap = {
			'rft.btitle': 'title',
			'rft.isbn': 'isbns',
			'rft.au': 'author'
		};
		LibraryThingConnector.utils.jQuery.each(coinsMap, function (key, val)
			{
			LibraryThingConnector.debug(key);
			LibraryThingConnector.debug(val);
			metadata[val] = data[key];
			}
		)
		}
	if (metadata)
		{
		LibraryThingConnector.debug('final metadata from coins');
		LibraryThingConnector.debug(metadata);
		}

	return metadata;
	};

LibraryThingConnector.getContainerWidths = function ()
	{
	return LibraryThingConnector.getMetadata('container_widths');
	};

LibraryThingConnector.getTitle = function ()
	{
	return LibraryThingConnector.getMetadata('title');
	};

LibraryThingConnector.getAuthor = function ()
	{
	return LibraryThingConnector.getMetadata('author');
	};

LibraryThingConnector.getISBN = function ()
	{
	return LibraryThingConnector.getMetadata('isbns');
	};

LibraryThingConnector.getWidgetsSuccess = function (data, textStatus, jqxhr)
	{
	LibraryThingConnector.debug('get widgets success');
	LibraryThingConnector.debug(textStatus);
	};

LibraryThingConnector.getWidgetsFailure = function (jqxhr, settings, exception) {
	LibraryThingConnector.error('get widgets failure');
	LibraryThingConnector.error(exception);
	LibraryThingConnector.errors.push(LibraryThingConnector.error_types.WidgetsLTFailed);
};

LibraryThingConnector.getSyndeticsWidgetsFailure = function (jqxhr, settings, exception) {
		LibraryThingConnector.error('get syndetics widgets failure');
		LibraryThingConnector.error(exception);
		LibraryThingConnector.errors.push(LibraryThingConnector.error_types.WidgetsPQFailed);
	};

LibraryThingConnector.dispatchLTFLWidgetsLoaded = function ()
	{
	LibraryThingConnector.debug('dispatching ltfl widgets loaded event');
	LibraryThingConnector.dispatchEvent('LTFLWidgetsLoadedEvent');
	LibraryThingConnector.LTFLWidgetsLoadedB = true;
	if( LibraryThingConnector.backend.name === 'iguana' ) // on iguana SU events are not propagating
		{
		LibraryThingConnector.handleLTFLWidgetsLoaded();
		}
	};


LibraryThingConnector.dispatchSyndeticsWidgetsLoaded = function ()
	{
	LibraryThingConnector.debug('dispatching syndetics widgets loaded event');
	LibraryThingConnector.dispatchEvent('SyndeticsWidgetsLoadedEvent');
	LibraryThingConnector.SyndeticsWidgetsLoadedB = true;
		if( LibraryThingConnector.backend.name === 'iguana' )// on iguana SU events are not propagating
			{
			LibraryThingConnector.handleSyndeticsWidgetsLoaded();
			}
	};

LibraryThingConnector.addEventListeners = function ()
	{
	// catch ltfl and syndetics widgets loaded events
	LibraryThingConnector.utils.jQuery(document).on("SyndeticsWidgetsLoadedEvent", LibraryThingConnector.handleSyndeticsWidgetsLoaded);
	LibraryThingConnector.utils.jQuery(document).on("LTFLWidgetsLoadedEvent", LibraryThingConnector.handleLTFLWidgetsLoaded);

	LibraryThingConnector.debug('attaching nav scroll jump event listeners');
	LibraryThingConnector.attachScrollJumps();
	};

LibraryThingConnector.requestSyndeticsAPI = function ()
	{
	LibraryThingConnector.debug('requestSyndeticsAPI');
	var isbn_identifiers = LibraryThingConnector.getIdentifiers('isbn');
	var isbns = isbn_identifiers.join(',');
	var upc_identifiers = LibraryThingConnector.getIdentifiers('upc');
	var upcs = upc_identifiers.join(',');
	var issn_identifiers = LibraryThingConnector.getIdentifiers('issn');
	var issns = issn_identifiers.join(',');
	LibraryThingConnector.debug('sending '+isbn_identifiers.length + ' isbn identifiers to syndetics hover api:');
	LibraryThingConnector.debug(isbns);
	LibraryThingConnector.debug('sending '+ upc_identifiers.length + ' upc identifiers to syndetics hover api:');
	LibraryThingConnector.debug(upcs);
	LibraryThingConnector.debug('sending '+issn_identifiers.length+ ' issn identifiers to syndetics hover api:');
	LibraryThingConnector.debug(issns);

	LibraryThingConnector.timing.hover.api.pq.start = new Date().getTime();
	var unbound_hover_api_url = LibraryThingConnector.SYNDETICS_DOMAIN+'/unbound_hover.php';
	LibraryThingConnector.utils.jQuery.ajax({
		url: unbound_hover_api_url,
		jsonp:'callback',
		dataType:'jsonp',
		method: 'POST',
		data:{
			isbns:isbns,
			upcs:upcs,
			issns:issns,
			a_id:LibraryThingConnector.a_id
		},
		success: LibraryThingConnector.handleSyndeticsHoverAPI,
		error: LibraryThingConnector.handleSyndeticsHoverAPIFailure
	});

	};

LibraryThingConnector.handleReviewOpened = function()
	{
	var data = {
		type:'patronreviews_writereview_opened'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleReviewClosed = function()
	{
	var data = {
		type:'patronreviews_writereview_closed'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleReviewSubmitted = function()
	{
	var data = {
		type:'patronreviews_review_submitted'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleReviewRatingSubmitted = function()
	{
	var data = {
		type:'patronreviews_review_ratingsubmitted'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleReviewTwitterSignIn = function()
	{
	var data = {
		type:'patronreviews_twitter_signin'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleReviewFBSignIn = function()
	{
	var data = {
		type:'patronreviews_fb_signin'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleReviewTwitterSignUp = function()
	{
	var data = {
		type:'patronreviews_twitter_signup'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleReviewFBSignUp = function()
	{
	var data = {
		type:'patronreviews_fb_signup'
	};
	LibraryThingConnector.recordStats(data);

	};
LibraryThingConnector.handleReviewAtMyLibrarySignUp = function()
	{
	var data = {
		type:'patronreviews_atmylibrary_signup'
	};
	LibraryThingConnector.recordStats(data);

	};

LibraryThingConnector.handleReadingLevelAcceleratedSearch = function()
	{
	var data = {
		type:'readinglevel_accelerated_searched'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleReadingLevelAgeGradeSearch = function()
	{
	var data = {
		type:'readinglevel_agegrade_searched'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleReadingLevelLexileSearch = function()
	{
	var data = {
		type:'readinglevel_lexile_searched'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleReadingLevelLexileClicked = function()
	{
	var data = {
		type:'readinglevel_lexile_clicked'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleReadingLevelSubjectClicked = function()
	{
	var data = {
		type:'readinglevel_subject_clicked'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.linkToLibrarianPower = function(ev) {
	LibraryThingConnector.info('linkToLibrarianPower');
	if( typeof libpow_outsideoflightboxB === 'function')
		{
		if( libpow_outsideoflightboxB() )
			{
			LibraryThingConnector.info('linkToLibrarianPower: outside of lightbox');
			LibraryThingConnector.context = 'librarianpower';
			}
		}
	LibraryThingConnector.linkToCatalog(ev);
};

LibraryThingConnector.openLibrarianPowerLightbox = function() {
	LibraryThingConnector.info('open lists lightbox');
	LibraryThingConnector.recordLightboxOpenedStat('lists');

	var params = LibraryThingConnector.getParams();
	params['workcode'] = LibraryThingConnector.workcode;

	var _lightbox_params = {
		'title': 'Librarian Recommends'
	};

	if( LibraryThingConnector.context == 'main') // in catalog
		{
		LibraryThingConnector.info('loading Lists at ' + LibraryThingConnector.LIBRARIAN_POWER_DOMAIN);
		var url = LibraryThingConnector.LIBRARIAN_POWER_DOMAIN + 'lp/'+LibraryThingConnector.a_id+'.'+LibraryThingConnector.i_id+'/main?';
		url += LibraryThingConnector.utils.jQuery.param(params);
		LibraryThingConnector.info('final lists lightbox url: ' + url);
		LibraryThingConnector.openLightbox(url, _lightbox_params);
		}
	else if( typeof libpowpage !== 'undefined' && typeof libpowpage['a_id'] !== 'undefined')// within lightbox
		{
		LibraryThingConnector.info('moving to LP from within SU lightbox');
		LibraryThingConnector.info('loading Lists at ' + LibraryThingConnector.LIBRARIAN_POWER_DOMAIN);
		location.href = LibraryThingConnector.LIBRARIAN_POWER_DOMAIN + 'lp/'+LibraryThingConnector.a_id+'/login';
		}
};

LibraryThingConnector.attachSUIconHandler = function() {
	var footer = LibraryThingConnector.utils.jQuery('.unbound_mega_footer');
	footer.bind('click',LibraryThingConnector.openLibrarianPowerLightbox);
	footer.addClass('su_librarianpower_open');
};

LibraryThingConnector.attachLibrarianPowerHandlers = function (fromLDW) {
	if( typeof fromLDW === 'undefined' )
		{
		fromLDW = 0;
		}
	LibraryThingConnector.info('attaching lists handler');
	if( LibraryThingConnector.context != 'lightbox')
		{
		LibraryThingConnector.attachSUIconHandler();
		}

	LibraryThingConnector.utils.jQuery('.librarianpower_link').bind('click',LibraryThingConnector.linkToLibrarianPower);

	window.addEventListener('message', function (e) {
		var data = e.data;
		LibraryThingConnector.info(data);
		if (typeof data.type == 'undefined')
			{
			return;
			}
		if (data.type != 'lp_lightbox_open')
			{
			return;
			}
	LibraryThingConnector.lb_librarianpower_list(data.workid, data.listid,data.lslw_id);
	});
};

LibraryThingConnector.attachBookProfileHandlers = function()
	{
	LibraryThingConnector.utils.jQuery('.unbound_profile_tag_link a').click(LibraryThingConnector.handleBookProfileLink);
	LibraryThingConnector.utils.jQuery('#bookprofile_search_form').submit(LibraryThingConnector.handleBookProfileSearch);
	};

LibraryThingConnector.handleBookProfileSearch = function(ev)
	{
	var data = {
		type:'bookprofile_search'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleUnboundDivShown = function(ev)
	{
	LibraryThingConnector.info('handleUnboundDivShown');

	};

LibraryThingConnector.handleBookProfileLink = function(ev)
	{
	var data = {
		type:'bookprofile_link_clicked'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.attachLookInsideBrowserHandlers = function(ev)
	{
	LibraryThingConnector.utils.jQuery('.unbound_lookinside_nav_item').click(LibraryThingConnector.handleLookInsideNavClick);
	};

LibraryThingConnector.handleLookInsideNavClick = function(ev)
	{
	var data = {
		type:'lookinside_nav_click'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.attachAwardsBrowserHandlers = function(ev)
	{
	LibraryThingConnector.utils.jQuery('.unbound_awards_seeall').click(LibraryThingConnector.handleSeeAllAwards);
	LibraryThingConnector.utils.jQuery('.unbound_awards_link').click(LibraryThingConnector.handleSeeAward);
	};

LibraryThingConnector.handleSeeAward = function(ev)
	{
	var data = {
		type:'awards_award_clicked'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleSeeAllAwards = function(ev)
	{
	var data = {
		type:'awards_seeall_clicked'
	};
	LibraryThingConnector.recordStats(data);
	};
LibraryThingConnector.attachTagBrowseHandlers = function()
	{
	LibraryThingConnector.debug('attachTagBrowseHandlers');

	var unbound_tag_toggle = LibraryThingConnector.utils.jQuery('.unbound_tag_toggle');
	if( unbound_tag_toggle.length )
		{
		LibraryThingConnector.utils.jQuery(unbound_tag_toggle).click(LibraryThingConnector.handleTagBrowse);
		}
	LibraryThingConnector.utils.jQuery('#tag_search_form').submit(LibraryThingConnector.handleTagSearch);

	};
LibraryThingConnector.handleTagBrowse = function()
	{
	LibraryThingConnector.debug('handleTagBrowse');

	var data = {
		type:'tag_browsed'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleTagSearch = function()
	{
	LibraryThingConnector.debug('handleTagSearch');

	var data = {
		type:'tag_searched'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleShelfClickBook = function(ev)
	{
	LibraryThingConnector.debug('handleShelfClickBook');
	LibraryThingConnector.debug(ev, 10);

	var data = {
		type:'shelf_book_clicked'
	};
	LibraryThingConnector.recordStats(data);

	};

LibraryThingConnector.handleShelfNextPrev = function()
	{
	LibraryThingConnector.debug('handleShelfNextPrev');

	var data = {
		type:'shelf_arrow_clicked'
	};
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.attachLightboxHandler = function (unbound_element)
	{
	// stats on opening lightboxes
	var unbound_lightbox = LibraryThingConnector.utils.jQuery('.unbound_lightbox', unbound_element);
	LibraryThingConnector.debug('attachLightboxHandler');
	LibraryThingConnector.debug(unbound_element);
	// unbind first in case it's already been set
	var onclick_handler = unbound_lightbox.prop('onclick');
	LibraryThingConnector.debug('.unbound_lightbox ('+unbound_element+') has handler: ');
	LibraryThingConnector.debug(onclick_handler);
	if( onclick_handler )
		{
		unbound_lightbox.unbind('click', onclick_handler, unbound_element);
		}
	unbound_lightbox.click(LibraryThingConnector.handleLightboxOpened );
	};

LibraryThingConnector.handleSyndeticsWidgetsLoaded = function(e)
	{
	LibraryThingConnector.debug('handleSyndeticsWidgetsLoaded');
	LibraryThingConnector.debug(e);

	LibraryThingConnector.requestSyndeticsAPI();

	LibraryThingConnector.insertAuthorImage();

	// record stats
	var endTime = new Date().getTime();
	var totalTime = endTime - LibraryThingConnector.timing.widgets.pq.start;
	LibraryThingConnector.timing.widgets.pq.total = totalTime;
	LibraryThingConnector.timing.widgets.pq.end = endTime;
	LibraryThingConnector.stats.timing = LibraryThingConnector.timing;
	LibraryThingConnector.statsRecordLPQ = true;
	LibraryThingConnector.PQWidgetsLoadedB = true;
	LibraryThingConnector.recordPageStats();

	};

LibraryThingConnector.handleLTAuthorImageAPI = function(data)
	{
	LibraryThingConnector.debug('lt author image api finished');
	LibraryThingConnector.debug(data);
	if ( data && data.author_img_url )
		{
		LibraryThingConnector.author_img_url = data.author_img_url;
		LibraryThingConnector.insertAuthorImage();
		}
	};

LibraryThingConnector.requestLTAuthorImage = function (isbn)
	{
	LibraryThingConnector.debug('requestLTAuthorImage');

	var lt_author_api_url = LibraryThingConnector.BASE_URL + '/api_author_image.php';
	var syndetics_author_name = LibraryThingConnector.utils.jQuery('.unbound_author_name').text();

	LibraryThingConnector.utils.jQuery.ajax({
		url: lt_author_api_url,
		jsonp:'callback',
		dataType:'jsonp',
		method: 'POST',
		data:{
			isbn:isbn,
			syndetics_author_name:syndetics_author_name
		},
		success: LibraryThingConnector.handleLTAuthorImageAPI,
		error: LibraryThingConnector.handleLTAuthorAPIFailure
	});
	};

LibraryThingConnector.getSyndeticsAuthorName = function()
	{
	LibraryThingConnector.info('getSyndeticsAuthorName');
	var syndetics_author_name = LibraryThingConnector.utils.jQuery('.unbound_author_name',LibraryThingConnector.getMegaDivEl()).text();
	syndetics_author_name = LibraryThingConnector.utils.stripHTML(syndetics_author_name);

	return syndetics_author_name;
	};

LibraryThingConnector.checkAuthorNames = function()
	{
	var authorNamesMatchB = false;
	LibraryThingConnector.info('LT author names:' + LibraryThingConnector.author_nameA );
	if ( typeof LibraryThingConnector.author_nameA == 'object' && LibraryThingConnector.author_nameA && LibraryThingConnector.author_nameA.length)
		{
		LibraryThingConnector.debug('checking author names for mismatch');
		var syndetics_author_name = null;
		if( typeof LibraryThingConnector.backend.getSyndeticsAuthorName !== 'undefined' )
			{
			LibraryThingConnector.debug('using backend getSyndeticsAuthorName');
			syndetics_author_name = LibraryThingConnector.backend.getSyndeticsAuthorName();
			}
		else
			{
			syndetics_author_name = LibraryThingConnector.getSyndeticsAuthorName();
			}
		LibraryThingConnector.debug('syndetics_author_name: ' + syndetics_author_name);

		LibraryThingConnector.utils.jQuery(LibraryThingConnector.author_nameA).each(function (i, n)
		{
		if ( typeof n == 'string' && syndetics_author_name && syndetics_author_name.toLowerCase().replace(/ /g,'') == n.toLowerCase().replace(/ /g,''))
			{
			authorNamesMatchB = true;
			return false; // end the check
			}
		});
		}
	if( authorNamesMatchB )
		{
		LibraryThingConnector.info('author names matched');
		}
	else
		{
		LibraryThingConnector.info('author names mis-matched');
		}

	return authorNamesMatchB;
	};

LibraryThingConnector.insertAuthorImage = function()
	{
		if (typeof LibraryThingConnector.LTauthorlightboxB !== 'undefined' && LibraryThingConnector.LTauthorlightboxB)
			{
			return false;
			}
	LibraryThingConnector.info('insertAuthorImage');
	var query_hash = LibraryThingConnector.utils.parse_queries();
	// for determine stats type
	var isbn_from_url = query_hash['isbn'];

	// Fallbacks in case these aren't set by some legacy code.
	LibraryThingConnector.author_img_url_2x = LibraryThingConnector.author_img_url_2x || LibraryThingConnector.author_img_url;
	LibraryThingConnector.author_img_url_3x = LibraryThingConnector.author_img_url_3x || LibraryThingConnector.author_img_url;

	var authorNamesMatchB = LibraryThingConnector.checkAuthorNames();
	if( !authorNamesMatchB && typeof LibraryThingConnector.author_nameA !== 'undefined')
		{
		// change img to default author photo
		LibraryThingConnector.info('author names mismatched');
		LibraryThingConnector.info(LibraryThingConnector.author_nameA);
		if( typeof LibraryThingConnector.default_author_img_url !== 'undefined')
			{
			LibraryThingConnector.info('showing default author image');
			LibraryThingConnector.utils.jQuery('.unbound_author_photo_image',LibraryThingConnector.containingEl).not('.unbound_loaded').addClass('unbound_default_photo').attr('src',LibraryThingConnector.default_author_img_url);
			}
		return false;
		}
	// author image
	if( LibraryThingConnector.context == 'lightbox' )
		{
		if( typeof LibraryThingConnector.author_img_url !== "undefined") // already set by LT widgets code or by requestLTAuthorImage()
			{
			LibraryThingConnector.debug('updating author image from author_img_url to : ' + LibraryThingConnector.author_img_url);
			LibraryThingConnector.utils.jQuery('.unbound_author_photo',LibraryThingConnector.getMegaDivEl()).not('.unbound_loaded').find('img').attr({
				'src' : LibraryThingConnector.author_img_url,
				'alt': 'Author photo',
				'srcset' : LibraryThingConnector.author_img_url_2x + ' 2x, '+ LibraryThingConnector.author_img_url_3x +' 3x'
			}).fadeIn();
			}
		else if (LibraryThingConnector.isbn ) // will run if LT has not yet loaded at the time it's called
			{
			LibraryThingConnector.debug('requesting author img from author image api using isbn: ' + LibraryThingConnector.isbn);
			LibraryThingConnector.requestLTAuthorImage(LibraryThingConnector.isbn);
			}
		else if ( isbn_from_url)
			{
			LibraryThingConnector.debug('requesting author img from author image api using isbn from url: ' + isbn_from_url);
			LibraryThingConnector.requestLTAuthorImage(isbn_from_url);
			}
		else
			{
			LibraryThingConnector.debug('no author photo, hiding img');
			LibraryThingConnector.utils.jQuery('.unbound_author_photo',LibraryThingConnector.getMegaDivEl()).not('.unbound_loaded').find('img').attr('src','').hide();
			}
		}
	else // in-catalog only ever use the author img from javascript variable set by LT widgets
		{
		if (typeof LibraryThingConnector.author_img_url !== "undefined") // already set by LT widgets code or by requestLTAuthorImage()
			{
			LibraryThingConnector.debug('updating author image from author_img_url to : ' + LibraryThingConnector.author_img_url);
			if( typeof LibraryThingConnector.backend.setSyndeticsAuthorImage !== 'undefined' )
				{
				LibraryThingConnector.info('using backends setSyndeticsAuthorImage');
				LibraryThingConnector.backend.setSyndeticsAuthorImage({
					'src' : LibraryThingConnector.author_img_url,
					'alt': 'Author photo',
					'srcset' : LibraryThingConnector.author_img_url_2x + ' 2x, '+ LibraryThingConnector.author_img_url_3x +' 3x'
				},LibraryThingConnector.author_img_words);
				}
			else
				{
				LibraryThingConnector.utils.jQuery('.unbound_author_photo',LibraryThingConnector.getMegaDivEl()).not('.unbound_loaded').find('img').attr({
					'alt':'Author photo',
					'src' : LibraryThingConnector.author_img_url,
					'srcset' : LibraryThingConnector.author_img_url_2x + ' 2x, '+ LibraryThingConnector.author_img_url_3x +' 3x'
				}).fadeIn();
				LibraryThingConnector.utils.jQuery('.unbound_author_photo_image', LibraryThingConnector.getMegaDivEl()).removeClass('.unbound_default_photo').addClass('unbound_loaded');
				LibraryThingConnector.utils.jQuery('.unbound_author_photo_attrib').html(LibraryThingConnector.author_img_words);
				}
			}
		if (typeof LibraryThingConnector.defaultimage !== "undefined") // already set by LT widgets code or by requestLTAuthorImage()
			{
			if( LibraryThingConnector.defaultimage )
				{
				LibraryThingConnector.utils.jQuery('.unbound_author_photo_image').not('.unbound_loaded').addClass('unbound_default_photo');
				}
			}
		}
	};

LibraryThingConnector.copyright_info = function()
	{
	LibraryThingConnector.utils.jQuery("a.unbound_lightbox.author").click();
	}

LibraryThingConnector.recordSearchPageStats = function(data, callback)
	{
	LibraryThingConnector.info('recordSearchPageStats');
	LibraryThingConnector.info(LibraryThingConnector.stats);

	if( LibraryThingConnector.searchStatsRecordedB)
		{
		LibraryThingConnector.info('page Stats already recorded, not recording again');
		return;
		}
	if( LibraryThingConnector.searchStatsRecordLPQ && LibraryThingConnector.searchStatsRecordLTB)
		{
		LibraryThingConnector.info('both LT and PQ widgets stats recorded, pinging stats url with stats');
		LibraryThingConnector.dispatchEvent('unboundSearchDivLoaded');
		// custom unboundLoaded function?
		if( typeof unboundSearchDivLoaded !== 'undefined' && typeof unboundSearchDivLoaded == 'function' )
			{
			LibraryThingConnector.info('found unboundSearchDivLoaded function, running');
			unboundSearchDivLoaded();
			}
		LibraryThingConnector.handleUnboundSearchDivLoaded();
		if ( typeof LibraryThingConnector.backend.unboundSearchDivLoaded !== 'undefined' )
			{
			LibraryThingConnector.info('running LibraryThingConnector.backend.unboundSearchDivLoaded hook');
			LibraryThingConnector.backend.unboundSearchDivLoaded();
			}
		// record searchdiv page load stat
		LibraryThingConnector.stats['type'] = 'search_page_load';
		LibraryThingConnector.stats['searchresults_enhanced_count'] = LibraryThingConnector.utils.jQuery('.unbound_searchresult:visible:not(.unbound_searchresults_stat_recorded)').length;

		// record per-enrichment searchdiv stats
		LibraryThingConnector.utils.jQuery('.unbound_searchresult:visible:not(.unbound_searchresult_stat_recorded)').each(function(i,n) {
			LibraryThingConnector.info(n);
			LibraryThingConnector.utils.jQuery(n).addClass('unbound_searchresult_stat_recorded');
			var id = LibraryThingConnector.utils.jQuery(n).data('id');
			var unbound_searchresult_id = LibraryThingConnector.extractIdentifierFromIdString(id);
			LibraryThingConnector.stats[unbound_searchresult_id] = {};
			LibraryThingConnector.utils.jQuery(n).find('.su_sd_title:visible').each(function(j,m) {
				LibraryThingConnector.info(m);
				var enrichment_type = LibraryThingConnector.utils.jQuery(m).data('unbound-enrichmenttype');
				LibraryThingConnector.stats[unbound_searchresult_id][enrichment_type] = {
					'present' : 1,
				};
			}); // each .su_sd_title:visible

			LibraryThingConnector.logToDebugPanel('unbound_debug_run_table', unbound_searchresult_id,LibraryThingConnector.utils.serialize(LibraryThingConnector.stats[unbound_searchresult_id]) );

		});// each .unbound_searchresult:visible
		LibraryThingConnector.attachAccessibilityItems();
		// record total time taken from init to now
		endTime = new Date().getTime();
		LibraryThingConnector.timing.loads.total = endTime - LibraryThingConnector.timing.init.start;
		// wait a second or two to allow hover timing data to be recorded
		setTimeout(function ()
		{
		LibraryThingConnector.recordStats(LibraryThingConnector.stats);
		LibraryThingConnector.pageStatsRecordedB = true;
		if( typeof LibraryThingConnector.backend.statsRecorded !== 'undefined' )
			{
			LibraryThingConnector.info('connector: stats recorded');
			LibraryThingConnector.backend.statsRecorded();
			}
		},1500);
		try {
			LibraryThingConnector.logDebugPanel();
		} catch (e)
			{
			LibraryThingConnector.info(e);
			}
		}
	else
		{
		LibraryThingConnector.debug('have not received search page stats yet from both LT and PQ: ' + LibraryThingConnector.searchStatsRecordLPQ + ' ' + LibraryThingConnector.statsRecordLTB);
		}
	};

LibraryThingConnector.recordStats = function(data, callback)
	{
	data['stats_id'] = LibraryThingConnector.su_session;
		if( typeof LibraryThingConnector.backend.recordStats !== 'undefined' )
			{
			LibraryThingConnector.info('calling backend recordStats');
			LibraryThingConnector.backend.recordStats(data);
			}
	if ( callback )
		{
		LibraryThingConnector.debug('custom callback');
		LibraryThingConnector.debug(callback);
		}
	else
		{
		callback = function (data, textStatus, jqXHR)
			{
			LibraryThingConnector.debug('recordPageStats API finished');
			LibraryThingConnector.debug(data);
			};
		}
	var url = LibraryThingConnector.STATS_URL;
	LibraryThingConnector.debug('recordStats to url:'+ url);
	var metadata = LibraryThingConnector.getMetadata();
	LibraryThingConnector.debug('metadata for stats:');
	LibraryThingConnector.debug(metadata);
	var catalog_metadata = {};
	var stats_data = {};
	if( LibraryThingConnector.pagetype == 'full' )
		{
		if (metadata !== null && typeof metadata !== 'undefined' )
			{
			var catalog_metadata_keysA = ['isbns','upcs','issns','title','author','catalog_url'];
			LibraryThingConnector.utils.jQuery(catalog_metadata_keysA).each(function(i,key) {
			if (typeof metadata[key] !== 'undefined')
				{
				if ( key == 'catalog_url')
					{
					catalog_metadata[key] = decodeURIComponent(metadata[key]);
					}
				else
					{
					catalog_metadata[key] = metadata[key];
					}
				}
			});
			LibraryThingConnector.debug('catalog_metadata for stats');
			LibraryThingConnector.debug(catalog_metadata);
			}
		stats_data = {
			a_id: LibraryThingConnector.a_id,
			i_id: LibraryThingConnector.i_id,
			data:LibraryThingConnector.utils.serialize(data),
			catalog_metadata:LibraryThingConnector.utils.serialize(catalog_metadata)
		};
		}
	else
		{
		var searchresults = LibraryThingConnector.isbn_identifiers['searchresults'];
		stats_data = {
			a_id: LibraryThingConnector.a_id,
			i_id: LibraryThingConnector.i_id,
			data:LibraryThingConnector.utils.serialize(data),
			catalog_metadata:LibraryThingConnector.utils.serialize(searchresults)
		};
		}
	LibraryThingConnector.debug('stats data');
	LibraryThingConnector.debug(stats_data);
	LibraryThingConnector.utils.jQuery.ajax({
		url: url,
		jsonp:'callback',
		dataType:'jsonp',
		method: 'POST',
		data: stats_data,
		success: callback,
		error: LibraryThingConnector.handleStatsFailure
	});
	var d = new Date();
	var timestring = d.getHours() +':' + d.getMinutes();
	try {
		LibraryThingConnector.logToDebugPanel('unbound_debug_stats_table', timestring, data['type']);
	} catch(e) {
		LibraryThingConnector.info(e);
	}
	};

LibraryThingConnector.handleUnboundSearchDivLoaded = function() {
	LibraryThingConnector.info('handleUnboundSearchDivLoaded');
	// set borders for pipes on visible searchdiv elements
	LibraryThingConnector.utils.jQuery('.unbound_searchresult').find('.su_sd_title:visible:not(:last)').css('border-right','1px solid #e6eaec');

	};







LibraryThingConnector.handleUnboundLoaded = function() {
	// set translation strings post hoc
	if(typeof LibraryThingConnector.catalog_language_code !== 'undefined' && LibraryThingConnector.catalog_language_code !== 'eng' )
		{
		LibraryThingConnector.sub_in_translationstringsA();
		}
	// allow primo backend_translationstringsA to be used in eng environments
	if ( LibraryThingConnector.backend.name == 'primo')
		{
		LibraryThingConnector.sub_in_translationstringsA();
		}
	LibraryThingConnector.attachShowHideList('.unbound_list_link');

	LibraryThingConnector.info('handleUnboundLoaded');

	var patronreviews_count = 0;
	if( typeof LibraryThingConnector.stats['unbound_patronreviews_content'] !== 'undefined' )
		{
		patronreviews_count = LibraryThingConnector.stats['unbound_patronreviews_content'].count;
		}
	var current_megadiv_el = LibraryThingConnector.getMegaDivEl();
	LibraryThingConnector.debug('patronreviews count: ' + patronreviews_count);
	var enrichments_count = LibraryThingConnector.stats.enrichments_count;
	LibraryThingConnector.debug('enrichments count: ' + enrichments_count);
	if( patronreviews_count == 0 && enrichments_count == 1)
		{
		// only run this for these libs
		var noreviews_libAA = {
			73: 1 // queensland
		};
		var noreviews_backendAA = {
			'primo' : 1,
		}
		if( typeof noreviews_libAA[LibraryThingConnector.a_id] !== 'undefined' || typeof noreviews_backendAA[LibraryThingConnector.backend.name] !== 'undefined')
			{
			LibraryThingConnector.info('no reviews found, only reviews showing, hiding patron reviews enrichment');
			LibraryThingConnector.utils.jQuery('.unbound_patronreviews',current_megadiv_el).addClass('unbound_hide');
			// update enrichments_shown
			var idx = LibraryThingConnector.stats.enrichments_shown.indexOf('patronreviews');
			delete LibraryThingConnector.stats.enrichments_shown[idx];
			// and enrichments_count
			LibraryThingConnector.stats.enrichments_count -= 1;
			}
		}
	// if configured to not allow writing reviews, and no reviews are shown, hide the headers
	if( patronreviews_count == 0 && LibraryThingConnector.config.enrichmentsA.reviews.reviewswriteB == 0)
		{
		LibraryThingConnector.info('no patron reviews and reviewwriteB is 0, hiding patronreviews');
		LibraryThingConnector.utils.jQuery('.unbound_patronreviews',current_megadiv_el).addClass('unbound_hide');
		// hide the patron reviews nav item, too
		LibraryThingConnector.utils.jQuery('.unbound_nav_item_patronreviews', current_megadiv_el).hide();
		}
	// for ebc show SU logo if enrichments shown
	if ( LibraryThingConnector.backend.name == 'ebookcentral')
		{
		if ( LibraryThingConnector.utils.jQuery('.unbound_element:visible').length > 0)
			{
			LibraryThingConnector.info('showing logo');
			LibraryThingConnector.utils.jQuery('.unbound_suby').show();
			}
		else
			{
			LibraryThingConnector.info('enrichments_count is 0, hiding logo');
			}
		}

	// check if we should hide #unbound_ebook_alert if no enrichmnets
	if( LibraryThingConnector.stats.enrichments_count == 0 )
		{
		LibraryThingConnector.info('no enrichments: hiding unbound_ebook_alert')
		LibraryThingConnector.utils.jQuery('#unbound_ebook_alert').hide();
		}
//	LibraryThingConnector.attachScrollHandler();
// 	LibraryThingConnector.attachBeforeUnLoadHandler();
	LibraryThingConnector.attachHashChangeHandler();
	LibraryThingConnector.attachLibrarianPowerHandlers();

	try {
		LibraryThingConnector.logDebugPanel();
	} catch(e) {
		LibraryThingConnector.info(e);
	}
	};

LibraryThingConnector.runRecordPageStatsLoadedHooks = function(su_session) {
	LibraryThingConnector.info('runRecordPageStatsLoadedHooks');
	LibraryThingConnector.info(LibraryThingConnector.enrichmentsShown(su_session));
	// hooks into SU being loaded
	//fire event that unbound has loaded
	LibraryThingConnector.dispatchEvent('unboundLoaded');

	if (typeof LibraryThingConnector.backend.unboundLoaded !== 'undefined')
		{
		LibraryThingConnector.info('running LibraryThingConnector.backend.unboundLoaded hook');
		LibraryThingConnector.backend.unboundLoaded(su_session);
		}
	// custom unboundLoaded function?
	if (typeof unboundLoaded !== 'undefined' && typeof unboundLoaded == 'function')
		{
		LibraryThingConnector.info('found unboundLoaded function, running');
		unboundLoaded(LibraryThingConnector.su_session);

		}
	LibraryThingConnector.handleUnboundLoaded();
	LibraryThingConnector.backend.handlingContentChangedB = false;

	var numberOfEnhancementsShown = LibraryThingConnector.numberOfEnhancementsShown(su_session);
	if (numberOfEnhancementsShown > 0 && LibraryThingConnector.config.settingsA.advancedA.JSsuccess)
		{
		LibraryThingConnector.info('running JSsuccess: ' + LibraryThingConnector.config.settingsA.advancedA.JSsuccess);
		eval(LibraryThingConnector.config.settingsA.advancedA.JSsuccess);
		}
	else
		if (numberOfEnhancementsShown == 0 && LibraryThingConnector.config.settingsA.advancedA.JSfailure)
			{
			LibraryThingConnector.info('running JSfailure');
			eval(LibraryThingConnector.config.settingsA.advancedA.JSfailure);
			}
	// check for and run enrichment-specific callbacks
	var enrichmentsShown = LibraryThingConnector.enrichmentsShown(su_session);
	var allEnrichments = LibraryThingConnector.allEnrichments();
	LibraryThingConnector.utils.jQuery.each(allEnrichments, function (i, enrichment_type) {
		// if has content
		if (enrichmentsShown && enrichmentsShown.indexOf(enrichment_type) >= 0)
			{
			// like unboundSimilarSuccess
			var enrichment_success_callback = 'unbound_' + enrichment_type + '_success';
			if (typeof window[enrichment_success_callback] !== 'undefined' && typeof window[enrichment_success_callback] == 'function')
				{
				LibraryThingConnector.info('found enrichment success callback: ' + enrichment_success_callback + ' defined, calling it');
				window[enrichment_success_callback]();
				}
			}
		else
			{
			// like unboundSimilarFailure
			var enrichment_failure_callback = 'unbound_' + enrichment_type + '_failure';
			if (typeof window[enrichment_failure_callback] !== 'undefined' && typeof window[enrichment_failure_callback] == 'function')
				{
				LibraryThingConnector.info('found enrichment failure callback: ' + enrichment_failure_callback + ' defined, calling it');
				window[enrichment_failure_callback]();
				}
			}
	});
};

LibraryThingConnector.recordPageStats = function () {
	LibraryThingConnector.info('recordPageStats');
	LibraryThingConnector.info(LibraryThingConnector.stats);
	try {
		LibraryThingConnector.logDebugPanelMetadata();
	} catch(e) {
		LibraryThingConnector.info(e);
	}

	if( LibraryThingConnector.pageStatsRecordedB)
		{
		LibraryThingConnector.info('page Stats already recorded, not recording again');
		return;
		}
	if( LibraryThingConnector.statsRecordLPQ && LibraryThingConnector.statsRecordLTB)
		{
		LibraryThingConnector.attachAccessibilityItems();
		LibraryThingConnector.requestLTAPI();
		LibraryThingConnector.pageStatsRecordedB = true;

		LibraryThingConnector.info('both LT and PQ widgets stats recorded, pinging stats url with stats');
		LibraryThingConnector.stats['type'] = 'page_load';
		if(typeof LibraryThingConnector.workcode != 'undefined')
			{
			LibraryThingConnector.info('recording workcode:'+LibraryThingConnector.workcode);
			LibraryThingConnector.stats['workInfoAA'] = {
				'workcode' : LibraryThingConnector.workcode,
				'workcode_from': LibraryThingConnector.workcode_from,
			};
			}
		
		var isbn_identifiers = LibraryThingConnector.isbn_identifiers;
		var upc_identifiers = LibraryThingConnector.upc_identifiers;
		var issn_identifiers = LibraryThingConnector.issn_identifiers;
		LibraryThingConnector.stats['identifiers_count'] = isbn_identifiers.length;
		LibraryThingConnector.stats['upc_identifiers_count'] = upc_identifiers.length;
		LibraryThingConnector.stats['issn_identifiers_count'] = issn_identifiers.length;

		var current_megadiv_el = LibraryThingConnector.getMegaDivEl();
		LibraryThingConnector.stats['dimensions'] = {};
		LibraryThingConnector.stats['dimensions']['window'] = {};
		LibraryThingConnector.stats['dimensions']['window']['height'] = LibraryThingConnector.utils.jQuery(window).height();
		LibraryThingConnector.stats['dimensions']['window']['width'] = LibraryThingConnector.utils.jQuery(window).width();

		LibraryThingConnector.stats['dimensions']['container'] = {};
		LibraryThingConnector.stats['dimensions']['container']['height'] = LibraryThingConnector.utils.jQuery(LibraryThingConnector.containingEl).height();
		LibraryThingConnector.stats['dimensions']['container']['width'] = LibraryThingConnector.utils.jQuery(LibraryThingConnector.containingEl).width();

		LibraryThingConnector.stats['dimensions']['megadiv'] = {};
		LibraryThingConnector.stats['dimensions']['megadiv']['height'] = LibraryThingConnector.utils.jQuery('#'+LibraryThingConnector.megadiv_id).height();
		LibraryThingConnector.stats['dimensions']['megadiv']['width'] = LibraryThingConnector.utils.jQuery('#'+LibraryThingConnector.megadiv_id).width();
		LibraryThingConnector.stats['dimensions']['megadiv']['position'] = LibraryThingConnector.utils.jQuery('#'+LibraryThingConnector.megadiv_id).position();

		LibraryThingConnector.stats['seen'] = {};
		LibraryThingConnector.stats['seen']['load'] = {};
		LibraryThingConnector.stats['seen']['load']['megadiv'] = LibraryThingConnector.utils.isInViewport(current_megadiv_el);
		if (LibraryThingConnector.enrichmentsShown())
			{
			LibraryThingConnector.utils.jQuery.each(LibraryThingConnector.enrichmentsShown(),function(i,n)
				{
					var enrichment_el = LibraryThingConnector.utils.jQuery('.unbound_'+n).get(0);
					var enrichment_seen = LibraryThingConnector.utils.isInViewport(enrichment_el);
					LibraryThingConnector.stats['seen']['load'][n] = enrichment_seen;
				}
			);
			}
		LibraryThingConnector.stats.errors = LibraryThingConnector.errors;
		if( typeof LibraryThingConnector.sessions[LibraryThingConnector.su_session] === 'undefined')
			{
			LibraryThingConnector.sessions[LibraryThingConnector.su_session] = {};
			}
		LibraryThingConnector.sessions[LibraryThingConnector.su_session]['stats'] = LibraryThingConnector.stats;
		LibraryThingConnector.sessions[LibraryThingConnector.su_session]['errors'] = LibraryThingConnector.errors;

		// record total time taken from init to now
		endTime = new Date().getTime();
		LibraryThingConnector.timing.loads.total = endTime - LibraryThingConnector.timing.init.start;
		// wait a second or two to allow hover timing data to be recorded
		setTimeout(function ()
		{
			LibraryThingConnector.runRecordPageStatsLoadedHooks();
			LibraryThingConnector.recordStats(LibraryThingConnector.stats);
		LibraryThingConnector.pageStatsRecordedB = true;
		if( typeof LibraryThingConnector.backend.statsRecorded !== 'undefined' )
			{
			LibraryThingConnector.info('connector: stats recorded');
			LibraryThingConnector.backend.statsRecorded();
			}
		},1500);
		}
	else
		{
		LibraryThingConnector.info('have nto received page stats yet from both LT and PQ');
		}
	};

LibraryThingConnector.addHoverData = function(data, source)
	{
	var start = new Date().getTime();
	// remove these even if no hover data found so that bdw can supply its own hoverdata and have it display
	if( source == 'syndetics' )
		{
		LibraryThingConnector.utils.jQuery('#unbound_hover').removeClass('loadingPQ');
		}
	else if (source == 'lt' )
		{
		LibraryThingConnector.utils.jQuery('#unbound_hover').removeClass('loadingLT');
		}

	LibraryThingConnector.utils.jQuery.each(data, function (key,value)
	{
	if ( !LibraryThingConnector.hoverData[key])
		{
		LibraryThingConnector.hoverData[key] = {};
		}


	if ( source == 'syndetics' )
		{
		if ( LibraryThingConnector.hoverData[key])
			{
			LibraryThingConnector.utils.jQuery.each(value, function (innerkey, innervalue)
			{
			LibraryThingConnector.hoverData[key][innerkey] = innervalue;
			});
			}
		}
	else if( source == 'lt')
		{
			if ( LibraryThingConnector.hoverData[key]) {
				LibraryThingConnector.utils.jQuery.each(value, function (innerkey, innervalue) {
					LibraryThingConnector.hoverData[key][innerkey] = innervalue;
				});
			}
			//LibraryThingConnector.hoverData[key][value] = value;
		}
	});

	LibraryThingConnector.debug('hoverData');
	LibraryThingConnector.debug(LibraryThingConnector.hoverData);
	var addHoverTime = new Date().getTime() - start;
	LibraryThingConnector.timing.hover.javascript.push({total:addHoverTime}); // happens multiple times as pq and lt apis return
		LibraryThingConnector.attachAccessibilityItems();
	};

LibraryThingConnector.LTLinkingIsbnApiFailed = function(jqxhr,textStatus,errorThrown) {
	LibraryThingConnector.error('lt linking isbn api failure');
	LibraryThingConnector.error(errorThrown);
	LibraryThingConnector.errors.push(LibraryThingConnector.error_types.LTLinkingIsbnAPIFailed);
};

LibraryThingConnector.handleLTStarsAPIFailure = function(jqxhr,textStatus,errorThrown)
{
	LibraryThingConnector.error('get pq hover api failure 1');
	LibraryThingConnector.error(errorThrown);
	LibraryThingConnector.errors.push(LibraryThingConnector.error_types.HoverStarsFailed);
};

LibraryThingConnector.searchResultsAPIFailed = function(jqxhr,textStatus,errorThrown) {
	LibraryThingConnector.error('search results api failure');
	LibraryThingConnector.error(errorThrown);
	LibraryThingConnector.errors.push(LibraryThingConnector.error_types.searchResultsAPIFailed);
};

LibraryThingConnector.handleLTAuthorAPIFailure = function(jqxhr,textStatus,errorThrown) {
	LibraryThingConnector.error('get pq hover api failure 2');
	LibraryThingConnector.error(errorThrown);
	LibraryThingConnector.errors.push(LibraryThingConnector.error_types.AuthorImageFailed);
};

LibraryThingConnector.handleSyndeticsHoverAPIFailure = function(jqxhr,textStatus,errorThrown) {
	LibraryThingConnector.error('get pq hover api failure 3');
	LibraryThingConnector.error(errorThrown);
	LibraryThingConnector.errors.push(LibraryThingConnector.error_types.HoverFailed);
};

LibraryThingConnector.handleStatsFailure = function(jqxhr,textStatus,errorThrown) {
	LibraryThingConnector.error('get pq hover api failure 4');
	LibraryThingConnector.error(errorThrown);
	LibraryThingConnector.errors.push(LibraryThingConnector.error_types.StatsFailed);
};

LibraryThingConnector.handleSyndeticsHoverAPI = function(data, textStatus, jqXHR)
	{
		//return; //CH_HACK
	LibraryThingConnector.debug('syndetics hover api finished');
	LibraryThingConnector.debug(data);
	var endTime = new Date().getTime();
	LibraryThingConnector.timing.hover.api.pq.total = endTime - LibraryThingConnector.timing.hover.api.pq.start;
	LibraryThingConnector.timing.hover.api.pq.end = endTime;

	LibraryThingConnector.addHoverData(data, 'syndetics');
	};

LibraryThingConnector.requestSearchResultsAPI = function(company,searchresults)
	{
	LibraryThingConnector.info('requestSyndeticsSearchResults');
	searchresults = JSON.stringify(searchresults);

	// complete json
	LibraryThingConnector.info('requesting to search results api with searchresults:');
	LibraryThingConnector.info(searchresults);

	// TODO point to right endpoint
	var api_endpoint = null;
	var success_handler = null;
	if( company == 'lt' )
		{
		api_endpoint = LibraryThingConnector.LTFL_BASE_URL + 'api_searchresults.php?company=';
		success_handler = LibraryThingConnector.handleLTSearchResultsAPI;
		}
	else if (company == 'pq' )
		{
		api_endpoint = LibraryThingConnector.SYNDETICS_DOMAIN + '/unbound_searchdiv.php';
		success_handler = LibraryThingConnector.handleSyndeticsSearchResultsAPI;
		}
	else
		{
		LibraryThingConnector.error('no search results api endpoint defined');
		return;
		}

	LibraryThingConnector.timing.searchresults.api.pq.start = new Date().getTime();
	LibraryThingConnector.utils.jQuery.ajax({
		url: api_endpoint,
		method: 'POST',
		jsonp: 'callback',
		dataType: 'jsonp',
		data: {
			searchresults: searchresults,
			a_id: LibraryThingConnector.a_id,
			i_id: LibraryThingConnector.i_id,
			client: LibraryThingConnector.client,
			su_catalog_language_code: LibraryThingConnector.catalog_language_code
		},
		success: success_handler,
		error:LibraryThingConnector.searchResultsAPIFailed
	});

	};

LibraryThingConnector.requestSyndeticsSearchResultsAPI = function(searchresults)
	{
	LibraryThingConnector.info('requestSyndeticsSearchResultsAPI');
	LibraryThingConnector.requestSearchResultsAPI('pq',searchresults);
	};

LibraryThingConnector.requestLTSearchResultsAPI = function (searchresults)
	{
	LibraryThingConnector.info('requestLTSearchResultsAPI');
	LibraryThingConnector.requestSearchResultsAPI('lt',searchresults);
	};

LibraryThingConnector.requestLTAPI = function ()
	{
	LibraryThingConnector.info('requestLTAPI');
	var isbn_identifiers = LibraryThingConnector.getIdentifiers('isbn');
	var isbns = isbn_identifiers.join(',');
	var upc_identifiers = LibraryThingConnector.getIdentifiers('upc');
	var upcs = upc_identifiers.join(',');
	var issn_identifiers = LibraryThingConnector.getIdentifiers('issn');
	var issns = issn_identifiers.join(',');
	// LibraryThingConnector.debug('sending isbn list to lt stars api:');
	// LibraryThingConnector.debug(isbns);

	var lt_stars_api_url = LibraryThingConnector.LTFL_BASE_URL+'api_stars.php';

	LibraryThingConnector.timing.hover.api.lt.start = new Date().getTime();
	LibraryThingConnector.utils.jQuery.ajax({
		url: lt_stars_api_url,
		method: 'POST',
		jsonp:'callback',
		dataType:'jsonp',
		data:{
			isbns:isbns,
			upcs:upcs,
			issns:issns,
			a_id:LibraryThingConnector.a_id
		},
		success: LibraryThingConnector.handleLTStarsAPI,
		error:LibraryThingConnector.handleLTStarsAPIFailure
	});

	var requiresLinkingIsbnAA = {
		135 : 1,
		206 : 1,
		301 : 1,
		308 : 1,
		383 : 1,
		328 : 1,
		448 : 1,
		73: 1,
		549: 1,
		556: 1,
		1943:1,
	}
	var sysTypeRequiresLinkingIsbnAA = {
		'Vega': 1,
		'Soutron':1,
	};
	if( typeof requiresLinkingIsbnAA[LibraryThingConnector.a_id] !== 'undefined' || typeof sysTypeRequiresLinkingIsbnAA[LibraryThingConnector.config.settingsA.opacA.vendor_opac] !== 'undefined')
		{
		LibraryThingConnector.info('requesting linking ISBNs from LT');

		var lt_linking_isbn_url = LibraryThingConnector.LTFL_BASE_URL + 'api_isbnlinking.php';

		LibraryThingConnector.utils.jQuery.ajax({
			url: lt_linking_isbn_url,
			method: 'POST',
			jsonp:'callback',
			dataType:'jsonp',
			data:{
				isbns:isbns,
				lsa_id:LibraryThingConnector.lsa_id
			},
			success: LibraryThingConnector.handleLTIsbnLinkingAPI,
			error:LibraryThingConnector.LTLinkingIsbnApiFailed
		});
		}
	};

LibraryThingConnector.handleLTFLWidgetsLoaded = function(e)
	{
	LibraryThingConnector.info('handleLTFLWidgetsLoaded');
	LibraryThingConnector.debug(e);

	var hasIdentifierDataB = typeof LibraryThingConnector.bestidentifiersAA !== 'undefined' && (LibraryThingConnector.bestidentifiersAA.isbnA.length || LibraryThingConnector.bestidentifiersAA.upcA.length);
	var shouldRetrySyndeticsB = LibraryThingConnector.retrySyndeticsB || LibraryThingConnector.shouldLoadSyndeticsWidgets == false;
	// if we did not yet load syndetics widgets bc no identifers were found and we have bestidentifiersAA now set, load syndetics
	if( shouldRetrySyndeticsB )
		{
		if( hasIdentifierDataB )
			{
			LibraryThingConnector.info('got bestidentifiersAA from LT widgets, loading syndetics widgets');
			var _metadata = LibraryThingConnector.metadata;
			_metadata.isbns = LibraryThingConnector.bestidentifiersAA.isbnA;
			_metadata.upcs = LibraryThingConnector.bestidentifiersAA.upcA;

			// only retry once
			LibraryThingConnector.retrySyndeticsB = false;

			LibraryThingConnector.setMetadata(_metadata, 'ltwidgets');
			LibraryThingConnector.loadSyndeticsWidgets();
			}
		else
			{
			LibraryThingConnector.statsRecordLPQ = true;
			LibraryThingConnector.recordPageStats();
			}
		}

	var endTime = new Date().getTime();
	var totalTime = endTime - LibraryThingConnector.timing.widgets.lt.start;
	LibraryThingConnector.timing.widgets.lt.total = totalTime;
	LibraryThingConnector.timing.widgets.lt.end = endTime;
	LibraryThingConnector.stats.timing = LibraryThingConnector.timing;
	LibraryThingConnector.requestSyndeticsAPI();
	LibraryThingConnector.statsRecordLTB = true;
	LibraryThingConnector.recordPageStats();
	};

LibraryThingConnector.handleLTIsbnLinkingAPI = function(data)
	{
	LibraryThingConnector.info('lt isbn linking api finished');

	LibraryThingConnector.isbnLinkingAA = data;
	};

LibraryThingConnector.recordSearchPageClickStat = function (enrichment, identifier)
	{
	LibraryThingConnector.debug('recordSearchPageClickStat');

	var stats_key = enrichment + '.' + 'lightbox';
	var data = {
		type:'searchresult_lightbox_opened'
	};
	data[stats_key] = 1;
	LibraryThingConnector.recordStats(data);
	};

LibraryThingConnector.handleSearchResultClick = function(ev)
	{
	LibraryThingConnector.info('handleSearchResultClick');
	LibraryThingConnector.info(ev.target);

	// sort out elements with data- attributes
	var unbound_searchresult_el = ev.target;
	var su_sd_title_el = ev.target;
	if( !LibraryThingConnector.utils.jQuery(su_sd_title_el).hasClass('.unbound_searchresult'))
		{
		unbound_searchresult_el = LibraryThingConnector.utils.jQuery(su_sd_title_el).parents('.unbound_searchresult');
		}

	// gather metadata
	var enrichment_type = LibraryThingConnector.utils.jQuery(su_sd_title_el).data('unbound-enrichmenttype');
	var enrichment_args = LibraryThingConnector.utils.jQuery(su_sd_title_el).data('args');
	var workcode = LibraryThingConnector.utils.jQuery(unbound_searchresult_el).data('workcode');
	LibraryThingConnector.info('searchresult click on enrichment_type: ' + enrichment_type);
	LibraryThingConnector.info('searchresult workcode: ' + workcode);
	var title = LibraryThingConnector.utils.jQuery(unbound_searchresult_el).data('title');
	LibraryThingConnector.info('searchresult title: ' + title);
	var isbn_identifier = LibraryThingConnector.utils.jQuery(unbound_searchresult_el).data('isbn');
	var upc = LibraryThingConnector.utils.jQuery(unbound_searchresult_el).data('upc');
	if( upc )
		{
		LibraryThingConnector.info('found upc for searchresults: '+upc);
		}
	var issn = LibraryThingConnector.utils.jQuery(unbound_searchresult_el).data('issn');
	if( issn )
		{
		LibraryThingConnector.info('found issn for searchresults: '+issn);
		}

	var id_attr = LibraryThingConnector.utils.jQuery(unbound_searchresult_el).data('id');
	var isbn = '';
	if ( isbn_identifier )
		{
		isbn = LibraryThingConnector.extractIdentifierFromIdString(isbn_identifier);
		LibraryThingConnector.info('found isbn for lightbox: ' + isbn);
		}

	// record click stat
	LibraryThingConnector.recordSearchPageClickStat(enrichment_type, isbn);


	var syndetics_params = {
		enrichment_type:'unbound_'+enrichment_type,
		workcode:workcode,
		isbn:isbn,
		su_isbns:isbn,
		su_upc:upc,
		su_issn:issn,
		su_catalog_url:window.location.href,
		su_catalog_language_code: LibraryThingConnector.catalog_language_code,
		active_id:'toc', // for look inside
		id:LibraryThingConnector.client
	};
	var browse_tag = LibraryThingConnector.utils.jQuery(unbound_searchresult_el).data('browse_tag');
	var browse_lplist_id = LibraryThingConnector.utils.jQuery(unbound_searchresult_el).data('browse_lplist_id');
	LibraryThingConnector.info('searchresult browse tag:' + browse_tag);
	LibraryThingConnector.info('searchresult browse lplist_id:' + browse_lplist_id);
	var type = enrichment_type.replace('unbound_','');
	if ( type == 'tags' )
		{
		type = 'tagbrowse';
		}
	if (type == 'ltseries')
		{
		type = 'ltnewseriesone';
		}
		var sg_id = LibraryThingConnector.utils.jQuery(unbound_searchresult_el).data('sg_id');
		LibraryThingConnector.info('searchresult ltseries sg_id:' + sg_id);
	var lt_params = {
		'su_workcode': workcode,
		'workcode': workcode,
		'su_isbns': isbn,
		'su_upcs': upc,
		'su_issns': issn,
		'su_title': title,
		'browse_tag': browse_tag,
		'sg_id': sg_id,
		'tag': browse_tag,
		'lplist_id': browse_lplist_id,
		'isbns': isbn,
		'type': type,
		'su_a_id': LibraryThingConnector.a_id,
		'su_i_id': LibraryThingConnector.i_id,
		'su_catalog_url':window.location.href,
		'su_catalog_language_code': LibraryThingConnector.catalog_language_code
	};
	var lt_lightbox_url = LibraryThingConnector.BASE_URL + 'syndeticsunbound_lightbox.php?';
	lt_lightbox_url += LibraryThingConnector.utils.jQuery.param(lt_params);

	var lb_title = LibraryThingConnector.translationstringsA['title_' + enrichment_type];

	// open the appropriate lightbox based on enrichment_typ
	if( enrichment_type == 'similar' )
		{
		LibraryThingConnector.openSearchResultLightbox(lb_title, lt_lightbox_url);
		}
	else if( enrichment_type == 'tags' )
		{
		LibraryThingConnector.openSearchResultLightbox(lb_title, lt_lightbox_url);
		}
	else if (enrichment_type == 'lists')
		{
		var lt_params = {
			'su_workcode': workcode,
			'searchdiv': 1,
			'su_isbns': isbn,
			'su_title': title,
			'isbns': isbn,
			'type': type,
			'su_a_id': LibraryThingConnector.a_id,
			'su_i_id': LibraryThingConnector.i_id,
			'su_catalog_url':window.location.href,
			'su_catalog_language_code': LibraryThingConnector.catalog_language_code
		};
		LibraryThingConnector.info('opening librarianpower to seemorelists');
		lt_params['type'] = 'librarianpower_list';
		lt_params['page'] = 'item';

		var title = 'Librarian Recommends';


		LibraryThingConnector.info('loading more Lists for item at ' + LibraryThingConnector.LIBRARIAN_POWER_DOMAIN);
		var lt_lightbox_url = LibraryThingConnector.LIBRARIAN_POWER_DOMAIN + 'libpow_controller.php?';
		lt_lightbox_url += LibraryThingConnector.utils.jQuery.param(lt_params);
		LibraryThingConnector.openSearchResultLightbox(title,lt_lightbox_url);
		}
	else if( enrichment_type == 'awards' )
		{
		LibraryThingConnector.openSearchResultLightbox(lb_title,lt_lightbox_url);
		}
	else if (enrichment_type == 'ltseries')
		{
		LibraryThingConnector.openSearchResultLightbox(lb_title, lt_lightbox_url);
		}
	else if( enrichment_type == 'patronreviews' )
		{
		var params = {
			'su_workcode': workcode,
			'workcode': workcode,
			'su_isbns': isbn,
			'isbns': isbn,
			'isbn': isbn,
			'winning_isbn': isbn,
			'tag': browse_tag,
			'type': 'reviews',
			'su_a_id': LibraryThingConnector.a_id,
			'su_i_id': LibraryThingConnector.i_id,
			'a_id': LibraryThingConnector.a_id,
			'i_id': LibraryThingConnector.i_id,
			'lstoken': LibraryThingConnector.lsa_id,
		};
		var url = LibraryThingConnector.LTFL_BASE_URL + 'reviews.php?';
		url += LibraryThingConnector.utils.jQuery.param(params);
		LibraryThingConnector.debug('final searchresult patronreviews url: ' + url);
		LibraryThingConnector.openSearchResultLightbox(LibraryThingConnector.translationstringsA['title_patronreviews'], url);
		}
	else if( enrichment_type == 'other' )
		{
		LibraryThingConnector.openSearchResultLightbox(lb_title, lt_lightbox_url);
		}
	else if( enrichment_type == 'author' )
		{
		LibraryThingConnector.openSyndeticsLightbox( LibraryThingConnector.translationstringsA.morebythisauthor , syndetics_params, enrichment_args);
		}
	else
		{
		LibraryThingConnector.openSyndeticsLightbox(lb_title, syndetics_params, enrichment_args);
		}
	return false;
	};

LibraryThingConnector.handleSearchResultsAPI = function(data)
	{
	LibraryThingConnector.info('handleSearchResultsAPI');
	LibraryThingConnector.info(data);

	// summary html looks like:
	//<div data-id="" class="unbound_searchresult"><div data-unbound-enrichmenttype="'.$enrichment_type.'" class="su_sd_title">' . $enrichment_header_text .'<span class="su_sd_number_p"></span></div></div>
	LibraryThingConnector.utils.jQuery.each(data, function(identifier, value) {
		LibraryThingConnector.info('identifier: ' + identifier);
		LibraryThingConnector.info(value);

	var summary_el = LibraryThingConnector.utils.jQuery('[data-id="'+identifier+'"]');
	if( summary_el.length == 0 )
		{
		LibraryThingConnector.info('no data-id found for identifier: ' + identifier);
		}
	else if( typeof value !== 'undefined' && value)
		{
		LibraryThingConnector.utils.jQuery.each(value, function (enrichment_type, enrichment_data)
			{
			if( enrichment_type.match(/unbound/))
				{
				enrichment_type = LibraryThingConnector.extractEnrichmentTypeFromClass(enrichment_type);
				}
			LibraryThingConnector.info('handling search results for identifier'+identifier+' for: ' +enrichment_type + ' with enrichment_data: ' + enrichment_data);
			// set workcode for lightbox opening
			if( enrichment_type == 'workcode' )
				{
				if( enrichment_data > 0 )
					{
					LibraryThingConnector.info('adding workcode data attribute to summary el');
					summary_el.data('workcode',enrichment_data);
					summary_el.attr('data-workcode',enrichment_data);
					}
				else
					{
					LibraryThingConnector.info('no workcode found for identifier: ' + identifier);
					}
				}
			else if (enrichment_type == 'browse_tag' )
				{
				LibraryThingConnector.info('adding browse_tag data attribute to summary el');
				summary_el.data('browse_tag',enrichment_data);
				summary_el.attr('data-browse_tag',enrichment_data);
				}
			else if (enrichment_type == 'browse_lplist_id' )
				{
				LibraryThingConnector.info('adding browse_lplist_id data attribute to summary el');
				summary_el.data('browse_lplist_id',enrichment_data);
				summary_el.attr('data-browse_lplist_id',enrichment_data);
				}
			else if (enrichment_type == 'sg_id')
				{
				LibraryThingConnector.info('adding sg_id data attribute to summary el');
				summary_el.data('sg_id', enrichment_data);
				summary_el.attr('data-sg_id', enrichment_data);
				}
			else
				{
				if( enrichment_data > 0 || enrichment_data.count > 0 )
					{
					// show the .unbound_searchresult
					summary_el.fadeIn();
					LibraryThingConnector.info('updating summary el');
					LibraryThingConnector.info(summary_el);
					var enrichment_div = LibraryThingConnector.utils.jQuery(summary_el).find('[data-unbound-enrichmenttype="'+enrichment_type+'"]');
					enrichment_div.find('.su_sd_number_p').html(enrichment_data);
					enrichment_div.css('display','inline');

					if( enrichment_data.args )
						{
						LibraryThingConnector.info('setting args on enrichment_div to ' + enrichment_data.args);
						enrichment_div.data('args',enrichment_data.args);
						enrichment_div.attr('data-args',enrichment_data.args);
						}
					// add click handler
					LibraryThingConnector.utils.jQuery(enrichment_div).click( function(ev) {
						LibraryThingConnector.info('search result click');
						LibraryThingConnector.handleSearchResultClick(ev);
					});
					}
				else
					{
					LibraryThingConnector.info('enrichment_data is 0 for ' + enrichment_type);
					var enrichment_div = LibraryThingConnector.utils.jQuery(summary_el).find('[data-unbound-enrichmenttype="'+enrichment_type+'"]');
					enrichment_div.find('.su_sd_title').css('display','none');
					}

				}
			});
		}
	});
	};

LibraryThingConnector.handleLTSearchResultsAPI = function(data)
	{
	LibraryThingConnector.info('LTSearchResultsAPI finished');
	LibraryThingConnector.timing.searchresults.api.lt.total = new Date().getTime() - LibraryThingConnector.timing.searchresults.api.lt.start;
	LibraryThingConnector.handleSearchResultsAPI(data);
	LibraryThingConnector.searchStatsRecordLTB = true;
	LibraryThingConnector.recordSearchPageStats();
	};

LibraryThingConnector.handleSyndeticsSearchResultsAPI = function(data)
	{
	LibraryThingConnector.info('SyndeticsSearchResultsAPI finished');
	LibraryThingConnector.timing.searchresults.api.pq.total = new Date().getTime() - LibraryThingConnector.timing.searchresults.api.pq.start;
	//<div data-unbound-enrichmenttype="'.$enrichment_type.'" class="su_sd_title">' . $enrichment_header_text .'<span class="su_sd_number_p"></span></div>
	LibraryThingConnector.handleSearchResultsAPI(data);
	LibraryThingConnector.searchStatsRecordLPQ = true;
	LibraryThingConnector.recordSearchPageStats();
	};

LibraryThingConnector.handleLTStarsAPI = function (data)
	{
	LibraryThingConnector.debug('lt hover api finished');
	LibraryThingConnector.debug(data);
	var endTime = new Date().getTime();
	LibraryThingConnector.timing.hover.api.lt.total = endTime - LibraryThingConnector.timing.hover.api.lt.start;
	LibraryThingConnector.timing.hover.api.lt.end = endTime;

	// handle star ratings
	LibraryThingConnector.addHoverData(data,'lt');

	// handle mediatype data attrs and classes, used by prefer_ebooks
	LibraryThingConnector.handleMediaTypeApi(data);
	};

LibraryThingConnector.handleMediaTypeApi = function(data) {
	LibraryThingConnector.info('handleMediaTypeApi');
	LibraryThingConnector.utils.jQuery.each(data, function (identifier, item) {
		if (typeof item['mediatype'] !== 'undefined') {
			var mediatype = item['mediatype'];
			var unbound_items = LibraryThingConnector.utils.jQuery('[data-id="' + identifier + '"]');
			if (unbound_items && (mediatype !== null)) {
			for ( var i = 0; i < unbound_items.length; i++)
				{
				var unbound_item = LibraryThingConnector.utils.jQuery(unbound_items[i]);

				if (unbound_item.hasClass('unbound_cover_seriesrec'))
					{
					return;
					}
				LibraryThingConnector.utils.jQuery(unbound_item).attr('data-mediatype', mediatype);
				LibraryThingConnector.utils.jQuery(unbound_item).data('mediatype', mediatype);
				var mediatype_nospaces = mediatype.replace(' ', '_');
				LibraryThingConnector.utils.jQuery(unbound_item).addClass(mediatype_nospaces);


				if (LibraryThingConnector.mark_eresources)
					{
					// Show all mediatypes for debugging purposes
					if (0)
						{
						var mediatype_el = LibraryThingConnector.utils.jQuery('<div data-mediatype="' + mediatype + '" class="unbound_layer_mediatype">' + mediatype + '</div>');
						LibraryThingConnector.utils.jQuery(unbound_item).after(mediatype_el);
						}

					if (typeof item['eresource'] !== 'undefined')
						{
						if (item['eresource'])
							{
							var media_el = LibraryThingConnector.utils.jQuery('<div data-mediatype="' + mediatype + '" class="unbound_layer_eresource"></div>');
							LibraryThingConnector.utils.jQuery(unbound_item).after(media_el);
							}
						}
					}
				}
			}
		}

	});
};

LibraryThingConnector.widgets.getParamsToPreserve = function ()
	{
	var paramsToValues = [];
	if( LibraryThingConnector.config.settingsA.linksA && LibraryThingConnector.config.settingsA.linksA.autoaddurlparameters)
		{
		var autoaddurlparameters = LibraryThingConnector.config.settingsA.linksA.autoaddurlparameters;
		// auto-add url params
		var queryKey = LibraryThingConnector.utils.parseUri(location.href).queryKey;
		// keep_parameters is comma delimited
		var keep_parametersA = autoaddurlparameters;
		for (var i = 0; i < keep_parametersA.length; i++)
			{
			var paramOn = keep_parametersA[i];
			if (queryKey[paramOn])
				{
				paramsToValues.push('&' + paramOn + '=' + queryKey[paramOn]);
				}
			}
		if (LibraryThingConnector.systype == "iii" && lsa_browse_scoping)
			{
			// III searchscope via searchscope select
			var scopeopt = null;
			var selects = document.getElementsByTagName('select');
			for (var i = 0; i < selects.length; i++)
				{
				if (selects[i].name && selects[i].name == 'searchscope')
					{
					scopeopt = selects[i].value;
					break;
					}
				}

			if (scopeopt)
				{
				paramsToValues.push('&searchscope=' + scopeopt);
				}

			// III searchscope via user_id
			var user_ids = document.getElementsByName('user_id');
			var user_id = null;
			for (var i = 0; i < user_ids.length; i++)
				{
				if (typeof user_ids[i].value != 'undefined' && user_ids[i].value != '')
					{
					user_id = user_ids[i].value;
					break;
					}
				}
			if (user_id)
				{
				paramsToValues.push('&user_id=' + user_id);
				}
			} // if systype == "iii", get params to preserve
		}
	return paramsToValues;
	};

LibraryThingConnector.getParams = function()
	{
	// get f_id from backend  if not already set (eg if coming from runUnboundWithMetadata)
	if( LibraryThingConnector.metadata === null || typeof LibraryThingConnector.metadata == 'undefined')
		{
		LibraryThingConnector.metadata = {'scope':''};
		}
	if( typeof LibraryThingConnector.metadata.scope == 'undefined' && typeof LibraryThingConnector.backend.getScope !== 'undefined')
		{
		LibraryThingConnector.metadata.scope = LibraryThingConnector.backend.getScope();
		}
	var params = {
		a_id: LibraryThingConnector.a_id,
		f_id: LibraryThingConnector.f_id,
		f_type: LibraryThingConnector.f_type,
		ebc_name: LibraryThingConnector.f_id,
		stats_id: LibraryThingConnector.su_session,
		version: LibraryThingConnector.version
	};
	if( typeof LibraryThingConnector.i_id !== "undefined")
		{
		params['i_id'] = LibraryThingConnector.i_id;
		}
	if ( typeof LibraryThingConnector.f_id !== 'undefined' )
		{
		LibraryThingConnector.stats.f_id = LibraryThingConnector.f_id;
		}
	if ( typeof LibraryThingConnector.useNoHoldingsB != 'undefined' )
		{
		var useNoHoldings = LibraryThingConnector.useNoHoldingsB;
		LibraryThingConnector.info('useNoHoldingsB is set, returning as su_noholdings='+useNoHoldings);
		params['su_noholdings'] = useNoHoldings;
		}
	if (typeof LibraryThingConnector.prefer_ebooks != 'undefined')
		{
		var prefer_ebooks = LibraryThingConnector.prefer_ebooks;
		LibraryThingConnector.info('prefer_ebooks is set, returning as su_prefer_ebooks=' + prefer_ebooks);
		params['su_prefer_ebooks'] = prefer_ebooks;
		}
		// pass in consortia scope to backends
	// holdingscodesAA set by initiator
	if( typeof LibraryThingConnector.metadata.scope !== 'undefined' && typeof LibraryThingConnector.config.holdingscodesAA !== 'undefined')
		{
		LibraryThingConnector.info('using metadata.scope as f_id');
		var holdingscodes = LibraryThingConnector.config.holdingscodesAA[LibraryThingConnector.metadata.scope];
		if( holdingscodes && holdingscodes.length)
			{
			LibraryThingConnector.info('using holdings code: ' + holdingscodes);
			params.f_id = holdingscodes.join(',');
			params.f_type = 'consortia';
			}
		else
			{
			LibraryThingConnector.info('No holdings code found, check config');
			}
		}
	// pass in backend's getScope result for possible use, eg enterprise
	if (LibraryThingConnector.metadata.scope !== 'undefined' && LibraryThingConnector.metadata.scope)
		{
		if (LibraryThingConnector.metadata.scope.constructor === Array)
			{
			params['scope'] = LibraryThingConnector.metadata.scope[0];
			}
		}
	params['su_catalog_language_code'] = LibraryThingConnector.catalog_language_code;
	LibraryThingConnector.utils.jQuery.each(LibraryThingConnector.metadataTypes, function (i, type)
		{
		var data = LibraryThingConnector.getMetadata(type);
		if( !data || data == null || typeof data == 'undefined' || data === 'undefined' || data === undefined)
			{
			data = ''; // prevent null values
			}
		if (type == 'itemInfo' && data && data['Holdings_table']) // special handling
			{
			data = LibraryThingConnector.utils.serializeItemInfo(data['Holdings_table']);
			}
		if (data instanceof Array)
			{
			params[type] = data.join(',');
			}
		else
			{
			params[type] = data;
			}
		}
	);

	// find container widths for divs so that backend can size content if needed
	container_widthAA = {};
	var el = document.body;
	if( typeof LibraryThingConnector.containingEl !== "undefined" && LibraryThingConnector.containingEl)
		{
		LibraryThingConnector.debug('container widths from containingEl:');
		LibraryThingConnector.debug(LibraryThingConnector.containingEl);
		el = LibraryThingConnector.containingEl;
		}
	var body_width = el.innerWidth || el.offsetWidth || el.clientWidth;
	var body_height = el.innerHeight || el.offsetHeight || el.clientHeight;
		var calc_height = body_height;
		var win_height = window.innerHeight;
		if (win_height > 0 && win_height < body_height)
		{
			calc_height = win_height;
		}
	container_widthAA['body'] = {cw: body_width, ch: calc_height};
	if (typeof LibraryThingConnector.containerQueryWidth != 'undefined') {
		container_widthAA['containerQuery'] = LibraryThingConnector.containerQueryWidth;
	}
	var element_classes = LibraryThingConnector.utils.find_unbound_elements(); // whittles down to just the actual enrichment classes
	var classes_for_dimensions = ['unbound_mega'];
	var split_element_classes = [];
	// send back list of .unbound_split
	LibraryThingConnector.utils.jQuery.each(element_classes,function(i,n){
		var usemegadivB = LibraryThingConnector.useMegadiv(n);
		if( !usemegadivB )
			{
			split_element_classes.push(n);
			}
	});
	params['split_divs'] = split_element_classes.join(',');
	if (element_classes)
		{
		params['divs'] = element_classes.join(',');
		LibraryThingConnector.utils.jQuery.each(classes_for_dimensions, function (i, className)
		{
		var el = LibraryThingConnector.utils.jQuery('.'+className);
		if( el.get(0) ) {
			// not including height for now at least
			var ep = el.parents(':visible');
			var epw = LibraryThingConnector.utils.jQuery(ep[0]).width();
			container_widthAA[className] = {
				cw: epw
			};
		}
		});
		}
	var charset = LibraryThingConnector.utils.detectedCharset();
	if (charset)
		{
		params['charset'] = charset;
		}
	LibraryThingConnector.containerWidths = container_widthAA;
	LibraryThingConnector.metadata['container_widths'] = container_widthAA;
	params['container_widthAAS'] = LibraryThingConnector.utils.serialize(container_widthAA);

	return params;
	};

LibraryThingConnector.loadSyndeticsWidgets = function ()
	{
	LibraryThingConnector.info('loading Syndetics widgets');
	LibraryThingConnector.loadingSyndeticsWidgetsB = true;
	var params = LibraryThingConnector.getParams();
	delete params['itemInfo'];
	delete params['i_id'];
	delete params['author'];
	delete params['charset'];
	delete params['container_widths'];
	delete params['container_widthAAS'];
	delete params['title'];
	params['isbn'] = params['isbns'];
	params['upc'] = params['upc'];
	params['issn'] = params['issns'];
	var divA = params['divs'].split(',');
	var unique_divA = LibraryThingConnector.utils.jQuery.unique(divA);
	var unbound_series_index = unique_divA.indexOf('unbound_series')
	if( unbound_series_index > -1)
		{
		LibraryThingConnector.info('removing unbound_series from unique_divA for pq');
		unique_divA.splice(unbound_series_index,1);
		}
	params['enhancements'] = unique_divA.join(',');
	delete params['divs'];
	delete params['isbns'];
	var split_divA = params['split_divs'].split(',');
	var unbound_splitdiv_series_index = split_divA.indexOf('unbound_series')
	if( unbound_splitdiv_series_index > -1)
		{
		LibraryThingConnector.info('removing unbound_series from split_divA for pq');
		split_divA.splice(unbound_splitdiv_series_index,1);
		}
	params['split_divs'] = split_divA.join(',')
	LibraryThingConnector.debug('params for unbound_response url:');
	LibraryThingConnector.debug(params);
	var syndetics_unbound_url = LibraryThingConnector.SYNDETICS_DOMAIN + '/unbound_response.php?id='+LibraryThingConnector.client + '&';
	syndetics_unbound_url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.debug('syndetics widgets url: ' + syndetics_unbound_url);
	LibraryThingConnector.pq_widget_params = params;
	LibraryThingConnector.pq_widget_url = syndetics_unbound_url;
		LibraryThingConnector.timing.widgets.pq.start = new Date().getTime();
	LibraryThingConnector.utils.jQuery.getScript(syndetics_unbound_url).
		fail(LibraryThingConnector.getSyndeticsWidgetsFailure); // handle called by dispatch which is called by this script
	};

LibraryThingConnector.loadBDW = function()
	{
	if( !LibraryThingConnector.BDW_loadedB)
		{
		LibraryThingConnector.debug('trying to load BDW');
		var bookdisplay_divs = LibraryThingConnector.bookdisplay.find_bookdisplay_divs();
		if( bookdisplay_divs.length > 0 )
			{
			LibraryThingConnector.bookdisplay.setup_widgets(bookdisplay_divs);
			// record stats
			LibraryThingConnector.utils.jQuery(LibraryThingConnector.bookdisplay.widgets_loaded).each(function (i, n)
			{
			LibraryThingConnector.info('record bdw loaded stat for bdw id: ' + n);
			LibraryThingConnector.recordBdwWidgetLoaded(n);
			});
			LibraryThingConnector.utils.jQuery(LibraryThingConnector.bookdisplay.multi_widgets_loaded).each(function (i, n)
			{
			LibraryThingConnector.info('record mutli bdw loaded stat for bdw id: ' + n);
			LibraryThingConnector.recordBdwMultiWidgetLoaded(n);
			});
			LibraryThingConnector.utils.jQuery(LibraryThingConnector.bookdisplay.list_widgets_loaded).each(function (i, n)
			{
				LibraryThingConnector.info('record bdw listwidget loaded stat for bdw id: ' + n);
				LibraryThingConnector.recordBdwListWidgetLoaded(n);
			});
			// set loadedB to true if we found any divs, otherwise
			// we can try again later on the page load
			LibraryThingConnector.BDW_loadedB = true;
			}
		}
	};

LibraryThingConnector.loadWidgets = function ()
	{
	var runStackMapB = false;
		if (LibraryThingConnector.lsa_id == 1905 || LibraryThingConnector.lsa_id == 5700 )
			{
			runStackMapB = true;
			}
	if( LibraryThingConnector.lsa_id == 5804 )
		{
		var scope = LibraryThingConnector.metadata.scope;
		if( scope && scope.length == 1 && scope[0] == 'acu')
			{
			runStackMapB = true;
			}
		}
	// load stack map, customer by customer
	if (runStackMapB)
		{
		LibraryThingConnector.info('possibly running stackmap for a_id:'+LibraryThingConnector.a_id);
		// only run for acu for 5804
		LibraryThingConnector.info('checking for ltflconfig for stackmap for lsa_id:' + LibraryThingConnector.lsa_id);
		// check for LTFL Stack Map setting, run if set to 2
		if (LibraryThingConnector.pagetype == 'full' && typeof LibraryThingConnector.ltflconfig !== 'undefined' && typeof LibraryThingConnector.ltflconfig.ls_widgets_stackmap !== 'undefined' && typeof LibraryThingConnector.ltflconfig.ls_widgets_stackmap !== 'undefined' && LibraryThingConnector.ltflconfig.ls_widgets_stackmap.lswst_status == 2)
			{
			LibraryThingConnector.info('ltfl stackmap status found - loading stack map');
			LibraryThingConnector.widgets.runStackMap();
			}

		}

	var loadOnSummaryAA = {
		'polaris': 'summary',
		'enterprise': 'summary'
	};
	if( LibraryThingConnector.pagetype != 'full' )
		{
		if( typeof loadOnSummaryAA[LibraryThingConnector.backend.name] !== 'undefined' && loadOnSummaryAA[LibraryThingConnector.backend.name] == LibraryThingConnector.pagetype)
			{
			LibraryThingConnector.info('pagetype is not full ('+LibraryThingConnector.pagetype+'), but allowed to load on backend: ' + LibraryThingConnector.backend.name);
			}
		else
			{
			LibraryThingConnector.info('pagetype is not full ('+LibraryThingConnector.pagetype+'), not loading unbound widgets');
			return;
			}
		}
	LibraryThingConnector.info('loading LT widgets');
	LibraryThingConnector.loadingLTFLWidgetsB = true;
	// if no identifiers found then load syndetics widgets when LT widgets return with better list of isbns
	if( typeof LibraryThingConnector.metadata.isbns !== 'undefined' && LibraryThingConnector.metadata.isbns.length == 0 && typeof LibraryThingConnector.metadata.upc == 'undefined')
		{
		LibraryThingConnector.info('no identifiers found: delaying loading syndetics widgets')
		LibraryThingConnector.shouldLoadSyndeticsWidgets = false;
		}

	if ( LibraryThingConnector.shouldLoadSyndeticsWidgets )
		{
		LibraryThingConnector.loadSyndeticsWidgets();
		}

	LibraryThingConnector.debug('metadata for loadWidgets');
	LibraryThingConnector.debug(LibraryThingConnector.metadata);

	var url = LibraryThingConnector.BASE_URL + 'syndeticsunbound_widgets.php?';

	var params = LibraryThingConnector.getParams();
	LibraryThingConnector.lt_widget_params = params;
		LibraryThingConnector.debug('loading widgets at url: ' + url);
	LibraryThingConnector.debug('params for widget url:');
	LibraryThingConnector.debug(params);
	var paramsStr = LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.debug(paramsStr);
	url += paramsStr;
	LibraryThingConnector.lt_widget_url = url;
	LibraryThingConnector.debug(url);
	LibraryThingConnector.timing.widgets.lt.start = new Date().getTime();
	LibraryThingConnector.utils.jQuery.getScript(url, LibraryThingConnector.getWidgetsSuccess).fail(LibraryThingConnector.getWidgetsFailure);
	};

	LibraryThingConnector.pingStatsCallback = function(data, textStatus, jqXHR)
	{
		LibraryThingConnector.info('BDW pingStats jsonp callback');
		LibraryThingConnector.info(data);
		LibraryThingConnector.info(textStatus);
		LibraryThingConnector.info(jqXHR);
	};

LibraryThingConnector.pingStatsComplete = function(data, textStatus, jqXHR)
	{
	LibraryThingConnector.info('BDW pingStats complete');
	LibraryThingConnector.info(data);
	LibraryThingConnector.info(textStatus);
	LibraryThingConnector.info(jqXHR);
	};

LibraryThingConnector.pingStatsError = function(data, textStatus, jqXHR)
	{
	LibraryThingConnector.info('BDW pingStats error');
	LibraryThingConnector.info(data);
	LibraryThingConnector.info(textStatus);
	LibraryThingConnector.info(jqXHR);
	};
/*
for legacy LTFL/BDW code
 */
LibraryThingConnector.pingStats = function( lsid, magicnumber, ltlink, url, widget_id , extra_info)
	{
	var stats_data = {
		'bdw_ping_stats':1,
		'id':lsid,
		'magicnumber':magicnumber,
		'ltlink':ltlink,
		'url':encodeURIComponent(url),
		'widget_id':widget_id,
		'extra_info':extra_info,
	};
	// send through recordStats and handle on backend
	LibraryThingConnector.recordStats(stats_data);
	};
/*
 parseUri 1.2.1
 (c) 2007 Steven Levithan <stevenlevithan.com>
 MIT License
 */

LibraryThingConnector.utils.serializeItemInfo = function (itemInfo)
	{
	var items = [];
	var data = '';
	LibraryThingConnector.utils.jQuery.each(itemInfo, function (i, n)
		{
		LibraryThingConnector.debug('serializing itemInfo: ');
		LibraryThingConnector.debug(n);
		colAA = ['callnumber','location'];
		var item = {};
		LibraryThingConnector.utils.jQuery.each(colAA, function (i, key)
			{
			item[key] = n[key];
			}) // each colAA
		items.push(item);
		}); // each itemInfo // each itemInfo // each itemInfo // each itemInfo


		if (items.length)
			{
			// de-dupe items by location+callnumber to minimize sent data
			var items_trimmed = [];
			var seenAA = {};
			LibraryThingConnector.utils.jQuery.each(items, function (i, item) {
				LibraryThingConnector.debug(item);
				if (item.callnumber)
					{
					if (typeof seenAA[item.callnumber] == 'undefined')
						{
						items_trimmed.push(item);
						seenAA[item.callnumber] = 1;
						}

					}
			}); // each items
			LibraryThingConnector.debug(seenAA);
			data = LibraryThingConnector.utils.serialize(items_trimmed);
			}
	return data;
	};

LibraryThingConnector.utils.parseUri = function parseUri(str)
	{
	var o = {
			strictMode: false,
			key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
			q: {
				name: "queryKey",
				parser: /(?:^|&)([^&=]*)=?([^&]*)/g
			},
			parser: {
				strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
				loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
			}
		},
		m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i = 14;

	while (i--)
		{
		uri[o.key[i]] = m[i] || "";
		}

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2)
	{
	if ($1)
		{
		uri[o.q.name][$1] = $2;
		}
	});

	return uri;
	};

LibraryThingConnector.utils.getParameterByName = function(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



// COinS extraction
LibraryThingConnector.utils.extractCoins = function (someNode)
	{
	var $sizzle = null;
	if (LibraryThingConnector.utils.Sizzle)
		{
		$sizzle = LibraryThingConnector.utils.Sizzle;
		}
	else if (LibraryThingConnector.utils.jQuery)
		{
		$sizzle = LibraryThingConnector.utils.jQuery;
		}
	coinshash = {};
	// check if someNode is a .Z3988 span
	// if so, use it's title attribute
	if (typeof someNode.getAttribute != 'undefined' && (someNode.getAttribute('class') == 'Z3988' || someNode.getAttribute('class') == 'z3988'))
		{
		var coinsvals = someNode.title.split('&');
		}
	// otherwise, check inside someNode for a .Z3988 span
	else if ($sizzle && $sizzle('.Z3988,.z3988', someNode).length > 0)
		{
		var coinsvals = $sizzle('.Z3988,.z3988', someNode)[0].title.split('&');
		}

	else
		{
		return false;
		}
	for (var i = 0; i < coinsvals.length; i++)
		{
		coinsel = coinsvals[i].split('=')[0];
		coinsval = coinsvals[i].split('=')[1];
		coinshash[coinsel] = coinsval;
		}
	LibraryThingConnector.debug('coinshash');
	LibraryThingConnector.debug(coinshash);
	return coinshash;
	};

LibraryThingConnector.utils.detectedCharset = function ()
	{
	var charset = document.charset || document.characterSet || document.inputEncoding;
	return charset || 'UTF-8';
	};

LibraryThingConnector.utils.requestContent = function (url)
	{
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	LibraryThingConnector.dochead.appendChild(script);
	};

LibraryThingConnector.utils.loadStylesheet = function (url)
	{
	var LB_CSS = document.createElement('link');
	LB_CSS.type = "text/css";
	LB_CSS.rel = "stylesheet";
	LB_CSS.href = url;
	LibraryThingConnector.dochead.appendChild(LB_CSS);
	};

LibraryThingConnector.utils.addGlobalStyle = function (cssInput)
	{
	var styleElement = document.createElement('style');
	styleElement.setAttribute('type', 'text/css');
	cssInput = decodeURIComponent(cssInput);

	if (styleElement.styleSheet) // IE
		{
		styleElement.styleSheet.cssText = cssInput;
		}
	else
		{
		var textNode = document.createTextNode(cssInput);
		styleElement.appendChild(textNode);
		}
	LibraryThingConnector.dochead.appendChild(styleElement);
	};

LibraryThingConnector.utils.valid_ISBN10 = function (isbn)
	{
	var sum = 0;
	for (var i = 0; i <= 9; i++)
		{
		var digit = isbn.charAt(i).toUpperCase();
		sum += (digit == 'X') ? 10 : digit * (10 - i);
		}
	return (sum % 11 == 0);
	};

LibraryThingConnector.utils.valid_ISBN13 = function (isbn)
	{
	var sum = 0;
	// check if starts with 978 or 979, if not, reject
	var prefix = isbn.substr(0, 3);
	if (prefix == '978' || prefix == '979')
		{
		for (var i = 0; i <= 12; i++)
			{
			var digit = isbn.charAt(i) * 1;
			sum += (i % 2 == 0) ? digit : 3 * digit;
			}
		return (sum % 10 == 0);
		}
	else
		{
		return false;
		}
	};

LibraryThingConnector.utils.ISBN_checkdigit13 = function (isbn)
	{
	var checksum = 0;
	for (i = 0; i < 12; i++)
		{
		var digit = parseInt(isbn[i], 10)
		if (i % 2 == 1)
			{
			checksum += digit * 3;
			}
		else
			{
			checksum += digit * 1;
			}
		}
	return (10 - (checksum % 10)) % 10;
	};

LibraryThingConnector.utils.ISBN_checkdigit10 = function(isbn)
	{
	var checksum = 0;
	for (i = 0; i < 9; i++)
		{
		var digit = parseInt(isbn[i], 10)
		checksum += (10-i) * digit;
		}
	checksum = checksum % 11;
	var checkdigit = (11 - checksum) % 11
	if (checkdigit == 10)
		{
		checkdigit = "X";
		}

	return checkdigit;
	};

LibraryThingConnector.utils.ISBN_convert10to13 = function(isbn)
	{
	if( isbn.length == 13 )
		{
		return isbn;
		}
	if( isbn.length != 10 )
		{
		return '';
		}
	var isbn13 = '978' + isbn.slice(0,9);
	isbn13 = isbn13 + LibraryThingConnector.utils.ISBN_checkdigit13(isbn13);

	if( LibraryThingConnector.utils.valid_ISBN13(isbn13))
		{
		return isbn13;
		}
	else
		{
		return isbn;
		}
	};

LibraryThingConnector.utils.ISBN_convert13to10 = function(isbn)
	{
	var isbn13 = isbn.substr(3,9);
	var checksum = LibraryThingConnector.utils.ISBN_checkdigit10(isbn13);
	return isbn13 + checksum;
	};


LibraryThingConnector.utils.valid_ISBN = function (isbn)
	{
	var len = isbn.length;
	if (len == 10)
		{
		return LibraryThingConnector.valid_isbn10(isbn);
		}
	else if (len == 13)
		{
		return LibraryThingConnector.valid_isbn13(isbn);
		}
	else
		{
		return false;
		}
	};

LibraryThingConnector.utils.extract_ISBNs = function (chunk)
	{
	var page = chunk;
	var isbns = [];
	if (typeof page == "undefined")
		{
		return isbns;
		}
	var searchExpression = /([0-9]{13}|[0-9]{10}|[0-9]{9}[x])/gi; // 13 digits, 10 digits, or 9 digits+x;
	if( LibraryThingConnector.backend.name == 'iii' )
		{
		searchExpression = /[^i]([0-9]{13}|[0-9]{10}|[0-9]{9}[x])/gi; // ^i is iii only?
		}
	page = page.replace(/LibraryThingConnector.suid/ig, ''); // strip out LS ID (which can appear like an ISBN
	page = page.replace(/%20/gi, ' '); // encode %20 as space
	page = page.replace(/\s/gi, ' ').replace(/-/gi, '');  // strip hyphens and whitespace
	page = page.replace(/ltfl_noscrape.*?>.*?</gi, ''); // strip out noscrape classes


	page = page.replace(/<select.*?<\/select>/gi, '');  // strip <select> elements

	if (LibraryThingConnector.backend && LibraryThingConnector.backend.name == 'iii')
		{
		page = page.replace(/<input.*?>/gi, "");  // strip <input> elements ; iii only?
		// <input> elements are needed by Sirsi on the summary screen!
		}
	page = page.replace(/<a[^>]+>Next<\/a>/gi, "");  // strip 'next' links
	page = page.replace(/<a[^>]+>Prev<\/a>/gi, "");  // strip 'prev' links
	page = page.replace(/time=[^&]+&/gi, ""); // strip timestamp (which can look like an ISBN)

	var potential_isbns = ( page.match(searchExpression) || [] ); // find isbn-like numbers in the html

	// check for isbns in id's of page first in case opac is feeding us isbns in the id's
	// like ltfl_isbn_1234567890
	div_ids_searchexpression = /ltfl_isbn_([0-9]{13}|[0-9]{10}|[0-9]{9}[x])/gi;
	var div_ids = page.match(div_ids_searchexpression) || [];
	for (var i = 0; i < div_ids.length; i++)
		{
		// put at beginning of potential_isbns
		potential_isbns.unshift(div_ids[i]);
		}
	//LibraryThingConnector.log(potential_isbns);

	var tenDigitISBNs = [];
	var thirteenDigitISBNs = [];

	for (var i = 0; i < potential_isbns.length; i++)
		{
		var n = potential_isbns[i];

		if (typeof LibraryThingConnector.lsa_id !== 'undefined' && (LibraryThingConnector.lsa_id == "506" || LibraryThingConnector.lsa_id == 227) && n.indexOf('%20') == 0)
			{
			continue;
			}

		n = n.replace(/[^0-9x]/gi, "");
		n = n.replace(/["]/gi, "");
		if (n != null && !this.contains(isbns, n) && this.valid_ISBN(n))
			{
			isbns.push(n);
			if (n.length == 10)
				{
				tenDigitISBNs.push(n);
				//LibraryThingConnector.log( 'found a potential fragment problem ' + n );
				}
			else
				{
				thirteenDigitISBNs.push(n);
				}
			}
		}
	// I'm not sure what the thinking was here. --casey
	// Now I do: removing 10 digit isbns which the isbn finder regex above found, but which were actually just prefixes of 13 digit isbns
	// and happened to be valid isbn's, too, but not ones we'd want --cc
	var onesToRemove = [];
	for (var i = 0; i < tenDigitISBNs.length; i++)
		{
		var tenDigitOn = tenDigitISBNs[i];
		// for each 13 digit isbn, see if there is a substring match.
		for (var j = 0; j < thirteenDigitISBNs.length; j++)
			{
			var thirteenDigitOn = thirteenDigitISBNs[j];
			var matcherOn = new RegExp(tenDigitOn, "igm");
			//LibraryThingConnector.log("checking " + thirteenDigitOn + " versus " + tenDigitOn + " for potential substring match");

			if (matcherOn.test(thirteenDigitOn))
				{
				onesToRemove.push(tenDigitOn);
				LibraryThingConnector.log("Removing " + tenDigitOn + " due to conflict w 13 digit");
				}
			}
		}
	//LibraryThingConnector.log("ones to remove are " + onesToRemove );

	if (onesToRemove.length > 0)
		{
		// ugh. javascript arrays
		var newIsbns = [];
		for (var k = 0; k < isbns.length; k++)
			{
			if (!this.contains(onesToRemove, isbns[k]))
				{
				newIsbns.push(isbns[k]);
				}
			}
		isbns = newIsbns;
		}

	// sort by size ascending (so that 10 digit preferred)
	isbns.sort(function (x, y)
	{
	return x.length > y.length;
	});
	LibraryThingConnector.debug('final isbns: ');
	LibraryThingConnector.debug(isbns);
	return isbns;
	};

LibraryThingConnector.utils.parse_queries = function (url)
	{
	var query_hash = {};
	if(typeof url == 'undefined' )
		{
		url = window.location.search;
		}
	if (url)
		{
		var query_str = url.slice(1).split('&');
		for (var i = 0; i < query_str.length; i++)
			{
			var query = query_str[i].split('=');
			query_hash[query[0]] = query[1];
			}
		}
	return query_hash;
	};

LibraryThingConnector.utils.find_unbound_split_elements = function ()
{
	LibraryThingConnector.info('find_unbound_split_elements');
	var divs = LibraryThingConnector.utils.jQuery('.unbound_splitdiv'); // .unbound_element

	var element_classes = LibraryThingConnector.utils.find_unbound_elements(); // whittles down to just the actual enrichment classes
	var split_element_classes = [];
	if ( divs )
		{
		LibraryThingConnector.utils.jQuery.each(divs, function (i, el)
		{
			var classNames = el.className.split(' ');
			LibraryThingConnector.utils.jQuery.each(classNames,function(i,className){
			if( LibraryThingConnector.utils.jQuery.inArray(className,element_classes))
				{
				split_element_classes.push(className);
				return false;
				}
			});
		});
		}

	LibraryThingConnector.info('split div element_classes: ' + split_element_classes);
	return split_element_classes;
};

LibraryThingConnector.utils.find_unbound_elements = function ()
	{
	LibraryThingConnector.info('find_unbound_elements');
	var divs = LibraryThingConnector.utils.find_syndeticsunbound_divs(); // .unbound_element

	var element_classes = [];
	if ( divs )
		{
		LibraryThingConnector.utils.jQuery.each(divs, function (i, el)
		{
		var classNames = el.className.split(' ');
		LibraryThingConnector.utils.jQuery.each(classNames, function (i, className)
			{
			if( className.match(/unbound_/) && !className.match(/content/))
				{
				var _enrichment_type = LibraryThingConnector.extractEnrichmentTypeFromClass(className);
				if(typeof LibraryThingConnector.config.enrichmentsA.settings.onoffA[_enrichment_type] !== 'undefined')
					{
					element_classes.push(className);
					}
				}
			}); // each className
		}); // each div
		} // if divs

	return element_classes;
	};

LibraryThingConnector.utils.find_syndeticsunbound_divs = function ()
	{
	if( typeof LibraryThingConnector.backend.find_syndeticsunbound_divs !== 'undefined' )
		{
		LibraryThingConnector.debug('calling backend find_syndeticsunbound_divs');
		return LibraryThingConnector.backend.find_syndeticsunbound_divs();
		}
	else
		{
		var unbound_elements = LibraryThingConnector.utils.jQuery('.unbound_element');
		if ( unbound_elements.length )
			{
			LibraryThingConnector.debug('found divs via .unbound_elements');
			return unbound_elements;
			}
		else
			{
			LibraryThingConnector.debug('.unbound_elements not found, checking for outside megadiv');
			var unbound_elements = [];

			var enrichments_on = LibraryThingConnector.utils.enrichments_on();
			LibraryThingConnector.debug('enrichments_on');
			LibraryThingConnector.debug(enrichments_on);
			LibraryThingConnector.utils.jQuery(enrichments_on).each( function(i,n) {
				var div_foundB = LibraryThingConnector.utils.jQuery('.'+n).length;
				if( LibraryThingConnector.backend.name == 'ls2' )
					{
					div_foundB = LibraryThingConnector.utils.jQuery('.' + n,LibraryThingConnector.containingEl).length;
					if (div_foundB)
						{
						var div = LibraryThingConnector.utils.jQuery('.' + n, LibraryThingConnector.containingEl).get(0);
						unbound_elements.push(div);
						}
					else
						{
						div_foundB = LibraryThingConnector.utils.jQuery('[id="' + n+'"]', LibraryThingConnector.containingEl).length;

						if( div_foundB )
							{
							var div = LibraryThingConnector.utils.jQuery('[id="' + n+'"]', LibraryThingConnector.containingEl).get(0);
							unbound_elements.push(div);
							}
						}
					}
				else
					{
					if (div_foundB)
						{
						var div = LibraryThingConnector.utils.jQuery('.' + n).get(0);
						unbound_elements.push(div);
						}
					}
			});

			LibraryThingConnector.debug('final enrichments outside megadiv:');
			LibraryThingConnector.debug(unbound_elements);

			return unbound_elements;
			}
		}
	};

LibraryThingConnector.utils.enrichments_on = function ()
	{
	var enrichments_onA = LibraryThingConnector.utils.jQuery.map( LibraryThingConnector.config.enrichmentsA.settings.onoffA,function(onoffB, enrichment_type) {
		if ( onoffB )
			{
			return 'unbound_'+enrichment_type;
			}
	} );

	return enrichments_onA;
	};

LibraryThingConnector.utils.find_ltfl_divs = function ()
	{
	var ltfl_divs = [];
	var divs = document.getElementsByTagName('div');
	for (var i = 0; i < divs.length; i++)
		{
		var div_id = divs[i].id;
		if (div_id.slice(0, 5) == "ltfl_")
			{
			ltfl_divs.push(div_id);
			}
		}
	return ltfl_divs;
	};

// generic javascript functions
LibraryThingConnector.utils.contains = function (array, item)
	{
	for (var i = 0; i < array.length; i++)
		{
		if (array[i] == item)
			{
			return true;
			}
		}
	;
	return false;
	};

// used only by reviews
LibraryThingConnector.utils.insertAfter = function (newElement, targetElement)
	{
	// inserts new element after the target element
	var parent = targetElement.parentNode;
	if (parent.lastchild == targetElement)
		{
		parent.appendChild(newElement);
		}
	else
		{
		parent.insertBefore(newElement, targetElement.nextSibling);
		}
	};
// TODO: include cookie stuff?

LibraryThingConnector.utils.curry = function (method)
	{
	var curried = [];
	for (var i = 1; i < arguments.length; i++)
		{
		curried.push(arguments[i]);
		}

	return function ()
		{
		var args = [];
		for (var i = 0; i < curried.length; i++)
			{
			args.push(curried[i]);
			}
		for (var i = 0; i < arguments.length; i++)
			{
			args.push(arguments[i]);
			}
		return method.apply(null, args);
		};
	};


LibraryThingConnector.utils.stripHTML = function (stuff)
	{
	var matchTag = /<(?:.|\s)*?>/g;
	if (typeof stuff == 'undefined')
		{
		return stuff;
		}
	return stuff.replace(matchTag, "").replace(/^\s+|\s+$/g, "");
	};

LibraryThingConnector.utils.stripControlChars = function (strOn)
	{
	var ret = '';
	if (strOn)
		{
		for (var i = 0; i < strOn.length; i++)
			{
			//< 32 is newlines, tabs, etc.
			if (('' + strOn.substring(i, i + 1) ).charCodeAt(0) > 31)
				{
				ret += strOn.substring(i, i + 1);
				}
			}
		}

	return ret;
	};

LibraryThingConnector.utils.getAncestor = function (elt, levels)
	{
	var eltOn = elt;
	for (var i = 0; i < levels; i++)
		{
		eltOn = eltOn.parentNode;
		}
	// TODO: make sure we are not returning the same object
	return eltOn;
	};

LibraryThingConnector.utils.getPreviousSibling = function (elt, steps)
	{
	var eltOn = elt;
	for (var i = 0; i < steps; i++)
		{
		if (eltOn.previousSibling)
			{
			eltOn = eltOn.previousSibling;
			}
		}
	return eltOn;
	};

LibraryThingConnector.utils.getAncestorByClass = function (elt, classNameToFind)
	{
	var maxrecurse = 10;
	var eltOn = elt;
	for (var i = 0; i < maxrecurse; i++)
		{
		eltOn = eltOn.parentNode;
		if (eltOn.className && eltOn.className == classNameToFind)
			{
			return eltOn;
			}
		}
	return null;
	};

LibraryThingConnector.utils.getElementsByClassName = function (oElm, strTagName, strClassName)
	{
	var arrElements = (strTagName == "*" && oElm.all) ? oElm.all : oElm.getElementsByTagName(strTagName);
	var arrReturnElements = new Array();
	strClassName = strClassName.replace(/\-/g, "\\-");
	var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
	var oElement;
	for (var i = 0; i < arrElements.length; i++)
		{
		oElement = arrElements[i];
		if (oRegExp.test(oElement.className))
			{
			arrReturnElements.push(oElement);
			}
		}
	return (arrReturnElements);
	};

LibraryThingConnector.utils.addEvent = function (elt, evt, func)
	{
	if (typeof elt == 'string')
		{
		elt = document.getElementById(elt);
		}
	if (window.addEventListener)
		{
		elt.addEventListener(evt, func, false);
		}
	else
		{
		elt.attachEvent("on" + evt, func);
		}
	};

LibraryThingConnector.utils.showhide = function (elt_id, bool)
	{
	var elt = document.getElementById(elt_id);
	if (elt)
		{
		elt.style.display = bool ? 'block' : 'none';
		}
	};
LibraryThingConnector.utils.revealBySelector = function (selector)
	{
	LibraryThingConnector.utils.jQuery(selector).toggle();
	};

LibraryThingConnector.utils.isShowing = function (elt_id)
	{
	var elt = document.getElementById(elt_id);
	if (!elt || elt.style.display == 'none')
		{
		return false;
		}
	return true;
	};

LibraryThingConnector.utils.add_anchor_onclicks = function (elt_id, func)
	{
	var anchors = document.getElementById(elt_id).getElementsByTagName('a');
	for (var i = 0; i < anchors.length; i++)
		{
		this.addEvent(anchors[i], 'click', func);
		}
	};

LibraryThingConnector.utils.windowSize = function (returnWidthAndHeight)
	{ // http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
	sizeArray = Array();
	if (typeof returnWidthAndHeight === 'undefined')
		{
		returnWidthAndHeight = false
		}

	var myWidth = 0, myHeight = 0;
	if (typeof( window.innerWidth ) == 'number') //Non-IE
		{
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;

		/*
		 if (LibraryThingConnector.lsa_id == 1475) {
		 myWidth = window.outerWidth;
		 myHeight = window.outerHeight;
		 }
		 */
		}
	else if (document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight )) //IE 6+ in 'standards compliant mode'
		{
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
		}
	else if (document.body && ( document.body.clientWidth || document.body.clientHeight )) //IE 4 compatible
		{
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
		}
	else
		{
		myHeight = 480;
		}
	if (returnWidthAndHeight === true)
		{
		sizeArray['height'] = myHeight;
		sizeArray['width'] = myWidth;
		return sizeArray;
		}
	return myHeight;
	};

LibraryThingConnector.utils.debugWarningPanel = function (lsa_id)
	{
	var warningPanel = document.createElement("div");
	// set style on warning panel
	warningPanel.className = "LT_debugwarning";
	warningPanel.id = "LT_debugwarning";
	var ih = "DEBUG COOKIE IS ON!  [<a href='#' onclick='if(typeof(firebug)!=\"undefined\"){firebug.init();}else{ /*console.init();*/ } return false;'>firebug</a> ";
	ih += ' | <a href="#" onclick="this.parentNode.style.display = \'none\';return false;">close</a>] ';
	ih += ' | <a target="_blank" href="' + LibraryThingConnector.BASE_URL + 'forlibraries/admin/usersandaccounts.php?switch=' + lsa_id + '">switch to this user/lib</a>';
	ih += ' | <a target="_blank" href="' + LibraryThingConnector.BASE_URL + 'forlibraries/getNGoodIsbns.php?lsa_id=' + lsa_id + '&num=100">lookup ISBNS</a>';

	warningPanel.innerHTML = ih;
	warningPanel.setAttribute('style', 'display:block; position:fixed; cursor:pointer; border:2px solid red; top:20px; font-size:18px; color:red; background-color:#fff; z-index:5010; padding:5px;');

	document.body.appendChild(warningPanel);

	warningPanel.onclick = function ()
		{
//            var dbw = document.getElementById('LT_debugwarning');
//            dbw.setAttribute('style', 'display:none;');
		};
	};

LibraryThingConnector.utils.addDebugWarningPanelMsg = function (msg)
	{
	var debugPanelDiv = document.getElementById('LT_debugwarning');
	if (debugPanelDiv)
		{
		var msgHtml = '<p>' + msg + '</p>';
		debugPanelDiv.innerHTML += msgHtml;
		}

	};
LibraryThingConnector.utils.redefineGetElementsByTagName = function ()
	{
	document.nativeGetElementsByTagName = document.getElementsByTagName;
	document.getElementsByTagName = function (args)
		{
		try
			{
			if ((args === 'body') || (args === 'BODY'))
				{
				var _temp = document.getElementById('LT_body_catcher');
				if (!_temp)
					{
					_temp = document.createElement('div');
					_temp.id = 'LT_body_catcher';
					_temp.style.display = 'none';
					var _bod = document.nativeGetElementsByTagName('body')[0];
					_bod.appendChild(_temp);
					return [_temp];
					}
				;
				}
			else
				{
				return document.nativeGetElementsByTagName(args);
				}
			}
		catch (err)
			{
			return document.nativeGetElementsByTagName(args);
			}
		};

	};

LibraryThingConnector.utils.serialize = function (_obj)
	{
	// via: http://blog.stchur.com/2007/04/06/serializing-objects-in-javascript/
	// was using obj.toSource but FF was not putting double quotes around json keys (and so php jsondecode was failing). Making all browsers do it the hard way now
	switch (typeof _obj)
	{
		// numbers, booleans, and functions are trivial:
		// just return the object itself since its default .toString()
		// gives us exactly what we want
		case 'number':
		case 'boolean':
		case 'function':
			return _obj;
			break;

		// for JSON format, strings need to be wrapped in quotes
		case 'string':
			// make sure double quotes within strings are encoded
			_obj = _obj.replace(/"/g,'&quot;');
			return '"' + _obj + '"';
			break;

		case 'object':
			var str;
			if (!_obj)
				{
				return 'null';
				break;
				}
			if (_obj.constructor === Array || typeof _obj.callee !== 'undefined')
				{
				str = '[';
				var i, len = _obj.length;
				for (i = 0; i < len - 1; i++)
					{
					str += LibraryThingConnector.utils.serialize(_obj[i]) + ',';
					}
				str += LibraryThingConnector.utils.serialize(_obj[i]) + ']';
				}
			else
				{
				str = '{';
				var key;
				for (key in _obj)
					{
					str += '"' + key + '"' + ':' + LibraryThingConnector.utils.serialize(_obj[key]) + ',';
					}
				str = str.replace(/\,$/, '') + '}';
				}
			return str;
			break;

		default:
			return '""';
			break;
	}
	};

/*
 from widgets.shelfbrowse.initialHTML_mini()
 fixedSize: whether to limit width returned based on fixedSize
 */
LibraryThingConnector.utils.find_container_dimensions = function (container_id)
	{
	// Need to get the width of the containing element so that we can size the iframe to fit.
	// use the div 'ltfl_shelfbrowse_mini'
	var container = document.getElementById(container_id);
	LibraryThingConnector.log('container el');
	LibraryThingConnector.log(container);
	var cw = container.innerWidth || container.offsetWidth || container.clientWidth;
	LibraryThingConnector.log('container raw width:' + cw);

	// if cw comes back miniscule, force finding of more appropriate container div
	if (cw < 10)
		{
		cw = 0;
		}
	var ch = container.innerHeight || container.offsetHeight || container.clientHeight;
	LibraryThingConnector.log('container raw height:' + ch);
	if (ch < 10)
		{
		ch = 0;
		}
	var containerWidth = cw;
	var containerHeight = ch;

	// if cw is 0 that means that it's probably in a hidden div.
	// we need to traverse up the structure until we get a parent div that has a width.
	// we are buffering it by 20 because of some experience with libs using tiny 1 or 2 pixel
	// divs instead of hidden divs, then making them bigger once the page loads.
	var pnode;
	var bod = LibraryThingConnector.utils.Sizzle('body')[0];
	while (!cw || (cw <= 0) || (cw === undefined) || !ch || ch <= 0 || ch === undefined)
		{
		if (pnode == bod)
			{
			cw = bod.innerWidth || bod.offsetWidth || bod.clientWidth;
			ch = bod.innerHeight || bod.offsetHeight || bod.clientHeight;
			break;
			}
		else
			{
			if (!pnode)
				{
				pnode = container.parentNode;
				}
			else
				{
				pnode = pnode.parentNode;
				}
			cw = (pnode.innerWidth || pnode.offsetWidth || pnode.clientWidth);
			ch = pnode.innerHeight || pnode.offsetHeight || pnode.clientHeight;
			}
		cw = cw - 20;
		ch = ch - 20;
		}
	if (pnode)
		{
		LibraryThingConnector.log('using el for container size:');
		LibraryThingConnector.log(pnode);
		}

	return {
		cw: containerWidth || cw,
		ch: containerHeight || ch,
		pnode: pnode
	}
	};
LibraryThingConnector.utils.openWindow = function (url, title, height, width)
	{
	if (!height)
		{
		height = 700;
		}
	if (!width)
		{
		width = 600;
		}
	if (typeof(window.top.open) == 'function')
		{
		LibraryThingConnector.info('run from iframe, running window.top.open');
		var windowPopup = window.top.open(url, title, 'height=' + height + ',width=' + width + ',scrollbars=yes,toolbars=no,status=yes,resizable=yes');
		}
	else if (typeof(window.open) == 'function')
		{
		LibraryThingConnector.info('not from iframe, running window.top.open');
		var windowPopup = window.open(url, title, 'height=' + height + ',width=' + width + ',scrollbars=yes,toolbars=no,status=yes,resizable=yes');
		}
	else
		{
		LibraryThingConnector.log('unable to use window.top.open or window.open to open window');
		}
	LibraryThingConnector.log('window.top');
	LibraryThingConnector.log(window.top);
	if (!windowPopup)
		{
		// must be blocked?!
		var initialHTML = '<div id="LT_LB_container">';
		initialHTML += '<div id="LT_BP_head">';
		initialHTML += '<div id="LT_LB_title">';
		//initialHTML += "(<a id='LT_LB_helpbutton' onclick='LibraryThingConnector.LB.help();return false;' href='#'>" + LibraryThingConnector.strings.LB.helpLabel + "</a>)";
		initialHTML += "</div>"; // #LT_LB_title
		initialHTML += "<div id='LT_LB_controls_minimal'>";
		initialHTML += " <img src='//image.librarything.com/pics/fancy_closebox.png' id='LT_LB_closebutton_x' onclick='LibraryThingConnector.LB.close();LibraryThingConnector.LB.removeFullScreen();return false;'/>";
		initialHTML += '</div>'; // #LT_LB_controls_minimal
		initialHTML += '</div>'; // close of LT_LB_head
		initialHTML += '<div class="ltfl_popup_content">';
		initialHTML += '<p>It looks as if popups are blocked on this device.</p><p>Please click <a target="_blank" href="' + url + '">here</a> to follow this link: <a target="_blank" href="' + url + '">' + url + '.</a></p>';
		initialHTML += '</div>'; // .ltfl_popup_content
		initialHTML += '</div>'; // #LT_LB_container
		LibraryThingConnector.LB.show({
			mainhtml: initialHTML,
			addClass: 'ltfl_popup'
		});
		return;
		}
	if (!windowPopup.opener)
		{
		windowPopup.opener = self;
		}
	windowPopup.focus();
	return windowPopup;
	};

LibraryThingConnector.utils.hasClass = function (element, cls)
	{
	if (LibraryThingConnector.utils.jQuery)
		{
		return LibraryThingConnector.utils.jQuery(element).hasClass(cls);
		}
	else
		{
		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
		}
	};

LibraryThingConnector.utils.addClass = function (el, classValue)
	{
	if (LibraryThingConnector.utils.jQuery)
		{
		LibraryThingConnector.utils.jQuery(el).addClass(classValue);
		}
	else
		{
		var oldClasses = el.getAttribute('class');
		var newClasses = '';
		if (oldClasses)
			{
			newClasses = oldClasses + ' ' + classValue;
			}
		else
			{
			newClasses = classValue;
			}
		el.setAttribute('class', newClasses);

		}
	};

LibraryThingConnector.utils.removeClass = function (el, classValue)
	{
	var oldClasses = el.getAttribute('class');
	if (oldClasses)
		{
		var newClasses = oldClasses.replace(classValue, '');
		}
	else
		{
		var newClasses = '';
		}
	el.setAttribute('class', newClasses);
	};

if (typeof(LibraryThingConnector) == "undefined")
	{
	LibraryThingConnector = {};
	}

LibraryThingConnector.utils.addToHash = function (hashName, hashValue)
	{
	// need to change hash on window with javascript here (instead of with href attr.)
	// due to use of the <base> html tag
	// by some people
	var currentHash = location.hash;
	if (currentHash)
		{
		var re = new RegExp(hashName + '=' + '(.*)$');
		var matchA = re.exec(currentHash);
		LibraryThingConnector.log('found a hash, need to add ours to it');
		if (matchA)
			{
			LibraryThingConnector.log('existing piece of hash with our ' + hashName);

			}
		else
			{
			LibraryThingConnector.log('no piece of hash with our ' + hashName);
			window.location.hash += hashName + '=' + hashValue;
			}
		LibraryThingConnector.log(matchA);
		}
	// if no existing hash, just add ours
	else
		{
		window.location.hash = hashName + '=' + hashValue;
		}
	};
LibraryThingConnector.utils.getReferer = function ()
	{
	var currentHref = encodeURIComponent(location.href);
	// for some libs, bypass this and use custom passed value for session preservation purposes
	if (LibraryThingConnector.lsa_id == 9)
		{
		var currentHref_el = LibraryThingConnector.utils.Sizzle('#ocln_session');
		if (currentHref_el.length > 0)
			{
			currentHref = currentHref_el[0].textContent || currentHref_el[0].innerHTML;
			currentHref = encodeURIComponent(currentHref);
//			currentHref = LibraryThingConnector.utils.stripHTML(currentHref);
			LibraryThingConnector.log('using custom referer for ocln: ' + currentHref);
			}
		}
	return currentHref;
	};

LibraryThingConnector.utils.isIE = function ()
	{
	return (navigator.appName == "Microsoft Internet Explorer") ? true : false;
	};

LibraryThingConnector.showHideList = function() {
  var showHideLink = LibraryThingConnector.utils.jQuery(this);
  var showAll = showHideLink.data('show-all') || 0;

  // Finds the first previous <ul> sibling of showHideLink
  var list = showHideLink.prev("ul.unbound_list_truncate");
  // Gets the total count of books in the series
  var totalCount = list.find ("> li").length;

  if (showAll) {
    // Show all list items
    list.find ("> li").show();
  }
  else {
    // Show the number of list items specified in the data-list-items attribute
    var numVisible = list.data('list-items');
  if (totalCount <= numVisible) {
	  return false;
  }
    list.find("> li:lt(" +  numVisible    + ")").show ();
    list.find("> li:gt(" + (numVisible - 1) + ")").hide ();
  }

  // Invert the showAll flag
  showAll ^= 1;
  showHideLink.data('show-all', showAll);

  // Update showHidelink text
  if (showAll) {
    showHideLink.text('(show all '+totalCount+')');
  }
  else {
    showHideLink.text('(less)');
  }

  return false;
};

LibraryThingConnector.showTag = function (tag) {
	LibraryThingConnector.log('showTag');
	var params = LibraryThingConnector.getParams();
	params['workcode'] = LibraryThingConnector.workcode;
	params['type'] = 'tagbrowse';
	params['tag'] = tag;

	var _lightbox_params = {
		'title' : LibraryThingConnector.translationstringsA.title_tags
	};
	// alert(LibraryThingConnector.workcode+'/'+tag);

	var url = LibraryThingConnector.BASE_URL + 'syndeticsunbound_lightbox.php?';
	url += LibraryThingConnector.utils.jQuery.param(params);
	LibraryThingConnector.log('final seeMoreSimilar url: ' + url);
	LibraryThingConnector.openLightbox(url, _lightbox_params);
};

/* used as an onload call on img tags within the HTML itself */
function unbound_imgload(img) {
	LibraryThingConnector.utils.jQuery(img).addClass('unbound_loaded');
}


LibraryThingConnector.lazyload_data_images = function(unbound_books_class, delay) {
	try {
		var sections;
		delay = delay || 0;
		if (typeof unbound_books_class != 'undefined') {
			sections = LibraryThingConnector.utils.jQuery('.unbound_books.'+unbound_books_class);
		}
		else {
			// nothing sent in. do all the sections.
			sections = LibraryThingConnector.utils.jQuery('.unbound_lazyload_images .unbound_books, .unbound_books.unbound_lazyload_images');
		}
		//LibraryThingConnector.log(sections);

		setTimeout(function() {
			sections.each(function () {
				var section = LibraryThingConnector.utils.jQuery(this);
				var imagesA = section.find('.unbound_cover[data-unboundsrc]'); // this attr is removed when an image is loaded
				var toLoadA = [];
				imagesA.each(function(index, el) {
					// check visibility
					if (LibraryThingConnector.unbound_checkContainerOverflowVisibility(el, section)) {
						toLoadA.push(el);
					}
					else {
						return false;
					}
				});

				LibraryThingConnector.lazyload_imageA(toLoadA);
			});
		}, delay);
	} catch(err) {
		LibraryThingConnector.log('Oy. There was a problem loading the images, mate!', 10);
		LibraryThingConnector.log(err, 10);
	}
}


LibraryThingConnector.lazyload_imageA = function(imageA) {
	LibraryThingConnector.log('lazyload_imageA loading images: '+imageA.length, 2);
	LibraryThingConnector.utils.jQuery(imageA).each(function() {
		var img = LibraryThingConnector.utils.jQuery(this);
		var datasrc = img.data('unboundsrc');
		var datasrcset = img.data('unboundsrcset');
		if (datasrc.length) {
			img.attr('src', datasrc).removeAttr('data-unboundsrc').removeData('unboundsrc');
		}
		if (datasrcset.length) {
			img.attr('srcset', datasrcset).removeAttr('data-unboundsrcset').removeData('unboundsrcset');
		}

	});
}


LibraryThingConnector.unbound_check_seemores = function() {
	LibraryThingConnector.debug('Checking for seemores');
	try {
		//var imgs = LibraryThingConnector.utils.jQuery('.unbound_cover');
		var viewmores = LibraryThingConnector.utils.jQuery('.unbound_viewmore_row, .unbound_lightbox_viewmore_row');
		viewmores.each(function (i, n) {
			var unbound_lightbox_viewmore_row = LibraryThingConnector.utils.jQuery(this);
			var unbound_books = unbound_lightbox_viewmore_row.siblings('.unbound_books');
			if (unbound_books.length) {
				// LibraryThingConnector.debug(unbound_books);
				var _willShowViewmore = 0;
				unbound_books.find('.unbound_cover').each(function () {
					var visible = LibraryThingConnector.unbound_checkContainerOverflowVisibility(this, unbound_books);
					// LibraryThingConnector.debug('.unbound_cover visible: ' + visible);
					LibraryThingConnector.utils.jQuery(this).attr('data-visible', visible);
					if (visible == 0 && !_willShowViewmore) {
						_willShowViewmore = 1;
						unbound_lightbox_viewmore_row.show();
						return false;
					}
				});
				if (!_willShowViewmore) {
					unbound_lightbox_viewmore_row.hide();
				}
			}
		});
		setTimeout(function() {
			LibraryThingConnector.attachAccessibilityItems();
		},500);
	}
	catch(err) { LibraryThingConnector.error('Problem in unbound_check_seemores.'); }
}

LibraryThingConnector.unbound_checkContainerOverflowVisibility = function (el, container, verbose) {
	// un-jquery the element if needed
	try {
		if (typeof LibraryThingConnector.utils.jQuery === "function") {
			if (el instanceof LibraryThingConnector.utils.jQuery) {
				el = el[0];
			}
			if (container instanceof LibraryThingConnector.utils.jQuery) {
				container = container[0];
			}
		}

		var visible = 1;
		var rect = el.getBoundingClientRect();
		var container_rect = container.getBoundingClientRect();


		if (rect.top >= container_rect.bottom) {
			visible = 0;
		}

		/*
		if (verbose) {
			console.warn({
				visible: visible,
				el: el,
				container: container,
				rect: rect,
				container_rect: container_rect
			});
		}
		*/

		//LibraryThingConnector.utils.jQuery(el).attr('data-checkvisible', visible);
		return visible;
	}
	catch(err) {
		LibraryThingConnector.log('Problem in unbound_checkContainerOverflowVisibility.')
		return 1;
	}
}

/*
LibraryThingConnector.check_lists_seeall = function() {
	//mmlog('su_librarianpower.js->check_lists_seeall()');
	var sections = $J('.libpow_list_section');
	if (sections.length) {
		sections.each(function() {
			var section = $J(this);
			var list = section.find('.libpow_list').first();
			var has_hidden_items = LibraryThingConnector.overflow_items_check(list, 'a');
			var seeall = section.find('.unbound_footer');
			if (has_hidden_items) {
				seeall.css('visibility', 'visible').slideDown();
			}
			else {
				seeall.css('visibility', 'hidden').slideUp();
			}
		});
	}
};
*/

/* utility function to figure out whether a div has hidden content that is overflowing an overflow:hidden. stolen from LT2_main */
LibraryThingConnector.overflow_items_check = function(list, child_selector) {
	list = $J(list);
	list.has_hidden_items = false;
	child_selector = child_selector || '';
	// No way to tell what is showing by height.
	// Maybe we can get the children and use is:visible? Nope.
	// Ok. So maybe we can calculate based on the innerHeight, because it's just the padding if it's not showing.
	// ... but that means we have to calculate based on padding information.
	var children = list.children(child_selector);
	var avg_h = 0;
	var total_h = 0;
	var h_count = 0;
	children.each(function() {
		var c = $J(this);
		total_padding = Math.round(parseInt(c.css('padding-top').replace(/[^-\d\.]/g, '')) + parseInt(c.css('padding-bottom').replace(/[^-\d\.]/g, '')));
		var h = Math.round(c.innerHeight());
		if (total_padding == h) {
			// this guy is not showing. I think.
			list.has_hidden_items = true;
		}
		else {
			h_count++;
			total_h += h;
		}
	});

	return list.has_hidden_items;
}

LibraryThingConnector.checkFormInput = function(e, inputName) {
	var _input = LibraryThingConnector.utils.jQuery('#'+inputName);
	if (_input.val().trim() == '') {
		_input.focus();
		_input.flash();
		if (e.preventDefault) {
			e.preventDefault();
		}
		return false;
	}
	return true;
}

/*
LibraryThingConnector.get_megaDiv = function() {
	if (LibraryThingConnector.megadiv instanceof LibraryThingConnector.utils.jQuery) {
		return LibraryThingConnector.megadiv;
	}
	LibraryThingConnector.megadiv = LibraryThingConnector.utils.jQuery('.unbound_mega');
	return LibraryThingConnector.megadiv;
}
*/


 // used by resize callback below
LibraryThingConnector.resize_viewmore_timeout = {};
LibraryThingConnector.init_seemores = function() {
	LibraryThingConnector.windowWidth = LibraryThingConnector.utils.jQuery(window).width();
	LibraryThingConnector.utils.jQuery(window).resize(function() {
		var _w = LibraryThingConnector.utils.jQuery(window).width();
		/* check for valid resize event (mobile webkit triggers even on some scroll events) */
		if (_w != LibraryThingConnector.windowWidth) {
			LibraryThingConnector.windowWidth = _w; // set it for next time.

			/* Container Queries setup */
			/* See More setup */
			clearTimeout(LibraryThingConnector.resize_viewmore_timeout);

			LibraryThingConnector.resize_viewmore_timeout = setTimeout(function() {
				LibraryThingConnector.log('init_seemores', 2);
				LibraryThingConnector.lazyload_data_images();
				LibraryThingConnector.unbound_check_seemores();

			}, 1250);
		}
	});

	// do it one time at load

	clearTimeout(LibraryThingConnector.resize_viewmore_timeout);
	LibraryThingConnector.resize_viewmore_timeout = setTimeout(function() {
		LibraryThingConnector.lazyload_data_images();
		LibraryThingConnector.unbound_check_seemores();
	}, 350);
}

	LibraryThingConnector.supportHandler = function() {
		var aa = [];
		if (window.CSS) {
			if (window.CSS.supports) {
				// flexbox
				if (window.CSS.supports('display', 'flex')) {
					aa.push('supports-flexbox');
					if (window.CSS.supports('gap', '5px')) {
						aa.push('supports-flexgap');
					} else {
						aa.push('no-flex-gap');
					}
				}
				else {
					aa.push('no-flexbox');
				}

				// grid
				if (window.CSS.supports('display', 'grid')) {
					aa.push('supports-cssgrid');
				}
				else {
					aa.push('no-cssgrid');
				}
			}

			LibraryThingConnector.utils.jQuery(aa).each(function (index, val) {
				LibraryThingConnector.utils.jQuery(".unbound_mega[breakpoints], .unbound_splitdiv[breakpoints]").addClass(val);
			});
		}


	}

/* doc ready */

// setup classes on any element with the 'breakpoints' attributes.
LibraryThingConnector.updateContainerQueries = function()
	{


		// for infa migration
		if (LibraryThingConnector.backend.name == 'enterprise' && LibraryThingConnector.backend.isUnboundInfrastructureMigration())
			{
			LibraryThingConnector.info('NOT running updatecontainerQueries');
			return;
			}
		if (LibraryThingConnector.backend.name == 'ls2')
			{
			return;
			}
		LibraryThingConnector.utils.jQuery(".unbound_mega[breakpoints], .unbound_splitdiv[breakpoints], .unbound_lightbox_content[breakpoints]").not('.unbound_loaded').each(function (index, el)
		{

			// Reset context class
			if (el.getAttribute("class") !== null)
				{
				var classes = el.getAttribute("class").split(" ");
				LibraryThingConnector.utils.jQuery(classes).each(function (index, val)
				{
					if (val.substring(0, 2) == "lt" || val.substring(0, 2) == "gt" || val.substring(0, 2) == "eq")
						{
						LibraryThingConnector.utils.jQuery(el).removeClass(val);
						}
				});
				}

			// Set context class
			var w = el.offsetWidth;
			var landscape = window.matchMedia("(orientation: landscape)").matches;
			if (LibraryThingConnector.utils.jQuery(el).hasClass('unbound_lightbox_content') && LibraryThingConnector.supportsTouch) {

			if (landscape) {
			w = el.offsetHeight;
			}
			else {
			// have to figure out orientation differently here because it doesn't pass through to the XSS iframe.
			_lbh = el.offsetHeight;
			if (_lbh > w) {
			landscape = 1;
			w = _lbh;
			}
			}
			}
			if (w == 0) {
			if (typeof LibraryThingConnector.backend.getContainerForSize == 'function') {
			cel = LibraryThingConnector.backend.getContainerForSize();
			if (typeof cel != 'undefined') {
			w = cel.offsetWidth;
			}
			}
			}
			if (LibraryThingConnector.backend.name == 'enterprise' )
				{
				cel = LibraryThingConnector.backend.getContainerForSize();
				if (typeof cel != 'undefined') {
				w = cel.offsetWidth;
				}

				}
			LibraryThingConnector.containerQueryWidth = w;

			var breakpoinunbound_container_widthts = el.getAttribute("breakpoints").split(" ");
			el.setAttribute('data-unbound_container_width', w);
			LibraryThingConnector.utils.jQuery(breakpoinunbound_container_widthts).each(function (index, val)
			{
				if (w < 10) {
				LibraryThingConnector.debug('Using 0 for container width. Width actually calculated: ' + w, 2);
				LibraryThingConnector.utils.jQuery(el).addClass("gt" + val);
				}
				else {
				if (w < parseFloat(val)) {
				LibraryThingConnector.utils.jQuery(el).addClass("lt" + val);
				} else if (w > parseFloat(val)) {
				LibraryThingConnector.utils.jQuery(el).addClass("gt" + val);
				} else {
				LibraryThingConnector.utils.jQuery(el).addClass("eq" + val);
				}
				}
			});

		});

		LibraryThingConnector.resize_viewmore_timeout = setTimeout(function() {
			LibraryThingConnector.lazyload_data_images();
			LibraryThingConnector.unbound_check_seemores();
			LibraryThingConnector.lineclampSeemore('.unbound_mega, .unbound_splitdiv');
		}, 150);
	}
	LibraryThingConnector.supportsTouch = ("createTouch" in document);
	LibraryThingConnector.initContainerQueries = function() {


	LibraryThingConnector.resize_containerquery_timeout = {};



	if (Unbound_browserClassesAA.brand != 'ie') {
		LibraryThingConnector.utils.jQuery(window).resize(function () {
			LibraryThingConnector.updateContainerQueries();
			clearTimeout(LibraryThingConnector.resize_containerquery_timeout);
			LibraryThingConnector.resize_containerquery_timeout = setTimeout(function () {
				LibraryThingConnector.debug('resize detected, updating view more');
				// TODO: only do this on a detail page as we don't need to do the author block on lightboxes, right?
				LibraryThingConnector.authorblock.updateMoreByButton();
			}, 150);
		});
	}



	// do it one time at load, giving it a little time to set up the dom, just to be safe
	LibraryThingConnector.resize_containerquery_timeout = setTimeout(function () {
		LibraryThingConnector.debug('updating view more');
		LibraryThingConnector.updateContainerQueries();

		// AND one more time, a little later, just to be sure.
		LibraryThingConnector.resize_containerquery_timeout = setTimeout(function () {
			LibraryThingConnector.debug('updating view more');
			LibraryThingConnector.updateContainerQueries();
			// AND one more time, a little later, just to be sure.
			LibraryThingConnector.resize_containerquery_timeout = setTimeout(function () {
				LibraryThingConnector.debug('updating view more');
				LibraryThingConnector.updateContainerQueries();
				// AND one more time, a little later, just to be sure.
				LibraryThingConnector.resize_containerquery_timeout = setTimeout(function () {
					LibraryThingConnector.debug('updating view more');
					LibraryThingConnector.updateContainerQueries();
				}, 2000);
			}, 1000);
		}, 500);
	}, 50);
}


	LibraryThingConnector.lineclampSeemore = function(selector) {
			var $J = LibraryThingConnector.utils.jQuery;
			LibraryThingConnector.log('lt.lineclampSeemore: \'' + selector + '\'');
			var seemores = $J(selector + ' .clamp,[data-clamp],.clamp1,.clamp2,.clamp3,.clamp4,.clamp5,.clamp6,.clamp7,.clamp8,.clamp9,.clamp10,.clamp11,.clamp12');
			LibraryThingConnector.log(seemores);
			seemores.each(function () {
				var that = $J(this);
				if (that.hasClass('clamp_init')) {
					return;
				}

				var sh = this.scrollHeight;
				var oh = this.offsetHeight;

				if (that.is('[data-autoscale]')) {
					if (sh <= oh) {
						that.addClass('clamp clamp_init clamp_no_scaling_needed');
						return;
					} else {
						that.addClass('clamp_scaled');
						var _min_scale = that.data('autoscale') || 80; /* default scaling cut-off percentage */
						var _current_scale = 100;
						while (sh > oh && _current_scale > _min_scale) {
							that.css({'font-size': _current_scale + '%'});
							_current_scale = _current_scale - 2;
							sh = this.scrollHeight;
							oh = this.offsetHeight;
						}
						// Now that we've clipped the title we probably want to set it as the
						// title attribute (as long as it's not already being used) so that
						// users can hover and get the full name.
						if (!that.attr('title')) {
							that.attr('title', that.text());
						}
					}
				}

				if (that.is('[data-noseemore]')) {
					that.addClass('clamp clamp_init');
					return;
				}


				if (sh <= oh) {
					return;
				}
				var id = LT_GetRandomID(6);
				var input = $J('<input type="checkbox" id="' + id + '" class="clamp_seemore_input">');
				var label = $J('<div class="clamp_seemore_label_container"><label role="button" for="' + id + '" class="clamp_seemore_label">(' + LibraryThing.ltstrings.show_more.toLowerCase() + ')</label></div>');
				that.addClass('clamp clamp_init');
				that.wrap('<div class="clampwrap">');
				that.before(input);
				that.after(label);
				this.classList[sh > oh ? 'add' : 'remove']('truncated');
			});
		};


LibraryThingConnector.authorblock = {}
LibraryThingConnector.authorblock.updateMoreByButton = function() {
	try {
		//var imgs = LibraryThingConnector.utils.jQuery('.unbound_cover');
		var _button = LibraryThingConnector.utils.jQuery('.unbound_author_content .unbound_footer');
		LibraryThingConnector.utils.jQuery(_button).each(function (i, n) {
			var unbound_lightbox_viewmore_row = LibraryThingConnector.utils.jQuery(this);
			unbound_lightbox_viewmore_row.hide();
			var unbound_books = unbound_lightbox_viewmore_row.siblings('.unbound_author_content .unbound_books');
			if (unbound_books.length) {
				//LibraryThingConnector.warn(unbound_books);
				unbound_books.find('.unbound_cover').each(function () {
					var visible = LibraryThingConnector.unbound_checkContainerOverflowVisibility(this, unbound_books);
					if (visible == 0) {
						//LibraryThingConnector.log(this);
						unbound_lightbox_viewmore_row.show();
					}
				});
			}
		});
	}
	catch(err) {
		LibraryThingConnector.error(err);
	}
	return false;
};

// check top and bottom positions to see if in view
LibraryThingConnector.utils.isInViewport = function(el)
{
if (!el)
	{
	return;
	}
	var elementTop = LibraryThingConnector.utils.jQuery(el).offset().top;
    var elementBottom = elementTop + LibraryThingConnector.utils.jQuery(el).outerHeight();

    var viewportTop = LibraryThingConnector.utils.jQuery(window).scrollTop();
    var viewportBottom = viewportTop + LibraryThingConnector.utils.jQuery(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};
/*
 from jquery.truncator.js
 */
LibraryThingConnector.utils.truncateText = function (text, max_length, ellipses)
	{
	if( typeof ellipses == 'undefined' )
		{
		ellipses = '...';
		}
	text = text.replace(/^ /, '');  // node had trailing whitespace.
	text = text.replace(/...$/, '');  // node already had ellipses
	trailing_whitespace = !!text.match(/ $/);
	// Truncate text if it's longer then max length
	if (text.length >= max_length)
		{
		// Ensure text is not truncated in the middle of a word
		if (text.charAt(max_length - 1) != " ")
			{
			var next_space = text.indexOf(" ", max_length);
			text = next_space > 0 ? text.slice(0, next_space) : text;
			}
		else
			{
			var text = text.slice(0, max_length);
			}
		// Ensure HTML entities are encoded
		// http://debuggable.com/posts/encode-html-entities-with-jquery:480f4dd6-13cc-4ce9-8071-4710cbdd56cb
		text = $('<div/>').text(text).html();
		text += ellipses;
		}
	return text;
	};

LibraryThingConnector.sub_in_translationstringsA = function () {
	//return false;
	LibraryThingConnector.info('sub_in_translationstringsA');
	LibraryThingConnector.debug(LibraryThingConnector.translationstringsA);

	var current_megadiv_el = LibraryThingConnector.getMegaDivEl();
	var unbound_headersA = LibraryThingConnector.utils.jQuery('h3.unbound_header').each(function (i, n) {
		var enrichment_type = LibraryThingConnector.extractEnrichmentTypeFromElement(n);
		var title_type = 'title_' + enrichment_type;
		var sd_type = 'su_sd_title_' + enrichment_type;
		LibraryThingConnector.debug('translating enrichment_type header: ' + enrichment_type);
		// do not scope to megadiv: also catch splitdiv headers
		LibraryThingConnector.utils.jQuery('h3.unbound_' + enrichment_type + '_header').html(
			LibraryThingConnector.translationstringsA[title_type]
		);
		LibraryThingConnector.utils.jQuery('li.unbound_nav_item_' + enrichment_type + ' a',current_megadiv_el).html(
			LibraryThingConnector.translationstringsA[title_type]
		);
		LibraryThingConnector.utils.jQuery('a.'+sd_type,current_megadiv_el).html(
			LibraryThingConnector.translationstringsA[title_type]
		);
	}); // h3.unbound_header
	// lists abbreviated form
	LibraryThingConnector.utils.jQuery('li.unbound_nav_item_lists a',current_megadiv_el).html(
		// LibraryThingConnector.translationstringsA['nav_title_lists']
		'Librarian Lists'
);
	LibraryThingConnector.utils.jQuery('.unbound_truncate_sumore',current_megadiv_el).html(LibraryThingConnector.translationstringsA.readmore);
	LibraryThingConnector.utils.jQuery('#unbound_ebook_alert', current_megadiv_el).find('p').html(LibraryThingConnector.translationstringsA.eresources_message_text);
	LibraryThingConnector.utils.jQuery('.unbound_truncate_suless',current_megadiv_el).html(LibraryThingConnector.translationstringsA.less);
	LibraryThingConnector.utils.jQuery('.unbound_hover_link_button',current_megadiv_el).html(LibraryThingConnector.translationstringsA.checkavailability);
	LibraryThingConnector.utils.jQuery('#unbound_services_link',current_megadiv_el).html(LibraryThingConnector.translationstringsA.explore); // primo
	LibraryThingConnector.utils.jQuery('.unbound_lookinside_nav_item:contains("Table of Contents") a', current_megadiv_el).html(LibraryThingConnector.translationstringsA.seefulltableofcontents);
	LibraryThingConnector.utils.jQuery('.unbound_lookinside_nav_item:contains("Cover") a', current_megadiv_el).html(LibraryThingConnector.translationstringsA.cover);
	LibraryThingConnector.utils.jQuery('.unbound_mega_header,#unbound_section_title',current_megadiv_el).html(LibraryThingConnector.translationstringsA.morefromsyndeticsunbound); // primo
	LibraryThingConnector.utils.jQuery('.recommendations-wrapper .section-title').html(LibraryThingConnector.translationstringsA.related_reading); // primo
	if( typeof LibraryThingConnector.backend_translationstringsA['morefromsyndeticsunbound'] !== 'undefined')
		{
		LibraryThingConnector.info('found backend_translationstringsA for morefromsyndeticsunbound:'+LibraryThingConnector.backend_translationstringsA['morefromsyndeticsunbound']);
		LibraryThingConnector.utils.jQuery('.unbound_mega_header,#unbound_section_title').html(LibraryThingConnector.backend_translationstringsA['morefromsyndeticsunbound']); // primo
		}
	if( typeof LibraryThingConnector.backend_translationstringsA['explore'] !== 'undefined')
		{
		LibraryThingConnector.info('found backend_translationstringsA for explore:'+LibraryThingConnector.backend_translationstringsA['explore']);
		LibraryThingConnector.utils.jQuery('#unbound_services_link').html(LibraryThingConnector.backend_translationstringsA['explore']); // primo
		}

	LibraryThingConnector.attachExpands(); // re-run this so that padding is set correctly with new strings
}



/* brought over from lt_utility.js */
// =======================================
// Generate Unique/Random ID for page URLs (ch)
function LT_getRandomNumber(range)
{
	return Math.floor(Math.random() * range);
}

function LT_getRandomChar()
{
	var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
	return chars.substr( LT_getRandomNumber(62), 1 );
}

function LT_GetRandomID(size)
{
	var str = "";
	for(var i = 0; i < size; i++)
	{
		str += LT_getRandomChar();
	}
	return str;
}/* including file: /var/www/html/syndeticsunbound/connector/syndeticsunbound_connector_public.js *//**
 * @version 1.0.0
 * @namespace LibraryThingConnector
 */
// PUBLIC API
/**
 * Initialize and run Syndetics Unbound with the given set of bibliographic metadata.
 * @property
 * @param {Object} bib_metadata
 * @param {string=} bib_metadata.title
 * Title of the item
 * @param {string=} bib_metadata.author
 * Author of the item
 * @param {string|string[]=} bib_metadata.isbn
 * ISBN standard identifier(s) of the item.
 * @param {string|string[]=} bib_metadata.upc
 * UPC standard identifier(s) of the item.
 * @param {string|string[]=} bib_metadata.issn
 * ISSN standard identifier(s) of the item.
 * @param {string=} bib_metadata.callnumber
 * Call number of the item.
 * @param {string=} bib_metadata.id
 * Accession id of the item.
 * @param {string=} bib_metadata.unbound_container_id
 * Selector of the containing HTML element where Syndetics Unbound will place itself.
 * @param {string=} bib_metadata.unbound_containing_selector
 * jQuery selector of the HTML element container to scope Syndetics Unbound actions to.
 * @param {string|callback=} bib_metadata.unbound_run_link_function
 * Custom function name which Syndetics Unbound should call to link to another item in the catalog.
 * @param {boolean=} bib_metadata.usemegadiv - Whether to force use or not of megadiv.
 * @param {string=} bib_metadata.sectionTitle - string to use instead of "More by Syndetics Unbound"
 * @param {string=} bib_metadata.buttonTitle - string of "Explore" button, if used
 * Force Syndetics Unbound to use or not use the megadiv. If not using the megadiv, rely on split divs.
 * @example
 * // returns "ult_1561699964"
 * LibraryThingConnector.runUnboundWithMetadata({
 *     "title":"the bib records title",
       "author":"John Smith",
       "isbn":"9781408845677",
       "upc":"9781408845677",
       "issn":"2049-3630",
       "callnumber":"HM206 .D48 1999",
       "id":"1234",
       "unbound_container_id":"#syndetics_unbound_area",
       "unbound_containing_selector":"#unbound_container",
       "run_link_function":"custom_function_name_for_linking_to_new_records",
       "usemegadiv":false,
       "sectionTitle":"See More from Syndetics Unbound",
       "buttonTitle":"Explore"
 });
 * @returns {su_session} An id representing the current run of Syndetics Unbound.
 */
LibraryThingConnector.runUnboundWithMetadata = function (bib_metadata) {
	LibraryThingConnector.info('PUBLIC runUnboundWithMetadata');
	if (bib_metadata)
		{
		LibraryThingConnector.init_variables();
		LibraryThingConnector.info('forcing pagetype: full');
		LibraryThingConnector.pagetype = 'full';

		LibraryThingConnector.info('setting metadata via passed in bib_metadata:');
		LibraryThingConnector.info(bib_metadata);

		var _metadata = {};
		_metadata.title = bib_metadata.title;
		_metadata.author = bib_metadata.author;
		if (typeof bib_metadata.isbn === "string")
			{
			cleaned_isbns = LibraryThingConnector.utils.extract_ISBNs(bib_metadata.isbn);
			if( cleaned_isbns.length )
				{
				bib_metadata.isbn = cleaned_isbns[0];
				}
			_metadata.isbns = [bib_metadata.isbn];
			}
		else
			{
			if (typeof bib_metadata.isbn === "object")
				{
				_metadata.isbns = bib_metadata.isbn;
				}
			}
		if (typeof bib_metadata.upc === "string")
			{
			_metadata.upc = [bib_metadata.upc];
			}
		else
			{
			if (typeof bib_metadata.upc === "object")
				{
				_metadata.upc = bib_metadata.upc;
				}
			}
		if (typeof bib_metadata.call_number !== 'undefined')
			{
			LibraryThingConnector.info('runUnboundWithMetadata call_number found');
			_metadata.call_nums = [bib_metadata.call_number];
			_metadata.itemInfo = {
				'Holdings_table': [
					{
						callnumber: bib_metadata.call_number
					}
				]
			};

			}
		else
			{
			if (typeof bib_metadata.callnumber !== 'undefined')
				{
				LibraryThingConnector.info('runUnboundWithMetadata callnumber found');
				var bib_metadata_callnumber = bib_metadata.callnumber;
				if (typeof LibraryThingConnector.backend.mungeCallnumber !== 'undefined')
					{
					bib_metadata_callnumber = LibraryThingConnector.backend.mungeCallnumber(bib_metadata_callnumber);
					}
				_metadata.call_nums = [bib_metadata_callnumber];
				_metadata.itemInfo = {
					'Holdings_table': [
						{
							callnumber: bib_metadata_callnumber
						}
					]
				};

				}
			else
				{
				if (typeof bib_metadata.itemInfo !== 'undefined')
					{
					LibraryThingConnector.info('runUnboundWithMetadata itemInfo found');
					if (typeof bib_metadata.itemInfo.Holdings_table[0].callnumber !== 'undefined')
						{
						var callnumber = bib_metadata.itemInfo.Holdings_table[0].callnumber;
						if (typeof LibraryThingConnector.backend.mungeCallnumber !== 'undefined')
							{
							LibraryThingConnector.info('calling mungeCallnumber');
							callnumber = LibraryThingConnector.backend.mungeCallnumber(callnumber);

							}
						_metadata.call_nums = [callnumber];
						}
					_metadata.itemInfo = bib_metadata.itemInfo;
					}
				}
			}
		if (typeof bib_metadata.id !== 'undefined' && bib_metadata.id != '')
			{
			_metadata.accession = bib_metadata.id;
			}

		if (typeof bib_metadata.unbound_container_id !== 'undefined' && bib_metadata.unbound_container_id != '')
			{
			_metadata.unbound_insertNode = bib_metadata.unbound_container_id;
			}
		if (typeof bib_metadata.unbound_containing_selector !== 'undefined' && bib_metadata.unbound_containing_selector != '')
			{
			_metadata.containing_el = bib_metadata.unbound_containing_selector;
			if (LibraryThingConnector.utils.jQuery(_metadata.containing_el).length)
				{
				LibraryThingConnector.info('found el for unbound_containing_selector:' + bib_metadata.unbound_containing_selector);
				LibraryThingConnector.containingEl = LibraryThingConnector.utils.jQuery(_metadata.containing_el).get(0);
				LibraryThingConnector.debug(LibraryThingConnector.containingEl);
				}
			}
		if (typeof bib_metadata.unbound_run_link_function == 'function')
			{
			LibraryThingConnector.info('unbound_run_link_function found, using for runLink');
			LibraryThingConnector.runLink = bib_metadata.unbound_run_link_function;
			}
		else
			{
			if (typeof bib_metadata.unbound_run_link_function == 'string' && bib_metadata.unbound_run_link_function != '')
				{
				LibraryThingConnector.info('unbound_run_link_function string found, converting to function and using for runLink');
				LibraryThingConnector.runLink = window[bib_metadata.unbound_run_link_function];
				}
			}
		// force using or not using megadiv
		if (typeof bib_metadata.usemegadiv !== 'undefined' && LibraryThingConnector.utils.jQuery.isNumeric(bib_metadata.usemegadiv))
			{
			LibraryThingConnector.info('found bib_metadata usemegadiv, setting it in settings:' + bib_metadata.usemegadiv);
			LibraryThingConnector.config.settingsA.advancedA.usemegadiv = bib_metadata.usemegadiv;
			}

		if( typeof LibraryThingConnector.backend.getCoverURL !== 'undefined')
			{
			LibraryThingConnector.info('getCoverURL found, including coverurl in bib_metadata');
			_metadata['coverurl'] = LibraryThingConnector.backend.getCoverURL()['coverurl'];
			_metadata['coverurl_el'] = LibraryThingConnector.backend.getCoverURL()['coverurl_el'];

			}
		LibraryThingConnector.setMetadata(_metadata, 'runUnboundWithMetadata');

		// handle any translatable strings pass in
		if (typeof bib_metadata['buttonTitle'] != 'undefined')
			{
			LibraryThingConnector.info('using buttonTitle for explore string:' + bib_metadata['buttonTitle']);
			LibraryThingConnector.backend_translationstringsA['explore'] = bib_metadata['buttonTitle'];
			}
		if (typeof bib_metadata['sectionTitle'] != 'undefined')
			{
			LibraryThingConnector.info('using sectionTitle for more by syndetics unbound string:' + bib_metadata['buttonTitle']);
			LibraryThingConnector.backend_translationstringsA['morefromsyndeticsunbound'] = bib_metadata['sectionTitle'];
			}
		LibraryThingConnector.info(LibraryThingConnector.translationstringsA.explore);
		LibraryThingConnector.info(LibraryThingConnector.translationstringsA.morefromsyndeticsunbound);

		LibraryThingConnector.info('running init');
		LibraryThingConnector.init();
		}
	else
		{
		LibraryThingConnector.warning('no bib_metadata passed into LibraryThingConnector.runUnboundWithMetadata, not running');
		}
	return LibraryThingConnector.su_session; // serves as id to match up unboundLoaded
};

/** Clean up LibraryThingConnector and associated elements. Removes megadiv, split divs, hover div, attached events, nullifies associated javascript objects.
 * @example
 * // returns null
 * LibraryThingConnector.destroy();
 */
// PUBLIC API
LibraryThingConnector.destroy = function () {
	LibraryThingConnector.info('PUBLIC destroy');

	// megadiv
	LibraryThingConnector.info('destroy: removing megadiv');
	var megaDivEl = LibraryThingConnector.getMegaDivEl();
	LibraryThingConnector.utils.jQuery(megaDivEl).remove();

	// split divs
	LibraryThingConnector.info('destroy: removing .unbound_splitdiv');
	LibraryThingConnector.utils.jQuery('.unbound_splitdiv').remove();

	// hover
	LibraryThingConnector.info('destroy: removing #unbound_hover');
	LibraryThingConnector.utils.jQuery('#unbound_hover').remove();

	// events
	LibraryThingConnector.utils.jQuery(document).unbind("DOMContentLoaded");

	// nullify our objects
	window.LibraryThing = null;
	window.LT_get_widget_logic = null;
	window.unbound_imgload = null;
	window.SU_loadStarted = null;
	window.doLibraryThingConnector = null;
	window.Unbound_browserClassesAA = null;

	// remove LibraryThingConnector object
	LibraryThingConnector = null;

	// reset global loaded var so a reload of initiator will run
	delete window.Unbound_loaded;
};

/**
 * Is the enrichment shown on the page.
 * @param {string} enrichment
 * the enrichment short name (eg similars, tags, reviews)
 * @param {su_session=} su_session
 * The Unbound session id to check for.
 * @example
 * // returns true
 * LibraryThingConnector.isEnrichmentShown('similars');
 * @returns {boolean} whether the enrichment is currently shown
 */
// PUBLIC API
LibraryThingConnector.isEnrichmentShown = function (enrichment,su_session) {
	var stats_key = 'unbound_' + enrichment + '_content';
	if (typeof su_session !== 'undefined' && typeof LibraryThingConnector.sessions[su_session] !== 'undefined' && typeof LibraryThingConnector.sessions[su_session].stats !== 'undefined')
		{
		return typeof LibraryThingConnector.sessions[su_session].stats[stats_key] !== 'undefined';
		}
	else
		{
		LibraryThingConnector.info('PUBLIC isEnrichmentShown');
		LibraryThingConnector.info('checking if ' + enrichment + ' is shown');
		var stats_key = 'unbound_' + enrichment + '_content';
		return typeof LibraryThingConnector.stats[stats_key] !== 'undefined';
		}
};

// PUBLIC API
/**
 * Returns list of enrichment shortnames which are turned on via customer admin portal.
 * @example
 * // returns ['similars','rcl','altmetrics','tags','summary']
 * LibraryThingConnector.enrichmentsOn();
 * @returns {Array} List of enrichments turned on.
 */
LibraryThingConnector.enrichmentsOn = function () {
	LibraryThingConnector.info('PUBLIC enrichmentsOn');
	var onA = [];
	if (LibraryThingConnector.enrichments_disabledB)
		{
		return [];
		}

	var enrichments_on = LibraryThingConnector.utils.enrichments_on();

	LibraryThingConnector.utils.jQuery(enrichments_on).each(function (i, n) {
		var enrichment_type = LibraryThingConnector.extractEnrichmentTypeFromClass(n);
		onA.push(enrichment_type);
	});

	return onA;
};

/**
 * List of which unbound enrichments are shown on the page.
 *  @param {su_session=} su_session
 *  The Unbound session id to use. Defaults to current session of runUnboundWithMetadata() or .init().
 * @example
 * // returns ['similars','tags']
 * LibraryThingConnector.enrichmentsShown();
 * @returns {Array} List of enrichments on the page.
 */
// PUBLIC API
LibraryThingConnector.enrichmentsShown = function (su_session) {
	if (typeof su_session !== 'undefined' && typeof LibraryThingConnector.sessions[su_session] !== 'undefined' && typeof LibraryThingConnector.sessions[su_session].stats !== 'undefined')
		{
		LibraryThingConnector.info('numberOfEnhancementsShown: session:' + su_session);
		return LibraryThingConnector.sessions[su_session].stats.enrichments_shown;
		}
	else
		{
		return LibraryThingConnector.stats.enrichments_shown;
		}
};

/**
 * Get all enrichments from page. Contains an array of enrichment short names.
 * @example
 * // returns ['similars','tags','reviews','author']
 * LibraryThingConnector.allEnrichments();
 * @returns {Array} List of enrichments embedded in the HTML.
 */
LibraryThingConnector.allEnrichments = function () {
	LibraryThingConnector.info('PUBLIC allEnrichments');
	var enrichments = [];
	var els = LibraryThingConnector.utils.find_unbound_elements();

	// elements in megadiv
	LibraryThingConnector.utils.jQuery.each(els, function (i, el) {
		var enrichment_type = LibraryThingConnector.extractEnrichmentTypeFromClass(el);
		if (enrichment_type)
			{
			enrichments.push(enrichment_type);
			}
	});

	// split divs
	var split_els = LibraryThingConnector.utils.find_unbound_split_elements();
	LibraryThingConnector.utils.jQuery.each(split_els, function (i, el) {
		var enrichment_type = LibraryThingConnector.extractEnrichmentTypeFromClass(el);
		if (enrichment_type)
			{
			enrichments.push(enrichment_type);
			}
	});

	return enrichments;
};

// PUBLIC API
/**
 *  Get the number of enrichments shown on the page.
 *  @param {su_session=} su_session
 *  The Unbound session id to use. Defaults to current session of runUnboundWithMetadata() or .init().
 *  @example
 *  // returns 3
 *  LibraryThingConnector.numberOfEnhancementsShown();
 * @returns {number} Number of enrichments on the page.
 */
LibraryThingConnector.numberOfEnhancementsShown = function (su_session) {
	if (typeof su_session !== 'undefined' && typeof LibraryThingConnector.sessions[su_session] !== 'undefined' && typeof LibraryThingConnector.sessions[su_session].stats !== 'undefined')
		{
		LibraryThingConnector.info('numberOfEnhancementsShown: session:' + su_session);
		return LibraryThingConnector.sessions[su_session].stats.enrichments_count;
		}
	if (LibraryThingConnector.stats && LibraryThingConnector.stats.enrichments_count)
		{
		return LibraryThingConnector.stats.enrichments_count;
		}
	else
		{
		if (LibraryThingConnector.utils.jQuery('.unbound_element:visible').length)
			{
			return LibraryThingConnector.utils.jQuery('.unbound_element:visible').length;
			}
		else
			{
			return 0;
			}
		}
};

/**
 * An Error reported by LibraryThingConnector
 * @typedef {Object} LibraryThingConnectorError
 * @property {string} code - Error code
 * @property {string} message - Error message
 */

/**
 * Error codes
 */
LibraryThingConnector.error_types = {
	/**
	 * @property {LibraryThingConnectorError} WidgetsPQFailed - Widgets content from Proquest failed.
	 */
	WidgetsPQFailed: {code: 1, message: "Unbound content failed"},
	/**
	 * @property {LibraryThingConnectorError} WidgetsLTFailed - Widgets content from LibraryThing.com failed.
	 */
	WidgetsLTFailed: {code: 2, message: "Unbound content failed"},
	/**
	 * @property {LibraryThingConnectorError} HoverFailed - Hover data retrieval failed.
	 */
	HoverFailed: {code: 3, message: "Hover data failed"},
	/**
	 * @property {LibraryThingConnectorError} AuthorImageFailed - Author data/image retrieval failed.
	 */
	AuthorImageFailed: {code: 4, message: "Author data failed"},
	/**
	 * @property {LibraryThingConnectorError} HoverStarsFailed - Hover stars retrieval failed.
	 */
	HoverStarsFailed: {code: 5, message: "Stars data failed"},
	/**
	 * @property {LibraryThingConnectorError} StatsFailed - Stats recording request failed.
	 */
	StatsFailed: {code: 6, message: "Stats recording failed"},
	/**
	 * @property {LibraryThingConnectorError} SearchResultsAPIFailed - Search result data retrieval failed.
	 */
	SearchResultsAPIFailed: {code: 7, message: "Search results failed"},
	/**
	 * @property {LibraryThingConnectorError} LTLinkingIsbnAPIFailed - Linking by isbn check failed.
	 */
	LTLinkingIsbnAPIFailed: {code: 8, message: "Linking isbn failed"},
};

/**
 * Get any errors set by LibraryThingConnector.
 *  @param {su_session=} su_session
 *  The Unbound session id to use.  Defaults to current session of runUnboundWithMetadata() or .init().
 * @example
 * // returns [{code:1,message:"Content script failed to load"}
 * LibraryThingConnector.getErrors();
 * @returns {LibraryThingConnectorError[]}
 */
LibraryThingConnector.getErrors = function (su_session) {
	if (typeof su_session !== 'undefined' && typeof LibraryThingConnector.sessions[su_session] !== 'undefined' && typeof LibraryThingConnector.sessions[su_session].stats !== 'undefined')
		{
		LibraryThingConnector.info('numberOfEnhancementsShown: session:' + su_session);
		return LibraryThingConnector.sessions[su_session].errors;
		}
	else
		{
		return LibraryThingConnector.errors;
		}
};

/**
 *
 */
var enrichment_types = {
	/**
	 * @property {Object.<string,string>} summary - Summary enrichment
	 */
	'Summary':'summary',
	/**
	 * @property {Object.<string,string>} audiovideo - Summary for Video and Music enrichment
	 */
	'Summary for Video and Music': 'audiovideo',
	/**
	 * @property {Object.<string,string>} game - Summary for Video Games enrichment
	 */
	'Summary for Video Games': 'game',
	/**
	 * @property {Object.<string,string>} author - About The Author enrichment
	 */
	'About The Author': 'author',
	/**
	 * @property {Object.<string,string>} lookinside - Look Inside enrichment
	 */
	'Look Inside': 'lookinside',
	/**
	 * @property {Object.<string,string>} series - Series enrichment
	 */
	'Series': 'series',
	/**
	 * @property {Object.<string,string>} similar - You May Also Like enrichment
	 */
	'You May Also Like': 'similar',
	/**
	 * @property {Object.<string,string>} reviews - Professional Reviews enrichment
	 */
	'Professional Reviews': 'reviews',
	/**
	 * @property {Object.<string,string>} patronreviews - Reader Reviews enrichment
	 */
	'Reader Reviews': 'patronreviews',
	/**
	 * @property {Object.<string,string>} other - Also Available As enrichment
	 */
	'Also Available As': 'other',
	/**
	 * @property {Object.<string,string>} tags - Tags enrichment
	 */
	'Tags': 'tags',
	/**
	 * @property {Object.<string,string>} bookprofile - Book Profile enrichment
	 */
	'Book Profile': 'bookprofile',
	/**
	 * @property {Object.<string,string>} awards - Awards enrichment
	 */
	'Awards': 'awards',
	/**
	 * @property {Object.<string,string>} shelfbrowse - Browse Shelf enrichment
	 */
	'Browse Shelf': 'shelfbrowse',
	/**
	 * @property {Object.<string,string>} rcl - RCL Core Titles enrichment
	 */
	'RCL Core Titles': 'rcl',
	/**
	 * @property {Object.<string,string>} altmetrics - Altmetrics enrichment
	 */
	'Altmetrics': 'altmetrics',
	/**
	 * @property {Object.<string,string>} readinglevel - Reading Level enrichment
	 */
	'Reading Level': 'readinglevel',
};
/**
 * @typedef su_session {string} The opaque identifier returned from LibraryThingConnector.runUnboundWithMetadata() and set at initial load of initiator.php
 *
 */
/* including file: /var/www/html/syndeticsunbound/connector/syndeticsunbound_stackmap.js */LibraryThingConnector.widgets.stackMap = {};
LibraryThingConnector.widgets.wiki = {};
LibraryThingConnector.widgets.stackMap.gotParams = new Array();
LibraryThingConnector.widgets.stackMap.paramsA = new Array();

LibraryThingConnector.widgets.stackMap.showStackMap = function (paramsAA) {
	LibraryThingConnector.debug('showStackMap');
	LibraryThingConnector.debug(paramsAA);
	var connnectorParams = LibraryThingConnector.getParams();
	if (paramsAA['el'])
		{
		delete paramsAA['el'];
		}
	var params = {};
	if (paramsAA['callnumber'])
		{
		// added this to remove &nbsp; at the start and end of callnumber in IE (ch)
		paramsAA['callnumber'] = paramsAA['callnumber'].replace(/\&nbsp\;/i, '').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		params['workcode'] = LibraryThingConnector.workcode;
		params['type'] = 'stackmap';
		params['product'] = 'unbound';
		params['a_id'] = LibraryThingConnector.a_id;
		params['id'] = LibraryThingConnector.lsa_id;
		params['enrichment_type'] = 'stackmap';
		params['lstoken'] = LibraryThingConnector.lsa_id;
		params['author'] = connnectorParams['author'];
		params['title'] = connnectorParams['title'];
		var paramsStr = LibraryThingConnector.utils.serialize(paramsAA);
		LibraryThingConnector.log('paramsStr');
		LibraryThingConnector.log(paramsStr);
		params['stackmap_data'] = encodeURIComponent(paramsStr);
		params['client'] = LibraryThingConnector.client;

		if (typeof LibraryThingConnector.metadata.first_isbn !== 'undefined')
			{
			params['winning_isbn'] = LibraryThingConnector.metadata.first_isbn;
			}

		if (typeof LibraryThingConnector.isbns !== 'undefined')
			{
			params['isbn'] = LibraryThingConnector.isbns.join();
			}


		var _lightbox_params = {
			title: 'Stack Map',
		};

		// var url = LibraryThingConnector.BASE_URL_RW + 'forlibraries/stackmap.php?';
		// url += '&id=' + LibraryThingConnector.lsid;
		// url += '&stackmap_data=' + encodeURIComponent(searchValue);
		if (LibraryThingConnector.debug)
			{
			LibraryThingConnector.utils.addDebugWarningPanelMsg('<a target="_blank" href="' + url + '">View stackmap in new window</a>');
			}
		var url = LibraryThingConnector.LTFL_BASE_URL + 'stackmap.php?';
		url += LibraryThingConnector.utils.jQuery.param(params);
		LibraryThingConnector.debug('final seeMoreReviews url: ' + url);
		LibraryThingConnector.openLightbox(url, _lightbox_params);
		}
};

LibraryThingConnector.widgets.runStackMap = function() {
	LibraryThingConnector.log('doing stack map');
	var _metadata = LibraryThingConnector.metadata;
	LibraryThingConnector.log(_metadata);
	LibraryThingConnector.info('stackmap.paramsA length:'+ LibraryThingConnector.widgets.stackMap.paramsA.length);
	for (var i = 0; i < LibraryThingConnector.widgets.stackMap.paramsA.length; i++)
		{
		var params = LibraryThingConnector.widgets.stackMap.paramsA[i];
		LibraryThingConnector.info('stackmap handling param:'+i);
		LibraryThingConnector.info(params);
		var el = params['el'];
		// check if we've already added StackMap link here, if so, don't add again
		var alreadyAdded = LibraryThingConnector.utils.hasClass(el, 'ltfl_processed_item');
		var found_stackmap_link = LibraryThingConnector.utils.jQuery('.ltfl_stackmap_container', el);
		if (alreadyAdded || found_stackmap_link.length)
			{
			LibraryThingConnector.log('found stackmap link here already, not adding another');
			continue;
			}
		// add marker class to know we've done it
		LibraryThingConnector.utils.addClass(el, 'ltfl_processed_item');
		LibraryThingConnector.log(el);
		LibraryThingConnector.log('run stackmap: params');
		LibraryThingConnector.log(params);
		var id = "stackMap_" + i;
		var paramsInCall = "LibraryThingConnector.widgets.stackMap.paramsA[" + i + "]";
		LibraryThingConnector.log('paramsInCall');
		LibraryThingConnector.log(paramsInCall);
		// I had to remove the "return false;" in the following statement because we're inlining it in the href due to IE bug. (ch)
		var onclick = "LibraryThingConnector.widgets.stackMap.showStackMap(" + paramsInCall + ");";
		LibraryThingConnector.log('onclick');
		LibraryThingConnector.log(onclick);
		/*
		 // injecting firebug lite. useful for debugging in IE.
		 var fb = document.createElement('script');
		 fb.setAttribute('type', 'text/javascript');
		 fb.setAttribute('src', 'https://getfirebug.com/releases/lite/1.3/firebug-lite.js');
		 el.appendChild(fb);
		 */
		var containing_el = document.createElement('span');
		containing_el.setAttribute('id', "ltfl_stackmap_container_" + i);
		containing_el.setAttribute('class', 'ltfl_stackmap_container');
		// Turned this off because IE wasn't getting it (ch)
		//containing_el.setAttribute('onclick',onclick+' return false; ');
		var button_text = LibraryThingConnector.ltflconfig.ls_widgets_stackmap.lswst_button_text;
		var link_text = LibraryThingConnector.ltflconfig.ls_widgets_stackmap.lswst_link_text;
		if( !button_text )
			{
			button_text = 'View Stack Map';
			}
		if( !link_text )
			{
			button_text = 'View Stack Map';
			}
		var stackmap_icon = LibraryThingConnector.ltflconfig.stackmapiconsAA[LibraryThingConnector.ltflconfig.ls_widgets_stackmap.lswst_iconchoice];
		if (stackmap_icon == "button")
			{
			var button_el = document.createElement('button');
			button_el.setAttribute('class', 'ltfl_stackmap_button');
			var textEl = document.createTextNode(button_text);
			button_el.appendChild(textEl);
			containing_el.appendChild(button_el);
			}
		else
			{
			if (stackmap_icon)
				{
				var img_el = document.createElement('img');
				img_el.setAttribute('src', stackmap_icon);
				img_el.setAttribute('class', 'ltfl_lswst_iconchoice');
				containing_el.appendChild(img_el);
				}
			var anchor = document.createElement('a');
			//anchor.setAttribute('href', '#');
			//anchor.setAttribute('onclick',onclick);
			// Neither of the above worked. Inlining in the href instead. (for IE) (ch)
			anchor.setAttribute('href', 'javascript:' + onclick);
			anchor.setAttribute('id', id);
			anchor.setAttribute('class', 'ltfl_stackmap');
			var textEl = document.createTextNode(link_text);
			anchor.appendChild(textEl);
			containing_el.appendChild(anchor);
			LibraryThingConnector.log('stack map anchor');
			LibraryThingConnector.log(anchor);

			}
		// TOOD: figure if we can always use td or not in this selector.  or have to go for first child
		var linkcolumn = LibraryThingConnector.ltflconfig.ls_widgets_stackmap.lswst_linkcolumn - 1; // config setting is 1-indexed but we need 0-indexed
		var numColumns = LibraryThingConnector.utils.Sizzle('td', el).length;
		try
			{
			if (LibraryThingConnector.a_id == 612)
				{
				LibraryThingConnector.info('inserting stackmap into .contentType')
				LibraryThingConnector.utils.jQuery(el).append(containing_el);
				}
			else
				{
				LibraryThingConnector.info('stackmap inserting into non table area');
				}
			} catch (e)
			{
			LibraryThingConnector.info('exception trying to insert stackmap into non table area:');
			LibraryThingConnector.info(e);
			}
		if (numColumns )
			{
			if (linkcolumn != 98 && linkcolumn > numColumns)
				{
				LibraryThingConnector.log('linkcolumn was too big: ');
				LibraryThingConnector.log(linkcolumn);
				linkcolumn = 0;
				}
			// magic number of 99 == add col and put it there
			if (linkcolumn == 98)
				{
				LibraryThingConnector.log('adding new td to end of row to put stackmap into');
				var newTd = document.createElement('td');
				newTd.appendChild(containing_el);
				newTd.id = "stackmap_td_" + i;
				el.appendChild(newTd);
				}
			else
				{
				LibraryThingConnector.log('inserting stackmap column: ' + linkcolumn);
				var tdToInsertIn = LibraryThingConnector.utils.Sizzle('td:eq(' + linkcolumn + ')', el);
				if (tdToInsertIn.length > 0)
					{
					LibraryThingConnector.log(tdToInsertIn);
					var td = tdToInsertIn[0];
					td.appendChild(containing_el);
					}
				}
			}
		}
}
/* loading backend: infiniti*//* including file: /var/www/html/connector/backend_infiniti.php */$infiniti = {};
$infiniti.name = 'infiniti';

$infiniti.getCoverURL = function()
{
	var coverurl = '';
	var el = '';
	var el_selector = LibraryThingConnector.utils.jQuery('img.cover-image');
	if( el_selector.length )
		{
		coverurl = el_selector.attr('src');
		el = el_selector.get(0);
		}

	return {
		'coverurl':coverurl,
		'el':el
	};
};


/*
returns: unknown|full|summary as pagetype
 */
$infiniti.pageTypeDetector = function()
{
	//this is nothing
	//var bodyHTML = document.getElementsByTagName('body')[0].innerHTML;
	var ret = 'unknown';
	if (LibraryThingConnector.utils.jQuery('#ajax-dialog:visible').length)
		{
		ret = 'full';
		}
	else
		{
		ret = 'summary';
		}
	return ret;
};

/*
Unbound/LTFL parse isbn, title, author from someNode
 */
$infiniti.extractMetadata = function(someNode)
{
	//LibraryThingConnector.log('Extracting metadata from ' + someNode);
	var ret = new Array();
	ret['isbns'] = LibraryThingConnector.utils.extract_ISBNs(someNode.innerHTML);
	if( ret['isbns'].length > 0 )
		{
		ret['first_isbn'] = ret['isbns'][0];
		}

	ret['accession'] = this.getAccession(someNode);
	ret['title'] = this.getTitle(someNode);
	ret['author'] = this.getAuthor(someNode);
	ret['call_nums'] = this.getItemInfo(someNode)['Call numbers'];
	ret['locations'] = this.getItemInfo(someNode)['Locations'];
	var coverurlAA = LibraryThingConnector.backend.getCoverURL();
	ret['coverurl'] = coverurlAA['coverurl'];
	ret['coverurl_el'] = coverurlAA['el'];
	return ret;
};

$infiniti.getContainingEl = function ()
{
	return LibraryThingConnector.utils.jQuery('#ajax-dialog').get(0);
};
$infiniti.getContainerForSize = function()
{
	LibraryThingConnector.info('infiniti:getContainerForSize');
	return LibraryThingConnector.utils.jQuery('#ajax-dialog',LibraryThingConnector.containingEl).get(0);
};
/*
return the element where connector places unbound megadiv
 */
$infiniti.getUnboundInsertNodeFull = function(someNode)
{
	LibraryThingConnector.info('infiniti: getUnboundInsertNodeFull');
	LibraryThingConnector.info(someNode);
	// add SU tab
	LibraryThingConnector.utils.jQuery('ul.nav-tabs').append('<li><a href="#unbound" data-toggle="tab">More from Syndetics Unbound</a></li>')
LibraryThingConnector.utils.jQuery('.tab-content').append('<div class="tab-pane no-padding-top" role="tabpanel" id="unbound"><div id="unbound-widget"></div></div>');

	var insertNode = LibraryThingConnector.utils.jQuery('#unbound-widget').get(0);

	return insertNode;
};

/*
return associative array containing keys representing holdings information
 */
$infiniti.getItemInfo = function(someNode)
{
	var itemInfo = {};
	$stripHTML = LibraryThingConnector.utils.stripHTML;
	itemInfo['Locations'] = Array();
	itemInfo['Call numbers'] = Array();
	LibraryThingConnector.log(itemInfo);
	return itemInfo;
};

/*
return scope string for consortium support
 */
$infiniti.getScope = function()
{
	var scope = Array();
	return scope;
};

$infiniti.getAccession = function(someNode)
{
	var accession = '';
	return accession;
};

$infiniti.getTitle = function(someNode)
{
	var title = LibraryThingConnector.utils.jQuery('',someNode).text();
	return title;
};

$infiniti.getAuthor = function(someNode)
{
	var author = LibraryThingConnector.utils.jQuery('',someNode).text();
	return author;
};

/*
return array containing elements for where to place LTFL reviews on search pages or Unbound search div elements
 */
$infiniti.getSummaryChunks = function()
{
	var chunks = [];
	var selector = '';
	var foundChunks = LibraryThingConnector.utils.jQuery(selector);
	LibraryThingConnector.log("Found chunks: "  + chunks);
	return chunks;
};

/*
add the unbound search div content (summary_node) to insertNode
 */
$infiniti.unboundInsertSummaryContent = function(summary_node, insertNode)
{
	LibraryThingConnector.utils.jQuery(insertNode).find('.result-item-text').append(summary_node);
};

/*
get the element for where to place search div content within someNode
 */
$infiniti.getUnboundInsertNodeSummary = function(someNode)
{
	return someNode;
};

/*
LTFL insertion point for LTFL content
 */
$infiniti.getInsertNodeFull = function(someNode) {
	var someNode = null;

	return someNode;
};
/*
Element location for LTFL search result reviews insertion
 */
$infiniti.getInsertNodeSummary = function(someNode)
{
	var selector = '';
	var jq = LibraryThingConnector.utils.jQuery(selector, someNode);
	if(jq.length)
		{
		return jq[0];
		}
	return null;
};
/*
LTFL generate reviews html for full page
 */
$infiniti.generateReviewsHTMLFull = function(metadataOn)
{
	var baseSpan = document.createElement('span');
	baseSpan.className = 'ltfl_reviews';
	LibraryThingConnector.reviews.prepReviewsLink( baseSpan, metadataOn );
	return baseSpan;
};
/*
LTFL reviews html
 */
$infiniti.generateReviewsHTMLSummary = function(metadataOn)
{
	var baseSpan = document.createElement('span');
	baseSpan.className = 'ltfl_reviews';
	LibraryThingConnector.reviews.prepReviewsLink( baseSpan, metadataOn );
	return baseSpan;
};
$infiniti.widgets = {};
/*
Unbound ook when variables are inited (ie Unbound is re-run)
 */
$infiniti.init_variables = function() {
};

/*
Unbound: hook for when content of page was never detected as ready
 */
$infiniti.contentNeverReady  = function ()  {
	LibraryThingConnector.info('polaris: contentNeverReady');
};

/*
Unbound - the backend can return a specific element where Unbound will place itself and parse
 */
$infiniti.getContainingEl = function ()
{
	return null;
};

/*
Unbound hook called by connector .init() asking this backend if the page is ready to be parsed
 */
$infiniti.contentReady = function(someNode)
{
	return true;
};


/*
Unbound: called to auto reveal Unbound content eg from SU Demo Tool pages
 */
$infiniti.openUnboundContent = function ()
{
	var unbound_tab = LibraryThingConnector.utils.jQuery('');
	if ( unbound_tab.length)
		{
		unbound_tab.click();
		}
};

/*
Unbound: called when content is added
 */
$infiniti.unboundContentAdded  = function (elementId)
{
};

if( typeof(LibraryThingConnector.backends) == "undefined" )
	{
	LibraryThingConnector.backends = {};
	}
LibraryThingConnector.backends.infiniti = $infiniti;
delete $infiniti;

var $lb = {};

// module-wide variables
$lb.initialized = false;
$lb.loaderImage = LibraryThingConnector.BASE_URL + "pics/LT_LB_loader.gif";

$lb.init = function()
    {
    // this function doesn't need to get called directly.
    // you can just call show() 
    // but if you call init() first the CSS and loader image will be already loaded by the browser.
    // so there won't be a weird pause when the lightbox first comes up.
        
	// commenting following out: danbury seems ok w/o it and it was causing this.LT_LB to refer to unattached #LT_LB div
	// in rocky river pl sirsi catalog.  Not sure why, but removing this and allowing $lb.show() to get a new reference
	// to $lb.LT_LB seems to have done the trick to fix it. --cc
    //if(this.initialized) { LibraryThingConnector.log('initialized...returning'); return; } // casey: ugly quick hack danbury
    this.initialized = true;
    this.onathena = true;
    
    this.lightboxState = null;
    this.oldLightboxState = null;
    this.oldContent = null;


    this.ie = (navigator.appName == "Microsoft Internet Explorer") ? true : false;
    this.yPos = 0;
    this.modal = false;    
    this.wasShowing = false;

    // create the base lightbox element
    // (if not already there)
    
    var currentLB = document.getElementById('LT_LB');
    if(!currentLB)
        { // avoid creating element twice.
        this.LT_LB = document.createElement('div');
        this.LT_LB.id = 'LT_LB';
        this.LT_LB.style.display = "none";
        
        // load the stylesheet
        cssLink = this.createCSSLink();
        LibraryThingConnector.utils.loadStylesheet(cssLink);

        // attach lightbox to page
        document.body.appendChild( this.LT_LB );  
        }
    else
        {
        this.LT_LB = currentLB;
        }
    //create overlay
    //(if not already there)
    var currentOverlay = document.getElementById('LT_LB_overlay');
    if(!currentOverlay)
        {
        this.overlay = document.createElement('div');
        this.overlay.id = 'LT_LB_overlay';
        document.body.appendChild( this.overlay );
        LibraryThingConnector.utils.addEvent('LT_LB_overlay', 'click', function()
            {
            if( !LibraryThingConnector.LB.modal )
                {
                // modal == can't dismiss except for close button
                LibraryThingConnector.LB.off();
                }
            });
        }
    else
        {
        this.overlay = currentOverlay;    
        }
    // TODO? preload the tagLightboxHTML() into lb (but keep hidden of course)
    // so the loader image will already be there, rather than only requested when
    // an actual tag is clicked on.
    };
$lb.show = function(options)
    {
    this.init();
    this.wasShowing = LibraryThingConnector.utils.isShowing("LT_LB");
	this.isShowing = true;
	this.showingStampSeconds = Math.round(new Date().getTime() / 1000);

    if(options.type)
        {
        this.oldLightboxState = this.lightboxState;
        this.lightboxState = options.type;
        // savecontent indicates whether the current content of the lightbox should
        // be saved (which allows you to get back to it by calling $lb.back()
        if( this.LT_LB.innerHTML )
            {
            this.oldContent = this.LT_LB.innerHTML;        
            }
        }
    if(options.mainhtml)
        {
        this.LT_LB.innerHTML = options.mainhtml;
        }
     if( typeof(options.modal) != "undefined")
        {
        this.modal = options.modal;
        }     
	if( options.height ) 
		{
		this.LT_LB.style.height = options.height;
		}

	if( options.width )
		{
		this.LT_LB.style.width = options.width;
		}
	if( options.addClass )
		{
		this.LT_LB.className += options.addClass;
		}
	else
		{
		this.LT_LB.className  = '';
		}
    if( this.ie )
        {
        /* commenting this code out, as it was affecting IE6 -cc
		this.getScroll();
        this.prepareIE('100%', 'hidden');
    	*/
        this.setScroll(0,0);

        this.hideSelects("hidden");
		
        }
    LibraryThingConnector.utils.showhide( 'LT_LB_overlay', true );
	LibraryThingConnector.utils.showhide( 'LT_LB', true );
    if( options.showloading ) 
        {
        this.showLoading();
        }

	// close lightbox on escape
	document.onkeydown = function (evt)
		{
		evt = evt || document.event;
		if (evt.keyCode == 27)
			{
			LibraryThingConnector.log('close lightbox for escape keypress');
			LibraryThingConnector.LB.close();
			}
		};
	// close lightbox on clicking something outside lightbox when lightbox is open
	document.body.onclick = function(evt)
		{
		var currentStampSeconds = Math.round(new Date().getTime() / 1000);
		// check if this is being triggered immediately upon opening the lightbox. if so, don't close.
		if( currentStampSeconds - LibraryThingConnector.LB.showingStampSeconds > 1 )
			{
			var clicked_el = evt.target;
			var clicked_el_id = clicked_el.id;
			LibraryThingConnector.log('handle onclick');
			LibraryThingConnector.log(clicked_el);
			LibraryThingConnector.log(clicked_el_id);
			var lightbox_el_idA = ['LT_LB', 'LT_LB_container', 'LT_LB_head', "LT_LB_tagsearch",'LT_LB_wikisearch', "LT_LB_helpbutton"];
			var withinLightbox = LibraryThingConnector.utils.jQuery(clicked_el).parents('#LT_LB_container').length;
			if( LibraryThingConnector.LB.isShowing && lightbox_el_idA.indexOf(clicked_el_id) == -1 && !withinLightbox)
				{
				LibraryThingConnector.log('close lightbox');
				LibraryThingConnector.LB.close();
				}
			}
		};

    // clobber ILS timeout value (if possible)
    // must be robust vs. not having backend loaded so it's not coupled
    if( LibraryThingConnector.backend && LibraryThingConnector.backend.clobberTimeout )
        {
        LibraryThingConnector.backend.clobberTimeout();
        }
    };

    
$lb.getInitialBlankHTML = function()
    {  
    var initialHTML = "<div id='LT_LB_container'><div id='LT_LB_head'><div id='LT_LB_title'><h2 id='LB_LB_boxtitle'></h2>";
    initialHTML += "(<a id='LT_LB_helpbutton' onclick='LibraryThingConnector.LB.help();return false;' href='#'>" + LibraryThingConnector.strings.LB.helpLabel + "</a>)</div>";
    initialHTML += "<div id='LT_LB_controls'>";
    initialHTML += " (<a onclick='LibraryThingConnector.LB.close();return false;' href='#'>" + LibraryThingConnector.strings.LB.closeLabel + "</a>)";
    initialHTML += "</div>"; // LT_LB_controls
    
    initialHTML +="<div id='LT_LB_content' style='display:none'></div>";
    initialHTML += "</div>";
    
    initialHTML += "</div>"; // LT_LB_container
    return initialHTML;    
    };

$lb.createCSSLink = function()
    {
    // ??? css always needs to be re-requested due to window sizing automagic
    // can you destroy a dynamically loaded CSS file so it can be re-requested on every popup?
//	LibraryThingConnector.log('lightbox type: ' + this.lightboxState); LibraryThingConnector.log('type as set by bp code: ' + this.type);
	var d = new Date();
    var ws = LibraryThingConnector.utils.windowSize(true);
    //alert(ws);
    return LibraryThingConnector.BASE_URL + "connector/connector_LB.css?&t=" + d.getMilliseconds() + "&sh=" + ws['height'] + "&sw=" + ws['width'] + "&lsa_id=" + LibraryThingConnector.lsa_id;

    };
    
$lb.prepareIE = function(height, overflow)
    {
    var bod = document.getElementsByTagName('body')[0];
    bod.style.height = height;
    bod.style.overflow = overflow;

    var htm = document.getElementsByTagName('html')[0];
    htm.style.height = height;
    htm.style.overflow = overflow; 
    };

$lb.hideSelects = function(visibility)
    {
    var selects = document.getElementsByTagName('select');
    for(var i = 0; i < selects.length; i++)
        {
        selects[i].style.visibility = visibility;
        }
    };
    
$lb.getScroll = function()
    {
    if (window.pageYOffset)
        {
        this.yPos = window.pageYOffset;
        } 
    else if (document.documentElement && document.documentElement.scrollTop)
        {
        this.yPos = document.documentElement.scrollTop; 
        } 
    else if (document.body)
        {
        this.yPos = document.body.scrollTop;
        }
    };

$lb.setScroll = function(x, y)
    {
    window.scrollTo(x, y); 
    };
        
    
$lb.off = function()
    {
    if(this.ie)
        {
        this.setScroll(0, this.yPos);
        this.prepareIE("auto", "auto");
        this.hideSelects("visible");
        }
    LibraryThingConnector.utils.showhide( 'LT_LB_overlay', false );
    LibraryThingConnector.utils.showhide( 'LT_LB', false );
    this.removeWindowHash();
    this.wasShowing = false;
    // restore ILS timer (if possible)
    if(LibraryThingConnector.backend && LibraryThingConnector.backend.restoreTimeout)
        {
        LibraryThingConnector.backend.restoreTimeout();
        }

	this.isShowing = false;
    };
    
$lb.close = $lb.off; // csd: hackity hack

$lb.back = function()
    {
    // restore old state
    if( this.oldLightboxState )
        {
        this.lightboxState = this.oldLightboxState;
        this.oldLightboxState = null;
        }
   // restore old content;
   if( this.oldContent )
        {
        this.LT_LB.innerHTML = this.oldContent;
        }
    };
    
$lb.isLoading = function()
    {
    // TODO: make this less of a hack?  
    return LibraryThingConnector.utils.isShowing('LT_LB_loading');
    };
    
$lb.help = function()
    {
    // get help for current lightbox state
    
    // make sure that the lightbox isnt currently loading -- which will throw the back button off
    
    if( !this.isLoading() && this.lightboxState != "help" )
        {
            
        var pageToRequest = this.lightboxState;    
        /*this.show(
            {
            'type' : 'help',
            'mainhtml' : this.helpHTML(''),
            'modal' : false,
            'showloading' : false,
            'savecontent' : false
            });*/
        // AJAX in help content (per tim)
        //LibraryThingConnector.utils.requestContent( LibraryThingConnector.BASE_URL + "connector/connector_help.php?page=" + pageToRequest );
        var frame = document.getElementById('LT_LB_tagsiframe');
        var url = LibraryThingConnector.BASE_URL + 'connector/connector_help.php?page=' + pageToRequest;
        if( this.lightboxState == 'tags' )
        	{
        		url += '&currentUrl=' + LibraryThingConnector.widgets.tags.currentTagsUrl;
        	}
        url += "&sh=" + LibraryThingConnector.utils.windowSize();
		url += '&lsa_id=' + LibraryThingConnector.lsid;
		frame.src = url; 
        }
    };
    
$lb.helpHTML = function(helpStr)
    {
    if(!helpStr) { helpStr = ''; }
    var initialHTML = "<div id='LT_LB_container'><div id='LT_LB_head'><div id='LT_LB_title'><h2 id='LB_LB_boxtitle'>";
    initialHTML += LibraryThingConnector.strings.LB.helpTitle +"</h2></div>";

    initialHTML += "<div id='LT_LB_controls'>";
    initialHTML += " (<a onclick='LibraryThingConnector.LB.close();return false;' href='#'>" + LibraryThingConnector.strings.LB.closeLabel + "</a>)";
    initialHTML += "</div>"; // LT_LB_controls
    initialHTML += "</div>"; // LT_LB_head
    
    
    initialHTML += "<div id='LT_LB_content'><div class='LT_LB_help'>";
    initialHTML += "<br><a onclick='LibraryThingConnector.LB.back(); return false' href='#'>&laquo; Back</a><br><br>" + "<p id='LT_LB_helpcontent'>" + helpStr + "</p>";
    initialHTML += "</div></div>";
    initialHTML += "</div>";
    
    initialHTML += "</div>"; // LT_LB_container
    return initialHTML;     
        
    };
    
$lb.removeWindowHash = function()
    {
    var url = window.location.href;
    if( url.indexOf("LT_tag") > -1 || url.indexOf('LT_reviews') > -1 )
        {
		if( url.indexOf("LT_tag") > -1 )
			{
			var newurl = url.substring(0, url.indexOf("LT_tag") );
			}
		else if( url.indexOf("LT_reviews") > -1 )
			{
			var newurl = url.substring(0, url.indexOf("LT_reviews") );
			}
        // note: if you do not put the 'naked' # on the end,
        // to replace the one for the LT_tag,
        // IE will not actually do anything.
        if( url.indexOf("#") == -1 )
          {
          window.location.assign(newurl + "#");
          }
        else
          {
          window.location.assign(newurl);
          }
        }    
    };
    
$lb.hideLoading = function() {
    LibraryThingConnector.utils.showhide( 'LT_LB_loading', false );
    };
$lb.showLoading = function() {
    LibraryThingConnector.utils.showhide( 'LT_LB_loading', true );
    };

    
$lb.load = function( response, container )
    {
    container = container || "LT_LB_content";
    var lb = document.getElementById( container );
    
    if(lb)
        {
        lb.innerHTML = response;
        }
    this.hideLoading();
    LibraryThingConnector.utils.showhide( 'LT_LB_content', true );
    };
    
$lb.makeFullScreen = function() 
	{
	LibraryThingConnector.log('making LB fullscreen');
	LibraryThingConnector.utils.addClass(this.LT_LB, 'lt_fullscreen');
	var windowSize = LibraryThingConnector.utils.windowSize(true);
	var cw = windowSize['width'];
	var ch = windowSize['height'];
	var LT_LB_width = this.fullscreenWidth(cw);
	var LT_LB_height = this.fullscreenHeight(ch);
	LibraryThingConnector.utils.jQuery('#LT_LB_iframe').css('height', LT_LB_height);
//	this.LT_LB.style.setAttribute('cssText','top: 20px; left: 20px; padding: 1px; margin:0 0 0 0px;border: 1px solid #333;z-index:1000;height: ' + LT_LB_height +'px; width: ' + LT_LB_width +'px;display:block;');
	LibraryThingConnector.LB.height = ch - 49;
	};

$lb.fullscreenWidth = function(windowWidth)
	{
	var LT_LB_width = windowWidth - 69;
	return LT_LB_width;
	};

$lb.fullscreenHeight = function(windowHeight)
	{
	var LT_LB_height = windowHeight - 69;
	return LT_LB_height;
	};

$lb.removeFullScreen = function()
	{
	LibraryThingConnector.log('making LB normal size');
	LibraryThingConnector.utils.removeClass(this.LT_LB, 'lt_fullscreen');
	//this.LT_LB.style.setAttribute('cssText','');
	};
		
// attach to global namespace and cleanup.
       
LibraryThingConnector.LB = $lb;
    
    
delete $lb;

LibraryThingConnector.log = console.info;
$bookdisplay = {};

$bookdisplay.WIDGET_URL = 'run_ltfl_widget.php?';
$bookdisplay.WIDGET_URL_MULTI = 'run_ltfl_widget_multi.php?';
$bookdisplay.sizesAA = {};

$bookdisplay.find_bookdisplay_divs = function()
	{
	var bookdisplay_divs = [];
	var divs = document.getElementsByTagName('div');
	for (var i=0; i < divs.length; i++)
		{
		var div_id = divs[i].id;
		if ( div_id.slice(0,12) == "ltfl_widget_" ) { bookdisplay_divs.push( div_id ); }
		}
	LibraryThingConnector.log('bookdisplay divs: ');
	LibraryThingConnector.log(bookdisplay_divs);
	return bookdisplay_divs;

	};

$bookdisplay.get_widget_configA_for_widgetid_multi = function(widget_id)
	{
	var widgetA = this.multi_widgetA;
	if( typeof widgetA == "undefined" || widgetA.length == 0 )
		{
		return false;
		}
	var widget = widgetA[widget_id];
	if( widget )
		{
		return widget;
		}
	return false;
	};

$bookdisplay.get_widget_configA_for_widgetid_list = function(widget_id)
{
	var widgetA = this.list_widgetA;
	if( typeof widgetA == "undefined" || widgetA.length == 0 )
		{
		return false;
		}
	var widget = widgetA[widget_id];
	if( widget )
		{
		return widget;
		}
	return false;
};

$bookdisplay.get_widget_configA_for_widgetid = function(widget_id)
	{
	var widgetA = this.widgetA;
	if( typeof widgetA == "undefined" || widgetA.length == 0 )
		{
		return false;
		}
	var widget = widgetA[widget_id];
	if( widget )
		{
		return widget;
		}
	return false;
	};
/*
take array of div_ids, figure out the id for each and add html structure for it
 */
$bookdisplay.setup_widgets = function(bookdisplay_divs)
	{
	// check for #LTGoto in window.location.hash.  If it's present and we're just loading, remove it, it must have lingered from a back_button press
	var curHash = '';
	try
		{
		curHash = window.top.location.hash;
		}
	catch (err)
		{
		console.info('unable to get window.top hash');
		console.info(err);
		}
	//LibraryThingConnector.log(curHash);
	if (curHash.match(/LTGoto/))
		{
		LibraryThingConnector.log('removing erroneous #LTGoto from window.location.hash');
		if( LibraryThingConnector.lsid == 2102 )
			{
			LibraryThingConnector.log('not removing LTGoto for Wesley');
			}
		else
			{
			window.top.location.hash = ' ';
			}
		}
	var load_as_iframe = true;
	if( bookdisplay_divs.length == 0) 
		{
		return null;
		}
	LibraryThingConnector.bookdisplay.widgets_loaded = [];
	LibraryThingConnector.bookdisplay.multi_widgets_loaded = [];
	LibraryThingConnector.bookdisplay.list_widgets_loaded = [];
	var showingSomeWidgets = false;
	for( var i = 0; i < bookdisplay_divs.length; i++)
		{
		var divid = bookdisplay_divs[i];
		LibraryThingConnector.log('found widget div: ' + divid);
		var widget_id = this.extract_widgetid(divid);
		LibraryThingConnector.log('found widget with id: ' + widget_id);
		var widget_html_structure = '';
		var widget = this.get_widget_configA_for_widgetid(widget_id);
		LibraryThingConnector.log('widget object:');
		LibraryThingConnector.log(widget);
		if( widget )
			{
			var widget_status = widget.configA.optionA.widget_status;
			if( widget_status )
				{
				LibraryThingConnector.log('widget_status: ' + widget_status);
				var run_widget = (widget_status == 1 && LibraryThingConnector.queries['testing']) || widget_status == 2;
				if(run_widget )
					{
					var load_as_iframe = true; //widget.configA.optionA.show_within_frame;
					if( load_as_iframe )
						{
						LibraryThingConnector.log('widget');
						LibraryThingConnector.log(widget);
						var retAA = this.get_html_structure_iframe(divid, widget);
						LibraryThingConnector.log('structure');
						LibraryThingConnector.log(retAA);
						var widget_html_structure = retAA.html;
						var widget_url = retAA.src;
						LibraryThingConnector.log('widget html structure: ');
						LibraryThingConnector.log(widget_html_structure);
						widget.widget_url = widget_url;
						if( widget_html_structure )
							{
							showingSomeWidgets = true;
							LibraryThingConnector.bookdisplay.widgets_loaded.push(widget.id);
							this.add_widget_html_to_page(divid, widget_html_structure, widget_url,true,i);
							}
						}
					else
						{
						widget_html_structure = this.get_html_structure_embedded(divid, widget);
						}
					}
				}
				
			}
		var multi_widget = this.get_widget_configA_for_widgetid_multi(widget_id);
		LibraryThingConnector.log('multi widget object:');
		LibraryThingConnector.log(multi_widget);
		if( multi_widget )
			{
			var widget_status = multi_widget.lsbdm_config.widget_status;
			if( widget_status )
				{
				LibraryThingConnector.log('loading widget: ' + widget_id);
				var run_widget = (widget_status == 1 && LibraryThingConnector.queries['testing']) || widget_status == 2;
				if(run_widget )
					{
					var load_as_iframe = true; //widget.configA.optionA.show_within_frame;
					if (load_as_iframe)
						{
						LibraryThingConnector.log('multi widget');
						LibraryThingConnector.log(multi_widget);
						var retAA = this.get_html_structure_iframe_multi(divid, multi_widget);
						LibraryThingConnector.log('structure');
						LibraryThingConnector.log(retAA);
						var widget_html_structure = retAA.html;
						var widget_url = retAA.src;
						LibraryThingConnector.log('multi widget html structure: ');
						LibraryThingConnector.log(widget_html_structure);
						widget.widget_url = widget_url;
						if (widget_html_structure)
							{
							showingSomeWidgets = true;
							LibraryThingConnector.bookdisplay.multi_widgets_loaded.push(multi_widget.lsbdm_id);
							this.add_widget_html_to_page(divid, widget_html_structure, widget_url, false,i);
							}
						}
					else
						{
						widget_html_structure = this.get_html_structure_embedded(divid, widget);
						}
					}
				}
			}
		var list_widget = this.get_widget_configA_for_widgetid_list(widget_id);
		LibraryThingConnector.log('list widget object:');
		LibraryThingConnector.log(list_widget);
		if( list_widget )
			{
			LibraryThingConnector.log('loading widget: ' + widget_id);
			LibraryThingConnector.attachLibrarianPowerHandlers(true);
			var load_as_iframe = true; //widget.configA.optionA.show_within_frame;
			if (load_as_iframe)
				{
				LibraryThingConnector.log('list widget');
				LibraryThingConnector.log(list_widget);
				var retAA = this.get_html_structure_iframe_list(divid, list_widget);
				LibraryThingConnector.log('structure');
				LibraryThingConnector.log(retAA);
				var widget_html_structure = retAA.html;
				var widget_url = retAA.src;
				LibraryThingConnector.log('multi widget html structure: ');
				LibraryThingConnector.log(widget_html_structure);
				widget.widget_url = widget_url;
				if (widget_html_structure)
					{
					showingSomeWidgets = true;
					LibraryThingConnector.bookdisplay.list_widgets_loaded.push(list_widget.lslw_id);
					this.add_widget_html_to_page(divid, widget_html_structure, widget_url, false, i);
					}
				}
			else
				{
				widget_html_structure = this.get_html_structure_embedded(divid, widget);
				}
			}
		}
	if( showingSomeWidgets )
		{
		// record page contained bdw widgets
		LibraryThingConnector.bookdisplay.statsPingBack(LibraryThingConnector.bookdisplay.widgets_loaded,LibraryThingConnector.bookdisplay.multi_widgets_loaded);
		// watch url for url changes in hash
		LibraryThingConnector.widgets.watchForUrlChange();
		}
	};

$bookdisplay.frameLoadStatsPingBack = function(widget_id,loadTime,dataObj)
{
	LibraryThingConnector.log('bdw frame load stats:'+loadTime);
	LibraryThingConnector.log(dataObj);
	var statsPingBackUrl = LibraryThingConnector.LTFL_BASE_URL_RW + "pingBack.php?type=bdw_load_time_stats&data=" + encodeURIComponent(LibraryThingConnector.utils.serialize(dataObj))+'&loadTime='+loadTime+'&widget_id='+widget_id+'&order='+dataObj['order'];
	statsPingBackUrl += '&lsa_id=' + LibraryThingConnector.lsa_id + '&BASE_URL=' + LibraryThingConnector.LTFL_BASE_URL;
	LibraryThingConnector.log('pinging bdw page stats back to url:' + statsPingBackUrl);
	LibraryThingConnector.utils.requestContent(statsPingBackUrl);
};

$bookdisplay.statsPingBack = function(widgets_loaded, multi_widgets_loaded)
	{
	LibraryThingConnector.log('page bdw stats widgets loaded: ' + widgets_loaded + ' multi widgets loaded: ' +multi_widgets_loaded);
	var statsPingBackUrl = LibraryThingConnector.LTFL_BASE_URL_RW + "pingBack.php?type=bdw_page_stats&widgets_loaded=" + widgets_loaded + "&multi_widgets_loaded=" + multi_widgets_loaded;
	statsPingBackUrl += '&lsa_id=' + LibraryThingConnector.lsid + '&BASE_URL=' + LibraryThingConnector.LTFL_BASE_URL;
	LibraryThingConnector.log('pinging bdw page stats back to url:' + statsPingBackUrl);
	LibraryThingConnector.utils.requestContent(statsPingBackUrl);
	};
/*
given a divid, extract the widget id to load
 */
$bookdisplay.extract_widgetid = function(divid)
	{
	var div_re = /ltfl_widget_(.*)/;
	var matchesA = divid.match(div_re);
	LibraryThingConnector.log(matchesA);
	if( matchesA.length == 0 )
		{
		return null;
		}
	else
		{
		return matchesA[1];
		}
	};

$bookdisplay.get_url_for_widget = function(widget_id, lsa_id_for_widget)
	{
	if ( typeof lsa_id_for_widget === 'undefined' )
		{
		LibraryThingConnector.log('lsa_id_for_widget: ' + lsa_id_for_widget);
		lsa_id_for_widget = LibraryThingConnector.lsa_id
		}
	return LibraryThingConnector.LTFL_BASE_URL + this.WIDGET_URL + 'lsa_id=' + lsa_id_for_widget + '&id=' + widget_id + '&newpopup=1' + '&referer=' + encodeURIComponent(window.top.location.href);
	};

$bookdisplay.get_url_for_widget_list = function(widget)
{
	console.info('get_url_for_widget_list');
	console.info(widget);
	var title = widget.lslw_config.title;
	if( title == 'undefined' || title == undefined)
		{
		title = '';
		}
	var catalog_url = location.href;
	var url = LibraryThingConnector.BASE_URL + "lp/" + LibraryThingConnector.a_id + "."+LibraryThingConnector.i_id+"/widget?lslw_id="+widget.lslw_id+'&num_rows='+widget.lslw_config.num_rows+'&title='+title+'&showfrom='+widget.lslw_config.showfrom+'&catalog_url='+encodeURIComponent(catalog_url)+'&sorting='+widget.lslw_config.sorting;
	// handle custom list of widgets
	if( typeof widget.lslw_config.list_idA !== 'undefined' )
		{
		url += '&list_id='+widget.lslw_config.list_idA.join(",")
		}
	else // or just the LDW category
		{
		url += "&lpc_id="+widget.lslw_lpc_id;
		}

	return url
};

$bookdisplay.get_url_for_widget_multi = function(widget_id)
	{
	var url = LibraryThingConnector.LTFL_BASE_URL + this.WIDGET_URL_MULTI + 'lsa_id=' + LibraryThingConnector.lsa_id + '&id=' + widget_id + '&newpopup=1' + '&referer=' + encodeURIComponent(window.top.location.href);
	return url;
	};

$bookdisplay.compute_iframe_width_for_widget = function (widget_id)
	{
	// TODO compute it
	return 600;

	};
$bookdisplay.compute_iframe_height_for_widget = function(widget_id)
	{
	// TODO compute it
	return 300;
	};

$bookdisplay.get_widget_dimensions = function(divid, widget)
	{
	var dimensions = LibraryThingConnector.utils.find_container_dimensions(divid);
	LibraryThingConnector.log('raw dimensions');
	LibraryThingConnector.log(dimensions);
	var cw = dimensions.cw;
	var ch = dimensions.ch;
	var bod = LibraryThingConnector.utils.Sizzle('body')[0];
	var bodyWidth = bod.innerWidth || bod.offsetWidth || bod.clientWidth;
	var bodyHeight = bod.innerHeight || bod.offsetHeight || bod.clientHeight;
	LibraryThingConnector.log('bodyHeight: ' + bodyHeight);
	var minimumHeight = 50;
	if( isNaN(ch) || ch == 0 || ch < minimumHeight )
		{
		var default_height = bodyHeight;
		if( bodyHeight < minimumHeight )
			{
			default_height = 200;
			LibraryThingConnector.log('body height smaller than minimumHeight so using default_height of: ' + default_height);
			}
		LibraryThingConnector.log('height not found, sending ' + default_height);
		ch = default_height;
		}
	var maxHeight = null;
	if( maxHeight && ch > maxHeight )
		{
		LibraryThingConnector.log('height great than ' + maxHeight +', sending ' + maxHeight);
		ch = maxHeight;
		}
	if( isNaN(cw) || cw == 0 )
		{
		var default_width = bodyWidth;
		LibraryThingConnector.log('width not found, sending ' + default_width);
		cw = default_width;
		}
	var maxWidth = null;
	if( maxWidth && cw > maxWidth && dimensions.pnode == bod)
		{
		LibraryThingConnector.log('width great than ' + maxWidth +', sending ' + maxWidth);
		cw = maxWidth;
		}
	cw -= 3;
	return {ch:ch, cw:cw};
	};

$bookdisplay.get_html_structure_iframe = function(divid, widget)
{	
	var widget_id = widget['id'];
	var lsa_id_for_widget = widget['lsbd_lsa_id'];
	if ( lsa_id_for_widget)
		{
		LibraryThingConnector.log('using lsbd_lsa_id for lsa_id_for_widet: '  + lsa_id_for_widget);
		}
	else
		{
		LibraryThingConnector.log('using LibraryThingConnector.lsa_id for lsa_id_for_widet: '  + lsa_id_for_widget);
		lsa_id_for_widget = LibraryThingConnector.lsa_id;
		}
	var widget_url = this.get_url_for_widget(widget_id, lsa_id_for_widget);
	var iframeDimensionsAA = this.get_widget_dimensions(divid, widget);
	var iframe_height = iframeDimensionsAA.ch + 35;
	var iframe_width = iframeDimensionsAA.cw;
	var containerHeight = '';
	iframe_height += 'px';
	var containerWidth = '';
	widget_url += '&ch=' + iframe_height + '&cw=' + iframe_width;
	var charset = LibraryThingConnector.utils.detectedCharset();
	widget_url += '&charset=' + charset;
	LibraryThingConnector.log('iframe url: ' );
	LibraryThingConnector.log(widget_url);
	var style = 'width: ' + iframe_width + '; height: ' + iframe_height + ';overflow:hidden;background:transparent;position:relative;border:none;';
	LibraryThingConnector.log(style);
	var html = '<iframe data-containerHeight="'+containerHeight+'" data-containerWidth="'+containerWidth+'" title="'+widget['configA']['optionA']['title']+'" id="'+divid+'_frame" class="ltfl_bd_iframe" style="' + style +'"></iframe>';
	console.log('iframe html:'+html);
	var get_this_widget = widget.configA.optionA.get_this_widget;
	if (get_this_widget)
		{
		LibraryThingConnector.log('get_this_widget: ' + get_this_widget);
		html += '<div class="ltfl_bookdisplay_get_this_widget">';
		var get_this_widget_url = widget.configA.optionA.get_this_widget_domain + 'get_this_widget.php';
		get_this_widget_url += '?lsa_id='+lsa_id_for_widget + '&id='+widget_id;
		LibraryThingConnector.log('get_this_widget url: ' + get_this_widget_url);
		var aria_label = 'Get Widget ' + widget['configA']['optionA']['title'];
		html += '<a aria-label="'+aria_label+'" target="_blank" href="' + get_this_widget_url+'" class="ltfl_bookdisplay_get_this_widget_link">Get This Widget</a>';
		html += '</div>';
		}
	var retAA = {html:html,src:widget_url};
	return retAA;
};

$bookdisplay.get_html_structure_iframe_list = function(divid, widget)
{
	LibraryThingConnector.log('list iframe structure');
	LibraryThingConnector.log(widget);
	var widget_id = widget['lslw_id'];
	var widget_url = this.get_url_for_widget_list(widget);
	var iframeDimensionsAA = this.get_widget_dimensions(divid, widget);
	var iframe_height = iframeDimensionsAA.ch + 35;
	var iframe_width = '100%';
	widget_url += '&ch=' + iframe_height + '&cw=' + iframe_width;
	var charset = LibraryThingConnector.utils.detectedCharset();
	widget_url += '&charset=' + charset;
	LibraryThingConnector.log('iframe url: ' );
	LibraryThingConnector.log(widget_url);
	var style = 'width: ' + iframe_width + '; height: ' + iframe_height + ';overflow:hidden;background:transparent ;';
	var html = '<iframe data-containerHeight="" data-containerWidth="" title="ltfl_widget" id="'+divid+'_frame" allowTransparency="true" class="ltfl_bd_iframe" frameborder="0" style="' + style +'"></iframe>';
	var retAA = {html:html,src:widget_url};
	return retAA;
};

$bookdisplay.get_html_structure_iframe_multi = function(divid, widget)
	{
	LibraryThingConnector.log('multi iframe structure');
	var widget_id = widget['lsbdm_id'];
	var widget_url = this.get_url_for_widget_multi(widget_id);
	var iframeDimensionsAA = this.get_widget_dimensions(divid, widget);
	var iframe_height = iframeDimensionsAA.ch + 35;
	var iframe_width = iframeDimensionsAA.cw;
	var containerHeight = widget.lsbdm_config.height;
	if( containerHeight && containerHeight != '' )
		{
		iframe_height = containerHeight + 'px';
		LibraryThingConnector.log('using explicity container height for iframe multiwidget height: ' + iframe_height);
		}
	else
		{
		LibraryThingConnector.log('using auto detected height for multi widget: ' + iframe_height + 'px');
		iframe_height += 'px';
		}
	var containerWidth = widget.lsbdm_config.width;
	if( containerWidth && containerWidth != '' )
		{
		iframe_width = containerWidth  + 'px'
		LibraryThingConnector.log('using explicity container height for iframe multiwidget width: ' + iframe_width);
		}
	else
		{
		LibraryThingConnector.log('using auto detected width for multi widget:' + iframe_width + 'px');
		iframe_width += 'px';
		}
	widget_url += '&ch=' + iframe_height + '&cw=' + iframe_width;
	var charset = LibraryThingConnector.utils.detectedCharset();
	widget_url += '&charset=' + charset;
	LibraryThingConnector.log('iframe url: ' );
	LibraryThingConnector.log(widget_url);
	var style = 'width: ' + iframe_width + '; height: ' + iframe_height + ';overflow:hidden;background:transparent ;';
	var html = '<iframe title="ltfl_widget" id="'+divid+'_frame" allowTransparency="true" class="ltfl_bd_iframe" frameborder="0" style="' + style +'"></iframe>';
	var retAA = {html:html,src:widget_url};
	return retAA;
	};
$bookdisplay.get_html_structure_embedded = function(divid, widget)
	{
	var widget_id = widget['id'];
	var widget_url = this.get_url_for_widget(widget_id);
	var iframeDimensionsAA = this.get_widget_dimensions(divid, widget);
	var iframe_height = iframeDimensionsAA.ch;
	var iframe_width = iframeDimensionsAA.cw;
	widget_url += '&cw='+iframe_width+'&ch='+iframe_height;
	LibraryThingConnector.log('requesting widget script for embedded widget from: ' + widget_url);
	LibraryThingConnector.utils.requestContent(widget_url);
	};

$bookdisplay.add_widget_html_to_page = function(divid, html, widget_url,show_loading,order)
	{
	LibraryThingConnector.log('bdw add_widget_html_to_page order:'+order);
	var divEl = document.getElementById(divid);
	var frame_id = divid + '_frame';
	divEl.innerHTML = html;
	var frame_el = document.getElementById(frame_id);

	if ( typeof LibraryThingConnector.bookdisplay.widgets_load_times === 'undefined')
		{
		LibraryThingConnector.bookdisplay.widgets_load_times = [];
		}
	var setupIframeTime = new Date().getTime();
	if ( show_loading )
		{
		frame_el.style.visibility = "hidden";
		LibraryThingConnector.utils.addClass(divEl, 'loading');
		var onIframeLoad = function() {
			LibraryThingConnector.log('onFrameLoad running');
			LibraryThingConnector.utils.removeClass(divEl, 'loading');
			frame_el.style.visibility = "visible";

			// load time stats
			var timeNow = new Date().getTime();
			var loadTime = timeNow - setupIframeTime;
			var loadTimeFromLoadStart = '';

			if (typeof window['LTFL_loadStarted'] !== 'undefined' )
				{
				loadTimeFromLoadStart = timeNow - window['LTFL_loadStarted'];
				LibraryThingConnector.log('entire load time from LTFL_loadStarted:'+loadTimeFromLoadStart);
				}
			else if (typeof window['SU_loadStarted'] !== 'undefined' )
				{
				loadTimeFromLoadStart = timeNow - window['SU_loadStarted'];
				LibraryThingConnector.log('entire load time from SU_loadStarted:'+loadTimeFromLoadStart);
				}
			var widget_hash = divid.replace('ltfl_widget_','');
			var widget = LibraryThingConnector.bookdisplay.widgetA[widget_hash];
			var widget_id = widget.lsbd_id;
			var widgets = LibraryThingConnector.bookdisplay.find_bookdisplay_divs();
			var num_widgets = widgets.length;
			var product = 'LTFL';
			if (typeof LibraryThingConnector.product !== 'undefined')
				{
				product = LibraryThingConnector.product;
				}
			var dataObj ={
				'id':widget_id,
				'loadTime':loadTime,
				'loadTimeFromLoadStart':loadTimeFromLoadStart,
				'num_widgets':num_widgets,
				'widget_url':widget.widget_url,
				'referer':window.location.href,
				'product':product,
				'order':order,
			};
			LibraryThingConnector.bookdisplay.widgets_load_times.push(dataObj);
			LibraryThingConnector.bookdisplay.frameLoadStatsPingBack(widget_id, loadTime,dataObj);
		};
		if( frame_el.attachEvent )
			{
			frame_el.attachEvent('onload', onIframeLoad);
			}
		else
			{
			frame_el.addEventListener('load', onIframeLoad, false);
			}
		}

    frame_el.src = widget_url;
	};

window.addEventListener('message', function (e) {
	var data = e.data;
	if (typeof data.type == 'undefined')
		{
		return;
		}
	if (data.type != 'resize_iframe' )
		{
		return;
		}
	LibraryThingConnector.log(data);
	var $iframe = LibraryThingConnector.utils.Sizzle('#' + data.widget_el_id)[0];
	var usingExplicitHeightB = $iframe.dataset.containerheight;
	LibraryThingConnector.log('iframe containerHeight:'+usingExplicitHeightB);
	var usingExplicitWidthB = $iframe.dataset.containerwidth;
	LibraryThingConnector.log('iframe containerWidth:'+usingExplicitWidthB);
	switch (data.type)
		{
		case 'resize_iframe':
			if (usingExplicitHeightB)
				{
				LibraryThingConnector.log('widget_id: ' + data.widget_el_id + ' is using explicit height, not resizing iframe height');
				}
			else
				{
				LibraryThingConnector.log('resize_iframe message, resizing widget id: ' + data.widget_el_id + ' height to: ' + data.height);
				LibraryThingConnector.log($iframe);
				LibraryThingConnector.utils.jQuery($iframe).height(data.height+'px');
				}
			var width = data.width+5; // extra for arrows
			if (usingExplicitWidthB)
				{
				LibraryThingConnector.log('widget_id: ' + data.widget_el_id + ' is using explicit width, not resizing iframe width');
				}
			else
				{
				LibraryThingConnector.log('resize_iframe message, resizing widget id: ' + data.widget_el_id + ' width to: ' + width);
				LibraryThingConnector.log($iframe);
				LibraryThingConnector.utils.jQuery($iframe).width(width+'px');
				}
			break;
		}
}, false);

$bookdisplay.update_widget = function(params_to_load) {
	// TODO change iframe src or update embedded html
};

$bookdisplay.refresh_widget_every = function(seconds, paramsToLoad)
{
	var hInterval = setInterval(this.update_widget(paramsToLoad), seconds);
};

LibraryThingConnector.bookdisplay = $bookdisplay;

/*! jQuery v2.1.3 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l=a.document,m="2.1.3",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!n.isArray(a)&&a-parseFloat(a)+1>=0},isPlainObject:function(a){return"object"!==n.type(a)||a.nodeType||n.isWindow(a)?!1:a.constructor&&!j.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=l.createElement("script"),b.text=a,l.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:g.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(e=d.call(arguments,2),f=function(){return a.apply(b||this,e.concat(d.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:k}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=hb(),z=hb(),A=hb(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N=M.replace("w","w#"),O="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+N+"))|)"+L+"*\\]",P=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+O+")*)|.*)\\)|)",Q=new RegExp(L+"+","g"),R=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),S=new RegExp("^"+L+"*,"+L+"*"),T=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),U=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),V=new RegExp(P),W=new RegExp("^"+N+"$"),X={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+O),PSEUDO:new RegExp("^"+P),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ab=/[+~]/,bb=/'|\\/g,cb=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),db=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},eb=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(fb){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function gb(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],k=b.nodeType,"string"!=typeof a||!a||1!==k&&9!==k&&11!==k)return d;if(!e&&p){if(11!==k&&(f=_.exec(a)))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return H.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName)return H.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=1!==k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(bb,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+rb(o[l]);w=ab.test(a)&&pb(b.parentNode)||b,x=o.join(",")}if(x)try{return H.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function hb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ib(a){return a[u]=!0,a}function jb(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function kb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function lb(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function mb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function nb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function ob(a){return ib(function(b){return b=+b,ib(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function pb(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=gb.support={},f=gb.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=gb.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=g.documentElement,e=g.defaultView,e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",eb,!1):e.attachEvent&&e.attachEvent("onunload",eb)),p=!f(g),c.attributes=jb(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=jb(function(a){return a.appendChild(g.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(g.getElementsByClassName),c.getById=jb(function(a){return o.appendChild(a).id=u,!g.getElementsByName||!g.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(g.querySelectorAll))&&(jb(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),jb(function(a){var b=g.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&jb(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",P)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===g||a.ownerDocument===v&&t(v,a)?-1:b===g||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,h=[a],i=[b];if(!e||!f)return a===g?-1:b===g?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return lb(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?lb(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},g):n},gb.matches=function(a,b){return gb(a,null,null,b)},gb.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return gb(b,n,null,[a]).length>0},gb.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},gb.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},gb.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},gb.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=gb.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=gb.selectors={cacheLength:50,createPseudo:ib,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(cb,db),a[3]=(a[3]||a[4]||a[5]||"").replace(cb,db),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||gb.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&gb.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(cb,db).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=gb.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(Q," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||gb.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ib(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ib(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?ib(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ib(function(a){return function(b){return gb(a,b).length>0}}),contains:ib(function(a){return a=a.replace(cb,db),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ib(function(a){return W.test(a||"")||gb.error("unsupported lang: "+a),a=a.replace(cb,db).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:ob(function(){return[0]}),last:ob(function(a,b){return[b-1]}),eq:ob(function(a,b,c){return[0>c?c+b:c]}),even:ob(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:ob(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:ob(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:ob(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=mb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=nb(b);function qb(){}qb.prototype=d.filters=d.pseudos,d.setFilters=new qb,g=gb.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?gb.error(a):z(a,i).slice(0)};function rb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function sb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function tb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ub(a,b,c){for(var d=0,e=b.length;e>d;d++)gb(a,b[d],c);return c}function vb(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function wb(a,b,c,d,e,f){return d&&!d[u]&&(d=wb(d)),e&&!e[u]&&(e=wb(e,f)),ib(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ub(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:vb(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=vb(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=vb(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function xb(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=sb(function(a){return a===b},h,!0),l=sb(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[sb(tb(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return wb(i>1&&tb(m),i>1&&rb(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&xb(a.slice(i,e)),f>e&&xb(a=a.slice(e)),f>e&&rb(a))}m.push(c)}return tb(m)}function yb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=F.call(i));s=vb(s)}H.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&gb.uniqueSort(i)}return k&&(w=v,j=t),r};return c?ib(f):f}return h=gb.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=xb(b[c]),f[u]?d.push(f):e.push(f);f=A(a,yb(e,d)),f.selector=a}return f},i=gb.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(cb,db),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(cb,db),ab.test(j[0].type)&&pb(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&rb(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,ab.test(a)&&pb(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=jb(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),jb(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||kb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&jb(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||kb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),jb(function(a){return null==a.getAttribute("disabled")})||kb(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),gb}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return g.call(b,a)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:l,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=l.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=l,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};A.prototype=n.fn,y=n(l);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?g.call(n(a),this[0]):g.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(C[a]||n.unique(e),B.test(a)&&e.reverse()),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return n.each(a.match(E)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(b=a.memory&&l,c=!0,g=e||0,e=0,f=h.length,d=!0;h&&f>g;g++)if(h[g].apply(l[0],l[1])===!1&&a.stopOnFalse){b=!1;break}d=!1,h&&(i?i.length&&j(i.shift()):b?h=[]:k.disable())},k={add:function(){if(h){var c=h.length;!function g(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&g(c)})}(arguments),d?f=h.length:b&&(e=c,j(b))}return this},remove:function(){return h&&n.each(arguments,function(a,b){var c;while((c=n.inArray(b,h,c))>-1)h.splice(c,1),d&&(f>=c&&f--,g>=c&&g--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],f=0,this},disable:function(){return h=i=b=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,b||k.disable(),this},locked:function(){return!i},fireWith:function(a,b){return!h||c&&!i||(b=b||[],b=[a,b.slice?b.slice():b],d?i.push(b):j(b)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!c}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(H.resolveWith(l,[n]),n.fn.triggerHandler&&(n(l).triggerHandler("ready"),n(l).off("ready"))))}});function I(){l.removeEventListener("DOMContentLoaded",I,!1),a.removeEventListener("load",I,!1),n.ready()}n.ready.promise=function(b){return H||(H=n.Deferred(),"complete"===l.readyState?setTimeout(n.ready):(l.addEventListener("DOMContentLoaded",I,!1),a.addEventListener("load",I,!1))),H.promise(b)},n.ready.promise();var J=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};n.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function K(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=n.expando+K.uid++}K.uid=1,K.accepts=n.acceptData,K.prototype={key:function(a){if(!K.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=K.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,n.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(n.isEmptyObject(f))n.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(E)||[])),c=d.length;while(c--)delete g[d[c]]}},hasData:function(a){return!n.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var L=new K,M=new K,N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(O,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}M.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return M.hasData(a)||L.hasData(a)},data:function(a,b,c){return M.access(a,b,c)
},removeData:function(a,b){M.remove(a,b)},_data:function(a,b,c){return L.access(a,b,c)},_removeData:function(a,b){L.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=M.get(f),1===f.nodeType&&!L.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));L.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){M.set(this,a)}):J(this,function(b){var c,d=n.camelCase(a);if(f&&void 0===b){if(c=M.get(f,a),void 0!==c)return c;if(c=M.get(f,d),void 0!==c)return c;if(c=P(f,d,void 0),void 0!==c)return c}else this.each(function(){var c=M.get(this,d);M.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&M.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){M.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=L.get(a,b),c&&(!d||n.isArray(c)?d=L.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return L.get(a,c)||L.access(a,c,{empty:n.Callbacks("once memory").add(function(){L.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=L.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var Q=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,R=["Top","Right","Bottom","Left"],S=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},T=/^(?:checkbox|radio)$/i;!function(){var a=l.createDocumentFragment(),b=a.appendChild(l.createElement("div")),c=l.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var U="undefined";k.focusinBubbles="onfocusin"in a;var V=/^key/,W=/^(?:mouse|pointer|contextmenu)|click/,X=/^(?:focusinfocus|focusoutblur)$/,Y=/^([^.]*)(?:\.(.+)|)$/;function Z(){return!0}function $(){return!1}function _(){try{return l.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return typeof n!==U&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(E)||[""],j=b.length;while(j--)h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.hasData(a)&&L.get(a);if(r&&(i=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&(delete r.handle,L.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,m,o,p=[d||l],q=j.call(b,"type")?b.type:b,r=j.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||l,3!==d.nodeType&&8!==d.nodeType&&!X.test(q+n.event.triggered)&&(q.indexOf(".")>=0&&(r=q.split("."),q=r.shift(),r.sort()),k=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=r.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},e||!o.trigger||o.trigger.apply(d,c)!==!1)){if(!e&&!o.noBubble&&!n.isWindow(d)){for(i=o.delegateType||q,X.test(i+q)||(g=g.parentNode);g;g=g.parentNode)p.push(g),h=g;h===(d.ownerDocument||l)&&p.push(h.defaultView||h.parentWindow||a)}f=0;while((g=p[f++])&&!b.isPropagationStopped())b.type=f>1?i:o.bindType||q,m=(L.get(g,"events")||{})[b.type]&&L.get(g,"handle"),m&&m.apply(g,c),m=k&&g[k],m&&m.apply&&n.acceptData(g)&&(b.result=m.apply(g,c),b.result===!1&&b.preventDefault());return b.type=q,e||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!n.acceptData(d)||k&&n.isFunction(d[q])&&!n.isWindow(d)&&(h=d[k],h&&(d[k]=null),n.event.triggered=q,d[q](),n.event.triggered=void 0,h&&(d[k]=h)),b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(L.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(g.namespace))&&(a.handleObj=g,a.data=g.data,e=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(a.result=e)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>=0:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||l,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=W.test(e)?this.mouseHooks:V.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=l),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==_()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===_()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?Z:$):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:$,isPropagationStopped:$,isImmediatePropagationStopped:$,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=Z,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=Z,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=Z,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=L.access(d,b);e||d.addEventListener(a,c,!0),L.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=L.access(d,b)-1;e?L.access(d,b,e):(d.removeEventListener(a,c,!0),L.remove(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=$;else if(!d)return this;return 1===e&&(f=d,d=function(a){return n().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=$),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var ab=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bb=/<([\w:]+)/,cb=/<|&#?\w+;/,db=/<(?:script|style|link)/i,eb=/checked\s*(?:[^=]|=\s*.checked.)/i,fb=/^$|\/(?:java|ecma)script/i,gb=/^true\/(.*)/,hb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ib={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ib.optgroup=ib.option,ib.tbody=ib.tfoot=ib.colgroup=ib.caption=ib.thead,ib.th=ib.td;function jb(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function kb(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function lb(a){var b=gb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function mb(a,b){for(var c=0,d=a.length;d>c;c++)L.set(a[c],"globalEval",!b||L.get(b[c],"globalEval"))}function nb(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(L.hasData(a)&&(f=L.access(a),g=L.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}M.hasData(a)&&(h=M.access(a),i=n.extend({},h),M.set(b,i))}}function ob(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function pb(a,b){var c=b.nodeName.toLowerCase();"input"===c&&T.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}n.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=ob(h),f=ob(a),d=0,e=f.length;e>d;d++)pb(f[d],g[d]);if(b)if(c)for(f=f||ob(a),g=g||ob(h),d=0,e=f.length;e>d;d++)nb(f[d],g[d]);else nb(a,h);return g=ob(h,"script"),g.length>0&&mb(g,!i&&ob(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,o=a.length;o>m;m++)if(e=a[m],e||0===e)if("object"===n.type(e))n.merge(l,e.nodeType?[e]:e);else if(cb.test(e)){f=f||k.appendChild(b.createElement("div")),g=(bb.exec(e)||["",""])[1].toLowerCase(),h=ib[g]||ib._default,f.innerHTML=h[1]+e.replace(ab,"<$1></$2>")+h[2],j=h[0];while(j--)f=f.lastChild;n.merge(l,f.childNodes),f=k.firstChild,f.textContent=""}else l.push(b.createTextNode(e));k.textContent="",m=0;while(e=l[m++])if((!d||-1===n.inArray(e,d))&&(i=n.contains(e.ownerDocument,e),f=ob(k.appendChild(e),"script"),i&&mb(f),c)){j=0;while(e=f[j++])fb.test(e.type||"")&&c.push(e)}return k},cleanData:function(a){for(var b,c,d,e,f=n.event.special,g=0;void 0!==(c=a[g]);g++){if(n.acceptData(c)&&(e=c[L.expando],e&&(b=L.cache[e]))){if(b.events)for(d in b.events)f[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);L.cache[e]&&delete L.cache[e]}delete M.cache[c[M.expando]]}}}),n.fn.extend({text:function(a){return J(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(ob(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&mb(ob(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(ob(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return J(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!db.test(a)&&!ib[(bb.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(ab,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(ob(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(ob(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,m=this,o=l-1,p=a[0],q=n.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&eb.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(c=n.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){for(f=n.map(ob(c,"script"),kb),g=f.length;l>j;j++)h=c,j!==o&&(h=n.clone(h,!0,!0),g&&n.merge(f,ob(h,"script"))),b.call(this[j],h,j);if(g)for(i=f[f.length-1].ownerDocument,n.map(f,lb),j=0;g>j;j++)h=f[j],fb.test(h.type||"")&&!L.access(h,"globalEval")&&n.contains(i,h)&&(h.src?n._evalUrl&&n._evalUrl(h.src):n.globalEval(h.textContent.replace(hb,"")))}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),g=e.length-1,h=0;g>=h;h++)c=h===g?this:this.clone(!0),n(e[h])[b](c),f.apply(d,c.get());return this.pushStack(d)}});var qb,rb={};function sb(b,c){var d,e=n(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:n.css(e[0],"display");return e.detach(),f}function tb(a){var b=l,c=rb[a];return c||(c=sb(a,b),"none"!==c&&c||(qb=(qb||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=qb[0].contentDocument,b.write(),b.close(),c=sb(a,b),qb.detach()),rb[a]=c),c}var ub=/^margin/,vb=new RegExp("^("+Q+")(?!px)[a-z%]+$","i"),wb=function(b){return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)};function xb(a,b,c){var d,e,f,g,h=a.style;return c=c||wb(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),vb.test(g)&&ub.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function yb(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d=l.documentElement,e=l.createElement("div"),f=l.createElement("div");if(f.style){f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===f.style.backgroundClip,e.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",e.appendChild(f);function g(){f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",f.innerHTML="",d.appendChild(e);var g=a.getComputedStyle(f,null);b="1%"!==g.top,c="4px"===g.width,d.removeChild(e)}a.getComputedStyle&&n.extend(k,{pixelPosition:function(){return g(),b},boxSizingReliable:function(){return null==c&&g(),c},reliableMarginRight:function(){var b,c=f.appendChild(l.createElement("div"));return c.style.cssText=f.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",f.style.width="1px",d.appendChild(e),b=!parseFloat(a.getComputedStyle(c,null).marginRight),d.removeChild(e),f.removeChild(c),b}})}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var zb=/^(none|table(?!-c[ea]).+)/,Ab=new RegExp("^("+Q+")(.*)$","i"),Bb=new RegExp("^([+-])=("+Q+")","i"),Cb={position:"absolute",visibility:"hidden",display:"block"},Db={letterSpacing:"0",fontWeight:"400"},Eb=["Webkit","O","Moz","ms"];function Fb(a,b){if(b in a)return b;var c=b[0].toUpperCase()+b.slice(1),d=b,e=Eb.length;while(e--)if(b=Eb[e]+c,b in a)return b;return d}function Gb(a,b,c){var d=Ab.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Hb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+R[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+R[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+R[f]+"Width",!0,e))):(g+=n.css(a,"padding"+R[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+R[f]+"Width",!0,e)));return g}function Ib(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=wb(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=xb(a,b,f),(0>e||null==e)&&(e=a.style[b]),vb.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Hb(a,b,c||(g?"border":"content"),d,f)+"px"}function Jb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=L.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&S(d)&&(f[g]=L.access(d,"olddisplay",tb(d.nodeName)))):(e=S(d),"none"===c&&e||L.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=xb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Fb(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Bb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Fb(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=xb(a,b,d)),"normal"===e&&b in Db&&(e=Db[b]),""===c||c?(f=parseFloat(e),c===!0||n.isNumeric(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?zb.test(n.css(a,"display"))&&0===a.offsetWidth?n.swap(a,Cb,function(){return Ib(a,b,d)}):Ib(a,b,d):void 0},set:function(a,c,d){var e=d&&wb(a);return Gb(a,c,d?Hb(a,b,d,"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),n.cssHooks.marginRight=yb(k.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},xb,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+R[d]+b]=f[d]||f[d-2]||f[0];return e}},ub.test(a)||(n.cssHooks[a+b].set=Gb)}),n.fn.extend({css:function(a,b){return J(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=wb(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Jb(this,!0)},hide:function(){return Jb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){S(this)?n(this).show():n(this).hide()})}});function Kb(a,b,c,d,e){return new Kb.prototype.init(a,b,c,d,e)}n.Tween=Kb,Kb.prototype={constructor:Kb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Kb.propHooks[this.prop];return a&&a.get?a.get(this):Kb.propHooks._default.get(this)},run:function(a){var b,c=Kb.propHooks[this.prop];return this.pos=b=this.options.duration?n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Kb.propHooks._default.set(this),this}},Kb.prototype.init.prototype=Kb.prototype,Kb.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Kb.propHooks.scrollTop=Kb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=Kb.prototype.init,n.fx.step={};var Lb,Mb,Nb=/^(?:toggle|show|hide)$/,Ob=new RegExp("^(?:([+-])=|)("+Q+")([a-z%]*)$","i"),Pb=/queueHooks$/,Qb=[Vb],Rb={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=Ob.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&Ob.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function Sb(){return setTimeout(function(){Lb=void 0}),Lb=n.now()}function Tb(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=R[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ub(a,b,c){for(var d,e=(Rb[b]||[]).concat(Rb["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Vb(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&S(a),q=L.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?L.get(a,"olddisplay")||tb(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Nb.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?tb(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=L.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;L.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ub(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function Wb(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function Xb(a,b,c){var d,e,f=0,g=Qb.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Lb||Sb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:Lb||Sb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(Wb(k,j.opts.specialEasing);g>f;f++)if(d=Qb[f].call(j,a,k,j.opts))return d;return n.map(k,Ub,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(Xb,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],Rb[c]=Rb[c]||[],Rb[c].unshift(b)},prefilter:function(a,b){b?Qb.unshift(a):Qb.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(S).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=Xb(this,n.extend({},a),f);(e||L.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=L.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Pb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=L.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Tb(b,!0),a,d,e)}}),n.each({slideDown:Tb("show"),slideUp:Tb("hide"),slideToggle:Tb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(Lb=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),Lb=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Mb||(Mb=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(Mb),Mb=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=l.createElement("input"),b=l.createElement("select"),c=b.appendChild(l.createElement("option"));a.type="checkbox",k.checkOn=""!==a.value,k.optSelected=c.selected,b.disabled=!0,k.optDisabled=!c.disabled,a=l.createElement("input"),a.value="t",a.type="radio",k.radioValue="t"===a.value}();var Yb,Zb,$b=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return J(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===U?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?Zb:Yb)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))
},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),Zb={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=$b[b]||n.find.attr;$b[b]=function(a,b,d){var e,f;return d||(f=$b[b],$b[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,$b[b]=f),e}});var _b=/^(?:input|select|textarea|button)$/i;n.fn.extend({prop:function(a,b){return J(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||_b.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),k.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var ac=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===U||"boolean"===c)&&(this.className&&L.set(this,"__className__",this.className),this.className=this.className||a===!1?"":L.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ac," ").indexOf(b)>=0)return!0;return!1}});var bc=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(bc,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(d.value,f)>=0)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},k.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var cc=n.now(),dc=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&n.error("Invalid XML: "+a),b};var ec=/#.*$/,fc=/([?&])_=[^&]*/,gc=/^(.*?):[ \t]*([^\r\n]*)$/gm,hc=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,ic=/^(?:GET|HEAD)$/,jc=/^\/\//,kc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,lc={},mc={},nc="*/".concat("*"),oc=a.location.href,pc=kc.exec(oc.toLowerCase())||[];function qc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function rc(a,b,c,d){var e={},f=a===mc;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function sc(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function tc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function uc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:oc,type:"GET",isLocal:hc.test(pc[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":nc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?sc(sc(a,n.ajaxSettings),b):sc(n.ajaxSettings,a)},ajaxPrefilter:qc(lc),ajaxTransport:qc(mc),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!f){f={};while(b=gc.exec(e))f[b[1].toLowerCase()]=b[2]}b=f[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?e:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return c&&c.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||oc)+"").replace(ec,"").replace(jc,pc[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(h=kc.exec(k.url.toLowerCase()),k.crossDomain=!(!h||h[1]===pc[1]&&h[2]===pc[2]&&(h[3]||("http:"===h[1]?"80":"443"))===(pc[3]||("http:"===pc[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),rc(lc,k,b,v),2===t)return v;i=n.event&&k.global,i&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!ic.test(k.type),d=k.url,k.hasContent||(k.data&&(d=k.url+=(dc.test(d)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=fc.test(d)?d.replace(fc,"$1_="+cc++):d+(dc.test(d)?"&":"?")+"_="+cc++)),k.ifModified&&(n.lastModified[d]&&v.setRequestHeader("If-Modified-Since",n.lastModified[d]),n.etag[d]&&v.setRequestHeader("If-None-Match",n.etag[d])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+nc+"; q=0.01":""):k.accepts["*"]);for(j in k.headers)v.setRequestHeader(j,k.headers[j]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(j in{success:1,error:1,complete:1})v[j](k[j]);if(c=rc(mc,k,b,v)){v.readyState=1,i&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,c.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,f,h){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),c=void 0,e=h||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,f&&(u=tc(k,v,f)),u=uc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[d]=w),w=v.getResponseHeader("etag"),w&&(n.etag[d]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,i&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),i&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var vc=/%20/g,wc=/\[\]$/,xc=/\r?\n/g,yc=/^(?:submit|button|image|reset|file)$/i,zc=/^(?:input|select|textarea|keygen)/i;function Ac(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||wc.test(a)?d(a,e):Ac(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Ac(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Ac(c,a[c],b,e);return d.join("&").replace(vc,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&zc.test(this.nodeName)&&!yc.test(a)&&(this.checked||!T.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(xc,"\r\n")}}):{name:b.name,value:c.replace(xc,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Bc=0,Cc={},Dc={0:200,1223:204},Ec=n.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Cc)Cc[a]()}),k.cors=!!Ec&&"withCredentials"in Ec,k.ajax=Ec=!!Ec,n.ajaxTransport(function(a){var b;return k.cors||Ec&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Bc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Cc[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Dc[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Cc[g]=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(h){if(b)throw h}},abort:function(){b&&b()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=n("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),l.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Fc=[],Gc=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Fc.pop()||n.expando+"_"+cc++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Gc.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Gc.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Gc,"$1"+e):b.jsonp!==!1&&(b.url+=(dc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Fc.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||l;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var Hc=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Hc)return Hc.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var Ic=a.document.documentElement;function Jc(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(typeof d.getBoundingClientRect!==U&&(e=d.getBoundingClientRect()),c=Jc(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||Ic;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ic})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;n.fn[b]=function(e){return J(this,function(b,e,f){var g=Jc(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=yb(k.pixelPosition,function(a,c){return c?(c=xb(a,b),vb.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return J(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Kc=a.jQuery,Lc=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Lc),b&&a.jQuery===n&&(a.jQuery=Kc),n},typeof b===U&&(a.jQuery=a.$=n),n});
LibraryThingConnector.utils.jQuery = jQuery.noConflict( true );$syndetics.jQuery = LibraryThingConnector.utils.jQuery;LibraryThingConnector.utils.Sizzle = LibraryThingConnector.utils.jQuery;// HTML Truncator for jQuery
// by Henrik Nyh <http://henrik.nyh.se> 2008-02-28.
// Free to modify and redistribute with credit.
// This function bas been modified from https://github.com/henrik/jquery.truncator.js
// such that is does not truncate in the middle of a word.
(function($) {

  var trailing_whitespace = true;

  $.fn.truncate = function(options) {

    var opts = $.extend({}, $.fn.truncate.defaults, options);

    $(this).each(function() {

      var content_length = $.trim(squeeze($(this).text())).length;
      if (content_length <= opts.max_length)
        return;  // bail early if not overlong
      
      // include more text, link prefix, and link suffix in max length
      var actual_max_length = opts.max_length - opts.more.length - opts.link_prefix.length - opts.link_suffix.length;

      var truncated_node = recursivelyTruncate(this, actual_max_length);
      var full_node = $(this).hide();

      truncated_node.insertAfter(full_node);

		// NB the opts.link_prefix and opts.link_suffix used to be outside the anchor.  moved within to allow hiding less using css rule against css_less_class
      findNodeForMore(truncated_node).append('<a href="#more" class="'+opts.css_more_class+'">'+opts.link_prefix+opts.more+opts.link_suffix+'</a>');
      findNodeForLess(full_node).append('<a href="#less" class="'+opts.css_less_class+'">'+opts.link_prefix+opts.less+opts.link_suffix+'</a>');

      truncated_node.find('a:last').click(function() {
        truncated_node.hide(); full_node.show(); return false;
      });
      full_node.find('a:last').click(function() {
        truncated_node.show(); full_node.hide(); return false;
      });

    });
  }

  // Note that the " (â€¦more)" bit counts towards the max length â€“ so a max
  // length of 10 would truncate "1234567890" to "12 (â€¦more)".
  $.fn.truncate.defaults = {
    max_length: 100,
    more: 'â€¦more',
    less: 'less',
    css_more_class: 'truncator-link truncator-more',
    css_less_class: 'truncator-link truncator-less',
    link_prefix: ' (',
    link_suffix: ')'
  };

  function recursivelyTruncate(node, max_length) {
    return (node.nodeType == 3) ? truncateText(node, max_length) : truncateNode(node, max_length);
  }

  function truncateNode(node, max_length) {
    var node = $(node);
    var new_node = node.clone().empty();
    var truncatedChild;
    node.contents().each(function() {
      var remaining_length = max_length - new_node.text().length;
      if (remaining_length <= 0) return;  // breaks the loop
      truncatedChild = recursivelyTruncate(this, remaining_length);
      if (truncatedChild) new_node.append(truncatedChild);
    });
    return new_node;
  }

  function truncateText(node, max_length) {
    var text = squeeze(node.data);
    if (trailing_whitespace)  // remove initial whitespace if last text
      text = text.replace(/^ /, '');  // node had trailing whitespace.
    trailing_whitespace = !!text.match(/ $/);
    // Truncate text if it's longer then max length
    if(text.length >= max_length) {
      // Ensure text is not truncated in the middle of a word
    	if(text.charAt(max_length - 1) != " ") {
        var next_space = text.indexOf(" ", max_length);
        text = next_space > 0 ? text.slice(0, next_space) : text;
      } else {
        var text = text.slice(0, max_length);  
      }
    }
    // Ensure HTML entities are encoded
    // http://debuggable.com/posts/encode-html-entities-with-jquery:480f4dd6-13cc-4ce9-8071-4710cbdd56cb
    text = $('<div/>').text(text).html();
    return text;
  }

  // Collapses a sequence of whitespace into a single space.
  function squeeze(string) {
    return string.replace(/\s+/g, ' ');
  }

  // Finds the last, innermost block-level element
  function findNodeForMore(node) {
    var $node = $(node);
    var last_child = $node.children(":last");
    if (!last_child) return node;
    var display = last_child.css('display');
    if (!display || display=='inline') return $node;
    return findNodeForMore(last_child);
  };

  // Finds the last child if it's a p; otherwise the parent
  function findNodeForLess(node) {
    var $node = $(node);
    var last_child = $node.children(":last");
    if (last_child && last_child.is('p')) return last_child;
    return node;
  };

})(LibraryThingConnector.utils.jQuery);
/*!
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery throttle / debounce: Sometimes, less is more!
//
// *Version: 1.1, Last updated: 3/7/2010*
// 
// Project Home - http://benalman.com/projects/jquery-throttle-debounce-plugin/
// GitHub       - http://github.com/cowboy/jquery-throttle-debounce/
// Source       - http://github.com/cowboy/jquery-throttle-debounce/raw/master/jquery.ba-throttle-debounce.js
// (Minified)   - http://github.com/cowboy/jquery-throttle-debounce/raw/master/jquery.ba-throttle-debounce.min.js (0.7kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// Throttle - http://benalman.com/code/projects/jquery-throttle-debounce/examples/throttle/
// Debounce - http://benalman.com/code/projects/jquery-throttle-debounce/examples/debounce/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - none, 1.3.2, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome 4-5, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-throttle-debounce/unit/
// 
// About: Release History
// 
// 1.1 - (3/7/2010) Fixed a bug in <jQuery.throttle> where trailing callbacks
//       executed later than they should. Reworked a fair amount of internal
//       logic as well.
// 1.0 - (3/6/2010) Initial release as a stand-alone project. Migrated over
//       from jquery-misc repo v0.4 to jquery-throttle repo v1.0, added the
//       no_trailing throttle parameter and debounce functionality.
// 
// Topic: Note for non-jQuery users
// 
// jQuery isn't actually required for this plugin, because nothing internal
// uses any jQuery methods or properties. jQuery is just used as a namespace
// under which these methods can exist.
// 
// Since jQuery isn't actually required for this plugin, if jQuery doesn't exist
// when this plugin is loaded, the method described below will be created in
// the `Cowboy` namespace. Usage will be exactly the same, but instead of
// $.method() or jQuery.method(), you'll need to use Cowboy.method().

(function(window,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // Since jQuery really isn't required for this plugin, use `jQuery` as the
  // namespace only if it already exists, otherwise use the `Cowboy` namespace,
  // creating it if necessary.
  var $ = LibraryThingConnector.utils.jQuery,
    
    // Internal method reference.
    jq_throttle;
  
  // Method: jQuery.throttle
  // 
  // Throttle execution of a function. Especially useful for rate limiting
  // execution of handlers on events like resize and scroll. If you want to
  // rate-limit execution of a function to a single time, see the
  // <jQuery.debounce> method.
  // 
  // In this visualization, | is a throttled-function call and X is the actual
  // callback execution:
  // 
  // > Throttled with `no_trailing` specified as false or unspecified:
  // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
  // > X    X    X    X    X    X        X    X    X    X    X    X
  // > 
  // > Throttled with `no_trailing` specified as true:
  // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
  // > X    X    X    X    X             X    X    X    X    X
  // 
  // Usage:
  // 
  // > var throttled = jQuery.throttle( delay, [ no_trailing, ] callback );
  // > 
  // > jQuery('selector').bind( 'someevent', throttled );
  // > jQuery('selector').unbind( 'someevent', throttled );
  // 
  // This also works in jQuery 1.4+:
  // 
  // > jQuery('selector').bind( 'someevent', jQuery.throttle( delay, [ no_trailing, ] callback ) );
  // > jQuery('selector').unbind( 'someevent', callback );
  // 
  // Arguments:
  // 
  //  delay - (Number) A zero-or-greater delay in milliseconds. For event
  //    callbacks, values around 100 or 250 (or even higher) are most useful.
  //  no_trailing - (Boolean) Optional, defaults to false. If no_trailing is
  //    true, callback will only execute every `delay` milliseconds while the
  //    throttled-function is being called. If no_trailing is false or
  //    unspecified, callback will be executed one final time after the last
  //    throttled-function call. (After the throttled-function has not been
  //    called for `delay` milliseconds, the internal counter is reset)
  //  callback - (Function) A function to be executed after delay milliseconds.
  //    The `this` context and all arguments are passed through, as-is, to
  //    `callback` when the throttled-function is executed.
  // 
  // Returns:
  // 
  //  (Function) A new, throttled, function.
  
  $.throttle = jq_throttle = function( delay, no_trailing, callback, debounce_mode ) {
    // After wrapper has stopped being called, this timeout ensures that
    // `callback` is executed at the proper times in `throttle` and `end`
    // debounce modes.
    var timeout_id,
      
      // Keep track of the last time `callback` was executed.
      last_exec = 0;
    
    // `no_trailing` defaults to falsy.
    if ( typeof no_trailing !== 'boolean' ) {
      debounce_mode = callback;
      callback = no_trailing;
      no_trailing = undefined;
    }
    
    // The `wrapper` function encapsulates all of the throttling / debouncing
    // functionality and when executed will limit the rate at which `callback`
    // is executed.
    function wrapper() {
      var that = this,
        elapsed = +new Date() - last_exec,
        args = arguments;
      
      // Execute `callback` and update the `last_exec` timestamp.
      function exec() {
        last_exec = +new Date();
        callback.apply( that, args );
      };
      
      // If `debounce_mode` is true (at_begin) this is used to clear the flag
      // to allow future `callback` executions.
      function clear() {
        timeout_id = undefined;
      };
      
      if ( debounce_mode && !timeout_id ) {
        // Since `wrapper` is being called for the first time and
        // `debounce_mode` is true (at_begin), execute `callback`.
        exec();
      }
      
      // Clear any existing timeout.
      timeout_id && clearTimeout( timeout_id );
      
      if ( debounce_mode === undefined && elapsed > delay ) {
        // In throttle mode, if `delay` time has been exceeded, execute
        // `callback`.
        exec();
        
      } else if ( no_trailing !== true ) {
        // In trailing throttle mode, since `delay` time has not been
        // exceeded, schedule `callback` to execute `delay` ms after most
        // recent execution.
        // 
        // If `debounce_mode` is true (at_begin), schedule `clear` to execute
        // after `delay` ms.
        // 
        // If `debounce_mode` is false (at end), schedule `callback` to
        // execute after `delay` ms.
        timeout_id = setTimeout( debounce_mode ? clear : exec, debounce_mode === undefined ? delay - elapsed : delay );
      }
    };
    
    // Set the guid of `wrapper` function to the same of original callback, so
    // it can be removed in jQuery 1.4+ .unbind or .die by using the original
    // callback as a reference.
    if ( $.guid ) {
      wrapper.guid = callback.guid = callback.guid || $.guid++;
    }
    
    // Return the wrapper function.
    return wrapper;
  };
  
  // Method: jQuery.debounce
  // 
  // Debounce execution of a function. Debouncing, unlike throttling,
  // guarantees that a function is only executed a single time, either at the
  // very beginning of a series of calls, or at the very end. If you want to
  // simply rate-limit execution of a function, see the <jQuery.throttle>
  // method.
  // 
  // In this visualization, | is a debounced-function call and X is the actual
  // callback execution:
  // 
  // > Debounced with `at_begin` specified as false or unspecified:
  // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
  // >                          X                                 X
  // > 
  // > Debounced with `at_begin` specified as true:
  // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
  // > X                                 X
  // 
  // Usage:
  // 
  // > var debounced = jQuery.debounce( delay, [ at_begin, ] callback );
  // > 
  // > jQuery('selector').bind( 'someevent', debounced );
  // > jQuery('selector').unbind( 'someevent', debounced );
  // 
  // This also works in jQuery 1.4+:
  // 
  // > jQuery('selector').bind( 'someevent', jQuery.debounce( delay, [ at_begin, ] callback ) );
  // > jQuery('selector').unbind( 'someevent', callback );
  // 
  // Arguments:
  // 
  //  delay - (Number) A zero-or-greater delay in milliseconds. For event
  //    callbacks, values around 100 or 250 (or even higher) are most useful.
  //  at_begin - (Boolean) Optional, defaults to false. If at_begin is false or
  //    unspecified, callback will only be executed `delay` milliseconds after
  //    the last debounced-function call. If at_begin is true, callback will be
  //    executed only at the first debounced-function call. (After the
  //    throttled-function has not been called for `delay` milliseconds, the
  //    internal counter is reset)
  //  callback - (Function) A function to be executed after delay milliseconds.
  //    The `this` context and all arguments are passed through, as-is, to
  //    `callback` when the debounced-function is executed.
  // 
  // Returns:
  // 
  //  (Function) A new, debounced, function.
  
  $.debounce = function( delay, at_begin, callback ) {
    return callback === undefined
      ? jq_throttle( delay, at_begin, false )
      : jq_throttle( delay, callback, at_begin !== false );
  };
  
})(LibraryThingConnector.utils.jQuery);
/* jquery extensions for Unbound */


	/* jquery extensions */
/*
 Color animation 1.6.0
 http://www.bitstorm.org/jquery/color-animation/

 */

(function( $ ) {

	$.fn.pulse = function(params, callback) {};
	$.fn.flash = function(color, duration, p ) {};

	if (Unbound_browserClassesAA.brand === "ie") {
		return;
	}

	/**
	 * Check whether the browser supports RGBA color mode.
	 *
	 * Author Mehdi Kabab <http://pioupioum.fr>
	 * @return {boolean} True if the browser support RGBA. False otherwise.
	 */
	function isRGBACapable() {
		var $script = $('script:first'),
			color = $script.css('color'),
			result = false;
		if (/^rgba/.test(color)) {
			result = true;
		} else {
			try {
				result = ( color != $script.css('color', 'rgba(0, 0, 0, 0.5)').css('color') );
				$script.css('color', color);
			} catch (e) {
			}
		}

		return result;
	}

	$.extend(true, $, {
		support: {
			'rgba': isRGBACapable()
		}
	});

	var properties = ['color', 'backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'outlineColor'];
	$.each(properties, function(i, property) {
		$.Tween.propHooks[ property ] = {
			get: function(tween) {
				return $(tween.elem).css(property);
			},
			set: function(tween) {
				var style = tween.elem.style;
				var p_prop = $(tween.elem).css(property);
				//CH: fix for usage of 0,0,0,0 for "transparent" backgrounds. Causes them to go dark on animations
				if (p_prop == '' || p_prop == 'rgba(0, 0, 0, 0)' || p_prop == 'transparent') {
					p_prop = 'rgba(255,255,255,0)';
				}
				var p_begin = parseColor(p_prop);
				var p_end = parseColor(tween.end);
				tween.run = function(progress) {
					style[property] = calculateColor(p_begin, p_end, progress);
				}
			}
		}
	});

	// borderColor doesn't fit in standard fx.step above.
	$.Tween.propHooks.borderColor = {
		set: function(tween) {
			var style = tween.elem.style;
			var p_begin = [];
			var borders = properties.slice(2, 6); // All four border properties
			$.each(borders, function(i, property) {
				p_begin[property] = parseColor($(tween.elem).css(property));
			});
			var p_end = parseColor(tween.end);
			tween.run = function(progress) {
				$.each(borders, function(i, property) {
					style[property] = calculateColor(p_begin[property], p_end, progress);
				});
			}
		}
	};

	// Calculate an in-between color. Returns "#aabbcc"-like string.
	function calculateColor(begin, end, pos) {
		var color = 'rgb' + ($.support['rgba'] ? 'a' : '') + '('
			+ parseInt((begin[0] + pos * (end[0] - begin[0])), 10) + ','
			+ parseInt((begin[1] + pos * (end[1] - begin[1])), 10) + ','
			+ parseInt((begin[2] + pos * (end[2] - begin[2])), 10);
		if ($.support['rgba']) {
			color += ',' + (begin && end ? parseFloat(begin[3] + pos * (end[3] - begin[3])) : 1);
		}
		color += ')';
		return color;
	}

	// Parse an CSS-syntax color. Outputs an array [r, g, b]
	function parseColor(color) {
		var match, quadruplet;

		// Match #aabbcc
		if (match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(color)) {
			quadruplet = [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16), 1];

			// Match #abc
		} else if (match = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(color)) {
			quadruplet = [parseInt(match[1], 16) * 17, parseInt(match[2], 16) * 17, parseInt(match[3], 16) * 17, 1];

			// Match rgb(n, n, n)
		} else if (match = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) {
			quadruplet = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), 1];

		} else if (match = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(color)) {
			quadruplet = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10),parseFloat(match[4])];

			// No browser returns rgb(n%, n%, n%), so little reason to support this format.
		} else {
			quadruplet = [255,255,255,0];
		}
		return quadruplet;
	}




	/* flash the background of an element. Yellow is the default color. */
	/* Usage: jqueryObject.flash(); */
	$.fn.pulse = function(params, callback) {
		params = params || {};
		p = params.p || 'backgroundColor';
		color = params.color || '#F1DD8E';
		duration = params.duration || 250;
		var orig = this.css(p);
		if (orig == '' || orig == 'rgba(0, 0, 0, 0)' || orig == 'transparent') {
			orig = 'rgba(255,255,255,0)';
		}
		var ph = {}; ph[p] = color;
		var pho = {}; pho[p] = orig;
		if (typeof callback !== 'function') { callback = function(){}; }
		this.animate(ph, duration,
			function() {$(this).animate(pho, duration, callback) });
	};

	$.fn.flash = function(color, duration, p )
	{
		var p = p || 'backgroundColor';
		var color = color || '#F1DD8E';
		var duration = duration || 250;
		var orig = this.css(p);
		var orig = this.css(p);
		if (orig == '' || orig == 'rgba(0, 0, 0, 0)' || orig == 'transparent') {
			orig = 'rgba(255,255,255,0)';
		}
		var ph = {}; ph[p] = color;
		var pho = {}; pho[p] = orig;

		this.animate(ph, duration,
			function() {$(this).animate(pho, duration,

				function() { $(this).animate(ph, duration,
					function() {$(this).animate(pho, duration,

						function() { $(this).animate(ph, duration,
							function() {$(this).animate(pho, duration)
							})
						})
					})
				})
			});

	};
})(LibraryThingConnector.utils.jQuery);

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}
/* loading js/lt_lightbox2016.js */
var LibraryThing = LibraryThing || {};
LibraryThing.lightbox2016 = LibraryThing.lightbox2016 || {};

(function( $ ) {
	LibraryThing.lightbox2016 = {

		major_version: 2016,
		minor_version: 1,
		active: 0,

		yPos: 0,
		xPos: 0,

		supportsTouches: ("createTouch" in document),
		touchclass: this.supportsTouches ? 'touch' : '',
		ie: (navigator.appName == 'Microsoft Internet Explorer' ? true : false),
		ie_version: null,
		//safari : (navigator.vendor == 'Apple Computer, Inc.' ? true : false),
		safari: RegExp(" AppleWebKit", 'i').test(navigator.userAgent),
		webkit: (RegExp("webkit", 'i').test(navigator.userAgent)) ? 'webkit' : '',
		mobile: (RegExp("Mobile", 'i').test(navigator.userAgent)) ? 'mobile' : '',
		dochead: document.getElementsByTagName('head')[0],
		initialized: false,

		//div_container : null,
		div_overlay: null,
		div_contentwrapper: null,
		div_content: null,
		div_loading: null,
		div_loadingcontent: null,
		div_closebox: null,
		div_title: null,

		default_width: 400,
		default_height: 350,
		current_width: 0,
		current_height: 0,

		params: {},
		hasiframe: false,

		remove_close: false,

		vertical_offset: 0,

		/* Utility function that matches LT's normal usage */
		basic_ajax: function (url, params, callback, request) {
			if (typeof request !== 'undefined') {
				mmlog('going to try and abort this request', 'warning');
				if (typeof request.abort === 'function') {
					request.abort();
				}
			}

			request = $.ajax({
				type: "POST",
				url: url,
				datatype: 'json',
				data: params,
				complete: callback,
				async: true
			});
			return request;
		},

		init: function () {
			this.active = true;
			try {
				if (!this.initialized) {
					var that = this;
					//alert('initializing lightbox');
					this.body = $('body');

					// create the lightbox divs
					var _opactype = LibraryThingConnector.backend.name || 'opactype';
					var mobile = /Mobile/i.test(navigator.userAgent) ? 'mobile' : 'notmobile';
					var classes = LibraryThing.lightbox2016.webkit + ' ' + LibraryThing.lightbox2016.touchclass + ' ' + mobile;
					classes = classes + ' unbound_lightbox_aid_' + LibraryThingConnector.a_id;
					this.div_wrapper = $('<div id="LT_LB_wrapper" class="lightbox_2016 '+ classes +'" version="2017.1"></div>').appendTo(this.body);
					this.div_wrapper.addClass(_opactype);

					this.div_overlay = $('<div id="LT_LB_overlay"></div>');
					this.div_wrapper.append(this.div_overlay);
					//this.div_container = $('<div id="LT_LB_container"></div>');
					//this.div_wrapper.append(this.div_container);


					this.div_lightbox = $('<div id="LT_LB"></div>');
					this.div_wrapper.append(this.div_lightbox);

					/* Header */
					this.div_header = $('<div id="LT_LB_header"></div>');
					this.div_lightbox.append(this.div_header);


					//this.div_goback = $('<div id="LT_LB_goback"><span id="LT_LB_goback_i">&#9664;</span> Return to Title</div>');
					//this.div_header.append(this.div_goback);

					//this.div_title = $('<div id="LT_LB_title">' + navigator.userAgent + '</div>');
					this.div_title = $('<div tabindex="0" id="LT_LB_title" role="heading" aria-level="2"></div>');
					this.div_header.append(this.div_title);

					this.div_closebox = $('<div aria-label="Close lightbox" tabindex="0" title="Close lightbox" id="LT_LB_close" role="button">&times;</div>');
					//this.div_closebox = $('<div id="LT_LB_close"><span id="LT_LB_goback_i">&#9664;</span> Return to Title</div>');
					this.div_header.append(this.div_closebox);


					// set handler for the close/go back boxes
					//this.div_goback.on('click', function(event) {
					//	that.stopEvent(event);
					//	that.off();
					//});


					this.div_closebox.on('click', function (event) {
						that.stopEvent(event);
						that.off();
					});


					this.div_loading = $('<div id="LT_LB_loading"></div>');
					this.div_lightbox.append(this.div_loading);
					// using LT's old spinner gif.
					//this.div_loadingcontent = $('<div id="LT_LB_loadingcontent"><img height="16px" width="16px" src="https://pics.librarything.com/pics/spinner.gif" alt="Loading..." /></div>');
					// If you have fontawesome, then you can use this nice svg spinner.
					//this.div_loadingcontent = $('<div id="LT_LB_loadingcontent"><i class="fa fa-circle-o-notch fa-spin"></i></div>');
					// Or you can use plain text.
					this.div_loadingcontent = $('<div id="LT_LB_loadingcontent"><img class="LT_LB_loadinganim" src="https://ltfl.librarything.com/pics/su_loading_60dg.gif" srcset="https://ltfl.librarything.com/pics/su_loading_120dg.gif 2x, https://ltfl.librarything.com/pics/su_loading_180dg.gif 3x" /></div>');
					this.div_loading.append(this.div_loadingcontent);

					//this.div_contentwrapper = $('<div id="LT_LB_contentwrapper"></div>');
					//this.div_lightbox.append(this.div_contentwrapper);

					this.div_content = $('<div id="LT_LB_content"></div>');
					this.div_lightbox.append(this.div_content);

					//TODO: make this parameterized
					this.div_overlay.addClass('LT_LB_overlay_white');

					if (this.ie) {
						if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
							this.ie_version = new Number(RegExp.$1) // capture x.x portion and store as a number
						}
					}

					this.initialized = true;
				}
				else {
					this.div_wrapper.removeClass('w700h700').removeClass('w10000h10000').removeClass('custom_size');
				}
			}
			catch (e) {
				//alert('there was a problem initializing the lightbox');
				this.initialized = false;
			}
		},


		/*
		 This is the meat of the soup. This is usually what gets called to show the lightbox with ajax content.
		 */
		open: function (contentURL, params) {
			params = params || {};
			this.params = {};
			var that = this; // so that we can use a relative reference to 'this' inside the response functions

			/* NOTE: ch 2020-01: I THINK we need to check to see if we're being called from within the iframe and make that/this a reference
			from outside the iframe if that is the case. Still trying to figure this out.
			 */

			if (contentURL) {
				if (params.fullscreen) {
					// quick fix to add fullscreen support. Just make the h/w be something really big
					// and the code will fit them to the window on setPosition.
					params.width = 10000;
					params.height = 10000;
				}
				params.method = params.method || 'ajax'; // default to ajax
				this.init();
				var uid = 0;//LT_GetRandomID(5);
				var ajaxparams = {};
				params = params || {}
				this.setParams(params);
				if (params['ajaxparams']) {
					ajaxparams = params['ajaxparams'];
				}
				ajaxparams.uid = uid;


				if (params.height || params.width) {
					this.div_wrapper.addClass('w'+params.width+'h'+params.height);
					if (params.width != 10000) {
						this.div_wrapper.addClass('custom_size');
					}
				}

				// TODO: we might have to check/set overflow-y and x here too.
				this.original_body_overflow = this.body.css('overflow');
				this.original_body_overflow_x = this.body.css('overflow-x');
				this.original_body_overflow_y = this.body.css('overflow-y');
				try {
					if (LibraryThingConnector && !LibraryThingConnector.backend.name == 'primo') {
						// don't set the body overflow for primo because it causes problems with their slideout nav
						this.body.css({'overflow': 'hidden'});
					}
				} catch (err) { }

				this.setPosition(true);


				/* set title of lightbox if part of params */
				if (typeof params.title !== 'undefined') {
					this.div_title.html(params.title);
				}
				else {
					this.div_title.html('Syndetics Unbound');
				}

				var lightboxResponse = function (t, status) {
					var rt = t.responseText;

					// TODO: use the ajax status object to check for errors instead.
					if (rt === '') { // ERROR
						that.div_content.html('There was a problem retrieving the data. Please try again. (<a href="#" onclick="LibraryThing.lightbox2016.off()">close</a>)');
					}
					else { // SUCCESS -----
						that.setContent(rt);

						/*
						 if ( typeof rt.evalScripts == 'function' ) {
						 rt.evalScripts();
						 }
						 */

						that.ready();
						if (that.params.scriptwhendone) {
							eval(that.params.scriptwhendone);
						}
					}
					that.div_content.scrollTop(0)


					that.setLoading(false);
				};

				this.setLoading(true);


				this.initLightboxEvents();
				this.modalCheck();


				if (params.method === 'iframe') {
					var iframe_height = this.current_height - 5;
					this.div_content.addClass('iframe');

					// remove any existing iframe
					this.removeIFrame();

					// need to set the iframe height to match the height of LT_LB somehow.

					this.iframe = $('<iframe id="LTIFid" src="' + contentURL + '" \ ' +
						'height="100%" \ ' +
						'width="100%" ' +
						'frameborder="0" \ ' +
						'scrolling="auto" id="ltlb_iframe" \ ' +
						'marginheight="0" marginwidth="0" \ ' +
						'xonload="try{this.contentWindow.focus();}catch(e){}" \ ' +
						'class="LT_LBIF">You need an iframes-capable browser to view this content.</iframe>');

					/*
					if (this.params.height) {
						this.iframe.attr('height', this.params.height+'px');
					}
					if (this.params.width) {
						this.iframe.attr('width', this.params.width+'px');
					}
					*/

					this.div_content.append(this.iframe);

					this.ready();
					if (this.params.scriptwhendone) {
						eval(this.params.scriptwhendone);
					}

					this.iframe.on('load.LTLB', function () {
						that.setLoading(false);
						that.iframe.off('load.LTLB');
						that.iframe[0].contentWindow.focus();
					});

				}
				else if (params.method === 'inline') {
					var content_el = $('#' + params.content_id);
					this.setContent(content_el.html());
					this.ready();
					if (this.params.scriptwhendone) {
						eval(this.params.scriptwhendone);
					}
					this.div_content.scrollTop(0);
					this.setLoading(false);
				}
				else {
					this.basic_ajax(contentURL, ajaxparams, lightboxResponse);
				}

			}
		},

		ajax: function (contentURL, params) {
			return this.open(contentURL, params);
		},


		removeIFrame: function () {
			// remove any existing iframe
			if (typeof this.iframe != 'undefined') {
				var _iframe_node;

				// if the iframe is found get the underlying DOM node from jQuery
				if (this.iframe.length > 0) {
					_iframe_node = this.iframe.get(0);
				}
				_iframe_node.src = '';
				if (_iframe_node.documentWindow) {
					_iframe_node.documentWindow.document = null;
					_iframe_node.documentWindow = null;
				}
				delete _iframe_node;

				this.iframe.remove();
			}
		},

		setLoading: function (yesNo) {
			if (yesNo) {
				this.div_content.html('');
				this.div_wrapper.show();
				this.div_loading.show();
			}
			else {
				this.div_loading.fadeOut({
					duration: 300,
					queue: false
				});
			}
		},

		setContent: function (contentHTML) {
			this.div_content.html(contentHTML);
			this.setPosition(true);
		},

		unload: function () {
			try {
				if (this.body.css) {
					if (!this.original_body_overflow_x && !this.original_body_overflow_y) {
						this.body.css({'overflow': this.original_body_overflow});
					} else {
						if (this.original_body_overflow_x) {
							this.body.css({'overflow-x': this.original_body_overflow_x});
						}
						if (this.original_body_overflow_y) {
							this.body.css({'overflow-y': this.original_body_overflow_y});
						}
					}
				}

				this.div_content.innerHTML = '';
				this.div_content.removeClass('iframe');
				this.active = false;
				this.clearLightboxEvents();
			} catch(err) {
				console.error(err);
			}
		},

		setParams: function (inparams) {
			if (inparams) {
				this.params = this.params || {};
				for (pp in inparams) {
					this.params[pp] = inparams[pp];
					if (pp == 'content_class') {
						this.div_content.className = inparams[pp];
					}
					else {
						this.div_content.className = 'LT_LB_content';
					}

					if (pp == 'rounded') {
						this.div_lightbox.className = 'LT_LB_rounded';
					}
				}
			}
		},

		getWindowSizes: function()
		{
			var quirks_h = $(window).get(0).innerHeight;
			var quirks_w = $(window).get(0).innerWidth;
			var win_h = $(window).height();
			var win_w = $(window).width();
			win_h = (quirks_h < win_h) ? quirks_h : win_h;
			win_w = (quirks_w < win_w) ? quirks_w : win_w;
			return {'height': win_h, 'width': win_w};
		},

		/*
		 sets the position and (optionally) the size of the lightbox on screen
		 it is called at display time and on window resizes
		 */
		//TODO: need to deal with a vertical offset to handle navigation bars at top of screen, etc.
		setPosition: function (changeSize, ignoreConfiguredParamHeight) {
			if (0)//(this.params.height || this.params.width || this.params.offset_y)
			{
				var _win_size = this.getWindowSizes();
				var win_h = _win_size.height;
				var win_w = _win_size.width;

				// remove the y offset param from the available height space
				this.offset_y = this.params.offset_y || LibraryThing.ltlb2016_offset_y || 0;
				win_h = win_h - this.offset_y;

				var center_y = win_h * 0.5;
				var center_x = win_w * 0.5;

				/*
				 We can use this to make sure that a value isn't larger than a specific constraint.
				 Like the lightbox isn't wider than the screen, for instance.
				 Buffer is the amount of space that we want to reserve on the outside.
				 */
				var fence = function (val, constraint, buffer) {
					buffer = buffer || 34;
					var cmb = constraint - buffer;
					if (val > cmb) {
						return cmb;
					}
					return val;
				};


				if (changeSize) {
					var _hh = 0;
					if (this.params) {
						if (this.params.width) {
							this.div_lightbox.width(fence(this.params.width, win_w));
						}
						else {
							this.div_lightbox.width(fence(this.default_width, win_w));
						}
						if (this.params.height && !ignoreConfiguredParamHeight) {
							_hh = fence(this.params.height, win_h);
							this.div_lightbox.height(_hh);
						}
						else {
							/* if there is no height sent in then
							 get content size and match it.
							 */
							var _content_h = this.div_content.outerHeight();
							if (_content_h < 30) {
								// default to a decent height if it returns something tiny
								_hh = fence(this.default_height, win_h);
								this.div_lightbox.height(_hh);
							}
							else {
								_hh = fence(_content_h, win_h);
								this.div_lightbox.height(_hh);
							}
						}
					}
					this.current_width = this.div_lightbox.outerWidth();
					this.current_height = _hh; //this.div_lightbox.outerHeight();

					if (this.iframe) {
						this.iframe.height(this.current_height - 5);
					}
				}


				var _tt = Math.round(center_y - (this.current_height * 0.5));
				if (_tt < this.offset_y) {
					_tt = this.offset_y;
				}

				var _top = Math.round(_tt);
				var _left = Math.round(center_x - (this.current_width * 0.5));
				this.div_lightbox.css({
					left: _left,
					top: _top
				});

				return { 'top': _top, 'left': this._left, 'height': this.current_height, 'width': this.current_width  };
			}
		},

		off: function (success) {
			this.unload();
			this.div_wrapper.hide();
			// remove any existing iframe
			this.removeIFrame();

			if (success) {
				if (this.params && this.params.callbackSuccess) {
					this.cbRun(this.params.callbackSuccess, this.params.callbackParams);
					this.params.callbackSuccess = null;
				}
			}
			else {
				if (this.params && this.params.callbackFailure) {
					this.cbRun(this.params.callbackFailure, this.params.callbackParams);
					this.params.callbackFailure = null;
				}
			}
		},

		cbRun: function (f, p) {
			if (typeof f === 'function') {
				f(p);
			}
			else if (typeof f !== 'undefined') {
				var fstring = f + '(';
				if (p) {
					fstring += 'p';
				}
				fstring += ')';
				if (fstring && (fstring !== null) && (fstring !== 'undefined')) {
					eval(fstring);
				}
			}
		},

		scrollTop: function (to) {
			to = to || 0;
			this.div_content.scrollTop(to);
		},

		ready: function () {
			if (this.params && this.params.callbackReady) {
				this.cbRun(this.params.callbackReady);
			}
		},


		stopEvent: function (e) {
			try {
				if (e.stopPropagation) {
					e.stopPropagation();
				}
				else if (e.preventDefault) {
					e.preventDefault();
				}
				else {
					e.stop();
				}
			} catch (err) {
			}
		},


		parseQuery: function (query) {
			var Params = {};
			if (!query) {
				return Params;
			}// return empty object
			var Pairs = query.split(/[;&]/);
			for (var i = 0; i < Pairs.length; i++) {
				var KeyVal = Pairs[i].split('=');
				if (!KeyVal || KeyVal.length != 2) {
					continue;
				}
				var key = unescape(KeyVal[0]);
				var val = unescape(KeyVal[1]);
				val = val.replace(/\+/g, ' ');
				Params[key] = val;
			}
			return Params;
		},


		initLightboxEvents: function () {
			var that = this;
			var modal = false;

			if (this.params) {
				if (this.params.modal == true) {
					modal = true;
				}
			}

			if (!modal) {
				$(document).on('keyup.ltlb2016', function (event) {
					if (event.keyCode == 27) {//ESC pressed
						that.off();
					}
				});

				/*
				$(document).on('keyup.ltlb2016', function (event) {
					if (event.keyCode == 27) {//ESC pressed
						that.off();
					}
				});
				*/

			}


			$(window).on('resize.ltlb2016', function (event) {
				that.setPosition(true);
			});
		},

		clearLightboxEvents: function () {
			$(document).off('.ltlb2016');
			$(window).off('.ltlb2016');
		},

		// not working quite correctly yet. It's not removing the event.
		modalCheck: function () {
			var that = this;
			var modal = false;

			if (this.params) {
				if (this.params.modal == true) {
					modal = true;
				}
			}

			if (modal) {
				this.div_overlay.off('click.ltlb2016');
				this.div_overlay.off('keyup.ltlb2016');
				this.div_overlay.css({'cursor': 'default'});
			}
			else {
				this.div_overlay.on('click.ltlb2016', function (event) {
					that.stopEvent(event);
					that.off();
				});
				this.div_overlay.css({'cursor': 'hand'});
			}
		}

	};
})(LibraryThingConnector.utils.jQuery);

/* this overrides any calls to the old lightbox with this new object */
LibraryThing.lightbox = LibraryThing.lightbox2016;
			if( typeof LibraryThingConnector.translationstringsA === "undefined" )
				{
				LibraryThingConnector.translationstringsA = {};
				}
			
			if( typeof LibraryThingConnector.backend_translationstringsA === "undefined" )
				{
				LibraryThingConnector.backend_translationstringsA = {};
				}
			LibraryThingConnector.translationstringsA = {"readmore":" (read more)","less":" (read less)","morebythisauthor":"More By This Author","seefulltableofcontents":"See Full Table of Contents","cover":"Cover","checkavailability":"Check Availability","explore":"Explore","morefromsyndeticsunbound":"More From Syndetics Unbound","eresource":"Electronic Resource","related_reading":"Related reading","eresources_message_text":"We have ebooks, digital audiobooks, and other electronic resources available. Look for the (e) below.","title_summary":"Summary","title_lookinside":"Look Inside","title_series":"Series","title_ltseries":"Series","title_similar":"You May Also Like","title_lists":"Librarian Recommends","title_author":"About The Author","title_reviews":"Professional Reviews","title_patronreviews":"Reader Reviews","title_other":"Also Available As","title_tags":"Tags","title_awards":"Awards","title_readinglevel":"Reading Level","title_bookprofile":"Book Profile","title_audiovideo":"Video And Music","title_game":"Video Games","title_rcl":"Core Titles","title_db":"Suggested Databases","title_altmetrics":"Altmetrics","title_shelfbrowse":"Browse Shelf","nav_title_lists":"Librarian Lists"};
LibraryThingConnector.translationchecksum = 469109683;
LibraryThingConnector.dochead = document.getElementsByTagName('head')[0];LibraryThingConnector.reviews = {
						extractIsbnsTime : 0,
						extractTitleTime : 0,
						extractAuthorTime : 0
					};LibraryThingConnector.reviews.init = function(){};
LibraryThingConnector.reviews.triggerCallback = function(){};
LibraryThingConnector.bookdisplay.widgetA = {"51b122b70d9ae5":{"lsbd_id":"710","lsbd_lsa_id":"1604","lsbd_widget_hash":"51b122b70d9ae5","lsbd_last_refreshed":"1678337195","lsbd_created":"2013-06-06 20:00:55","lsbd_updated":"2023-03-09 04:46:34","metadata":{"cacheKey_for_isbnA":"u_7fd5763e","cacheKey_for_isbnA_to_excludeA":"u_7fd5763e-excluded","height_computed":null},"id":"710","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Renaissance fiction"}}},"51b158f3db84b8":{"lsbd_id":"713","lsbd_lsa_id":"1604","lsbd_widget_hash":"51b158f3db84b8","lsbd_last_refreshed":"1678337220","lsbd_created":"2013-06-06 23:52:19","lsbd_updated":"2023-03-09 04:46:58","metadata":{"cacheKey_for_isbnA":"u_b7b5a3b7","cacheKey_for_isbnA_to_excludeA":"u_b7b5a3b7-excluded","height_computed":null},"id":"713","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Samurai Novels"}}},"5212a30135cd87":{"lsbd_id":"1172","lsbd_lsa_id":"1604","lsbd_widget_hash":"5212a30135cd87","lsbd_last_refreshed":"1678337236","lsbd_created":"2013-08-19 18:58:09","lsbd_updated":"2023-03-09 04:47:15","metadata":{"cacheKey_for_isbnA":"u_afa231dd","cacheKey_for_isbnA_to_excludeA":"u_afa231dd-excluded","height_computed":null},"id":"1172","configA":{"optionA":{"widget_status":"2","get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Zombies"}}},"530007f1e6d7f2":{"lsbd_id":"2463","lsbd_lsa_id":"1604","lsbd_widget_hash":"530007f1e6d7f2","lsbd_last_refreshed":"1678337259","lsbd_created":"2014-02-15 19:36:01","lsbd_updated":"2023-03-09 04:47:37","metadata":{"cacheKey_for_isbnA":"u_016e2576","cacheKey_for_isbnA_to_excludeA":"u_016e2576-excluded","height_computed":null},"id":"2463","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Industrial Revolution - Reading for Research"}}},"53009b2ceb6fb6":{"lsbd_id":"2465","lsbd_lsa_id":"1604","lsbd_widget_hash":"53009b2ceb6fb6","lsbd_last_refreshed":"1678337287","lsbd_created":"2014-02-16 06:04:12","lsbd_updated":"2023-03-09 04:48:05","metadata":{"cacheKey_for_isbnA":"u_f7a02069","cacheKey_for_isbnA_to_excludeA":"u_f7a02069-excluded","height_computed":null},"id":"2465","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Industrial Revolution - Reading for Recreation"}}},"53018d5c270965":{"lsbd_id":"2466","lsbd_lsa_id":"1604","lsbd_widget_hash":"53018d5c270965","lsbd_last_refreshed":"1678337323","lsbd_created":"2014-02-16 23:17:32","lsbd_updated":"2023-03-09 04:48:38","metadata":{"cacheKey_for_isbnA":"u_2b758a7a","cacheKey_for_isbnA_to_excludeA":"u_2b758a7a-excluded","height_computed":null},"id":"2466","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget RecReadingWorldWarII"}}},"5302d50638e3a5":{"lsbd_id":"2469","lsbd_lsa_id":"1604","lsbd_widget_hash":"5302d50638e3a5","lsbd_last_refreshed":"1678337348","lsbd_created":"2014-02-17 22:35:34","lsbd_updated":"2023-03-09 04:49:05","metadata":{"cacheKey_for_isbnA":"u_a21fb205","cacheKey_for_isbnA_to_excludeA":"u_a21fb205-excluded","height_computed":null},"id":"2469","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget "}}},"5304026495dc46":{"lsbd_id":"2477","lsbd_lsa_id":"1604","lsbd_widget_hash":"5304026495dc46","lsbd_last_refreshed":"1678337374","lsbd_created":"2014-02-18 20:01:24","lsbd_updated":"2023-03-09 04:49:31","metadata":{"cacheKey_for_isbnA":"u_05d09d41","cacheKey_for_isbnA_to_excludeA":"u_05d09d41-excluded","height_computed":null},"id":"2477","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget ResearchWWII"}}},"ult_1100813205":{"lsbd_id":"12801","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1100813205","lsbd_last_refreshed":"1678337415","lsbd_created":"2017-02-08 01:19:06","lsbd_updated":"2023-03-09 04:50:09","metadata":{"cacheKey_for_isbnA":"u_a4c8c262","cacheKey_for_isbnA_to_excludeA":"u_a4c8c262-excluded","height_computed":null},"id":"12801","configA":{"optionA":{"widget_status":"2","get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Individuals & Institutions"}}},"ult_1118088148":{"lsbd_id":"21270","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1118088148","lsbd_last_refreshed":"1678337436","lsbd_created":"2017-10-25 02:08:22","lsbd_updated":"2023-03-09 04:50:34","metadata":{"cacheKey_for_isbnA":"u_d6e473eb","cacheKey_for_isbnA_to_excludeA":"u_d6e473eb-excluded","height_computed":null},"id":"21270","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":150,"container_width":550,"title":"Book Display Widget India under the Raj"}}},"ult_1319619358":{"lsbd_id":"30876","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1319619358","lsbd_last_refreshed":"1678337456","lsbd_created":"2020-03-12 05:05:11","lsbd_updated":"2023-03-09 04:50:55","metadata":{"cacheKey_for_isbnA":"u_c5cc3dce","cacheKey_for_isbnA_to_excludeA":"u_c5cc3dce-excluded","height_computed":null},"id":"30876","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Year 12 Ancient History"}}},"ult_1358874060":{"lsbd_id":"26319","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1358874060","lsbd_last_refreshed":"1678337477","lsbd_created":"2018-11-04 22:41:27","lsbd_updated":"2023-03-09 04:51:15","metadata":{"cacheKey_for_isbnA":"u_751d04d5","cacheKey_for_isbnA_to_excludeA":"u_751d04d5-excluded","height_computed":null},"id":"26319","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":220,"container_width":"","title":"Book Display Widget Remembrance Day 2018"}}},"ult_1392746235":{"lsbd_id":"13898","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1392746235","lsbd_last_refreshed":"1678337491","lsbd_created":"2017-05-30 20:00:19","lsbd_updated":"2023-03-09 04:51:30","metadata":{"cacheKey_for_isbnA":"u_96127ed9","cacheKey_for_isbnA_to_excludeA":"u_96127ed9-excluded","height_computed":null},"id":"13898","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":300,"container_width":300,"title":"Book Display Widget Historical Fiction : Aztecs"}}},"ult_1491416140":{"lsbd_id":"13783","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1491416140","lsbd_last_refreshed":"1678337507","lsbd_created":"2017-05-17 02:58:15","lsbd_updated":"2023-03-09 04:51:46","metadata":{"cacheKey_for_isbnA":"u_3824e6f5","cacheKey_for_isbnA_to_excludeA":"u_3824e6f5-excluded","height_computed":null},"id":"13783","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":280,"container_width":250,"title":"Book Display Widget Australian Biography titles"}}},"ult_1695032479":{"lsbd_id":"26937","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1695032479","lsbd_last_refreshed":"1676845187","lsbd_created":"2019-01-10 19:13:29","lsbd_updated":"2023-02-19 22:19:41","metadata":{"cacheKey_for_isbnA":"u_c6d5f58a","cacheKey_for_isbnA_to_excludeA":"u_c6d5f58a-excluded","height_computed":null},"id":"26937","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":220,"container_width":"","title":"Book Display Widget Test YA"}}},"ult_1803216397":{"lsbd_id":"27066","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1803216397","lsbd_last_refreshed":"1678337532","lsbd_created":"2019-01-22 22:36:07","lsbd_updated":"2023-03-09 04:52:09","metadata":{"cacheKey_for_isbnA":"u_c82c9068","cacheKey_for_isbnA_to_excludeA":"u_c82c9068-excluded","height_computed":null},"id":"27066","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":220,"container_width":"","title":"Book Display Widget Year 9 2019 - Industrial Revolution"}}},"ult_1808703353":{"lsbd_id":"26924","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1808703353","lsbd_last_refreshed":"1678337547","lsbd_created":"2019-01-08 23:29:33","lsbd_updated":"2023-03-09 04:52:26","metadata":{"cacheKey_for_isbnA":"u_01f60dbc","cacheKey_for_isbnA_to_excludeA":"u_01f60dbc-excluded","height_computed":null},"id":"26924","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":220,"container_width":"","title":"Book Display Widget Year 11 English - The Great Gatsby"}}},"ult_1821806255":{"lsbd_id":"24992","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1821806255","lsbd_last_refreshed":"1678337568","lsbd_created":"2018-06-07 19:13:25","lsbd_updated":"2023-03-09 04:52:47","metadata":{"cacheKey_for_isbnA":"u_b58b6030","cacheKey_for_isbnA_to_excludeA":"u_b58b6030-excluded","height_computed":null},"id":"24992","configA":{"optionA":{"widget_status":"2","get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":350,"container_width":500,"title":"Book Display Widget New Middle School Books"}}},"ult_1835766873":{"lsbd_id":"3068","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1835766873","lsbd_last_refreshed":"1398998203","lsbd_created":"2014-05-01 22:36:43","lsbd_updated":"2014-07-29 07:43:15","metadata":{"cacheKey_for_isbnA":"u_26b7cd6c","cacheKey_for_isbnA_to_excludeA":"u_26b7cd6c-excluded","height_computed":null},"id":"3068","configA":{"optionA":{"widget_status":"0","get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Year 10 Science: Bioethics"}}},"ult_1885378929":{"lsbd_id":"27579","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1885378929","lsbd_last_refreshed":"1676825937","lsbd_created":"2019-04-23 00:52:30","lsbd_updated":"2023-02-19 16:58:53","metadata":{"cacheKey_for_isbnA":"u_a9246648","cacheKey_for_isbnA_to_excludeA":"u_a9246648-excluded","height_computed":null},"id":"27579","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget INF Popular"}}},"ult_1952596805":{"lsbd_id":"26147","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_1952596805","lsbd_last_refreshed":"1678337595","lsbd_created":"2018-10-15 19:30:14","lsbd_updated":"2023-03-09 04:53:11","metadata":{"cacheKey_for_isbnA":"u_f7647b59","cacheKey_for_isbnA_to_excludeA":"u_f7647b59-excluded","height_computed":null},"id":"26147","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":220,"container_width":"","title":"Book Display Widget Kids Books to Movies"}}},"ult_2031218531":{"lsbd_id":"13721","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2031218531","lsbd_last_refreshed":"1678337611","lsbd_created":"2017-05-10 23:38:44","lsbd_updated":"2023-03-09 04:53:30","metadata":{"cacheKey_for_isbnA":"u_30939ebf","cacheKey_for_isbnA_to_excludeA":"u_30939ebf-excluded","height_computed":null},"id":"13721","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":400,"container_width":400,"title":"Book Display Widget Test Carousel Widget 2"}}},"ult_2041048811":{"lsbd_id":"25111","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2041048811","lsbd_last_refreshed":"1678337637","lsbd_created":"2018-06-19 22:56:18","lsbd_updated":"2023-03-09 04:53:52","metadata":{"cacheKey_for_isbnA":"u_09b90fc7","cacheKey_for_isbnA_to_excludeA":"u_09b90fc7-excluded","height_computed":null},"id":"25111","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":220,"container_width":"","title":"Book Display Widget Personal Development May 2019"}}},"ult_2087107461":{"lsbd_id":"3687","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2087107461","lsbd_last_refreshed":"1678337657","lsbd_created":"2014-08-19 18:51:54","lsbd_updated":"2023-03-09 04:54:14","metadata":{"cacheKey_for_isbnA":"u_c6d54d09","cacheKey_for_isbnA_to_excludeA":"u_c6d54d09-excluded","height_computed":null},"id":"3687","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":300,"container_width":300,"title":"Book Display Widget August 14 New Books"}}},"ult_2112778434":{"lsbd_id":"21160","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2112778434","lsbd_last_refreshed":"1678337675","lsbd_created":"2017-10-19 02:10:17","lsbd_updated":"2023-03-09 04:54:33","metadata":{"cacheKey_for_isbnA":"u_6bb67879","cacheKey_for_isbnA_to_excludeA":"u_6bb67879-excluded","height_computed":null},"id":"21160","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":250,"container_width":400,"title":"Book Display Widget Nazi Germany Broad Banner"}}},"ult_2125144108":{"lsbd_id":"21268","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2125144108","lsbd_last_refreshed":"1678337697","lsbd_created":"2017-10-25 00:49:16","lsbd_updated":"2023-03-09 04:54:55","metadata":{"cacheKey_for_isbnA":"u_63d65ccc","cacheKey_for_isbnA_to_excludeA":"u_63d65ccc-excluded","height_computed":null},"id":"21268","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":150,"container_width":1250,"title":"Book Display Widget Roman Empire (Yr 8)"}}},"ult_2200330315":{"lsbd_id":"3037","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2200330315","lsbd_last_refreshed":"1678337719","lsbd_created":"2014-04-28 00:31:59","lsbd_updated":"2023-03-09 04:55:18","metadata":{"cacheKey_for_isbnA":"u_ce2e5113","cacheKey_for_isbnA_to_excludeA":"u_ce2e5113-excluded","height_computed":null},"id":"3037","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Latin: Myths and Legends"}}},"ult_2407379746":{"lsbd_id":"14524","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2407379746","lsbd_last_refreshed":"1678337746","lsbd_created":"2017-08-28 22:49:37","lsbd_updated":"2023-03-09 04:55:45","metadata":{"cacheKey_for_isbnA":"u_3727fab4","cacheKey_for_isbnA_to_excludeA":"u_3727fab4-excluded","height_computed":null},"id":"14524","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":250,"container_width":500,"title":"Book Display Widget Egypt, Ancient - Pharaohs"}}},"ult_2431341029":{"lsbd_id":"25457","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2431341029","lsbd_last_refreshed":"1678337780","lsbd_created":"2018-08-07 00:09:01","lsbd_updated":"2023-03-09 04:56:15","metadata":{"cacheKey_for_isbnA":"u_a1a92267","cacheKey_for_isbnA_to_excludeA":"u_a1a92267-excluded","height_computed":null},"id":"25457","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":220,"container_width":"","title":"Book Display Widget 2018 Better Reading Top 50 Kids\u2019 Books"}}},"ult_2486400265":{"lsbd_id":"21293","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2486400265","lsbd_last_refreshed":"1678337797","lsbd_created":"2017-10-26 02:33:40","lsbd_updated":"2023-03-09 04:56:36","metadata":{"cacheKey_for_isbnA":"u_1038932c","cacheKey_for_isbnA_to_excludeA":"u_1038932c-excluded","height_computed":null},"id":"21293","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Medieval Europe Books from the Senior Library"}}},"ult_2522704219":{"lsbd_id":"21161","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2522704219","lsbd_last_refreshed":"1678337818","lsbd_created":"2017-10-19 02:37:04","lsbd_updated":"2023-03-09 04:56:55","metadata":{"cacheKey_for_isbnA":"u_1b6592e2","cacheKey_for_isbnA_to_excludeA":"u_1b6592e2-excluded","height_computed":null},"id":"21161","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":150,"container_width":1250,"title":"Book Display Widget Australia in World War 2 Broad Banner"}}},"ult_2524940253":{"lsbd_id":"21269","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2524940253","lsbd_last_refreshed":"1678337838","lsbd_created":"2017-10-25 01:07:58","lsbd_updated":"2023-03-09 04:57:16","metadata":{"cacheKey_for_isbnA":"u_31fc53bf","cacheKey_for_isbnA_to_excludeA":"u_31fc53bf-excluded","height_computed":null},"id":"21269","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":150,"container_width":550,"title":"Book Display Widget Famous Australians (Yr 8 History)"}}},"ult_258160416":{"lsbd_id":"13897","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_258160416","lsbd_last_refreshed":"1678337865","lsbd_created":"2017-05-30 19:30:17","lsbd_updated":"2023-03-09 04:57:44","metadata":{"cacheKey_for_isbnA":"u_cf223443","cacheKey_for_isbnA_to_excludeA":"u_cf223443-excluded","height_computed":null},"id":"13897","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":300,"container_width":300,"title":"Book Display Widget Rome - Historic Fiction"}}},"ult_2586699108":{"lsbd_id":"25063","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2586699108","lsbd_last_refreshed":"1678337907","lsbd_created":"2018-06-17 23:54:05","lsbd_updated":"2023-03-09 04:58:22","metadata":{"cacheKey_for_isbnA":"u_87632b0e","cacheKey_for_isbnA_to_excludeA":"u_87632b0e-excluded","height_computed":null},"id":"25063","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":250,"container_width":600,"title":"Book Display Widget 150BGS Reading Challenge"}}},"ult_2650913463":{"lsbd_id":"21172","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2650913463","lsbd_last_refreshed":"1678337926","lsbd_created":"2017-10-19 20:12:20","lsbd_updated":"2023-03-09 04:58:44","metadata":{"cacheKey_for_isbnA":"u_a121dc42","cacheKey_for_isbnA_to_excludeA":"u_a121dc42-excluded","height_computed":null},"id":"21172","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":150,"container_width":1250,"title":"Book Display Widget China Modern China Emergence Broad Banner"}}},"ult_267868205":{"lsbd_id":"3065","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_267868205","lsbd_last_refreshed":"1678337943","lsbd_created":"2014-05-01 20:23:51","lsbd_updated":"2023-03-09 04:59:01","metadata":{"cacheKey_for_isbnA":"u_4c20ccc4","cacheKey_for_isbnA_to_excludeA":"u_4c20ccc4-excluded","height_computed":null},"id":"3065","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Year 10 Science: Bioethics"}}},"ult_2756928933":{"lsbd_id":"12800","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2756928933","lsbd_last_refreshed":"1678337984","lsbd_created":"2017-02-08 01:01:33","lsbd_updated":"2023-03-09 04:59:36","metadata":{"cacheKey_for_isbnA":"u_ba113285","cacheKey_for_isbnA_to_excludeA":"u_ba113285-excluded","height_computed":null},"id":"12800","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Individuals & Institutions"}}},"ult_2846968015":{"lsbd_id":"13801","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_2846968015","lsbd_last_refreshed":"1678338009","lsbd_created":"2017-05-18 01:43:00","lsbd_updated":"2023-03-09 05:00:06","metadata":{"cacheKey_for_isbnA":"u_6aee9299","cacheKey_for_isbnA_to_excludeA":"u_6aee9299-excluded","height_computed":null},"id":"13801","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":350,"container_width":350,"title":"Book Display Widget New PD Titles 17th May 2017"}}},"ult_3009135303":{"lsbd_id":"27089","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_3009135303","lsbd_last_refreshed":"1678338026","lsbd_created":"2019-01-24 23:06:09","lsbd_updated":"2023-03-09 05:00:25","metadata":{"cacheKey_for_isbnA":"u_b00f4873","cacheKey_for_isbnA_to_excludeA":"u_b00f4873-excluded","height_computed":null},"id":"27089","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":220,"container_width":"","title":"Book Display Widget Year 12 - Mass Extinctions"}}},"ult_3017188916":{"lsbd_id":"25017","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_3017188916","lsbd_last_refreshed":"1678338059","lsbd_created":"2018-06-13 19:40:20","lsbd_updated":"2023-03-09 05:00:56","metadata":{"cacheKey_for_isbnA":"u_45fe64f3","cacheKey_for_isbnA_to_excludeA":"u_45fe64f3-excluded","height_computed":null},"id":"25017","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":250,"container_width":"","title":"Book Display Widget Year 7 Fantasy"}}},"ult_3330708052":{"lsbd_id":"26936","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_3330708052","lsbd_last_refreshed":"1678338089","lsbd_created":"2019-01-10 18:46:36","lsbd_updated":"2023-03-09 05:01:26","metadata":{"cacheKey_for_isbnA":"u_145a28f9","cacheKey_for_isbnA_to_excludeA":"u_145a28f9-excluded","height_computed":null},"id":"26936","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":220,"container_width":"","title":"Book Display Widget Russian Revolution 2019"}}},"ult_3535326068":{"lsbd_id":"13238","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_3535326068","lsbd_last_refreshed":"1678338304","lsbd_created":"2017-03-15 21:39:42","lsbd_updated":"2023-03-09 05:04:04","metadata":{"cacheKey_for_isbnA":"u_5cda34e8","cacheKey_for_isbnA_to_excludeA":"u_5cda34e8-excluded","height_computed":null},"id":"13238","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Year 8 Science Fiction"}}},"ult_3592631047":{"lsbd_id":"27154","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_3592631047","lsbd_last_refreshed":"1678338320","lsbd_created":"2019-02-07 22:33:40","lsbd_updated":"2023-03-09 05:05:19","metadata":{"cacheKey_for_isbnA":"u_9e27ce6e","cacheKey_for_isbnA_to_excludeA":"u_9e27ce6e-excluded","height_computed":null},"id":"27154","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":220,"container_width":"","title":"Book Display Widget Year 11 Physics"}}},"ult_3638583403":{"lsbd_id":"21162","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_3638583403","lsbd_last_refreshed":"1678338351","lsbd_created":"2017-10-19 02:50:46","lsbd_updated":"2023-03-09 05:05:47","metadata":{"cacheKey_for_isbnA":"u_56ff8ed7","cacheKey_for_isbnA_to_excludeA":"u_56ff8ed7-excluded","height_computed":null},"id":"21162","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":250,"container_width":1000,"title":"Book Display Widget Australian Immigration Broad Banner"}}},"ult_3666972504":{"lsbd_id":"14521","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_3666972504","lsbd_last_refreshed":"1678338375","lsbd_created":"2017-08-27 21:10:29","lsbd_updated":"2023-03-09 05:06:14","metadata":{"cacheKey_for_isbnA":"u_b48475c9","cacheKey_for_isbnA_to_excludeA":"u_b48475c9-excluded","height_computed":null},"id":"14521","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":250,"container_width":1200,"title":"Book Display Widget Individual versus Institution v3"}}},"ult_4024153160":{"lsbd_id":"30800","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_4024153160","lsbd_last_refreshed":"1678338391","lsbd_created":"2020-03-09 04:36:56","lsbd_updated":"2023-03-09 05:06:31","metadata":{"cacheKey_for_isbnA":"u_cd9aba4e","cacheKey_for_isbnA_to_excludeA":"u_cd9aba4e-excluded","height_computed":null},"id":"30800","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget TEST"}}},"ult_4144510478":{"lsbd_id":"21158","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_4144510478","lsbd_last_refreshed":"1678338410","lsbd_created":"2017-10-18 21:32:41","lsbd_updated":"2023-03-09 05:06:49","metadata":{"cacheKey_for_isbnA":"u_26684b3b","cacheKey_for_isbnA_to_excludeA":"u_26684b3b-excluded","height_computed":null},"id":"21158","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":150,"container_width":500,"title":"Book Display Widget Ancient China Han"}}},"ult_4146085152":{"lsbd_id":"21159","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_4146085152","lsbd_last_refreshed":"1678338431","lsbd_created":"2017-10-19 00:32:59","lsbd_updated":"2023-03-09 05:07:09","metadata":{"cacheKey_for_isbnA":"u_1151edae","cacheKey_for_isbnA_to_excludeA":"u_1151edae-excluded","height_computed":null},"id":"21159","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":250,"container_width":1250,"title":"Book Display Widget Ancient China Books Banner version "}}},"ult_4218022437":{"lsbd_id":"24993","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_4218022437","lsbd_last_refreshed":"1678338557","lsbd_created":"2018-06-07 21:29:04","lsbd_updated":"2023-03-09 05:08:49","metadata":{"cacheKey_for_isbnA":"u_580c89c2","cacheKey_for_isbnA_to_excludeA":"u_580c89c2-excluded","height_computed":null},"id":"24993","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget 2018 FIFA World Cup"}}},"ult_5202931":{"lsbd_id":"13770","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_5202931","lsbd_last_refreshed":"1678338577","lsbd_created":"2017-05-15 22:55:37","lsbd_updated":"2023-03-09 05:09:35","metadata":{"cacheKey_for_isbnA":"u_4f2a4cec","cacheKey_for_isbnA_to_excludeA":"u_4f2a4cec-excluded","height_computed":null},"id":"13770","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":250,"container_width":250,"title":"Book Display Widget Rome History Fiction"}}},"ult_609479385":{"lsbd_id":"26923","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_609479385","lsbd_last_refreshed":"1678338597","lsbd_created":"2019-01-08 21:32:16","lsbd_updated":"2023-03-09 05:09:56","metadata":{"cacheKey_for_isbnA":"u_2f41a9ca","cacheKey_for_isbnA_to_excludeA":"u_2f41a9ca-excluded","height_computed":null},"id":"26923","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":220,"container_width":"","title":"Book Display Widget Year 11 English - Perspective"}}},"ult_776828387":{"lsbd_id":"13899","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_776828387","lsbd_last_refreshed":"1678338619","lsbd_created":"2017-05-30 20:13:27","lsbd_updated":"2023-03-09 05:10:17","metadata":{"cacheKey_for_isbnA":"u_8195deea","cacheKey_for_isbnA_to_excludeA":"u_8195deea-excluded","height_computed":null},"id":"13899","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":600,"title":"Book Display Widget Historical Fiction - Ancient Egypt"}}},"ult_938094810":{"lsbd_id":"13782","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_938094810","lsbd_last_refreshed":"1678338636","lsbd_created":"2017-05-17 02:27:02","lsbd_updated":"2023-03-09 05:10:34","metadata":{"cacheKey_for_isbnA":"u_6fb59551","cacheKey_for_isbnA_to_excludeA":"u_6fb59551-excluded","height_computed":null},"id":"13782","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":275,"container_width":250,"title":"Book Display Widget Early Brisbane 2019"}}},"ult_991738357":{"lsbd_id":"26377","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_991738357","lsbd_last_refreshed":"1676825960","lsbd_created":"2018-11-08 18:55:02","lsbd_updated":"2023-02-19 16:59:16","metadata":{"cacheKey_for_isbnA":"u_850f15a0","cacheKey_for_isbnA_to_excludeA":"u_850f15a0-excluded","height_computed":null},"id":"26377","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":600,"container_width":50,"title":"Book Display Widget Most Popular"}}},"ult_997867742":{"lsbd_id":"10146","lsbd_lsa_id":"1604","lsbd_widget_hash":"ult_997867742","lsbd_last_refreshed":"1678338655","lsbd_created":"2016-03-03 19:02:26","lsbd_updated":"2023-03-09 05:10:54","metadata":{"cacheKey_for_isbnA":"u_83042227","cacheKey_for_isbnA_to_excludeA":"u_83042227-excluded","height_computed":null},"id":"10146","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Renaissance Fiction"}}},"u_040034a6":{"lsbd_id":"42924","lsbd_lsa_id":"1604","lsbd_widget_hash":"u_040034a6","lsbd_last_refreshed":"1678338716","lsbd_created":"2023-02-07 06:27:43","lsbd_updated":"2023-03-09 05:11:45","metadata":{"cacheKey_for_isbnA":"u_9796bcc5","cacheKey_for_isbnA_to_excludeA":"u_9796bcc5-excluded","height_computed":null},"id":"42924","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":250,"container_width":"","title":"Book Display Widget Banned Classics"}}},"u_11c5d8e3":{"lsbd_id":"42922","lsbd_lsa_id":"1604","lsbd_widget_hash":"u_11c5d8e3","lsbd_last_refreshed":"1678338784","lsbd_created":"2023-02-07 04:34:08","lsbd_updated":"2023-03-09 05:12:48","metadata":{"cacheKey_for_isbnA":"u_05551c85","cacheKey_for_isbnA_to_excludeA":"u_05551c85-excluded","height_computed":null},"id":"42922","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Year 11_Modern History_Digging up the Past"}}},"u_201bf93b":{"lsbd_id":"43101","lsbd_lsa_id":"1604","lsbd_widget_hash":"u_201bf93b","lsbd_last_refreshed":"1678338821","lsbd_created":"2023-03-02 03:47:32","lsbd_updated":"2023-03-09 05:13:36","metadata":{"cacheKey_for_isbnA":"u_e16a994a","cacheKey_for_isbnA_to_excludeA":"u_e16a994a-excluded","height_computed":null},"id":"43101","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Year 12 Modern History - Nazi Germany"}}},"u_70c5cfed":{"lsbd_id":"42921","lsbd_lsa_id":"1604","lsbd_widget_hash":"u_70c5cfed","lsbd_last_refreshed":"1678338950","lsbd_created":"2023-02-07 03:40:13","lsbd_updated":"2023-03-09 05:15:13","metadata":{"cacheKey_for_isbnA":"u_e739b20e","cacheKey_for_isbnA_to_excludeA":"u_e739b20e-excluded","height_computed":null},"id":"42921","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget 12 MH Cold War"}}},"u_7e2acf12":{"lsbd_id":"42939","lsbd_lsa_id":"1604","lsbd_widget_hash":"u_7e2acf12","lsbd_last_refreshed":"1678338987","lsbd_created":"2023-02-13 01:04:48","lsbd_updated":"2023-03-09 05:16:20","metadata":{"cacheKey_for_isbnA":"u_011164b1","cacheKey_for_isbnA_to_excludeA":"u_011164b1-excluded","height_computed":null},"id":"42939","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Year 9 - Industrial Revolution"}}},"u_d70b9079":{"lsbd_id":"43160","lsbd_lsa_id":"1604","lsbd_widget_hash":"u_d70b9079","lsbd_last_refreshed":"1678339020","lsbd_created":"2023-03-07 04:52:15","lsbd_updated":"2023-03-09 05:16:57","metadata":{"cacheKey_for_isbnA":"u_8e22bc25","cacheKey_for_isbnA_to_excludeA":"u_8e22bc25-excluded","height_computed":null},"id":"43160","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Alexander the Great Carousel"}}},"u_d902b353":{"lsbd_id":"42931","lsbd_lsa_id":"1604","lsbd_widget_hash":"u_d902b353","lsbd_last_refreshed":"1678339046","lsbd_created":"2023-02-08 23:50:11","lsbd_updated":"2023-03-09 05:17:23","metadata":{"cacheKey_for_isbnA":"u_5e190a6d","cacheKey_for_isbnA_to_excludeA":"u_5e190a6d-excluded","height_computed":null},"id":"42931","configA":{"optionA":{"widget_status":2,"get_this_widget":null,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget Year 11 French Revolution"}}},"u_dd09a91f":{"lsbd_id":"42923","lsbd_lsa_id":"1604","lsbd_widget_hash":"u_dd09a91f","lsbd_last_refreshed":"1678196784","lsbd_created":"2023-02-07 06:10:38","lsbd_updated":"2023-03-07 13:46:04","metadata":{"cacheKey_for_isbnA":"u_83a4d04b","cacheKey_for_isbnA_to_excludeA":"u_83a4d04b-excluded","height_computed":null},"id":"42923","configA":{"optionA":{"widget_status":2,"get_this_widget":false,"get_this_widget_domain":"https:\/\/www.librarything.com\/syndeticsunbound\/","container_height":"","container_width":"","title":"Book Display Widget February: Must-Read Books by Black Authors"}}}};LibraryThingConnector.bookdisplay.multi_widgetA = {"u_0eb95e47":{"lsbdm_id":"1522","lsbdm_lsa_id":"1604","lsbdm_hash":"u_0eb95e47","lsbdm_config":{"widget_idA":["713","2463","42921"],"title":"TEST john","custom_css":"","theme":"tabbed","width":"","height":"","widget_titleAA":{"713":"Samurai Novels","2463":"Industrial Revolution - Reading for Research","42921":"12 MH Cold War"},"widget_status":"0"}}};LibraryThingConnector.bookdisplay.sizesAA = {"xsmall":70,"small":110,"medium":180,"large":220,"xlarge":300};/* connector loaded *//* connector loaded */LibraryThingConnector.backend = LibraryThingConnector.backends.infiniti;
LibraryThingConnector.queries = LibraryThingConnector.utils.parse_queries();LibraryThingConnector.version ="latest";LibraryThingConnector.i_id = 2469;LibraryThingConnector.browserClassesAA = {"chrome":1,"webkit":1,"windows":1};LibraryThingConnector.browser.classesAA = {"chrome":1,"webkit":1,"windows":1};LibraryThingConnector.context = "main";LibraryThingConnector.dochead = document.getElementsByTagName('head')[0];LibraryThingConnector.utils.loadStylesheet('https://ltfl.librarything.com/syndeticsunbound/css/lt_lightbox2016.css?_gv=4969');LibraryThingConnector.utils.loadStylesheet('https://ltfl.librarything.com/syndeticsunbound/css/unbound.css?_gv=4969');LibraryThingConnector.utils.loadStylesheet('https://www.librarything.com/css/lt2_vars.css?_gv=4969');LibraryThingConnector.ratingImgAA = ["<span class=\"unbound_rating\"><\/span>","<span class=\"unbound_rating\"><img alt=\"half star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-half-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-half-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><\/span>","<span class=\"unbound_rating\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><\/span>","<span class=\"unbound_rating\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"half star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-half-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-half-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><\/span>","<span class=\"unbound_rating\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><\/span>","<span class=\"unbound_rating\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"half star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-half-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-half-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><\/span>","<span class=\"unbound_rating\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><\/span>","<span class=\"unbound_rating\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"half star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-half-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-half-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><\/span>","<span class=\"unbound_rating\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"empty star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-off-48.png 2x\"><\/span>","<span class=\"unbound_rating\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"half star\" class=\"unbound_rating_img unbound_rating_half\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-half-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-half-48.png 2x\"><\/span>","<span class=\"unbound_rating\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><img alt=\"star\" class=\"unbound_rating_img unbound_rating_on\" src=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-24.png\" srcset=\"https:\/\/ltfl.librarything.com\/syndeticsunbound\/images\/star-blue-on-48.png 2x\"><\/span>"];LibraryThingConnector.languagestrings_to_codesAA = {"":"dps","ab":"abk","af":"afr","sq":"alb","am":"amh","ar":"ara","hy":"arm","az":"aze","eu":"baq","be":"bel","bn":"ben","bs":"bos","br":"bre","bg":"bul","my":"bur","ca":"cat","zh":"chi2","co":"cos","cs":"cze","da":"dan","nl":"dut","en":"eng","eo":"epo","et":"est","fi":"fin","fr":"fre","fy":"fry","ka":"geo","de":"ger","gd":"gla","ga":"gle","gl":"glg","el":"gre","gu":"guj","ht":"hat","ha":"hau","he":"heb","hi":"hin","hu":"hun","is":"ice","id":"ind","it":"ita","jv":"jav","ja":"jpn","kn":"kan","kr":"kau","ko":"kor","ku":"kur","la":"lat","lv":"lav","lt":"lit","mk":"mac","ml":"mal","mi":"mao","mr":"mar","ms":"may","mt":"mlt","nr":"nbl","nn":"nno","nb":"nob","no":"nor","oc":"oci","fa":"per","pl":"pol","rm":"roh","ro":"rum","ru":"rus","sa":"san","sr":"scc","hr":"scr","sk":"slo","sl":"slv","se":"sme","sn":"sna","so":"som","st":"sot","es":"spa","sc":"srd","sw":"swa","sv":"swe","ta":"tam","te":"tel","tl":"tgl","th":"tha","tn":"tsn","tr":"tur","uk":"ukr","ur":"urd","ve":"ven","vi":"vie","cy":"wel","xh":"xho","yi":"yid","zu":"zul","pt":"por1","Espa\u00f1ol":"spa","English":"eng","spi":"spa","cat":"cat","iw":"heb"};LibraryThingConnector.catalog_language_code="";LibraryThingConnector.su_catalog_url="";/* onoff not set: stackmap *//* onoff not set: audiovideo *//* onoff not set: game *//* onoff not set: lookinside *//* onoff not set: patronreviews *//* onoff not set: altmetrics *//* onoff not set: rcl *//* onoff not set: ulrichs *//* onoff not set: bx */LibraryThingConnector.megaDivHTML = '<div style="display:none;" breakpoints="420 480 560 693 700 768 960 1200" class="unbound_mega unbound_mega_aid_1982 chrome webkit windows lt1 infiniti" id="unbound_mega_u_621787b6"><a name="unbound_mega"></a><div class="unbound_mega_header">More From Syndetics Unbound</div><div class="unbound_element unbound_nav"><a name="unbound_nav"></a><ul class="unbound_nav_list"><li class="unbound_nav_item unbound_nav_item_summary"><a href="#unbound_nav_summary">Summary </a><span class="unbound_badge .summary"></span></li><li class="unbound_nav_item unbound_nav_item_author"><a href="#unbound_nav_author">About The Author </a><span class="unbound_badge .author"></span></li><li class="unbound_nav_item unbound_nav_item_ltseries"><a href="#unbound_nav_ltseries">Series </a><span class="unbound_badge .ltseries"></span></li><li class="unbound_nav_item unbound_nav_item_similar"><a href="#unbound_nav_similar">You May Also Like </a><span class="unbound_badge .similar"></span></li><li class="unbound_nav_item unbound_nav_item_lists"><a href="#unbound_nav_lists">Librarian Lists </a><span class="unbound_badge .lists"></span></li><li class="unbound_nav_item unbound_nav_item_reviews"><a href="#unbound_nav_reviews">Professional Reviews </a><span class="unbound_badge .reviews"></span></li><li class="unbound_nav_item unbound_nav_item_other"><a href="#unbound_nav_other">Also Available As </a><span class="unbound_badge .other"></span></li><li class="unbound_nav_item unbound_nav_item_tags"><a href="#unbound_nav_tags">Tags </a><span class="unbound_badge .tags"></span></li><li class="unbound_nav_item unbound_nav_item_bookprofile"><a href="#unbound_nav_bookprofile">Book Profile </a><span class="unbound_badge .bookprofile"></span></li><li class="unbound_nav_item unbound_nav_item_readinglevel"><a href="#unbound_nav_readinglevel">Reading Level </a><span class="unbound_badge .readinglevel"></span></li><li class="unbound_nav_item unbound_nav_item_awards"><a href="#unbound_nav_awards">Awards </a><span class="unbound_badge .awards"></span></li><li class="unbound_nav_item unbound_nav_item_shelfbrowse"><a href="#unbound_nav_shelfbrowse">Browse Shelf </a><span class="unbound_badge .shelfbrowse"></span></li></ul><div class="unbound_clear"></div></div><div class="unbound_element unbound_summary"><a name="unbound_nav_summary"></a><h3 class="unbound_header unbound_summary_header">Summary</h3><div id="unbound_summary" class="unbound_content unbound_summary_content"></div></div><div class="unbound_element unbound_author"><a name="unbound_nav_author"></a><h3 class="unbound_header unbound_author_header">About The Author</h3><div id="unbound_author" class="unbound_content unbound_author_content"></div></div><div class="unbound_element unbound_ltseries"><a name="unbound_nav_ltseries"></a><h3 class="unbound_header unbound_ltseries_header">Series</h3><div id="unbound_ltseries" class="unbound_content unbound_ltseries_content"></div></div><div class="unbound_element unbound_similar"><a name="unbound_nav_similar"></a><h3 class="unbound_header unbound_similar_header">You May Also Like</h3><div id="unbound_similar" class="unbound_content unbound_similar_content"></div></div><div class="unbound_element unbound_lists"><a name="unbound_nav_lists"></a><h3 class="unbound_header unbound_lists_header">Librarian Recommends</h3><div id="unbound_lists" class="unbound_content unbound_lists_content"></div></div><div class="unbound_element unbound_reviews"><a name="unbound_nav_reviews"></a><h3 class="unbound_header unbound_reviews_header">Professional Reviews</h3><div id="unbound_reviews" class="unbound_content unbound_reviews_content"></div></div><div class="unbound_element unbound_other"><a name="unbound_nav_other"></a><h3 class="unbound_header unbound_other_header">Also Available As</h3><div id="unbound_other" class="unbound_content unbound_other_content"></div></div><div class="unbound_element unbound_tags"><a name="unbound_nav_tags"></a><h3 class="unbound_header unbound_tags_header">Tags</h3><div id="unbound_tags" class="unbound_content unbound_tags_content"></div></div><div class="unbound_element unbound_bookprofile"><a name="unbound_nav_bookprofile"></a><h3 class="unbound_header unbound_bookprofile_header">Book Profile</h3><div id="unbound_bookprofile" class="unbound_content unbound_bookprofile_content"></div></div><div class="unbound_element unbound_readinglevel"><a name="unbound_nav_readinglevel"></a><h3 class="unbound_header unbound_readinglevel_header">Reading Level</h3><div id="unbound_readinglevel" class="unbound_content unbound_readinglevel_content"></div></div><div class="unbound_element unbound_awards"><a name="unbound_nav_awards"></a><h3 class="unbound_header unbound_awards_header">Awards</h3><div id="unbound_awards" class="unbound_content unbound_awards_content"></div></div><div class="unbound_element unbound_shelfbrowse"><a name="unbound_nav_shelfbrowse"></a><h3 class="unbound_header unbound_shelfbrowse_header">Browse Shelf</h3><div id="unbound_shelfbrowse" class="unbound_content unbound_shelfbrowse_content"></div></div></div><div class="unbound_mega_footer"><img alt="Syndetics Unbound logo" class="unbound_logo" src="https://image.librarything.com/pics/oa_favicon_tiny_30h.png" srcset="https://image.librarything.com/pics/oa_favicon_tiny_60h.png 2x"><span class="unbound_footer_msg">Catalog enrichment powered by Syndetics Unbound</span></div><div style="display:none;" id="unbound_hover" ua="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36" class="unbound_hover triangle-border top loadingPQ unbound_hover_1982 chrome webkit windows lt1 loadingLT infiniti "><div id="unbound_hover_triangle"></div><div class="unbound_hover_basic"><div class="unbound_hover_title"></div><div class="unbound_hover_author"></div><div class="unbound_hover_format"></div><div class="unbound_hover_rating"></div><div class="unbound_hover_link"><button tabindex="0" data-id="" class="unbound_hover_link_button">Check Availability</button></div><div class="unbound_hover_isbn"></div></div><div class="unbound_hover_summary"></div><div class="unbound_clear"></div></div>';LibraryThingConnector.hoverDivHTML = '<div style="display:none;" id="unbound_hover" ua="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36" class="unbound_hover triangle-border top loadingPQ unbound_hover_1982 chrome webkit windows lt1 loadingLT infiniti "><div id="unbound_hover_triangle"></div><div class="unbound_hover_basic"><div class="unbound_hover_title"></div><div class="unbound_hover_author"></div><div class="unbound_hover_format"></div><div class="unbound_hover_rating"></div><div class="unbound_hover_link"><button tabindex="0" data-id="" class="unbound_hover_link_button">Check Availability</button></div><div class="unbound_hover_isbn"></div></div><div class="unbound_hover_summary"></div><div class="unbound_clear"></div></div>';LibraryThingConnector.searchresults_summaryHTML = '<div data-id="" data-workcode="" style="display:none;" class="unbound_searchresult infiniti"><a data-unbound-enrichmenttype="summary" class="su_sd_title su_sd_title_summary">Summary</a><a data-unbound-enrichmenttype="audiovideo" class="su_sd_title su_sd_title_audiovideo">Video And Music</a><a data-unbound-enrichmenttype="game" class="su_sd_title su_sd_title_game">Video Games</a><a data-unbound-enrichmenttype="author" class="su_sd_title su_sd_title_author">About The Author</a><a data-unbound-enrichmenttype="lookinside" class="su_sd_title su_sd_title_lookinside">Look Inside</a><a data-unbound-enrichmenttype="ltseries" class="su_sd_title su_sd_title_ltseries">Series</a><a data-unbound-enrichmenttype="similar" class="su_sd_title su_sd_title_similar">You May Also Like</a><a data-unbound-enrichmenttype="lists" class="su_sd_title su_sd_title_lists">Librarian Lists</a><a data-unbound-enrichmenttype="reviews" class="su_sd_title su_sd_title_reviews">Professional Reviews</a><a data-unbound-enrichmenttype="patronreviews" class="su_sd_title su_sd_title_patronreviews">Reader Reviews</a><a data-unbound-enrichmenttype="other" class="su_sd_title su_sd_title_other">Also Available As</a><a data-unbound-enrichmenttype="tags" class="su_sd_title su_sd_title_tags">Tags</a><a data-unbound-enrichmenttype="bookprofile" class="su_sd_title su_sd_title_bookprofile">Book Profile</a><a data-unbound-enrichmenttype="readinglevel" class="su_sd_title su_sd_title_readinglevel">Reading Level</a><a data-unbound-enrichmenttype="awards" class="su_sd_title su_sd_title_awards">Awards</a></div>';LibraryThingConnector.megadiv_id = 'unbound_mega_u_621787b6';LibraryThingConnector.MIN_UNBOUND_ELMENTS_FOR_NAV = 3;LibraryThingConnector.run_search_div = false;LibraryThingConnector.prefer_ebooks = 0;LibraryThingConnector.mark_eresources = 0;LibraryThingConnector.add_eresource_message = 0;LibraryThingConnector.eresources_message_text = "";LibraryThingConnector.enrichments_disabledB = false;LibraryThingConnector.footerHTML = '<div class="unbound_mega_footer"><img alt="Syndetics Unbound logo" class="unbound_logo" src="https://image.librarything.com/pics/oa_favicon_tiny_30h.png" srcset="https://image.librarything.com/pics/oa_favicon_tiny_60h.png 2x"><span class="unbound_footer_msg">Catalog enrichment powered by Syndetics Unbound</span></div>';LibraryThingConnector.config = {"instanceA":{"i_id":2469,"i_a_id":1982,"i_primaryB":1,"i_id_basedon":0,"i_id_synch":0,"i_deleteflag":0,"resolvedname":"Primary instance","defaultnameB":1},"settingsA":{"opacA":{"vendor":"Concord","vendor_opacN":"1","vendor_opac":"Infiniti","easy_holdingsB":0,"consortia_supportB":0,"url_library":"https://brisbanegrammar.concordinfiniti.com/library/admin/dashboard?ilc=1   OR  https://libguides.brisbanegrammar.com/libraryhome","url_opac":" https://brisbanegrammar.concordinfiniti.com","iiisearchscoping":1,"useAllHoldingsB":0,"library_type":"3"},"linksA":{"isbn":"https://brisbanegrammar.concordinfiniti.com/library/search/keyword?searchTerm=UNBOUNDREPLACE","title":"https://brisbanegrammar.concordinfiniti.com/library/search/title?searchSiteId=&searchTerm=UNBOUNDREPLACE","keyword":"https://brisbanegrammar.concordinfiniti.com/library/search/keyword?searchTerm=UNBOUNDREPLACE"},"advancedA":{"langprefA":{"1":"eng","2":"spa"},"usemegadiv":1}},"enrichmentsA":{"settings":{"orderA":["stackmap","summary","audiovideo","game","author","lookinside","series","similar","lists","reviews","patronreviews","altmetrics","rcl","ulrichs","bx","other","tags","bookprofile","readinglevel","awards","shelfbrowse","shelfbrowse"],"onoffA":{"similar":1,"audiovideo":0,"summary":1,"other":1,"author":1,"tags":1,"readinglevel":1,"shelfbrowse":1,"patronreviews":0,"reviews":1,"lookinside":0,"game":0,"bookprofile":1,"awards":1,"series":1,"altmetrics":0,"rcl":0,"ulrichs":0,"bx":0,"stackmap":0,"lists":1},"prefer_ebooks":3,"mark_eresources":1,"add_eresource_message":1,"eresources_message_text":"We have ebooks, digital audiobooks, and other electronic resources available. Look for the (e) below.","holdings_dataAA":{"last_uploadstamp":"1525392504","isbn_count":"38938","count_retrieved":"96124","count_overlap":"34766","total_digital_collections":"38","eresource_warning_percent_threshold":0}},"installchecklist":{"coverspage_openedB":1,"getcodepage_openedB":1},"lists_display":{"otherlibrariesB":1,"sulistsB":1,"libtypesA":["other_school"],"ljlistsB":1},"shelfbrowse_holdings_settings":{"callnolocation":"1","callnotype":"0","notify_when_done":"john.byrne@brisbanegrammar.com"},"reviews":{"langrevA":{"1":"eng","2":"spa"},"socialmediasigninB":1},"lists_settings":{"allowlistsB":1,"sharelistsB":1},"search":{"onoffA":{"similar":1,"lists":1,"audiovideo":1,"summary":1,"other":1,"author":1,"tags":1,"readinglevel":1,"patronreviews":1,"reviews":1,"lookinside":1,"game":1,"bookprofile":1,"awards":1,"series":1,"altmetrics":0,"rcl":0,"ulrichs":0,"bx":0,"stackmap":0},"orderA":["stackmap","summary","audiovideo","game","author","lookinside","series","similar","lists","reviews","patronreviews","altmetrics","rcl","ulrichs","bx","other","tags","bookprofile","readinglevel","awards","shelfbrowse"],"onoff":1},"customizetext":{"customtext_patronreviews":"Reader Reviews","customtext_reviews":"Professional Reviews","customtext_tags":"Tags","customtext_shelfbrowse":"Browse Shelf","customtext_similar":"You May Also Like","customtext_lists":"Lists","customtext_awards":"Awards","customtext_series":"Series","customtext_other":"Also Available As","customtext_audiovideo":"Video And Music","customtext_readinglevel":"Reading Level","customtext_lookinside":"Look Inside","customtext_summary":"Summary","customtext_author":"About The Author","customtext_game":"Video Games","customtext_bookprofile":"Book Profile","customtext_altmetrics":"Altmetrics","customtext_rcl":"Core Titles","customtext_ulrichs":"Ulrich's","customtext_bx":"bX Recommender","customtext_stackmap":"Stack Map","customtext_ltseries":"Series (alternate)","customtext_db":"Suggested Databases"}},"accountlevel":{"settingsA":{"opacA":{"iiisearchscoping":1,"useAllHoldingsB":0},"advancedA":{"langprefA":{"1":"eng","2":"spa"},"usemegadiv":1}},"enrichmentsA":{"settings":{"orderA":["stackmap","summary","audiovideo","game","author","lookinside","series","similar","lists","reviews","patronreviews","altmetrics","rcl","ulrichs","bx","other","tags","bookprofile","readinglevel","awards","shelfbrowse"],"onoffA":{"similar":1,"audiovideo":1,"summary":1,"other":1,"author":1,"tags":1,"readinglevel":1,"shelfbrowse":1,"patronreviews":1,"reviews":1,"lookinside":1,"game":1,"bookprofile":1,"awards":1,"series":1,"altmetrics":0,"rcl":0,"ulrichs":0,"bx":0,"stackmap":0,"lists":1},"prefer_ebooks":3,"mark_eresources":1,"add_eresource_message":1,"eresources_message_text":"We have ebooks, digital audiobooks, and other electronic resources available. Look for the (e) below."},"lists_display":{"otherlibrariesB":1,"sulistsB":1,"libtypesA":["other_school"],"ljlistsB":1},"lists_settings":{"sharelistsB":"0","allowlistsB":"0"},"reviews":{"langrevA":{"1":"eng","2":"spa"},"socialmediasigninB":1},"search":{"onoffA":{"similar":1,"lists":1,"audiovideo":1,"summary":1,"other":1,"author":1,"tags":1,"readinglevel":1,"patronreviews":1,"reviews":1,"lookinside":1,"game":1,"bookprofile":1,"awards":1,"series":1,"altmetrics":0,"rcl":0,"ulrichs":0,"bx":0,"stackmap":0},"orderA":["stackmap","summary","audiovideo","game","author","lookinside","series","similar","lists","reviews","patronreviews","altmetrics","rcl","ulrichs","bx","other","tags","bookprofile","readinglevel","awards","shelfbrowse"],"onoff":1}}},"covers":{"host":"https://syndetics.com/","prefix":"index.php?isbn=MAGICNUMBER/","suffix":".jpg&imagelinking=1&client=brisbanesch&type=unbound&nicaption=TITLE%1FAUTHOR%1FFORMAT","client":"brisbanesch","size":{"small":{"1x":"124h","2x":"248h","3x":"372h"},"standard":{"1x":"174h","2x":"348h","3x":"522h"}}},"SYNDETICS_SMALLCOVER_URL_TEMPLATE":"https://syndetics.com/index.php?isbn=MAGICNUMBER/124h.jpg&imagelinking=1&client=brisbanesch&type=unbound&nicaption=TITLE%1FAUTHOR%1FFORMAT","SYNDETICS_COVER_URL_TEMPLATE":"https://syndetics.com/index.php?isbn=MAGICNUMBER/174h.jpg&imagelinking=1&client=brisbanesch&type=unbound&nicaption=TITLE%1FAUTHOR%1FFORMAT","translateA":{"textA":[],"loadedB":1},"accountAA":{"lsom_lsa_id":"1604","lsom_account_id":"1982","lsom_syndetics_id":"brisbanesch","lsom_custommappings":"","syndetics_client":"brisbanesch"},"backend":{"name":"infiniti"}};LibraryThingConnector.ai_classic_infrastructure_migration_unbound=0;LibraryThingConnector.infr_mig = 0;LibraryThingConnector.useNoHoldingsB = 0;LibraryThingConnector.BASE_URL = "https://ltfl.librarything.com/syndeticsunbound/";LibraryThingConnector.SYNDETICS_DOMAIN = "https://syndetics.com";LibraryThingConnector.LT_DOMAIN = "https://ltfl.librarything.com";LibraryThingConnector.LTFL_BASE_URL = "https://ltfl.librarything.com/forlibraries/";LibraryThingConnector.LTFL_BASE_URL_RW = "https://ltfl.librarything.com/forlibraries/";LibraryThingConnector.STATS_URL = "https://ltfl.librarything.com/syndeticsunbound/syndeticsunbound_stats.php";LibraryThingConnector.LIBRARIAN_POWER_DOMAIN = "https://librarian.syndetics.com/syndeticsunbound/";LibraryThingConnector.suDemoModeB = false;LibraryThingConnector.infraMigrationDemoB = false;LibraryThingConnector.demoModeHTML = "";LibraryThingConnector.lsa_id = 1604;LibraryThingConnector.client = "brisbanesch";LibraryThingConnector.a_id = 1982;LibraryThingConnector.environment = "prod";LibraryThingConnector.su_session = "u_0274acaf";LibraryThingConnector.f_id = "";LibraryThingConnector.f_type = "";LibraryThingConnector.product = "unbound";LibraryThingConnector.loglevel = 5;LibraryThingConnector.attachInitOnDomLoaded(LibraryThingConnector.init);LibraryThingConnector.info("LibraryThingConnector loaded");LibraryThingConnector.timing.init.initLoadTime =0.19841504096985;
/* end */
