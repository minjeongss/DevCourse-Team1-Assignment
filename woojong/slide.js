const totalIndex = document.querySelectorAll(".slider").length;
const slideContainer = document.querySelector(".sliderUl");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const dotContainer = document.querySelector(".slider-dot");

// 슬라이드 개수에 맞게 dot 생성하는 부분, 첫 슬라이드 가운데로 오는 부분 init 함수로 작성 추가할 것

// 첫 슬라이드의 인덱스 0
let curIndex = 0;
let isAnimating = false;

const updateDot = (nxtIndex) => {
  let cnt = nxtIndex - curIndex;
  if (cnt > 0) {
    while (cnt--) {
      const firstDot = dotContainer.firstElementChild;
      dotContainer.appendChild(firstDot);
    }
  } else {
    while (cnt++) {
      const lastDot = dotContainer.lastElementChild;
      dotContainer.prepend(lastDot);
    }
  }
};

// moveLeft(), moveRight()
// slide 이동을 적용한 뒤, setTimeout의 콜백 함수 내부에서 DOM 재구성
// moveLeft, moveRight 함수 하나로 합쳐볼 것
const moveLeft = () => {
  // if (isAnimating) return;
  // isAnimating = true;

  slideContainer.style.transition = "transform 0.5s ease";
  slideContainer.style.transform = `translateX(calc(100% / -3 * 2))`;

  setTimeout(() => {
    slideContainer.style.transition = "none";
    slideContainer.style.transform = "translateX(calc(100% / -3))";
    const firstSlide = slideContainer.firstElementChild;
    slideContainer.appendChild(firstSlide);
    // isAnimating = false;
    let nxtIndex = (curIndex + 1) % totalIndex;
    updateDot(nxtIndex);
    curIndex = nxtIndex;
  }, 500);
};

const moveRight = () => {
  // if (isAnimating) return;
  // isAnimating = true;

  slideContainer.style.transition = "transform 0.5s ease";
  slideContainer.style.transform = `translateX(0)`;

  setTimeout(() => {
    slideContainer.style.transition = "none";
    slideContainer.style.transform = "translateX(calc(100% / -3))";
    const lastSlide = slideContainer.lastElementChild;
    slideContainer.prepend(lastSlide);
    // isAnimating = false;
    let nxtIndex = (curIndex + totalIndex - 1) % totalIndex;
    updateDot(nxtIndex);
    curIndex = nxtIndex;
  }, 500);
};

const moveSlides = async (count) => {
  if (isAnimating) return;
  isAnimating = true;

  const move = count > 0 ? moveLeft : moveRight;
  count = Math.abs(count);

  // 2칸 이상 이동할 때, moveLeft와 moveRight함수의
  // timeout뒤 DOM 변경 시간을 벌어주기 위해
  for (let i = 0; i < count; i++) {
    setTimeout(move, 600 * i);
  }

  // 이동 중 다른 동작 방지하기 위하여 isAnimating도 timeout 뒤에 변경
  setTimeout(() => (isAnimating = false), 600 * count);
};

// prevButton.addEventListener("click", () => moveRight(-1));
// nextButton.addEventListener("click", () => moveLeft(1));

// 버튼 중복으로 눌러지는 부분 다시 수정할 것
prevButton.addEventListener("click", () => {
  if (!isAnimating) moveSlides(-1);
});
nextButton.addEventListener("click", () => {
  if (!isAnimating) moveSlides(1);
});

dotContainer.addEventListener("click", (event) => {
  if (isAnimating) return;
  // 다른 부분 클릭했을 때 예외처리 추가할 것

  const dots = Array.from(dotContainer.children);
  const clickedDotIndex = dots.indexOf(event.target);
  console.log(clickedDotIndex);

  // 왼쪽이 가까우면 왼쪽으로, 오른쪽이 가까우면 오른쪽으로 회전하도록
  // slide 추가되었을 때, 왼쪽 오른쪽 잘 설정하는지 확인할 것
  if (clickedDotIndex <= Math.round(totalIndex / 2)) {
    console.log("< half");
    moveSlides(clickedDotIndex);
  } else {
    console.log("> half");
    moveSlides(-(totalIndex - clickedDotIndex));
  }
});
