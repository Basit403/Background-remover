"use client";

import { useState } from "react";

export default function BgRemover() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      setImage(file);

      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const removeBg = async () => {
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image_file", image);

    try {
      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.NEXT_PUBLIC_REMOVE_BG_KEY!,
        },
        body: formData,
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setResult(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-6 py-10">
      
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-3">
            Image Background Remover.
            </h1>

            <p className="text-gray-400">
            Upload an image and remove the background instantly.
            </p>
        </div>

        <div className="flex flex-col items-center gap-5 mb-10 w-full max-w-md">
            <label className="w-full border-2 border-dashed border-gray-600 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">

            <span className="text-gray-300 text-center">
                Click here to upload image
            </span>

            <input
                type="file"
                onChange={handleUpload}
                className="hidden"
            />
            </label>

            <button
            onClick={removeBg}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-8 py-3 rounded-xl transition"
            >
            {loading ? "Removing..." : "Remove Background"}
            </button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">

        <div className="bg-[#1E293B] rounded-2xl p-5 min-h-[400px] flex flex-col items-center justify-center shadow-lg">

          <h2 className="text-white text-2xl font-semibold mb-4">
            Original Image
          </h2>

           {preview && (
             <img src={preview} />
           )}
        </div>

        <div className="bg-[#1E293B] rounded-2xl p-5 min-h-[400px] flex flex-col items-center justify-center shadow-lg">

          <h2 className="text-white text-2xl font-semibold mb-4">
            Background Removed
          </h2>
           {result && (
                <div className="flex flex-col items-center gap-4">

                    <img
                    src={result}
                    alt="Result"
                    className="rounded-xl max-h-[350px] object-contain"
                    />

                    <a
                    href={result}
                    download="removed-background.png"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition duration-300"
                    >
                    Download Image
                    </a>

                </div>
            )}
        </div>
      </div>
    </main>
  );
}