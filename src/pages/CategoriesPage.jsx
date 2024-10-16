import Header from "../components/common/Header";
import CategoryTable from "../components/users/CategoryTable";

const CategoriesPage = ({ categories, setCategories }) => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Categories" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <CategoryTable categories={categories} setCategories={setCategories} />
      </main>
    </div>
  );
};
export default CategoriesPage;
