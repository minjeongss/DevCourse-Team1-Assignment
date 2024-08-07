import ShopStorage from "./shopStorage.js";

const storage = new ShopStorage();

const $itemInput = document.getElementById("itemInput");
const $addBtn = document.querySelector(".addBtn");
const $items = document.querySelector(".items");

const createItem = (text, id) => {
    const $item = document.createElement("li");

    $item.classList.add("item"); // $item.setAttribute("class", "item");
    $item.dataset.id = id; // $item.setAttribute("data-num", id.toString());
    $item.innerHTML = `
    <span>${text}</span>
    <i class="fa-solid fa-trash-can btn deleteBtn" data-id="${id}"></i>
    `;

    return $item;
};
const addNewItem = () => {
    const text = $itemInput.value;
    if (!text.trim()) {
        $itemInput.focus();
        return;
    }
    const id = storage.create(text);
    const $item = createItem(text, id);
    $items.appendChild($item);
    $item.scrollIntoView({ behavior: "smooth", block: "end" });

    $itemInput.value = "";
};

const handleDeleteBtnClick = (event) => {
    const { target } = event;
    if (!target.matches(".deleteBtn")) {
        return;
    }
    const id = target.dataset.id;
    const $item = target.parentElement; // document.querySelector(`.item[data-id="${id}"]`);

    storage.remove(id);
    $item.remove();
};

$addBtn.addEventListener("click", () => addNewItem());
$itemInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        addNewItem();
    }
});

$items.addEventListener("click", handleDeleteBtnClick);

const init = () => {
    $items.innerHTML = "";
    const items = storage.getAll();
    Object.keys(items).forEach((key) => {
        const $item = createItem(items[key], key);
        $items.appendChild($item);
        $item.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    $itemInput.focus();
};
init();
