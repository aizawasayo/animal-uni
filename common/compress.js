export function base64UrlToBlob(dataUrl) {
  const bytes = window.atob(dataUrl.split(',')[1]) // 去掉url的头，并转换为byte
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length)
  // 创建空的Uint8Array
  const ia = new Uint8Array(ab)
  // 将图像数据逐字节放入Uint8Array中
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  // 利用Uint8Array创建Blob对象
  return new Blob([ab], { type: 'image/png' })
}
// base64Url 转 Blob
export function dataURLToBlob(dataUrl) {
  let arr = dataUrl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = window.atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

export const compressFileApp = async (src, quality) => {
  return new Promise((resolve, reject) => {
    uni.compressImage({
      src,
      quality: quality || 80,
      success: res => {
        resolve(res.tempFilePath)
      },
    })
  })
}

/** 图片压缩，默认为同比例压缩
 *  @param {file} 接受文件数组或单个文件(图片对象)
 *  @param {option} 指定压缩的配置参数：
 *    width｜ height： 指定输出尺寸
 *    quality：  压缩比例，范围 0-1
 *    type： 返回格式， 默认 blobUrl
 */
export function compressFile(src, option) {
  const img = new Image()
  img.src = src
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const options = option || {}
      const { width, height, quality, type, Orientation, fileKey } = options
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      let initSize = img.src.length
      let w = width || img.width
      let h = height || img.height
      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio
      if ((ratio = (w * h) / 4000000) > 1) {
        ratio = Math.sqrt(ratio)
        w /= ratio
        h /= ratio
      } else {
        ratio = 1
      }

      canvas.width = w
      canvas.height = h
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, w, h)

      // 瓦片canvas
      const tCanvas = document.createElement('canvas')
      const tctx = tCanvas.getContext('2d')

      let count
      if ((count = (w * h) / 1000000) > 1) {
        // 如果图片像素大于100万则使用瓦片绘制
        // console.log('超过100W像素')
        count = ~~(Math.sqrt(count) + 1) //计算要分成多少块瓦片
        // 计算每块瓦片的宽和高
        let nw = ~~(w / count)
        let nh = ~~(h / count)
        tCanvas.width = nw
        tCanvas.height = nh
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            )
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, w, h)
      }
      //修复 ios上传图片的时候 被旋转的问题
      if (Orientation != '' && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            rotateImg(img, 'left', canvas)
            break
          case 8: //需要逆时针（向右）90度旋转
            rotateImg(img, 'right', canvas)
            break
          case 3: //需要180度旋转
            rotateImg(img, 'right', canvas) //转两次
            rotateImg(img, 'right', canvas)
        }
      }
      // 进行最小压缩
      // canvas.toDataURL(type, encoderOptions);
      // type： 图片格式 image/png
      // encoderOptions：在指定图片格式为 image/jpeg 或 image/webp的情况下，可以在 0 到 1 的区间选择图片的质量。
      // 如果超出取值范围，将会使用默认值 0.92。
      const imgbase64Url = canvas.toDataURL('image/jpeg', quality || 0.3)
      const imgBlob = dataURLToBlob(imgbase64Url)
      const imgBlobUrl = URL.createObjectURL(imgBlob)
      const fileName = `xxx.${
        imgBlob.type.indexOf('jpeg') > -1 ? 'jpeg' : 'png'
      }`
      const imgFile = new File([imgBlob], fileName, {
        type: imgBlob.type,
      })

      const compressType = type ? type : 'blob'
      const imgUrl = compressType == 'base64' ? imgbase64Url : imgBlobUrl

      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      resolve({
        uri: imgUrl,
        name: fileKey,
        file: imgFile,
      })
    }
  })
}

// 批量压缩
/*
  @return <array> 压缩完成的图片信息对象 数组 
    对象内容为 { name: multipart提交时表单的 key名 uri: blobUrl临时地址 }
    如  {name: 'photoSrc', uri: blob:http://xxxx, }
*/
export const compressAll = (files, option) => {
  let promises = null
  // #ifdef H5
  promises = files.map(file => compressFile(file, option))
  // #endif
  // #ifndef H5
  promises = files.map(file => compressFileApp(file, option))
  // #endif
  return Promise.all(promises)
}
