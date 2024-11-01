import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Edit, Trash2, XCircle } from "lucide-react";
import axios from "axios";
import { url } from "../../../utils/url";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";

const api = axios.create({
  baseURL: url,
});
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

const OrdersTable = ({ orderData, setOrders }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [singleOrder, setSingleOrder] = useState(null);
  const [updateInput, setUpdateInput] = useState();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = (id) => {
    console.log(id + "===>>  id for delete order");
    api
      .delete(`/orders/${id}`)
      .then((res) => {
        console.log("Order deleted:", res.data);
        setOrders((prevOrder) => {
          const updatedOrders = prevOrder.filter((order) => order._id !== id);
          console.log("Updated orders:", updatedOrders); // Check if it's correct
          return updatedOrders;
        });
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });
  };

  const handleEdit = (id) => {
    let filterOrder = orderData.filter((order) => order._id === id);
    filterOrder = filterOrder[0];
    filterOrder.status = updateInput;
    console.log(filterOrder);

    console.log(id);
    api
      .put(`/orders/${id}`, filterOrder)
      .then((res) => {
        console.log("Order updated:", res.data);
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((order) =>
            order._id === id ? res.data : order
          );
          console.log("Updated orders:", updatedOrders); // Check if it's correct
          return updatedOrders;
        });
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });
  };

  const [filteredOrders, setFilteredOrders] = useState(orderData);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orderData.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  };

  const handleOpenView = (order) => {
    setSingleOrder(order);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSingleOrder(null);
  };

  useEffect(() => {
    setFilteredOrders(orderData); // Sync the filtered orders with the main order data
  }, [orderData]);

  return (
    <>
      {singleOrder === null ? (
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-100">Order List</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide divide-gray-700">
                {filteredOrders?.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {order?.userDetails?.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      ${order?.amount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-700 text-white"
                            : order.status === "processing"
                            ? "bg-yellow-700 text-white"
                            : order.status === "shipped"
                            ? "bg-blue-700 text-white"
                            : "bg-red-700 text-white"
                        }`}
                      >
                        {order?.status.slice(0, 1).toUpperCase() +
                          order?.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.createdAt.slice(0, 10)}
                    </td>
                    <td className="ps-6  py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() => handleOpenView(order)}
                      >
                        <Eye size={18} />
                      </button>
                      <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                        <Edit
                          size={18}
                          onClick={() => {
                            setSingleOrder(order);
                            setUpdateInput(order?.status);
                            handleOpen();
                          }}
                        />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(order._id)}
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
      ) : (
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between flex-wrap items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-100">
              Customer Details
            </h2>
            <div className="relative">
              <XCircle size={28} onClick={handleCloseView} />
            </div>
          </div>

          <div
            className="overflow-x-auto"
            open={openView}
            onClose={handleCloseView}
          >
            <table className="min-w-full divide-y divide-gray-700">
              <tbody className="divide-y divide-gray-700">
                {/* Customer Details */}
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="ml-4">
                      <div
                        className="text-sm flex-col font-small text-gray-100 mb-4"
                        style={{ fontSize: "16px" }}
                      >
                        <strong>Name:</strong>{" "}
                        {singleOrder?.userDetails?.userName}
                      </div>
                      <div
                        className="text-sm flex-col font-small text-gray-100 mb-4"
                        style={{ fontSize: "16px" }}
                      >
                        <strong>Email:</strong>{" "}
                        {singleOrder?.userDetails?.email}
                      </div>
                      <div
                        className="text-sm flex-col font-small text-gray-100 mb-4"
                        style={{ fontSize: "16px" }}
                      >
                        <strong>Contact:</strong>{" "}
                        {singleOrder?.userDetails?.contact}
                      </div>
                      <div
                        className="text-sm flex-col font-small text-gray-100 mb-4"
                        style={{ fontSize: "16px" }}
                      >
                        <strong>Address:</strong>{" "}
                        {singleOrder?.userDetails?.address}
                      </div>
                      <div
                        className="text-sm flex-col font-small text-gray-100 mb-4"
                        style={{ fontSize: "16px" }}
                      >
                        <strong>Created At:</strong>{" "}
                        {formatDate(singleOrder?.createdAt)}
                      </div>
                    </div>
                  </td>
                </motion.tr>

                {/* Product Details */}
                {singleOrder?.products?.map((product, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="ml-4">
                        <div
                          className="text-sm flex-col font-small text-gray-100 mb-4"
                          style={{ fontSize: "16px" }}
                        >
                          <strong>Product Title:</strong> {product.title}
                        </div>
                        <div
                          className="text-sm flex-col font-small text-gray-100 mb-4"
                          style={{ fontSize: "16px" }}
                        >
                          <strong>Description:</strong> {product.desc}
                        </div>
                        <div
                          className="text-sm flex-col font-small text-gray-100 mb-4"
                          style={{ fontSize: "16px" }}
                        >
                          <strong>Quantity:</strong> {product.quantity}
                        </div>
                        <div
                          className="text-sm flex-col font-small text-gray-100 mb-4"
                          style={{ fontSize: "16px" }}
                        >
                          <strong>Size:</strong> {product.size}
                        </div>
                        <div
                          className="text-sm flex-col font-small text-gray-100 mb-4"
                          style={{ fontSize: "16px" }}
                        >
                          <strong>Price:</strong> $
                          {product.selectedVariation?.price || product.price}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

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
              label="Status"
              variant="standard"
            />
            <Button
              variant="contained"
              sx={button}
              onClick={() => handleEdit(singleOrder?._id)}
            >
              Update
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
};
export default OrdersTable;
