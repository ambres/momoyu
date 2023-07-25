import request from '@/utils/request';

const handlerName = 'Operation';

export async function getCodes(params) {
  return request(`/common/operation/getcodes`, {
    method: 'GET',
    prefix: params.hostApiAddress
  });
}


export async function query(params) {
  return request(`/api/${handlerName}/GetPages`, {
    method: 'POST',
    data: params,
  });
}
export async function add(params) {
  return request(`/api/${handlerName}/Post`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function update(params) {
  return request(`/api/${handlerName}/Put`, {
    method: 'PUT',
    data: { ...params },
  });
}
export async function get(params) {
  return request(`/api/${handlerName}/Get`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function remove(params) {
  return request(`/api/${handlerName}/Delete`, {
    method: 'DELETE',
    data: { ...params },
  });
}

export async function getMenuTreeData(params) {
  return request(`/api/Menu/GetTreeData`, {
    method: 'GET',
    params
  });
}
export async function getHostApiAddress(params) {
  return request(`/api/ApplicationEnv/GetHostApiAddress`, {
    method: 'GET',
    params: { ...params },
  });
}
