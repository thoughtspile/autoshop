var keystone = require('keystone');
var _ = require('lodash');

var mailer = require('../mailer');
const SPECIAL_FIELDS = ["_id", "img", "prices", "name", "category", "desc_short", "desc"];

var Cart = keystone.list('Cart');
var Good = keystone.list('Good');
var Shop = keystone.list('Shop');

exports = module.exports = function(req, res) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		locals.section = 'home';

		var user = req.user;

		if (!user) {
			return res.redirect('/');
		}

		const loadCart = () => {
			var items = [];
			return Cart.model.find({ uid: user._id }).exec()
				.then(_items => {
					items = _items;
					var good_ids = _items.map(item => item.good);
					return Good.model.find({
						_id: {
							$in: good_ids
						}
					}).exec();
				})
				.then(goods => {
					goods.forEach(good => {
						good.price = good.priceForUser(req.user);
					})
					items.forEach(item => {
						item.goodData = _.find(goods, good => '' + good._id === '' + item.good);
					});
					return items;
				});
		};

		view.on('post', { action: 'checkout' }, function(next) {
			if (!user) {
				next();
			}
      const needDelivery = req.body['deliv-shop'] === 'delivery';
      let items = [];
      let delivStr = `${needDelivery ? 'Доставка по адресу ' : 'Самовывоз из магазина '}`;
      loadCart()
        .then(_items => { items = _items; })
        .then(() => {
          console.log(needDelivery);
          if (needDelivery) {
            delivStr += req.body['deliv-address'];
            return;
          }
          return Shop.model.findById(req.body['deliv-shop']).exec()
            .then(shop => delivStr += `${shop.name} (${shop.address})`);
        })
        .then(() => {
  				const text = items.map(item => {
  					return `<li>
              название: ${item.goodData.name}<br/>
              цена: ${item.goodData.priceForUser(req.user)}<br/>
              количество: ${item.qty}<br/>
              ${Object.keys(item.goodData._doc)
                .filter(key => SPECIAL_FIELDS.indexOf(key) === -1)
                .map(key => `${key}: ${item.goodData._doc[key]}`)
                .join('<br/>')
              }
            `;
          }).join('\n');
          const userDesc = `Пользователь
            (e-mail ${req.user.email},
              тел. ${req.user.phone},
              категория «${req.user.categoryName}»
            )
            заказал:`;
          const comment = req.body.comment ? `Комментарий к заказу: «${req.body.comment}»` : '';
          mailer.send(`${userDesc} <ul>${text}</ul> ${comment} <br/> ${delivStr}`, (err) => {
            if (!err) {
              req.flash('success', 'Заказ оформлен! Вскоре с вами свяжется наш менеджер.');
              Cart.model.remove({ uid: user._id }).exec()
                .then(() => res.redirect('/cart'));
            } else {
              console.log('error sending mail:', err);
              req.flash('error', 'Возникла проблема при оформлении заказа. Попробуйте позже.');
              res.redirect('/cart');
            }
          });
        });
    });

    loadCart()
      .then(items => {
    		locals.isEmpty = !items || items.length === 0;
        locals.total = items.reduce((acc, item) => acc + item.goodData.price * item.qty, 0);
    		locals.items = items;
    	})
      .then(() => Shop.model.find({}).exec())
      .then(shops => { locals.shops = shops; })
    	.then(
    		() => view.render('cart'),
    		err => console.log('err', err)
      );
};
