import React, { useState, useEffect } from "react";
import SweetCard from "../component/SweetCard";
import axios from "axios";
import Header from "../component/Header";
import Backdrop from "../component/Backdrop";


const Home = () => {
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filteredSweets,setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(false);
 
   const [user, setUser] = useState("");


   
  const fetchSweets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKENDURL}/api/sweets`,
        { withCredentials: true }
      );
      setFilteredSweets(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    const fetchFilteredSweets = async () => {
      try {
        const hasFilters = Boolean(searchName || searchCategory || minPrice || maxPrice);
        if (!hasFilters) {
          await fetchSweets();
          return;
        }

        setLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_APP_BACKENDURL}/api/sweets/search`,
          {
            name: searchName || undefined,
            category: searchCategory || undefined,
            pricemin: minPrice || undefined,
            pricemax: maxPrice || undefined,
          },
          { withCredentials: true }
        );

        setFilteredSweets(res.data);
      } catch (error) {
        console.error("Error fetching sweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredSweets();
  }, [searchName, searchCategory, minPrice, maxPrice]);



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

  const clearFilters = () => {
    setSearchName("");
    setSearchCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <Backdrop>
      <div className="min-h-screen flex flex-col">
        <Header user={user} />

        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          {/* Hero */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                <span className="bg-clip-text text-transparent bg-[linear-gradient(135deg,var(--c1),var(--c2))]">
                  Browse Sweets
                </span>
              </h1>
              <p className="mt-1 text-slate-600">
                Search by name, category and price range. Purchase instantly. Admins can add, update & restock.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="card px-4 py-3">
                <div className="text-xs text-slate-500">Showing</div>
                <div className="text-lg font-bold text-slate-900">
                  {loading ? "…" : filteredSweets?.length || 0}
                </div>
              </div>
              <button onClick={clearFilters} className="btn btn-outline">
                Clear
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="card mt-6 p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <label className="text-xs font-semibold text-slate-600">Sweet Name</label>
                <input
                  type="text"
                  placeholder="e.g., Rasgulla"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="input mt-1"
                />
              </div>

              <div className="md:col-span-4">
                <label className="text-xs font-semibold text-slate-600">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Bengali, Dryfruit"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="input mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input mt-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Max Price</label>
                <input
                  type="number"
                  placeholder="999"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input mt-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                />
              </div>
            </div>

            {/* Quick chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["Bengali", "Dryfruit", "Chocolate", "Festival", "Sugarfree"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSearchCategory(c)}
                  className="rounded-full border border-slate-200/70 bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-white"
                >
                  {c}
                </button>
              ))}
              <div className="ml-auto text-xs text-slate-500 self-center">
                {loading ? "Loading..." : "Updated live as you type"}
              </div>
            </div>
          </div>

          {/* Grid */}
          <SweetCard
            filteredSweets={filteredSweets}
            user={user}
            onRefresh={fetchSweets}
          />
        </main>
      </div>
    </Backdrop>
  );
};

export default Home;
