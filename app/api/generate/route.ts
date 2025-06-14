import fs from 'fs';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import path from 'path';

const token = process.env.API_KEY;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4o";

const client = new OpenAI({ baseURL: endpoint, apiKey: token });

/**
 * Generate a celebration wish using DeepSeek API based on person's data and celebration type
 */
async function generateWish(person: any, celebrationType: 'birthday' | 'anniversary', customPrompt?: string) {
    const defaultPrompt = `Generate a warm and personalized ${celebrationType} IN RUSSIAN LANGUAGE wish for ${person.name}. 
    Make it friendly and professional.
    ${celebrationType === 'birthday' ? `The person has birthday in this date.` : `The person's work anniversary is on ${person.anniversary}.`}
    Their position is ${person.position} and they work as ${person.job}.`;

    const prompt = `${defaultPrompt} ${customPrompt}`;

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
        // Get custom prompt from request body if provided
        const body = await request.json();
        const customPrompt = body?.prompt;

        // Read the JSON file from public/files directory
        const filePath = path.join(process.cwd(), 'public', 'files', 'sample.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        // Get current month (1-based)
        const currentMonth = new Date().getMonth() + 1;

        const wishes = [];

        // Process each person
        for (const person of data) {            
            // Convert Excel serial number to JS Date
            const birthdayDate = person['ДР'] ? new Date(Math.round((person['ДР'] - 25569) * 86400 * 1000)) : null;
            const anniversaryDate = person['Годовщина'] ? new Date(Math.round((person['Годовщина'] - 25569) * 86400 * 1000)) : null;

            const birthdayMonth = birthdayDate ? birthdayDate.getMonth() + 1 : null;
            const anniversaryMonth = anniversaryDate ? anniversaryDate.getMonth() + 1 : null;

            if (birthdayMonth === currentMonth || anniversaryMonth === currentMonth) {
                const personData = {
                    name: person['ФИО'],
                    anniversary: person['Исполнится'],
                    position: person['Стаж'],
                    job: person['Должность']
                };

                if (birthdayMonth === currentMonth) {
                    const wish = await generateWish(personData, 'birthday', customPrompt);
                    if (wish) {
                        wishes.push({
                            type: 'birthday',
                            person: personData.name,
                            wish
                        });
                    }
                }

                if (anniversaryMonth === currentMonth) {
                    const wish = await generateWish(personData, 'anniversary', customPrompt);
                    if (wish) {
                        wishes.push({
                            type: 'anniversary',
                            person: personData.name,
                            wish
                        });
                    }
                }

                return NextResponse.json({ wishes }); 
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
