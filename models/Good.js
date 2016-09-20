var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var Good = new keystone.List('Good');

Good.add({
    prices: {
        cat1: { type: Types.Number, initial: false, required: true },
        cat2: { type: Types.Number, initial: false, required: true },
        cat3: { type: Types.Number, initial: false, required: true }
    },
    name: { type: Types.Text, default: '', required: true },
    desc: { type: Types.Text, default: '', required: true },
    img: { type: Types.TextArray, default: [], required: true }
});

Good.register();
