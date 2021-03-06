import WIF from "wif";
import { eddsa } from "elliptic";
import base58 from "bs58";

function ab2hexstring(arr: ArrayBuffer | ArrayLike<number>): string {
    if (typeof arr !== "object") {
        throw new Error(`ab2hexstring expects an array.Input was ${arr}`);
    }
    let result = "";
    const intArray = new Uint8Array(arr);
    for (const i of intArray) {
        let str = i.toString(16);
        str = str.length === 0 ? "00" : str.length === 1 ? "0" + str : str;
        result += str;
    }
    return result;
}

export function getPrivateKeyFromWif(wif: string): string {
    return ab2hexstring(WIF.decode(wif, 128).privateKey);
}

export function getAddressFromWif(wif: string): string {
    const curve = new eddsa('ed25519')

    const privateKey = getPrivateKeyFromWif(wif);
    const privateKeyBuffer = Buffer.from(privateKey, "hex");    
    const publicKey = curve.keyFromSecret(privateKeyBuffer).getPublic("hex");
    var addressHex = Buffer.from("0100"+publicKey, "hex");
    
    return 'P'+base58.encode(addressHex);
}