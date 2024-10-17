import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';

const RuleList = () => {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [userData, setUserData] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/rules');
      setRules(response.data);
    } catch (error) {
      console.error('Error fetching rules:', error);
      setError('Failed to fetch rules.');
    } finally {
      setLoading(false);
    }
  };

  const handleRuleSelection = (ruleId) => {
    setSelectedRules((prevSelected) =>
      prevSelected.includes(ruleId)
        ? prevSelected.filter((id) => id !== ruleId)
        : [...prevSelected, ruleId]
    );
  };

  const handleCombineRules = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/rules/combine', { ruleIds: selectedRules });
      alert('Rules combined successfully');
      setSelectedRules([]); // Clear selection after combining
    } catch (error) {
      console.error('Error combining rules:', error);
      setError('Failed to combine rules.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateRule = async (ruleId) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/rules/evaluate', { ruleId, data: userData });
      setEvaluationResult(response.data.result);
    } catch (error) {
      console.error('Error evaluating rule:', error);
      setError('Failed to evaluate rule.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom align="center">
          Rules
        </Typography>
        <List>
          {rules.map((rule) => (
            <ListItem key={rule._id}>
              <Checkbox
                checked={selectedRules.includes(rule._id)}
                onChange={() => handleRuleSelection(rule._id)}
              />
              <ListItemText primary={rule.name} secondary={rule.ruleString} />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleEvaluateRule(rule._id)}
                disabled={loading}
              >
                {loading ? 'Evaluating...' : 'Evaluate'}
              </Button>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCombineRules}
          disabled={selectedRules.length === 0 || loading}
          style={{ marginTop: '1rem' }}
        >
          {loading ? 'Combining...' : 'Combine Selected Rules'}
        </Button>
        <div style={{ marginTop: '2rem' }}>
          <Typography variant="h5">User Data</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Age"
                type="number"
                name="age"
                value={userData.age || ''}
                onChange={handleUserDataChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Department"
                type="text"
                name="department"
                value={userData.department || ''}
                onChange={handleUserDataChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Salary"
                type="number"
                name="salary"
                value={userData.salary || ''}
                onChange={handleUserDataChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Experience"
                type="number"
                name="experience"
                value={userData.experience || ''}
                onChange={handleUserDataChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </div>
        {evaluationResult !== null && (
          <div style={{ marginTop: '2rem' }}>
            <Typography variant="h5">Evaluation Result</Typography>
            <Typography variant="body1">
              {evaluationResult ? 'User matches the rule' : 'User does not match the rule'}
            </Typography>
          </div>
        )}
      </Paper>

      {/* Snackbar for error messages */}
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RuleList;
