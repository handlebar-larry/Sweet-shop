const Sweet = require("../models/sweet.model");
const { uploadImageToCloudinary } = require("../config/cloudinary.config");

// Add a new sweet
const addSweet = async (req, res) => {
  try {
    const { name, price, category, quantity } = req.body;

    const existingSweet = await Sweet.findOne({ name });
    if (existingSweet) {
      return res.status(400).json({ message: "Sweet with this name already exists" });
    }

    let sweetpicUrl;
    if (req.file) {
      const localFilePath = req.file.path;
      sweetpicUrl = await uploadImageToCloudinary(localFilePath);
    }

    const sweetDoc = new Sweet({
      name,
      price,
      category,
      quantity,
      ...(sweetpicUrl ? { sweetpic: sweetpicUrl } : {}),
    });

    await sweetDoc.save();
    return res.status(200).json({ message: "Sweet added successfully", sweet: sweetDoc });
  } catch (err) {
    return res.status(500).json({ message: "Error adding sweet", error: err.message });
  }
};

// Get all sweets
const getSweets = async (req, res) => {
  try {
    const sweetList = await Sweet.find();
    return res.status(200).json(sweetList);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching sweets", error: err.message });
  }
};

// Search sweets (by name, category, or price range)
const searchSweets = async (req, res) => {
  try {
    const { category, name, pricemin, pricemax } = req.body;

    const queryFilter = {};

    if (name) queryFilter.name = { $regex: name, $options: "i" };
    if (category) queryFilter.category = { $regex: category, $options: "i" };

    if (pricemin || pricemax) {
      queryFilter.price = {};
      if (pricemin) queryFilter.price.$gte = Number(pricemin);
      if (pricemax) queryFilter.price.$lte = Number(pricemax);
    }

    const matchedSweets = await Sweet.find(queryFilter);
    return res.status(200).json(matchedSweets);
  } catch (err) {
    return res.status(500).json({ message: "Error searching sweets", error: err.message });
  }
};

// Update sweet details
const updateSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const updatePayload = { ...req.body };

    if (req.file) {
      const localFilePath = req.file.path;
      const sweetpicUrl = await uploadImageToCloudinary(localFilePath);
      if (sweetpicUrl) updatePayload.sweetpic = sweetpicUrl;
    }

    const updatedSweet = await Sweet.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updatedSweet) {
      return res.status(400).json({ message: "Sweet not found" });
    }

    return res.status(200).json({ message: "Sweet updated successfully", sweet: updatedSweet });
  } catch (err) {
    return res.status(500).json({ message: "Error updating sweet", error: err.message });
  }
};

// Delete a sweet
const deleteSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSweet = await Sweet.findByIdAndDelete(id);

    if (!deletedSweet) {
      return res.status(400).json({ message: "Sweet not found" });
    }

    return res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting sweet", error: err.message });
  }
};

// Purchase a sweet (decrease quantity if available)
const purchaseSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const sweetDoc = await Sweet.findById(id);
    if (!sweetDoc) {
      return res.status(400).json({ message: "Sweet not found" });
    }

    if (sweetDoc.quantity < quantity) {
      return res.status(400).json({ message: "Sweet is out of stock" });
    }

    sweetDoc.quantity -= quantity;
    await sweetDoc.save();

    return res.status(200).json({ message: "Sweet purchased successfully", sweet: sweetDoc });
  } catch (err) {
    return res.status(500).json({ message: "Error purchasing sweet", error: err.message });
  }
};

// Restock a sweet (increase quantity)
const restockSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const sweetDoc = await Sweet.findById(id);
    if (!sweetDoc) {
      return res.status(400).json({ message: "Sweet not found" });
    }

    sweetDoc.quantity += quantity;
    await sweetDoc.save();

    return res.status(200).json({ message: "Sweet restocked successfully", sweet: sweetDoc });
  } catch (err) {
    return res.status(500).json({ message: "Error restocking sweet", error: err.message });
  }
};

module.exports = {
  addSweet,
  getSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};
