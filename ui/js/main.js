

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
        eel.setBrightness(document.getElementById('brightness').value, 0)
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