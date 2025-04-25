import { removeBackground } from "@imgly/background-removal-node";
import { readFile } from "fs/promises";

const inputPath = "./input-01.jpg";
const outputPath = "./output-01.jpg";

const abosuluteInputPath = new URL(inputPath, import.meta.url).pathname;
const abosuluteOutputPath = new URL(outputPath, import.meta.url).pathname;

async function main() {
  const inputBuffer = await readFile(abosuluteInputPath);
  const outputBuffer = await removeBackground(inputBuffer);
  console.log("Background removed successfully!");
}
