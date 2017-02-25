export function Request({
  url
}, loading, success, error) {
  fetch(url, {
    credentials: 'include'
  }).then((response) => {
    loading();
    return response.json();
  }).then((json) => {
    success(json);
  }).catch((ex) => {
    console.log('parsing failed', ex);
    error(ex);
  });
}