import * as _ from 'lodash';
import like from './like';
import comment from './comment';
import login from './login';

const main = async () => {
    const cookies = await login('13476451252', 'aadask559', {
        username: 'wanghao',
        password: 'cp6ex4r5',
        ip: '47.106.187.170',
        port: '29475'
    });
    console.log('cookies: ', cookies);
    const cookie = _.join(_.map(cookies, (c: any) => `${c.name}=${c.value}`), '; ');
    const commentResult = await comment('4241374746588848', cookie, '试一下', {
        username: 'wanghao',
        password: 'cp6ex4r5',
        ip: '47.106.187.170',
        port: '29475'
    });
    console.log('commentResult: ', commentResult);
    const likeResult = await like('4241374746588848', cookie, {
        username: 'wanghao',
        password: 'cp6ex4r5',
        ip: '47.106.187.170',
        port: '29475'
    });
    console.log('likeResult: ', likeResult);
}

main();