document.getElementById('input-text').addEventListener('input', function ()
{
  startTranslate();
});

isInputLatin = 1;
function swapFunction()
{
  isInputLatin = 1 - isInputLatin; // I love this line of code

  const inputElement = document.getElementById('input').querySelector('.selected');
  const outputElement = document.getElementById('output').querySelector('.selected');

  const inputTextElement = document.getElementById('input-text');
  const outputTextElement = document.getElementById('output-text');

  const tempContent = inputElement.innerHTML;
  const tempImageSrc = document.getElementById('input').querySelector('img').src;

  const tempText = inputTextElement.value;

  inputElement.innerHTML = outputElement.innerHTML;
  document.getElementById('input').querySelector('img').src = document.getElementById('output').querySelector('img').src;

  outputElement.innerHTML = tempContent;
  document.getElementById('output').querySelector('img').src = tempImageSrc;

  inputTextElement.value = outputTextElement.value;
  outputTextElement.value = tempText;

  startTranslate();

  const element = document.querySelector('.swap-position');
  element.classList.toggle('rotated');
}


function encodeText(text)
{
  const words = text.toLowerCase().split(" ");

  const encodedWords = words.map((word) =>
  {
    // Razdvajanje riječi na slova
    const letters = Array.from(word);
    const encodedLetters = letters.map((letter) =>
    {
      // Traženje Morseovog koda za svako slovo
      return reverseDictionary[letter] || ''; // Ako slovo nije pronađeno, koristi prazni string
    });
    return encodedLetters.join(" "); // Spajanje Morseovih simbola s jednim razmakom između njih
  });

  // Spajanje kodiranih riječi s trostrukim razmakom između riječi
  let encodedText = encodedWords.join("   ");

  const outputTextElement = document.getElementById('output-text');
  outputTextElement.value = encodedText;

  return encodedText;
}

function decodeMorseCode(morseCode)
{
  const words = morseCode.trim().split("   "); // Razdvajanje Morseovog koda na riječi

  const decodedWords = words.map((word) =>
  {
    const wordWithStandardSymbols = word.split(" ").map((symbol) =>
    {
      // Pretvorba Morseovog simbola u latinski znak
      return dictionary[symbol] || ''; // Koristi prazni string ako simbol nije pronađen u rječniku
    }).join(""); // Spajanje znakova u riječ

    return wordWithStandardSymbols;
  });

  const decodedText = decodedWords.join(" "); // Spajanje riječi u tekst

  const outputTextElement = document.getElementById('output-text');
  outputTextElement.value = decodedText; // Postavljanje dekodiranog teksta u textarea

  return decodedText;
}

const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) =>
{
  const file = e.target.files[0];
  if (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/msword" ||
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
  {
    uploadTitle.innerHTML = file.name;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) =>
    {
      document.getElementById('input-text').value = e.target.result;
      startTranslate();
    };
  } else
  {
    alert("Učitaj dokument u važećem formatu! (PDF, TXT, DOCX, DOC)");
  }
});

const downloadBtn = document.querySelector("#download-btn");

downloadBtn.addEventListener("click", (e) =>
{
  const outputText = document.getElementById('output-text').value;
  let name = "Morseov Kod";
  if (!isInputLatin) name = "Latinica";

  if (outputText)
  {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const formatDate = String(now.getDate()).padStart(2, '0') +
      '-' + String(now.getMonth() + 1).padStart(2, '0') +
      '-' + now.getFullYear();
    const formatTime = String(now.getHours()).padStart(2, '0') +
      '-' + String(now.getMinutes()).padStart(2, '0') +
      '-' + String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${formatDate} ${formatTime}`;

    const filename = `${name} ${timestamp}.txt`;

    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    a.click();
  }
});

function startTranslate()
{
  const inputTextElement = document.getElementById('input-text');
  if (isInputLatin)
  {
    encodeText(inputTextElement.value);
  } else
  {
    decodeMorseCode(inputTextElement.value);
  }
}
