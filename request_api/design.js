import request from '@/common/request'

export function getDesignList(params) {
  return request({
    url: 'admin/design',
    method: 'get',
    data: params,
  })
}

export function addDesign(data) {
  return request({
    url: 'admin/design',
    method: 'post',
    data,
  })
}

export function getDesign(id) {
  return request({
    url: 'admin/design/' + id,
    method: 'get',
  })
}

export function deleteDesign(id) {
  return request({
    url: 'admin/design/' + id,
    method: 'delete',
  })
}
