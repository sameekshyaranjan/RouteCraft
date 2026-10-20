export function parseApproxPrice(rangeStr) {
  if (!rangeStr) return 0;
  const numbers = String(rangeStr).match(/\d+(\.\d+)?/g);
  if (!numbers || numbers.length === 0) return 0;
  const nums = numbers.map(Number);
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function nightsBetween(startDate, endDate) {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}
