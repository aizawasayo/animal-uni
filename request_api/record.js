import request from '@/common/request'

export function getRecords(params) {
  return request({
    url: 'admin/record',
    method: 'get',
    data: params,
  })
}

export function addRecord(data) {
  return request({
    url: 'admin/record',
    method: 'post',
    data,
  })
}

export function getRecord(id) {
  return request({
    url: 'admin/record/' + id,
    method: 'get',
  })
}

export function deleteRecord(id) {
  return request({
    url: 'admin/record/' + id,
    method: 'delete',
  })
}
