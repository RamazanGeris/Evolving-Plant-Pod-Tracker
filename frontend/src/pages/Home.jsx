import React, { useState, useEffect } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function HeroSection() {
  return (
    <div className="flex flex-col justify-center h-64 w-full max-w-2xl mx-auto">
      <h1 className="text-5xl font-extrabold mb-4 text-green-900 tracking-tight drop-shadow-lg">Selvy</h1>
      <p className="text-3xl text-green-800 font-medium mb-4">Doğadan İlham Alan Akıllı Takip</p>
      <div className="bg-white/80 rounded-xl px-8 py-4 shadow-md border border-green-200">
        <span className="text-green-900 font-semibold text-xl">Hoş geldin! Bitkilerini Selvy ile takip et.</span>
      </div>
    </div>
  );
}

function ModelSection() {
  const { scene } = useGLTF("/models/model1.glb");
  return (
    <div className="flex items-center justify-center h-64 w-full max-w-2xl mx-auto">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} style={{ background: "#F7FAF5", borderRadius: 16 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <primitive object={scene} scale={3.2} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

export default function Home({ refresh }) {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Podları API'den çek
  const fetchPods = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/api/pods`);
      setPods(res.data);
    } catch (err) {
      setError("Podlar yüklenemedi.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPods();
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="w-full md:w-1/2 flex items-start justify-center">
          <HeroSection />
        </div>
        <div className="w-full md:w-1/2 flex items-start justify-center">
          <ModelSection />
        </div>
      </div>
      
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4 text-green-700 relative z-10 mt-2">Podlar</h2>
        {error && <div className="text-red-600 mt-2 text-center relative z-10">{error}</div>}
        {loading ? (
          <div className="text-green-700 relative z-10">Yükleniyor...</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 w-full">
            {pods.map((pod) => (
              <li
                key={pod.id}
                className="bg-gradient-to-br from-[#B8D9A2]/40 to-white border border-green-200 rounded-2xl shadow-lg p-5 flex flex-col gap-2 hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 cursor-pointer relative overflow-hidden"
                onClick={() => window.location.href = `/pods/${pod.id}`}
                style={{ minHeight: 220 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg text-green-900">
                    {pod.name}
                  </span>
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-green-200 text-green-800 text-xs font-semibold">
                    {pod.type}
                  </span>
                </div>
                <div className="text-sm text-green-700">
                  Ekiliş Tarihi: {pod.planting_date}
                </div>
                {pod.description && (
                  <div className="text-green-800 text-sm italic mb-1">{pod.description}</div>
                )}
                {pod.care_note && (
                  <div className="text-green-700 text-xs mb-1">Bakım Notu: {pod.care_note}</div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {pod.images.map((img) => (
                    <img
                      key={img.id}
                      src={`${API_URL}/api/uploads/${img.filename}`}
                      alt="Pod"
                      className="w-16 h-16 object-cover rounded border border-green-300 shadow-sm bg-white"
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

useGLTF.preload("/models/model1.glb");

