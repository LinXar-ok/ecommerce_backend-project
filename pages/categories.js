import { Layout } from "@/components";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [properties, setProperties] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [changeCategory, setChangeCategory] = useState(null);
  const [name, setName] = useState("");
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (changeCategory) {
      await axios.put("/api/categories", { ...data, _id: changeCategory._id });
      setChangeCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setChangeCategory(category);
    setName(category.name);
    setParentCategory(category.parentCategory?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {changeCategory
          ? `Edit category ${changeCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Category name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            onChange={(e) => setParentCategory(e.target.value)}
            value={parentCategory}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn_default text-sm mb-2"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties?.map((property, index) => (
              <div key={properties._id} className="flex gap-1 mb-2">
                <input
                  onChange={(e) =>
                    handlePropertyNameChange(index, property, e.target.value)
                  }
                  value={property.name}
                  type="text"
                  placeholder="property name (example: color)"
                  className="mb-0"
                />
                <input
                  onChange={(e) =>
                    handlePropertyValuesChange(index, property, e.target.value)
                  }
                  value={property.values}
                  type="text"
                  placeholder="values, comma separated"
                  className="mb-0"
                />
                <button
                  className="btn_default"
                  onClick={() => removeProperty(index)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div className="flex gap-1">
          {changeCategory && (
            <button
              type="button"
              className="btn_default"
              onClick={() => {
                setChangeCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>

      {!changeCategory && (
        <table className="basic_table mt-4">
          <thead>
            <tr>
              <th>Category name</th>
              <th>Parent category</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parentCategory?.name}</td>
                  <td className="flex justify-between">
                    <button
                      className="btn-primary"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => deleteCategory(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

// export default Categories

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
