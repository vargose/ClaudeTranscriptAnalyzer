import React from 'react';
import { Box, Text } from 'ink';

export const TestComponent: React.FC = () => {
  const message = 'Hello World';
  return (
    <Box>
      <Text>{message}</Text>
    </Box>
  );
};
