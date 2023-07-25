import request from '@/utils/request';

const handlerName = 'Menu';
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
export async function get(params) {
  return request(`/api/${handlerName}/Get`, {
    method: 'Get',
    params: { ...params },
  });
}
export async function update(params) {
  return request(`/api/${handlerName}/Put`, {
    method: 'PUT',
    data: { ...params },
  });
}
export async function remove(params) {
  return request(`/api/${handlerName}/Delete`, {
    method: 'DELETE',
    data: { ...params },
  });
}
export async function statusChange(params) {
  return request(`/api/${handlerName}/statusChange`, {
    method: 'PUT',
    data: { ...params },
  });
}

export async function getTreeSelectData(params) {
  return request(`/api/Menu/GetTreeSelectData`, {
    method: 'GET',
    params
  });
}

export async function getTreeData(params) {
  return request(`/api/Menu/GetTreeData`, {
    method: 'GET',
    params
  });
}
export async function getCodes(params) {
  return request(`/common/operation/getcodes`, {
    method: 'GET',
    prefix: params.hostApiAddress
  });
}

export async function addOperation(params) {
  return request(`/api/Operation/Post`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function updateOperation(params) {
  return request(`/api/Operation/Put`, {
    method: 'PUT',
    data: { ...params },
  });
}
export async function getOperation(params) {
  return request(`/api/Operation/Get`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removeOperation(params) {
  return request(`/api/Operation/Delete`, {
    method: 'DELETE',
    data: { ...params },
  });
}

export async function getHostApiAddress(params) {
  return request(`/api/ApplicationEnv/GetHostApiAddress`, {
    method: 'GET',
    params: { ...params },
  });
}
