import { useState } from "react";
import Reveal from "../ui/Reveal";
import "./demo-video.css";

// Demo-Video: Browser-Frame mit Poster-Optik bis zum Klick auf Play,
// danach echtes <video> im selben Frame.
export default function DemoVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="demo" id="demo">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">// Sieh es in Aktion</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="demo-title">
            90 Sekunden. <span className="accent">Ein System bei der Arbeit.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="demo-frame">
            <div className="demo-bar" aria-hidden="true">
              <span /><span /><span />
            </div>
            <div
              className="demo-stage"
              style={{ backgroundImage: "url('/images/novarisfinal.webp')" }}
            >
              {playing ? (
                <video
                  className="demo-video"
                  src="/videos/demo-v6.mp4"
                  poster="/images/novarisfinal.webp"
                  controls
                  autoPlay
                  playsInline
                  preload="none"
                />
              ) : (
                <>
                  <button
                    type="button"
                    className="demo-play"
                    aria-label="Demo-Video abspielen"
                    onClick={() => setPlaying(true)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5.5 L18 12 L8 18.5 Z" fill="currentColor" />
                    </svg>
                    <span className="demo-play-ring" aria-hidden="true" />
                  </button>
                  <span className="demo-badge">Demo folgt in Kürze</span>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
