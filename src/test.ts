import { getHomepageSt, getStatuspageSt } from './helper';
import like from './like';
import comment from './comment';
import login from './login';

const main = async () => {
    // const result = await comment('4241374746588848', '_T_WM=cc6170243eb58234605d847d6a88c07b; ALF=1529290585; SCF=AgrxEJPnAfs873cuLCDoyHgRKR2tACJjEGu_4xWEru0JVfFBkDu9-NRAUs1w1xNyIc4MG_40MmxaYUclvaJ4Nus.; SUB=_2A253--IJDeRhGeRK4lYY9ifIyziIHXVVB45BrDV6PUNbktANLVqkkW1NU0zLvxs3kL4zWT3xzbFgCW5hS06-ub41; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WWZLMkCOmJSA7yHXzlDajBU5JpX5KMhUgL.FozX1KB4So.XehB2dJLoIEjLxKqL1hnL1K2LxK-L12qLB-2LxKqL1KnLB-qLxKBLBonLB-829gif9cHE; SUHB=0OMV3wQOqD8AkL; SSOLoginState=1526698586; MLOGIN=1; M_WEIBOCN_PARAMS=uicode%3D20000174%26featurecode%3D20000320%26fid%3Dhotword', '试一下');
    // console.log('result: ', result);
    const cookies = await login('15125550764', 'lczrci287');
    console.log('cookies: ', cookies);
}

main();