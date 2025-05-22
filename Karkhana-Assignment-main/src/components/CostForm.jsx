import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack
} from '@chakra-ui/react';

const CostForm = ({ onSubmit, initialData, onCancel }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCost(initialData.cost || '');
    } else {
      setName('');
      setCost('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !cost) return;
    onSubmit({ name, cost });
    setName('');
    setCost('');
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <HStack spacing={2}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input size="sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cost name" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Cost</FormLabel>
          <Input size="sm" type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Cost" />
        </FormControl>
        <Button type="submit" colorScheme="blue" size="sm">{initialData ? 'Update' : 'Add'}</Button>
        {initialData && <Button onClick={onCancel} size="sm">Cancel</Button>}
      </HStack>
    </Box>
  );
};

export default CostForm; 