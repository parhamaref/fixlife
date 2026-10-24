/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ============================================================================
 * SCROLL-DRIVEN 3D VIDEO HERO ARCHITECTURE & ENCODING SPECIFICATION (FIXLIFE.IR)
 * ============================================================================
 *
 * Why standard MP4 files stutter during scroll scrubbing:
 * Standard web videos use Long-GOP (Group of Pictures) compression where
 * keyframes (I-frames) are placed every 2 to 5 seconds (every 60–120 frames),
 * with intermediate P-frames and B-frames referencing surrounding frames.
 * When scrubbing via `video.currentTime` (especially in reverse), the hardware
 * decoder must jump back to the nearest I-frame and decode dozens of frames
 * sequentially before displaying the target frame, causing visible lag and jumps.
 *
 * Preferred Encoding Characteristics Implemented Here:
 * 1. All-Intra / Frequent Keyframes (`-g 1 -keyint_min 1 -bf 0`):
 *    Every frame (or every 2nd frame for VP9 WebM) is encoded as an independent
 *    keyframe with zero B-frames, enabling O(1) instant random-access seeking
 *    in both forward and backward scroll directions.
 * 2. Audio Track Stripped (`-an`):
 *    Scroll-scrubbed videos are silent; removing the AAC audio stream prevents
 *    the browser media pipeline from re-synchronizing audio buffers on seek.
 * 3. Faststart MOOV Atom (`-movflags +faststart`):
 *    Places index metadata at the head of the file for immediate metadata parse.
 * 4. Responsive Resolution & Bitrate Tiers:
 *    - Desktop MP4 (`1280x720`, H.264 High, All-Intra, ~24fps)
 *    - Desktop WebM (`1280x720`, VP9, `-g 2`, fast decode)
 *    - Mobile MP4 (`960x540`, H.264 All-Intra, reduced memory bandwidth)
 *    - External Fallback (`https://panonama.ir/wp-content/uploads/2026/10/gemini_generated_video_40aadce2.mp4`)
 * 5. In-Memory Blob Preloading + rAF Exponential Smoothing:
 *    Scroll events only update `targetProgressRef` (passive listener, zero React
 *    re-renders). A demand-driven `requestAnimationFrame` loop interpolates
 *    `currentVideoTime` toward `targetVideoTime` and guards against seek floods
 *    by checking `!video.seeking` and a minimum frame delta threshold.
 */

import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';

export const EXTERNAL_HERO_VIDEO_URL =
  'https://panonama.ir/wp-content/uploads/2026/10/gemini_generated_video_40aadce2.mp4';

interface ScrollVideoHeroProps {
  onShopNow: () => void;
  onExploreCollection: () => void;
}

export const ScrollVideoHero: React.FC<ScrollVideoHeroProps> = ({
  onShopNow,
  onExploreCollection,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const progressBarFillRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  // Mutable animation refs — zero React state updates during scroll
  const targetProgressRef = useRef<number>(0);
  const smoothedProgressRef = useRef<number>(0);
  const lastCommittedTimeRef = useRef<number>(-1);
  const videoDurationRef = useRef<number>(10.01);
  const rafIdRef = useRef<number | null>(null);
  const isLoopActiveRef = useRef<boolean>(false);
  const blobUrlRef = useRef<string | null>(null);

  // Detect `prefers-reduced-motion` and responsive mobile viewport
  useEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileMedia = window.matchMedia('(max-width: 767px)');

    setPrefersReducedMotion(motionMedia.matches);
    setIsMobileViewport(mobileMedia.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    const handleMobileChange = (e: MediaQueryListEvent) => {
      setIsMobileViewport(e.matches);
    };

    motionMedia.addEventListener('change', handleMotionChange);
    mobileMedia.addEventListener('change', handleMobileChange);

    return () => {
      motionMedia.removeEventListener('change', handleMotionChange);
      mobileMedia.removeEventListener('change', handleMobileChange);
    };
  }, []);

  // Aggressively preload the optimal video stream into an in-memory Blob URL
  // so random-access seeking never waits on network byte-range requests.
  useEffect(() => {
    if (prefersReducedMotion) return;

    let isCancelled = false;
    const controller = new AbortController();

    const preloadIntoMemory = async () => {
      const preferredUrl = window.matchMedia('(max-width: 767px)').matches
        ? '/assets/lumiere/hero-scroll-mobile.mp4'
        : '/assets/lumiere/hero-scroll-desktop.mp4';

      const candidateUrls = [
        preferredUrl,
        '/assets/lumiere/hero-source.mp4',
        EXTERNAL_HERO_VIDEO_URL,
      ];

      for (const url of candidateUrls) {
        try {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) continue;
          const blob = await response.blob();
          if (isCancelled) return;

          if (blob.size > 1000) {
            const objectUrl = URL.createObjectURL(blob);
            blobUrlRef.current = objectUrl;
            const video = videoRef.current;
            if (video) {
              video.src = objectUrl;
              video.load();
            }
            return;
          }
        } catch {
          // Proceed to next fallback source if fetch is aborted or fails
        }
      }
    };

    preloadIntoMemory();

    return () => {
      isCancelled = true;
      controller.abort();
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  // Core Scroll-to-Video Scrubbing Engine (requestAnimationFrame + Interpolation)
  useEffect(() => {
    if (prefersReducedMotion || hasVideoError) return;

    const calculateScrollProgress = (): number => {
      const section = sectionRef.current;
      if (!section) return 0;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollableDistance = Math.max(1, rect.height - viewportHeight);

      // Maps 0% at top of hero section to 100% when bottom of hero meets viewport bottom
      const rawProgress = -rect.top / totalScrollableDistance;
      return Math.min(1, Math.max(0, rawProgress));
    };

    const applyVisualTransforms = (progress: number) => {
      // Update bottom hairline scrub indicator via compositor transform
      if (progressBarFillRef.current) {
        progressBarFillRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      }

      // Subtle editorial text motion: fully crisp at start (0..0.08),
      // gently glides upward and softens as camera moves deep into the 3D scene,
      // and reverses smoothly when scrolling back up.
      if (textContainerRef.current) {
        const fadeProgress = Math.min(1, Math.max(0, (progress - 0.06) / 0.42));
        const translateY = fadeProgress * -28;
        const opacity = 1 - fadeProgress * 0.72;
        textContainerRef.current.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
        textContainerRef.current.style.opacity = opacity.toFixed(3);
      }

      // Fade out the "Scroll to Explore" indicator once user begins scrubbing
      if (scrollHintRef.current) {
        const hintOpacity = Math.max(0, 1 - progress * 8);
        scrollHintRef.current.style.opacity = hintOpacity.toFixed(3);
      }
    };

    const commitVideoFrame = (progress: number) => {
      const video = videoRef.current;
      if (!video || video.readyState < 1) return;

      // Ensure video NEVER plays autonomously
      if (!video.paused) {
        video.pause();
      }

      const duration =
        Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : videoDurationRef.current;

      if (!duration || duration <= 0) return;

      // Clamp slightly inside duration to prevent browsers from resetting or blanking at exact EOF
      const safeMaxTime = Math.max(0, duration - 0.015);
      const targetTime = Math.min(safeMaxTime, Math.max(0, progress * duration));

      // Minimum delta threshold (~0.01s, finer than 24fps = 0.0416s) to prevent seek floods
      const timeDelta = Math.abs(targetTime - lastCommittedTimeRef.current);
      const isBoundaryFrame = progress <= 0.0005 || progress >= 0.9995;

      if (!video.seeking && (timeDelta >= 0.01 || (isBoundaryFrame && timeDelta > 0.001))) {
        lastCommittedTimeRef.current = targetTime;
        try {
          video.currentTime = targetTime;
        } catch {
          // Ignore transient DOMException if media buffer is still initializing
        }
      }
    };

    const tick = () => {
      const target = targetProgressRef.current;
      const current = smoothedProgressRef.current;
      const diff = target - current;

      // High-responsiveness smoothing factor (0.28) keeps the video tightly locked
      // to the user's finger/wheel while eliminating raw wheel-step jitter.
      const SMOOTHING_FACTOR = 0.28;

      if (Math.abs(diff) > 0.0004) {
        smoothedProgressRef.current = current + diff * SMOOTHING_FACTOR;
      } else {
        smoothedProgressRef.current = target;
      }

      const activeProgress = smoothedProgressRef.current;
      applyVisualTransforms(activeProgress);
      commitVideoFrame(activeProgress);

      const video = videoRef.current;
      const stillInterpolating = Math.abs(target - smoothedProgressRef.current) > 0.0004;
      const stillSeeking = Boolean(video && video.seeking);

      if (stillInterpolating || stillSeeking) {
        rafIdRef.current = window.requestAnimationFrame(tick);
      } else {
        // Final exact frame lock when user stops scrolling
        commitVideoFrame(target);
        isLoopActiveRef.current = false;
        rafIdRef.current = null;
      }
    };

    const startAnimationLoop = () => {
      if (!isLoopActiveRef.current) {
        isLoopActiveRef.current = true;
        rafIdRef.current = window.requestAnimationFrame(tick);
      }
    };

    const handleScrollOrResize = () => {
      targetProgressRef.current = calculateScrollProgress();
      startAnimationLoop();
    };

    // Initialize position on mount / refresh
    const initialProgress = calculateScrollProgress();
    targetProgressRef.current = initialProgress;
    smoothedProgressRef.current = initialProgress;
    applyVisualTransforms(initialProgress);
    commitVideoFrame(initialProgress);

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      isLoopActiveRef.current = false;
    };
  }, [prefersReducedMotion, hasVideoError]);

  const handleVideoLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    if (Number.isFinite(video.duration) && video.duration > 0) {
      videoDurationRef.current = video.duration;
    }

    // Synchronize initial frame with current scroll position immediately
    const initialTime = Math.min(
      Math.max(0, videoDurationRef.current - 0.02),
      targetProgressRef.current * videoDurationRef.current
    );
    try {
      video.currentTime = initialTime;
      lastCommittedTimeRef.current = initialTime;
    } catch {
      // Ignore
    }
    setIsVideoReady(true);
  };

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      aria-label="فیکس لایف | تجربه سه‌بعدی مراقبت از پوست"
      className={`relative w-full bg-[#EFEBE5] border-b border-[#E8E4DC] ${
        prefersReducedMotion || hasVideoError
          ? 'h-[88dvh] lg:h-screen'
          : 'h-[230vh] sm:h-[260vh] lg:h-[300vh]'
      }`}
    >
      {/* Sticky Full-Viewport 3D Stage */}
      <div className="sticky top-0 right-0 h-[100dvh] w-full overflow-hidden bg-[#EFEBE5]">
        {/* Poster / Fallback Image Layer */}
        <img
          src={
            hasVideoError
              ? '/assets/lumiere/hero-full.jpg'
              : '/assets/lumiere/hero-video-poster.jpg'
          }
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.endsWith('/assets/lumiere/hero-full.jpg')) {
              target.src = '/assets/lumiere/hero-full.jpg';
            }
          }}
          alt="فیکس لایف (FixLife) — محصولات تخصصی مراقبت از پوست و زیبایی در ایران"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
        />

        {/* Scroll-Scrubbed 3D Video Layer */}
        {!prefersReducedMotion && !hasVideoError && (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            poster="/assets/lumiere/hero-video-poster.jpg"
            onLoadedMetadata={handleVideoLoadedMetadata}
            onLoadedData={handleVideoLoadedMetadata}
            onCanPlay={() => setIsVideoReady(true)}
            onPlay={(e) => {
              e.currentTarget.pause();
            }}
            onError={() => setHasVideoError(true)}
            className={`absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none transition-opacity duration-500 ${
              isVideoReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {isMobileViewport ? (
              <>
                <source
                  src="/assets/lumiere/hero-scroll-mobile.mp4"
                  type="video/mp4"
                />
                <source
                  src="/assets/lumiere/hero-scroll-desktop.webm"
                  type="video/webm"
                />
                <source src={EXTERNAL_HERO_VIDEO_URL} type="video/mp4" />
              </>
            ) : (
              <>
                <source
                  src="/assets/lumiere/hero-scroll-desktop.mp4"
                  type="video/mp4"
                />
                <source
                  src="/assets/lumiere/hero-scroll-desktop.webm"
                  type="video/webm"
                />
                <source src={EXTERNAL_HERO_VIDEO_URL} type="video/mp4" />
              </>
            )}
          </video>
        )}

        {/* Responsive Readability Scrim: Bottom gradient on mobile/tablet, Right-to-Left gradient on desktop/monitor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#FDFBF7]/95 via-[#FDFBF7]/50 to-transparent lg:bg-gradient-to-l lg:from-[#FDFBF7]/88 lg:via-[#FDFBF7]/45 lg:via-45% lg:to-transparent"
        />

        {/* Minimal Loading Treatment while video buffers */}
        {!isVideoReady && !prefersReducedMotion && !hasVideoError && (
          <div
            aria-live="polite"
            className="pointer-events-none absolute top-4 left-4 sm:top-5 sm:left-6 z-20 flex items-center gap-2 bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#E8E4DC] rounded-full lg:rounded-none px-3.5 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]" />
            <span className="text-[10.5px] sm:text-[11px] font-medium text-[#4A4640]">
              در حال آماده‌سازی صحنه سه‌بعدی...
            </span>
          </div>
        )}

        {/* Hero Typography & CTA Content Block (App Card on Mobile/Tablet, Editorial Stage on Laptop/All-in-One/Monitor) */}
        <div className="fixlife-container relative z-10 flex h-full items-end pb-24 sm:pb-28 lg:items-center lg:pb-0">
          <div
            ref={textContainerRef}
            className="w-full max-w-xl 2xl:max-w-2xl rounded-2xl border border-[#E8E4DC]/80 bg-[#FDFBF7]/85 p-5 shadow-lg backdrop-blur-md sm:p-7 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none text-right will-change-transform"
          >
            <p className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-[#8C7048] mb-2 sm:mb-3">
              ترکیبات گیاهی خالص · نتایج بالینی اثبات‌شده · ارسال ویژه در سراسر ایران
            </p>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[48px] 2xl:text-[56px] font-bold leading-[1.3] text-[#1A1A1A]">
              مراقبت اصیل پوستی
              <br className="hidden sm:inline" /> برای درخشش طبیعی
              <br />و ماندگار چهره شما
            </h1>

            <p className="mt-3 sm:mt-5 max-w-md 2xl:max-w-xl text-xs sm:text-[14.5px] 2xl:text-base leading-[1.85] text-[#2C2926] text-justify">
              محصولات تخصصی فیکس لایف (FixLife) با فرمولاسیون درماتولوژیک جیورا و نوبل، عصاره‌های گیاهی ارگانیک و تاییدیه بالینی، برای شادابی، بازسازی سد دفاعی و درخشش طبیعی پوست شما طراحی شده‌اند.
            </p>

            <div className="mt-5 sm:mt-7 flex flex-row items-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={onShopNow}
                className="flex-1 sm:flex-initial rounded-xl lg:rounded-none bg-[#1E1C1A] text-white px-5 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold hover:bg-[#36332F] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap text-center"
              >
                خرید آنلاین محصولات
              </button>

              <button
                type="button"
                onClick={onExploreCollection}
                className="flex-1 sm:flex-initial rounded-xl border border-[#1A1A1A]/30 bg-white/70 px-4 py-3 text-xs sm:text-sm font-semibold text-[#1A1A1A] hover:text-[#8C7048] lg:rounded-none lg:border-0 lg:border-b lg:border-[#1A1A1A] lg:bg-transparent lg:px-0 lg:py-0 lg:pb-1.5 transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                نیازهای پوستی شما
              </button>
            </div>
          </div>
        </div>

        {/* Subtle Bottom Scroll Hint & Timeline Scrub Progress Hairline */}
        {!prefersReducedMotion && !hasVideoError && (
          <>
            <div
              ref={scrollHintRef}
              className="pointer-events-none absolute top-4 right-4 lg:top-auto lg:right-auto lg:bottom-7 lg:left-1/2 lg:-translate-x-1/2 z-10 flex items-center gap-2 rounded-full lg:rounded-none bg-[#FDFBF7]/90 backdrop-blur-[2px] border border-[#E8E4DC] px-3.5 py-1.5 text-[10.5px] sm:text-[11px] font-medium text-[#33302C] transition-opacity duration-200"
            >
              <span>برای حرکت در صحنه سه‌بعدی اسکرول کنید</span>
              <ArrowDown className="h-3.5 w-3.5 text-[#8C7048]" strokeWidth={1.5} />
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[3px] lg:h-[2px] w-full bg-[#E8E4DC]/50 overflow-hidden"
            >
              <div
                ref={progressBarFillRef}
                className="h-full w-full origin-right bg-[#C5A880] will-change-transform"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};
