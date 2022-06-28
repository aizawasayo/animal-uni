import { ref, computed, inject } from 'vue'
import permision from '@/common/permission'
import { compressAll } from '@/common/compress'
import { upload, uploadMulti } from '@/request_api/upload'

// 手动上传
export default function useUpload(count) {
  const apiUrl = inject('apiUrl')
  const sourceType = [['camera'], ['album'], ['camera', 'album']]

  const uploadList = ref([]) // 待上传列表
  const fileList = ref([])

  const isMulti = computed(() => count !== 1)

  const initialList = photoList => {
    const list = []
    photoList.forEach(img => {
      list.push({
        url: apiUrl + img.src,
        name: img.name,
        extname: img.src.split('.')[1],
      })
    })
    fileList.value = list
  }

  const checkPermission = async code => {
    let type = code ? code - 1 : 2
    let status = permision.isIOS
      ? await permision.requestIOS(sourceType[type][0])
      : await permision.requestAndroid(
          type === 0
            ? 'android.permission.CAMERA'
            : 'android.permission.READ_EXTERNAL_STORAGE'
        )

    if (status === null || status === 1) {
      status = 1
    } else {
      uni.showModal({
        content: '没有开启权限',
        confirmText: '设置',
        success: function (res) {
          if (res.confirm) {
            permision.gotoAppSetting()
          }
        },
      })
    }
    return status
  }

  const isFullImg = () => {
    return new Promise(res => {
      uni.showModal({
        content: '已经有9张图片了,是否清空现有图片？',
        success: e => {
          if (e.confirm) {
            uploadList.value = []
            res(true)
          } else {
            res(false)
          }
        },
        fail: () => {
          res(false)
        },
      })
    })
  }

  // 选择文件/图片后触发
  const selectImage = e => {
    uploadList.value = e.tempFilePaths
  }

  // 移除文件/图片后触发
  const deleteImage = (e, photoList) => {
    if (e.tempFilePath.indexOf('blob') > -1) {
      // 如果删除的是 uploadList 里的 图片
      let index = uploadList.value.findIndex(img => img === e.tempFilePath)
      uploadList.value.splice(index, 1)
    } else {
      // 如果删除的是之前上传的图片
      let index = photoList.findIndex(
        img => img.src === e.tempFilePath.replace(apiUrl, '')
      )
      photoList.splice(index, 1)
    }
  }

  // 手动触发选择图片，如使用 uni-file-picker 组件就无需用到
  const chooseImage = async () => {
    // #ifdef APP-PLUS
    // TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
    let status = await checkPermission()
    if (status !== 1) {
      return
    }
    // #endif

    if (isMulti.value && uploadList.value.length === 9) {
      let isContinue = await isFullImg()
      console.log('是否继续?', isContinue)
      if (!isContinue) {
        return
      }
    }

    uni.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: count,
      success: res => {
        // uploadList.value = res.tempFilePaths
        selectImage(res)
      },
      fail: err => {
        console.log('err: ', err)
        // #ifdef APP-PLUS
        if (err['code'] && err.code !== 0) {
          checkPermission(err.code)
        }
        // #endif
        // #ifdef MP
        if (err.errMsg.indexOf('cancel') !== '-1') {
          return
        }
        uni.getSetting({
          success: res => {
            let authStatus = false
            authStatus =
              res.authSetting['scope.album'] && res.authSetting['scope.camera']

            if (!authStatus) {
              uni.showModal({
                title: '授权失败',
                content:
                  '应用需要从您的相机或相册获取图片，请在设置界面打开相关权限',
                success: res => {
                  if (res.confirm) {
                    uni.openSetting()
                  }
                },
              })
            }
          },
        })
        // #endif
      },
    })
  }

  // 批量上传对图片格式的处理
  const uploadMultiSuccess = files => {
    const photoList = []
    files.forEach((pic, i) => {
      const uid = Date.parse(new Date()) / 1000 + i
      photoList.push({ name: pic.name, src: pic.path, uid, status: 'success' })
    })
    return photoList
  }

  // 手动上传
  const getUploadData = async () => {
    // console.log('待上传', uploadList.value)
    const compressedFiles = await compressAll(uploadList.value, {
      fileKey: isMulti.value ? 'photoSrc' : 'avatar',
    })
    // console.log('压缩后', compressedFiles)
    // #ifndef H5
    // 移动端只返回 blobUrl，需要循环处理下
    compressedFiles.forEach((item, i) => {
      if (typeof item === 'string')
        compressedFiles[i] = {
          uri: item,
          name: isMulti.value ? 'photoSrc' : 'avatar',
        }
    })
    // #endif

    return new Promise((resolve, reject) => {
      // 批量上传/单文件上传 根据条件处理
      uni.uploadFile({
        url: `${apiUrl}${
          isMulti.value ? '/admin/upload' : '/admin/single/upload'
        }`,
        files: compressedFiles,
        success: uploadFileRes => {
          const resFiles = JSON.parse(uploadFileRes.data)
          const dealFiles = isMulti.value
            ? uploadMultiSuccess(resFiles.data)
            : resFiles.data.path
          resolve(dealFiles)
        },
        fail: err => {
          reject(err)
        },
      })
    })
  }

  return {
    uploadList,
    fileList,
    initialList,
    chooseImage,
    selectImage,
    deleteImage,
    getUploadData,
  }
}
