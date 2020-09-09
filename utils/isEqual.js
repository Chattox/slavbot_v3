// Literally just check 2 objs for value equality
const isEqual = (obj1, obj2) => {
  for (prop in obj1) {
    if (!(prop in obj2) || obj1[prop] !== obj2[prop]) {
      return false;
    }
  }
  for (prop in obj2) {
    if (!(prop in obj1) || obj2[prop] !== obj1[prop]) {
      return false;
    }
  }
  return true;
};

module.exports = { isEqual };
