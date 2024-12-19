import { download } from "./common/download.js";
import { applyScrubs, removeScrubs } from "./common/scrubs.js";

export async function saveMarkdown() {
  document.querySelectorAll(".screenshot").forEach(applyScrubs);
  const title = document.querySelector("h1").innerText;
  let markdown = `# ${title}\n\n`;

  const imagesData = [];
  const imageFileNames = [];

  // Process each step element
  document.querySelectorAll(".step").forEach((el, index) => {
    let image = el.querySelector(".step-image .screenshot");
    let description = el.querySelector(".step-description .content");

    markdown += `${index + 1}. ${description.textContent}`;

    // If an image is found
    if (image != undefined && image != null) {
      // Extract image data (assuming image.src is a Base64 string)
      const imgSrc = image.src;
      const base64Image = imgSrc.startsWith("data:image")
        ? imgSrc.split(",")[1]
        : imgSrc;

      const fileName = `image_${index + 1}.jpg`; // Naming convention for images
      imagesData.push(base64Image); // Collect the Base64 image data
      imageFileNames.push(fileName); // Keep track of the image file names

      // Reference the image relatively in markdown
      markdown += `\n ![${description.textContent.split("\n")[0] + "..."}](images/${fileName})\n\n`;
    } else {
      markdown += `\n\n`;
    }
  });

  // Create the ZIP file with markdown and images
  await createAndDownloadZip(imagesData, imageFileNames, markdown);

  // Remove scrubs after saving the content
  await removeScrubs();
}

// Function to create and download a ZIP file with markdown and images
async function createAndDownloadZip(imagesData, imageFileNames, markdown) {
  const zip = new JSZip();

  // Create a "What to click" folder in the ZIP
  const stepFilesFolder = zip.folder("What to click");

  // Add the markdown file to the "What to click" folder
  stepFilesFolder.file("What_to_click.md", markdown);

  // Create an "images" folder inside the "What to click" folder
  const imgFolder = stepFilesFolder.folder("images");

  // Add each image to the "images" folder inside the "What to click" folder
  imagesData.forEach((base64Image, index) => {
    const fileName = imageFileNames[index];
    imgFolder.file(fileName, base64Image, { base64: true });
  });

  // Generate the ZIP file and trigger the download
  zip.generateAsync({ type: "blob" }).then(function (content) {
    download(`What to click ${new Date().toDateString()}.zip`, content, {
      type: "application/zip",
    });
  });
}
