var app = {
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
    	document.addEventListener('online', this.onOnline, false);
        app.receivedEvent('deviceready');
    },
    
    onOnline: function() {
    	// FAZ BACKUP
    }
};
