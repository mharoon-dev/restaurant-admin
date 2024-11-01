import axios from "axios";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { url } from "../../../utils/url";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const input = {
  width: "100%",
};

const button = {
  width: "100%",
  marginTop: "10px",
};

const api = axios.create({
  baseURL: url,
});

const ProductsTable = ({ products, setProducts, categories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [variations, setVariations] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();

  const handleOpen = (product) => {
    setSingleProduct(product);
    setTitle(product?.title || "");
    setDescription(product?.desc || "");
    setCategory(product?.categories?.join(", ") || "");
    setVariations(product?.variations || []);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleDelete = (id) => {
    api
      .delete(`/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product._id !== id));
        alert("Product deleted");
      })
      .catch(() => {
        alert("Something went wrong");
      });
  };

  const handleEdit = (id) => {
    api
      .put(`/products/${id}`, {
        title,
        desc: description,
        categories: category.split(",").map((cat) => cat.trim()),
        variations,
      })
      .then((res) => {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === id ? res.data : product
          )
        );
        alert("Product updated");
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        alert("Error updating product");
        setOpen(false);
      });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(term, selectedCategory);
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    filterProducts(searchTerm, categoryName);
  };

  const filterProducts = (searchTerm, categoryName) => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) &&
        (!categoryName ||
          product.categories.some(
            (category) => category.toLowerCase() === categoryName.toLowerCase()
          ))
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    setFilteredProducts(products);
    if (categories.length > 0) {
      setSelectedCategory(categories[0].name); // Set the first category as default
      filterProducts(searchTerm, categories[0].name); // Filter by default category
    }
  }, [products, categories]);

  const handleVariationChange = (index, key, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index] = { ...updatedVariations[index], [key]: value };
    setVariations(updatedVariations);
  };

  const handleDeleteVariation = (index) => {
    const updatedVariations = variations.filter((_, i) => i !== index);
    setVariations(updatedVariations);
  };

  const handleAddVariation = () => {
    setVariations([...variations, { size: "", price: "" }]);
  };

  return (
    <>
      <div className="flex items-center justify-center space-x-4 mb-6">
        {categories?.map((category) => (
          <button
            key={category.name}
            className={`bg-gray-700 text-white rounded-lg px-4 py-2 `}
            style={{
              backgroundColor:
                selectedCategory === category.name ? "#3b82f6" : "#1f2937",
            }}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <motion.div
       className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Categories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Variations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 gap-2 items-center justify-center">
                      <img
                        src={product?.img || ""}
                        style={{ objectFit: "cover" }}
                        alt={product?.title || "Product Image"}
                        className="size-10 rounded-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {product?.title || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product?.desc.substring(0, 25) + "..." || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product?.categories?.join(", ") || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product?.variations?.length > 0
                        ? product?.variations?.map((variation, index) => (
                            <div key={index}>
                              {variation?.size && variation?.price
                                ? `${variation?.size} - £${variation?.price}`
                                : ""}
                            </div>
                          ))
                        : "No variations"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() => handleOpen(product)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(product?._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-sm text-gray-400"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Product
          </Typography>
          <TextField
            label="Title"
            variant="standard"
            sx={input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description"
            variant="standard"
            sx={input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Category"
            variant="standard"
            sx={input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          {variations.map((variation, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <TextField
                label={`Size`}
                variant="standard"
                sx={{ width: "45%", marginRight: "5%" }}
                value={variation.size}
                onChange={(e) =>
                  handleVariationChange(index, "size", e.target.value)
                }
              />
              <TextField
                label={`Price`}
                variant="standard"
                sx={{ width: "45%" }}
                value={variation.price}
                onChange={(e) =>
                  handleVariationChange(index, "price", e.target.value)
                }
              />
              <XCircle
                size={24}
                className="text-red-500 ml-2 cursor-pointer"
                onClick={() => handleDeleteVariation(index)}
              />
            </Box>
          ))}
          <Button
            variant="outlined"
            sx={{ marginBottom: "10px" }}
            onClick={handleAddVariation}
          >
            Add Variation
          </Button>
          <Button
            variant="contained"
            sx={button}
            onClick={() => handleEdit(singleProduct?._id)}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ProductsTable;
