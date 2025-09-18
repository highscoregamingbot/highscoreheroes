// telegram-params.jslib
// Plaats dit bestand in: Assets/Plugins/WebGL/telegram-params.jslib

var TelegramParams = {
    
    GetTelegramParam: function(paramNamePtr) {
        // Convert C# string pointer naar JavaScript string
        var paramName = UTF8ToString(paramNamePtr);
        
        try {
            // Methode 1: Probeer direct uit URL parameters
            var urlParams = new URLSearchParams(window.location.search);
            var directParam = urlParams.get(paramName);
            if (directParam) {
                // Alloceer geheugen voor return string
                var bufferSize = lengthBytesUTF8(directParam) + 1;
                var buffer = _malloc(bufferSize);
                stringToUTF8(directParam, buffer, bufferSize);
                return buffer;
            }
            
            // Methode 2: Parse Telegram WebApp startapp parameter
            var tgWebAppStartParam = urlParams.get('tgWebAppStartParam');
            if (!tgWebAppStartParam) {
                // Ook checken voor andere mogelijke parameter namen
                tgWebAppStartParam = urlParams.get('startapp');
            }
            
            if (tgWebAppStartParam) {
                // Base64 decode
                try {
                    // Voeg padding toe indien nodig
                    var padding = '=='.substring(0, (4 - tgWebAppStartParam.length % 4) % 4);
                    var decoded = atob(tgWebAppStartParam + padding);
                    
                    // Parse JSON
                    var data = JSON.parse(decoded);
                    console.log('Parsed Telegram data:', data);
                    
                    // Haal gevraagde parameter op
                    var value = data[paramName];
                    if (value !== undefined && value !== null) {
                        var result = String(value);
                        var bufferSize = lengthBytesUTF8(result) + 1;
                        var buffer = _malloc(bufferSize);
                        stringToUTF8(result, buffer, bufferSize);
                        return buffer;
                    }
                } catch (parseError) {
                    console.error('Error parsing Telegram startapp parameter:', parseError);
                }
            }
            
            // Methode 3: Check Telegram WebApp object (als beschikbaar)
            if (typeof window.Telegram !== 'undefined' && 
                window.Telegram.WebApp && 
                window.Telegram.WebApp.initDataUnsafe) {
                var initData = window.Telegram.WebApp.initDataUnsafe;
                if (initData.start_param) {
                    try {
                        var decoded = atob(initData.start_param);
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
                        console.error('Error parsing Telegram WebApp start_param:', e);
                    }
                }
            }
            
            console.log('Parameter ' + paramName + ' not found');
            
        } catch (error) {
            console.error('Error in GetTelegramParam:', error);
        }
        
        // Return lege string als niks gevonden
        var emptyString = "";
        var bufferSize = lengthBytesUTF8(emptyString) + 1;
        var buffer = _malloc(bufferSize);
        stringToUTF8(emptyString, buffer, bufferSize);
        return buffer;
    }
};

// Registreer de functies
mergeInto(LibraryManager.library, TelegramParams);