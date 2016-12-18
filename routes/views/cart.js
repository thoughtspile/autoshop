var keystone = require('keystone');
var _ = require('lodash');

var mailer = require('../mailer');
const SPECIAL_FIELDS = ["_id", "img", "prices", "name", "category", "desc_short", "desc"];

var Cart = keystone.list('Cart');
var Good = keystone.list('Good');

exports = module.exports = function (req, res) {
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
          return Good.model.find({ _id: { $in: good_ids } }).exec();
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
      loadCart().then(items => {
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
          (e-mail ${req.user.email}, тел. ${req.user.phone}, категория ${req.user.categoryName})
          заказал:`;
        const comment = req.body.comment ? `Комментарий к заказу: «${req.body.comment}»` : '';
        mailer.send(`${userDesc} <ul>${text}</ul> ${comment}`, (err) => {
          if (!err) {
            Cart.model.remove({ uid: user._id }).exec()
              .then(() => res.redirect('/cart'));
          } else {
            console.log('error sending mail:', err);
            res.redirect('/cart');
          }
        });
      });
    });

    loadCart()
        .then(items => {
          locals.isEmpty = !items || items.length === 0;
          locals.items = items;
        })
        .then(
            () => view.render('cart'),
            err => console.log('err', err)
        );
};
