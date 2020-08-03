// if('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('./service-worker.js')
//     .then(() => console.log("Service Worker Registered"))
//     .catch(e => console.log(e));
// }

function documentReady() {
  document.querySelector('#amount input').focus();
}
