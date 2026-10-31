import React, { useRef, useEffect } from 'react';
import { useMapStore } from '../../store/mapStore';
import { ChevronLeft, ChevronRight, X, Calendar, SplitSquareVertical } from 'lucide-react';

export const CompareCurtain: React.FC = () => {
  const {
    compareMode,
    setCompareMode,
    compareDateA,
    compareDateB,
    setCompareDates,
    swipePosition,
    setSwipePosition,
    activeIndex,
  } = useMapStore();

  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const pct = Math.max(5, Math.min(95, (e.clientX / window.innerWidth) * 100));
      setSwipePosition(pct);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setSwipePosition]);

  if (!compareMode) return null;

  return (
    <>
      {/* Top Banner indicating compare dates */}
      <div className="fixed top-18 left-1/2 -translate-x-1/2 z-20 glass-panel rounded-2xl px-4 py-2 border border-lime-500/80 shadow-lg flex items-center gap-4 pointer-events-auto text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-forest-900 bg-lime-400/30 px-2 py-0.5 rounded-md">
            Date A (Left): {compareDateA}
          </span>
          <span className="text-gray-400 font-bold">vs</span>
          <span className="font-bold text-forest-900 bg-forest-900/10 px-2 py-0.5 rounded-md">
            Date B (Right): {compareDateB}
          </span>
        </div>

        <button
          onClick={() => setCompareMode(false)}
          className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/5"
          title="Exit Compare Mode"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Swipe Line Divider with handle */}
      <div
        className="compare-swipe-line pointer-events-none"
        style={{ left: `${swipePosition}%` }}
      >
        <div
          onMouseDown={() => (isDragging.current = true)}
          className="compare-handle pointer-events-auto"
          title="Drag to compare before & after"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-lime-400 -mr-1" />
          <ChevronRight className="w-3.5 h-3.5 text-lime-400" />
        </div>
      </div>
    </>
  );
};
