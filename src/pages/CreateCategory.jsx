import Header from "../components/common/Header.jsx";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addCategoryFailure,
  addCategoryStart,
  addCategorySuccess,
} from "../Redux/Slices/categoriesSlice.jsx";
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

const CreateCategory = ({ setCategories }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleClick = (e) => {
    // dispatch(addCategoryStart());
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
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const category = {
            name,
            img: downloadURL,
          };
          api
            .post("/categories", category)
            .then((res) => {
              console.log(res);
              // dispatch(addCategorySuccess(res.data));
              setCategories((prev) => [...prev, res.data]);
              alert("Category added successfully");
              navigate("/categories");
            })
            .catch((err) => {
              console.log(err);
              // dispatch(addCategoryFailure());
              alert(err);
            });
        });
      }
    );
  };

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Create Category"} />

      {/* To center the main content vertically and horizontally */}
      <main className="flex justify-center items-center w-full h-screen py-6 px-4 lg:px-8">
        <form
          className="w-full bg-gray-800 bg-opacity-50 backdrop-blur p-6 justify-center items-center max-w-lg"
          onSubmit={handleClick}
        >
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-none focus:border-gray-500"
                id="grid-password"
                type="text"
                placeholder="Man"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Image
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-none focus:border-gray-500"
                id="grid-password"
                type="file"
                placeholder="******************"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
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

export default CreateCategory;
