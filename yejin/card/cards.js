import CardStorage from "./cardStorage.js";

const $cards = document.querySelector(".cards");
const $modal = document.querySelector(".modal");
const $pageInfo = document.querySelector(".pageInfo");
const $newCardForm = document.getElementById("newCard");

const cardStorage = new CardStorage();

let currentIdx = 0;
let cardsLength = 0;

// 모든 기록 삭제
const handleClearBtnClick = () => {
    cardStorage.clear();
    $cards.innerHTML = "";
    currentIdx = 0;
    cardsLength = 0;
    setPageText();
};

// 위치 이동을 위한 function
const move = (pos) => {
    if (pos === 0) {
        const $cardList = $cards.querySelectorAll(".card");
        $cardList.forEach(($card, idx) => {
            $card.classList.remove("reverse");
            $card.classList.toggle("active", idx === currentIdx);
            $card.style.cssText = // active 뒤에 있는 card들이 순서대로 보이도록!
                idx > currentIdx ? `z-index: ${cardsLength - idx}` : "";
        });
        setPageText(currentIdx + 1);
        return;
    }
    // -면 prev, +면 next
    if (pos < 0) {
        currentIdx = currentIdx === 0 ? cardsLength - 1 : currentIdx - 1;
        move(pos + 1);
    } else {
        currentIdx = currentIdx === cardsLength - 1 ? 0 : currentIdx + 1;
        move(pos - 1);
    }
};
// 이전 / 다음 버튼 클릭
const handlePrevClick = () => {
    move(-1);
};
const handleNextClick = () => {
    move(1);
};

// 카드 클릭
const handleRemoveBtnClick = ({ target }) => {
    if (!target.matches(".removeBtn")) {
        return;
    }
    // 삭제작업
    if (confirm("삭제하시나요?")) {
        const $card = target.closest(".card");
        const id = $card.dataset.id;
        cardStorage.remove(id);
        $card.remove();
        cardsLength--;
        move(-1);
    }
};
const handleActiveCardClick = ({ target }) => {
    const $actived = target.closest(".active");
    if (target.matches(".removeBtn") || !$actived) {
        // removeBtn인 경우 제외
        // active card일 때만 실행을 위해!!
        return;
    }
    $actived.classList.toggle("reverse");
};

// 새로운 카드 추가
const createCardElement = ({ id, question, answer }) => {
    const $card = document.createElement("li");
    $card.classList.add("card");
    $card.dataset.id = id;
    $card.innerHTML = `
    <div class="front">
        <p class="content">${question}</p>
    </div>
    <div class="back">
        <p class="content">${answer}</p>
        <span class="btn removeBtn">삭제</div>
    </div>
    `;
    return $card;
};

// pageInfo의 텍스트 수정
const setPageText = (current = currentIdx + 1) => {
    let pageText = "";
    if (cardsLength !== 0) {
        pageText = `${current} / ${cardsLength}`;
    }
    $pageInfo.innerHTML = pageText;
};

// 입력폼 초기화
const resetInputForm = () => {
    $newCardForm.reset();
};
// 입력값이 빈 문자열이 아닌지 검증
const checkNotEmptyString = (str) => {
    return !!str.trim();
};

// modal 관련 event listeners
const handleModalOpen = () => {
    $modal.classList.add("on");
};
const handleModalClose = () => {
    $modal.classList.remove("on");
    resetInputForm();
};
const handleSubmit = (event) => {
    event.preventDefault();
    const { target } = event;
    const question = target.question.value;
    const answer = target.answer.value;
    if (checkNotEmptyString(question) && checkNotEmptyString(answer)) {
        const cardItem = { question, answer };
        const id = cardStorage.create(cardItem);
        const $card = createCardElement({ id, ...cardItem });
        $card.classList.add("active");

        $cards.appendChild($card);
        cardsLength = $cards.children.length;
        move(cardsLength - currentIdx - 1);
        handleModalClose();
    } else {
        // 통과하지 못함!!
        alert("모두 입력해주세요~!");
    }
};

$cards.addEventListener("click", handleRemoveBtnClick);
$cards.addEventListener("click", handleActiveCardClick);
$newCardForm.addEventListener("submit", handleSubmit);

document.querySelector(".prevBtn").addEventListener("click", handlePrevClick);
document.querySelector(".nextBtn").addEventListener("click", handleNextClick);

document
    .querySelector(".clearBtn")
    .addEventListener("click", handleClearBtnClick);

document
    .querySelector(".emptyCards")
    .addEventListener("click", handleModalOpen);
document.querySelector(".addBtn").addEventListener("click", handleModalOpen);
document
    .querySelector(".modalCloseBtn")
    .addEventListener("click", handleModalClose);

// 초기화작업
const init = () => {
    const cards = cardStorage.getAll();
    cardsLength = cards.length;
    cards.forEach((card, idx) => {
        const $card = createCardElement(card);
        if (idx === currentIdx) {
            $card.classList.add("active");
        }
        $cards.appendChild($card);
    });
    setPageText();
};
init();
