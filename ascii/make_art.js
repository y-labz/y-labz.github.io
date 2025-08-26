//-----------------------------------------------------
const banner = `
░█░░█░░░░█░░█▀▀▄░█▀▀▄░▀▀█
░█▄▄█░▀▀░█░░█▄▄█░█▀▀▄░▄▀▒
░▄▄▄▀░░░░▀▀░▀░░▀░▀▀▀▀░▀▀▀
`;

const mainWindow = document.getElementById("main");

// add banner
const ban = document.createElement('div');
ban.id = "banner";
ban.textContent = banner;
mainWindow.appendChild(ban);

//-----------------------------------------------------
// add input file browse
const upload = document.createElement("input");
upload.type = "file";
upload.id = "upload";
upload.accept = "image/*";

const uploadLabel = document.createElement("label");
uploadLabel.setAttribute('for', 'upload');
uploadLabel.className = "custom-file";
uploadLabel.textContent = "Upload Image";
uploadLabel.appendChild(upload)

const uploadFile = document.createElement('span');
uploadFile.id = 'file-name';
uploadFile.textContent = 'mask.jpg';

const uploadDiv = document.createElement('div');
uploadDiv.appendChild(uploadLabel);
uploadDiv.appendChild(uploadFile);
mainWindow.appendChild(uploadDiv);

upload.addEventListener('change', (e) => {
  const fileName = e.target.files[0]?.name || "No file selected.";
  uploadFile.textContent = fileName;
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    img.onload = () => {
      canvas0.width = img.width;
      canvas0.height = img.height;
      ctx.drawImage(img, 0, 0);
      generateASCII();
    };
    img.src = reader.result;
  };
  if (file) reader.readAsDataURL(file);
});

//-----------------------------------------------------
// original image canvas
const canvas0 = document.createElement('canvas');
mainWindow.appendChild(canvas0);
const ctx = canvas0.getContext('2d');

let img = new Image();


//-----------------------------------------------------
// add color slider
let colorFlag = true;

const sw1 = document.createElement('input');
sw1.type = 'checkbox';
sw1.id = 'fancySwitch1';
sw1.className = 'fancy-switch';
sw1.checked = true;

const swlabel1 = document.createElement('label');
swlabel1.setAttribute('for', 'fancySwitch1');
swlabel1.className = 'fancy-slider';

const comment1 = document.createElement('span');
comment1.textContent = ' Color ';

sw1.addEventListener("change", function() {
  colorFlag = this.checked;
});

//-----------------------------------------------------
// add YinYang slider
let yinFlag = true;

const sw2 = document.createElement('input');
sw2.type = 'checkbox';
sw2.id = 'fancySwitch2';
sw2.className = 'fancy-switch';
sw2.checked = true;

const swlabel2 = document.createElement('label');
swlabel2.setAttribute('for', 'fancySwitch2');
swlabel2.className = 'fancy-slider';
// swlabel2.appendChild(sw2);

const comment2 = document.createElement('span');
comment2.textContent = ' YinYang ';
const wrapper2 = document.createElement('div');
wrapper2.style.display = 'flex';
wrapper2.style.alignItems = 'center'; //or end
// wrapper2.style.gap = '10px';

wrapper2.appendChild(sw1);
wrapper2.appendChild(swlabel1);
wrapper2.appendChild(comment1);

wrapper2.appendChild(sw2);
wrapper2.appendChild(swlabel2);
wrapper2.appendChild(comment2);

mainWindow.appendChild(wrapper2);

sw2.addEventListener("change", function() {
  yinFlag = this.checked;
});


//-----------------------------------------------------
// ascii text div
const asciiOutput = document.createElement('pre');
mainWindow.appendChild(asciiOutput);




//-----------------------------------------------------
function posterize(value, levels) {
  return Math.floor(value / (256 / levels)) * (256 / levels);
}

function generateASCII() {
  const width = canvas0.width;
  const height = canvas0.height;
  const scale = 0.4;
  const w = Math.floor(width * scale);
  const h = Math.floor(height * scale);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas0, 0, 0, w, h);
  const imageData = tempCtx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // let ascii = '';
  asciiOutput.innerHTML = ''; //cleanup
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r0 = data[i];
      const g0 = data[i + 1];
      const b0 = data[i + 2];
      const r1 = posterize(data[i], 5);
      const g1 = posterize(data[i + 1], 5);
      const b1 = posterize(data[i + 2], 5);

      const brightness0 = 0.299 * r0 + 0.587 * g0 + 0.114 * b0;
      const brightness1 = 0.299 * r1 + 0.587 * g1 + 0.114 * b1;
 // const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

      // const index = Math.floor((brightness0 / 255) * (sorted_chars.length - 1));
      const index = Math.floor((brightness1 / 255) * (sorted_chars.length - 1));
      const index1 = Math.floor((1 - brightness1 /255) *(sorted_chars.length -1));


      const char = sorted_chars.charAt(index);
      // ascii += sorted_chars.charAt(index);
      
      const span = document.createElement('span');
      span.className = 'pixel';
      span.textContent = char;
      // span.style.color = `rgb(${r1}, ${g1}, ${b1})`;
      // span.style.color = 'black';
      span.style.backgroundColor = 'white';
      // span.style.color = 'white';
      // span.style.backgroundColor = 'black';
      span.style.color = `rgb(${r0}, ${g0}, ${b0})`;
      // span.style.backgroundColor = `rgb(${r1}, ${g1}, ${b1})`;
      //span.style.backgroundColor = `rgb(${255 - r}, ${255 - g}, ${255 - b})`;

      asciiOutput.appendChild(span);
    }
    // ascii += '\n';
    asciiOutput.appendChild(document.createElement('br'));
  }
  // asciiOutput.textContent = ascii;
}

// defalut
function init() {
  img.src = "Famous16289.jpg";
  img.onload = function() {
    canvas0.width = img.width;
    canvas0.height = img.height;
    ctx.drawImage(img, 0, 0);
    generateASCII();
  };
};

init();

