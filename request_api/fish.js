import request from '@/common/request'

export function getFishes(params) {
  return request({
    url: 'admin/fish',
    method: 'get',
    data: params,
  })
}

export function addFish(data) {
  return request({
    url: 'admin/fish',
    method: 'post',
    data,
  })
}

export function getFish(id) {
  return request({
    url: 'admin/fish/' + id,
    method: 'get',
  })
}

export function deleteFish(id) {
  return request({
    url: 'admin/fish/' + id,
    method: 'delete',
  })
}
