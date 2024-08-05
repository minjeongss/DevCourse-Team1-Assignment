// prev active next
// transform: translate

// next(), prev()
// rotate(count)
// transitionend

// ⬆️ 수업시간에 강사님이 설명하신 내용을 듣고 생각한 내용

// ⬇️ 만들기 시작하면서 작성한 내용들

/**
 * [어떻게 처리해야될지!!]
 * 0. slide가 넘어가는 방식
 *
 * 1. prev, next 버튼 클릭!
 *
 * 2. dots 클릭 + 동적으로 추가
 */
const $sliderUl = document.querySelector(".sliderUl");
const $sliderDot = document.querySelector(".slider-dot");
// prev, next는 EventListener 등록 이외에 따로 쓰이지 않아서 변수에 저장안함
const $slider = () => $sliderUl.querySelectorAll(".slider");

let currentIdx = 0;
const updateCurrentIdx = () => {
    currentIdx = $sliderUl.firstElementChild.dataset.idx;
};

// 0. slide가 넘어가는 방식
/**
 * slider와 dots 내부를 재구성?회전?하는 함수입니다.
 * 재귀 형식으로 작성하는게 좋아보여서 그렇게 작성해봤습니다!
 * @param {number} count 몇 번 반복할지 횟수
 * @param {"prev"|"next"} direction 방향 (이전, 다음)
 */
const rotate = (count, direction = "next") => {
    const $slides = Array.from($slider());
    const $dots = Array.from($sliderDot.children);
    if (count === 0) {
        // count가 0이라면 종료
        return;
    }
    if (direction === "next") {
        // 다음으로 넘긴다면 current 기준 prev가 된 자식요소를 마지막으로 이동
        $sliderUl.appendChild($slides.shift());
        $sliderDot.appendChild($dots.shift());
    } else {
        // 이전으로 넘긴다면 맨 마지막 자식을 current로 이동
        $sliderUl.prepend($slides.pop());
        $sliderDot.prepend($dots.pop());
    }
    rotate(count - 1, direction);
};

// 1.prev, next 버튼 클릭!
/**
 * transform 스타일을 count에 따라 반환해주는 함수입니다.
 * @param {number} count
 * @returns cssText - transform
 */
const createTransformText = (count) => {
    const DEFAULT_WIDTH = 100 / 3;
    return `transform: translateX(${-DEFAULT_WIDTH * count}%)`;
};
/**
 * slide를 prev로 이동하는 함수입니다.
 * slide를 먼저 이동시키고, 이후에 애니메이션을 실행시킵니다.
 * @param {number} count
 */
const prev = (count) => {
    $sliderUl.style.cssText = `transition: none; ${createTransformText(count)}`;
    rotate(count, "prev");
    setTimeout(() => {
        // 이동 시킨 이후에 애니메이션 발생을 위한 처리
        $sliderUl.style.cssText = ``;
        updateCurrentIdx();
    }, count);
};
/**
 * slide를 next로 이동하는 함수입니다.
 * 애니메이션을 먼저 작동시키고, 이후에 slide 이동시킵니다.
 * @param {number} count
 */
const next = (count) => {
    $sliderUl.style.cssText = createTransformText(count);
    $sliderUl.addEventListener(
        // $sliderUl의 transition이 끝나면 transition이 진행되지 않도록 막고 rotate 함수 실행
        "transitionend",
        () => {
            rotate(count);
            $sliderUl.style.cssText = `transition: none;`;
            updateCurrentIdx();
        },
        { once: true }
    );
};

// 2. dots 클릭 + 동적으로 추가
/**
 * dots 클릭 이벤트 핸들러입니다.
 * @param {EventListenerOrEventListenerObject} event
 */
const handleDotClick = (event) => {
    const { target } = event;
    if (!target.dataset.idx) {
        // 클릭된 항목에 data-idx 속성이 없다면 더이상 진행하지 않음
        return;
    }
    const targetCount = currentIdx - target.dataset.idx;
    if (targetCount < 0) {
        // targetCount가 더 크기 때문에 next 방향으로 이동
        next(Math.abs(targetCount));
    } else {
        // targetCount가 더 작기 때문에 prev 방향으로 이동
        prev(Math.abs(targetCount));
    }
};
/**
 * Dots 동적 추가를 위한 함수입니다.
 *  동적으로 추가하며 inline style로 left 값을 지정했습니다.
 *  click 이벤트 처리를 위한 data-idx를 추가했습니다.
 */
const createDots = () => {
    const size = $slider().length;
    $sliderDot.innerHTML = ""; // 혹시 모르니까(실제 사용자를 믿을 수 없으니까) 내부 비움
    for (let i = 0; i < size; i++) {
        const dot = document.createElement("span");
        dot.dataset.idx = i;
        dot.textContent = i + 1;
        dot.classList.add("dot");
        dot.style.left = `${i * 30}px`;
        $sliderDot.appendChild(dot);
    }
};
/**
 * 각각의 slider를 초기화하기 위한 함수입니다
 *  dots click 이벤트를 위해 data-idx 속성 추가했습니다.
 */
const initSlider = () => {
    let removed = 0;
    $sliderUl.querySelectorAll("& > *").forEach((item, idx) => {
        // sliderUl 직계자식 전체 검사
        if (!item.matches("li.slider")) {
            // (실제 사용자를 믿을 수 없으니까) slider가 붙어있지 않으면 슬라이더 제거
            removed += 1; // 뭔가 구려........
            item.remove();
            return;
        }
        item.dataset.idx = idx - removed;
    });
};
const init = () => {
    initSlider();
    createDots();
};
init();

// 오늘 아침 강사님이 말씀하신 부분(버튼 클릭 다다닥 했을 때 막기)
let clickTimeout = null;
// click 이벤트의 공통 부분 분리하기 위한 함수
const handleBtnClick = (fn) => {
    if (!clickTimeout) {
        fn();
        clickTimeout = setTimeout(() => {
            clearTimeout(clickTimeout);
            clickTimeout = null;
        }, 350);
    }
};

$sliderDot.addEventListener("click", handleDotClick);
document
    .querySelector(".prev")
    .addEventListener("click", () => handleBtnClick(() => prev(1)));
document
    .querySelector(".next")
    .addEventListener("click", () => handleBtnClick(() => next(1)));