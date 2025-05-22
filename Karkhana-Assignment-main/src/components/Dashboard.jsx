import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  useToast,
  Divider,
  SimpleGrid,
  Container,
  Flex,
  useColorModeValue,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useDisclosure,
  Grid,
  GridItem,
  Select
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { logout } from '../store/authSlice';
import ItemForm from './ItemForm';
import CostForm from './CostForm';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [items, setItems] = useState([]);
  const [otherCosts, setOtherCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCost, setEditingCost] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const [itemSortBy, setItemSortBy] = useState('name-asc');
  const [costSortBy, setCostSortBy] = useState('name-asc');

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Fetch items and costs from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const itemsSnap = await getDocs(collection(db, `users/${user.uid}/items`));
        const costsSnap = await getDocs(collection(db, `users/${user.uid}/otherCosts`));
        setItems(itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setOtherCosts(costsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        toast({ title: 'Error loading data', description: error.message, status: 'error', duration: 3000, isClosable: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, toast]);

  // Add, update, delete handlers for items
  const handleAddItem = async (item) => {
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/items`), item);
      setItems([...items, { id: docRef.id, ...item }]);
      toast({ title: 'Item added', status: 'success', duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: 'Error adding item', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };
  const handleUpdateItem = async (id, item) => {
    try {
      await updateDoc(doc(db, `users/${user.uid}/items`, id), item);
      setItems(items.map(i => (i.id === id ? { ...i, ...item } : i)));
      toast({ title: 'Item updated', status: 'success', duration: 2000, isClosable: true });
      setEditingItem(null);
    } catch (error) {
      toast({ title: 'Error updating item', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };
  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/items`, id));
      setItems(items.filter(i => i.id !== id));
      toast({ title: 'Item deleted', status: 'info', duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: 'Error deleting item', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Add, update, delete handlers for other costs
  const handleAddCost = async (cost) => {
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/otherCosts`), cost);
      setOtherCosts([...otherCosts, { id: docRef.id, ...cost }]);
      toast({ title: 'Cost added', status: 'success', duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: 'Error adding cost', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };
  const handleUpdateCost = async (id, cost) => {
    try {
      await updateDoc(doc(db, `users/${user.uid}/otherCosts`, id), cost);
      setOtherCosts(otherCosts.map(c => (c.id === id ? { ...c, ...cost } : c)));
      toast({ title: 'Cost updated', status: 'success', duration: 2000, isClosable: true });
      setEditingCost(null);
    } catch (error) {
      toast({ title: 'Error updating cost', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };
  const handleDeleteCost = async (id) => {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/otherCosts`, id));
      setOtherCosts(otherCosts.filter(c => c.id !== id));
      toast({ title: 'Cost deleted', status: 'info', duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: 'Error deleting cost', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/login', { replace: true });
      toast({ title: 'Logged out', status: 'info', duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: 'Logout failed', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Calculate total cost
  const totalCost = items.reduce((sum, i) => sum + Number(i.cost || 0), 0) +
    otherCosts.reduce((sum, c) => sum + Number(c.cost || 0), 0);

  // Sorting functions
  const sortItems = (items) => {
    const sortedItems = [...items];
    switch (itemSortBy) {
      case 'name-asc':
        return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sortedItems.sort((a, b) => b.name.localeCompare(a.name));
      case 'cost-asc':
        return sortedItems.sort((a, b) => Number(a.cost) - Number(b.cost));
      case 'cost-desc':
        return sortedItems.sort((a, b) => Number(b.cost) - Number(a.cost));
      default:
        return sortedItems;
    }
  };

  const sortCosts = (costs) => {
    const sortedCosts = [...costs];
    switch (costSortBy) {
      case 'name-asc':
        return sortedCosts.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sortedCosts.sort((a, b) => b.name.localeCompare(a.name));
      case 'cost-asc':
        return sortedCosts.sort((a, b) => Number(a.cost) - Number(b.cost));
      case 'cost-desc':
        return sortedCosts.sort((a, b) => Number(b.cost) - Number(a.cost));
      default:
        return sortedCosts;
    }
  };

  const SidebarContent = () => (
    <VStack spacing={4} align="stretch" w="full">
      <Button
        variant={editingItem ? 'solid' : 'ghost'}
        colorScheme="blue"
        onClick={() => {
          setEditingItem(null);
          setEditingCost(null);
          if (isMobile) onClose();
        }}
      >
        Add Item
      </Button>
      <Button
        variant={editingCost ? 'solid' : 'ghost'}
        colorScheme="blue"
        onClick={() => {
          setEditingItem(null);
          setEditingCost(null);
          if (isMobile) onClose();
        }}
      >
        Add Cost
      </Button>
      <Button
        variant="ghost"
        colorScheme="red"
        onClick={handleLogout}
        mt="auto"
      >
        Logout
      </Button>
    </VStack>
  );

  if (!user) {
    return null;
  }

  return (
    <Box minH="100vh" w="100%" overflowX="hidden" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Box
        as="nav"
        position="sticky"
        top={0}
        zIndex="sticky"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        mb={6}
        w="100%"
      >
        <Container maxW="100%" px={{ base: 4, md: 6, lg: 8 }}>
          <Flex h="16" alignItems="center" justifyContent="space-between">
            <HStack spacing={4}>
              {isMobile && (
                <IconButton
                  icon={<HamburgerIcon />}
                  variant="ghost"
                  onClick={onOpen}
                  aria-label="Open menu"
                />
              )}
              <Heading size="md">Project Cost Tracker</Heading>
            </HStack>
            {!isMobile && (
              <Text color="gray.600">
                Welcome, {user?.email}
              </Text>
            )}
          </Flex>
        </Container>
      </Box>

      <Container maxW="100%" px={{ base: 4, md: 6, lg: 8 }} pb={8}>
        {/* Summary Cards */}
        <SimpleGrid 
          columns={{ base: 1, sm: 2, md: 3 }} 
          spacing={{ base: 4, md: 6 }} 
          mb={8}
          w="100%"
        >
          <Card bg={cardBg} w="100%">
            <CardBody>
              <Stat>
                <StatLabel>Total Items</StatLabel>
                <StatNumber>{items.length}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Project Items
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} w="100%">
            <CardBody>
              <Stat>
                <StatLabel>Other Costs</StatLabel>
                <StatNumber>{otherCosts.length}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Additional Costs
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} w="100%">
            <CardBody>
              <Stat>
                <StatLabel>Total Cost</StatLabel>
                <StatNumber>${totalCost}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Overall Cost
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Main Content */}
        <Grid
          templateColumns={{ base: '1fr', md: '250px 1fr' }}
          gap={{ base: 4, md: 6 }}
          w="100%"
        >
          {!isMobile && (
            <GridItem>
              <Box
                p={4}
                bg={bgColor}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                position="sticky"
                top="6rem"
                h="fit-content"
              >
                <SidebarContent />
              </Box>
            </GridItem>
          )}

          <GridItem>
            <SimpleGrid 
              columns={{ base: 1, lg: 2 }} 
              spacing={{ base: 4, md: 6 }}
              w="100%"
            >
              <Box w="100%">
                <Card bg={cardBg} mb={6} w="100%">
                  <CardBody>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Heading size="md">Project Items</Heading>
                      <Select
                        size="sm"
                        w="200px"
                        value={itemSortBy}
                        onChange={(e) => setItemSortBy(e.target.value)}
                      >
                        <option value="name-asc">Name (A to Z)</option>
                        <option value="name-desc">Name (Z to A)</option>
                        <option value="cost-asc">Cost (Low to High)</option>
                        <option value="cost-desc">Cost (High to Low)</option>
                      </Select>
                    </Flex>
                    <ItemForm
                      onSubmit={editingItem ? (item) => handleUpdateItem(editingItem.id, item) : handleAddItem}
                      initialData={editingItem}
                      onCancel={() => setEditingItem(null)}
                    />
                    <VStack align="stretch" mt={4} spacing={2} w="100%">
                      {sortItems(items).map(item => (
                        <HStack key={item.id} justify="space-between" p={2} borderWidth={1} borderRadius="md" w="100%">
                          <Text noOfLines={1}>{item.name} - ${item.cost}</Text>
                          <HStack>
                            <Button size="sm" onClick={() => setEditingItem(item)}>Edit</Button>
                            <Button size="sm" colorScheme="red" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                          </HStack>
                        </HStack>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </Box>

              <Box w="100%">
                <Card bg={cardBg} mb={6} w="100%">
                  <CardBody>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Heading size="md">Other Costs</Heading>
                      <Select
                        size="sm"
                        w="200px"
                        value={costSortBy}
                        onChange={(e) => setCostSortBy(e.target.value)}
                      >
                        <option value="name-asc">Name (A to Z)</option>
                        <option value="name-desc">Name (Z to A)</option>
                        <option value="cost-asc">Cost (Low to High)</option>
                        <option value="cost-desc">Cost (High to Low)</option>
                      </Select>
                    </Flex>
                    <CostForm
                      onSubmit={editingCost ? (cost) => handleUpdateCost(editingCost.id, cost) : handleAddCost}
                      initialData={editingCost}
                      onCancel={() => setEditingCost(null)}
                    />
                    <VStack align="stretch" mt={4} spacing={2} w="100%">
                      {sortCosts(otherCosts).map(cost => (
                        <HStack key={cost.id} justify="space-between" p={2} borderWidth={1} borderRadius="md" w="100%">
                          <Text noOfLines={1}>{cost.name} - ${cost.cost}</Text>
                          <HStack>
                            <Button size="sm" onClick={() => setEditingCost(cost)}>Edit</Button>
                            <Button size="sm" colorScheme="red" onClick={() => handleDeleteCost(cost.id)}>Delete</Button>
                          </HStack>
                        </HStack>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </Box>
            </SimpleGrid>
          </GridItem>
        </Grid>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Dashboard; 