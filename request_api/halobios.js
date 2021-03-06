import request from '@/common/request'

export function getHalobiosList(params) {
  return request({
    url: 'admin/halobios',
    method: 'get',
    data: params,
  })
}

export function addHalobios(data) {
  return request({
    url: 'admin/halobios',
    method: 'post',
    data,
  })
}

export function getHalobios(id) {
  return request({
    url: 'admin/halobios/' + id,
    method: 'get',
  })
}

export function deleteHalobios(id) {
  return request({
    url: 'admin/halobios/' + id,
    method: 'delete',
  })
}
