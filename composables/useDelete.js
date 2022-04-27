import { ref } from 'vue'

export default function useDelete(deleteApi, refreshList, type) {
  const multiSelection = ref([])

  // 监听多选并给多选数组赋值
  const selectionChange = selection => {
    multiSelection.value = selection
  }

  const deleteById = (id, callback) => {
    let params = [] // 用来处理评论 api 的特殊情况
    type && type.value ? (params = [id, type.value]) : (params = [id])

    uni.showModal({
      title: '提示',
      content: '是否要永久删除数据',
      success: function(res) {
        if (res.confirm) {
          deleteApi(...params).then(res => {
            uni.showToast({
              title: '删除成功！',
              success: res => {
                callback && callback()
                refreshList && refreshList()
              }
            })

          })
        } else if (res.cancel) {
          uni.showToast({ title: '已取消删除' })
        }
      }
    });
  }

  // 点击批量删除按钮
  const multiDelete = () => {
    if (multiSelection.value.length === 0) {
      return uni.showToast({ title: '请先选中至少一条数据', icon: 'error' })
    }
    let id = ''
    let isAdmin = false // 用户页面防止删除管理员

    multiSelection.value.forEach(val => {
      if (val.roles && val.roles.includes('admin')) {
        isAdmin = true
      }
      id += val._id + ','
    })

    id = id.substring(0, id.length - 1)
    deleteById(id)

  }

  return {
    multiSelection,
    selectionChange,
    deleteById,
    multiDelete,
  }
}
