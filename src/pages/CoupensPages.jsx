import Header from "../components/common/Header";
import CoupenTable from "../components/users/CoupenTable";

const CoupensPages = ({ coupens, setCoupens }) => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Coupons" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <CoupenTable coupens={coupens} setCoupens={setCoupens} />
      </main>
    </div>
  );
};
export default CoupensPages;
