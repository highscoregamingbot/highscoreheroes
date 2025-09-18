// telegram-webapp.jslib
// Plaats dit bestand in: Assets/Plugins/WebGL/telegram-webapp.jslib

var TelegramWebApp = {
    
    GetTelegramParam: function(paramNamePtr) {
        var paramName = UTF8ToString(paramNamePtr);
        
        try {
            // Method 1: Check Telegram WebApp startParam
            if (typeof window.Telegram !== 'undefined' && 
                window.Telegram.WebApp && 
                window.Telegram.WebApp.initDataUnsafe &&
                window.Telegram.WebApp.initDataUnsafe.start_param) {
                
                var startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
                console.log('Telegram start_param:', startParam);
                
                try {
                    var padding = '=='.substring(0, (4 - startParam.length % 4) % 4);
                    var decoded = atob(startParam + padding);
                    var data = JSON.parse(decoded);
                    console.log('Parsed start param data:', data);
                    
                    var value = data[paramName];
                    if (value !== undefined && value !== null) {
                        var result = String(value);
                        var bufferSize = lengthBytesUTF8(result) + 1;
                        var buffer = _malloc(bufferSize);
                        stringToUTF8(result, buffer, bufferSize);
                        return buffer;
                    }
                } catch (e) {
                    console.error('Error parsing start_param:', e);
                }
            }
            
            // Method 2: Fallback to URL parameters
            var urlParams = new URLSearchParams(window.location.search);
            var tgParam = urlParams.get('tgWebAppStartParam');
            if (tgParam) {
                try {
                    var padding = '=='.substring(0, (4 - tgParam.length % 4) % 4);
                    var decoded = atob(tgParam + padding);
                    var data = JSON.parse(decoded);
                    
                    var value = data[paramName];
                    if (value !== undefined && value !== null) {
                        var result = String(value);
                        var bufferSize = lengthBytesUTF8(result) + 1;
                        var buffer = _malloc(bufferSize);
                        stringToUTF8(result, buffer, bufferSize);
                        return buffer;
                    }
                } catch (e) {
                    console.error('Error parsing URL param:', e);
                }
            }
            
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
            if (typeof window.Telegram !== 'undefined' && 
                window.Telegram.WebApp && 
                window.Telegram.WebApp.initDataUnsafe &&
                window.Telegram.WebApp.initDataUnsafe.user) {
                
                var userId = String(window.Telegram.WebApp.initDataUnsafe.user.id);
                console.log('My Telegram ID:', userId);
                
                var bufferSize = lengthBytesUTF8(userId) + 1;
                var buffer = _malloc(bufferSize);
                stringToUTF8(userId, buffer, bufferSize);
                return buffer;
            }
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
                console.log('My Telegram username:', username);
                
                var bufferSize = lengthBytesUTF8(username) + 1;
                var buffer = _malloc(bufferSize);
                stringToUTF8(username, buffer, bufferSize);
                return buffer;
            }
        } catch (error) {
            console.error('Error getting Telegram username:', error);
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
                console.log('My Telegram first name:', firstName);
                
                var bufferSize = lengthBytesUTF8(firstName) + 1;
                var buffer = _malloc(bufferSize);
                stringToUTF8(firstName, buffer, bufferSize);
                return buffer;
            }
        } catch (error) {
            console.error('Error getting Telegram first name:', error);
        }
        
        var emptyString = "";
        var bufferSize = lengthBytesUTF8(emptyString) + 1;
        var buffer = _malloc(bufferSize);
        stringToUTF8(emptyString, buffer, bufferSize);
        return buffer;
    }
};

mergeInto(LibraryManager.library, TelegramWebApp);