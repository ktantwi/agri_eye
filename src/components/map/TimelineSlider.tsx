import React, { useState, useEffect, useRef } from 'react';
import { useMapStore } from '../../store/mapStore';
import { fetchTimelineDates, TimelineDateItem } from '../../lib/geeApi';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Calendar,
  Cloud,
  Clock,
  Sparkles
} from 'lucide-react';

export const TimelineSlider: React.FC = () => {
  const {
    selectedField,
    dateRange,
    maxCloudCover,
    timelineDate,
    setTimelineDate,
    isPlayingTimeline,
    setIsPlayingTimeline,
  } = useMapStore();

  const [availableDates, setAvailableDates] = useState<TimelineDateItem[]>([]);
  const intervalRef = useRef<any>(null);

  // Load timeline dates
  useEffect(() => {
    let isMounted = true;
    async function loadDates() {
      if (!selectedField) return;
      const dates = await fetchTimelineDates({
        geometry: selectedField.geometry,
        date_start: dateRange.start,
        date_end: dateRange.end,
        max_cloud_pct: maxCloudCover,
      });
      if (isMounted && dates.length > 0) {
        setAvailableDates(dates);
        if (!timelineDate) {
          setTimelineDate(dates[dates.length - 1].date);
        }
      }
    }
    loadDates();
    return () => {
      isMounted = false;
    };
  }, [selectedField, dateRange, maxCloudCover]);

  // Handle auto-play timelapse
  useEffect(() => {
    if (isPlayingTimeline && availableDates.length > 1) {
      intervalRef.current = setInterval(() => {
        const currentStoreDate = useMapStore.getState().timelineDate;
        const idx = availableDates.findIndex((d) => d.date === currentStoreDate);
        const nextIdx = (idx + 1) % availableDates.length;
        setTimelineDate(availableDates[nextIdx].date);
      }, 1600);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlayingTimeline, availableDates, setTimelineDate]);

  if (!selectedField || availableDates.length === 0) return null;

  const currentIndex = Math.max(
    0,
    availableDates.findIndex((d) => d.date === timelineDate)
  );
  const currentDateObj = availableDates[currentIndex] || availableDates[availableDates.length - 1];

  const handlePrev = () => {
    const prev = Math.max(0, currentIndex - 1);
    setTimelineDate(availableDates[prev].date);
  };

  const handleNext = () => {
    const next = Math.min(availableDates.length - 1, currentIndex + 1);
    setTimelineDate(availableDates[next].date);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-2xl glass-panel rounded-2xl px-4 py-2.5 shadow-float border border-white/70 pointer-events-auto flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
            className="w-8 h-8 rounded-xl bg-forest-900 text-white flex items-center justify-center hover:bg-forest-800 transition-colors shadow-sm"
            title={isPlayingTimeline ? 'Pause Timeline' : 'Play Phenology Timelapse'}
          >
            {isPlayingTimeline ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-lg text-gray-500 hover:text-forest-900 hover:bg-forest-900/5 disabled:opacity-30"
            title="Previous Acquisition"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === availableDates.length - 1}
            className="p-1.5 rounded-lg text-gray-500 hover:text-forest-900 hover:bg-forest-900/5 disabled:opacity-30"
            title="Next Acquisition"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="ml-2 flex items-center gap-1.5 border-l border-forest-900/10 pl-3">
            <span className="text-xs font-bold text-forest-950 font-mono">
              {currentDateObj?.date}
            </span>
            <span className="text-[10px] bg-lime-500/20 text-forest-900 border border-lime-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Cloud className="w-2.5 h-2.5 text-forest-700" />
              {currentDateObj?.cloud_pct}% cloud
            </span>
          </div>
        </div>

        {/* Satellite info badge */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-500 font-mono">
          <span>{currentDateObj?.satellite || 'Sentinel-2'}</span>
          <span>•</span>
          <span>{currentIndex + 1} of {availableDates.length} passes</span>
        </div>
      </div>

      {/* Scrub Slider */}
      <div className="relative flex items-center">
        <input
          type="range"
          min="0"
          max={availableDates.length - 1}
          value={currentIndex}
          onChange={(e) => {
            const idx = Number(e.target.value);
            setTimelineDate(availableDates[idx].date);
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Ticks */}
      <div className="flex justify-between text-[9px] text-gray-400 font-mono px-1">
        <span>{availableDates[0]?.date}</span>
        <span className="hidden sm:inline">Mid-Season</span>
        <span>{availableDates[availableDates.length - 1]?.date}</span>
      </div>
    </div>
  );
};
