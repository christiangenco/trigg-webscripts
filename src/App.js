import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  useNavigate,
  useLocation,
  Routes,
} from "react-router-dom";

import Tabs from "./Tabs";

const DynamicContent = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    // Fetch data or perform other actions based on the currentPath
  }, [currentPath]);

  return <div>Content for: {currentPath}</div>;
};

function App() {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    // Replace this with your actual API call
    const fetchTabs = async () => {
      const response = [
        { id: 1, name: "Tab 1", path: "/tab1" },
        { id: 2, name: "Tab 2", path: "/tab2" },
      ];

      setTabs(response);
    };

    fetchTabs();
  }, []);

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="mx-auto max-w-3xl">
        {tabs && <Tabs tabs={tabs} onChange={navigate} />}
        <nav>
          <ul>
            {tabs.map((tab) => (
              <li key={tab.id} onClick={() => handleTabClick(tab.path)}>
                {tab.name}
              </li>
            ))}
          </ul>
        </nav>

        <Routes>
          <Route path="/:tabId" element={<DynamicContent />} />
        </Routes>
      </div>
    </div>
  );
}

export default () => {
  return (
    <Router>
      <App />
    </Router>
  );
};
