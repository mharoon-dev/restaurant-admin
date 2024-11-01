import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { url } from "../../../utils/url.js";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../../firebase.js";

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

const api = axios.create({
  baseURL: url,
});

const DealsTable = ({ deals, setDeals }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [singleDeal, setSingleDeal] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateDiscount, setUpdateDiscount] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateImage, setUpdateImage] = useState("");
  const [updateStartDate, setUpdateStartDate] = useState("");
  const [updateEndDate, setUpdateEndDate] = useState("");
  const [updateStartTime, setUpdateStartTime] = useState("");
  const [updateEndTime, setUpdateEndTime] = useState("");
  const [file, setFile] = useState(null); // File state for image upload
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setFilteredDeals(deals);
  }, [deals]);

  const handleDelete = (id) => {
    api
      .delete(`/deals/delete/${id}`)
      .then(() => {
        alert("Deal Deleted");
        setDeals((prevDeals) => prevDeals.filter((deal) => deal._id !== id));
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });
  };

  const handleEdit = async (id) => {
    // Keep the existing image URL unless a new file is uploaded
    let imageUrl = updateImage;

    if (file) {
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
            (error) => {
              console.error("Image upload failed:", error);
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      } catch (error) {
        alert("Failed to upload image");
        return;
      }
    }

    console.log(imageUrl);

    const updatedDeal = {
      title: updateTitle,
      description: updateDescription,
      discountPercentage: updateDiscount,
      price: updatePrice,
      img: imageUrl, // Use the newly uploaded URL if file exists, else keep the existing URL
      startDate: updateStartDate,
      endDate: updateEndDate,
      startTime: updateStartTime,
      endTime: updateEndTime,
    };

    // API call to update the deal
    api
      .put(`/deals/edit/${id}`, updatedDeal)
      .then((res) => {
        alert("Deal updated successfully");
        setDeals((prevDeals) =>
          prevDeals.map((deal) =>
            deal._id === id ? res.data?.updatedDeal : deal
          )
        );
        setOpen(false); // Close the modal
      })
      .catch((err) => {
        console.error("Failed to update deal:", err);
        alert("Something went wrong");
      });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = deals.filter((deal) =>
      deal?.title?.toLowerCase().includes(term)
    );
    setFilteredDeals(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
          <h2 className="text-xl font-semibold text-gray-100">Deals</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search deals..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              style={{ width: "200px" }}
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
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Times
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filteredDeals?.map((deal) => (
                <motion.tr
                  key={deal._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      style={{ objectFit: "cover" }}
                      src={deal.img}
                      alt={deal.title}
                      className="h-10 w-10 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-100">
                      {deal.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {deal.description.slice(0, 30)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {deal.discountPercentage}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {formatDate(deal.startDate)} - {formatDate(deal.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {deal.startTime} - {deal.endTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      ${deal.price?.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                      <Edit
                        size={18}
                        onClick={() => {
                          setSingleDeal(deal);
                          setUpdateTitle(deal.title);
                          setUpdateDescription(deal.description);
                          setUpdateDiscount(deal.discountPercentage);
                          setUpdateImage(deal.img);
                          setUpdateStartDate(deal.startDate);
                          setUpdateEndDate(deal.endDate);
                          setUpdateStartTime(deal.startTime);
                          setUpdateEndTime(deal.endTime);
                          handleOpen();
                        }}
                      />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(deal._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <TextField
            label="Title"
            variant="standard"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            variant="standard"
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Discount Percentage"
            variant="standard"
            value={updateDiscount}
            onChange={(e) => setUpdateDiscount(e.target.value)}
            fullWidth
            margin="normal"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Upload New Image
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-2"
          />
          <TextField
            label="Start Date"
            variant="standard"
            type="date"
            value={updateStartDate}
            onChange={(e) => setUpdateStartDate(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            variant="standard"
            type="date"
            value={updateEndDate}
            onChange={(e) => setUpdateEndDate(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Time"
            variant="standard"
            type="time"
            value={updateStartTime}
            onChange={(e) => setUpdateStartTime(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Time"
            variant="standard"
            type="time"
            value={updateEndTime}
            onChange={(e) => setUpdateEndTime(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={() => handleEdit(singleDeal?._id)}
            fullWidth
            sx={{ mt: 2 }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default DealsTable;
