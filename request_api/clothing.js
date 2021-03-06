import request from '@/common/request'

export function getClothingList(params) {
  return request({
    url: 'admin/clothing',
    method: 'get',
    data: params,
  })
}

export function addClothing(data) {
  return request({
    url: 'admin/clothing',
    method: 'post',
    data,
  })
}

export function getClothing(id) {
  return request({
    url: 'admin/clothing/' + id,
    method: 'get',
  })
}

export function deleteClothing(id) {
  return request({
    url: 'admin/clothing/' + id,
    method: 'delete',
  })
}

export function searchClothing(name) {
  return request({
    url: 'admin/clothing/search',
    method: 'get',
    data: {
      name,
    },
  })
}
