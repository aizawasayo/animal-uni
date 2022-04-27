import request from '@/common/request'

export function getIslanders(params) {
  return request({
    url: 'admin/islander',
    method: 'get',
    data: params,
  })
}

export function addIslander(data) {
  return request({
    url: 'admin/islander',
    method: 'post',
    data,
  })
}

export function getIslander(id) {
  return request({
    url: 'admin/islander/' + id,
    method: 'get',
  })
}

export function deleteIslander(id) {
  return request({
    url: 'admin/islander/' + id,
    method: 'delete',
  })
}
