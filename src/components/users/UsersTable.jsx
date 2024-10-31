import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash2, Eye, XCircle } from "lucide-react";
import axios from "axios";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { url } from "../../../utils/url";

const api = axios.create({
  baseURL: url, // Replace with your API base URL
});

const UsersTable = ({ userData, setUserData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [singleUser, setSingleUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  // Update filteredUsers when userData changes
  useEffect(() => {
    setFilteredUsers(userData);
  }, [userData]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = userData.filter(
      (user) =>
        user?.userName?.toLowerCase().includes(term) ||
        user?.email?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleOpenEdit = (user) => {
    setSingleUser(user);
    setUserName(user.userName);
    setEmail(user.email);
    setContact(user.contact);
    setAddress(user.address);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSingleUser(null);
  };

  const handleOpenView = (user) => {
    setSingleUser(user);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSingleUser(null);
  };

  const handleDelete = (id) => {
    api
      .delete(`/users/${id}`)
      .then(() => {
        setUserData(userData.filter((user) => user._id !== id));
        alert("User deleted");
      })
      .catch(() => {
        alert("Something went wrong");
      });
  };

  const handleEdit = (id) => {
    api
      .put(`/users/${id}`, {
        userName,
        email,
        contact,
        address,
      })
      .then((res) => {
        setUserData((prevUsers) =>
          prevUsers.map((user) => (user._id === id ? res.data : user))
        );
        alert("User updated");
        handleCloseEdit();
      })
      .catch((err) => {
        console.log(err);
        alert("Error updating user");
      });
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
          <h2 className="text-xl font-semibold text-gray-100">Customers</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
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
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Joining Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filteredUsers?.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {user?.userName?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-100">
                          {user?.userName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                      {user?.contact}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                      {user?.address}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {formatDate(user?.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => handleOpenView(user)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => handleOpenEdit(user)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(user._id)}
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

      {/* Edit User Modal */}
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit User
          </Typography>
          <TextField
            label="Name"
            variant="standard"
            fullWidth
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="standard"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Contact"
            variant="standard"
            fullWidth
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <TextField
            label="Address"
            variant="standard"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: "10px" }}
            onClick={() => handleEdit(singleUser._id)}
          >
            Update
          </Button>
        </Box>
      </Modal>

      {/* View User Modal */}
      <Modal open={openView} onClose={handleCloseView}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            User Details
          </Typography>
          <Typography>
            <strong>Name:</strong> {singleUser?.userName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {singleUser?.email}
          </Typography>
          <Typography>
            <strong>Contact:</strong> {singleUser?.contact}
          </Typography>
          <Typography>
            <strong>Address:</strong> {singleUser?.address}
          </Typography>
          <Typography>
            <strong>Joining Date:</strong> {formatDate(singleUser?.createdAt)}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: "10px" }}
            onClick={handleCloseView}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default UsersTable;
