import { saveAs } from 'file-saver';
import { Field, AnalysisStats, TimeseriesPoint } from '../types/field';

export function exportFieldDataToCsv(
  field: Field,
  stats: AnalysisStats,
  timeseries: TimeseriesPoint[]
) {
  let csv = 'AgriEye Satellite Field Monitoring Export\n';
  csv += `Field Name,${field.name}\n`;
  csv += `Crop Type,${field.crop_type}\n`;
  csv += `Area (ha),${field.area_ha}\n`;
  csv += `Export Timestamp,${new Date().toISOString()}\n\n`;

  csv += '--- Zonal Summary Statistics ---\n';
  csv += `Index,${stats.index}\n`;
  csv += `Mean,${stats.mean}\n`;
  csv += `Min,${stats.min}\n`;
  csv += `Max,${stats.max}\n`;
  csv += `Std Dev,${stats.std_dev}\n`;
  csv += `Cloud Cover (%),${stats.cloud_pct}\n\n`;

  csv += '--- Seasonal Time-Series ---\n';
  csv += `Date,Mean_${stats.index},Cloud_Pct,Phenology_Status\n`;

  timeseries.forEach((pt) => {
    csv += `${pt.date},${pt.mean_ndvi},${pt.cloud_pct},"${pt.status || ''}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const safeName = field.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  saveAs(blob, `AgriEye_${safeName}_timeseries.csv`);
}
