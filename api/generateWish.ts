import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { jsonrepair } from "jsonrepair";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { data } from "../data/sample";

const token = process.env.NEXT_PUBLIC_API_KEY;
const endpoint = "https://models.github.ai/inference";
const model = "deepseek/DeepSeek-R1";

const deepseek = ModelClient(endpoint, new AzureKeyCredential(token));

const client = new OpenAI({ baseURL: endpoint, apiKey: token, dangerouslyAllowBrowser: true });

/**
 * Generate celebration wishes for all relevant employees in a single OpenAI request
 */
async function processWishesForAll(employees: any[], customPrompt?: string) {
    // Build a prompt listing all employees and their celebration type
    let prompt = `Generate warm and personalized wishes IN RUSSIAN LANGUAGE for the following people.\n`;
    prompt += `For each person, generate a wish for their celebration (birthday or anniversary), make it friendly and professional.\n`;
    prompt += `Return the result as a JSON array of objects with fields: type ("birthday" or "anniversary"), person (name), and wish.\n`;
    if (customPrompt) prompt += ` ${customPrompt}\n`;
    prompt += `\nPeople:\n`;
    for (const emp of employees) {
        prompt += `- Name: ${emp.name}, Celebration: ${emp.type}, Position: ${emp.position}, Job: ${emp.job}\n`;
    }

    prompt +=
        "\n IMPORTANT: Return ONLY a valid JSON array as described, with no extra text, comments, or explanations. Do not break the JSON structure. If the output is too long, split into multiple arrays but always return valid JSON.";

    try {
        const response = await deepseek.path("/chat/completions").post({
            body: {
                messages: [{ role: "system", content: prompt }],
                max_tokens: 2048,
                model,
            },
        });

        // const completion = await client.chat.completions.create({
        //     messages: [{ role: "system", content: prompt }],
        //     temperature: 1.0,
        //     top_p: 1.0,
        //     model: model,
        // });

        if (isUnexpected(response)) {
            throw response.body.error;
        }

        return response.body.choices[0].message.content;
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
        let rateLimitHit = false;

        for (const batch of batches) {
            let wishesRaw;

            try {
                wishesRaw = await processWishesForAll(batch, prompt);
            } catch (error: any) {
                // If error is RateLimitExceed, break and return what we have
                if (error && error.response.code === "RateLimitReached") {
                    rateLimitHit = true;
                    break;
                } else {
                    throw error;
                }
            }

            // Remove <think> block if present
            let wishesText = wishesRaw;
            const thinkEndIdx = wishesRaw.indexOf("</think>");
            if (thinkEndIdx !== -1) {
                wishesText = wishesRaw.slice(thinkEndIdx + 8); // 8 = length of '</think>'
            }

            const [startIdx, endIdx] = [wishesText.indexOf("["), wishesText.lastIndexOf("]")];
            const processedWishes = wishesText.slice(startIdx, endIdx + 1);

            let wishes: any[] = [];
            try {
                wishes = JSON.parse(processedWishes);
            } catch {
                try {
                    wishes = JSON.parse(jsonrepair(processedWishes));
                } catch {
                    wishes = [{ raw: processedWishes }];
                }
            }

            allWishes = allWishes.concat(wishes);
        }

        return NextResponse.json({ wishes: allWishes, rateLimitHit });
    } catch (error) {
        console.log("Error processing request:", error);
        return NextResponse.json({ error: "Failed to generate wishes" }, { status: 500 });
    }
}
