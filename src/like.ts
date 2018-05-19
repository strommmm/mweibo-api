import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import * as _ from 'lodash';
import { getStatuspageSt } from './helper';

const like = async (weiboId, cookie) => {
    const st = await getStatuspageSt(weiboId, cookie);
    
    const params: any = new URLSearchParams();
    params.append('id', weiboId);
    params.append('st', st);
    params.append('attitude', 'heart');
    const resp = await fetch('https://m.weibo.cn/api/attitudes/create', {
        method: 'POST',
        body: params,
        headers: {
            cookie,
            Referer: 'https://m.weibo.cn/',
        }
    })
    const result = await resp.json();
    return result;
};

export default like;
