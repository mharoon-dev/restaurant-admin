import Header from "../components/common/Header.jsx";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../utils/url.js";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase.js";

const api = axios.create({
  baseURL: url,
});

const CreateDeal = ({ setDeals, products }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [productsIncluded, setProductsIncluded] = useState([
    { productId: "", selectedVariation: { size: "", price: 0 } },
  ]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [active, setActive] = useState(true);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleProductChange = (index, productId) => {
    const updatedProducts = [...productsIncluded];
    updatedProducts[index].productId = productId;
    updatedProducts[index].selectedVariation = { size: "", price: 0 };
    setProductsIncluded(updatedProducts);
  };

  const handleVariationChange = (index, variation) => {
    const updatedProducts = [...productsIncluded];
    updatedProducts[index].selectedVariation = variation;
    setProductsIncluded(updatedProducts);
  };

  const addProductField = () => {
    setProductsIncluded([
      ...productsIncluded,
      { productId: "", selectedVariation: { size: "", price: 0 } },
    ]);
  };

  const handleCheckboxChange = (day) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const calculateTotalPrice = () => {
    const total = productsIncluded.reduce(
      (sum, product) => sum + product.selectedVariation.price,
      0
    );
    return total - total * (discountPercentage / 100);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (file) {
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Image upload failed:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);

          const deal = {
            title,
            description,
            discountPercentage: +discountPercentage,
            productsIncluded,
            startDate,
            endDate,
            startTime,
            endTime,
            daysOfWeek,
            active,
            price: calculateTotalPrice(),
            img: downloadURL,
          };
          console.log(deal);
          await api
            .post("/deals/create", deal)
            .then((res) => {
              setDeals((prev) => [...prev, res.data.newDeal]);
              alert("Deal added successfully");
              navigate("/deals");
            })
            .catch((err) => {
              console.error("Failed to create deal:", err);
              alert(err);
            });
        }
      );
    } else {
      alert("Please upload an image.");
    }
  };

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Create Deal"} />

      <main className="flex justify-center items-center w-full h-screen py-6 px-4 lg:px-8">
        <form
          className="w-full bg-gray-800 bg-opacity-50 backdrop-blur p-6 justify-center items-center max-w-lg"
          onSubmit={handleClick}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-100 text-sm font-bold mb-2">
                Title
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                type="text"
                placeholder="Deal Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-bold mb-2">
                Description
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                type="text"
                placeholder="Deal Description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-100 text-sm font-bold mb-2">
                Discount Percentage
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                type="number"
                placeholder="Discount %"
                onChange={(e) => setDiscountPercentage(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-bold mb-2">
                Active
              </label>
              <select
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                onChange={(e) => setActive(e.target.value === "true")}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {productsIncluded.map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <div>
                <label className="block text-gray-100 text-sm font-bold mb-2">
                  Product
                </label>
                <select
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                  value={product.productId}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                >
                  <option value="">Select Product</option>
                  {products?.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-100 text-sm font-bold mb-2">
                  Variation
                </label>
                <select
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                  value={product.selectedVariation.size}
                  onChange={(e) =>
                    handleVariationChange(index, JSON.parse(e.target.value))
                  }
                  disabled={!product.productId}
                >
                  <option value="">Select Variation</option>
                  {products
                    .find((prod) => prod._id === product.productId)
                    ?.variations.map((variation) => (
                      <option
                        key={variation.size}
                        value={JSON.stringify(variation)}
                      >
                        {variation.size} - ${variation.price}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="text-blue-500 mb-4"
            onClick={addProductField}
          >
            Add Another Product
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-100 text-sm font-bold mb-2">
                Start Date
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                type="date"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-bold mb-2">
                End Date
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                type="date"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-100 text-sm font-bold mb-2">
                Start Time
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                type="time"
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-bold mb-2">
                End Time
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                type="time"
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-100 text-sm font-bold mb-2">
              Days of the Week
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <label key={day} className="text-gray-100">
                  <input
                    type="checkbox"
                    value={day}
                    checked={daysOfWeek.includes(day)}
                    onChange={() => handleCheckboxChange(day)}
                  />
                  <span className="ml-2">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-100 text-sm font-bold mb-2">
              Image
            </label>
            <input
              type="file"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateDeal;
