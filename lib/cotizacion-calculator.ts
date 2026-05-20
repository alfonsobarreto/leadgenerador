/**
 * Port literal de la lógica Dart `calcularCotizacion` (mensajes/formato en-US).
 */

export type CotizacionCalculada = {
  precioLista: string;
  precioFinal: string;
  montoEnganche: string;
  montoAFinanciar: string;
  pagoMensualInicial: string;
};

const formato = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * calcula Cotización (MXN interno → formateado según `monedaDeseada`).
 * @param tasaCambio MXN por 1 USD (cuando muestras USD y tasa > 0).
 */
export function calcularCotizacion(
  precioM2: number,
  metrosCuadrados: number,
  porcentajeEnganche: number,
  plazoAnos: number,
  tasaCambio: number,
  monedaDeseada: string,
): CotizacionCalculada {
  const precioListaMXN = precioM2 * metrosCuadrados;
  const simboloMoneda = monedaDeseada === "USD" ? "$" : "$MXN ";

  const conSimbolo = (valor: number) => `${simboloMoneda}${formato.format(valor)}`;

  if (plazoAnos === 1) {
    const precioFinalContado = precioListaMXN * 0.8;
    const divisa = monedaDeseada === "USD" && tasaCambio > 0 ? tasaCambio : 1.0;

    return {
      precioLista: conSimbolo(precioListaMXN / divisa),
      precioFinal: conSimbolo(precioFinalContado / divisa),
      montoEnganche: conSimbolo(precioFinalContado / divisa),
      montoAFinanciar: conSimbolo(0),
      pagoMensualInicial: conSimbolo(0),
    };
  }

  const descuentoPorcentaje = porcentajeEnganche / 100.0;
  const precioFinalConDescuento = precioListaMXN * (1 - descuentoPorcentaje);

  let engancheTeorico = precioFinalConDescuento * (porcentajeEnganche / 100.0);
  let montoEngancheMXN = engancheTeorico;

  if (porcentajeEnganche === 10) {
    const bonoPPE = engancheTeorico * 0.1;
    montoEngancheMXN -= bonoPPE;
  }

  const montoAFinanciarMXN = precioFinalConDescuento - engancheTeorico;

  const mesesSinInteres = metrosCuadrados >= 200 ? 48 : 36;
  const aniosMSI = Math.floor(mesesSinInteres / 12);

  let pagoMensualAnio1 = 0;
  if (plazoAnos === 20) {
    pagoMensualAnio1 = (montoAFinanciarMXN * 0.05) / 12;
  } else if (plazoAnos === 30) {
    pagoMensualAnio1 = (montoAFinanciarMXN / 30) / 12;
  }

  let tasaAumentoAnual = 0;
  if (metrosCuadrados < 200) {
    tasaAumentoAnual = plazoAnos === 20 ? 0.4 : 0.6;
  } else {
    tasaAumentoAnual = plazoAnos === 20 ? 0.25 : 0.4;
  }

  let sumaDePagosTipo = 0;
  for (let i = 0; i < aniosMSI; i++) {
    sumaDePagosTipo += pagoMensualAnio1 * (1 + tasaAumentoAnual) ** i;
  }

  let pagoPromedioMSIMXN = 0;
  if (aniosMSI > 0) {
    pagoPromedioMSIMXN = sumaDePagosTipo / aniosMSI;
  }

  const divisa = monedaDeseada === "USD" && tasaCambio > 0 ? tasaCambio : 1.0;

  return {
    precioLista: conSimbolo(precioListaMXN / divisa),
    precioFinal: conSimbolo(precioFinalConDescuento / divisa),
    montoEnganche: conSimbolo(montoEngancheMXN / divisa),
    montoAFinanciar: conSimbolo(montoAFinanciarMXN / divisa),
    pagoMensualInicial: conSimbolo(pagoPromedioMSIMXN / divisa),
  };
}
