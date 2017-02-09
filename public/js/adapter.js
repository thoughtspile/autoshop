var json = (url, method, obj) => $.ajax({
  url,
  type: method,
  data: obj || {},
  dataType: 'json',
});
window.adapter = {
  get: (url) => $.ajax(url),
  post: (url, obj) => json(url, 'POST', obj),
  del: (url, obj) => json(url, 'DELETE', obj),
};
