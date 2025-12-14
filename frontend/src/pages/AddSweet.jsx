import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import Header from "../component/Header"
import Backdrop from "../component/Backdrop";

const AddSweet = () => {
    const [user, setUser] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_APP_BACKENDURL}/api/auth/getUserData`,
                    { withCredentials: true }
                );
                if (res) {
                    setUser(res.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setUser(null);
            }
        };

        fetchUserData();
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        quantity: "",
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
      if (!file) {
        setPreview("");
        return;
      }
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("price", formData.price);
            data.append("category", formData.category);
            data.append("quantity", formData.quantity);
            if (file) data.append("file", file);

            const res = await axios.post(
                `${import.meta.env.VITE_APP_BACKENDURL}/api/sweets`,
                data,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );

            setMessage(res.data.message);
            setFormData({ name: "", price: "", category: "", quantity: "" });
            setFile(null);

            navigate("/home")

        } catch (err) {
            setMessage(err.response?.data?.message || "Error adding sweet");
        }
    };

    return (
      <Backdrop>
        <div className="min-h-screen flex flex-col">
          <Header user={user} />

          <main className="mx-auto w-full max-w-6xl px-4 py-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  <span className="bg-clip-text text-transparent bg-[linear-gradient(135deg,var(--c1),var(--c2))]">
                    Add a New Sweet
                  </span>
                </h1>
                <p className="mt-1 text-slate-600">Upload an image, set pricing, and publish to inventory.</p>
              </div>
              <button onClick={() => navigate("/home")} className="btn btn-outline">
                Back
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Form */}
              <form onSubmit={handleSubmit} className="card p-6 lg:col-span-3 space-y-4">
                {message ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                    {message}
                  </div>
                ) : null}

                <div>
                  <label className="text-xs font-semibold text-slate-600">Sweet Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input mt-1"
                    placeholder="e.g., Kaju Katli"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="input mt-1"
                      placeholder="e.g., 50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      className="input mt-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input mt-1"
                    placeholder="Bengali / Dryfruit / Chocolate"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Sweet Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 w-full rounded-xl border border-slate-200/70 bg-white/70 px-4 py-2.5 text-sm cursor-pointer file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
                  />
                  <p className="mt-2 text-xs text-slate-500">Recommended: square or 16:10 image, under 2MB.</p>
                </div>

                <button type="submit" className="btn btn-primary w-full py-3">
                  Add Sweet
                </button>
              </form>

              {/* Preview */}
              <div className="card p-6 lg:col-span-2">
                <div className="text-sm font-extrabold text-slate-900">Preview</div>
                <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200/60 bg-slate-100 aspect-[16/10]">
                  {preview ? (
                    <img src={preview} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-500">
                      Select an image to preview
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-2xl bg-slate-900 text-white p-4">
                  <div className="text-xs opacity-90">Preview</div>
                  <div className="mt-1 font-semibold">{formData.name || "Sweet name"}</div>
                  <div className="mt-1 text-sm opacity-80">
                    {formData.category || "Category"} • ₹{formData.price || "0"} • Qty {formData.quantity || "0"}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Backdrop>
    )
}

export default AddSweet
