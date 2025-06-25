// app/api/generateWish/route.ts
import { generateWish } from '../../../api/generateWish';

export async function POST(request: Request) {
  const { prompt } = await request.json();
  
  return generateWish(prompt);
}