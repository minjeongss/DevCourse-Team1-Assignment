//일반 화면 변수 선언
//버튼
const $openBtn = document.querySelector(".openBtn");
const $closeBtn = document.querySelector(".closeBtn");
const $addBtn = document.querySelector(".addBtn");
const $delBtn = document.querySelector(".delBtn");
const $prevBtn = document.querySelector(".prevBtn");
const $nextBtn = document.querySelector(".nextBtn");

const $cards = document.querySelector(".cards");
const $cardCount = document.querySelector(".main>span");

//모달창 변수 선언
const $modal = document.querySelector(".modal");
const $question = document.querySelector(".questionInput");
const $answer = document.querySelector(".answerInput");

//전역 변수 선언
let cardList = [];
let id = 0; //!해당 부분 작동 과정 추적 필요
let curId = 1;
let cardLength = 0;

//함수 선언
/**
 * local storage로부터 값을 가져오는 함수
 * @returns {Array}
 */
const getFromLocal = () => {
  const prevList = JSON.parse(localStorage.getItem("cardList"));
  return prevList;
};
/**
 * local storage에 값을 저장하는 함수
 */
const saveToLocal = () => {
  localStorage.setItem("cardList", JSON.stringify(cardList));
};
/**
 * 보이는 화면에 값을 저장하는 함수
 * @param {string} question
 * @param {string} answer
 */
const saveToScreen = (question, answer) => {
  const card = makeCardTemplate();
  const cardQ = makeCardQ(question);
  const cardA = makeCardA(answer);

  card.appendChild(cardQ);
  card.appendChild(cardA);
  $cards.appendChild(card);
};
/**
 * 전체 카드 정보를 불러오는 함수
 */
const loadCard = () => {
  const storageList = getFromLocal();
  if (storageList) {
    cardLength = storageList.length;
    id = 0;

    const $card = document.querySelector(".card");
    curId = 1; //여기를 가장 첫번째 id로 수정
    cardList = storageList;
    storageList.forEach((card) => {
      saveToScreen(card.q, card.a);
      id++;
    });
  } else {
    curId = 0;
    cardLength = 0;
    $cards.innerHTML = "";
  }
};
/**
 * 카드를 선택하는 함수
 */
const updateCardSelected = () => {
  const $card = document.querySelector(".card.selected");
  if ($card) $card.classList.remove("selected");
  const selectedCard = document.querySelector(`.card[data-id="${curId - 1}"]`);
  if (selectedCard) {
    selectedCard.classList.add("selected");
  }
};
/**
 * 보이는 화면의 카드 인덱스와 총 개수를 나타내는 함수
 */
const updateCardCount = () => {
  $cardCount.innerText = `${curId} / ${cardLength}`;
};
/**
 * 모달의 input값을 모두 초기화하는 함수
 */
const resetInput = () => {
  $question.value = "";
  $answer.value = "";
};
/**
 * 카드의 상위 요소를 선언하는 함수
 * @returns li 태그
 */
const makeCardTemplate = () => {
  const li = document.createElement("li");
  li.dataset.id = id;
  li.classList.add("card");
  return li;
};
/**
 * 카드의 질문 요소를 선언하는 함수
 * @param {string} text
 * @returns p태그
 */
const makeCardQ = (text) => {
  const p = document.createElement("p");
  p.innerText = text;
  p.classList.add("question");
  return p;
};
/**
 * 카드의 답 요소를 선언하는 함수
 * @param {string} text
 * @returns p태그
 */
const makeCardA = (text) => {
  const p = document.createElement("p");
  p.innerText = text;
  p.classList.add("answer");
  p.classList.add("hide");
  return p;
};
/**
 * 카드를 하나 추가하는 함수
 */
const addCard = () => {
  const question = $question.value;
  const answer = $answer.value;

  if (question === "" || answer === "") {
    alert("모든 값을 입력해주세요!");
    resetInput();
    return;
  }

  //local Storage에 저장
  cardList.push({ id: id, q: question, a: answer });
  saveToLocal();

  //브라우저에 저장
  //? 브라우저라 부르는 것이 맞는지 의문
  saveToScreen(question, answer);
  cardLength++;
  if (curId === 0) {
    curId = 1;
  }

  id++;
  resetInput();
};
/**
 * 카드를 전체 삭제하는 함수
 */
const deleteCard = () => {
  localStorage.removeItem("cardList");
  cardList = [];
  curId = 0;
  id = 0;
  init();
};

//이벤트 선언
$openBtn.addEventListener("click", () => {
  $modal.classList.remove("hideModal");
  $modal.classList.add("showModal");
});
$closeBtn.addEventListener("click", () => {
  $modal.classList.remove("showModal");
  $modal.classList.add("hideModal");
  resetInput();
});
$addBtn.addEventListener("click", () => {
  addCard();
  updateCardSelected();
  updateCardCount();
});
$delBtn.addEventListener("click", () => {
  deleteCard();
  updateCardCount();
});
$prevBtn.addEventListener("click", () => {
  curId--;
  if (curId <= 0) curId = cardLength;
  updateCardSelected();
  updateCardCount();
});
$nextBtn.addEventListener("click", () => {
  curId++;
  if (curId > cardLength) curId = 1;
  updateCardSelected();
  updateCardCount();
});
$cards.addEventListener("click", (e) => {
  const li = e.target;
  if (li.classList.contains("card")) {
    const pQ = li.querySelector(".question");
    const pA = li.querySelector(".answer");
    pQ.classList.add("hide");
    pA.classList.remove("hide");
  }
});
$cards.addEventListener("mouseout", (e) => {
  const li = e.target;
  if (li.classList.contains("card")) {
    const pQ = li.querySelector(".question");
    const pA = li.querySelector(".answer");
    pQ.classList.remove("hide");
    pA.classList.add("hide");
  }
});

//초기화
const init = () => {
  loadCard();
  updateCardSelected();
  updateCardCount();
};
init();

/**
 * ? 문제
 * id, curId, cardLength로 분류하여 값을 업데이트하는게 맞는지 의문
 * 더 간단한 방법이 있지 않을까?
 */

/**
 * ! 문제
 * 모든 기록 삭제 후 항목을 추가했을 때, 카드가 선택되지 않음
 * 하지만 새로고침을 하면 올바르게 선택이 됨
 * addBtn과 updateCardSelected()를 추가해도 올바르게 선택이 되지 않음
 *
 * * 일부 원인 파악
 * * curId의 초기화가 제대로 되지 않아서 그런듯!
 *
 * ? curId 업데이트 부분
 * - 초기화
 *  - local Storage 값 존재: curId=1
 *  - local Storage 값 존재X: curId=0, 여기가 처리해야 하는 부분!
 * - 이전, 다음 버튼 클릭
 *  - 이전 버튼: curId--
 *  - 다음 버튼: curId++
 *
 * * 해결
 * addCard에 curId가 0이면 1로 업데이트하는 부분 추가
 */

/**
 * ! 1차 문제
 * 이전 상황: 카드 1개 추가 > 새로고침 >
 * 문제 상황: 카드 1개 추가하면 local Storage의 0이 업데이트됨(새롭게 추가되는 방식X)
 * 즉, 작업을 하다가 새로고침하고 카드를 추가하면 local Storage가 초기화되어 추가됨
 *
 * ? id를 추적하여 제대로 초기화하는 등 작업이 필요하지 않을까
 *
 * * 일부 해결
 * cardList를 업데이트하는 부분을 loadCard()에 추가함
 *
 * ! 2차 문제
 * 새로 고침하고 카드 새로 추가했을 때, selected 초기화가 안됨
 * local Storage에 잘 저장되고, cardList에 잘 저장됨
 * 하지만! selected가 설정되지 않아 카드가 안보이는 것처럼 보임
 * 이때, 새로 고침을 하면 selected가 제대로 설정되어 카드가 보임
 *
 * * 해결
 * deleteCard에 curId, id를 0으로 초기화
 *
 * ! 3차 문제
 * 새로 고침하고 카드 새로 추가한 후, 다음 버튼을 눌렀을 때 curId와 일치하지 않아 select 업데이트 되지 않음
 * 단, 이때도 새로고침을 하면 올바르게 작동
 * curId를 제대로 통제하지 못하고 있음
 *
 * * 해결
 * 4차 문제를 해결하며 동시에 해결됨
 *
 * ! 4차 문제
 * local Sotrage에 값이 존재하고, 새로고침을 했을 때 data-id가 이상하게 설정됨
 * load에서 id 설정을 다시 점검해야 함!
 *
 * * 해결
 * data-id는 항상 0부터 시작하도록 설정
 */
