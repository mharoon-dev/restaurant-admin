import Header from "../components/common/Header";
import DealTable from "../components/users/DealTable";

const DealPage = ({ deals, setDeals, products }) => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Deals" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <DealTable deals={deals} setDeals={setDeals} products={products} />
      </main>
    </div>
  );
};
export default DealPage;
