export const decodeHtmlEntity = function(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};
