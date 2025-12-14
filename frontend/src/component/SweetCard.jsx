import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SweetCard = ({ filteredSweets, user, onRefresh }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [actionQuantity, setActionQuantity] = useState(0);
  const [selectedSweetId, setSelectedSweetId] = useState(null);
  const [selectedSweetName, setSelectedSweetName] = useState("");
  const [actionType, setActionType] = useState(""); // "restock" or "purchase"

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BACKENDURL}/api/sweets/${id}`,
        { withCredentials: true }
      );
      alert("Successfully Deleted!");
      onRefresh?.();
    } catch (error) {
      console.error("Error deleting sweet:", error);
    }
  };

  const openPopup = (id, name, type) => {
    setSelectedSweetId(id);
    setSelectedSweetName(name || "");
    setActionQuantity(0);
    setActionType(type);
    setShowPopup(true);
  };

  const handleSubmit = async () => {
    if (actionQuantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      const endpoint =
        actionType === "restock"
          ? `/api/sweets/${selectedSweetId}/restock`
          : `/api/sweets/${selectedSweetId}/purchase`;

      await axios.post(
        `${import.meta.env.VITE_APP_BACKENDURL}${endpoint}`,
        { quantity: actionQuantity },
        { withCredentials: true }
      );

      alert(
        actionType === "restock"
          ? "Quantity updated successfully!"
          : "Purchase successful!"
      );
      setShowPopup(false);
      onRefresh?.();
    } catch (error) {
      console.error(`Error during ${actionType}:`, error);
    }
  };

  // Formatter for Indian Rupee
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {filteredSweets.length === 0 ? (
        <div className="col-span-full card p-10 text-center">
          <div className="text-2xl font-extrabold text-slate-900">Nothing found</div>
          <div className="mt-2 text-slate-600">Try changing filters or clear them.</div>
        </div>
      ) : (
        filteredSweets.map((sweet) => (
          <div
            key={sweet._id}
            className="group card overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] bg-slate-100">
              {sweet.sweetpic ? (
                <img
                  src={sweet.sweetpic}
                  alt={sweet.name}
                  className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-[linear-gradient(135deg,var(--c1),var(--c2))] text-white">
                  <div className="text-3xl font-extrabold">{(sweet.name || "S").slice(0, 1).toUpperCase()}</div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

              <div className="absolute left-3 top-3 flex gap-2">
                <span className="rounded-full bg-white/80 backdrop-blur px-3 py-1 text-xs font-semibold text-slate-900 border border-white/60">
                  {sweet.category}
                </span>
              </div>

              <div className="absolute right-3 top-3">
                <span className="rounded-full bg-slate-900/70 text-white px-3 py-1 text-xs font-semibold backdrop-blur">
                  {formatPrice(sweet.price)} / piece
                </span>
              </div>

              <div className="absolute left-3 bottom-3 flex items-center gap-2">
                <span
                  className={
                    "rounded-full px-3 py-1 text-xs font-semibold border backdrop-blur " +
                    (Number(sweet.quantity) <= 5
                      ? "bg-rose-50/80 text-rose-700 border-rose-200"
                      : "bg-emerald-50/80 text-emerald-700 border-emerald-200")
                  }
                >
                  Qty: {sweet.quantity}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {sweet.name}
                </h2>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => openPopup(sweet._id, sweet.name, "purchase")}
                  className="btn btn-primary w-full"
                >
                  Purchase
                </button>

                {user?.isAdmin ? (
                  <button
                    onClick={() => openPopup(sweet._id, sweet.name, "restock")}
                    className="btn btn-outline w-full"
                  >
                    Restock
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn btn-outline w-full"
                    title="Admin only"
                  >
                    Admin only
                  </button>
                )}
              </div>

              {user?.isAdmin ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link to={`/update/${sweet._id}`} className="btn btn-outline w-full text-center">
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(sweet._id)}
                    className="btn w-full text-white bg-rose-500 hover:bg-rose-600 shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))
      )}

      {/* Action Popup for Restock or Purchase */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          />

          <div className="relative w-full max-w-md card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {actionType === "restock" ? "Restock" : "Purchase"}
                </h2>
                <div className="mt-1 text-sm text-slate-600">
                  {selectedSweetName ? (
                    <span>
                      For <span className="font-semibold text-slate-900">{selectedSweetName}</span>
                    </span>
                  ) : null}
                </div>
              </div>

              <button
                onClick={() => setShowPopup(false)}
                className="btn btn-outline px-3"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-600">Quantity</label>
              <input
                type="number"
                min="1"
                value={actionQuantity}
                onChange={(e) => setActionQuantity(Number(e.target.value))}
                className="input mt-1"
                placeholder="Enter quantity"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowPopup(false)} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn btn-primary">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SweetCard;
