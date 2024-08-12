//todo 지금 어떤 단어를 검색한 상태인지를 보여주어야 한다. 최근 검색 단어도 표시해주면 좋을듯
// 검색 후 페이지네이션 오류 => 검색한 값을 따로 관리해주어야 함
//* DOM Elements
const $newsCon = document.querySelector('ul.news-con');
const $categoryCon = document.querySelector('ul.category-con');
const $paginationCon = document.querySelector('.pagination-con');
const $inputArea = document.querySelector('.input-area');
const [$searchInput, $searchBtn] = document.querySelectorAll('.input-area > *');
//* API INFO
const API_KEY = 'cda1c180075c4715917bd730e587b937';
const API_URL = 'https://newsapi.org/v2/top-headlines?country=us';
const PAGE_SIZE = 6;

//* States
let currentPage = 1;
let category = '';
let totalPages = 1; //* 전체 페이지 수 - 페이지네이션에 필요함
let input = '';
let currentSearchingInput = ''; //* searchBtn을 누를 때의 값을 저장함
const generateSequentialNumbers = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

//* Utility Functions
const generatePaginationNumbers = ({ currentPage, totalPages }) => {
  if (totalPages <= 10) return generateSequentialNumbers(1, totalPages); //* 총 페이지 수가 10 이하인 경우 모든 페이지 번호 표시
  let start = Math.max(currentPage - 4, 1);
  let end = Math.min(start + 9, totalPages);
  start = Math.max(end - 9, 1); //* end가 totalPages에 도달했을 때, start를 조정
  return generateSequentialNumbers(start, end);
};
// const createUrl = ({ page, category, input }) => ``; //! 임시
const createUrl = ({ page, category, input }) =>
  `${API_URL}&apiKey=${API_KEY}${
    input ? `&q=${input}` : ''
  }&pageSize=${PAGE_SIZE}&page=${page}${
    category ? `&category=${category}` : ''
  }`;
const createNewsHtml = (news) => `
        <li class="news">
          <div class="news-img">
            <img src="${
              news.urlToImage ??
              'https://www.its.ac.id/tmesin/wp-content/uploads/sites/22/2022/07/no-image.png'
            }" alt="news-img" />
          </div>
          <p class="tit">${news.title}</p>
          <p class="desc">${news.description ?? 'No Desc'}</p>
          <span class="source">${news.source.name ?? ''}</span>
          <span class="author">${news.author ?? '작성자 없음'}</span>
          <span class="date">${news.publishedAt ?? ''}</span>
          <a class="more" href="${news.url}" target="_blank"></a>
        </li>
    `;
const updatePagination = ({ currentPage }) => {
  const newPaginationNumbers = generatePaginationNumbers({
    currentPage,
    totalPages,
  });
  for (let page = 1; page <= totalPages; page++)
    $paginationCon.children[page].classList.remove('visible');
  newPaginationNumbers.forEach((page) => {
    $paginationCon.children[page].classList.add('visible');
  });
};
const changeCurrentPage = ({ targetPage }) => {
  $paginationCon.children[currentPage]?.classList.remove('on'); // next버튼 포함해서 인덱스 계산
  $paginationCon.children[targetPage]?.classList.add('on');
  currentPage = targetPage;
  //* currentPage에 따른 Pagination
  updatePagination({ currentPage });
};
//* fetch 시 최초 1번만 실행. 여기서 전부 만들어놓고 display 속성으로 pagination 처리
const initializePaginationBtns = ({ totalPages }) => {
  $paginationCon
    .querySelectorAll('.pagination-btn')
    .forEach((node) => node.remove());
  //* pagination 전부 제거
  const $fragment = new DocumentFragment();
  for (let page = 1; page <= totalPages; page++) {
    const $newBtn = document.createElement('button');
    $newBtn.classList.add('pagination-btn');
    $newBtn.dataset.page = page; //* 버튼 별로 페이지 할당
    $newBtn.textContent = page; //* 버튼 별로 페이지 할당
    $fragment.appendChild($newBtn);
  }
  $paginationCon.insertBefore($fragment, $paginationCon.lastElementChild); //* '다음'버튼 전에 삽입
  changeCurrentPage({ targetPage: 1 }); //* pagination btn은 init 시 또는 새로운 카테고리 선택 후 최초 1번만 실행되므로
};

//* Fetch API
const getNews = async ({ page, category, input }) => {
  if (!page) {
    console.error('페이지 설정 안함');
    return;
  }
  const res = await fetch(createUrl({ page, category, input }));
  if (res.ok) {
    const data = await res.json();
    totalPages = Math.ceil(+data.totalResults / PAGE_SIZE);
    return data.articles;
  }
  //! Error
  console.error('fetch 실패');
  return null;
};

//* 주요 함수
const renderNews = (newsList) =>
  ($newsCon.innerHTML = newsList.map((news) => createNewsHtml(news)).join(''));

const getAndRenderNews = async ({
  page,
  category = '',
  input = currentSearchingInput,
  isInit = false,
}) => {
  const articles = await getNews({ page, category, input });
  renderNews(articles);
  isInit //* 첫 페이지 렌더링 => totalPages가 바뀌므로 버튼을 초기화해야 함
    ? initializePaginationBtns({ totalPages })
    : changeCurrentPage({ targetPage: page }); //* 단순 페이지 이동
};
//* Init
const init = async () => {
  await getAndRenderNews({ page: 1, isInit: true });
  $searchInput.focus();
};
init();

//* Event Handlers
const onClickCategoryCon = (e) => {
  const { target } = e;
  const $newCategory = target.closest('li.category');
  $categoryCon.querySelector('.on')?.classList.remove('on');
  if ($newCategory && category === $newCategory.dataset.category) {
    // todo 같은 카테고리 다시 누를 시 .on 해제 기능 추가
    getAndRenderNews({ page: 1, category: '', isInit: true });
    category = '';
    return;
  }
  //* 같은 카테고리면 이벤트 발생 X
  $newCategory.classList.add('on');
  category = $newCategory.dataset.category;
  getAndRenderNews({ page: 1, category, isInit: true }); //* 카테고리 변경 시 isInit true 설정 -> 페이지네이션 다시 생성
};
const onClickPaginationCon = (e) => {
  const { target } = e;
  if (target.matches('.pagination-btn')) {
    const targetPage = +target.dataset.page;
    getAndRenderNews({ page: targetPage, category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (target.matches('.prev') && currentPage - 1 > 0)
    getAndRenderNews({
      page: currentPage - 1,
      category,
    });

  if (target.matches('.next') && currentPage + 1 <= totalPages)
    getAndRenderNews({
      page: currentPage + 1,
      category,
    });
};
const onClickSearchBtn = async () => {
  currentSearchingInput = input; //* 검색어 변경
  await getAndRenderNews({
    page: 1,
    category,
    input, //* 자동으로 currentSearchingInput이 들어감
    isInit: true,
  });
  const $prevSearchedWord = $inputArea.querySelector('span');
  if (!input.trim()) {
    //* 아무것도 입력하지 않았을 때 검색어 삭제
    $prevSearchedWord.remove();
    return;
  }
  const $searchedWord = document.createElement('span');
  $searchedWord.textContent = input;
  $searchedWord.classList.add('searched-word');
  $prevSearchedWord
    ? $inputArea.replaceChild($searchedWord, $prevSearchedWord)
    : $inputArea.appendChild($searchedWord);
  input = '';
  $searchInput.value = '';
  $searchInput.focus();
};
//* Event Listeners
$categoryCon.addEventListener('mouseup', onClickCategoryCon);
$paginationCon.addEventListener('mouseup', onClickPaginationCon);
$searchBtn.addEventListener('mouseup', onClickSearchBtn);
$searchInput.addEventListener('keydown', (e) => {
  input = $searchInput.value;
  if (e.key === 'Enter') {
    e.preventDefault();
    onClickSearchBtn();
  }
});
