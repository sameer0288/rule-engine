import React, { useState } from 'react';
import { Container, Typography, Paper, CircularProgress } from '@mui/material';
import RuleForm from './components/RuleForm';
import RuleList from './components/RuleList';

function App() {
  const [refreshRules, setRefreshRules] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRuleCreated = () => {
    setLoading(true);
    setRefreshRules((prev) => !prev);
    setLoading(false); // You can adjust the loading state based on actual async operation in RuleForm
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Rule Engine with AST
        </Typography>
        <RuleForm onRuleCreated={handleRuleCreated} />
        
        {loading ? (
          <CircularProgress style={{ display: 'block', margin: 'auto', marginTop: '2rem' }} />
        ) : (
          <RuleList key={refreshRules} />
        )}
      </Paper>
    </Container>
  );
}

export default App;
