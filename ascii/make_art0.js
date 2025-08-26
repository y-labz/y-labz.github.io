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
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      generateASCII();
    };
    img.src = reader.result;
  };
  if (file) reader.readAsDataURL(file);
});

//-----------------------------------------------------
// original image canvas
const canvas = document.createElement('canvas');
mainWindow.appendChild(canvas);
const ctx = canvas.getContext('2d');

let img = new Image();


//-----------------------------------------------------
// add color slider
let colorFlag = true;
// const swDiv1 = document.createElement('div');
// swDiv1.className = 'fancy-switch-container';

const sw1 = document.createElement('input');
sw1.type = 'checkbox';
sw1.id = 'fancySwitch1';
sw1.className = 'fancy-switch';
sw1.checked = true;

const swlabel1 = document.createElement('label');
swlabel1.setAttribute('for', 'fancySwitch1');
swlabel1.className = 'fancy-slider';
// swlabel1.appendChild(sw1);

const comment1 = document.createElement('span');
comment1.textContent = ' Color ';
// const wrapper1 = document.createElement('div');
// wrapper1.style.display = 'flex';
// wrapper1.style.alignItems = 'end';
// wrapper1.style.gap = '10px';

// swDiv1.appendChild(sw1);
// swDiv1.appendChild(swlabel1);
// wrapper1.appendChild(swDiv1);
// wrapper1.appendChild(comment1);
// mainWindow.appendChild(wrapper1);

sw1.addEventListener("change", function() {
  colorFlag = this.checked;
});

//-----------------------------------------------------
// add YinYang slider
let yinFlag = true;
// const swDiv2 = document.createElement('div');
// swDiv2.className = 'fancy-switch-container';

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

// swDiv2.appendChild(sw2);
// swDiv2.appendChild(swlabel2);

// wrapper2.appendChild(swDiv1);
wrapper2.appendChild(sw1);
wrapper2.appendChild(swlabel1);
wrapper2.appendChild(comment1);

// wrapper2.appendChild(swDiv2);
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

function generateASCII() {
  // const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const scale = 0.3;
  const w = Math.floor(width * scale);
  const h = Math.floor(height * scale);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0, w, h);
  const imageData = tempCtx.getImageData(0, 0, w, h);
  const data = imageData.data;

  let ascii = '';
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // const index = Math.floor((1 - brightness / 255) * (asciiChars.length - 1));
      // const index = Math.floor((1 - brightness / 255) * (sorted_chars.length - 1));
      const index = Math.floor((brightness / 255) * (sorted_chars.length - 1));
      // ascii += asciiChars[index];
      ascii += sorted_chars.charAt(index);
    }
    ascii += '\n';
  }
  asciiOutput.textContent = ascii;
}

// defalut
function init() {
  img.src = "Famous16289.jpg";
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    generateASCII();
  };
};

init();

