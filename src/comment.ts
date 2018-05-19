import fetch from 'node-fetch';
import * as _ from 'lodash';
import { URLSearchParams } from 'url';
import { getStatuspageSt } from './helper';

const comment = async (weiboId, cookie, comment) => {
    const st = await getStatuspageSt(weiboId, cookie);
    
    const params: any = new URLSearchParams();
    params.append('id', weiboId);
    params.append('mid', weiboId);
    params.append('st', st);
    params.append('content', comment);
    const resp = await fetch('https://m.weibo.cn/api/comments/create', {
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

export default comment;
