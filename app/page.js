"use client";
import { firestore } from "@/firebase";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Analytics } from "@vercel/analytics/react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetches the initial inventory and updates on changes
  const updateInventory = async () => {
    const inventorySnapshot = query(collection(firestore, "inventory"));
    const inventoryDocs = await getDocs(inventorySnapshot);
    const inventoryDataList = [];
    inventoryDocs.forEach((doc) => {
      inventoryDataList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryDataList);
  };

  // Adds an item to the inventory or increments its quantity
  const addItem = async (item) => {
    const formattedItem = item.charAt(0).toUpperCase() + item.slice(1);
    const inventorySnapshot = doc(
      collection(firestore, "inventory"),
      formattedItem
    );
    const inventoryDoc = await getDoc(inventorySnapshot);
    if (inventoryDoc.exists()) {
      await updateDoc(inventorySnapshot, {
        quantity: inventoryDoc.data().quantity + 1,
      });
    } else {
      await setDoc(inventorySnapshot, { quantity: 1 });
    }
    updateInventory();
  };

  // Removes an item from the inventory or decrements its quantity
  const removeItem = async (item) => {
    const inventorySnapshot = doc(collection(firestore, "inventory"), item);
    const inventoryDoc = await getDoc(inventorySnapshot);
    if (inventoryDoc.exists() && inventoryDoc.data().quantity > 1) {
      await updateDoc(inventorySnapshot, {
        quantity: inventoryDoc.data().quantity - 1,
      });
    } else {
      await deleteDoc(inventorySnapshot);
    }
    updateInventory();
  };

  // Updates the quantity of an existing item
  const updateItemQuantity = async (item, quantity) => {
    const formattedItem = item.charAt(0).toUpperCase() + item.slice(1);
    const inventorySnapshot = doc(
      collection(firestore, "inventory"),
      formattedItem
    );
    const inventoryDoc = await getDoc(inventorySnapshot);
    if (inventoryDoc.exists()) {
      await updateDoc(inventorySnapshot, { quantity: Number(quantity) });
    } else {
      await setDoc(inventorySnapshot, { quantity: Number(quantity) });
    }
    updateInventory();
  };

  useEffect(() => {
    updateInventory(); // Refresh the inventory when the component mounts
  }, []);

  // Modal handling functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Filtered list for search functionality
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundImage:
          "linear-gradient(to right bottom, #0D47A1, #4A148C, #000000)",
        color: "white",
      }}
    >
      <Typography
        variant="h3"
        color="white"
        fontWeight="bold"
        p={5}
        sx={{
          width: "100%",
          textAlign: "center",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" }, // Responsive font size
        }}
      >
        Pantry Inventory System
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on small devices, row on others
          alignItems: "center",
          width: "100%",
          maxWidth: { sm: "600px", md: "800px" }, // Limiting maximum width for medium screens and up
          marginBottom: "20px",
        }}
      >
        <TextField
          label="Search Pantry"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          sx={{
            flex: 1,
            marginRight: { sm: "20px" }, // Spacing between elements on devices larger than small
            marginBottom: { xs: "20px", sm: "0" }, // Spacing for small devices
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            input: { color: "white" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "white" }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            background: "linear-gradient(to top, #7C4DFF, #18FFFF)",
            color: "#fff",
            fontWeight: "bold",
            textShadow: "0px 0px 8px rgba(0,0,0,0.8)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            "&:hover": {
              background: "linear-gradient(to top, #651FFF, #00B8D4)",
            },
          }}
        >
          Add New Item(s)
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ overflow: "auto" }} // Allow scrolling inside modal on smaller devices
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90vw", sm: "50vw", md: "600px" }, // Adjust width responsively
            bgcolor: "background.paper",
            border: "2px solid #fff",
            boxShadow: 24,
            p: 4,
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
            Update Item Quantity
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter item name..."
            value={item}
            onChange={(e) => setItem(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={() => {
              updateItemQuantity(item, quantity);
              setItem("");
              setQuantity(1);
              handleClose();
            }}
            sx={{
              background: "linear-gradient(to top, #7C4DFF, #18FFFF)",
              color: "#fff",
              fontWeight: "bold",
              textShadow: "0px 0px 8px rgba(0,0,0,0.8)",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
              "&:hover": {
                background: "linear-gradient(to top, #651FFF, #00B8D4)",
              },
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
      <Box
        sx={{
          width: "100%",
          maxWidth: { sm: "600px", md: "800px" }, // Responsive maximum width
          maxHeight: "60vh",
          overflow: "auto",
          border: "2px solid black",
          borderRadius: "8px",
          p: 1,
        }}
      >
        {filteredInventory.map(({ name, quantity }) => (
          <Box
            key={name}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              m: 1,
              bgcolor: "#F5F5F5",
              borderRadius: "8px",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                flexGrow: 1,
                color: "#333",
                fontWeight: "bold",
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, // Responsive font size for item names
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "#333",
                fontWeight: "bold",
                minWidth: "50px",
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" }, // Smaller font size on smaller screens
              }}
            >
              {quantity}
            </Typography>
            <IconButton
              color="success"
              onClick={() => addItem(name)}
              sx={{ mx: 1 }}
            >
              <AddIcon fontSize="large" />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => removeItem(name)}
              sx={{ mx: 1 }}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
