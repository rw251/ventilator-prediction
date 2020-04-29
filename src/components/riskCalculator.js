const $ageInput = document.getElementById('input-age');
const $pulseInput = document.getElementById('input-pulse');
const $calculateButton = document.getElementById('button-calculate');
const $result = document.getElementById('result');

$calculateButton.addEventListener('click', () => {
  const age = $ageInput.value || 0;
  const pulse = $pulseInput.value || 0;

  const result = `Pulse / age = ${pulse} / ${age} = ${+pulse / +age}`;
  $result.innerText = result;
});