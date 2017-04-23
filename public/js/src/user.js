import adapter from './adapter';

// const reloadStats = () => window.stats && window.stats.reload();

Vue.component('userblock', {
  template: `
    <a class="popup-holder">
      <span v-on:click="togglePopup">{{username}}</span>
      <span class="popup" v-if="popupOpen">
        <a href="/signout">Выйти</a>
      </span>
    </a>
  `,
  props: ['username'],
  data() {
    return { popupOpen: false };
  },
  methods: {
    togglePopup() {
      this.popupOpen = !this.popupOpen;
    }
  },
});

if (document.getElementById('user-block')) {
  console.log('init USER');
  new Vue({ el: '#user-block' });
}
