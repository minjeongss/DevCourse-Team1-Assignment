import { $sliderUl } from './elements.js';
export const states = {
  currentImgNumber: 1,
  isScrolling: false,
  totalSlides: $sliderUl.children.length,
  timerId: null,
};
