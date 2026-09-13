const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

export function numberToWords(num: number): string {
  if (isNaN(num) || num < 0) return '';
  if (num === 0) return 'Zero Only';

  const n = Math.floor(num);

  function convertChunk(n: number): string {
    let result = '';
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      result += ones[n] + ' ';
    }
    return result.trim();
  }

  let words = '';

  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    words += convertChunk(thousands) + ' Thousand ';
  }

  const remainder = n % 1000;
  if (remainder > 0) {
    words += convertChunk(remainder);
  }

  return words.trim() + ' Only';
}

export function calculateGrade(percentage: number): string {
  if (isNaN(percentage)) return '-';
  if (percentage >= 80) return 'A-1';
  if (percentage >= 70) return 'A';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  if (percentage >= 33) return 'E';
  return 'Fail';
}
