import { $sliderUl } from './elements.js';
const DEFAULT_TRANSITION_TIME = 1; // 1초
let slideDirection = 'next'; // prev || next || number
const setTransition = function (transitionTime) {
  $sliderUl.style.transition = `transform ${transitionTime}s`;
};
const slide = function ({
  transitionTime = DEFAULT_TRANSITION_TIME,
  direction, // prev ||  next
}) {
  setTransition(transitionTime);
  slideDirection = direction; // prev || next
  $sliderUl.style.transform = `translate(calc(100% / 3 * ${
    direction === 'prev' ? 0 : -2
  }), 0)`;
};

const repeatSlide = function ({ repeatCount, direction }) {
  const transitionTime = DEFAULT_TRANSITION_TIME / (repeatCount + 1); //repeatCount-1이 실질적으로 넘어오므로 + 1 해준다
  let count = 0;
  const intervalId = setInterval(() => {
    if (count >= repeatCount) {
      clearInterval(intervalId);
      return;
    }
    slide({
      direction,
      transitionTime,
    });
    count++;
  }, transitionTime * 1000 + 100); //! 콜스택이 비워질 100ms의 시간의 여유를 줌. 이 오차범위를 안 주면 transform이 안 되는 경우 발생. DEFAULT_TRANSITION_TIME이 1초일 경우 100ms가 적당하다. DEFAULT_TRANSITION_TIME을 줄일 수록 더 많은 여유가 필요한 듯.
};
export { setTransition, slide, repeatSlide, slideDirection };
