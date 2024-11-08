import { useEffect } from "react";
import Header from "../components/common/Header";
import SliderTable from "../components/users/SliderTable.jsx";

const SliderPage = ({ sliders, setSliders }) => {
  useEffect(() => {}, [sliders]);
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Slider" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <SliderTable sliders={sliders} setSliders={setSliders} />
      </main>
    </div>
  );
};
export default SliderPage;
