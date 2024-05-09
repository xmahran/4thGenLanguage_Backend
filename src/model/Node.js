class Node {
  constructor(id, role, name, prevHash = null, content = [{}]) {
    //prevHash ,content -> null
    this.id = id;
    this.role = role;
    this.name = name;
    this.prevHash = prevHash; //hash of prev node
    this.content = content;
  }
}

function addNode(state, node) {
  state.set(node.id, node); //each node id(string) maps to a Node
  return state;
}
function removeNode(state, id) {
  return state.delete(id);
}
function updateNode(state, node) {
  state.set(node.id, node);
  return state;
}
function getNode(state, id) {
  return state.get(id);
}
function getPrevHash(state, id) {
  const node = state.get(id);
  return node.prevHash;
}

module.exports = {
  Node,
  addNode,
  removeNode,
  updateNode,
  getNode,
  getPrevHash,
};
