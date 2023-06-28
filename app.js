const express = require("express")
const crypto = require("crypto")

const app = express()

// Third-party server's private key
const thirdPartyPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA8BxmiItetM08GA3mOdTMeA5Z0pzCO5ZFPDrgzzy0gwBJC02E
Xcvetx3WbG1O1/yIZuAHXOeYoTOGXbRiTCzukXvDLhhs3vPFhgFFKuVrOEgbaB8m
+m/bl1VuQNS/9XBTGJa3nYyqTZ+C7ermcKLnjUiHyuivMRSUlIKhmZeRz6JQ3Fw2
/LaCnyjKt3ofqacsT8v9JdPjCQc8dB0plHoB0QoHS38aqLwlbrQ2363mJO662vhz
E4zWn9UsEjDg4mkN6uc42qM9LfwTJF2u+OKwDU4DM/WxRaDxZxxA4oN+Kjy+MW0b
esPH7p3hrexE7QFFi/qNM50RQHOnHfRz5URZLwIDAQABAoIBAB2PcYltQcCX5Ru/
rPtWWRc4CmjlHFMtAeMTYJVC5PpHxmEE2b9DwmyK2NjKcELOTUCqY12rCYhhs9tv
bLacxYDVsBwfAlrvFKnrGB0wLLi7b9xWvCa9hKxR5oacFUczMpe8CROgELYJEEZt
fTyatvpsK9jtjTvz9lgo6O+O0HMI90droQKJlGNTqKC8nCeiU1QkA402CDM9e9SF
IdFWyMqeKUW/DR/rYe9qBw7jrGdBHdPkgKtzaNwnIH5pFt4FBJ4xVeCpNuxQAh2u
N0h8U/Bm/tIiDTex7s89BcEuE6hkl2+Wmc66YD7gQ5NYjPna8B0+L/y85i8GmD+r
KI60gYECgYEA9Urdd1H+lMjjXppkgp28F5HOHyC5DSXvAPmIsVkta73cv/Uw+yE8
c7HdikSxsY6eUfSA2EwNwFkgsuDC0yQb+jdrhzE10fOKNTcHk2RQQCP2IsMs8dXv
TS7Q3lKDevqP2D2CUt3VEBsm4tZ3HqO7cbAfGclGRNqMzjRsVM1Xc+8CgYEA+peh
3p5WBr9JjyE+c7z+ObEOeKY3dpCJCYbW0Jesw2G32moatzn6uQVG6piM8ZlX9WrE
PnXCk0VBpZi7RfFIWarauFXp78PCacb0dSkmaFukypCMhpCaSJTHei7/08SqsXek
5K7HjgU4idvSVoMQhhtDaKlgqHZKoFIOIzOPLsECgYEAiO80V2o0vwaut59lQO2h
lV7WPNZduBNXK6oiPy9ThfRGCfttTqStRMEktg3HTSIbDBF85EMA4kJfWLzUxl5A
KB1ML/qu2vgkTbTcy9GSY1wwChP/QTp3DxV1kMdrkvnR15vu5yfjy8v8l2G2uioZ
eEwj8JdGXSXMuUjWuTiw+40CgYEA5344XK0sj2MakwyE4upOeAEmezIhvnfbAF/+
Bgh34q5c53ppX6ZCBbXoQ0PVwEKGTQLqc0DaFK4/7LhhGEXDLoJ1NyC20XWoHYtb
vPfcsT8nxrEuAAmJXU+Dz02nq3vcq8D5JQCI/Ju6FTBq6Nx+4URCS2ddEYLlgaEL
yl0RAoECgYBUV77yE8LOfZKST1W0yC/3nj5vJHx3pS20cKvHwpsLLd6B+xr6hkR8
3nSpCAe/jAYTbVnO8yV+GbLtZ/MkCSUjtGLs9YvJGvUDQJHSa3K1sEmYvbGX+oTg
SVdxRAZuYgJfzLITEG6DW8/dmUa/Kp2+DEmt4v6RN4yeNXQ1aDF1Vg==
-----END RSA PRIVATE KEY-----`

// Encrypted key and IV received from the client
const encryptedKeyBase64 = 'dUoy4l7Vqf693ihJqb6RGgIqBJgAfB4J3iIf3lHutFjoa7bhtE5EP3Opl/DrSIWxV1Rho7Tz/a1jNi3IA0VV5ObIK844OW8F9iqzSMH9rOSR0Idx75gVzLlpnjVQWBueA0/yzso6Zcqt+wmTK4KpRCvkPL48vLzjii6HnZX+iKi2wpD786XC6rWeCYWyVCJ3vW/jPQo+8VNlu41BdOOzE+rC3G5Yq7tFAvZ2Dxdcg+5VFsZlK6C19mmteDStxf/3Y9S+8vOHeAZzBgjRL6JPVt/hbLrkIByZ2F4L1ko5FrLkTK8T/oi7f5iY/XwCHDkjFFN7XPluGeCETILvwCEQSQ=='; // Encrypted key in base64 format
const encryptedIVBase64 = '3JZDRxvpzyMAwGL+BPGnE1gUI/9BnqzaNrXZl2tMG6eNFJiHD0gjwrEsQ53rXAgxNSIzCbmnoO/IDe1j+0MV4hAlyPhXWhIQWDkg2i58wmzBFEV1FrlWzmVPznXjCP502Huk3GOQi8hws5HTP/oVuFxlLkpbWt/y/g1uwk8JpcQFUifMyrIikjh9uo2cMDjlXw1t+emPm7+i+cmiFSoulzjQZ8K4XXw4Nex7gSjVlmxXkJyuCozJdX3DaRCCtJNYVZHIVzRDKLPRYawtB82xqkuU+v/0skCFHAsod8YEFdNqXLUSTh12wf9zwu1qS3/Z/uegvmqRtIRQtrRp6dHT5Q=='; // Encrypted IV in base64 format

// Convert the encrypted key and IV from base64 strings
const encryptedKey = Buffer.from(encryptedKeyBase64, 'base64');
const encryptedIV = Buffer.from(encryptedIVBase64, 'base64');

// Decrypt the encrypted key and IV using the third-party server's private key
const decryptedKey = crypto.privateDecrypt({
    key: thirdPartyPrivateKey
  }, encryptedKey);
const decryptedIV = crypto.privateDecrypt({
    key: thirdPartyPrivateKey
  }, encryptedIV);

// console.log(`encryptionKey: ${Buffer.from(encryptionKey64, 'base64')}, ${decryptedKey}`)

// Decrypt the payload
function decryptPayload(encryptedPayload) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedKey, Buffer.from(encryptedPayload.iv, 'base64'));
    let decryptedData = decipher.update(encryptedPayload.data, 'base64', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  }

const receivedPayload = {
   data: "bLbq/cXzKSCLzigwtdZLs2HaMb6+78md/JS1JLZ3lKNVPH2s/gr3OkWWw+Xg1TWxkQ1FLWS3S8dCarqs2YWw5Q==", // Replace with the received encrypted data
   iv: decryptedIV, // Replace with the received IV
};

const decryptedPayload = decryptPayload(receivedPayload);
console.log('Decrypted Payload:', decryptedPayload);  

app.listen(2000,()=>{
    console.log(`server running`)
})