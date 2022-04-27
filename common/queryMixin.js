export default {
  onNavigationBarSearchInputChanged(e) {
    /* 当 searchInput 输入时触发*/
    this.query = e.text
  },
  onNavigationBarSearchInputConfirmed(e) {
    /* 点击软键盘搜索按键触发 */
    let text = e.text;
    if (!text) {
      uni.showModal({
        title: '提示',
        content: '请输入内容。'
      });
      return;
    } else {
      this.query = text
    }
  },
}
