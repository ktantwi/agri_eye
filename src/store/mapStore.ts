import { create } from 'zustand';
import { Field, IndexType, BasemapType, PaletteType, DrawTool, PixelInspection } from '../types/field';
import { getLocalStoredFields, saveLocalStoredFields } from '../lib/supabase';

interface MapState {
  fields: Field[];
  selectedField: Field | null;
  activeBasemap: BasemapType;
  activeIndex: IndexType;
  paletteType: PaletteType;
  layerOpacity: number;
  dateRange: { start: string; end: string };
  maxCloudCover: number;
  
  // Drawing states
  drawTool: DrawTool;
  isDrawing: boolean;
  currentDrawAreaHa: number;
  snapToBoundaries: boolean;
  
  // Compare swipe mode
  compareMode: boolean;
  compareDateA: string;
  compareDateB: string;
  swipePosition: number; // percentage 0 - 100
  
  // Timeline slider
  timelineDate: string | null;
  isPlayingTimeline: boolean;
  
  // Panels
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  
  // Pixel inspection
  pixelInspection: PixelInspection | null;
  
  // Filter & search
  searchQuery: string;
  cropFilter: string | null;

  // Actions
  setFields: (fields: Field[]) => void;
  addField: (field: Field) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  deleteField: (id: string) => void;
  setSelectedField: (field: Field | null) => void;
  setActiveBasemap: (basemap: BasemapType) => void;
  setActiveIndex: (index: IndexType) => void;
  setPaletteType: (palette: PaletteType) => void;
  setLayerOpacity: (opacity: number) => void;
  setDateRange: (range: { start: string; end: string }) => void;
  setMaxCloudCover: (max: number) => void;
  setDrawTool: (tool: DrawTool) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setCurrentDrawAreaHa: (ha: number) => void;
  setSnapToBoundaries: (snap: boolean) => void;
  setCompareMode: (enabled: boolean) => void;
  setCompareDates: (dateA: string, dateB: string) => void;
  setSwipePosition: (pos: number) => void;
  setTimelineDate: (date: string | null) => void;
  setIsPlayingTimeline: (playing: boolean) => void;
  setLeftPanelOpen: (open: boolean) => void;
  toggleLeftPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
  setPixelInspection: (info: PixelInspection | null) => void;
  setSearchQuery: (query: string) => void;
  setCropFilter: (crop: string | null) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  fields: getLocalStoredFields(),
  selectedField: getLocalStoredFields()[0] || null,
  activeBasemap: 'satellite',
  activeIndex: 'NDVI',
  paletteType: 'standard',
  layerOpacity: 0.85,
  dateRange: { start: '2026-06-01', end: '2026-08-31' },
  maxCloudCover: 20,

  drawTool: 'select',
  isDrawing: false,
  currentDrawAreaHa: 0,
  snapToBoundaries: true,

  compareMode: false,
  compareDateA: '2026-06-10',
  compareDateB: '2026-07-28',
  swipePosition: 50,

  timelineDate: '2026-07-28',
  isPlayingTimeline: false,

  leftPanelOpen: true,
  rightPanelOpen: true,

  pixelInspection: null,
  searchQuery: '',
  cropFilter: null,

  setFields: (fields) => {
    saveLocalStoredFields(fields);
    set({ fields });
  },

  addField: (field) => {
    const updated = [field, ...get().fields];
    saveLocalStoredFields(updated);
    set({ fields: updated, selectedField: field, rightPanelOpen: true });
  },

  updateField: (id, updates) => {
    const updated = get().fields.map((f) => (f.id === id ? { ...f, ...updates } : f));
    saveLocalStoredFields(updated);
    const selected = get().selectedField?.id === id ? { ...get().selectedField!, ...updates } : get().selectedField;
    set({ fields: updated, selectedField: selected });
  },

  deleteField: (id) => {
    const updated = get().fields.filter((f) => f.id !== id);
    saveLocalStoredFields(updated);
    set({
      fields: updated,
      selectedField: get().selectedField?.id === id ? null : get().selectedField,
      rightPanelOpen: get().selectedField?.id === id ? false : get().rightPanelOpen,
    });
  },

  setSelectedField: (field) => {
    set({ selectedField: field, rightPanelOpen: Boolean(field) });
  },

  setActiveBasemap: (basemap) => set({ activeBasemap: basemap }),
  setActiveIndex: (index) => set({ activeIndex: index }),
  setPaletteType: (palette) => set({ paletteType: palette }),
  setLayerOpacity: (opacity) => set({ layerOpacity: opacity }),
  setDateRange: (range) => set({ dateRange: range }),
  setMaxCloudCover: (max) => set({ maxCloudCover: max }),
  setDrawTool: (tool) => set({ drawTool: tool }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setCurrentDrawAreaHa: (ha) => set({ currentDrawAreaHa: ha }),
  setSnapToBoundaries: (snap) => set({ snapToBoundaries: snap }),
  setCompareMode: (enabled) => set({ compareMode: enabled }),
  setCompareDates: (dateA, dateB) => set({ compareDateA: dateA, compareDateB: dateB }),
  setSwipePosition: (pos) => set({ swipePosition: pos }),
  setTimelineDate: (date) => set({ timelineDate: date }),
  setIsPlayingTimeline: (playing) => set({ isPlayingTimeline: playing }),
  setLeftPanelOpen: (open) => set({ leftPanelOpen: open }),
  toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
  setPixelInspection: (info) => set({ pixelInspection: info }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCropFilter: (crop) => set({ cropFilter: crop }),
}));
