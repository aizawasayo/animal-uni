import request from '@/common/request'

export function getMaterials(params) {
  return request({
    url: 'admin/material',
    method: 'get',
    data: params,
  })
}

export function addMaterial(data) {
  return request({
    url: 'admin/material',
    method: 'post',
    data,
  })
}

export function getMaterial(id) {
  return request({
    url: 'admin/material/' + id,
    method: 'get',
  })
}

export function deleteMaterial(id) {
  return request({
    url: 'admin/material/' + id,
    method: 'delete',
  })
}

export function searchMaterial(name) {
  return request({
    url: 'admin/material/search',
    method: 'get',
    data: { name },
  })
}
