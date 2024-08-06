import { DEFAULT_TRANSITION_TIME } from './constants.js';
import { $sliderDot, $sliderUl } from './elements.js';
import { states } from './states.js';
const setTransitionTime = (transitionTime) => {
  $sliderUl.style.transition = `transform ${transitionTime}s`;
};
//* 슬라이드 후 자식요소 조정
const slideNext = ({ transitionTime, count }) => {
  setTransitionTime(transitionTime);
  $sliderUl.style.transform = `translateX(calc(-100% / 3 * ${count}))`;
  setTimeout(() => {
    setTransitionTime(0);
    //? 우종님 소스 참고
    while (count--) $sliderUl.appendChild($sliderUl.firstElementChild);
    $sliderUl.style.transform = `translateX(0)`;
  }, transitionTime * 1000);
};

//* 슬라이드 전 자식요소 조정
const slidePrev = ({ transitionTime, count }) => {
  setTransitionTime(0);
  $sliderUl.style.transform = `translateX(calc(-100% / 3 * ${count}))`;
  while (count--) $sliderUl.prepend($sliderUl.lastElementChild);
  setTimeout(() => {
    setTransitionTime(transitionTime);
    $sliderUl.style.transform = `translateX(0)`;
  }); //* 최소 지연시간 4ms
};
/**
 * Slider 이동 로직입니다.
 * Active Dot도 Slide시에만 변화하므로 함께 관리합니다.
 * @param {number} transitionTime 슬라이드 시간
 * @param {'prev' | 'next'} direction 슬라이드 방향
 * @param {number} count 슬라이드할 개수
 */
export const moveSlide = ({
  transitionTime = DEFAULT_TRANSITION_TIME,
  direction = 'next',
  count = 1,
}) => {
  //todo sliding 중일 때 클릭 블락
  //? 예진님 소스 참고
  console.log(states.timerId);
  if (states.timerId) return;
  states.timerId = setTimeout(() => {
    clearTimeout(states.timerId);
    states.timerId = null;
  }, transitionTime * 1000);

  direction === 'next'
    ? slideNext({ transitionTime, count })
    : slidePrev({ transitionTime, count });
  //* moveSlide시 Dot도 함께 제어
  const targetImgNumber =
    direction === 'next'
      ? states.currentImgNumber + count
      : states.currentImgNumber - count;
  setActiveDot(targetImgNumber);
};

/**
 * 활성화 시킬 Dot을 찾아 $sliderDot의 첫 번째 자식요소로 만듭니다.
 * CSS에 의해 $sliderDot의 첫 번째 자식 요소가 활성화됩니다.
 * @param {number} targetImgNumber
 */
export const setActiveDot = (targetImgNumber) => {
  states.currentImgNumber = targetImgNumber;
  for (var i = 0; i < states.totalSlides; i++) {
    if (+$sliderDot.children[i].dataset.imgNumber === targetImgNumber) {
      $sliderDot.prepend($sliderDot.children[i]);
      break;
    }
  }
};
