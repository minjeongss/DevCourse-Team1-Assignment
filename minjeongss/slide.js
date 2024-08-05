const $btns = document.querySelectorAll(".btn");
const $prevBtn = document.querySelector(".prev");
const $nextBtn = document.querySelector(".next");
const $sliderDot = document.querySelector(".slider-dot");
const $dots = $sliderDot.querySelectorAll("span");

let isAnimating = false; // 애니메이션 진행중 여부

const handlePrevMove = (changeCount) => {
  if (isAnimating) return;
  isAnimating = true;

  const $sliderUl = document.querySelector(".slider-ul");
  const $slider = document.querySelectorAll(".slider");

  for (let i = 0; i < changeCount; i++) {
    const lastElement = $sliderUl.lastElementChild.cloneNode(true);
    console.log(lastElement);
    $sliderUl.removeChild($sliderUl.lastElementChild);
    $sliderUl.insertBefore(lastElement, $sliderUl.firstElementChild);
  }
  $sliderUl.style.transition = "none";
  $sliderUl.style.transform = "translateX(-50%)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      $sliderUl.style.transition = "transform 0.5s ease";
      $sliderUl.style.transform = "translateX(-25%)";
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

  const $sliderUl = document.querySelector(".slider-ul");
  const $slider = document.querySelectorAll(".slider");

  for (let i = 0; i < changeCount; i++) {
    const firstElement = $sliderUl.firstElementChild.cloneNode(true);
    console.log(firstElement);
    $sliderUl.removeChild($sliderUl.firstElementChild);
    $sliderUl.appendChild(firstElement);
  }
  $sliderUl.style.transition = "none";
  $sliderUl.style.transform = "translateX(0)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      $sliderUl.style.transition = "transform 0.5s ease";
      $sliderUl.style.transform = "translateX(-25%)";
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

const handlePageIndex = (item) => {
  const $slider = document.querySelectorAll(".slider");
  const $sliderIndex = Number($slider[1].innerText);
  const $paginationIndex = Number(item.classList[0][3]);
  console.log("slider", $sliderIndex, "   /pagination", $paginationIndex);
  let diffIndex = $sliderIndex - $paginationIndex;
  return diffIndex;
};

const handlePagination = (item) => {
  let diffIndex = handlePageIndex(item);
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

handlePrevMove(1);
//prepend를 한 번만 진행하는 것도 방법인데?
//4123의 형태로 두는거지
