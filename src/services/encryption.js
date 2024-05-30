const algorithName = 'RSA-OAEP'

const pemEncode = (buffer) => {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    const base64 = window.btoa(binary);
    const lines = base64.match(/.{1,64}/g).join('\n');
    return lines;

};

export async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: algorithName,
        hash: 'SHA-256',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      },
      true,
      ['encrypt', 'decrypt']
    )
    const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);


    return [pemEncode(publicKey), pemEncode(privateKey)]
}

export async function encryptMessage(publicKey, message){
    const pKey = await importPublicKey(publicKey)
    const encodedText = new TextEncoder().encode(message)
    const encryptedData = await crypto.subtle.encrypt(
      algorithName,
      pKey,
      encodedText
    )

    return encryptedData
}
export async function decryptMessage(privateKey, encryptedMessage){
    const pKey = await importPublicKey(privateKey)
    const decryptedArrayBuffer = await crypto.subtle.decrypt(
        algorithName,
        pKey,
        encryptedMessage
      )
  
      const decryptedString = new TextDecoder().decode(decryptedArrayBuffer)
  
      return decryptedString
}

function pemToArrayBuffer(pem) {
    // Remove the PEM header and footer
    
    const binaryString = atob(pem);
    // Convert binary string to array buffer
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Function to import the public key
async function importPublicKey(pemKey) {
    const binaryDer = pemToArrayBuffer(pemKey);
    return crypto.subtle.importKey(
        'spki',
        binaryDer,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256'
        },
        true,
        ['encrypt']
    );
}


