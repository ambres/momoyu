import request from '@/utils/request';

import { fetch } from 'umi-request';

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



export async function getEntitySumary(url) {
  return fetch(url, {
    method: 'GET',
    params: {}
  });
}


export async function preview(params) {
  return request(`/api/${handlerName}/Preview`, {
    method: 'POST',
    data: { ...params },
  })
}

export async function getSettingSelectView(params) {
  return request(`/api/${handlerName}/GetSettingSelectView`, {
    method: 'GET',
    params,
  })
}
export async function getSettingById(params) {
  return request(`/api/${handlerName}/GetSettingById`, {
    method: 'GET',
    params,
  })
}



export async function createTemplateSetting(params) {
  return request(`/api/${handlerName}/CreateTemplateSetting`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateTemplateSetting(params) {
  return request(`/api/${handlerName}/UpdateTemplateSetting`, {
    method: 'PUT',
    data: { ...params },
  });
}