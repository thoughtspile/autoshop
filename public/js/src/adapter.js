const json = (url, method, obj) => $.ajax({
  url,
  type: method,
  data: obj || {},
  dataType: 'json',
});

export default {
  get: (url) => $.ajax(url),
  post: (url, obj) => json(url, 'POST', obj),
  del: (url, obj) => json(url, 'DELETE', obj),
};
