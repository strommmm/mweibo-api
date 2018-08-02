import * as _ from 'lodash';
import like from './like';
import comment from './comment';
import login from './login';

const main = async () => {
    const proxy = {
        "host": "175.155.211.251",
        "port": "19390",
        "username": "wanghao",
        "password": "cp6ex4r5"
    }
    const cookies = await login('13476451252', 'aadask559', proxy);
    console.log('cookies: ', cookies);
    const cookie = _.join(_.map(cookies, (c: any) => `${c.name}=${c.value}`), '; ');
    const commentResult = await comment('4241374746588848', cookie, '试一下', proxy);
    console.log('commentResult: ', commentResult);
    const likeResult = await like('4241374746588848', cookie, proxy);
    console.log('likeResult: ', likeResult);
}

main();