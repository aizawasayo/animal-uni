import request from '@/common/request'

export function getTools(params) {
  return request({
    url: 'admin/tool',
    method: 'get',
    data: params,
  })
}

export function addTool(data) {
  return request({
    url: 'admin/tool',
    method: 'post',
    data,
  })
}

export function getTool(id) {
  return request({
    url: 'admin/tool/' + id,
    method: 'get',
  })
}

export function deleteTool(id) {
  return request({
    url: 'admin/tool/' + id,
    method: 'delete',
  })
}

export function searchTool(name) {
  return request({
    url: 'admin/tool/search',
    method: 'get',
    data: {
      name,
    },
  })
}
