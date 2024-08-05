const $btns = document.querySelectorAll(".btn");
const $prevBtn = document.querySelector(".prev");
const $nextBtn = document.querySelector(".next");
const $sliderDot = document.querySelector(".slider-dot");
const $dots = $sliderDot.querySelectorAll("span");
const $sliderUl = document.querySelector(".slider-ul");

let isAnimating = false; // 애니메이션 진행중 여부

const handleSecondMoveStyle = () => {
  $sliderUl.style.transition = "transform 0.5s ease";
  $sliderUl.style.transform = "translateX(-25%)";
};
const handlePrevMove = (changeCount) => {
  if (isAnimating) return;
  isAnimating = true;

  for (let i = 0; i < changeCount; i++) {
    $sliderUl.insertBefore(
      $sliderUl.lastElementChild,
      $sliderUl.firstElementChild
    );
  }
  $sliderUl.style.transition = "none";
  $sliderUl.style.transform = "translateX(-50%)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      handleSecondMoveStyle();
      $sliderUl.addEventListener(
        "transitionend",
        () => {
          isAnimating = false;
          updatePagination();
        },
        { once: true }
      );
    });
  });
};

const handleNextMove = (changeCount) => {
  if (isAnimating) return;
  isAnimating = true;

  for (let i = 0; i < changeCount; i++) {
    $sliderUl.appendChild($sliderUl.firstElementChild);
  }
  $sliderUl.style.transition = "none";
  $sliderUl.style.transform = "translateX(0)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      handleSecondMoveStyle();
      $sliderUl.addEventListener(
        "transitionend",
        () => {
          isAnimating = false;
          updatePagination();
        },
        { once: true }
      );
    });
  });
};

const getIndexDiff = (item) => {
  const $slider = document.querySelectorAll(".slider");
  const $sliderIndex = Number($slider[1].innerText);
  const $paginationIndex = Number(item.classList[0][3]);
  console.log("slider", $sliderIndex, "   /pagination", $paginationIndex);
  let diffIndex = $sliderIndex - $paginationIndex;
  return diffIndex;
};

const handlePagination = (item) => {
  let diffIndex = getIndexDiff(item);
  console.log(diffIndex);
  if (diffIndex < 0) {
    diffIndex = Math.abs(diffIndex);
    handleNextMove(diffIndex);
  } else if (diffIndex > 0) {
    handlePrevMove(diffIndex);
  }
};

const updatePagination = () => {
  const $slider = document.querySelectorAll(".slider");
  const currentSliderIndex = Number($slider[1].innerText) - 1;
  $dots.forEach((dot) => dot.classList.remove("on"));
  $dots[currentSliderIndex % $dots.length].classList.add("on");
};

$prevBtn.addEventListener("click", () => {
  handlePrevMove(1);
});
$nextBtn.addEventListener("click", () => {
  handleNextMove(1);
});

$sliderDot.addEventListener("click", (e) => {
  let destinationDot = e.target;
  handlePagination(destinationDot);
});

const init = () => {
  $sliderUl.prepend($sliderUl.lastElementChild); //! 화면 반짝이는 문제 여전히 존재
  updatePagination();
};

init();
