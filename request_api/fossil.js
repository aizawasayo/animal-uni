import request from '@/common/request'

export function getFossils(params) {
  return request({
    url: 'admin/fossil',
    method: 'get',
    data: params,
  })
}

export function addFossil(data) {
  return request({
    url: 'admin/fossil',
    method: 'post',
    data,
  })
}

export function getFossil(id) {
  return request({
    url: 'admin/fossil/' + id,
    method: 'get',
  })
}

export function deleteFossil(id) {
  return request({
    url: 'admin/fossil/' + id,
    method: 'delete',
  })
}
