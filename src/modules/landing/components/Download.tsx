import { type ReactElement, useState } from "react";
import logo from "../../../assets/images/logo/Sunnyyyyyyyyy.png";
import { motion } from "framer-motion";

export default function Download(): ReactElement {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      const url =
        "https://github.com/jeru7/MathPath-Server/releases/download/untagged-b08816de60ea5aa9eca0/Math-Path10.zip";
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Download failed with status ${response.status}`);
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream found");
      const contentLength = +(response.headers.get("content-length") || 0);
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedLength += value.length;
          if (contentLength > 0)
            setDownloadProgress(
              Math.round((receivedLength / contentLength) * 100),
            );
        }
      }
      const blob = new Blob(chunks, { type: "application/zip" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Math-Path10.zip";
      document.body.appendChild(link);
      link.click();
      setDownloadProgress(100);
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 2000);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Please try again later.");
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <section
      className="font-jersey flex w-screen flex-col items-center justify-center gap-16 bg-inherit px-8 text-[var(--primary-white)]"
      id="download"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.h3
          className="font-baloo text-5xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          MathPath
        </motion.h3>
        <motion.img
          src={logo}
          alt="MathPath App Icon"
          className="rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        />
        <div className="flex flex-col items-center gap-2">
          <motion.button
            className={`rounded-full px-3 py-1 text-xl transition-all ${isDownloading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-[var(--primary-yellow)] text-[var(--primary-black)] hover:scale-105 hover:cursor-pointer"}`}
            onClick={handleDownload}
            disabled={isDownloading}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            {isDownloading ? `downloading... ${downloadProgress}%` : "download"}
          </motion.button>
          {isDownloading && (
            <motion.div
              className="w-48 bg-gray-700 rounded-full h-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div
                className="bg-[var(--primary-yellow)] h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
