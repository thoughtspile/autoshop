(function() {
  var stats = new Vue({
    el: '#vue--header-cart',
    template: `
      <span>
        <div v-if="!isEmpty" class="cart-stats">
          <div class="cart-logo"></div>
          <div class="cart-stats-count">{{count}} {{plural}}</div>
          <div class="cart-stats-total">{{total}} руб.</div>
        </div>
      </span>
    `,
    data: {
      total: 0,
      count: 0
    },
    methods: {
      reload() {
        adapter.get('/api/stats/').then((res) => {
          this.total = res.total;
          this.count = res.count;
        });
      },
    },
    computed: {
      isEmpty() {
        return this.count === 0;
      },
      plural() {
        var count = this.count;
        var last_1 = count % 10;
        var last_2 = count % 100;
        if (last_1 === 1 && last_2 !== 11) {
          return 'товар';
        }
        if ([2, 3, 4].indexOf(last_1) !== -1 && [12, 13, 14].indexOf(last_2) === -1) {
          return 'товара';
        }
        return 'товаров';
      }
    }
  });

  stats.reload();

  window.stats = stats;
})();
