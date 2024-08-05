import { PAGINATION_GAP } from './constants.js';
import { $sliderDot } from './elements.js';
import { states } from './states.js';

//? 진혁님 소스 참고 - 초기화 분리
const init = () => {
  //* fragment로 효율적인 DOM 조작
  const fragment = new DocumentFragment();
  //? 예진님 소스 참고
  for (var i = 0; i < states.totalSlides; i++) {
    const newDot = document.createElement('span');
    newDot.dataset.imgNumber = i + 1; //* 1,2,3,...
    //* 가운데 지점에서 왼쪽 모서리 기준으로 나열 후 (states.totalSlides / 2)개 만큼 왼쪽으로 이동시키면 가운데 정렬이 됨
    newDot.style.cssText = `left:calc(50% + ${
      (i - states.totalSlides / 2) * (30 + PAGINATION_GAP)
    }px);`;
    fragment.appendChild(newDot);
  }
  $sliderDot.appendChild(fragment);
};
init();
