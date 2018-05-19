## 微博移动端接口

### 登录
登录接口需要先下载 [chromedriver](http://chromedriver.storage.googleapis.com/index.html) 并设置环境变量
```
import mweiboApi from 'mweibo-api';
const cookies = await mweiboApi.login('username', 'password');
```

### 点赞
```
import mweiboApi from 'mweibo-api';
const cookies = await mweiboApi.like('weiboId', 'cookie');
```
注意此处 cooike 为字符串

### 评论
```
import mweiboApi from 'mweibo-api';
const cookies = await mweiboApi.comment('weiboId', 'cookie', 'comment');
```
注意此处 cooike 为字符串