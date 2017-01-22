var json = (url, method, obj) => $.ajax({
  url,
  type: method,
  data: obj || {},
  dataType: 'json',
});
var adapter = {
  get: (url) => $.ajax(url),
  post: (url, obj) => json(url, 'POST', obj),
  del: (url, obj) => json(url, 'DELETE', obj),
};



(function() {
  var data = {
    goods: [],
    shops: [],
    total: null,
    options: {
      deliv: null,
      comment: '',
    },
  };
  var handleContent = res => {
    data.goods = res.goods;
    data.total = data.goods.reduce((sum, g) => sum + g.goodData.price * g.qty, 0);
  };
  var handleShops = res => {
    data.shops = res.shops;
    data.options.deliv = data.options.deliv || data.shops[0]._id;
  };
  var changeQty = (item, e) => {
    adapter.post('api/cart', { good_id: item.good, qty: e.target.value })
      .then(handleContent);
  };
  var removeItem = (item) => {
    adapter.del('/api/cart', { good_id: item.good }).then(handleContent);
  };

  var cart = new Vue({
    el: '#vue--cart',
    data: data,
    delimiters: ['${', '}'],
    methods: {
      changeQty,
      removeItem,
    },
  });

  adapter.get('/api/cart/').then(handleContent);
  adapter.get('/api/shops/').then(handleShops);
})();
