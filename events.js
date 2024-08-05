import { repeatSlide, slide, slideDirection } from './utils.js';
import { $nextBtn, $prevBtn, $sliderDot, $sliderUl } from './elements.js';
import {
  getActiveImgNumber,
  getIsScrolling,
  setActiveImgNumber,
  setIsScrolling,
} from './states.js';
//* Events
$sliderUl.prepend($sliderUl.lastElementChild); //! 내 코드에서 이걸 해주지 않으면 2번 이미지부터 보인다.

const onClickPrevBtn = () => {
  if (getIsScrolling()) return;
  setIsScrolling(true);
  slide({ direction: 'prev' });
  setActiveImgNumber((getActiveImgNumber() - 1 + 4) % 4 || 4);
};
const onClickNextBtn = () => {
  if (getIsScrolling()) return;
  setIsScrolling(true);
  slide({ direction: 'next' });
};
const onClickNumberBtn = (targetNumber) => {
  if (getIsScrolling()) return;
  setIsScrolling(true);
  const diff = targetNumber - getActiveImgNumber();
  const repeatCount = Math.abs(diff);
  const direction = diff > 0 ? 'next' : 'prev';
  if (diff === 0) return;
  slide({
    direction,
    transitionTime: 1 / repeatCount,
  }); //! 한 번 즉시 실행
  repeatSlide({ repeatCount: repeatCount - 1, direction });
};
const onTransitionEnd = () => {
  if (slideDirection === 'prev') {
    $sliderUl.prepend($sliderUl.lastElementChild);
  }
  if (slideDirection === 'next') {
    $sliderUl.appendChild($sliderUl.firstElementChild);
  }
  $sliderUl.style.transition = `none`; // 처리해주지 않으면 아래 transform에서 애니메이션 발생해버림
  $sliderUl.style.transform = `translate(calc(-100% / 3), 0)`; // UL 원래 위치로
  setIsScrolling(false);
};
const onClickDot = function (e) {
  if (getIsScrolling()) return;
  const $clickedDot = e.target.closest('span');
  if (!$clickedDot) return;
  const clickedNumber = +$clickedDot.textContent;
  this.querySelector('.active').classList.remove('active');
  $clickedDot.classList.add('active');
  onClickNumberBtn(clickedNumber);
  setActiveImgNumber(clickedNumber); // active 상태 관리
};

//* Event Listeners
$prevBtn.addEventListener('click', onClickPrevBtn);
$nextBtn.addEventListener('click', onClickNextBtn);
$sliderUl.addEventListener('transitionend', onTransitionEnd);
$sliderDot.addEventListener('click', onClickDot);
