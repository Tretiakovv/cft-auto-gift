import { jsonrepair } from "jsonrepair";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { data } from "../data/sample";

const token = process.env.NEXT_PUBLIC_API_KEY;
const endpoint = "https://models.github.ai/inference";

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
});

/**
 * Generate celebration wishes for all relevant employees in a single OpenAI request
 */
async function processWishesForAll(employees: any[], customPrompt?: string) {
    let prompt = `Generate warm and personalized wishes IN RUSSIAN LANGUAGE MINIMUN 3 SENTENCES for the following people.\n`;
    prompt += `For each person, generate a wish for their celebration (birthday or anniversary IN THE COMPANY), make it friendly and professional.\n`;
    prompt += `Return the result as a JSON array of objects with fields: type ("birthday" or "anniversary"), person (name), and wish.\n`;

    if (customPrompt) prompt += ` ${customPrompt}\n`;
    prompt += `\nPeople:\n`;

    for (const emp of employees) {
        prompt += `- Name: ${emp.name}, Celebration: ${emp.type}, Position: ${emp.position}, Job: ${emp.job}\n`;
    }

    prompt +=
        "\n IMPORTANT: Return ONLY a valid JSON array as described, with no extra text, comments, or explanations. Do not break the JSON structure. If the output is too long, split into multiple arrays but always return valid JSON.";

    try {
        const completion = await openai.chat.completions.create({
            model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating wishes:", error);
        return null;
    }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

export async function generateWish(prompt?: string) {
    try {
        // Get current month (1-based)
        const currentMonth = new Date().getMonth() + 1;
        const employeesToCongratulate: any[] = [];

        // Collect all employees with birthday or anniversary this month
        for (const person of data) {
            // Convert Excel serial number to JS Date
            const birthdayDate = person["ДР"]
                ? new Date(Math.round((person["ДР"] - 25569) * 86400 * 1000))
                : null;
            const anniversaryDate = person["Годовщина"]
                ? new Date(Math.round((person["Годовщина"] - 25569) * 86400 * 1000))
                : null;

            const birthdayMonth = birthdayDate ? birthdayDate.getMonth() + 1 : null;
            const anniversaryMonth = anniversaryDate ? anniversaryDate.getMonth() + 1 : null;

            if (birthdayMonth === currentMonth) {
                employeesToCongratulate.push({
                    name: person["ФИО"],
                    type: "birthday",
                    position: person["Стаж"],
                    job: person["Должность"],
                });
            }

            if (anniversaryMonth === currentMonth) {
                employeesToCongratulate.push({
                    name: person["ФИО"],
                    type: "anniversary",
                    position: person["Стаж"],
                    job: person["Должность"],
                });
            }
        }

        if (employeesToCongratulate.length === 0) {
            return NextResponse.json({ wishes: [] });
        }

        // Split into batches of 5
        const batches = chunkArray(employeesToCongratulate, 5);
        let allWishes: any[] = [];

        for (const batch of batches) {
            let wishesRaw = await processWishesForAll(batch, prompt);

            let wishes: any[] = [];
            try {
                wishes = JSON.parse(wishesRaw);
            } catch {
                try {
                    wishes = JSON.parse(jsonrepair(wishesRaw));
                } catch {
                    wishes = [{ raw: wishesRaw }];
                }
            }

            allWishes = allWishes.concat(wishes);
        }

        console.log('ALL_WISHES', allWishes);

        return NextResponse.json({ wishes: allWishes });
    } catch (error) {
        console.log("Error processing request:", error);
        return NextResponse.json({ error: "Failed to generate wishes" }, { status: 500 });
    }
}
