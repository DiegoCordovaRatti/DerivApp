import motivosDerivacion from './motivos_derivacion.json';

// Función para obtener todos los tipos de caso disponibles
export const obtenerTiposCaso = () => {
  return motivosDerivacion.map(tipo => ({
    value: tipo.value,
    label: tipo.label
  }));
};

// Función para obtener motivos de derivación por tipo de caso
export const obtenerMotivosPorTipoCaso = (tipoCaso) => {
  const tipoEncontrado = motivosDerivacion.find(
    tipo => tipo.value === tipoCaso
  );
  
  if (!tipoEncontrado) return [];
  
  return tipoEncontrado.motivos.map(motivo => ({
    value: motivo.nombre,
    label: motivo.nombre
  }));
};

// Función para obtener descripciones por motivo
export const obtenerDescripcionesPorMotivo = (tipoCaso, motivo) => {
  const tipoEncontrado = motivosDerivacion.find(
    tipo => tipo.value === tipoCaso
  );
  
  if (!tipoEncontrado) return [];
  
  const motivoEncontrado = tipoEncontrado.motivos.find(
    m => m.nombre === motivo
  );
  
  if (!motivoEncontrado) return [];
  
  return motivoEncontrado.descripciones.map((descripcion, index) => ({
    value: descripcion,
    label: `Plantilla recomendada ${index + 1}`,
    descripcion: descripcion
  }));
};

// Función para filtrar tipos de caso por texto de búsqueda
export const filtrarTiposCaso = (searchText) => {
  if (!searchText) return obtenerTiposCaso();
  
  return obtenerTiposCaso().filter(tipo =>
    tipo.label.toLowerCase().includes(searchText.toLowerCase())
  );
};

// Función para filtrar motivos por texto de búsqueda
export const filtrarMotivos = (tipoCaso, searchText) => {
  if (!searchText) return obtenerMotivosPorTipoCaso(tipoCaso);
  
  return obtenerMotivosPorTipoCaso(tipoCaso).filter(motivo =>
    motivo.label.toLowerCase().includes(searchText.toLowerCase())
  );
};

// Función para filtrar descripciones por texto de búsqueda
export const filtrarDescripciones = (tipoCaso, motivo, searchText) => {
  if (!searchText) return obtenerDescripcionesPorMotivo(tipoCaso, motivo);
  
  return obtenerDescripcionesPorMotivo(tipoCaso, motivo).filter(descripcion =>
    descripcion.descripcion.toLowerCase().includes(searchText.toLowerCase())
  );
}; 