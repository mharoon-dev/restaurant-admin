import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { url } from "../../../utils/url.js";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Checkbox from "@mui/material/Checkbox";

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

const CoupenTable = ({ coupens, setCoupens }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoupens, setFilteredCoupens] = useState([]);
  const [singleCoupen, setSingleCoupen] = useState(null);
  const [updateInput, setUpdateInput] = useState({
    code: "",
    discount: "",
    desc: "",
    active: false,
  });
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (coupens?.length) {
      setFilteredCoupens(coupens); // Initialize with coupenData when it changes
    }
  }, [coupens]);

  const handleDelete = (id) => {
    api
      .delete(`/coupens/${id}`)
      .then((res) => {
        alert("Coupen Deleted");
        setCoupens((prevCoupens) =>
          prevCoupens.filter((coupen) => coupen._id !== id)
        );
      })
      .catch((err) => {
        alert("Something went wrong");
      });
  };

  const handleEdit = (id) => {
    api
      .put(`/coupens/${id}`, {
        code: updateInput.code,
        discount: updateInput.discount,
        desc: updateInput.desc,
        active: updateInput.active,
      })
      .then((res) => {
        alert("Coupen updated");
        setCoupens((prevCoupens) =>
          prevCoupens.map((coupen) => (coupen._id === id ? res.data : coupen))
        );
        setOpen(false);
      })
      .catch((err) => {
        alert("Something went wrong");
      });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = coupens?.filter((coupen) =>
      coupen?.code?.toLowerCase().includes(term)
    );
    setFilteredCoupens(filtered);
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
          <h2 className="text-xl mb-4 font-semibold text-gray-100">Coupons</h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search coupens..."
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
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Coupon Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCoupens?.length > 0 ? (
                filteredCoupens.map((coupen) => (
                  <motion.tr
                    key={coupen._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {coupen?.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {coupen?.discount}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {coupen?.desc}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {coupen?.active ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                        <Edit
                          size={18}
                          onClick={() => {
                            setSingleCoupen(coupen);
                            setUpdateInput({
                              code: coupen?.code,
                              discount: coupen?.discount,
                              desc: coupen?.desc,
                              active: coupen?.active,
                            });
                            handleOpen();
                          }}
                        />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(coupen._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-400">
                    No coupens found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
            <Typography variant="h6" component="h2">
              Edit Coupen
            </Typography>

            {/* Code Field */}
            <Typography variant="body1" component="label" sx={{ mt: 2 }}>
              Code
            </Typography>
            <TextField
              sx={input}
              value={updateInput.code}
              onChange={(e) =>
                setUpdateInput((prev) => ({ ...prev, code: e.target.value }))
              }
              label="Code"
              variant="standard"
            />

            {/* Discount Field */}
            <Typography variant="body1" component="label" sx={{ mt: 2 }}>
              Discount
            </Typography>
            <TextField
              sx={input}
              value={updateInput.discount}
              onChange={(e) =>
                setUpdateInput((prev) => ({
                  ...prev,
                  discount: e.target.value,
                }))
              }
              label="Discount"
              variant="standard"
              type="number"
            />

            {/* Description Field */}
            <Typography variant="body1" component="label" sx={{ mt: 2 }}>
              Description
            </Typography>
            <TextField
              sx={input}
              value={updateInput.desc}
              onChange={(e) =>
                setUpdateInput((prev) => ({ ...prev, desc: e.target.value }))
              }
              label="Description"
              variant="standard"
            />

            {/* Active Checkbox */}
            <Typography variant="body1" component="label" sx={{ mt: 2 }}>
              Active
            </Typography>
            <Checkbox
              checked={updateInput.active}
              onChange={(e) =>
                setUpdateInput((prev) => ({
                  ...prev,
                  active: e.target.checked,
                }))
              }
              color="primary"
            />

            <Button
              variant="contained"
              sx={button}
              onClick={() => handleEdit(singleCoupen?._id)}
            >
              Update
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default CoupenTable;
