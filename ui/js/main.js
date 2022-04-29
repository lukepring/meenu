function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
      h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return [h,s,l];
}

async function initialLoad() {
    await eel.connect()();
    let lightName = await eel.getLightName(0)();
    let lightGroup = await eel.getLightGroup(0)();
    let lightBrightness = await eel.getLightBrightness(0)();
    let lightColor = await eel.getLightColor(0, 'hsl')();
    console.log(lightColor)
    document.getElementById('colorwheel').style.color = lightColor;
    document.getElementById('lightName').innerHTML = lightName;
    document.getElementById('groupName').innerHTML = lightGroup;
    document.getElementById('brightness').value = lightBrightness;
    document.getElementById('btn').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('brightness').style.display = 'block';
    document.getElementById('color').style.display = 'block';
    document.getElementById('btn').addEventListener('click', function(){
        eel.toggleLight(0);
    })
    
    document.getElementById('brightness').addEventListener('mouseup', function(){
        eel.setBrightness(0, document.getElementById('brightness').value)
    })
    document.getElementById('color').addEventListener('input', function(){
        hslColor = hexToHSL(document.getElementById('color').value);
        eel.setColor(0, hslColor);
        update();
    })
}

eel.expose(messageFromPy);
function messageFromPy(message){
    console.warn(message);
    alert(message);
}

async function update(){
    let lightName = await eel.getLightName(0)();
    let lightGroup = await eel.getLightGroup(0)();
    let lightBrightness = await eel.getLightBrightness(0)();
    let lightColor = await eel.getLightColor(0, 'hsl')();
    document.getElementById('colorwheel').style.color = lightColor;
    document.getElementById('lightName').innerHTML = lightName;
    document.getElementById('groupName').innerHTML = lightGroup;
    document.getElementById('brightness').value = lightBrightness;
}

eel.expose(refresh);
function refresh() {
    update();
}

window.addEventListener("resize", function(){
    window.resizeTo(500, 300);
});