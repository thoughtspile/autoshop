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
  var handleContent = ({ goods }) => { cart.goods = goods; };
  var handleUser = ({ user }) => { cart.user = user; };
  var handleShops = ({ shops }) => {
    cart.shops = shops;
    cart.options.deliv = cart.options.deliv || cart.shops[0]._id;
  };
  var register = () => {
    if (cart.user.isAnonymous && cart.user.email && cart.user.password) {
      adapter.post('/api/user/me', cart.user).then(handleUser);
    }
  };
  var changeQty = (item, e) => {
    adapter.post('/api/cart', { good_id: item.good, qty: e.target.value })
      .then(handleContent);
  };
  var removeItem = (item) => {
    adapter.del('/api/cart', { good_id: item.good }).then(handleContent);
  };

  var cart = new Vue({
    el: '#vue--cart',
    data: {
      goods: [],
      shops: [],
      options: {
        deliv: null,
        comment: '',
      },
      user: {
        email: '',
        password: '',
        isAnonymous: false,
      },
      password: '',
    },
    delimiters: ['${', '}'],
    methods: {
      changeQty,
      removeItem,
      register,
    },
    computed: {
      total() {
        return this.goods.reduce((sum, g) => sum + g.goodData.price * g.qty, 0);
      },
    }
  });

  adapter.get('/api/cart/').then(handleContent);
  adapter.get('/api/shops/').then(handleShops);
  adapter.get('/api/user/me').then(handleUser);

  window.cart = cart;
})();
