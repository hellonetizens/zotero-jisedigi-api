var ZoteroJisedigiAPI;

function log(msg) {
	Zotero.debug("Zotero Jisedigi API: " + msg);
}

function install() {
	log("Installed");
}

async function startup({ id, version, rootURI }) {
	log("Starting");

	Zotero.PreferencePanes.register({
		image: 'chrome/skin/default/zotero-jisedigi/api-icon.svg',
		pluginID: 'zotero-jisedigi-api@ndl.go.jp',
		src: rootURI + 'prefs.xhtml'
	});

	Services.scriptloader.loadSubScript(rootURI + 'zotero-jisedigi-api.js');
	ZoteroJisedigiAPI.init({ id, version, rootURI });
	ZoteroJisedigiAPI.addToAllWindows();
}

function onMainWindowLoad({ window }) {
	ZoteroJisedigiAPI.addToWindow(window);
}

function onMainWindowUnload({ window }) {
	ZoteroJisedigiAPI.removeFromWindow(window);
}

function shutdown() {
	log("Shutting down");
	ZoteroJisedigiAPI.removeFromAllWindows();
	ZoteroJisedigiAPI = undefined;
}

function uninstall() {
	log("Uninstalled");
}
