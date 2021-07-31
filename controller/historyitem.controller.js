const historyItemModel = require("../model/hisroryitem");

const createItems = (items) => {
  return historyItemModel.create(items);
};

module.exports = {
  createItems,
};
