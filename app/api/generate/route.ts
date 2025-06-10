import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as XLSX from 'xlsx';

const token = process.env.API_KEY;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const client = new OpenAI({ baseURL: endpoint, apiKey: token });

/**
 * Generate a celebration wish using DeepSeek API based on person's data and celebration type
 */
async function generateWish(person: any, celebrationType: 'birthday' | 'anniversary') {
    const prompt = `Generate a warm and personalized ${celebrationType} IN RUSSIAN LANGUAGE wish for ${person.name}. 
    Make it friendly and professional.
    ${celebrationType === 'birthday' ? `The person's birthday is on ${person.birthday}.` : `The person's work anniversary is on ${person.anniversary}.`}
    Their position is ${person.position}.`;

    try {
        const completion = await client.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            temperature: 1.0,
            top_p: 1.0,
            model: model,
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating wish:', error);
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const { excelData } = await request.json();
        
        // Get current month (1-based)
        const currentMonth = new Date().getMonth() + 1;

        // Parse Excel data
        const workbook = XLSX.read(excelData, { type: 'base64' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const wishes = [];

        // Process each row
        for (const row of data) {            
            // Convert Excel serial number to JS Date
            const birthdayDate = row['ДР'] ? new Date(Math.round((row['ДР'] - 25569) * 86400 * 1000)) : null;
            const anniversaryDate = row['Годовщина'] ? new Date(Math.round((row['Годовщина'] - 25569) * 86400 * 1000)) : null;

            const birthdayMonth = birthdayDate ? birthdayDate.getMonth() + 1 : null;
            const anniversaryMonth = anniversaryDate ? anniversaryDate.getMonth() + 1 : null;

            if (birthdayMonth === currentMonth || anniversaryMonth === currentMonth) {
                const personData = {
                    name: row['ФИО'],
                    birthday: row['Должность'],
                    anniversary: row['Исполнится'],
                    position: row['Стаж']
                };

                if (birthdayMonth === currentMonth) {
                    const wish = await generateWish(personData, 'birthday');
                    if (wish) {
                        wishes.push({
                            type: 'birthday',
                            person: personData.name,
                            wish
                        });
                    }
                }

                if (anniversaryMonth === currentMonth) {
                    const wish = await generateWish(personData, 'anniversary');
                    if (wish) {
                        wishes.push({
                            type: 'anniversary',
                            person: personData.name,
                            wish
                        });
                    }
                }
            }
        }

        return NextResponse.json({ wishes });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Failed to generate wishes' },
            { status: 500 }
        );
    }
}
