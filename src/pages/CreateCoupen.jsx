import Header from "../components/common/Header.jsx";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addCategoryFailure,
  addCategoryStart,
  addCategorySuccess,
} from "../Redux/Slices/categoriesSlice.jsx"; // You can update these as needed for coupons
import axios from "axios";
import { url } from "../../utils/url.js";

const api = axios.create({
  baseURL: url,
});

const CreateCoupon = ({ setCoupens }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  const handleClick = (e) => {
    e.preventDefault();
    // console.log(code, discount, description, active);
    const coupon = {
      code,
      discount,
      desc: description,
      active,
    };
    api
      .post("/coupens", coupon)
      .then((res) => {
        console.log(res);
        setCoupens((prev) => [...prev, res.data]);
        alert("Coupon added successfully");
        navigate("/coupens");
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Create Coupon"} />

      <main className="flex justify-center items-center w-full h-screen py-6 px-4 lg:px-8">
        <form
          className="w-full bg-gray-800 bg-opacity-50 backdrop-blur p-6 justify-center items-center max-w-lg"
          onSubmit={handleClick}
        >
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                htmlFor="grid-code"
              >
                Code
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-none focus:border-gray-500"
                id="grid-code"
                type="text"
                placeholder="DISCOUNT2024"
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                htmlFor="grid-discount"
              >
                Discount
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-none focus:border-gray-500"
                id="grid-discount"
                type="number"
                placeholder="50"
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                htmlFor="grid-description"
              >
                Description
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-none focus:border-gray-500"
                id="grid-description"
                type="text"
                placeholder="Coupon description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-100 text-xs font-bold mb-2"
                htmlFor="grid-active"
              >
                Active
              </label>
              <select
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-none focus:border-gray-500"
                id="grid-active"
                onChange={(e) => setActive(e.target.value === "true")}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
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

export default CreateCoupon;
