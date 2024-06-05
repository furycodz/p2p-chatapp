export function sendNotification(message) {
    if('Notification' in window && Notification.permission === 'granted'){
        new Notification('P2P ChatApp', {
            body: message,
            icon: '/logo.png'
        })
    }
}

export function requestPermission(){
    if('Notification' in window){
        Notification.requestPermission()
    }
}