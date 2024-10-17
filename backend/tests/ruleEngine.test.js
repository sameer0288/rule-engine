const { createRule, combineRules, evaluateRule, modifyRule, validateAttributes } = require('../src/utils/ruleEngine');

describe('Rule Engine', () => {
  test('createRule should create a valid AST from a complex rule string', () => {
    const ruleString = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
    const ast = createRule(ruleString);
    expect(ast).toBeDefined();
    expect(ast.type).toBe('operator');
    expect(ast.value).toBe('AND');
    expect(ast.left.type).toBe('operator'); // Check left subtree
    expect(ast.right.type).toBe('operator'); // Check right subtree
  });

  test('combineRules should combine multiple rules into a single AND operation', () => {
    const rule1 = createRule("age > 30 AND department = 'Sales'");
    const rule2 = createRule("salary > 50000");
    const combinedRule = combineRules([rule1, rule2]);
    
    expect(combinedRule).toBeDefined();
    expect(combinedRule.type).toBe('operator');
    expect(combinedRule.value).toBe('AND');
    expect(combinedRule.left).toBe(rule1);
    expect(combinedRule.right).toBe(rule2);
  });

  test('evaluateRule should return true for a valid matching rule', () => {
    const ruleString = "age > 30 AND department = 'Sales'";
    const ast = createRule(ruleString);
    const data = { age: 35, department: 'Sales' };
    const result = evaluateRule(ast, data);
    expect(result).toBe(true);
  });

  test('evaluateRule should return false for a non-matching rule', () => {
    const ruleString = "age > 30 AND department = 'Sales'";
    const ast = createRule(ruleString);
    const data = { age: 25, department: 'Marketing' };
    const result = evaluateRule(ast, data);
    expect(result).toBe(false);
  });

  test('evaluateRule should correctly evaluate a complex rule', () => {
    const ruleString = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
    const ast = createRule(ruleString);
    const data = { age: 35, department: 'Sales', salary: 60000, experience: 3 };
    const result = evaluateRule(ast, data);
    expect(result).toBe(true);
  });

  test('evaluateRule should throw an error for missing attributes in data', () => {
    const ruleString = "age > 30 AND department = 'Sales'";
    const ast = createRule(ruleString);
    const data = { age: 35 }; // Missing department
    expect(() => evaluateRule(ast, data)).toThrow("Missing attribute: department");
  });

  test('modifyRule should update an existing rule', () => {
    const ruleString = "age > 30 AND department = 'Sales'";
    const ast = createRule(ruleString);
    const modifiedAst = modifyRule(ast, ['right', 'value'], { attribute: 'department', operator: '=', value: "'HR'" });
    
    const data = { age: 35, department: 'HR' };
    const result = evaluateRule(modifiedAst, data);
    expect(result).toBe(true);
  });

  test('validateAttributes should throw an error for invalid attributes', () => {
    const ruleString = "age > 30 AND department = 'Sales'";
    const ast = createRule(ruleString);
    const catalog = ['age', 'salary']; // 'department' is not in the catalog
    expect(() => validateAttributes(ast, catalog)).toThrow("Invalid attribute: department. Please ensure it exists in the catalog.");
  });

  test('validateAttributes should succeed for valid attributes', () => {
    const ruleString = "age > 30 AND salary = 50000";
    const ast = createRule(ruleString);
    const catalog = ['age', 'salary'];
    expect(() => validateAttributes(ast, catalog)).not.toThrow();
  });
});
