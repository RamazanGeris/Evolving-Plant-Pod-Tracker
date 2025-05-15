import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { POD_TYPES } from "../constants/podTypes";
import * as THREE from "three";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// 3D Model Bileşeni
function Pod3DModel({ modelUrl }) {
  const { scene } = useGLTF(modelUrl);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const containerRef = React.useRef();

  // Determine base rotation for model2.glb
  const isModel2 = modelUrl && modelUrl.includes('model2.glb');
  const baseRotation = isModel2 ? [0, 4, 0] : [0, 0, 0];

  // Mouse move handler for rotation
  const handlePointerMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Normalize to [-1, 1]
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;
    // Limit rotation angles (in radians)
    const maxX = 0.5; // up/down
    const maxY = 0.8; // left/right
    setRotation([
      -normY * maxX,
      normX * maxY,
      0
    ]);
  };
  const handlePointerLeave = () => setRotation([0, 0, 0]);

  // Combine base rotation and mouse rotation
  const combinedRotation = [
    baseRotation[0] + rotation[0],
    baseRotation[1] + rotation[1],
    baseRotation[2] + rotation[2],
  ];

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      <Canvas camera={{ position: [0, 0, 5.5] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        <primitive object={scene} scale={3.5} rotation={combinedRotation} />
      </Canvas>
    </div>
  );
}

function ImageUploadForm({ podId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef();

  const handleFileButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Bir dosya seçmelisiniz.");
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", desc);
      await axios.post(`${API_URL}/api/pods/${podId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      setDesc("");
      onSuccess();
    } catch (err) {
      setError("Görsel yüklenemedi.");
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit}>
      <button
        className="rounded px-4 py-2 font-semibold transition-colors mb-1"
        style={{ backgroundColor: '#875800', color: '#fff', width: 'fit-content' }}
        type="button"
        onClick={handleFileButtonClick}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#5c3a00')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#875800')}
      >
        {file ? `Seçildi: ${file.name}` : "Fotoğraf Seç"}
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={e => setFile(e.target.files[0])}
      />
      <input type="text" placeholder="Açıklama (isteğe bağlı)" value={desc} onChange={e => setDesc(e.target.value)} className="border rounded px-2 py-1 border-[#875800]" />
      <button
        type="submit"
        className="rounded px-4 py-2 mt-1 font-semibold transition-colors"
        style={{ backgroundColor: '#875800', color: '#fff' }}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#5c3a00')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#875800')}
        disabled={loading}
      >
        {loading ? "Yükleniyor..." : "Yükle"}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}

function PodEditForm({ pod, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: pod.name,
    type: pod.type,
    description: pod.description || "",
    planting_date: pod.planting_date,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSave(form);
    } catch (err) {
      setError("Güncelleme başarısız.");
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4 mt-4 p-4 bg-white rounded-xl border border-[#b88c4a]" onSubmit={handleSubmit}>
      <div>
        <label className="block font-semibold text-[#875800] mb-1">Pod İsmi</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} className="border rounded px-2 py-1 w-full border-[#875800]" required />
      </div>
      <div>
        <label className="block font-semibold text-[#875800] mb-1">Tür</label>
        <select name="type" value={form.type} onChange={handleChange} className="border rounded px-2 py-1 w-full border-[#875800]">
          {POD_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-semibold text-[#875800] mb-1">Açıklama</label>
        <input type="text" name="description" value={form.description} onChange={handleChange} className="border rounded px-2 py-1 w-full border-[#875800]" />
      </div>
      <div>
        <label className="block font-semibold text-[#875800] mb-1">Ekiliş Tarihi</label>
        <input type="date" name="planting_date" value={form.planting_date} onChange={handleChange} className="border rounded px-2 py-1 w-full border-[#875800]" required />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="px-4 py-2 rounded font-semibold transition-colors"
          style={{ backgroundColor: '#875800', color: '#fff' }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#5c3a00')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#875800')}
          disabled={loading}
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded font-semibold border border-[#875800] transition-colors"
          style={{ color: '#875800', backgroundColor: '#fff' }}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#f3e7d3';
            e.currentTarget.style.color = '#5c3a00';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.color = '#875800';
          }}
          onClick={onCancel}
        >
          İptal
        </button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}

export default function PodDetail() {
  const { id } = useParams();
  const [pod, setPod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPod = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/api/pods`);
      const found = res.data.find((p) => p.id === Number(id));
      setPod(found);
    } catch (err) {
      setError("Pod yüklenemedi.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPod();
    // eslint-disable-next-line
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Bu podu silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`${API_URL}/api/pods/${id}`);
      navigate("/");
    } catch (err) {
      setError("Pod silinemedi.");
    }
  };

  const handleUpdate = async (form) => {
    await axios.put(`${API_URL}/api/pods/${id}`, form);
    setEditMode(false);
    fetchPod();
  };

  // Rastgele model seçimi (her tür için aynı algoritma)
  const modelUrl = useMemo(() => {
    if (!pod || !pod.type) return null;
    const models = ["/models/model1.glb", "/models/model2.glb"];
    let hash = 0;
    for (let i = 0; i < pod.type.length; i++) hash += pod.type.charCodeAt(i);
    return models[hash % models.length];
  }, [pod]);

  if (loading) return <div className="text-green-700 text-center py-10">Yükleniyor...</div>;
  if (!pod) return <div className="text-red-700 text-center py-10">Pod bulunamadı.</div>;

  return (
    <div className="w-full min-h-[calc(100vh-88px)] flex items-center justify-center px-0 py-16 bg-[#F7FAF5]">
      <div className="w-[95vw] max-w-none bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-2xl border border-green-200 p-16">
        <Link
          to="/"
          className="font-semibold mb-8 inline-flex items-center gap-2 text-xl transition-colors"
          style={{ color: '#875800' }}
          onMouseOver={e => (e.currentTarget.style.color = '#5c3a00')}
          onMouseOut={e => (e.currentTarget.style.color = '#875800')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Geri Dön
        </Link>
        <div className="flex justify-between items-center mt-4 mb-10">
          <h1 className="text-5xl font-extrabold text-green-900">{pod.name}</h1>
          <div className="flex gap-6">
            <button
              onClick={() => setEditMode((v) => !v)}
              className="text-white px-7 py-3 rounded-xl font-semibold text-lg transition-colors shadow-md"
              style={{ backgroundColor: '#875800' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#5c3a00')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#875800')}
            >
              {editMode ? "Vazgeç" : "Düzenle"}
            </button>
            <button
              onClick={handleDelete}
              className="px-7 py-3 rounded-xl font-semibold text-lg transition-colors shadow-md border border-[#5c3a00]"
              style={{ backgroundColor: '#5c3a00', color: '#fff' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#b88c4a')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#5c3a00')}
            >
              Sil
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Sol: Pod Bilgileri */}
          <div className="space-y-10 text-lg">
            <div className="flex items-center gap-6">
              <span className="px-4 py-2 rounded-full bg-green-200 text-green-800 text-xl font-semibold">{pod.type}</span>
              <span className="text-green-700 text-xl">Ekiliş Tarihi: {pod.planting_date}</span>
            </div>
            {pod.description && (
              <div>
                <div className="bg-green-100 border border-green-200 rounded-xl p-6 italic text-green-900 shadow-inner text-xl">
                  {pod.description}
                </div>
              </div>
            )}
            {editMode && <PodEditForm pod={pod} onCancel={() => setEditMode(false)} onSave={handleUpdate} />}
            <div className="flex flex-wrap gap-6">
              {(pod.images || []).map((img) => (
                <div key={img.id} className="flex flex-col items-center">
                  <img
                    src={`${API_URL}/api/uploads/${img.filename}`}
                    alt="Pod"
                    className="w-32 h-32 object-cover rounded border border-green-300 shadow bg-white"
                  />
                  <span className="text-base text-green-700 mt-2">{img.description}</span>
                  <span className="text-xs text-gray-500">{img.upload_time?.slice(0, 10)}</span>
                </div>
              ))}
            </div>
            <ImageUploadForm podId={pod.id} onSuccess={fetchPod} />
            {error && <div className="text-red-600 text-center mt-6 text-lg">{error}</div>}
          </div>
          {/* Sağ: 3D Model */}
          <div className="h-[800px] w-full rounded-2xl shadow border border-green-200 flex items-center justify-center" style={{ background: '#eafbe7' }}>
            {modelUrl && (
              <Pod3DModel modelUrl={modelUrl} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


useGLTF.preload("/models/model1.glb");
useGLTF.preload("/models/model2.glb");
useGLTF.preload("/models/model2.glb");