const query = (state, predicate) => {
  const nodes = Array.from(state.values());
  const matches = nodes.filter(predicate);
  return matches;
};
const nameQuery = (name) => (node) => node.name === name;
const hashQuery = (hash) => (node) => node.prevHash === hash;
const typeQuery = (type) => (node) => node.type === type;
const emailQuery = (email) => (node) => node.content[0].email === email;
const usernameQuery = (username) => (node) =>
  node.content[0].username === username;
const sellerIDQuery = (sellerID) => (node) =>
  node.content[0].sellerID === sellerID;
const itemIDQuery = (itemID) => (node) => node.content[0].itemID === itemID;
const ethAddressQuery = (ethAddress) => (node) =>
  node.content[0].ethAddress === ethAddress;

module.exports = {
  query,
  nameQuery,
  hashQuery,
  typeQuery,
  emailQuery,
  itemIDQuery,
  ethAddressQuery,
  usernameQuery,
  sellerIDQuery,
};
