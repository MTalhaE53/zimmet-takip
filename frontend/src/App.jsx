import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import ProductEdit from "./pages/ProductEdit";
import AssignProduct from "./pages/AssignProduct";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<ProductList />} />
          <Route path="/urun-ekle" element={<AddProduct />} />
          <Route path="/urun-duzenle/:id" element={<ProductEdit />} />
          <Route path="/zimmetle" element={<AssignProduct />} />
          <Route path="/urun-detay/:id" element={<ProductDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
