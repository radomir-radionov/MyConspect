const MD_UP_QUERY = "(min-width: 768px)";

function mediaQuery() {
  return window.matchMedia(MD_UP_QUERY);
}

export function isMdUp() {
  return mediaQuery().matches;
}
