// 모든 기록 삭제하기를 클릭하면 localStorage 정보가 삭제됨
// 질문과 답중 하나라도 입력하지 않으면 추가하기 버튼 클릭 시 메시지 알림
// 추가하면 active
// 연속 버튼 클릭 막기
// 전체 카드의 숫자와 현재 카드의 숫자가 표기됨.
// 초기 데이터는 localStorage에서 가져온 데이터로 카드가 만들어지며 등록된 정보가 없을 때는 새로운 카드를 입력해 주세요 라는 메시지만 보임
//* DOM Elements
const $cardCon = document.querySelector('.card-con');
const $btnCon = document.querySelector('.btn-con');
const $addModalBtn = document.querySelector('.modal-btn');
const $modalWrap = document.querySelector('.modal-wrap');
const $addModal = document.querySelector('.add.modal');
const $alertModal = document.querySelector('.alert.modal');
const [$questionInput, $answerInput] =
  $addModal.querySelectorAll('.modal textarea');
const [$activePage, , $totalPage] = document.querySelectorAll('.btn-con  span');

//* States
let activeIndex = 0;
let isSliding = false;

//* Utility Functions
const generateId = function () {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD 형식의 날짜
  const randomString = Math.random().toString(36).slice(2, 11); // 무작위 문자열
  return `id-${date}-${randomString}`;
};
const handleModal = function ({ type, modal = $addModal }) {
  switch (type) {
    case 'on':
      if (modal === $addModal && !$addModal.classList.contains('on')) {
        $addModal.classList.add('on');
        $modalWrap.classList.add('on');
      }
      if (modal === $alertModal && !$alertModal.classList.contains('on')) {
        $alertModal.classList.add('on');
      }
      break;
    case 'off':
      if (modal === $addModal && $addModal.classList.contains('on')) {
        $addModal.classList.remove('on');
        $modalWrap.classList.remove('on');
        setTimeout(() => {
          $questionInput.value = '';
          $answerInput.value = '';
        }, 300); //* 모달 닫히는 시간
      }
      if (modal === $alertModal && $alertModal.classList.contains('on'))
        $alertModal.classList.remove('on');

      break;
  }
};

const updateTotalPage = () =>
  ($totalPage.textContent = $cardCon.children.length);
const updateActivePage = (activePage) => ($activePage.textContent = activePage);
//* LocalStorage CRUD
const getCardInfoListFromLocalStorage = () =>
  JSON.parse(localStorage.getItem('card_info-list')) ?? [];
const setCardInfoListToLocalStorage = (newCardInfoList) =>
  localStorage.setItem('card_info-list', JSON.stringify(newCardInfoList));

const addToLocalStorage = ({ id, question, answer }) => {
  const oldCardInfoList = getCardInfoListFromLocalStorage();
  const newCardInfoList = [...oldCardInfoList, { id, question, answer }];
  setCardInfoListToLocalStorage(newCardInfoList);
};
const deleteFromLocalStorage = ({ id }) => {
  const newCardInfoList = getCardInfoListFromLocalStorage().filter(
    (item) => item.id !== id
  );
  setCardInfoListToLocalStorage(newCardInfoList);
};
/**
 * 원하는 idx의 card를 center로 이동시켜주는 함수
 * $newItem이 있다면 새로 추가하는 것
 * $newItem이 없다면 페이지 이동하는 것(현재는 delete 시에만 사용. 차후 페이지네이션 추가하면 이용 가능)
 * @param {number} idx
 * @param {Node} $targetItem
 */
const alignCenter = ({ idx, $newItem }) => {
  if (!$newItem) $newItem = $cardCon.children[idx];
  [...$cardCon.children].forEach(($child) => {
    $child.classList.remove('left', 'right', 'center', 'waiting');
  });
  activeIndex = idx; //* 마지막 요소로 추가할 것이므로, activeIndex를 마지막 요소로 설정
  if ($newItem) $newItem.className = 'card center'; //* 마지막 요소 center 설정
  if (activeIndex > 0)
    $cardCon.children[activeIndex - 1].className = 'card left'; //* 왼쪽 요소
  if (activeIndex + 1 < $cardCon.children.length)
    $cardCon.children[activeIndex + 1].className = 'card right'; //* 오른쪽 요소
  for (let i = 0; i < activeIndex - 1; i++)
    $cardCon.children[i].className = 'card left waiting'; //* 모두 왼쪽에서 대기
  for (let i = activeIndex + 2; i < $cardCon.length; i++)
    $cardCon.children[i].className = 'card left waiting';
  updateActivePage(activeIndex + 1);
};
//* 주요 함수
const addItem = ({ id, question, answer }) => {
  const isItemFromLocalStorage = !!id;
  if (
    !isItemFromLocalStorage &&
    (!$questionInput.value || !$answerInput.value)
  ) {
    handleModal({ type: 'on', modal: $alertModal });
    return;
  }
  const $newItem = document.createElement('li');
  const $newQuestion = document.createElement('div');
  const $newAnswer = document.createElement('div');
  const $delBtn = document.createElement('i');
  const itemId = id ?? generateId();
  alignCenter({ idx: $cardCon.children.length, $newItem });
  $delBtn.className = 'del-btn fa-solid fa-trash';
  $newItem.classList.add('card');
  $newQuestion.classList.add('question');
  $newAnswer.classList.add('answer');
  $newItem.append($newQuestion, $newAnswer);
  $newItem.dataset.id = itemId;
  $newQuestion.textContent = question ?? $questionInput.value;
  $newAnswer.textContent = answer ?? $answerInput.value;
  $newQuestion.appendChild($delBtn);
  $newAnswer.appendChild($delBtn.cloneNode());
  $cardCon.appendChild($newItem);
  updateTotalPage();
  if (!isItemFromLocalStorage) {
    addToLocalStorage({
      id: itemId,
      answer: $answerInput.value,
      question: $questionInput.value,
    });
    $questionInput.value = '';
    $answerInput.value = '';
  }
  handleModal({ type: 'off' });
};

const deleteItem = ({ id }) => {
  const $targetItem = [...$cardCon.children].find(
    (card) => card.dataset.id === id
  );
  const nextActiveIdx = [...$cardCon.children].indexOf($targetItem) - 1;
  $cardCon.removeChild($targetItem);
  deleteFromLocalStorage({ id });
  alignCenter({ idx: nextActiveIdx < 0 ? 0 : nextActiveIdx });
  updateTotalPage();
};

//* init
const initialCardInfoList = getCardInfoListFromLocalStorage();
initialCardInfoList.forEach((item) => addItem({ ...item }));

//* Event Functions
const onClickCard = (e) => {
  const { target } = e;
  if (!target.closest('.card-con')) return;
  if (target.closest('.del-btn')) {
    deleteItem({ id: target.closest('.card').dataset.id });
    return;
  }
  const $card = target.closest('.card');
  if ($card) {
    // 카드 클릭 -> question, answer 뒤집기
    [...$card.children].forEach((child) => child.classList.toggle('rotate'));
  }
};
const onClickPrev = () => {
  if (isSliding || activeIndex - 1 < 0) return;
  isSliding = true;
  setTimeout(() => {
    isSliding = false;
  }, 500); //* transitionTime 이후 다시 클릭 가능
  //* left waiting -> left
  $cardCon.children[activeIndex - 2]?.classList.remove('waiting');
  //* left -> center
  $cardCon.children[activeIndex - 1]?.classList.replace('left', 'center');
  //* center -> right
  [...$cardCon.children[activeIndex]?.children].forEach(
    (child) => child.classList.remove('rotate') //! rotate 상태라면 해제
  );
  $cardCon.children[activeIndex]?.classList.replace('center', 'right');
  //* right -> right waiting
  $cardCon.children[activeIndex + 1]?.classList.add('waiting');
  activeIndex--;
  updateActivePage(activeIndex + 1);
};
const onClickNext = () => {
  if (isSliding || activeIndex + 1 >= $cardCon.children.length) return;
  isSliding = true;
  setTimeout(() => {
    isSliding = false;
  }, 500); //* transitionTime 이후 다시 클릭 가능
  // left waiting, left, center, right, right waiting.
  //* left -> left waiting
  $cardCon.children[activeIndex - 1]?.classList.add('waiting'); // left 있으므로 waiting 추가 -> left waiting
  //* center -> left
  [...$cardCon.children[activeIndex]?.children].forEach(
    (child) => child.classList.remove('rotate') //! rotate 상태라면 해제
  );
  $cardCon.children[activeIndex]?.classList.replace('center', 'left'); // center -> left
  //* right -> center
  $cardCon.children[activeIndex + 1]?.classList.replace('right', 'center'); // right 제거, center 추가
  //* right waiting -> right
  $cardCon.children[activeIndex + 2]?.classList.remove('waiting'); // waiting 제거
  activeIndex++;
  updateActivePage(activeIndex + 1);
};
const onClickBtnCon = (e) => {
  const { target } = e;
  if (!target.closest('.btn-con')) return;
  if (target.closest('.next-btn')) onClickNext();
  if (target.closest('.prev-btn')) onClickPrev();
  if (target.closest('.del_all-btn')) {
    $cardCon.replaceChildren(); //! 모든 자식 요소 삭제
    localStorage.clear();
  }
};
const onClickModalBtn = (e) => {
  handleModal({ type: 'on' });
  setTimeout(() => {
    $questionInput.focus();
  }); //! 비동기 처리해주지 않으면 단축키 이용 시 +가 들어감
};

//* Event Listeners
$cardCon.addEventListener('mouseup', onClickCard);
$btnCon.addEventListener('mouseup', onClickBtnCon);
$addModalBtn.addEventListener('mouseup', onClickModalBtn);
$addModal.addEventListener('mouseup', (e) => {
  const { target } = e;
  if (!target.closest('.modal')) return;
  if (target.closest('.close-btn')) {
    handleModal({ type: 'off' });
    return;
  }
  if (target.closest('.add-btn')) {
    addItem({});
    return;
  }
  handleModal({ type: 'off', modal: $alertModal });
});

$modalWrap.addEventListener('mouseup', () => {
  handleModal({ type: 'off', modal: $alertModal });
});

//* 단축키
document.addEventListener('keydown', (e) => {
  console.log(e.key);
  switch (e.key) {
    case '+':
      onClickModalBtn();
      break;
    case 'ArrowLeft':
      onClickPrev();
      break;
    case 'ArrowRight':
      onClickNext();
      break;
  }
});
