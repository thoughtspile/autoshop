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

    view.on('post', { action: 'checkout' }, function(next) {
      console.log(req.body);
      if (!user) {
        next();
      }
      const needDelivery = req.body['deliv-type'] === 'deliver';
      let items = [];
      let delivStr = `${needDelivery ? 'Доставка по адресу ' : 'Самовывоз из магазина '}`;
      Cart.model.byUser(user)
        .then(_items => { items = _items; })
        .then(() => {
          if (needDelivery) {
            delivStr += req.body['deliv-addr'];
            return;
          }
          return Shop.model.findById(req.body['deliv-shop']).exec()
            .then(shop => delivStr += `${shop.name} (${shop.address})`);
        })
        .then(() => Cart.model.checkout(user))
        .then((invoice) => {
          const text = items.map(item => (
            `<li>
              название: ${item.goodData.name}<br/>
              цена: ${item.goodData.price}<br/>
              количество: ${item.qty}<br/>
              ${Object.keys(item.goodData)
                .filter(key => SPECIAL_FIELDS.indexOf(key) === -1)
                .map(key => `${key}: ${item.goodData[key]}`)
                .join('<br/>')
              }
            `
          )).join('\n');
          const userDesc = `Пользователь
            (
              e-mail ${req.user.email},
              тел. ${req.user.phone},
              категория «${req.user.categoryName}»
            )
            заказал:`;
          const comment = req.body.comment ? `Комментарий к заказу: «${req.body.comment}»` : '';
          const invoiceUrl = `http://turboil.ru/invoice/${invoice._id}`;
          const invoiceMsg = `Сформирована накладная: <a href="${invoiceUrl}">${invoiceUrl}</a>`;

          const message = `${userDesc}
            <ul>${text}</ul>
            ${comment} <br/>
            ${delivStr} <br/>
            ${invoiceMsg}
          `;

          return mailer.send(message);
        })
        .then(
          () => {
            req.flash('success', 'Заказ оформлен! Вскоре с вами свяжется наш менеджер.<br/>');
          },
          () => {
            console.log('error sending mail:', err);
            req.flash('error', 'Возникла проблема при оформлении заказа. Попробуйте позже.');
          }
        )
        .then(() => next());
    });

    Cart.model.byUser(user)
      .then(items => { locals.items = items; })
      .then(
        () => view.render('cart'),
        err => console.log('err', err)
      );
};
