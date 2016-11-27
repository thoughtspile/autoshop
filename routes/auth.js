var keystone = require('keystone');

module.exports.signin = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        req.flash('error', 'Please enter your username and password.');
        return next();
    }

    keystone.session.signin(
        { email: req.body.email, password: req.body.password },
        req,
        res,
        () => {
            return next();
        },
        () => {
            req.flash('error', 'Неверные данные, попробуйте еще раз или зарегистрируйтесть');
            return next();
        }
    );
};
