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
      var marker = L.marker([shop.lat, shop.lon]).addTo(mymap);
      marker.bindPopup(`
        <a class="shop-map-popup" href="/shops/${shop._id}">
          <h2>${shop.name}</h2>
          <ul>
            <li>${shop.address}
            <li>${shop.phone}
          </ul>
        </a>`);
    });
  });
}());
