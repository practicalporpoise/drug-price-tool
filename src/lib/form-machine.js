class FormConfigurationError extends Error {
  constructor(messages) {
    super('Form configuration is not valid');
    this.name = 'FormConfigurationError';
    this.messages = messages;
  }
}

class InvalidKeyError extends Error {
  constructor(key, node) {
    super(`Invalid next key of ${key} returned from node: ${node.key}`);
    this.name = 'InvalidKeyError';
  }
}

class UnknownNodeError extends Error {
  constructor(key, node) {
    super(`Could not find node for key: ${key}, from node: ${node.key}`);
    this.name = 'UnknownNodeError';
  }
}

export default class FormMachine {
  constructor(formConfig) {
    validate(formConfig);
    this.nodes = formConfig;
    this.currentNode = null;
    this.nodePath = [];
    this.formData = {};
  }

  start() {
    this.currentNode = getRootNode(this.nodes);
    this.nodePath.push(this.currentNode);
    return this.getContext();
  }

  next() {
    this.currentNode = getNextNode(this.formData, this.nodes, this.currentNode);
    this.nodePath.push(this.currentNode);
    return this.getContext();
  }

  previous() {
    this.nodePath.pop();
    this.currentNode = this.nodePath[this.nodePath.length - 1];
    return this.getContext();
  }

  getContext() {
    return {
      hasPrevious: this.nodePath.length > 1,
      hasNext: !!this.currentNode.next,
      node: this.currentNode,
      formData: this.formData,
    };
  }
}

function validate(nodes) {
  const errors = [];
  let numRoots = 0;

  for (const [key, node] of Object.entries(nodes)) {
    if (node.root) numRoots++;

    if (node.next && !['function', 'string'].includes(typeof node.next))
      errors.push(`Unknown 'next' type: ${typeof node.next} for key: ${key}`);
  }

  if (numRoots === 0) errors.push('No root node');
  if (numRoots > 1) errors.push('Too many root nodes');

  if (errors.length > 0) throw new FormConfigurationError(errors);
}

function getRootNode(nodes) {
  const rootNodeKey = Object.keys(nodes).find(key => nodes[key].root);
  if (!rootNodeKey) return null;
  return getNode(nodes, rootNodeKey);
}

function getNextNode(formData, nodes, currentNode) {
  const nextKey = getNextKey(formData, currentNode);

  if (typeof nextKey !== 'string' || nextKey.length === 0)
    throw new InvalidKeyError(nextKey, currentNode);

  const nextNode = getNode(nodes, nextKey);

  if (!nextNode) throw new UnknownNodeError(nextKey, currentNode);

  return nextNode;
}

function getNextKey(formData, node) {
  return typeof node.next === 'function' ? node.next(formData) : node.next;
}

function getNode(nodes, key) {
  const node = nodes[key];
  return node ? { ...node, key } : null;
}
