import request from '@/common/request'

export function getRecipes(params) {
  return request({
    url: 'admin/recipe',
    method: 'get',
    data: params,
  })
}

export function addRecipe(data) {
  return request({
    url: 'admin/recipe',
    method: 'post',
    data,
  })
}

export function getRecipe(id) {
  return request({
    url: 'admin/recipe/' + id,
    method: 'get',
  })
}

export function deleteRecipe(id) {
  return request({
    url: 'admin/recipe/' + id,
    method: 'delete',
  })
}

export function searchRecipe(name) {
  return request({
    url: 'admin/recipe/search',
    method: 'get',
    data: {
      name,
    },
  })
}
