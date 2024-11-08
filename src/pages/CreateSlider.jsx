import Header from "../components/common/Header.jsx";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import {
//   addSliderFailure,
//   addSliderStart,
//   addSliderSuccess,
// } from "../Redux/Slices/slidersSlice.jsx";
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

const CreateSlider = ({ setSliders }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [smallPara, setSmallPara] = useState("");
  const [heading1, setHeading1] = useState("");
  const [heading2, setHeading2] = useState("");
  const [card1, setCard1] = useState("");
  const [card2, setCard2] = useState("");
  const [card3, setCard3] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);

  const handleClick = (e) => {
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
        console.log("Upload failed: ", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const sliderData = {
            smallPara,
            heading1,
            heading2,
            card1,
            card2,
            card3,
            link,
            img: downloadURL,
          };
          api
            .post("/sliders", sliderData)
            .then((res) => {
              console.log(res);
              setSliders((prev) => [...prev, res.data]);
              alert("Slider created successfully");
              navigate("/sliders");
            })
            .catch((err) => {
              console.log(err);
              alert(err);
            });
        });
      }
    );
  };

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Create Slider"} />

      <main className="flex justify-center items-center w-full h-screen py-6 px-4 lg:px-8">
        <form
          className="w-full bg-gray-800 bg-opacity-50 backdrop-blur p-6 justify-center items-center max-w-lg"
          onSubmit={handleClick}
        >
          {[
            "smallPara",
            "heading1",
            "heading2",
            "card1",
            "card2",
            "card3",
            "link",
          ].map((field, index) => (
            <div key={index} className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                  htmlFor={field}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-none focus:border-gray-500"
                  id={field}
                  type="text"
                  placeholder={field}
                  onChange={(e) => {
                    if (field === "smallPara") setSmallPara(e.target.value);
                    if (field === "heading1") setHeading1(e.target.value);
                    if (field === "heading2") setHeading2(e.target.value);
                    if (field === "card1") setCard1(e.target.value);
                    if (field === "card2") setCard2(e.target.value);
                    if (field === "card3") setCard3(e.target.value);
                    if (field === "link") setLink(e.target.value);
                  }}
                />
              </div>
            </div>
          ))}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                htmlFor="img"
              >
                Image
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-none focus:border-gray-500"
                id="img"
                type="file"
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

export default CreateSlider;
