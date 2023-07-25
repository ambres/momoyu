import request from '@/utils/request';

const handlerName = 'ApplicationEnv';
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
  return request(`/api/${handlerName}/GetDetail`, {
    method: 'GET',
    params: { ...params },
  });
}

