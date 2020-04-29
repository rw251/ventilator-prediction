import { publish } from './scripts/pubsub';
import './components/reloadBanner';
import './components/riskCalculator';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('SW: controllerchange');
      publish('NEW_SW_CONTROLLING');
    });
    navigator.serviceWorker.addEventListener('ready', () => {
      console.log('SW: ready');
    });

    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('SW: reg success');

      console.log('SW: installing: ' + !!registration.installing);
      console.log('SW: waiting: ' + !!registration.waiting);
      console.log('SW: active: ' + !!registration.active);
      
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);

      registration.addEventListener('updatefound', () => {
        console.log('SW: update found');
      })
    }, (err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Do offline stuff
if (navigator.onLine === false) { 
  document.body.classList.add('offline');
}