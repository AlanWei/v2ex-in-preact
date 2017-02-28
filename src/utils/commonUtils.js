const BASE_URL = 'http://www.v2ex.com/api';

export function getTopicUrl(tab) {
  if (tab === 'hot' || tab === 'latest') {
    return `${BASE_URL}/topics/${tab}.json`;
  }
  if (isNaN(tab)) {
    return `${BASE_URL}/topics/show.json?node_name=${tab}`;
  }

  return `${BASE_URL}/topics/show.json?id=${tab}`;
}

export function getReplyUrl(id) {
  return `${BASE_URL}/replies/show.json?topic_id=${id}`;
}