const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures rule names are unique
  },
  ruleString: {
    type: String,
    required: true, // The string representation of the rule
  },
  ast: {
    type: Object,
    required: true, // The Abstract Syntax Tree representation of the rule
  },
  description: {
    type: String,
    default: '', // Optional field for additional context
  },
  isActive: {
    type: Boolean,
    default: true, // Indicates if the rule is currently active
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp for when the rule was created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Timestamp for when the rule was last updated
  },
});

// Middleware to update the 'updatedAt' field before each save
ruleSchema.pre('save', function (next) {
  this.updatedAt = Date.now(); // Update the updatedAt timestamp
  next();
});

module.exports = mongoose.model('Rule', ruleSchema);
