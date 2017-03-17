const mailer = require('./mailer.js');

module.exports = (email, name, password) => {
  const emailBody = `
    <html>
    <body style="background-color: #e0e0e0; font-size: 18px; padding: 30px;">
      <div style="margin: 30px auto; padding: 50px; max-width: 600px; background-color: white; box-shadow: 0px 10px 30px rgba(0,0,0,0.3);">
        ${!!name ? `${name}!<br/>` : ''}
        Вы успешно зарегистрировались в интернет-магазине автосмазок
        <a href="http://turboil.ru">Turboil!</a><br/>
        Ваш пароль — ${password}<br/>
        <div style="margin-top: 30px">
          <a href="http://turboil.ru/pricelist">Смотреть ассортимент</a><br/>
          <a href="http://turboil.ru/shopmap">Наши магазины на карте</a><br/>
          <a href="http://turboil.ru/cart">В корзину</a><br/>
        </div>
        <div style="margin-top: 30px">
          Вопросы? Звоните по телефону
          <a href="tel:+79296204951">+7 929 620–49–51</a>
          или пишите на адрес
          <a href="mailto:shop@turboil.ru">shop@turboil.ru</a>
        </div>
      </div>
      <span style="display:none">${Date.now()}</span>
    </body>
    </html>
  `;
  mailer.sendTo(emailBody, email, 'Добро пожаловать в интернет-магазин Turboil!');
};
