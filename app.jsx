import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AestheticMusicApp() {
  const defaultPlaylist = [
    {
      id: 1,
      title: "Dreams",
      artist: "Joakim Karud",
      src: "https://cdn.pixabay.com/download/audio/2022/03/16/audio_4bb6060d13.mp3?filename=dreams-2673.mp3",
      cover: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Neon Lights",
      artist: "E's Jammy Jams",
      src: "https://cdn.pixabay.com/download/audio/2022/03/22/audio_4dfe0aa0e9.mp3?filename=neon-lights-2754.mp3",
      cover: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Late Night Drive",
      artist: "Pulse",
      src: "https://cdn.pixabay.com/download/audio/2021/12/20/audio_d4b53f1a5f.mp3?filename=late-night-drive-17323.mp3",
      cover: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Sunny",
      artist: "KODOMOi",
      src: "https://cdn.pixabay.com/download/audio/2022/03/31/audio_2bc3c76b47.mp3?filename=sunny-27127.mp3",
      cover: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "Coffee",
      artist: "Tobu",
      src: "https://cdn.pixabay.com/download/audio/2021/09/03/audio_19d790d74b.mp3?filename=coffee-13083.mp3",
      cover: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 6,
      title: "Island",
      artist: "Declan DP",
      src: "https://cdn.pixabay.com/download/audio/2021/11/19/audio_2df48b716d.mp3?filename=island-17261.mp3",
      cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 7,
      title: "Jazz In Paris",
      artist: "Media Right Productions",
      src: "https://cdn.pixabay.com/download/audio/2021/10/06/audio_4ff2e350a1.mp3?filename=jazz-in-paris-14875.mp3",
      cover: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 8,
      title: "Clear Day",
      artist: "Bensound",
      src: "https://www.bensound.com/bensound-music/bensound-clearday.mp3",
      cover: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 9,
      title: "Cute",
      artist: "Bensound",
      src: "https://www.bensound.com/bensound-music/bensound-cute.mp3",
      cover: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 10,
      title: "Energy",
      artist: "Bensound",
      src: "https://www.bensound.com/bensound-music/bensound-energy.mp3",
      cover: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400&auto=format&fit=crop",
    },
  ];

  const [playlist, setPlaylist] = useState(defaultPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState(new Set());

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const timeUpdate = () => setProgress(audio.currentTime);
    const loadedMeta = () => setDuration(audio.duration || 0);
    const ended = () => {
      if (isLoop) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener("timeupdate", timeUpdate);
    audio.addEventListener("loadedmetadata", loadedMeta);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", timeUpdate);
      audio.removeEventListener("loadedmetadata", loadedMeta);
      audio.removeEventListener("ended", ended);
    };
  }, [currentIndex, isLoop, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [isPlaying, currentIndex]);

  function togglePlay() {
    setIsPlaying((p) => !p);
  }
  function handlePrev() {
    setCurrentIndex((i) => (i <= 0 ? playlist.length - 1 : i - 1));
    setIsPlaying(true);
  }
  function handleNext() {
    setCurrentIndex((i) => {
      if (isShuffle) {
        const r = Math.floor(Math.random() * playlist.length);
        return r;
      }
      return i >= playlist.length - 1 ? 0 : i + 1;
    });
    setIsPlaying(true);
  }
  function handleSeek(e) {
    const val = Number(e.target.value);
    audioRef.current.currentTime = val;
    setProgress(val);
  }
  function handleVolume(e) {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  }
  function handleAddFiles(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newTracks = files.map((f, idx) => ({
      id: Date.now() + idx,
      title: f.name.replace(/\.[^/.]+$/, ""),
      artist: "Local",
      src: URL.createObjectURL(f),
      cover:
        "https://images.unsplash.com/photo-1526178618479-2f5f19a0a7a4?q=80&w=400&auto=format&fit=crop",
    }));
    setPlaylist((p) => [...p, ...newTracks]);
  }
  function formatTime(t) {
    if (!t || isNaN(t)) return "0:00";
    const mm = Math.floor(t / 60);
    const ss = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${mm}:${ss}`;
  }

  const currentTrack = playlist[currentIndex] || {};
  const filtered = playlist.filter(
    (tr) =>
      tr.title.toLowerCase().includes(search.toLowerCase()) ||
      tr.artist.toLowerCase().includes(search.toLowerCase())
  );
  function jumpToTrack(i) {
    setCurrentIndex(i);
    setIsPlaying(true);
  }

  function toggleLike(id) {
    setLiked((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1224] to-[#071129] p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur rounded-3xl p-6 shadow-2xl text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - player + animated vinyl */}
          <div className="flex flex-col items-center">
            <div className="relative w-56 h-56 mb-4">
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={{
                  repeat: isPlaying ? Infinity : 0,
                  duration: 8,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
                style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.6)" }}
              >
                <img
                  src={currentTrack.cover}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* center label to look like a vinyl */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black rounded-full flex items-center justify-center text-xs text-white/80 shadow-inner">
                <div className="w-8 h-8 bg-white/10 rounded-full" />
              </div>

              {/* subtle glow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isPlaying ? 0.25 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(99,102,241,0.4), transparent)",
                }}
              />
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold tracking-wide">
                {currentTrack.title}
              </h3>
              <p className="text-sm text-white/70">{currentTrack.artist}</p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="p-3 bg-white/5 rounded-full hover:scale-105 transition"
              >
                ⏮
              </button>
              <button
                onClick={togglePlay}
                className="p-4 bg-white text-indigo-700 rounded-full font-bold shadow-lg hover:scale-105 transition"
                aria-label="play-pause"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button
                onClick={handleNext}
                className="p-3 bg-white/5 rounded-full hover:scale-105 transition"
              >
                ⏭
              </button>
            </div>

            <div className="w-full mt-6">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-sm mt-1 text-white/70">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div className="flex items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm">Vol</label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolume}
                    className="w-36"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsShuffle((s) => !s)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      isShuffle ? "bg-indigo-500" : "bg-white/5"
                    }`}
                  >
                    Shuffle
                  </button>
                  <button
                    onClick={() => setIsLoop((l) => !l)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      isLoop ? "bg-indigo-500" : "bg-white/5"
                    }`}
                  >
                    Loop
                  </button>
                </div>
              </div>

              <div className="mt-3 flex gap-2 items-center">
                <input
                  type="file"
                  accept="audio/*"
                  id="upload"
                  onChange={handleAddFiles}
                  className="hidden"
                />
                <label
                  htmlFor="upload"
                  className="cursor-pointer bg-white/5 px-3 py-2 rounded-md text-sm"
                >
                  + Upload
                </label>
                <input
                  type="text"
                  placeholder="Search title or artist..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ml-auto bg-white/3 rounded-md px-3 py-2 text-sm w-44"
                />
              </div>
            </div>
          </div>

          {/* Right column - playlist */}
          <div className="md:col-span-2">
            <div className="bg-white/4 rounded-2xl p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Playlist</h2>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-white/60">Liked: {liked.size}</div>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[56vh] pr-2">
                <AnimatePresence>
                  {(filtered.length === 0 ? playlist : filtered).map((t, i) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.35 }}
                      onClick={() => jumpToTrack(i)}
                      className={`flex items-center gap-3 p-3 rounded-md mb-2 cursor-pointer hover:scale-[1.01] transition ${
                        i === currentIndex ? "bg-indigo-600/20" : "bg-white/2"
                      }`}
                    >
                      <img
                        src={t.cover}
                        alt="cover"
                        className="w-14 h-14 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{t.title}</div>
                        <div className="text-sm text-white/70">{t.artist}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-white/60">{formatTime(0)}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(t.id);
                          }}
                          className={`px-2 py-1 rounded-md text-sm ${
                            liked.has(t.id) ? "bg-pink-500" : "bg-white/6"
                          }`}
                        >
                          {liked.has(t.id) ? "♥" : "♡"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-auto pt-4 text-sm text-white/60 flex items-center justify-between">
                <div>Drag & drop not implemented — use upload to add local songs.</div>
                <div>
                  Tip: put audio files in{" "}
                  <code className="bg-white/5 px-1 rounded">public/assets/</code> for
                  quick testing.
                </div>
              </div>
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.src}
          preload="metadata"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        />
      </div>
    </div>
  );
}
