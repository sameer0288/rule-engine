import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';

const RuleForm = ({ onRuleCreated }) => {
  const [name, setName] = useState('');
  const [ruleString, setRuleString] = useState('');
  const [additionalAttribute, setAdditionalAttribute] = useState(''); // New state for the missing attribute

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/rules/create', {
        name,
        ruleString,
        additionalAttribute, // Include the new attribute in the request
      });
      onRuleCreated(response.data);
      setName('');
      setRuleString('');
      setAdditionalAttribute(''); // Reset the new field
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        Create a New Rule
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Rule Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Rule String"
              variant="outlined"
              fullWidth
              value={ruleString}
              onChange={(e) => setRuleString(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Additional Attribute" // New field for the missing attribute
              variant="outlined"
              fullWidth
              value={additionalAttribute}
              onChange={(e) => setAdditionalAttribute(e.target.value)}
              required // Make it required if necessary
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Rule
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RuleForm;
