/**
 * Calcula el nivel de alerta para un caso de derivación escolar
 * @param {Array} seguimientos - Array de strings con valores: "Positivo", "Neutro", "Pendiente", "Negativo"
 * @param {string} prioridad - "baja", "media", "alta"
 * @param {string} estado - "abierta", "cerrada"
 * @returns {Object} Objeto con scoreReal, scoreNormalizado y nivelAlerta
 */
export const calcularNivelAlerta = (seguimientos, prioridad, estado) => {
  // Validaciones básicas
  if (!Array.isArray(seguimientos)) {
    throw new Error('seguimientos debe ser un array');
  }

  if (!seguimientos || seguimientos.length === 0) {
    return {
      scoreReal: 0,
      scoreNormalizado: 0,
      nivelAlerta: 'Sin riesgo / Bajo'
    };
  }

  // Mapeo de valores de resultado
  const valoresResultado = {
    'positivo': -2,
    'neutro': 0,
    'pendiente': 1,
    'negativo': 2
  };

  // Mapeo de factores de prioridad
  const factoresPrioridad = {
    'baja': 1,
    'media': 2,
    'alta': 3
  };

  // Mapeo de factores de estado
  const factoresEstado = {
    'abierta': 1,
    'cerrada': 0
  };

  // Validar prioridad y estado
  if (!factoresPrioridad.hasOwnProperty(prioridad)) {
    throw new Error('prioridad debe ser "baja", "media" o "alta"');
  }

  if (!factoresEstado.hasOwnProperty(estado)) {
    throw new Error('estado debe ser "abierta" o "cerrada"');
  }

  // Obtener factores
  const factorPrioridad = factoresPrioridad[prioridad];
  const factorEstado = factoresEstado[estado];

  // Calcular suma de valores de seguimientos
  let sumaResultados = 0;
  let seguimientosValidos = 0;

  seguimientos.forEach(seguimiento => {
    if (valoresResultado.hasOwnProperty(seguimiento)) {
      sumaResultados += valoresResultado[seguimiento];
      seguimientosValidos++;
    }
  });

  // Si no hay seguimientos válidos, retornar valores por defecto
  if (seguimientosValidos === 0) {
    return {
      scoreReal: 0,
      scoreNormalizado: 0,
      nivelAlerta: 'Sin riesgo / Bajo'
    };
  }

  // Calcular score real
  const scoreReal = sumaResultados * factorPrioridad * factorEstado;

  // Calcular score máximo y mínimo
  const N = seguimientosValidos;
  const valorMaximo = 2; // "Negativo" es el valor más alto
  const valorMinimo = -2; // "Positivo" es el valor más bajo

  const scoreMaximo = N * valorMaximo * factorPrioridad * factorEstado;
  const scoreMinimo = N * valorMinimo * factorPrioridad * factorEstado;

  // Calcular score normalizado
  let scoreNormalizado = 0;
  
  if (scoreMaximo !== scoreMinimo) {
    scoreNormalizado = ((scoreReal - scoreMinimo) / (scoreMaximo - scoreMinimo)) * 100;
    // Asegurar que esté en el rango [0, 100]
    scoreNormalizado = Math.max(0, Math.min(100, scoreNormalizado));
  }

  // Determinar nivel de alerta
  let nivelAlerta;
  if (scoreNormalizado >= 0 && scoreNormalizado <= 29) {
    nivelAlerta = 'Sin riesgo / Bajo';
  } else if (scoreNormalizado >= 30 && scoreNormalizado <= 59) {
    nivelAlerta = 'Alerta moderada';
  } else if (scoreNormalizado >= 60 && scoreNormalizado <= 79) {
    nivelAlerta = 'Alerta alta';
  } else if (scoreNormalizado >= 80 && scoreNormalizado <= 100) {
    nivelAlerta = 'Alerta crítica';
  } else {
    nivelAlerta = 'Sin riesgo / Bajo'; // Fallback
  }

  return {
    scoreReal,
    scoreNormalizado: Math.round(scoreNormalizado * 100) / 100, // Redondear a 2 decimales
    nivelAlerta
  };
};

/**
 * Obtiene el color correspondiente al nivel de alerta
 * @param {string} nivelAlerta - Nivel de alerta
 * @returns {string} Color en formato hexadecimal
 */
export const getColorNivelAlerta = (nivelAlerta) => {
  switch (nivelAlerta) {
    case 'Sin riesgo / Bajo':
      return '#52c41a'; // Verde
    case 'Alerta moderada':
      return '#faad14'; // Amarillo
    case 'Alerta alta':
      return '#ff4d4f'; // Rojo
    case 'Alerta crítica':
      return '#cf1322'; // Rojo oscuro
    default:
      return '#d9d9d9'; // Gris
  }
};

/**
 * Obtiene el icono correspondiente al nivel de alerta
 * @param {string} nivelAlerta - Nivel de alerta
 * @returns {string} Nombre del icono de Ant Design
 */
export const getIconoNivelAlerta = (nivelAlerta) => {
  switch (nivelAlerta) {
    case 'Sin riesgo / Bajo':
      return 'CheckCircleOutlined';
    case 'Alerta moderada':
      return 'WarningOutlined';
    case 'Alerta alta':
      return 'ExclamationCircleOutlined';
    case 'Alerta crítica':
      return 'StopOutlined';
    default:
      return 'InfoCircleOutlined';
  }
};

/**
 * Calcula el nivel de alerta para una derivación completa
 * @param {Object} derivacion - Objeto de derivación con seguimientos
 * @returns {Object} Objeto con información del nivel de alerta
 */
export const calcularNivelAlertaDerivacion = (derivacion) => {
  if (!derivacion) {
    return {
      scoreReal: 0,
      scoreNormalizado: 0,
      nivelAlerta: 'Sin riesgo / Bajo',
      color: '#d9d9d9',
      icono: 'InfoCircleOutlined'
    };
  }

  // Extraer resultados de seguimientos
  const resultadosSeguimientos = derivacion.seguimientos?.map(seguimiento => seguimiento.resultado) || [];
  
  // Calcular nivel de alerta
  const nivelAlerta = calcularNivelAlerta(
    resultadosSeguimientos,
    derivacion.prioridad || 'media',
    derivacion.estado_derivacion || 'abierta'
  );

  return {
    ...nivelAlerta,
    color: getColorNivelAlerta(nivelAlerta.nivelAlerta),
    icono: getIconoNivelAlerta(nivelAlerta.nivelAlerta)
  };
}; 