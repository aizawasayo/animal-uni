import request from '@/common/request'

export function getPlants(params) {
  return request({
    url: 'admin/plant',
    method: 'get',
    data: params,
  })
}

export function addPlant(data) {
  return request({
    url: 'admin/plant',
    method: 'post',
    data,
  })
}

export function getPlant(id) {
  return request({
    url: 'admin/plant/' + id,
    method: 'get',
  })
}

export function deletePlant(id) {
  return request({
    url: 'admin/plant/' + id,
    method: 'delete',
  })
}

export function searchPlant(name) {
  return request({
    url: 'admin/plant/search',
    method: 'get',
    data: {
      name,
    },
  })
}
