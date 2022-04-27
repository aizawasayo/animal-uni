import request from '@/common/request'

export function getGuideList(params) {
  return request({
    url: 'admin/guide',
    method: 'GET',
    data: params,
  })
}

export function addGuide(data) {
  return request({
    url: 'admin/guide',
    method: 'POST',
    data,
  })
}

export function getGuide(id) {
  return request({
    url: 'admin/guide/' + id,
    method: 'GET',
  })
}

export function deleteGuide(id) {
  return request({
    url: 'admin/guide/' + id,
    method: 'DELETE',
  })
}
