const topics = {}; 
let subUid = -1;

const subscribe = (topic, func) => {
  if (!topics[topic]) {
    topics[topic] = [];
  }
  const token = (++subUid).toString();
  topics[topic].push({
    token,
    func
  });
  return token;
};

const publish = (topic, args) => {
  if (!topics[topic]) {
    return false;
  }
  setTimeout(() => {
    const subscribers = topics[topic];
    let len = subscribers ? subscribers.length : 0;

    while (len--) {
      subscribers[len].func(topic, args);
    }
  }, 0);
  return true;
};
export { publish, subscribe };