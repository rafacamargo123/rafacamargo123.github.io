if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log("Service Worker Registered"))
    .catch(e => console.log(e));
}


var methods = {
  'debito': {
    fee: 0.0199, label: 'Débito'
  }, 'credito-vista': {
    fee: 0.0474, label: 'Crédito à vista'
  }, 'credito-parcelado': {
    fee: 0.0531, label: 'Crédito parcelado (comprador)'
  }
}

ons.ready(function() {
  appNavigator.pushPage('input-amount.html');
})

document.addEventListener('init', function(event) {
  let page = event.target;
  if (page.id === 'input-amount') {
    let cursorPlaceholder = page.querySelector('#cursor-placeholder');
    let displayAmount = page.querySelector('#display-amount');
    let displayCents = page.querySelector('#display-cents');
    let amount = page.querySelector('#amount');
    let btnNext = page.querySelector('#goto-select-method');
    let amountError = page.querySelector('#amount-error')

    window.setTimeout(() => cursorPlaceholder.focus(), 100);

    function setAmountDisplay(text) {
      let value = parseInt(text.substring(0,text.length-2) || '0').toString().padStart(1, '0');
      let cents = parseInt(text.substring(text.length-2, text.length)).toString().padStart(2, '0');

      if (value > 50000) {
        amountError.innerText = 'O valor máximo é de R$ 50.000';
        return;
      } else {
        amountError.innerText = '';
      }

      amount.value = value + '.' + cents;
      amount.dataset.raw = value + cents;
      displayAmount.innerText = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      displayCents.innerText = cents;
      btnNext.disabled = parseInt(value) < 1;
    }

    cursorPlaceholder.oninput = function(event) {
      let el = event.target;
      let input = el.innerText.replace(/[^0-9]/g,'');
      el.innerText = ''
      if (input == '')
        return;

      let text = (amount.dataset.raw || '0') + input;
      setAmountDisplay(text);
    }

    cursorPlaceholder.onkeydown = function(event) {
      if (event.key == "Backspace" || event.keycode == 8) {
        let text = amount.dataset.raw;
        setAmountDisplay(text.substring(0,text.length-1));
      }
    }

    btnNext.onclick = function() {
      appNavigator.pushPage('select-method.html', {data: {amount: amount.value }});
    };


  } else if (page.id === 'select-method') {
    let amount = page.data.amount;
    let method = '';

    let list = page.querySelector('ons-list');

    Object.keys(methods).forEach((key) => {
      ons.createElement('select-method-item.html', {append: list}).then(item => {
        let radio = item.querySelector('ons-radio');
        let label = item.querySelector('label.center');

        radio.setAttribute('input-id', key);
        radio.setAttribute('value', key);
        radio.onclick = function(event) {
          appNavigator.pushPage('result.html', {data: {amount: amount, method: event.target.value}});
        }
        label.setAttribute('for', key);
        label.innerText = methods[key].label;
      })
    });


  } else if (page.id === 'result') {
    let shareBtn = page.querySelector('#share-to-mercadopago');
    let amount = page.data.amount;
    let amountTxt = 'R$ ' + page.data.amount.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    let method = page.data.method;

    let total = Math.ceil(amount/(1-methods[method].fee)*100)/100;
    let totalTxt = 'R$ ' + total.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    page.querySelector('#inputted-amount').innerText = amountTxt;
    page.querySelector('#selected-method').innerText = methods[method].label;
    page.querySelector('#charge-amount').innerText = totalTxt;

    if (document.location.hash == '#button') {
      shareBtn.style.display = 'block';
      shareBtn.onclick = function(event) {
        window.open('https://www.mercadopago.com/point/integrations?amount=700&description=teste');
      }
    }
  }
})

document.addEventListener('show', function(event) {
  var page = event.target;
});
