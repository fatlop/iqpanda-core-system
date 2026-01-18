/**
 * Redondea un número a dos decimales
 * @param valor - Número a redondear
 * @returns Número redondeado a dos decimales
 */
export const redondearADosDecimales = (valor: number): number => {
  return Math.round(valor * 100) / 100;
};

/**
 * Genera un número único de venta basado en la fecha actual
 * @returns Número de venta en formato V-YYYYMMDD-XXXXXX
 */
export const generarNumeroVenta = (): string => {
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
  const dia = String(fechaActual.getDate()).padStart(2, '0');
  const secuencial = Date.now().toString().slice(-6);
  
  return `V-${año}${mes}${dia}-${secuencial}`;
};
