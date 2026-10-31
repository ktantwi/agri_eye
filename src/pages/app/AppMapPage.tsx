import React, { useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import { MapContainer } from '../../components/map/MapContainer';
import { FloatingTopBar } from '../../components/map/FloatingTopBar';
import { LeftFieldsPanel } from '../../components/map/LeftFieldsPanel';
import { DrawToolbar } from '../../components/map/DrawToolbar';
import { RightAnalysisPanel } from '../../components/map/RightAnalysisPanel';
import { TimelineSlider } from '../../components/map/TimelineSlider';
import { CompareCurtain } from '../../components/map/CompareCurtain';
import { Legend } from '../../components/map/Legend';
import { PixelInspectionPopup } from '../../components/map/PixelInspectionPopup';
import { UploadModal } from '../../components/map/UploadModal';
import { OnboardingTour } from '../../components/map/OnboardingTour';
import { useMapStore } from '../../store/mapStore';
import { DrawTool, Field } from '../../types/field';

export const AppMapPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);

  const {
    fields,
    selectedField,
    setSelectedField,
    deleteField,
    setDrawTool,
    setIsDrawing,
    rightPanelOpen,
  } = useMapStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // If URL has /app/fields/:id, select that field
  React.useEffect(() => {
    if (id && fields.length > 0) {
      const match = fields.find((f) => f.id === id);
      if (match) setSelectedField(match);
    }
  }, [id, fields, setSelectedField]);

  const handleMapReady = (map: maplibregl.Map) => {
    mapInstanceRef.current = map;
  };

  const handleFlyToCoords = (lng: number, lat: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        speed: 1.4,
        curve: 1.2,
      });
    }
  };

  const handleStartDraw = (tool: DrawTool) => {
    setDrawTool(tool);
    setIsDrawing(true);
  };

  const handleCancelDraw = () => {
    setDrawTool('select');
    setIsDrawing(false);
  };

  const handleFinishDraw = () => {
    // Handled automatically via MapboxDraw 'draw.create'
  };

  const handleDeleteSelected = () => {
    if (selectedField) {
      if (confirm(`Are you sure you want to delete "${selectedField.name}"?`)) {
        deleteField(selectedField.id);
      }
    }
  };

  const handleDeleteFieldFromList = (fieldId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const f = fields.find((item) => item.id === fieldId);
    if (confirm(`Delete field "${f?.name || 'field'}"?`)) {
      deleteField(fieldId);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-sand-50">
      {/* 1. Full-Viewport Map Under Everything */}
      <MapContainer onMapReady={handleMapReady} />

      {/* 2. Floating Top Bar */}
      <FloatingTopBar onFlyToCoordinates={handleFlyToCoords} />

      {/* 3. Floating Draw Toolbar (Left/Top) */}
      <DrawToolbar
        onStartDraw={handleStartDraw}
        onCancelDraw={handleCancelDraw}
        onFinishDraw={handleFinishDraw}
        onDeleteSelected={handleDeleteSelected}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* 4. Collapsible Left Panel "My Fields" */}
      <LeftFieldsPanel
        onStartNewField={() => handleStartDraw('polygon')}
        onSelectField={(field) => setSelectedField(field)}
        onDeleteField={handleDeleteFieldFromList}
      />

      {/* 5. Right Analysis Panel (Opens when field is selected) */}
      <RightAnalysisPanel />

      {/* 6. Compare Mode Swipe Curtain */}
      <CompareCurtain />

      {/* 7. Bottom Timeline Slider */}
      <TimelineSlider />

      {/* 8. Floating Legend (Bottom Left) */}
      <div className="fixed bottom-3 left-3 z-20 pointer-events-none">
        <Legend />
      </div>

      {/* 9. Pixel Inspection Card */}
      <PixelInspectionPopup />

      {/* 10. GeoJSON/KML/Shapefile Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* 11. Onboarding Tour */}
      <OnboardingTour />
    </main>
  );
};
