import request from '@/utils/request';

const handlerName = 'Application';
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

export async function get(params) {
    return request(`/api/${handlerName}/GetDetail`, {
        method: 'Get',
        params
    });
}
export async function initAdminRole(params) {
    return request(`/api/Role/InitAdmin`, {
        method: 'POST',
        data: { ...params },
    });
}


export async function getTest(params) {
    return request(`/api/Util/Test2`, {
        method: 'Get',
        params
    });
}