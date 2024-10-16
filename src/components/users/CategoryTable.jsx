import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { url } from "../../../utils/url";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import {
  getCategoriesStart,
  getCategoriesSuccess,
  getCategoriesFailure,
  deleteCategoryStart,
  deleteCategorySuccess,
  deleteCategoryFailure,
  updateCategorySuccess,
  updateCategoryStart,
  updateCategoryFailure,
} from "../../Redux/Slices/categoriesSlice.jsx";

import * as React from "react";
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

const CategoryTable = ({ categories, setCategories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCats, setFilteredCats] = useState([]);
  const [singleCat, setSingleCat] = useState(null);
  const [updateInput, setUpdateInput] = useState();
  // const { categories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  const handleDelete = (id) => {
    console.log(id + "===>>  id for delete category");
    // dispatch(deleteCategoryStart());

    api
      .delete(`/categories/${id}`)
      .then((res) => {
        console.log(res.data);
        // dispatch(deleteCategorySuccess(id));
        alert("Category Deleted");
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== id)
        );
        console.log(categories);
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        // dispatch(deleteCategoryFailure());
        alert("Something went wrong");
      });
  };

  const handleEdit = (id) => {
    console.log(id);
    // dispatch(updateCategoryStart());

    api
      .put(`/categories/${id}`, { name: updateInput })
      .then((res) => {
        console.log(res.data);
        // dispatch(updateCategorySuccess(id));
        alert("Category updated");
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === id ? res.data : category
          )
        );
        setOpen(false);
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        // dispatch(updateCategoryFailure());
        alert("Something went wrong");
      });
  };

  useEffect(() => {
    if (categories?.length) {
      setFilteredCats(categories); // Initialize with categoryData when it changes
    }
  }, [categories]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = categories?.filter((cat) =>
      cat?.name?.toLowerCase().includes(term)
    );
    setFilteredCats(filtered);
  };

  return (
    <>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-xl mb-4 font-semibold text-gray-100">
            Categories
          </h2>
          <div className="relative mb-4">
            <input
              style={{ maxWidth: "170px !important" }}
              type="text"
              placeholder="Search categories..."
              className="bg-gray-700 w-full text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredCats?.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-700">
              <tbody className="divide-y divide-gray-700">
                {filteredCats.map((cat) => (
                  <motion.tr
                    key={cat._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center py-4"
                  >
                    <td className="flex items-center space-x-4">
                      <img
                        src={cat?.img}
                        alt={cat?.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="text-sm text-gray-300">{cat?.name}</div>
                    </td>

                    <td className="ps-6  py-4 whitespace-nowrap text-sm text-gray-300">
                      <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                        <Edit
                          size={18}
                          onClick={() => {
                            setSingleCat(cat);
                            setUpdateInput(cat?.name);
                            handleOpen();
                          }}
                        />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(cat._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-center py-4">
              No categories found.
            </p>
          )}
        </div>
      </motion.div>

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <TextField
              id="standard-basic"
              sx={input}
              value={updateInput}
              onChange={(e) => setUpdateInput(e.target.value)}
              label="Name"
              variant="standard"
            />
            <Button
              variant="contained"
              sx={button}
              onClick={() => handleEdit(singleCat?._id)}
            >
              Update
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default CategoryTable;
