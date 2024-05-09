const { compareData } = require("../helpers/Encryption");

const query = (state, predicate) => {
  const nodes = Array.from(state.values());
  const matches = nodes.filter(predicate);
  return matches;
};
const nameQuery = (name) => (node) => node.name === name;
const hashQuery = (hash) => (node) => node.prevHash === hash;
const typeQuery = (type) => (node) => node.type === type;
const emailQuery = (email) => (node) => node.content[0].email === email;

module.exports = {
  query,
  nameQuery,
  hashQuery,
  typeQuery,
  emailQuery,
};
