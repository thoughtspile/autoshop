var keystone = require('keystone');
var _ = require('lodash');

var User = keystone.list('User');
var Cart = keystone.list('Cart');
var Shop = keystone.list('Shop');
var Good = keystone.list('Good');
var GoodsByShops = keystone.list('GoodsByShops');

const IMG = [
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1005657505.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997640.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014574431.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011429882.JPG",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997628.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014573780.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014573325.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014572922.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014573811.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014574372.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014572790.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014833547.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1015493501.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011541904.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997664.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014493122.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014493123.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014507795.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014579830.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014533251.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014483336.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014572532.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014574472.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014573412.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014573426.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014608216.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014739912.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1015493709.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011339001.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014347338.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997638.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997643.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014338547.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1015020665.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014498414.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014444356.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014579844.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014554093.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014554103.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014533253.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014483338.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014572809.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014572916.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014573139.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014572779.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014574414.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014670520.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014573083.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014573552.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014573723.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014522478.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1015215874.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014527216.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014739872.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014833542.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1015500670.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1015495771.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1005657503.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1005962965.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1005963044.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011338997.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011338998.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011339002.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011339009.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011429795.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011429799.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011429802.JPG",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011429803.JPG",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997631.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997653.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997642.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997644.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997629.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997645.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997666.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997667.jpg",
    "http://ozon-st.cdn.ngenix.net/graphics/ozon/detail/noimg_300x300.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1011997669.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1012023608.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014362071.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014338529.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014338545.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014338543.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014338528.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014338546.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014338525.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014338540.jpg",
    "http://ozon-st.cdn.ngenix.net/multimedia/c300/1014338541.jpg"
]

function randItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randImgs() {
    return _.range(4).map(() => randItem(IMG));
}

function randGoodName() {
    return randItem(['Супер', 'Волшебная', 'Жирная', 'Масянистая']) +
        ' ' +
        randItem(['смазка', 'мазилка', 'тряпка', 'незамерзайка']);
}

function randShopLocation() {
    return randItem(['Маршала', 'Академика', 'Алексея', 'Космонавта']) +
        ' ' +
        randItem(['Дергунко', 'Петровского', 'Борисова', 'Акопяна']) +
        ', д. ' +
        Math.floor(Math.random() * 84) +
        (Math.random() > .5? '': ' к. ' + Math.floor(Math.random() * 5));
}

const makeGood = () => {
    const basePrice = Math.floor(Math.random() * 6000);
    return {
        prices: { cat1: basePrice, cat2: .9 * basePrice, cat3: .6 * basePrice },
        name: randGoodName(),
        category: randItem([ 'масла', "смазки", "дворники", "тряпки" ]),
        desc: 'Невероятно гладкое скольжение в любых условиях мотор радуется',
        img: randImgs()
    }
};

const makeShop = () => ({
    address: randShopLocation(),
    coords: '28.5N 54.6E',
    desc: 'Флагманский магазин со складом.',
    phone: '+79122344565',
});

const makeRel = (goods, shops) => ({
    good: randItem(goods)._id,
    shop: randItem(shops)._id,
    qty: Math.floor(Math.random() * 60)
});

const makeCartItem = (users, goods) => ({
    uid: randItem(users)._id,
    good: randItem(goods)._id,
    qty: Math.floor(Math.random() * 12)
});

module.exports = () => {
    var shops = [];
    var goods = [];
    var users = [];

    // make goods
    Good.model.find({}).remove().exec()
        .then(() => Good.model.create(_.range(200).map(makeGood)))
        // make shops
        .then(() => Shop.model.find({}).remove().exec())
        .then(() => Shop.model.create(_.range(11).map(makeShop)))
        // fetch goods, shops, and users
        .then(() => Shop.model.find({}).exec()
            .then(_shops => shops = _shops)
            .then(() => Good.model.find({}).exec())
            .then(_goods => goods = _goods)
            .then(() => User.model.find({}).exec())
            .then(_users => users = _users)
        )
        // assign goods to shops
        .then(() => GoodsByShops.model.find({}).remove().exec())
        .then(() => {
            const rels = _.range(1200).map(() => makeRel(goods, shops));
            return GoodsByShops.model.create(rels);
        })
        // fill carts
        .then(() => Cart.model.find({}).remove().exec())
        .then(() => {
            const cart = _.range(users.length * 6).map(() => makeCartItem(users, goods));
            return Cart.model.create(cart);
        })
        .then(
            () => console.log('test filled'),
            err => console.log('test error: ', err)
        );
}
