import fetch from 'node-fetch';
import * as httpsProxyAgent from 'https-proxy-agent';
import { URLSearchParams } from 'url';
import { getStatuspageSt } from './helper';

const comment = async (weiboId, cookie, comment, proxy?) => {
    const st = await getStatuspageSt(weiboId, cookie);
    
    const params: any = new URLSearchParams();
    params.append('id', weiboId);
    params.append('mid', weiboId);
    params.append('st', st);
    params.append('content', comment);
    const opts: any = {
        method: 'POST',
        body: params,
        headers: {
            cookie,
            Referer: 'https://m.weibo.cn/',
        },
        timeout: 5000,
    };
    if (proxy) {
        const option: any = {
            host: proxy.host,
            port: proxy.port,
        };
        if (proxy.username) {
            const toEncodeString = `${proxy.username}:${proxy.password}`;
            const base64Str = (new Buffer(toEncodeString)).toString('base64');
            option.headers = {
                'Proxy-Authorization': `Basic ${base64Str}`
            };
        }
        opts.agent = new httpsProxyAgent(option);
    }
    const resp = await fetch('https://m.weibo.cn/api/comments/create', opts)
    let result;
    if (resp.status !== 200) {
        result = await resp.text;
    } else {
        result = await resp.json();
    }
    return result;
};

export default comment;
