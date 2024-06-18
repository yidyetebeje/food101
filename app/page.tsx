"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const loadModel = async () => {};
    loadModel();
  }, []);
  const [prediction, setPrediction] = useState<string[]>([]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const classifyImage = async () => {
    setLoading(true);
    const body = new FormData();
    body.append("file", selectedImage as Blob);
    try {
      const prediction = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: body,
      });
      const predict = await prediction.json();
      setPrediction(predict);
      console.log(predict);
    } catch (ex) {
      console.log(ex);
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16 bg-gray-80">
      <h1 className="text-6xl font-bold text-gray-800">Food Classification</h1>
      <div className="flex flex-col pt-10 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 p-2 border border-gray-300 rounded-md"
        />
        {preview && (
          <div className="mb-4">
            <Image
              src={preview}
              alt="Selected"
              width={300}
              height={300}
              className="object-cover rounded-md shadow-md"
            />
          </div>
        )}
        {selectedImage && (
          <button
            onClick={classifyImage}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
          >
            {loading ? "Classifying..." : "Classify"}
          </button>
        )}
        {classificationResult && (
          <div className="mt-4 p-4 border border-gray-300 rounded-md bg-white shadow-md">
            <p className="text-lg font-semibold text-gray-800">
              Classification Result:
            </p>
            <p className="text-xl text-blue-600">{classificationResult}</p>
          </div>
        )}
        {prediction.predictions && (
          <div className="mt-4 p-4 border border-gray-300 rounded-md bg-white shadow-md text-black">
            {" "}
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Prediction
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prediction.predictions?.map((item) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={item.food}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.food}
                      </th>
                      <td className="px-6 py-4">
                        {item.probability.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
