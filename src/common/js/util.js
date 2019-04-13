import cookies from 'browser-cookies';
import { message, Modal } from 'antd';
import moment from 'moment';
import { PIC_PREFIX, DATE_FORMAT, MONTH_FORMAT, DATETIME_FORMAT, TIME_FORMAT } from './config';
import './lib/BigDecimal';

/**
 * 保存用户登录信息
 * @param userId
 * @param token
 */
export function setUser({ userId, token }) {
  cookies.set('userId', userId);
  cookies.set('token', token);
}

// 删除用户登录信息
export function clearUser() {
  cookies.erase('userId');
  cookies.erase('token');
  cookies.erase('roleCode');
  cookies.erase('loginKind');
  cookies.erase('userName');
  cookies.erase('organizationCode');
  cookies.erase('projectName');
}

// 获取用户编号
export function getUserId() {
  return cookies.get('userId');
}

// 获取用户编号
export function getUserName() {
  return cookies.get('userName');
}

// 获取用户类型
export function getUserKind() {
  return cookies.get('loginKind');
}

// 用户项目code
export function getOrganizationCode() {
  return cookies.get('organizationCode');
}

// 用户项目name
export function getProjectName() {
  return cookies.get('projectName');
}

// 设置用户角色信息
export function setRoleInfo({ roleCode, type, loginName, organizationCode, projectName }) {
  cookies.set('roleCode', roleCode);
  cookies.set('loginKind', type);
  cookies.set('userName', loginName);
  cookies.set('organizationCode', organizationCode);
  cookies.set('projectName', projectName);
}

// 获取用户角色编号
export function getRoleCode() {
  return cookies.get('roleCode');
}

/**
 * 通过正则表达式获取URL传递参数
 * @param name
 * @returns
 */
export function getQueryString(name, search) {
  search = search || window.location.search;
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return '';
}

/**
 * 获取正确的url，使其以'/'开头
 * @param url
 */
export function getRealUrl(url) {
  if (url && url !== '#') {
    url = /^\//.test(url) ? url : '/' + url;
  }
  return url;
}

/**
 * 日期格式转化
 * @param date
 * @param fmt
 */
export function formatDate(date, fmt = 'yyyy-MM-dd') {
  if (isUndefined(date)) {
    return '-';
  }
  date = new Date(date);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

/**
 * 获取两位格式化数字
 * @param str
 */
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

/**
 * 日期格式转化 yyyy-MM-dd
 * @param date
 * @param format
 */
export function dateFormat(date) {
  return formatDate(date, 'yyyy-MM-dd');
}

/**
 * 日期格式转化 yyyy-MM
 * @param date
 * @param format
 */
export function monthFormat(date) {
  date = formatDate(date, 'yyyy-MM-dd');
  let arr = date.split('-');
  arr.length = 2;
  date = arr.join('-');
  return date;
}

/**
 * 日期格式转化 yyyy-MM-dd hh:mm:ss
 * @param date
 * @param format
 */
export function dateTimeFormat(date) {
  return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
}

/**
 * 金额格式转化
 * @param money
 * @param format
 */
export function moneyFormat(money, format) {
  var flag = true;
  if (isNaN(money)) {
    return '-';
  }
  if (money < 0) {
    money = -1 * money;
    flag = false;
  }
  if (isUndefined(format) || typeof format === 'object') {
    format = 2;
  }
  // 钱除以1000并保留两位小数
  money = (money / 1000).toString();
  var reg = new RegExp('(\\.\\d{' + format + '})\\d+', 'ig');
  money = money.replace(reg, '$1');
  money = parseFloat(money).toFixed(format);
  // 千分位转化
  var re = /\d{1,3}(?=(\d{3})+$)/g;
  money = money.replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => (s1.replace(re, '$&,') + s2));
  if (!flag) {
    money = '-' + money;
  }
  return money;
}

/**
 * 把格式化金额转成接口需要的
 * @param money
 * @param rate
 */
export function moneyParse(money, rate = 1000) {
  return ((+('' + money).replace(/,/g, '')) * rate).toFixed(0);
}

/**
 * 大数相乘
 * @param a
 * @param b
 */
export function multiply(a, b) {
  if (a && b) {
    let _a = new BigDecimal(a);
    var _b = new BigDecimal(b);
    return _a.multiply(_b).toString();
  }
  return '';
}

/**
 * 格式化文件地址
 * @param urls
 * @param suffix
 */
export function formatFile(urls, suffix = '') {
  if (!urls) {
    return '';
  }
  let url = urls.split(/\|\|/)[0];
  if (!/^http|^data:image/i.test(url)) {
    let index = url.indexOf('?imageMogr2');
    if (index !== -1) {
      suffix = url.substr(index);
      url = url.substr(0, index);
    }
    url = PIC_PREFIX + encodeURIComponent(url) + suffix;
  }
  return url;
}

/**
 * 格式化图片地址
 * @param imgs
 * @param suffix
 */
export function formatImg(imgs, suffix = '?imageMogr2/auto-orient') {
  return formatFile(imgs, suffix);
}

export function isUndefined(value) {
  return value === undefined || value === null || value === '';
}

export function tempString(str, data) {
  return str.replace(/\{\{(\w+)\.DATA\}\}/gi, function (matchs) {
    var returns = data[matchs.replace(/\{\{(\w+)\.DATA\}\}/, '$1')];
    return isUndefined(returns) ? '' : returns;
  });
};

export function showMsg(msg, type = 'success', time = 2) {
  message[type](msg, time);
}

export function showWarnMsg(msg, time = 2) {
  showMsg(msg, 'warning', time);
}

export function showSucMsg(msg, time = 2) {
  showMsg(msg, 'success', time);
}

export function showErrMsg(msg, time = 2) {
  showMsg(msg, 'error', time);
}

export function showConfirm({ okType = 'primary', onOk, onCancel }) {
  Modal.confirm({
    okType,
    title: '您确定要删除该条记录吗?',
    content: '删除记录后无法还原',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      onOk && onOk();
    },
    onCancel() {
      onCancel && onCancel();
    }
  });
}

export function showDelConfirm({ onOk, onCancel }) {
  showConfirm({ okType: 'danger', onOk, onCancel });
}

export function DeleteCookie(name) {
  var date = new Date();
  date.setTime(date.getTime() - 10000); // 删除一个cookie，就是将其过期时间设定为一个过去的时间
  document.cookie = name + '=删除' + '; expires=' + date.toUTCString();
  // document.cookie = " " + name + "=删除" + "; expires=" + date.toGMTString();
}
// 空函数
export const noop = () => {};

// 获取详情页面控件校验规则
export const getRules = (item) => {
  let rules = [];
  if (item.required && !item.hidden) {
    rules.push({
      required: true,
      message: '必填字段'
    });
  }
  if (item.email) {
    rules.push({
      type: 'email',
      message: '请输入正确格式的电子邮件'
    });
  }
  if (item.mobile) {
    rules.push({
      pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
      message: '手机格式不对'
    });
  }
  if (item['Z+']) {
    rules.push({
      pattern: /^[1-9]\d*$/,
      message: '请输入正整数'
    });
  }
  if (item.number) {
    rules.push({
      pattern: /^-?\d+(\.\d+)?$/,
      message: '请输入合法的数字'
    });
  }
  if (item.positive) {
    rules.push({
      pattern: /^\d+(\.\d+)?$/,
      message: '请输入正数'
    });
  }
  if (item.integer) {
    rules.push({
      pattern: /^-?\d+$/,
      message: '请输入整数'
    });
  }
  if (item.natural) {
    rules.push({
      pattern: /^\d+$/,
      message: '请输入自然数'
    });
  }
  if (item.idCard) {
    rules.push({
      pattern: /^([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x))$/,
      message: '请输入合法的身份证号'
    });
  }
  if (item.bankCard) {
    rules.push({
      pattern: /^([1-9]{1})(\d{13,19})$/,
      message: '请输入合法的银行卡号'
    });
  }
  if (item.amount) {
    rules.push({
      pattern: /(^[1-9](,\d{3}|[0-9])*(\.\d{1,2})?$)|([0])/,
      message: '金额必须>=0，且小数点后最多2位'
    });
  }

  if (item.min) {
    rules.push({
      validator: (rule, value, callback) => {
        let reg = /^-?\d+(\.\d+)?$/.test(value);
        if (reg && value && Number(value) < Number(item.min)) {
          let error = `请输入一个最小为${item.min}的值`;
          callback(error);
        } else {
          callback();
        }
      }
    });
  }

  if (item.max) {
    rules.push({
      validator: (rule, value, callback) => {
        let reg = /^-?\d+(\.\d+)?$/.test(value);
        if (reg && value && Number(value) > Number(item.max)) {
          let error = `请输入一个最大为${item.max}的值`;
          callback(error);
        } else {
          callback();
        }
      }
    });
  }

  if (item.maxlength) {
    rules.push({
      min: 1,
      max: item.maxlength,
      message: `请输入一个长度最多是${item.maxlength}的字符串`
    });
  }
  return rules;
};

// 获取修改、详情页每个输入框的真实值
export const getRealValue = ({ pageData, field, type, _keys, value, rangedate,
  multiple, formatter, amount, amountRate, cFields, readonly, listCode, selectData }) => {
  let result;
  pageData = isUndefined(pageData) ? {} : pageData;
  if (pageData) {
    result = pageData[field];
    try {
      if (_keys) {
        result = getValFromKeys(_keys, pageData, type);
      } else if (!isUndefined(value) && isUndefined(result)) {
        result = value;
      }
      if (type === 'citySelect') {
        result = getCityVal(_keys, cFields, result, pageData);
      } else if (type === 'date' || type === 'datetime' || type === 'month') {
        result = getRealDateVal(pageData, type, result, _keys, readonly, rangedate);
      } else if (type === 'checkbox') {
        result = getRealCheckboxVal(result);
      } else if (multiple) {
        result = result ? result.split(',') : [];
      } else if (type === 'o2m') {
        if (listCode) {
          result = isUndefined(result) ? selectData[field] : result;
        }
        result = result || [];
      } else if (type === 'time') {
        result = getRealTimeVal(result, readonly);
      }
      if (formatter) {
        result = formatter(result, pageData);
      } else if (amount) {
        result = isUndefined(result) ? '' : moneyFormat(result, amountRate);
      }
    } catch (e) {}
  }
  return isUndefined(result) ? '' : result;
};

// 通过_keys获取真实值
function getValFromKeys(keys, pageData, type) {
  let _value = {...pageData};
  let emptyObj = {};
  keys.forEach(key => {
    _value = isUndefined(_value[key]) ? emptyObj : _value[key];
  });
  return _value === emptyObj
    ? (type === 'checkbox' || type === 'citySelect' || type === 'o2m')
      ? [] : ''
    : _value;
}

// 获取城市的真实值
function getCityVal(keys, cFields, result, pageData) {
    let cData = keys && result ? result : pageData;
    let prov = cData[cFields[0]];
    if (prov) {
        let city = cData[cFields[1]] ? cData[cFields[1]] : '全部';
        let area = cData[cFields[2]] ? cData[cFields[2]] : '全部';
        result = [prov, city, area];
    } else {
        result = [];
    }
    return result;
}

// 获取日期真实值
function getRealDateVal(pageData, type, result, keys, readonly, rangedate) {
    let format = type === 'date' ? DATE_FORMAT : type === 'month' ? MONTH_FORMAT : DATETIME_FORMAT;
    let fn = type === 'date' ? dateFormat : type === 'month' ? monthFormat : dateTimeFormat;
    if (readonly) {
        return rangedate
            ? getRangeDateVal(rangedate, keys, result, format, fn, pageData, readonly)
            : result ? fn(result, format) : null;
    }
    return rangedate
        ? getRangeDateVal(rangedate, keys, result, format, fn, pageData)
        : result ? moment(dateTimeFormat(result), format) : null;
}

// 获取范围日期真实值
function getRangeDateVal(rangedate, keys, result, format, fn, pageData, readonly) {
    let dates = keys && result ? result : pageData;
    let start = dates[rangedate[0]];
    let end = dates[rangedate[1]];
    if (readonly) {
      return start ? fn(start, format) + '~' + fn(end, format) : null;
    }
    return start ? [moment(fn(start), format), moment(fn(end), format)] : null;
}

// 获取时间真实值
function getRealTimeVal(result, readonly) {
  if (readonly) {
    return result || '';
  }
  return result ? moment(result, TIME_FORMAT) : null;
}

// 获取checkbox的真实值
function getRealCheckboxVal(result) {
    return result ? result.split(',') : [];
}

// 供导入时判断数据字典是否正确使用
// @return {Boolean} iserror
export function findAndchangeInfo(list, item, key, i) {
  let info = list.find(c => c.dvalue === item[key]);
  if (!info) {
    showWarnMsg(`导入的数据里第${i + 1}行的${item[key]}无法识别,请检查数据是否正确`);
    return true;
  }
  item[key] = info.dkey;
  return false;
}
