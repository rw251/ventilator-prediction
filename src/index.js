import { publish } from './scripts/pubsub';
import './components/reloadBanner';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      publish('NEW_SW_CONTROLLING');
    });

    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
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