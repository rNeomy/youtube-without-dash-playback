'use strict';

var buttons = require('sdk/ui/button/action');
var sp = require('sdk/simple-prefs');
var preferences = require('sdk/preferences/service');
var tabs = require('sdk/tabs');
var self = require('sdk/self');

var button;

function handleClick(toggle) {
  let bol = sp.prefs.enabled;
  if (toggle) {
    bol = !bol;
    sp.prefs.enabled = bol;
  }
  let path = './icons/' + (bol ? '' : 'disabled/');
  button.icon = {
    '16': path + '16.png',
    '32': path + '32.png',
    '64': path + '64.png'
  };
  button.label = `YouTube without DASH Playback (${bol ? 'enabled' : 'disabled'})`;
  preferences.set('media.mediasource.enabled', !bol);
}

button = buttons.ActionButton({
  id: 'iywdplayback',
  label: 'YouTube without DASH Playback (disabled)',
  icon: {
    '16': './icons/16.png',
    '32': './icons/32.png',
    '64': './icons/64.png'
  },
  onClick: () => handleClick(true)
});
handleClick();

// make sure to reset changes
exports.onUnload = function (reason) {
  if (reason === 'uninstall' || reason === 'disable') {
    preferences.reset('media.mediasource.enabled');
  }
};

// FAQs page
exports.main = function (options) {
  if (options.loadReason === 'install' || options.loadReason === 'startup') {
    let version = sp.prefs.version;
    if (self.version !== version && sp.prefs.faqs) {
      tabs.open(
        `http://firefox.add0n.com/no-dash-playback.html?version=${self.version}&type=${version ? 'upgrade' : 'install'}`
      );
      sp.prefs.version = self.version;
    }
  }
};
