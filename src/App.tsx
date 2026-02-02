import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Header } from './components/Header.js';

export const App: React.FC = () => {
  const [status, setStatus] = useState<string>('Initializing...');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('Ready to analyze Claude transcripts!');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box flexDirection="column" padding={1}>
      <Header />
      <Box marginTop={1}>
        <Text color="cyan">{status}</Text>
      </Box>
    </Box>
  );
};
