import request from '@/utils/request';

const handlerName = 'ApplicationEnv';
export async function query(params) {
  return request(`/api/${handlerName}/Pages`, {
    method: 'POST',
    data: params,
  });
}
export async function add(params) {
  return request(`/api/${handlerName}/create`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function update(params) {
  return request(`/api/${handlerName}/update`, {
    method: 'POST',
    data: { ...params },
  });
}




export async function get(params) {
  return request(`/api/${handlerName}/Detail`, {
    method: 'GET',
    params: { ...params },
  });
}


export async function saveTableVersion(params) {
  return request(`/api/ApplicationEnv/SaveTableVersion`, {
    method: 'POST',
    data: { ...params },
  });
}




export async function getChangeAppTables(params) {
  return request(`/api/ApplicationEnv/GetChangeAppTables`, {
    method: 'GET',
    params: { ...params },
  });
}
export async function rollbackTableVersion(params) {
  return request(`/api/ApplicationEnv/RollbackTableVersion`, {
    method: 'POST',
    data: { ...params },
  });
}



export async function getAllEnvCode() {
  return request(`/api/ApplicationEnv/GetAllEnvCode`, {
    method: 'GET',
    params: {},
  });
}


export async function getVersionList(params) {
  return request(`/api/EnterpriseApplication/GetEnterpriseApplicationVersionByEnv`, {
    method: 'GET',
    params,
  });
}


export async function initOrUpdateDatabase(params) {
  return request(`/api/EnterpriseApplication/initOrUpdateDatabase`, {
    method: 'POST',
    data: { ...params },
  });
}
