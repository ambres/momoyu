import { Select } from 'antd';

const { Option } = Select;

/**
 * 枚举字段管理
 * @param {*} name 字段名称，非必填
 * @param {*} enums
 */
function getEnumManager(name, enums) {
  const labels = enums.map((item) => item.label);
  const values = enums.map((item) => item.value);
  return {
    name,
    labels,
    values,
    enums,
    getValueByLabel(label) {
      return values[labels.indexOf(label)];
    },
    getLabelByValue(value) {
      return labels[values.indexOf(value)];
    },
    getItemByValueOrLabel(valueOrLabel) {
      let index = values.indexOf(valueOrLabel);
      if (index < 0) {
        index = labels.indexOf(valueOrLabel);
      }
      return enums[index];
    },
  };
}

function enumToOption(enums) {
  const opt = [];
  Object.keys(enums).forEach((k) => {
    opt.push(<Option key={k}>{enums[k]}</Option>);
  });
  return opt;
}

function enumToArr(enums) {
  const opt = [];
  Object.keys(enums).forEach((k) => {
    opt.push({ label: enums[k], value: k });
  });
  return opt;
}

function arrToEnum(arr) {
  const obj = {};
  arr.forEach((v) => {
    obj[v.value] = v.label;
  });
  return obj;
}

export { getEnumManager, enumToOption, enumToArr, arrToEnum };
