import * as d3 from 'd3'

/**
 * Creates a fully connected bipartite graph with nodes in left and right sets
 * @param {number} leftCount Number of nodes in the left set
 * @param {number} rightCount Number of nodes in the right set
 * @param {Object} options Optional configuration
 * @returns {Object} Object containing nodes and links arrays
 */
export function createBipartiteGraph(leftCount = 2, rightCount = 3, options = {}) {
  const numEmbed = options.numEmbed || 8;
  // Alternative palette
  // var colorsV = ["#b5d9ea", "#c1d5e0", "#86bfe2", "#8facc6", "#76b6d6", "#c5e9f9", "#b5d9ea", "#c1d5e0", "#86bfe2", "#8facc6", "#76b6d6", "#c5e9f9", "#b5d9ea", "#c1d5e0", "#86bfe2", "#8facc6", "#76b6d6", "#c5e9f9", "#b5d9ea", "#c1d5e0", "#86bfe2", "#8facc6", "#76b6d6", "#c5e9f9"]
  const colors = options.colors || ["#f2b200", "#c69700", "#ffeaa9", "#ffd255", "#d19f00", "#edc949", "#f2b200", "#c69700", "#ffeaa9", "#ffd255", "#d19f00", "#edc949", "#f2b200", "#c69700", "#ffeaa9", "#ffd255", "#d19f00", "#edc949"];

  // Create nodes for both sets
  const nodes = [];

  // Create left set nodes
  for (let i = 0; i < leftCount; i++) {
    const node = {
      v: i,
      i: i,
      isNode: true,
      color: d3.color(colors[i % colors.length]),
      neighbors: [],
      set: 'left'
    };

    node.embed = d3.range(numEmbed).map(d => .05 + Math.random()*.95).map((v, i) => ({node, v, i}));
    node.outembed = d3.range(numEmbed).map(d => .05 + Math.random()*.95).map((v, i) => ({node, v, i}));

    nodes.push(node);
  }

  // Create right set nodes
  for (let i = 0; i < rightCount; i++) {
    const node = {
      v: i + leftCount,
      i: i + leftCount,
      isNode: true,
      color: d3.color(colors[(i + leftCount) % colors.length]),
      neighbors: [],
      set: 'right'
    };

    node.embed = d3.range(numEmbed).map(d => .05 + Math.random()*.95).map((v, i) => ({node, v, i}));
    node.outembed = d3.range(numEmbed).map(d => .05 + Math.random()*.95).map((v, i) => ({node, v, i}));

    nodes.push(node);
  }

  // Create links between every node in left set and every node in right set
  const leftNodes = nodes.filter(node => node.set === 'left');
  const rightNodes = nodes.filter(node => node.set === 'right');

  const links = d3.cross(leftNodes, rightNodes)
    .map(([a, b]) => {
      const [i, j] = [a.i, b.i];
      const color = colors[(i+j) % colors.length];
      const linkId = i + ' ' + j;

      // Connect nodes
      a.neighbors.push(b);
      b.neighbors.push(a);

      return {a, b, linkId, v: 1, color: d3.color(color)};
    });

  return { nodes, links };
}
