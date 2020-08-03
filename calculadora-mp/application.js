// if('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('./service-worker.js')
//     .then(() => console.log("Service Worker Registered"))
//     .catch(e => console.log(e));
// }

// window.setTimeout(function() {
//   document.querySelector('#amount')._input.focus()
// }, 500);

ons.ready(function() {
  appNavigator.pushPage('input-amount.html');
})

document.addEventListener('show', function(event) {
  var page = event.target;

  if (page.id === 'input-amount') {
    page.querySelector('#amount')._input.focus();
    page.querySelector('#goto-select-method').onclick = function() {
       appNavigator.pushPage('select-method.html', {data: {title: 'Page 2'}});
    };
  } else if (page.id === 'page2') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }
});
