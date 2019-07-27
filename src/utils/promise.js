export const delay = ms => {
  return new Promise((resolve, _) => {
    setTimeout(resolve, ms);
  });
};

export const makeAtLeastMs = (promise, ms) => {
  return new Promise((resolve, reject) => {
    Promise.all([promise, delay(ms)]).then(([result]) => {
      resolve(result);
    }, reject);
  });
};
