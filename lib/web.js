export const apiRequest = (method, url, body) =>
  fetch(url, {
    method,
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  }).then(res => {
    if (res.ok) {
      return res.json();
    }

    if (['post', 'put', 'delete'].includes(method)) {
      return res.text();
    }

    return null;
  });

function parseQuery(url, params = {}) {
  const query = Object.keys(params).reduce((values, key) => {
    if (params[key] !== undefined) {
      return values.concat(`${key}=${encodeURIComponent(params[key])}`);
    }
    return values;
  }, []);
  return query.length ? `${url}?${query.join('&')}` : url;
}

export const get = (url, params) => apiRequest('get', parseQuery(url, params));

export const del = (url, params) => apiRequest('delete', parseQuery(url, params));

export const post = (url, params) => apiRequest('post', url, JSON.stringify(params));

export const put = (url, params) => apiRequest('put', url, JSON.stringify(params));

export const hook = (_this, method, callback) => {
  const orig = _this[method];

  return (...args) => {
    callback.apply(null, args);

    return orig.apply(_this, args);
  };
};

export const doNotTrack = () => {
  const { doNotTrack, navigator, external } = window;

  const msTracking = () => {
    return (
      external &&
      typeof external.msTrackingProtectionEnabled === 'function' &&
      external.msTrackingProtectionEnabled()
    );
  };

  const dnt = doNotTrack || navigator.doNotTrack || navigator.msDoNotTrack || msTracking();

  return dnt === true || dnt === 1 || dnt === 'yes' || dnt === '1';
};
