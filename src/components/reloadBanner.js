import { subscribe } from '../scripts/pubsub';

const $reloadBanner = document.getElementById('reloadBanner');
const $onlineBanner = document.querySelector('header');

$reloadBanner.addEventListener('click', () => {
  window.location.reload();
});

const makeVisible = () => {
  $onlineBanner.style.display = 'none';
  $reloadBanner.style.display = 'block';
};

subscribe('NEW_SW_CONTROLLING', makeVisible);