import React, { useEffect, useState } from "react";

const Form = ({ options, filename, onRun }) => {
  const [formValues, setFormValues] = useState(() =>
    JSON.parse(localStorage.getItem(filename) || "{}")
  );

  useEffect(() => {
    const storedValues = JSON.parse(localStorage.getItem(filename) || "{}");
    setFormValues(storedValues);
  }, [filename]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    const newFormValues = { ...formValues, [name]: newValue };
    setFormValues(newFormValues);
    localStorage.setItem(filename, JSON.stringify(newFormValues));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(filename, JSON.stringify(formValues));
    onRun(formValues);
  };

  return (
    <form className="w-full max-w-sm mx-auto" onSubmit={handleSubmit}>
      {options.map(({ alias, description, type }) => (
        <div key={alias} className="mb-4">
          <label htmlFor={alias} className="block text-gray-700 font-bold mb-2">
            {alias}
          </label>
          <input
            type={type === "boolean" ? "checkbox" : "text"}
            id={alias}
            name={alias}
            value={formValues[alias] || ""}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="text-gray-600 text-xs mt-1">{description}</p>
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Run
      </button>
    </form>
  );
};

export default Form;
