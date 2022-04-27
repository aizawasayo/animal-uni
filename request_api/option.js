import request from '@/common/request'

export function getOptions(params) {
  return request({
    url: 'admin/option',
    method: 'get',
    data: params,
  })
}

export function addOption(data) {
  return request({
    url: 'admin/option',
    method: 'post',
    data,
  })
}

export function getOption(id) {
  return request({
    url: 'admin/option/' + id,
    method: 'get',
  })
}

export function deleteOption(id) {
  return request({
    url: 'admin/option/' + id,
    method: 'delete',
  })
}

export function searchOption(name) {
  return request({
    url: 'admin/option/search',
    method: 'get',
    data: {
      name,
    },
  })
}

export function getOptionList(params) {
  return request({
    url: 'admin/option/list',
    method: 'get',
    data: params,
  })
}
