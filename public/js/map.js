(function() {
  var mymap = L.map('mapid').setView([55.7558, 37.6173], 8);
  L.tileLayer('https://api.mapbox.com/styles/v1/klepov/ciuo3rqmf00g62inogy2c5v2v/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    accessToken: 'pk.eyJ1Ijoia2xlcG92IiwiYSI6ImNpanZvOTZ0ajAwNGl3OGphcnQwdzVweG4ifQ.jCM8K6R_MxlX92wgz0IMqw',
    sleepNote: true,
    sleepOpacity: 0.9,
  }).addTo(mymap);
  adapter.get('/api/shops').then((res) => {
    res.shops.forEach(function(shop) {
      var template = `
        <div class="shop-map-popup">
          <h2>${shop.type} «${shop.name}»</h2>
          <div>Адрес: ${shop.address}</div>
          <div style="margin-top: 4px; margin-bottom: 4px">Телефон: ${shop.phone}</div>
          Услуги:
          <ul>
            ${shop.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
          <a href="/shops/${shop._id}">Подробнее</a>
        </div>`;
      var marker = L.marker([shop.lat, shop.lon]).addTo(mymap);
      var needPopup = document.getElementsByClassName('intro__promo-copy').length !== 0;
      if (needPopup) {
        marker.on('click', function() {
          $('.leaflet-marker-icon').css({ filter: 'none' });
          $(this.getElement()).css({ filter: 'brightness(150%)' })
          $('.intro__promo-copy').html(template);
        });
      } else {
        marker.bindPopup(template);
      }
    });
  });
}());
