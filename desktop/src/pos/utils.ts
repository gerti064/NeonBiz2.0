export function formatMoney(n: number, currency = "$") {
  const val = Math.round(n * 100) / 100;
  return `${currency}${val.toFixed(2)}`;
}

export function calcSubtotal(items: { price: number; qty: number }[]) {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

export function calcTax(subtotal: number, taxRate = 0) {
  return subtotal * taxRate;
}

export function isoDateLabel(d = new Date()) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}
