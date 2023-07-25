import request from '@/utils/request';

const handlerName = 'Template';
export async function query(params) {
  return request(`/api/${handlerName}/GetPages`, {
    method: 'POST',
    data: params,
  });
}
export async function get(params) {
  return request(`/api/${handlerName}/GetById`, {
    method: 'GET',
    params,
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


export async function createTemplateRule(params) {
  return request(`/api/${handlerName}/CreateTemplateRule`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateTemplateRule(params) {
  return request(`/api/${handlerName}/UpdateTemplateRule`, {
    method: 'PUT',
    data: { ...params },
  });
}


export async function updateTemplateRuleCode(params) {
  return request(`/api/${handlerName}/UpdateTemplateRuleCode`, {
    method: 'PUT',
    data: { ...params },
  });
}



export async function getEntitySumary(params) {
  return request(`/api/Template/GetEntitySummary`, {
    method: 'GET',
    params,
  });
}


export async function preview(params) {
  return request(`/api/${handlerName}/Preview`, {
    method: 'POST',
    data: { ...params },
  })
}