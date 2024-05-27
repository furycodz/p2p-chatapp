// export async function encryptMessage(key, message) {
//     const encoder = new TextEncoder();
//     const encodedMessage = encoder.encode(message);
//     const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV
//     const ciphertext = await window.crypto.subtle.encrypt({
//         name: "AES-GCM",
//         iv: iv
//     }, key, encodedMessage);
//     return { iv, ciphertext };
// }


// export async function decryptMessage(key, iv, ciphertext) {
//     const decryptedMessage = await window.crypto.subtle.decrypt({
//         name: "AES-GCM",
//         iv: iv
//     }, key, ciphertext);
//     const decoder = new TextDecoder();
//     return decoder.decode(decryptedMessage);
// }

const pemEncode = (buffer) => {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    const base64 = window.btoa(binary);
    const lines = base64.match(/.{1,64}/g).join('\n');
    return lines;
    // return `-----BEGIN KEY-----\n${lines}\n-----END KEY-----`;
  };

export async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
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