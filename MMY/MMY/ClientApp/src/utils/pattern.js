export default {
  // 手机号
  mobile: /^1[23456789]\d{9}$/,
  // 固定电话
  landline: /^\d{3,4}-\d{7,8}(-\d{3,4})?$/,
  // 判断字符由字母和数字、下划线、点号组成。且开头的只能是下划线和字母
  userName: /^([a-zA-z_]{1})([\w]*)$/g,
  // 判断输入的EMAIL格式是否正确
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  // 判断输入的字符是否为中文
  chinese: /^[\u0391-\uFFE5]+$/,
  // 判断输入的字符是否为双精度
  double: /^[-\\+]?\d+(\.\d+)?$/,
  // 是否正整数
  positiveNum: /^\d+$/,
  // 判断输入的字符是否为整数
  integer: /^[-+]?\d*$/,
  // 判断输入的字符是否为英文字母
  letter: /^[a-zA-Z]+$/,
  // 判断日期类型是否为YYYY-MM-DD格式的类型
  date: /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/,
  // 判断日期类型是否为hh:mm:ss格式的类型
  time: /^((20|21|22|23|[0-1]\d)\\:[0-5][0-9])(\\:[0-5][0-9])?$/,
  // 判断日期类型是否为YYYY-MM-DD hh:mm:ss格式的类型
  dateTime: /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,
};
