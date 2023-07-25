import { parse } from 'querystring';
import { message } from 'antd';
import { useRequest } from 'umi';
// import config from '@/config';
import moment from 'moment';
import BMF from 'browser-md5-file';

const bmf = new BMF();

const reg = /(http|https):\/\/([\w.]+\/?)\S*/;
export const isUrl = (path) => reg.test(path);
export const getPageQuery = () => parse(window.location.href.split('?')[1]);


/**
 * 转换Cascader,去掉空的children
 * @param {*} obj
 * @returns
 */
export function convertCascader(obj) {
  const str = JSON.stringify(obj);
  const str2 = str.replace(/,"children":\[\]/g, '').replace(/,"children":null/g, '');
  return JSON.parse(str2);
}

/**
 * 时间戳转为多久之前
 * @param String timestamp 时间戳
 * @param String | Boolean format 如果为时间格式字符串，超出一定时间范围，返回固定的时间格式；
 * 如果为布尔值false，无论什么时间，都返回多久以前的格式
 */
export function timeFrom(intimestamp = null) {
  // 其他更多是格式化有如下:
  // yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合

  let timestamp = Date.parse(intimestamp);
  if (timestamp === null) timestamp = Number(new Date());
  timestamp = parseInt(timestamp, 10);
  // 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
  if (timestamp.toString().length === 10) timestamp *= 1000;
  let timer = new Date().getTime() - timestamp;
  timer = parseInt(timer / 1000, 10);
  // 如果小于5分钟,则返回"刚刚",其他以此类推
  let tips = '';
  switch (true) {
    case timer < 300:
      tips = '刚刚';
      break;
    case timer >= 300 && timer < 3600:
      tips = `${parseInt(timer / 60, 10)}分钟前`;
      break;
    case timer >= 3600 && timer < 86400:
      tips = `${parseInt(timer / 3600, 10)}小时前`;
      break;
    case timer >= 86400 && timer < 2592000:
      tips = `${parseInt(timer / 86400, 10)}天前`;
      break;
    default:
      if (timer >= 2592000 && timer < 365 * 86400) {
        tips = `${parseInt(timer / (86400 * 30), 10)}个月前`;
      } else {
        tips = `${parseInt(timer / (86400 * 365), 10)}年前`;
      }
  }
  return tips;
}
/**
 * 提交处理
 * @param {*} func
 * @param {*} fields
 */
export const submitHandle = async (func, fields) => {
  const hide = message.loading('正在处理.');
  try {
    const res = await func(fields);
    hide();
    if (res.success) {
      message.success('处理成功.');
      return true;
    }
    message.error(res.message);
    return false;
  } catch (error) {
    hide();
    message.error('处理失败,请重试！');
    return false;
  }
};

/**
 * Request请求
 * @param {*} request 请求
 * @param {*} onSuccess 成功的回调函数
 * @param {*} config useRequest 参数
 * @returns {*} { run,loading }
 * @copyright https://ahooks.js.org/zh-CN/hooks/async/#%E5%9F%BA%E7%A1%80-api
 * @example const {run,loading} = useRequestHandle(add);
 */
export const useRequestHandle = (request, onSuccess, defaultConfig = {}) => {
  return useRequest(request, {
    manual: true,
    formatResult: (response) => response,
    onSuccess: (res) => {
      if (res === null) {
        return;
      }
      if (res.success) {
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(res.data);
        } else {
          message.success(res.message);
        }
      } else {
        message.error(res.message);
      }
    },
    onError: (error) => {
      message.error(error.message);
    },
    // throwOnError: true,
    ...defaultConfig,
  });
};

/**
 * 深度拷贝
 * @param {*} obj
 */
export const deepClone = (obj) => {
  function isObject(o) {
    return (typeof o === 'object' || typeof o === 'function') && o !== null;
  }

  if (!isObject(obj)) {
    throw new Error('非对象');
  }
  const isArray = Array.isArray(obj);
  const newObj = isArray ? [...obj] : { ...obj };
  Reflect.ownKeys(newObj).forEach((key) => {
    newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key];
  });
  return newObj;
};

/**
 * 获取Sorter
 * @param {*} sorter
 */
export const getSorter = (sorter) => {
  let str = '';
  if (Object.keys(sorter).length > 0) {
    const key = Object.keys(sorter)[0];
    const value = sorter[key];

    str = `${key.charAt(0).toUpperCase() + key.slice(1)} ${value === 'descend' ? 'DESC' : 'ASC'}`;
  }

  return str === '' ? {} : { sorter: str };
};

/**
 * 下载文件
 * @param {*} file 文件信息
 */
export const downloadFile = (file) => {
  const params = `?FileName=${file.fileName}&FileType=${file.fileType}&FileToken=${file.fileToken}`;
  window.location.href = `/api/File/DownloadTempFile${params}`;
};

/**
 * 预览HTML
 * @param {htmlText}} html
 */
export const previewHTML = (html) => {
  if (window.previewWindow) {
    window.previewWindow.close();
  }
  const tempText = `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${html}</div>
        </body>
      </html>
    `;
  window.previewWindow = window.open();
  window.previewWindow.document.write(tempText);
  window.previewWindow.document.close();
};

/**
 * 发送通知
 * @param {*} title
 * @param {*} options
 * @param {*} instance
 */
export const sendNotify = (title, options, instance) => {
  const opts = { icon: 'https://static.dianmi-north.cn/favicon.ico', ...(options || {}) };
  // 先检查浏览器是否支持
  if (!('Notification' in window)) {
    // This browser does not support desktop notification
  }
  // 检查用户是否同意接受通知
  else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    const notification = new Notification(title, opts);
    if (instance && typeof instance === 'function') {
      instance(notification);
    }
  }
  // 否则我们需要向用户获取权限
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      // 如果用户接受权限，我们就可以发起一条消息
      if (permission === 'granted') {
        const notification = new Notification(title, opts);
        if (instance && typeof instance === 'function') {
          instance(notification);
        }
      }
    });
  }
};

/**
 * 读取随机字符串
 * @param {长度} length
 * @returns
 */
export const randomString = (length) => {
  const len = length || 32;
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i += 1) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};
export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;
    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  const year = now.getFullYear();

  if (type === 'month') {
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();
    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

/**
 * 获取文件Md5
 * @param {*} file 文件对象
 * @returns  Md5值
 */
export function getFileMd5(file) {
  return new Promise((resolve, reject) => {
    bmf.md5(file, (err, md5) => {
      if (err) {
        reject(err);
      } else {
        resolve(md5);
      }
    });
  });
}
