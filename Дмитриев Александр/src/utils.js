function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      var key = obj[property].toLowerCase();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
}

module.exports = {
    groupBy,
};