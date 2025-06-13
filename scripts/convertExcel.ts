import * as path from 'path';
import { convertExcelToJson } from '../utils/excelToJson';

const excelFilePath = path.join(process.cwd(), 'sample.xlsx');
const outputPath = path.join(process.cwd(), 'data', 'employees.json');

try {
    const data = convertExcelToJson(excelFilePath, outputPath);
    console.log('Successfully converted Excel to JSON!');
    console.log(`Output saved to: ${outputPath}`);
} catch (error) {
    console.error('Failed to convert Excel to JSON:', error);
    process.exit(1);
} 