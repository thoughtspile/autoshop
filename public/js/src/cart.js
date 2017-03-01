import adapter from './adapter';

let cart = null;

const reloadStats = function() { window.stats && window.stats.reload(); };

const handleContent = ({ goods }) => { cart.goods = goods; reloadStats(); };
const handleUser = ({ user }) => { cart.user = user; };
const handleShops = ({ shops }) => {
  cart.shops = shops;
  cart.options.shop = cart.options.shop || cart.shops[0]._id;
};
const register = () => {
  if (cart.user.isAnonymous && cart.user.email && cart.user.password) {
    adapter.post('/api/user/me', cart.user).then(handleUser);
  }
};
const changeQty = (item, e) => {
  adapter.post('/api/cart', { good_id: item.good, qty: e.target.value })
    .then(handleContent);
};
const removeItem = (item) => {
  adapter.del('/api/cart', { good_id: item.good }).then(handleContent);
};

if (document.getElementById('vue--cart')) {
  cart = new Vue({
    el: '#vue--cart',
    data: {
      goods: [],
      shops: [],
      options: {
        deliv: 'shop',
        shop: null,
        addr: '',
        comment: '',
      },
      user: {
        email: '',
        password: '',
        isAnonymous: false,
        about: 'private',
        name: '',
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
}
