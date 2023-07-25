import request from '@/utils/request';

const handlerName = 'ApplicationVersion';
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
    method: 'Put',
    data: { ...params },
  });
}


export async function statusChange(params) {
  return request(`/api/${handlerName}/statusChange`, {
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
export async function exportExcel(params) {
  return request(`/api/${handlerName}/ExportQueue`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function getTreeSelectData(params) {
  return request(`/api/Menu/GetTreeTableByVersionsId`, {
    method: 'GET',
    params: { ...params },
  });
}
export async function getStrategySelectData() {
  return request(`/api/Strategy/GetSelectData`, {
    method: 'GET',
  });
}

export async function savePermission(params) {
  return request(`/api/${handlerName}/saveVersionsPermission`, {
    method: 'PUT',
    data: { ...params },
  });
}
