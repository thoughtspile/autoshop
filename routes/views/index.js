const keystone = require('keystone');
const test = require('../test');

const Good = keystone.list('Good');

test();

exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  locals.section = 'home';

  Good.model.byCategory(req.user)
    .then(goodsByCategory => { locals.goodsByCategory = goodsByCategory; })
    .then(
      () => view.render('index'),
      err => console.log('err', err)
    );
};
