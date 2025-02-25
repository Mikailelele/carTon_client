window.addEventListener("load", function () 
{
    if ("serviceWorker" in navigator)
    {
      navigator.serviceWorker.register("ServiceWorker.js");
    }
  });

  var unityInstanceRef;
  var unsubscribe;
  var container = document.querySelector("#unity-container");
  var canvas = document.querySelector("#unity-canvas");
  var loadingBar = document.querySelector("#unity-loading-bar");
  var progressBarFull = document.querySelector("#unity-progress-bar-full");
  var warningBanner = document.querySelector("#unity-warning");

  // Shows a temporary message banner/ribbon for a few seconds, or
  // a permanent error message on top of the canvas if type=='error'.
  // If type=='warning', a yellow highlight color is used.
  // Modify or remove this function to customize the visually presented
  // way that non-critical warnings and error messages are presented to the
  // user.
  function unityShowBanner(msg, type) 
  {
    function updateBannerVisibility()
    {
      warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }

    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);

    if (type == 'error')
    {
      div.style = 'background: red; padding: 10px;';
    }
    else
    {
      if (type == 'warning')
      {
        div.style = 'background: yellow; padding: 10px;';
      }

      setTimeout(function()
      {
        warningBanner.removeChild(div);
        updateBannerVisibility();
      }, 5000);
    }

    updateBannerVisibility();
  }

  var buildUrl = "Build";
  var loaderUrl = buildUrl + "/Build.loader.js";
  var config = {
    dataUrl: buildUrl + "/Build.data",
    frameworkUrl: buildUrl + "/Build.framework.js",
    codeUrl: buildUrl + "/Build.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "Unity_2D_Car.ton",
    productVersion: "1.0",
    showBanner: unityShowBanner,
  };

  // By default Unity keeps WebGL canvas render target size matched with
  // the DOM size of the canvas element (scaled by window.devicePixelRatio)
  // Set this to false if you want to decouple this synchronization from
  // happening inside the engine, and you would instead like to size up
  // the canvas DOM size and WebGL render target sizes yourself.
  // config.matchWebGLToCanvasSize = false;

  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  {
    // Mobile device style: fill the whole browser client area with the game canvas:
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

  loadingBar.style.display = "block";

  var script = document.createElement("script");
  script.src = loaderUrl;

  script.onload = () => 
  {
    createUnityInstance(canvas, config, (progress) => 
    {
      progressBarFull.style.width = 100 * progress + "%";
    }
    ).then((unityInstance) => 
    {
      unityInstanceRef = unityInstance;
      loadingBar.style.display = "none";
    }
    ).catch((message) => 
    {
      alert(message);
    });
  };

  document.body.appendChild(script);

  window.addEventListener('load', function ()
  {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();

    console.log("Telegram Web App has been expanded to full screen");

    var version = Telegram.WebApp.version;
    var versionFloat = parseFloat(version);

    if (versionFloat >= 7.7)
    {
        Telegram.WebApp.disableVerticalSwipes();
        
        console.log('Activating vertical swipe disable');
    }

    console.log(`Telegram Web App opened with version: ${version}`);
    console.log(`Telegram Web App checked` +
        `latest version status with result: ${Telegram.WebApp.isVersionAtLeast(version)}`);
  });

window.addEventListener('beforeunload', function () {
  unityInstanceRef.SendMessage('BrowserEventsHandler', 'OnBrowserQuitEvent');
});

function GetTelegramInitData() {
  if (!window.Telegram || !window.Telegram.WebApp) {
    console.error('Telegram WebApp is not initialized');
    return JSON.stringify({
      error: 'Telegram WebApp is not initialized'
    });
  }

  const webApp = window.Telegram.WebApp;

  // Check if we're in Telegram
  if (!webApp.initDataUnsafe || !webApp.initDataUnsafe.user) {
    console.error('Not in Telegram WebApp or user data not available');
    return JSON.stringify({
      error: 'Not in Telegram WebApp'
    });
  }


  HideHeader();
  const user = webApp.initDataUnsafe.user;

  // Create the data object that matches TelegramLoginData structure
  const telegramData = {
    id: user.id,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    username: user.username || '',
    photo_url: user.photo_url || '',
    auth_date: Math.floor(Date.now() / 1000).toString(),
    hash: webApp.initData // Include the full initData for verification
  };

  return JSON.stringify(telegramData);
  }

  function GetTelegramPlatformInfo() {
    if (!window.Telegram.WebApp) return null;
    return JSON.stringify({
      platform: window.Telegram.WebApp.platform,
      version: window.Telegram.WebApp.version,
      viewportHeight: window.Telegram.WebApp.viewportHeight,
      viewportStableHeight: window.Telegram.WebApp.viewportStableHeight,
      isExpanded: window.Telegram.WebApp.isExpanded,
      colorScheme: window.Telegram.WebApp.colorScheme
    });
  }
  
  function TelegramHapticFeedback(type) {
    if (!window.Telegram.WebApp) return;
    switch(type) {
      case 'impact':
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        break;
      case 'notification':
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        break;
      case 'selection':
        window.Telegram.WebApp.HapticFeedback.selectionChanged();
        break;
    }
  }
  
  function GetTelegramThemeParams() {
    if (!window.Telegram.WebApp) return null;
    return JSON.stringify({
      backgroundColor: window.Telegram.WebApp.backgroundColor,
      textColor: window.Telegram.WebApp.textColor,
      headerColor: window.Telegram.WebApp.headerColor,
      isDarkMode: window.Telegram.WebApp.colorScheme === 'dark'
    });
  }
  
  function TelegramExpandApp() {
    if (!window.Telegram.WebApp) return;
    window.Telegram.WebApp.expand();
  }
