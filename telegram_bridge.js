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

    if (!webApp.initDataUnsafe || !webApp.initDataUnsafe.user) {
        console.error('Not in Telegram WebApp or user data not available');
        return JSON.stringify({
            error: 'Not in Telegram WebApp'
        });
    }

    const user = webApp.initDataUnsafe.user;

    const telegramData = {
        id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        photo_url: user.photo_url || '',
        auth_date: Math.floor(Date.now() / 1000).toString(),
        hash: webApp.initData
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
    switch (type) {
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
