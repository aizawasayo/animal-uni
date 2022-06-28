import request from '@/common/request'

export function getComments(type, params) {
  return request({
    url: `comment/${type}`,
    method: 'get',
    data: params,
  })
}

export function addComment(type, data) {
  return request({
    url: `comment/${type}`,
    method: 'post',
    data,
  })
}

export function getComment(id, type) {
  return request({
    url: `comment/${type}/${id}`,
    method: 'get',
  })
}

export function deleteComment(id, type) {
  return request({
    url: `comment/${type}/${id}`,
    method: 'delete',
  })
}
