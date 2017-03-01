import adapter from './adapter';

const reloadStats = () => window.stats && window.stats.reload();

Vue.component('addtocart', {
  template: `
    <form class='order input-group' method='post' v-on:click.stop.prevent="">
      <span v-if="isInCart" class="input-group-addon">В корзине:</span>
      <input
        v-on:change="setQtyLive"
        name='qty'
        type='number'
        min="1"
        :value="qty"
        class="form-control"
      ></input>
      <span v-if="!isInCart" class="input-group-btn">
        <button type="submit" class='btn btn-default order__btn' v-on:click.stop.prevent="setQty">
          Купить
        </button>
      </span>
    </form>
  `,
  props: ['goodId', 'value'],
  data() {
    const value = Number(this.value);
    const isInCart = !!value;
    return { qty: isInCart ? value : 1, isInCart };
  },
  methods: {
    setQty() {
      adapter.post('/api/cart', { good_id: this.goodId, qty: this.qty })
        .then(res => res.goods.forEach((good) => {
          if (good.good === this.goodId) {
            this.qty = good.qty;
            this.isInCart = !!good.qty;
          }
        }))
        .then(reloadStats);
    },
    setQtyLive(e) {
      this.qty = e.target.value;
      if (this.isInCart) {
        this.setQty();
      }
    }
  }
});
if (document.getElementById('goods')) {
  new Vue({ el: '#goods' });
}
