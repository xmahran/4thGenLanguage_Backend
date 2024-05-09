const serializeDatabase = (state) => {
  const nodes = Array.from(state.values());
  const json = JSON.stringify(nodes);
  return json;
};
const deserializeDatabase = (json) => {
  const nodes = JSON.parse(json);
  const state = new Map(nodes.map((node) => [node.id, node]));
  return state;
};
module.exports = { serializeDatabase, deserializeDatabase };
