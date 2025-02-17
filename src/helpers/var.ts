import * as config from 'utils/config';

export {
    spreadValue,
    mapObjectValues,
    mapObject,
    isEnumField,
    safeJsonParse,
    addNodeIdToUrl,
    empty,
    any
};

const spreadValue = (value: number, spread: number) => value * (1 + spread * (1 - 2 * Math.random()));

const mapObjectValues = (object: Object, mapper: Function) => Object.entries(object)
    .reduce((result, [key, value]) => ({ ...result, [key]: mapper(value, key)}), {});

const mapObject = (object: Object, mapper: Function) => Object.entries(object)
    .reduce((result, [key, value]) => ({ ...result, ...mapper(value, key)}), {});

const isEnumField = (enumObject: TObject<any>, value: any, ...fields: any[]) => fields.length
    ? fields.some(field => enumObject[field] === value)
    : value in enumObject;

const safeJsonParse = (data: any) => {
    if (typeof data == 'object') return data;

    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
};

const addNodeIdToUrl = (id: Id, add = true) => {
    const url = new URL(document.location.toString());
    const paramName = config.url.search.node;
    const paramValue = id.toString();

    if (add && url.searchParams.has(paramName, paramValue)) return;

    url.searchParams[add ? 'append' : 'delete'](paramName, paramValue);
    history.replaceState({}, '', url);
};

const any = (value: any) => {
    if (Array.isArray(value)) return value.length;
    if (value instanceof Map || value instanceof Set) return value.size;
    if (value instanceof Object) return Object.keys(value).length;

    return value;
}

const empty = (value: any) => !any(value);
