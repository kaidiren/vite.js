const blake = require('blakejs/blake2b');
import { paramsMissing, paramsFormat } from "const/error";

export function checkParams(params, requiredP:Array<string> = [], validFunc:Array<{ name, func, msg? }> =[]) {
    if (!params) {
        return null;
    }

    let isHave = (name) => {
        return params.hasOwnProperty(name) && 
            typeof params[name] !== 'undefined' &&
            params[name] !== null
    }

    for (let i=0; i<requiredP.length; i++) {
        let name = requiredP[i];
        if ( !isHave(name) ) {
            return {
                code: paramsMissing.code,
                message: `${paramsMissing.message} ${name}.`
            }
        }
    }

    for (let i=0; i<validFunc.length; i++) {
        let { name, func, msg } = validFunc[i];
        if (!name || !func || !isHave(name)) {
            continue;
        }

        if ( !func(params[name]) ) {
            return {
                code: paramsFormat.code,
                message: `${paramsFormat.message} Illegal ${name}. ${msg || ''}`
            }
        }
    }

    return null;
}

export function getRawTokenid(tokenId: string) {
    let err = checkParams({ tokenId }, ['tokenId'], [{
        name: 'tokenId',
        func: (_t) => {
            return _t.indexOf('tti_') === 0 && _t.length === 28;
        }
    }]);

    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    return tokenId.slice(4, tokenId.length - 4);
}

export function getTokenIdFromRaw(rawTokenId: string) {
    let err = checkParams({ rawTokenId }, ['rawTokenId'], [{
        name: 'rawTokenId',
        func: (_t) => {
            return /^[0-9a-fA-F]+$/.test(_t) && _t.length === 20;
        }
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    let checkSum = blake.blake2bHex(Buffer.from(rawTokenId, 'hex'), null, 2);
    return `tti_${rawTokenId}${checkSum}`;
}

export function validNodeName(nodeName) {
    return /^[a-zA-Z0-9_\.]+(\s{1}[a-zA-Z0-9_\.]+)*$/g.test(nodeName) && nodeName.length <= 40;
}

export function validInteger(num) {
    return num && (/(^[1-9]\d*$)/g.test(num) || num === '0');
}
