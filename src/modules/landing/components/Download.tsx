import { type ReactElement, useState, useEffect } from "react";
import logo from "../../../assets/images/logo/Sunnyyyyyyyyy.png";
import { motion } from "framer-motion";
import { BASE_URI } from "../../core/constants/api.constant";

interface DownloadInfo {
  fileName: string;
  fileSize: number;
  fileSizeMB: string;
  version: string;
  lastUpdated: string;
  requirements: string;
  fileType: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export default function Download(): ReactElement {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState<DownloadInfo>({
    fileName: "Math-Path10.apk",
    fileSize: 0,
    fileSizeMB: "Loading...",
    version: "1.0.0",
    lastUpdated: "",
    requirements: "",
    fileType: "APK",
  });

  useEffect(() => {
    const fetchDownloadInfo = async () => {
      try {
        const response = await fetch(`${BASE_URI}/api/shared/download/info`);
        const data: ApiResponse<DownloadInfo> = await response.json();
        if (data.success && data.data) setFileInfo(data.data);
        else console.error("Failed to fetch download info:", data.message);
      } catch {
        setFileInfo((prev) => ({
          ...prev,
          fileSizeMB: "130",
          requirements: "Android 5.0+ (Lollipop or newer)",
        }));
      }
    };
    fetchDownloadInfo();
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      const response = await fetch(`${BASE_URI}/api/shared/download/game`);
      if (!response.ok)
        throw new Error(`Download failed with status ${response.status}`);
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server returned JSON error");
      }
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
      const blob = new Blob(chunks, {
        type: "application/vnd.android.package-archive",
      });
      const arrayBuffer = await blob.arrayBuffer();
      if (arrayBuffer.byteLength < 1024 * 1024) {
        const text = new TextDecoder().decode(arrayBuffer.slice(0, 200));
        throw new Error(
          `Downloaded file too small (${arrayBuffer.byteLength} bytes): ${text}`,
        );
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Math-Path10.apk";
      document.body.appendChild(link);
      link.click();
      setDownloadProgress(100);
      await fetch(`${BASE_URI}/api/web/shared/download/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 2000);
    } catch (error) {
      alert(
        `Download failed: ${error instanceof Error ? error.message : "Please try again later."}`,
      );
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
        <motion.p
          className="text-md font-plexMono font-semibold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          {fileInfo.fileSizeMB}mb • v{fileInfo.version}
        </motion.p>
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
        <motion.p
          className="text-sm font-plexMono text-gray-400 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true }}
        >
          {fileInfo.requirements || "Android 5.0+ (Lollipop or newer)"}
        </motion.p>
        <motion.div
          className="text-xs font-plexMono text-gray-500 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p>File: {fileInfo.fileName}</p>
          <p>Type: {fileInfo.fileType}</p>
          {fileInfo.lastUpdated && (
            <p>
              Last updated:{" "}
              {new Date(fileInfo.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
