import * as _ from 'lodash';
import * as webdriver from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as webdriverProxy from 'selenium-webdriver/proxy';
import * as images from 'images';
import * as getPixels from 'get-pixels';
import { getTtype } from './helper';

const { until, By } = webdriver;
const login = async (username: string, password: string, proxy?: any) => {
    let driver;
    let cookie;
    try {
        const chromeOptions = new chrome.Options().windowSize({
            width: 1000,
            height: 600
        }).headless();
        driver = new webdriver.Builder()
            .forBrowser('chrome')
            .setChromeOptions(chromeOptions);
        if (proxy) {
            let proxyString = '';
            if (proxy.username) {
                proxyString = `${proxy.username}:${proxy.password}@`;
            }
            proxyString += `${proxy.ip}:${proxy.port}`;
            driver = driver.setProxy(webdriverProxy.manual({http: proxyString}));
        }
        driver = driver.build();
        await driver.get('https://passport.weibo.cn/signin/login?entry=mweibo&r=https://weibo.cn/')
        await new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 5000);
        })
        console.log('loginName Located')
        const name = await driver.findElement(By.id('loginName'));
        const psw = await driver.findElement(By.id('loginPassword'));
        const login = await driver.findElement(By.id('loginAction'));
        await name.sendKeys(username);
        await psw.sendKeys(password);
        await login.click();
        console.log('click')
        await new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 3500);
        })
        const shouldVerify = true;
        const curUrl = await driver.getCurrentUrl();
        if (_.startsWith(curUrl, 'https://weibo.cn/')) {
            cookie = await driver.manage().getCookies();
        } else {
            const box = await driver.findElement(By.id('patternCaptchaHolder'));
            // const { width, height } = await box.getSize();
            // const { x, y } = await box.getLocation();
            const { width, height, x, y } = await box.getRect();
            const imgBase64 = await driver.takeScreenshot();
            const imgBuffer = new Buffer(imgBase64, 'base64');
            const im = images(imgBuffer);
            im.resize(im.width() / 2);
            const cutted = images(im, x + 50, y + 140, 160, 160);
            const pl = cutted.encode('png');
            const pixels = await new Promise((resolve, reject) => {
                getPixels(pl, 'image/png', (getPixelsError, pixels) => {
                    if (getPixelsError) {
                        reject(getPixelsError);
                    } else {
                        resolve(pixels);
                    }
                })
            })
            const ttype = getTtype(pixels);
            const points = [
                [x + 50 + 30, y + 140 + 30],
                [x + 50 + 130, y + 140 + 30],
                [x + 50 + 30, y + 140 + 130],
                [x + 50 + 130, y + 140 + 130],
            ]
            if (ttype.length === 4) {
                const actions = driver.actions({bridge: true});
                // const mouse = actions.mouse();
                let sortedPointIdxs = _.map(_.split(ttype, ''), (t: string) => parseInt(t, 10));
                let lastPoint;
                for (const idx of sortedPointIdxs) {
                    console.log('idx: ', idx - 1);
                    const point = points[idx - 1];
                    console.log('point: ', point);
                    if (!lastPoint) {
                        const xx = point[0] - (x + width/2);
                        const yy = point[1] - (y + height/2);
                        console.log(`x: ${xx}, y: ${yy}`);
                        actions.move({x: xx, y: yy, origin: box}).press();
                        lastPoint = point;
                    } else {
                        const xx = point[0] - lastPoint[0];
                        const yy = point[1] - lastPoint[1];
                        console.log(`x: ${xx}, y: ${yy}`);
                        for (let n=0; n<20; n++) {
                            actions.move({duration: 5000, x: xx/20, y: yy/20, origin: 'pointer'}).pause(100);
                        }
                        lastPoint = point;
                    }
                }
                actions.release();
                await actions.perform();
                await new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 10000);
                })
                cookie = await driver.manage().getCookies();
            }
        }
    } catch(e) {
        console.error(`login weibo ${username} error: ${_.toString(e)}`);
    }
    driver && await driver.quit();
    return cookie;
}

export default login;
