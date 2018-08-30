import * as _ from 'lodash';
import fetch from 'node-fetch';

const linePoints = {
    '12': [80, 30],
    '13': [30, 80],
    '14': [60, 60],
    '23': [100, 60],
    '24': [130, 80],
    '34': [80, 130]
};

const getColorInt = (im, x, y) => {
    const res = im.get(x, y, 0);
    return res;
}

const getLineDirection = (line, im) => {
    const points = [];
    if (line == '12') {
        for (let x = 76; x < 84; x++) {
            points.push([x, 27])
        }
    } else if (line == '13') {
        for (let y = 76; y < 84; y++) {
            points.push([27, y])
        }
    } else if (line == '24') {
        for (let y = 76; y < 84; y++) {
            points.push([133, y])
        }
    } else if (line == '34') {
        for (let x = 76; x < 84; x++) {
            points.push([x, 133])
        }
    }
        
    const colorPoints = []
    for (const p of points) {
        const color = getColorInt(im, p[0], p[1]);
        if (color < 253) {
            colorPoints.push(255 - color)
        }
    }
    let smallest = 255;
    for (const color of colorPoints) {
        if (color < smallest) {
            smallest = color
        }
    }
    const fixedColors = []
    for (const color of colorPoints) {
        const fixedColor = color - smallest
        if (fixedColor > 0) {
            fixedColors.push(fixedColor);
        }
    }
    let largest = 0
    let largestIndex = 0
    for (let idx=0; idx < fixedColors.length; idx++) {
        const color = fixedColors[idx];
        if (color > largest) {
            largest = color
            largestIndex = idx
        }
    }

    let beforeCount = 0
    for (const color of fixedColors) {
        if (color < largest) {
            beforeCount = beforeCount + 1
        } else {
            break;
        }
    }

    let afterCount = 0
    for (const color of _.reverse(fixedColors)) {
        if (color < largest) {
            afterCount = afterCount + 1
        } else {
            break
        }
    }
    if (beforeCount > afterCount) {
        return _.join(_.reverse(_.split(line, '')), '')
    } else {
        return line
    }
}

export const getTtype = (im) => {

    const lines = []
    for (const line of _.keys(linePoints)) {
        const lp = linePoints[line]
        if (getColorInt(im, lp[0], lp[1]) <= 230) {
            lines.push(line);
        }
    }
    let directedLine = ''
    const usedLines = []
    for (const line of lines) {
        if (_.indexOf(['12', '13', '24', '34'], line) >= 0) {
            usedLines.push(line)
            directedLine = getLineDirection(line, im)
            break
        }
    }
    if (directedLine == '') {
        return ''
    }
    let llist = _.split(directedLine, '');
    for (;;) {
        const firstPoint = llist[0]
        let prePoint = ''
        for (const line of lines) {
            if (_.indexOf(usedLines, line) >= 0) {
                continue
            }
            const lineList = _.split(line, '');
            if (lineList[0] == firstPoint) {
                prePoint = lineList[1]
                usedLines.push(line)
                break
            } else if (lineList[1] == firstPoint) {
                prePoint = lineList[0]
                usedLines.push(line)
                break
            }
        }
        if (prePoint == '') {
            break
        }
        llist = _.concat([prePoint], llist);
    }

    for (;;) {
        const lastPoint = llist[llist.length - 1]
        let sufPoint = ''
        for (const line of lines) {
            if (_.indexOf(usedLines, line) >= 0) {
                continue
            }
            const lineList = _.split(line, '');
            if (lineList[0] == lastPoint) {
                sufPoint = lineList[1]
                usedLines.push(line)
                break
            } else if (lineList[1] == lastPoint) {
                sufPoint = lineList[0]
                usedLines.push(line)
                break
            }
        }
        if (sufPoint == '') {
            break
        }
        llist.push(sufPoint)
    }
    const ttype = _.join(llist, '');
    return ttype;
}

export const draw = (driver, ttype) => {

};

export const move = (driver, from, to) => {

}

export const getHomepageSt = async (cookie) => {
    const url = 'https://m.weibo.cn'
    const resp = await fetch(url, {
        headers: {
            cookie,
        }
    });
    const html = await resp.text();
    if (typeof html === 'string') {
        let substr = html.substring(html.indexOf('"st"') + 4);
        substr = substr.substring(substr.indexOf('"') + 1);
        substr = substr.substr(0, substr.indexOf('"'));
        return substr;
    } else {
        return null;
    }
}

export const getStatuspageSt = async (weiboId, cookie) => {
    const url = 'https://m.weibo.cn/status/' + weiboId;
    const resp = await fetch(url, {
        headers: {
            cookie,
        }
    });
    const html = await resp.text();
    if (typeof html === 'string') {
        let substr = html.substring(html.indexOf('st:'));
        substr = substr.substring(substr.indexOf("'") + 1);
        substr = substr.substr(0, substr.indexOf("'"));
        return substr;
    } else {
        return null;
    }
}
