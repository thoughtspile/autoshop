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

Vue.component('addtocart', {
  template: `
    <form class='order input-group' method='post'>
      <input name='qty' type='number' min="0" v-model="qty" class="form-control"></input>
      <span class="input-group-btn">
        <button type="submit" class='btn btn-default order__btn' v-on:click.stop.prevent="setQty">
          Купить
        </button>
      </span>
    </form>
  `,
  props: ['goodId', 'value'],
  data() {
    return { qty: this.value || 0 };
  },
  methods: {
    setQty() {
      adapter.post('/api/cart', { good_id: this.goodId, qty: this.qty });
    },
  }
});
new Vue({ el: '#goods' });
