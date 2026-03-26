/**
 * Convertit un tableau d'objets en chaîne CSV.
 * @param {Array} data - Les données à exporter.
 * @param {Array} headers - Les en-têtes (facultatif).
 * @returns {string} - La chaîne CSV.
 */
export const convertToCSV = (data, headers) => {
  if (!data || !data.length) return '';
  
  const columnHeaders = headers || Object.keys(data[0]);
  const csvRows = [];
  
  // Ajouter les en-têtes
  csvRows.push(columnHeaders.join(','));
  
  // Ajouter les données
  for (const row of data) {
    const values = columnHeaders.map(header => {
      const val = row[header];
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

/**
 * Déclenche le téléchargement d'un fichier CSV.
 * @param {Array} data - Les données à exporter.
 * @param {string} filename - Le nom du fichier.
 */
export const downloadCSV = (data, filename = 'export.csv') => {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Déclenche l'impression de la page pour sauvegarde PDF.
 * @param {string} title - Titre du rapport.
 */
export const printReport = (title = 'Rapport') => {
  const originalTitle = document.title;
  document.title = title;
  window.print();
  document.title = originalTitle;
};
