let activeImgNumber = 1;
const setActiveImgNumber = function (temp) {
  activeImgNumber = temp;
};
const getActiveImgNumber = function () {
  return activeImgNumber;
};
let isScrolling = false;
const setIsScrolling = (bool) => {
  if (typeof bool !== 'boolean') return;
  isScrolling = bool;
};
const getIsScrolling = () => {
  return isScrolling;
};
export {
  setActiveImgNumber,
  getActiveImgNumber,
  setIsScrolling,
  getIsScrolling,
};
