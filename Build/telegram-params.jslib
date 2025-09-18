// telegram-webapp.jslib
// Plaats dit bestand in: Assets/Plugins/WebGL/telegram-webapp.jslib

var TelegramWebApp = {
    
    GetTelegramParam: function(paramNamePtr) {
        var paramName = UTF8ToString(paramNamePtr);
        
        try {
            // Check voor tgWebAppStartParam in URL
            var urlParams = new URLSearchParams(window.location.search);
            var tgWebAppParam = urlParams.get('tgWebAppStartParam');
            
            if (tgWebAppParam) {
                console.log('Found tgWebAppStartParam:', tgWebAppParam);
                try {
                    var padding = '=='.substring(0, (4 - tgWebAppParam.length % 4) % 4);
                    var decoded = atob(tgWebAppParam + padding);
                    var data = JSON.parse(decoded);
                    console.log('Decoded match data:', data);
                    
                    var value = data[paramName];
                    if (value !== undefined && value !== null) {
                        var result = String(value);
                        var bufferSize = lengthBytesUTF8(result) + 1;
                        var buffer = _malloc(bufferSize);
                        stringToUTF8(result, buffer, bufferSize);
                        return buffer;
                    }
                } catch (e) {
                    console.error('Error decoding tgWebAppStartParam:', e);
                }
            }
            
            // Fallback: check ook voor normale startapp parameter
            var startapp = urlParams.get('startapp');
            if (startapp) {
                console.log('Found startapp parameter:', startapp);
                try {
                    var padding = '=='.substring(0, (4 - startapp.length % 4) % 4);
                    var decoded = atob(startapp + padding);
                    var data = JSON.parse(decoded);
                    console.log('Decoded startapp data:', data);
                    
                    var value = data[paramName];
                    if (value !== undefined && value !== null) {
                        var result = String(value);
                        var bufferSize = lengthBytesUTF8(result) + 1;
                        var buffer = _malloc(bufferSize);
                        stringToUTF8(result, buffer, bufferSize);
                        return buffer;
                    }
                } catch (e) {
                    console.error('Error decoding startapp:', e);
                }
            }
            
            console.log('Parameter ' + paramName + ' not found');
            
        } catch (error) {
            console.error('Error in GetTelegramParam:', error);
        }
        
        // Return empty string
        var emptyString = "";
        var bufferSize = lengthBytesUTF8(emptyString) + 1;
        var buffer = _malloc(bufferSize);
        stringToUTF8(emptyString, buffer, bufferSize);
        return buffer;
    },
    
    GetMyTelegramId: function() {
        try {
            // Method 1: Check Telegram WebApp initDataUnsafe
            if (typeof window.Telegram !== 'undefined' && 
                window.Telegram.WebApp && 
                window.Telegram.WebApp.initDataUnsafe &&
                window.Telegram.WebApp.initDataUnsafe.user) {
                
                var userId = String(window.Telegram.WebApp.initDataUnsafe.user.id);
                console.log('Got Telegram ID from WebApp:', userId);
                
                var bufferSize = lengthBytesUTF8(userId) + 1;
                var buffer = _malloc(bufferSize);
                stringToUTF8(userId, buffer, bufferSize);
                return buffer;
            }
            
            // Method 2: Parse from hash data
            var hashData = window.location.hash;
            if (hashData.includes('tgWebAppData')) {
                var match = hashData.match(/user%3D%257B%2522id%2522%253A(\d+)/);
                if (match && match[1]) {
                    var userId = match[1];
                    console.log('Got Telegram ID from hash:', userId);
                    
                    var bufferSize = lengthBytesUTF8(userId) + 1;
                    var buffer = _malloc(bufferSize);
                    stringToUTF8(userId, buffer, bufferSize);
                    return buffer;
                }
            }
            
            console.log('Could not find Telegram user ID');
            
        } catch (error) {
            console.error('Error getting Telegram ID:', error);
        }
        
        // Return empty string
        var emptyString = "";
        var bufferSize = lengthBytesUTF8(emptyString) + 1;
        var buffer = _malloc(bufferSize);
        stringToUTF8(emptyString, buffer, bufferSize);
        return buffer;
    },
    
    GetMyTelegramUsername: function() {
        try {
            if (typeof window.Telegram !== 'undefined' && 
                window.Telegram.WebApp && 
                window.Telegram.WebApp.initDataUnsafe &&
                window.Telegram.WebApp.initDataUnsafe.user) {
                
                var username = window.Telegram.WebApp.initDataUnsafe.user.username || "";
                console.log('Got Telegram username from WebApp:', username);
                
                var bufferSize = lengthBytesUTF8(username) + 1;
                var buffer = _malloc(bufferSize);
                stringToUTF8(username, buffer, bufferSize);
                return buffer;
            }
            
            // Fallback: parse from hash
            var hashData = window.location.hash;
            if (hashData.includes('username')) {
                var match = hashData.match(/%2522username%2522%253A%2522([^%]+)%2522/);
                if (match && match[1]) {
                    var username = decodeURIComponent(match[1]);
                    console.log('Got username from hash:', username);
                    
                    var bufferSize = lengthBytesUTF8(username) + 1;
                    var buffer = _malloc(bufferSize);
                    stringToUTF8(username, buffer, bufferSize);
                    return buffer;
                }
            }
            
        } catch (error) {
            console.error('Error getting username:', error);
        }
        
        var emptyString = "";
        var bufferSize = lengthBytesUTF8(emptyString) + 1;
        var buffer = _malloc(bufferSize);
        stringToUTF8(emptyString, buffer, bufferSize);
        return buffer;
    },
    
    GetMyTelegramFirstName: function() {
        try {
            if (typeof window.Telegram !== 'undefined' && 
                window.Telegram.WebApp && 
                window.Telegram.WebApp.initDataUnsafe &&
                window.Telegram.WebApp.initDataUnsafe.user) {
                
                var firstName = window.Telegram.WebApp.initDataUnsafe.user.first_name || "";
                console.log('Got first name from WebApp:', firstName);
                
                var bufferSize = lengthBytesUTF8(firstName) + 1;
                var buffer = _malloc(bufferSize);
                stringToUTF8(firstName, buffer, bufferSize);
                return buffer;
            }
            
            // Fallback: parse from hash
            var hashData = window.location.hash;
            if (hashData.includes('first_name')) {
                var match = hashData.match(/%2522first_name%2522%253A%2522([^%]+)%2522/);
                if (match && match[1]) {
                    var firstName = decodeURIComponent(match[1]).replace(/\+/g, ' ');
                    console.log('Got first name from hash:', firstName);
                    
                    var bufferSize = lengthBytesUTF8(firstName) + 1;
                    var buffer = _malloc(bufferSize);
                    stringToUTF8(firstName, buffer, bufferSize);
                    return buffer;
                }
            }
            
        } catch (error) {
            console.error('Error getting first name:', error);
        }
        
        var emptyString = "";
        var bufferSize = lengthBytesUTF8(emptyString) + 1;
        var buffer = _malloc(bufferSize);
        stringToUTF8(emptyString, buffer, bufferSize);
        return buffer;
    }
};

mergeInto(LibraryManager.library, TelegramWebApp);