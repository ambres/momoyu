
/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access() {
  return {
    isHost() {
      return true;
    },
    isRoot() {
      return true;
    },
    canAdmin() {
      return true;
    },
    canOperation() {
      return true;
    },
    canShowOption() {
      return true;
    },
    canShowMoreOption() {
      return true;
    },
  };
}
