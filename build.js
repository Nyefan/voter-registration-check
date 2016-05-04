
'use strict';

var options = {
	'all':true,
	'overwrite':true,
	'appName':'Voter-Registration-Check',
	'name':'Voter-Registration-Check',
	'dir':'./app',
	'out':'./dist',
	'arch':'all',
	'platform':'all',
	'asar':true,
	'icons':'./build/',
	'ignore':'',
	"app-bundle-id":"css.expert.prch",
	"app-category-type":"public.app-category.utilities"
};

function done_callback (err, appPaths) {
	if (err) {
		console.error('Error from done_callback: ', err);
	}
}

try {
	require('electron-packager')(options, done_callback);
}
catch(error) {
	console.error(error);
}