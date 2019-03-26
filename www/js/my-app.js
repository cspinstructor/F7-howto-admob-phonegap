// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  console.log('Device is ready!');
  initApp();
});

// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function(page) {
  // Do something here for "about" page
});

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function(e) {
  // Get page data from event data
  var page = e.detail.page;

  if (page.name === 'about') {
    // Following code will be executed for page with data-page attribute equal to "about"
    //myApp.alert('Here comes About page');
  }
});

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function(e) {
  // Following code will be executed for page with data-page attribute equal to "about"
  //myApp.alert('Here comes About page');
});

//------- Admob ----------
var admobid = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewardvideo: 'ca-app-pub-3940256099942544/5224354917'
  // banner: 'ca-app-pub-5677932818243380/2569293910',
  // interstitial: 'ca-app-pub-5677932818243380/7299586858',
  // rewardvideo: 'ca-app-pub-5677932818243380/8751558889'
};

function initApp() {
  if (!AdMob) {
    alert('admob plugin not ready');
    return;
  }

  initAd();
}

function initAd() {
  var defaultOptions = {
    bannerId: admobid.banner,
    interstitialId: admobid.interstitial,
    adSize: 'SMART_BANNER',
    // width: integer, // valid when set adSize 'CUSTOM'
    // height: integer, // valid when set adSize 'CUSTOM'
    position: AdMob.AD_POSITION.BOTTOM_CENTER,
    // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
    bgColor: 'black', // color name, or '#RRGGBB'
    // x: integer,		// valid when set position to 0 / POS_XY
    // y: integer,		// valid when set position to 0 / POS_XY
    isTesting: true, // set to true, to receiving test ad for testing purpose
    autoShow: false // auto show interstitial ad when loaded, set to false if prepare/show
  };
  AdMob.setOptions(defaultOptions);

  registerAdEvents();
  AdMob.prepareInterstitial({ adId: admobid.interstitial, autoShow: false });
  AdMob.createBanner({
    adId: admobid.banner,
    position: AdMob.AD_POSITION.BOTTOM_CENTER,
    autoShow: false
  });
  AdMob.prepareRewardVideoAd({
    adId: admobid.rewardvideo,
    autoShow: false
  });
}

// optional, in case respond to events or handle error
function registerAdEvents() {
  // new events, with variable to differentiate: adNetwork, adType, adEvent
  document.addEventListener('onAdFailLoad', function(data) {
    alert(
      'error: ' +
        data.error +
        ', reason: ' +
        data.reason +
        ', adNetwork:' +
        data.adNetwork +
        ', adType:' +
        data.adType +
        ', adEvent:' +
        data.adEvent
    ); // adType: 'banner' or 'interstitial'
  });
  document.addEventListener('onAdLoaded', function(data) {
    //alert(data.adType + ' ad loaded');
  });
  document.addEventListener('onAdPresent', function(data) {
    //alert(data.adType + ' ad present');
  });
  document.addEventListener('onAdLeaveApp', function(data) {
    //alert(data.adType + ' ad leave');
  });
  document.addEventListener('onAdDismiss', function(data) {
    // alert(data.adType + ' ad dismissed');
    prepareAd(data.adType);
    if (data.adType === 'rewardvideo') {
      alert('Here is your reward');
    }
  });
}

$$('.close-panel').click(function() {
  prepareAd('all');
});

function prepareAd(type) {
  if (type === 'interstitial') {
    AdMob.prepareInterstitial({
      adId: admobid.interstitial,
      autoShow: false
    });
  }
  if (type === 'rewardvideo') {
    AdMob.prepareRewardVideoAd({
      adId: admobid.rewardvideo,
      autoShow: false
    });
  }
  if (type === 'all') {
    initApp();

    AdMob.prepareInterstitial({
      adId: admobid.interstitial,
      autoShow: false
    });
    AdMob.prepareRewardVideoAd({
      adId: admobid.rewardvideo,
      autoShow: false
    });
  }
}

//--- called from onClick() inline in html pages ---
function showBanner() {
  AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
}

function showInterstitial() {
  AdMob.showInterstitial();
}

function showRewardVideo() {
  AdMob.showRewardVideoAd();
}
