import Header from "../components/common/Header.jsx";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addProductFailure,
  addProductStart,
  addProductSuccess,
} from "../Redux/Slices/productsSlice.jsx";
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

const CreateProduct = ({ setProducts }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState(true);
  const [file, setFile] = useState(null);
  const [variations, setVariations] = useState([{ size: "", price: "" }]);

  // Function to handle adding new variation fields
  const addVariation = () => {
    // Validate the last variation to ensure size and price are filled
    const lastVariation = variations[variations.length - 1];
    if (lastVariation.size === "" || lastVariation.price === "") {
      alert(
        "Please fill in both size and price before adding a new variation."
      );
      return;
    }
    setVariations([...variations, { size: "", price: "" }]);
  };

  // Function to handle changes in variation fields
  const handleVariationChange = (index, event) => {
    const { name, value } = event.target;
    const updatedVariations = [...variations];
    updatedVariations[index][name] = value;
    setVariations(updatedVariations);
  };

  // Function to handle the form submission
  const handleClick = (e) => {
    // dispatch(addProductStart());
    e.preventDefault();
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
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const product = {
            title,
            desc,
            categories,
            variations,
            inStock,
            img: downloadURL,
          };
          api
            .post("/products", product)
            .then((res) => {
              // dispatch(addProductSuccess(res.data));
              setProducts((prevProducts) => [...prevProducts, res.data]);
              alert("Product added successfully");
              navigate("/products");
            })
            .catch((err) => {
              console.log(err);
              // dispatch(addProductFailure());
              alert(err);
            });
        });
      }
    );
  };

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Create Product"} />
      <main className="flex justify-center items-center w-full h-screen py-6 px-4 lg:px-8">
        <form
          className="w-full bg-gray-800 bg-opacity-50 backdrop-blur p-6 justify-center items-center max-w-lg"
          onSubmit={handleClick}
        >
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2">
                Title
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                type="text"
                placeholder="Product Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2">
                Description
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                type="text"
                placeholder="Product Description"
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2">
                Categories
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                type="text"
                placeholder="Category1, Category2"
                onChange={(e) => setCategories(e.target.value.split(","))}
              />
            </div>

            {/* Variations Section */}
            {variations.map((variation, index) => (
              <div key={index} className="w-full px-3">
                <div className="flex flex-wrap mb-4">
                  <div className="w-1/2 px-1">
                    <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2">
                      Size
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                      type="text"
                      name="size"
                      value={variation.size}
                      placeholder="Small, Medium, Large"
                      onChange={(e) => handleVariationChange(index, e)}
                    />
                  </div>
                  <div className="w-1/2 px-1">
                    <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2">
                      Price
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                      type="number"
                      name="price"
                      value={variation.price}
                      placeholder="Price"
                      onChange={(e) => handleVariationChange(index, e)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="w-full px-3 mb-4">
              <button
                type="button"
                onClick={addVariation}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Variation
              </button>
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2">
                Image
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
              type="submit"
            >
              Create Product
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateProduct;
