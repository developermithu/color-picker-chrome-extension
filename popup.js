const pickerBtn = document.querySelector(".pickerBtn");
const colorBox = document.querySelector(".colorBox");
const inputBox = document.querySelector(".inputBox");
const alertBtn = document.querySelector(".alertBtn");
const clipboardBtn = document.querySelector(".clipboardBtn");
const clipboardCheckBtn = document.querySelector(".clipboardCheckBtn");

pickerBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // console.log(tabs);

  //  popup box
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: pickColor,
    },
    async (injectionResults) => {
      const [data] = injectionResults;
      if (data.result) {
        const color = data.result.sRGBHex; // output #000000
        colorBox.style.backgroundColor = color;
        colorBox.style.display = "block";
        inputBox.style.display = "block";
        inputBox.value = color;
        inputBox.style.border = "1.5px solid " + color;
        inputBox.style.color = color;

        // copy to clipboard
        try {
          await navigator.clipboard.writeText(color);
        } catch (e) {
          console.error(e);
        }

        // clipboard button
        alertBtn.innerText = "Copied!";
        alertBtn.style.display = "block";
        setTimeout(() => {
          alertBtn.style.display = "none";
          clipboardCheckBtn.style.display = "block";
        }, 2000);
      }
      clipboardCheckBtn.style.display = "none";
      // console.log(injectionResults);
    }
  );
});

// EyeDropper functionality
const pickColor = async () => {
  try {
    const eyeDropper = new EyeDropper();
    const selectedColor = await eyeDropper.open();
    return selectedColor;

    // console.log(selectedColor);
  } catch (error) {
    console.error(error);
  }
};

// user can change the selected color using input field
inputBox.addEventListener("keydown", function (e) {
  const newColor = e.target.value;
  colorBox.style.backgroundColor = newColor;
  inputBox.style.border = `1.5px solid ${newColor}`;
  inputBox.style.color = newColor;
  clipboardBtn.style.display = "block";
  clipboardCheckBtn.style.display = "none";

  // after clicking the clipboard button show the clipboard check button
  clipboardBtn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(newColor);
    clipboardBtn.style.display = "none";
    clipboardCheckBtn.style.display = "block";
  });
});
