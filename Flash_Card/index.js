// localStorage의 data와 cards 변수의 데이터 동기화 시점 전부 다시 확인할 것
// 카드 없을 떼 curCardIdx -1로 처리할지 0으로 처리할지 다시 고민해볼 것

// 3개씩 항상 다시 랜더링하지 않고
// 1. 전부 li로 만들고 화면에만 반영하는 방법
// 2. 기존에 반영된 div는 유지및 event listener만 변경, 화면에 추가될 카드만 새로 생성(virtual dom처럼?)
// 두 방법 중 한가지로 바꿔야 성능 개선될 듯?

const modal = document.querySelector(".modal");
const modalOpenBtn = document.getElementById("add-card-btn");
const modalCloseBtn = document.getElementById("modal-close");
const addCardForm = document.getElementById("add-card-form");
const cardContainer = document.querySelector(".card-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const clearBtn = document.getElementById("clear-btn");
const cardCount = document.getElementById("card-count");

let cards = JSON.parse(localStorage.getItem("cards")) || [];

// 현재 인덱스도 스토리지에 저장해볼 것
let curCardIdx = 0;

const updateCardCount = () => {
  // if (cards.length) {
  //   cardCount.textContent = `${curCardIdx + 1} / ${cards.length}`;
  // } else {
  //   cardCount.textContent = `${0} / ${0}`;
  // }

  cardCount.textContent = `${curCardIdx + 1} / ${cards.length}`;
};

// 새로운 카드 localStorage에 저장하는 함수
const addCard = (question, answer) => {
  cards.push({ question, answer });
  localStorage.setItem("cards", JSON.stringify(cards));
};

// 카드 div 생성 및 addEventListener
// index를 parameter로 받아서 활용하도록 수정
// 가운데 요소만 flip되도록 event listener 추가
// index -1 카드, index + 1 카드에도 event listener에 move 함수 적용해볼 것
const createCard = (idx, isMid) => {
  console.log(idx);
  const newCard = document.createElement("div");
  newCard.className = "card";
  newCard.innerHTML = `
      <div class="front">
        <p>클릭하면 뒤집혀요</p>
        <p>${cards[idx].question}</p>
      </div>
      <div class="back">
        <p>클릭하면 뒤집혀요</p>
        <p>${cards[idx].answer}</p>
      </div>
    `;
  cardContainer.appendChild(newCard);

  if (isMid) {
    newCard.addEventListener("click", () => {
      newCard.classList.toggle("flipped");
    });
  }
};

// 현재 index -1 ~ +1 까지 화면에 랜더링 하고,
// 현재 index가 가운데 오도록
const renderCard = (curIdx) => {
  cardContainer.innerHTML = "";
  if (curIdx == -1) return;

  // 카드 개수에 따라 다른 UI 적용해볼 것
  // if (cards.length >= 3) {
  // } else if (cards.length == 2) {
  // } else if (cards.length == 1) {
  // }

  for (let i = -1; i < 2; i++) {
    if (i == 0) {
      createCard((curIdx + i + cards.length) % cards.length, true);
    } else {
      createCard((curIdx + i + cards.length) % cards.length, false);
    }
  }
  updateCardCount();
};

// 다음 카드 이전 카드 눌렀을 때도 적용
// flag가 true이면 왼쪽 이동, flag가 false이면 오른쪽 이동
const move = (flag) => {
  cardContainer.style.transition = "transform 0.6s ease";
  cardContainer.style.transform = flag
    ? "translateX(calc(100% / -3 * 2))"
    : "translateX(0)";

  setTimeout(() => {
    cardContainer.style.transition = "none";
    cardContainer.style.transform = "translateX(calc(100% / -3))";

    if (flag) {
      curCardIdx = (curCardIdx + 1) % cards.length;
      console.log(flag, curCardIdx);
      renderCard(curCardIdx);
    } else {
      curCardIdx = (curCardIdx - 1 + cards.length) % cards.length;
      console.log(flag, curCardIdx);
      renderCard(curCardIdx);
    }
  }, 600);
};

const handleCloseModal = () => {
  addCardForm.reset();
  modal.style.display = "none";
};

modalOpenBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

modalCloseBtn.addEventListener("click", () => {
  handleCloseModal();
});

// modal content 바깥 부분 눌렀을 때 모달 닫는 기능
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    handleCloseModal();
  }
});

addCardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = document.getElementById("question").value;
  const answer = document.getElementById("answer").value;
  if (!question || !answer) return;

  addCard(question, answer);
  curCardIdx = cards.length - 1;
  renderCard(curCardIdx);
  handleCloseModal();
});

prevBtn.addEventListener("click", () => {
  move(false);
});

nextBtn.addEventListener("click", () => {
  move(true);
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("cards");
  cards = [];
  renderCard(-1);
  curCardIdx = -1;
  updateCardCount();
});

const init = () => {
  renderCard(curCardIdx);
  updateCardCount();
};

init();
