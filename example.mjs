import OpenAI from "openai";
const client = new OpenAI({
  apiKey: "sk-proj-D0OYfwdbzSyLZmWf7uh4T3BlbkFJiqjCgk5NvGL3KHQWyDCn",
});

const response = await client.responses.create({
  model: "gpt-4o",
  input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);
