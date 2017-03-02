const images = [
  '14',
  '30nakagami-gpassen_ds-_s1d5398.big',
  '1024_091113IdemitsuCivic_03',
  '6935225842_2088506992_z',
  '7081298737_7c491eeac6_z',
  '7081299589_77eb7ff060_z',
  'b-idemitsushell-a-20141221',
  'MotoGP-9907',
].map(n => `/images/slider/${n}.jpg`);


if (document.getElementById('slider')) {
  new Vue({
    el: '#slider',
    template: `
      <div class="slider" v-bind:style="{ width: \`${images.length * 100}%\`, 'margin-left': getOffset() }">
        <img
          v-for="img in images"
          class="slider__img"
          v-bind:style="{ 'width': \`${100 / images.length}%\` }"
          :src="img"
        />
      </div>
    `,
    data() {
      return { images, tick: 0, interval: null };
    },
    computed: {
      currentImage() { return this.images[this.tick % this.images.length];  },
    },
    methods: {
      getOffset(img) {
        const currI = this.tick % this.images.length;
        return `${ - currI * 100 }%`;
      }
    },
    beforeCreate() {
      this.interval = setInterval(() => { this.tick++; }, 10000);
    },
    beforeDestroy() {
      clearInterval(this.interval);
    },
  });
}
