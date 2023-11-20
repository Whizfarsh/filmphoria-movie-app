'use strict';

// document.querySelector('.users').addEventListener('click', () => {
//   document.querySelector('.user-profile').classList.toggle('hidden');
// });

// fetch('')
//   .then(res => res.json())
//   .then(data => console.log(data));

// touch
let startX;
let scrollLeft;
const draggableElement = document.querySelector('.movies-containers');
draggableElement.addEventListener('touchstart', e => {
  console.log('touched');
  startX = e.touches[0].pageX - draggableElement.offsetLeft;
  scrollLeft = draggableElement.scrollLeft;
});

draggableElement.addEventListener('touchmove', e => {
  if (!startX) return;
  const x = e.touches[0].pageX - draggableElement.offsetLeft;
  const walk = (x - startX) * 2; // Adjust this multiplier to control scrolling speed
  draggableElement.scrollLeft = scrollLeft - walk;
});

draggableElement.addEventListener('touchend', () => {
  startX = null;
});
