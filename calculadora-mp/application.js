// if('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('./service-worker.js')
//     .then(() => console.log("Service Worker Registered"))
//     .catch(e => console.log(e));
// }


var methods = {
  'debito': {
    fee: 0.0199, label: 'Débito'
  }, 'credito-vista': {
    fee: 0.0474, label: 'Crédito à vista'
  }, 'credito-parcelado': {
    fee: 0.0531, label: 'Crédito parcelado'
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
    let amout = page.querySelector('#amount');
    let btnNext = page.querySelector('#goto-select-method');

    cursorPlaceholder.focus();

    cursorPlaceholder.oninput = function(event) {
      console.log(event);
      let el = event.target;
      let currentAmount = amount.value;
      let text = '0000'+currentAmount*10+(parseInt(el.innerText) || 0);
      let cents = text.substring(text.length-2, text.length);
      let value = parseInt(text.substring(0,text.length-2));
      let numericValue = value + cents/100;
      amount.value = numericValue;
      displayAmount.innerText = value;
      displayCents.innerText = cents;
      el.innerText = ''
    }

    btnNext.onclick = function() {
      appNavigator.pushPage('select-method.html', {data: {amount: amount.value }});
    };


  } else if (page.id === 'select-method') {
    let amount = page.data.amount;
    let method = '';

    let btnNext = page.querySelector('#goto-result');
    let list = page.querySelector('ons-list');

    Object.keys(methods).forEach((key) => {
      ons.createElement('select-method-item.html', {append: list}).then(item => {
        let radio = item.querySelector('ons-radio');
        let label = item.querySelector('label.center');

        radio.setAttribute('input-id', key);
        radio.setAttribute('value', key);
        radio.onchange = function(event) {
          btnNext.disabled = false;
        }
        label.setAttribute('for', key);
        label.innerText = methods[key].label;
      })
    });

    btnNext.onclick = function() {
      let selectedEl = Array.from(page.querySelectorAll('input[name=method]')).filter( item => item.checked )
      if (selectedEl.length) {
        appNavigator.pushPage('result.html', {data: {amount: amount, method: selectedEl[0].value}});
      }
    };


  } else if (page.id === 'result') {
    let amount = page.data.amount;
    let method = page.data.method;

    let total = amount/(1-methods[method].fee);

    page.querySelector('#inputted-amount').innerText = amount;
    page.querySelector('#selected-method').innerText = methods[method].label;
    page.querySelector('#charge-amount').innerText = total;
  }
})

document.addEventListener('show', function(event) {
  var page = event.target;
});
