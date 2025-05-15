import React, { useState } from "react";
import { POD_TYPES } from "../constants/podTypes";

const initialState = {
  name: "",
  type: POD_TYPES[0].value,
  description: "",
  planting_date: "",
  image: null,
  care_note: "",
};

export default function PodForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm(initialState);
  };

  return (
    <form
      className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg border border-green-200"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold text-green-800 mb-2">Yeni Pod Ekle</h2>
      <div>
        <label className="block font-semibold text-green-900 mb-1">Pod İsmi</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg px-3 py-2 w-full bg-white text-green-900 placeholder:text-green-400 transition"
          placeholder="Örn: Balkon Fesleğeni"
          required
        />
      </div>
      <div>
        <label className="block font-semibold text-green-900 mb-1">Tür</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg px-3 py-2 w-full bg-white text-green-900 transition"
        >
          {POD_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-semibold text-green-900 mb-1">Açıklama</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg px-3 py-2 w-full bg-white text-green-900 placeholder:text-green-400 transition"
          placeholder="Ek bilgi (isteğe bağlı)"
        />
      </div>
      <div>
        <label className="block font-semibold text-green-900 mb-1">Ekiliş Tarihi</label>
        <input
          type="date"
          name="planting_date"
          value={form.planting_date}
          onChange={handleChange}
          className="border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg px-3 py-2 w-full bg-white text-green-900 transition"
          required
        />
      </div>
      <div>
        <label className="block font-semibold text-green-900 mb-1">İlk Fotoğraf (isteğe bağlı)</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-green-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition"
        />
      </div>
      <div>
        <label className="block font-semibold text-green-900 mb-1">Bakım Notu (isteğe bağlı)</label>
        <input
          type="text"
          name="care_note"
          value={form.care_note}
          onChange={handleChange}
          className="border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg px-3 py-2 w-full bg-white text-green-900 placeholder:text-green-400 transition shadow-sm"
          placeholder="Örn: Haftada 1 sulama, sabah güneşi seviyor"
        />
      </div>
      <button
        type="submit"
        className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-green-700 hover:to-green-600 transition"
      >
        Podu Ekle
      </button>
    </form>
  );
}