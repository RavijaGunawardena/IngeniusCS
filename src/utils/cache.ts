type CacheData = {
	[key: string]: {
		data: any;
		expiry: number;
	};
};

const cache: CacheData = {};

// Set cache with expiration time in milliseconds
export const setCache = (key: string, data: any, ttl: number = 60000) => {
	const expiry = Date.now() + ttl;
	cache[key] = { data, expiry };
};

// Get data from cache if it hasn’t expired
export const getCache = (key: string): any | null => {
	const cached = cache[key];
	if (cached && cached.expiry > Date.now()) {
		return cached.data;
	}
	return null;
};
