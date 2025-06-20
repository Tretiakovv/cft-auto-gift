import { type ClassValue, clsx } from "clsx"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function excelSerialDateToJSDate(serial: number): Date {
  const excelEpoch = new Date(1900, 0, 1);
  const msPerDay = 24 * 60 * 60 * 1000;
  // Excel considers 1900 a leap year, but it's not. Adjust for this.
  const daysSinceExcelEpoch = serial - (serial > 59 ? 2 : 1); // Subtract 2 for dates after Feb 28, 1900, 1 for Jan 1, 1900 (the epoch itself) and 1900 leap year correction
  const jsTime = excelEpoch.getTime() + daysSinceExcelEpoch * msPerDay;
  return new Date(jsTime);
}

export function formatDate(serialDate: number): string {
  const date = excelSerialDateToJSDate(serialDate);
  return format(date, 'dd.MM.yyyy', { locale: ru });
}

export function getMonthFromSerialDate(serialDate: number): number {
  const date = excelSerialDateToJSDate(serialDate);
  return date.getMonth(); // 0-indexed month
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[а-я]/g, (char) => {
      const cyrillicMap: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
        'я': 'ya'
      };
      return cyrillicMap[char] || char;
    })
    .replace(/[^\w-]+/g, '');
} 