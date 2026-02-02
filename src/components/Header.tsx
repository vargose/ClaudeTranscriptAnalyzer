import React from 'react';
import { Box, Text } from 'ink';

export const Header: React.FC = () => {
  return (
    <Box borderStyle="round" borderColor="green" padding={1}>
      <Text bold color="green">
        Claude Transcript Analyzer
      </Text>
    </Box>
  );
};
