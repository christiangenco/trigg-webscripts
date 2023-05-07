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
import Form from "./Form";

const serverUrl = "http://localhost:4031";

function ScriptRunner({ script }) {
  const { options } = script;

  return (
    <div>
      <Form
        filename={script.filename}
        options={options}
        onRun={async (args) => {
          const res = await fetch(`${serverUrl}/${script.filename}.json`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(args),
          });
          const { stdout, stderr, exitCode } = await res.json();
          console.log({ stdout, stderr, exitCode });
        }}
      />
    </div>
  );
}

const DynamicContent = ({ scripts }) => {
  const location = useLocation();
  const currentPath = location.pathname.replace("/", "");

  const script = scripts[currentPath];
  if (!script) return <div>404</div>;

  return <ScriptRunner script={script} />;
};

function App() {
  const navigate = useNavigate();
  const [scripts, setScripts] = useState({});
  const tabs = Object.keys(scripts).map((key) => {
    return { id: key, name: key, path: key };
  });

  useEffect(() => {
    // id, name, path
    fetch(`${serverUrl}/commands.json`).then((response) => {
      response.json().then((data) => {
        setScripts(data);
      });
    });

    // const fetchTabs = async () => {
    //   const response = [
    //     { id: 1, name: "Tab 1", path: "/tab1" },
    //     { id: 2, name: "Tab 2", path: "/tab2" },
    //   ];

    //   setTabs(response);
    // };

    // fetchTabs();
  }, []);

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="mx-auto max-w-3xl">
        {tabs && <Tabs tabs={tabs} onChange={navigate} />}
        <Routes>
          <Route
            path="/:tabId"
            element={<DynamicContent scripts={scripts} />}
          />
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
