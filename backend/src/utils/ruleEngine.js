class Node {
  constructor(type, value = null, left = null, right = null) {
    this.type = type;
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

// Function to create an AST from a rule string
function createRule(ruleString) {
  const tokens = tokenize(ruleString);
  return parseExpression(tokens);
}

// Tokenizes the rule string into manageable parts
function tokenize(ruleString) {
  // Match attributes, numbers, strings, operators, and parentheses
  return ruleString.match(/\w+|[<>=!]+|\d+|'[^']*'|AND|OR|\(|\)/g);
}

// Parses the tokenized input into an expression tree (AST)
function parseExpression(tokens) {
  const stack = [];
  let current = null;

  for (const token of tokens) {
    if (token === '(') {
      stack.push(current);
      current = null;
    } else if (token === ')') {
      const node = current;
      current = stack.pop();
      if (current) {
        if (!current.left) {
          current.left = node;
        } else {
          current.right = node;
        }
      } else {
        current = node;
      }
    } else if (['AND', 'OR'].includes(token)) {
      const node = new Node('operator', token);
      node.left = current;
      stack.push(node);
      current = null;
    } else {
      // Assuming the token is an attribute with operator and value
      const [attribute, operator, value] = token.split(/\s+/);
      current = new Node('operand', { attribute, operator, value });
    }
  }

  return current;
}

// Combines multiple ASTs into a single AND operator
function combineRules(rules) {
  if (rules.length === 0) return null;
  if (rules.length === 1) return rules[0];

  const root = new Node('operator', 'AND');
  root.left = rules[0];
  root.right = combineRules(rules.slice(1));
  return root;
}

// Evaluates the AST against provided data
function evaluateRule(ast, data) {
  if (!ast) return true;

  if (ast.type === 'operator') {
    const leftResult = evaluateRule(ast.left, data);
    const rightResult = evaluateRule(ast.right, data);

    return ast.value === 'AND' ? leftResult && rightResult : leftResult || rightResult;
  } else if (ast.type === 'operand') {
    const { attribute, operator, value } = ast.value;

    // Error handling for missing attributes
    if (!(attribute in data)) {
      throw new Error(`Missing attribute: ${attribute}`);
    }

    const dataValue = data[attribute];

    switch (operator) {
      case '>':
        return dataValue > parseFloat(value);
      case '<':
        return dataValue < parseFloat(value);
      case '=':
        return dataValue.toString() === value.replace(/'/g, '');
      case '!=':
        return dataValue.toString() !== value.replace(/'/g, '');
      case '>=':
        return dataValue >= parseFloat(value);
      case '<=':
        return dataValue <= parseFloat(value);
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  throw new Error('Invalid AST node type');
}

// Modifies existing rules based on the provided path
function modifyRule(ast, path, newValue) {
  if (path.length === 0) {
    return newValue;
  }

  const [current, ...rest] = path;
  const newNode = new Node(ast.type, ast.value, ast.left, ast.right);

  if (current === 'left') {
    newNode.left = modifyRule(ast.left, rest, newValue);
  } else if (current === 'right') {
    newNode.right = modifyRule(ast.right, rest, newValue);
  } else if (current === 'value') {
    newNode.value = newValue;
  }

  return newNode;
}

// Validates attributes in the AST against a predefined catalog
function validateAttributes(ast, catalog) {
  if (!ast) return;

  if (ast.type === 'operator') {
    validateAttributes(ast.left, catalog);
    validateAttributes(ast.right, catalog);
  } else if (ast.type === 'operand') {
    const { attribute } = ast.value;
    if (!catalog.includes(attribute)) {
      throw new Error(`Invalid attribute: ${attribute}. Please ensure it exists in the catalog.`);
    }
  }
}

module.exports = {
  createRule,
  combineRules,
  evaluateRule,
  modifyRule,
  validateAttributes,
};
