import { $slideBtns, $sliderDot } from './elements.js';
import { states } from './states.js';
import { moveSlide } from './utils.js';
//* Events
const onClickSliderDot = (e) => {
  const { target } = e;
  //! $sliderDot의 높이가 0이어서 사이 공간 클릭 시 예외처리가 필요 없음
  const targetImgNumber = +target.closest('span').dataset.imgNumber;
  const diff = states.currentImgNumber - targetImgNumber;
  moveSlide({ direction: diff < 0 ? 'next' : 'prev', count: Math.abs(diff) });
};

//* Event Listeners
$sliderDot.addEventListener('click', onClickSliderDot);
$slideBtns.forEach(($slideBtn) =>
  $slideBtn.addEventListener('click', () =>
    moveSlide({
      direction: $slideBtn.classList.contains('next') ? 'next' : 'prev',
    })
  )
);
