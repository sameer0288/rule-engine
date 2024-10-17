const express = require('express');
const router = express.Router();
const Rule = require('../models/Rule');
const { createRule, combineRules, evaluateRule } = require('../utils/ruleEngine');
const { body, validationResult } = require('express-validator');

// Endpoint to create a new rule
router.post('/create', [
  body('name').isString().withMessage('Name must be a string.'),
  body('ruleString').isString().withMessage('Rule string must be a string.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, ruleString } = req.body;
    const ast = createRule(ruleString);
    const rule = new Rule({ name, ruleString, ast });
    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to combine multiple rules
router.post('/combine', [
  body('ruleIds').isArray().withMessage('Rule IDs must be an array.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { ruleIds } = req.body;
    const rules = await Rule.find({ _id: { $in: ruleIds } });
    
    if (rules.length === 0) {
      return res.status(404).json({ error: 'No rules found with the provided IDs.' });
    }

    const combinedAst = combineRules(rules.map(rule => rule.ast));
    res.json({ combinedAst });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to evaluate a rule against given data
router.post('/evaluate', [
  body('ruleId').isMongoId().withMessage('Invalid rule ID.'),
  body('data').isObject().withMessage('Data must be an object.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { ruleId, data } = req.body;
    const rule = await Rule.findById(ruleId);
    
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    const result = evaluateRule(rule.ast, data);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get all rules
router.get('/', async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get a single rule by ID
router.get('/:id', async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to delete a rule
router.delete('/:id', async (req, res) => {
  try {
    const rule = await Rule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    res.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
