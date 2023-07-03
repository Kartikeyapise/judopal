import { bufferToHex } from "ethereumjs-util";
import Constants from "../../../lib/Constants";
const ethUtil = require('ethereumjs-util');
import { recoverPersonalSignature } from 'eth-sig-util';
import {
    VERIFICATION_TYPE
} from "../../../lib/Types";
import { Helper } from "../../../lib/Helper";
import { QueryExecutor } from "../../../src/common/query-executor";
const axios = require('axios').default;

export class AuthenticationHelper{

    static verifySignedMessage(msg:string,signature:string,publicAddress:string, verificationType?:string){

        if(verificationType != VERIFICATION_TYPE.NATIVE){
            msg = `I am signing my one-time nonce: ${msg}`;
        }
        
        // console.log(msg);
        // console.log(signature);
        // console.log(publicAddress);
        // msg = msg.tohex();
        // const msgBuffer = ethUtil.toBuffer(msg);

        // const msgHash = ethUtil.hashPersonalMessage(msgBuffer);

        // const signatureBuffer = ethUtil.toBuffer(signature);
        // const signatureParams = ethUtil.fromRpcSig(signatureBuffer);

        // const publicKey = ethUtil.ecrecover(
        // msgHash,
        // signatureParams.v,
        // signatureParams.r,
        // signatureParams.s
        // );
        // const addressBuffer = ethUtil.publicToAddress(publicKey);
        // const address = ethUtil.bufferToHex(addressBuffer);

        const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
        const address = recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });

        return address.toLowerCase() === publicAddress.toLowerCase();
    }
}