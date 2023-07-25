export const debounce = (fn, delay = 500) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  let timer = null;
  return (...arg) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.call(arg);
    }, delay);
  };
};
