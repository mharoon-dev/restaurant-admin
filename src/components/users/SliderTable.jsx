import { useState, useEffect } from "react";
import { color, motion } from "framer-motion";
import { Search, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { url } from "../../../utils/url";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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

const SliderTable = ({ sliders, setSliders }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSliders, setFilteredSliders] = useState([]);
  const [singleSlider, setSingleSlider] = useState(null);
  const [updateInput, setUpdateInput] = useState({});
  const [open, setOpen] = useState(false);

  const handleOpen = (slider) => {
    setSingleSlider(slider);
    setUpdateInput({
      smallPara: slider?.smallPara,
      heading1: slider?.heading1,
      heading2: slider?.heading2,
      card1: slider?.card1,
      card2: slider?.card2,
      card3: slider?.card3,
      link: slider?.link,
    });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (sliders?.length > 0) {
      setFilteredSliders(sliders);
      console.log("sliders:", sliders);
    }
  }, [sliders]);

  const handleDelete = (id) => {
    api
      .delete(`/sliders/${id}`)
      .then((res) => {
        alert("Slider deleted");
        setSliders((prevSliders) =>
          prevSliders.filter((slider) => slider._id !== id)
        );
      })
      .catch((err) => {
        alert("Something went wrong");
      });
  };

  const handleEdit = (id) => {
    api
      .put(`/sliders/${id}`, updateInput)
      .then((res) => {
        alert("Slider updated");
        setSliders((prevSliders) =>
          prevSliders.map((slider) => (slider._id === id ? res.data : slider))
        );
        handleClose();
      })
      .catch((err) => {
        alert("Something went wrong");
      });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = sliders.filter(
      (slider) =>
        slider?.smallPara?.toLowerCase().includes(term) ||
        slider?.heading1?.toLowerCase().includes(term) ||
        slider?.heading2?.toLowerCase().includes(term) ||
        slider?.card1?.toLowerCase().includes(term) ||
        slider?.card2?.toLowerCase().includes(term) ||
        slider?.card3?.toLowerCase().includes(term)
    );
    setFilteredSliders(filtered);
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
          <h2 className="text-xl mb-4 font-semibold text-gray-100">Sliders</h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search sliders..."
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
          {filteredSliders?.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-700">
              <tbody className="divide-y divide-gray-700">
                {filteredSliders.map((slider) => (
                  <motion.tr
                    key={slider._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center py-4"
                  >
                    <td className="flex items-center space-x-4">
                      <img
                        src={slider.img}
                        alt={slider.heading1}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="text-sm text-gray-300">
                        <p>SmallPara:&nbsp; {slider?.smallPara}</p>
                        <p>Heading1: &nbsp;{slider?.heading1}</p>
                        <p>Heading2: &nbsp;{slider?.heading2}</p>
                        <p>Card1: &nbsp;{slider?.card1}</p>
                        <p>Card2: &nbsp;{slider?.card2}</p>
                        <p>Card3: &nbsp;{slider?.card3}</p>
                        <p>Link: &nbsp;{slider?.link}</p>
                      </div>
                    </td>

                    <td className="ps-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() => handleOpen(slider)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(slider._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-center py-4">No sliders found.</p>
          )}
        </div>
      </motion.div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {[
            "smallPara",
            "heading1",
            "heading2",
            "card1",
            "card2",
            "card3",
            "link",
          ].map((field, index) => (
            <input
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              type="text"
              placeholder={field}
              className={
                index === 0
                  ? "bg-gray-700 w-full text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  : "bg-gray-700 w-full text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
              key={index}
              sx={input}
              label={field}
              variant="standard"
              value={updateInput[field] || ""}
              onChange={(e) =>
                setUpdateInput((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
            />
          ))}
          <Button
            variant="contained"
            sx={button}
            onClick={() => handleEdit(singleSlider._id)}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SliderTable;
