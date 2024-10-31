"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.setCache = void 0;
const cache = {};
// Set cache with expiration time in milliseconds
const setCache = (key, data, ttl = 60000) => {
    const expiry = Date.now() + ttl;
    cache[key] = { data, expiry };
};
exports.setCache = setCache;
// Get data from cache if it hasn’t expired
const getCache = (key) => {
    const cached = cache[key];
    if (cached && cached.expiry > Date.now()) {
        return cached.data;
    }
    return null;
};
exports.getCache = getCache;
