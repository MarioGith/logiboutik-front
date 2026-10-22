// Article prices are TTC (VAT included).
export const VAT_RATE = 0.2;
// Share of the sales kept as a fee (22.5 %).
export const SALES_FEE_RATE = 0.225;

const round = (value) => Math.round(value * 100) / 100;

export const priceHT = (priceTTC) => round(priceTTC / (1 + VAT_RATE));

export const lineTotal = (line) => round(line.price * line.quantity);

// Totals of an invoice made of { price, quantity } lines.
export function invoiceTotals(lines) {
  const ttc = round(lines.reduce((sum, line) => sum + lineTotal(line), 0));
  const fee = round(ttc * SALES_FEE_RATE);
  return { ttc, ht: priceHT(ttc), fee, toPay: round(ttc - fee) };
}
