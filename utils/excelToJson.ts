import * as fs from 'fs';
import * as XLSX from 'xlsx';

export interface EmployeeData {
    name: string;
    anniversary: string;
    position: string;
    job: string;
}

export function convertExcelToJson(excelFilePath: string, outputPath: string): EmployeeData[] {
    try {
        // Read the Excel file
        const workbook = XLSX.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Transform the data to match our interface
        const transformedData: EmployeeData[] = data.map((row: any) => ({
            name: row['ФИО'] || '',
            anniversary: row['Исполнится'] || '',
            position: row['Стаж'] || '',
            job: row['Должность'] || ''
        }));

        // Write to JSON file
        fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2), 'utf8');

        return transformedData;
    } catch (error) {
        console.error('Error converting Excel to JSON:', error);
        throw error;
    }
}

// Example usage:
// const data = convertExcelToJson('sample.xlsx', 'output.json'); 