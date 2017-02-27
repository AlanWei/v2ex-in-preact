export function getUrl(tab) {
  if (tab === 'hot' || tab === 'latest') {
    return `http://www.v2ex.com/api/topics/${tab}.json`;
  }
  return `http://www.v2ex.com/api/topics/show.json?node_name=${tab}`;
}