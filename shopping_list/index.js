//* DOM Elements
const INPUT_LIMIT = 20;
const $input = document.querySelector('.shop_item-input');
const $addBtn = document.querySelector('.add-btn');
const $itemCon = document.querySelector('.shop_item-con');

//* States
let currentInput = '';

//* Utility Functions
const generateId = function () {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD 형식의 날짜
  const randomString = Math.random().toString(36).slice(2, 11); // 무작위 문자열
  return `id-${date}-${randomString}`;
};
const limitInput = (e) => {
  const { target } = e;
  //* input 글자수 제한
  if (target.value.length > INPUT_LIMIT) {
    target.value = target.value.slice(0, INPUT_LIMIT);
    return;
  }
};
//* LocalStorage CRUD
const getShopItemsFromLocalStorage = () =>
  JSON.parse(localStorage.getItem('shop_item')) ?? [];
const setShopItemsToLocalStorage = (newShopItems) =>
  localStorage.setItem('shop_item', JSON.stringify(newShopItems));

const addToLocalStorage = ({ id, content }) => {
  const oldShopItems = getShopItemsFromLocalStorage();
  const newShopItems = [...oldShopItems, { id, content }];
  setShopItemsToLocalStorage(newShopItems);
};
const deleteFromLocalStorage = ({ id }) => {
  const newShopItems = getShopItemsFromLocalStorage().filter(
    (item) => item.id !== id
  );
  setShopItemsToLocalStorage(newShopItems);
};
const editFromLocalStorage = ({ id, newContent }) => {
  const shopItems = getShopItemsFromLocalStorage();
  shopItems.find((item) => item.id === id).content = newContent;
  setShopItemsToLocalStorage(shopItems);
};

const isDuplicate = ({ content }) => {
  // 중복검사
  const shopItems = getShopItemsFromLocalStorage();
  console.log(shopItems);
  console.log(content);

  return shopItems.some((item) => item.content === content);
};
//* CRUD related with DOM

const editShopItem = function ({ $targetShopItem }) {
  // edit-btn 2번 이상 클릭 시 예외처리
  if ($targetShopItem.querySelector('input')) {
    $targetShopItem.querySelector('input').focus();
    return;
  }
  const $editInput = document.createElement('input');
  const $itemText = $targetShopItem.querySelector('span');
  $targetShopItem.replaceChild($editInput, $itemText);
  $editInput.value = $itemText.textContent;
  $editInput.focus();
  $editInput.addEventListener('input', limitInput);
  $editInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      $itemText.textContent = $editInput.value;
      $targetShopItem.replaceChild($itemText, $editInput);
      $input.focus();
      editFromLocalStorage({
        id: $targetShopItem.dataset.id,
        newContent: $editInput.value,
      });
      return;
    }
  });
};
const deleteShopItem = function ({ id }) {
  const $targetChild = [...$itemCon.children].find(
    (item) => item.dataset.id === id
  );
  $itemCon.removeChild($targetChild);
  deleteFromLocalStorage({ id });
};
const addShopItem = function ({ content = currentInput, id }) {
  $input.focus();
  if (!content) return;
  if (!id && isDuplicate({ content })) return;
  const $newItem = document.createElement('li');
  const $itemText = document.createElement('span');
  const $delBtn = document.createElement('i');
  const $editBtn = document.createElement('i');
  const itemId = id ?? generateId();
  if (!id) addToLocalStorage({ content, id: itemId }); // local에서 가져온 id가 없으면 (새로운 item이면) 저장X
  $newItem.classList.add('shop_item');
  $itemText.textContent = content ?? currentInput;
  $newItem.dataset.id = itemId;
  $delBtn.className = 'del-btn fa-solid fa-trash';
  $editBtn.className = 'edit-btn fa-solid fa-pen-to-square';
  $newItem.append($itemText, $delBtn, $editBtn);
  $itemCon.appendChild($newItem);
  currentInput = '';
  $input.value = '';
  //* 스크롤 아래로 고정
  if (!id) $itemCon.scrollTo(0, $itemCon.scrollHeight);
  // $newItem.scrollIntoView({ block: 'end' });
};

//* inits
const initialShopItems = getShopItemsFromLocalStorage();
const $fragment = new DocumentFragment();
initialShopItems.forEach((item) => addShopItem({ ...item }));
$input.focus();

//* Event Listeners
$input.addEventListener('input', limitInput);

$input.addEventListener('keyup', (e) => {
  const { target, key } = e;
  if (key === 'Enter') {
    addShopItem({});
    return;
  }
  currentInput = target.value;
});

$itemCon.addEventListener('mouseup', (e) => {
  const { target } = e;
  if (target.closest('.del-btn'))
    deleteShopItem({ id: target.closest('li.shop_item').dataset.id });
  if (target.closest('.edit-btn'))
    editShopItem({
      $targetShopItem: target.closest('li.shop_item'),
    });
});
$addBtn.addEventListener('mouseup', addShopItem);
window.addEventListener('focus', () => {
  $input.focus(); //? 다른 웹 보다가 돌아오면 focus 되게하려 했는데 안 됨ㅜ
});
