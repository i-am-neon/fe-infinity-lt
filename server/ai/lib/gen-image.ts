import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import OpenAI from "openai";
import { Image, decode } from "imagescript";

// This currently isn't being used because I'm waiting for 4o image generation to come out in the API.
// When available, hook it up in the game generation and name it "title_background.png" and put it in resources/panoramas and it will automatically be used.
// You'll also need to remove the "Lion's Throne" text overlay
export default async function genImage({ prompt, filePath }: { prompt: string; filePath: string; }): Promise<void> {
    try {
        // Initialize OpenAI client
        const openai = new OpenAI();

        // Generate the image using OpenAI SDK
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
        });

        const base64Data = response.data[0].b64_json;
        if (!base64Data) {
            throw new Error("No base64 data received from OpenAI");
        }

        // Decode base64 to binary
        const binaryData = base64Decode(base64Data);

        // Process the image: resize to 256x256 first, then crop to 240x160
        const processedImage = await processAndCropImage(binaryData, 240, 160);

        // Write the cropped image to file
        await Deno.writeFile(filePath, processedImage);
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
}

/**
 * Decode base64 string to Uint8Array
 */
function base64Decode(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

/**
 * Process and crop image to the target dimensions using ImageScript
 * First resizes to 256x256, then crops to 240x160
 */
async function processAndCropImage(
    imageData: Uint8Array,
    targetWidth: number,
    targetHeight: number
): Promise<Uint8Array> {
    try {
        // Decode the image
        const decodedImage = await decode(imageData);

        // We need to ensure we're working with an Image instance
        let img: Image;

        if (decodedImage instanceof Image) {
            img = decodedImage;
        } else {
            // For non-Image types (like GIF), we need to create a new Image
            // But to avoid type errors with getPixelAt, we'll handle this differently
            // Extract image dimensions from the decoded image
            const { width, height } = decodedImage;

            // Create a new Image with the same dimensions
            img = new Image(width, height);

            // Since we can't directly access pixels from GIF type, we'll just
            // encode the decodedImage and then decode it again as an Image
            // This is less efficient but works around the type issues
            const encodedImage = await decodedImage.encode();
            const redecodedImage = await decode(encodedImage) as Image;

            if (redecodedImage instanceof Image) {
                img = redecodedImage;
            } else {
                // If still not an Image, use a fallback approach
                // Fill with a placeholder color in case we can't extract pixels
                img.fill(0xFFFFFFFF); // White background
            }
        }

        // Step 1: Resize the image to 256x256
        const intermediateSize = 256;
        img.resize(intermediateSize, intermediateSize);

        // Step 2: Calculate crop coordinates
        // To get a 240x160 image from a 256x256 square, we need to:
        // - Keep full width (or crop 8px from each side)
        // - Crop from top and bottom to get 160px height
        const horizontalCrop = (intermediateSize - targetWidth) / 2;
        const verticalCrop = (intermediateSize - targetHeight) / 2;

        // Crop the image (centered)
        const croppedImg = img.crop(
            Math.floor(horizontalCrop),
            Math.floor(verticalCrop),
            targetWidth,
            targetHeight
        );

        // Encode the image as PNG
        return await croppedImg.encode();
    } catch (error) {
        console.error("Error processing image:", error);
        // Fallback: return the original image if processing fails
        return imageData;
    }
}

if (import.meta.main) {
    const testImagePath = getPathWithinServer("assets/test/gen-image-result.png");
    const prompt = `generate an image for the title screen of a fire emblem GBA game with this info: 
Title: "The Grand Tourney"
Desc: "As the Grand Tourney in Veloria's capital Virelle begins, the city is aflame with excitement, mischief, and anticipation. Nobles and commoners alike descend upon the marble streets, eager for glory, laughter, or a chance to tip the scales of power. Amid the festivities, a trio of unlikely companions—each with their own reasons for entering the Tourney—find themselves swept into a farcical mix-up during the opening parade. What starts as an innocent comedic rivalry soon reveals hints of a deeper conspiracy: a mysterious masked figure sabotages key tournament events and spreads chaos among the factions. With reputations and fortunes on the line, the group must band together to uncover the prankster's identity before the Festival Arena descends into utter pandemonium."

Make sure to include the title text in a stylized way, do not put the description on there, but use it as context for image gen. `;
    await genImage({ prompt, filePath: testImagePath });
    console.log(`Image saved to: ${testImagePath}`);
}