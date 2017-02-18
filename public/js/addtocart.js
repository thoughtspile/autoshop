var reloadStats = function() { window.stats && window.stats.reload(); };
Vue.component('addtocart', {
  template: `
    <form class='order input-group' method='post' v-on:click.stop.prevent="">
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
      adapter.post('/api/cart', { good_id: this.goodId, qty: this.qty })
        .then(res => res.goods.forEach(function(good) { if (good.good === this.goodId) { this.qty = good.qty; } }))
        .then(reloadStats);
    },
  }
});
new Vue({ el: '#goods' });
