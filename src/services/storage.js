// const getMessages = () => {
//     socketRef.current.emit('get messages', roomID, (messages) => {
//         console.log('Messages:', messages);

       
//     });
    
// }
// const addMessages = (message) => {
//     socketRef.current.emit('store message', roomID, message);
//     console.log(gun)
// }

export function storeMessage(socketRef, roomID, message) {
    socketRef.current.emit('store message', roomID, message);
}

export function getMessages(socketRef, roomID) {
    socketRef.current.emit('get messages', roomID, (messages) => {
        console.log(messages)
    });
}


