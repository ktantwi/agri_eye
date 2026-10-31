import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Field, AnalysisStats, TimeseriesPoint } from '../types/field';

export function generateFieldPdfReport(params: {
  field: Field;
  stats: AnalysisStats;
  timeseries: TimeseriesPoint[];
  dateStart: string;
  dateEnd: string;
}) {
  const { field, stats, timeseries, dateStart, dateEnd } = params;
  const doc = new jsPDF();

  // Header Bar (AgriEye Forest Green)
  doc.setFillColor(20, 83, 45); // #14532d
  doc.rect(0, 0, 210, 36, 'F');

  // Title & Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('AgriEye', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Satellite Crop & Vegetation Monitoring Report', 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 28);

  // Field Details Section
  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Field Overview', 14, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const overviewRows = [
    ['Field Name:', field.name, 'Crop Type:', field.crop_type || 'Unspecified'],
    ['Total Area:', `${field.area_ha} hectares`, 'Analysis Index:', stats.index],
    ['Observation Window:', `${dateStart} to ${dateEnd}`, 'Satellite Sensor:', 'Sentinel-2 MSI (10m L2A)'],
    ['Cloud Coverage:', `${stats.cloud_pct}%`, 'Agronomic Health Status:', stats.mean > 0.6 ? 'Vigorous / Healthy' : 'Moderate / Monitored']
  ];

  autoTable(doc, {
    startY: 52,
    body: overviewRows,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [20, 83, 45], cellWidth: 42 },
      1: { cellWidth: 55 },
      2: { fontStyle: 'bold', textColor: [20, 83, 45], cellWidth: 45 },
      3: { cellWidth: 50 },
    },
  });

  // Zonal Statistics Table
  const finalY1 = (doc as any).lastAutoTable?.finalY || 80;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${stats.index} Zonal Health Statistics`, 14, finalY1 + 14);

  const statsTableData = [
    ['Mean Index Value', stats.mean.toFixed(4), 'Average vegetative density across all pixels in boundary.'],
    ['Maximum Value', stats.max.toFixed(4), 'Peak vigor zone within the field.'],
    ['Minimum Value', stats.min.toFixed(4), 'Lowest vegetation zone (inspect for compaction/stress).'],
    ['Standard Deviation', stats.std_dev.toFixed(4), 'Spatial heterogeneity indicator across the field plot.'],
  ];

  autoTable(doc, {
    startY: finalY1 + 18,
    head: [['Metric', 'Value', 'Agronomic Interpretation']],
    body: statsTableData,
    headStyles: { fillColor: [20, 83, 45], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9.5, cellPadding: 4 },
    alternateRowStyles: { fillColor: [248, 250, 248] },
  });

  // Multi-temporal Timeseries Table
  const finalY2 = (doc as any).lastAutoTable?.finalY || 140;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Seasonal Time-Series Progression', 14, finalY2 + 14);

  const timeseriesRows = timeseries.slice(-8).map(pt => [
    pt.date,
    pt.mean_ndvi.toFixed(3),
    `${pt.cloud_pct}%`,
    pt.status || (pt.mean_ndvi > 0.7 ? 'High Biomass' : pt.mean_ndvi > 0.4 ? 'Vegetative' : 'Low Cover')
  ]);

  autoTable(doc, {
    startY: finalY2 + 18,
    head: [['Acquisition Date', `Mean ${stats.index}`, 'Cloud %', 'Phenology Stage']],
    body: timeseriesRows,
    headStyles: { fillColor: [132, 204, 22], textColor: [20, 83, 45], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3.5 },
  });

  // Footer Disclaimer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    'AgriEye Platform — Imagery courtesy of European Space Agency (ESA) Copernicus Sentinel-2. For precision agronomic verification, ground truthing is recommended.',
    14,
    pageHeight - 10
  );

  // Save the PDF
  const safeName = field.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`AgriEye_Report_${safeName}_${dateEnd}.pdf`);
}
