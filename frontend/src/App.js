import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useSelector } from "react-redux";

const App = () => {
  const isAuth = Boolean(useSelector((state) => state.token));
  console.log(isAuth)

  const mode = useSelector((state) => state.mode);


  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
