# Imports
import eel
import lifxlan
import time

# Specify UI Directory
eel.init('ui')

# Connect to LAN & Find Lights, executed by JS when page is loaded. (initialLoad)
@eel.expose
def connect():
    lan = lifxlan.LifxLAN()
    connecting = True
    attempts = 0
    while connecting == True and attempts < 5: # If no lights are found, will retry 5 times. If still no result, send error to JS to display to user.
        global lights 
        lights = lan.get_lights()
        connecting = False
        if len(lights) == 0:
            print('No lights found, retrying (', str(attempts),')...')
            attempts = attempts + 1
            connecting = True
    if connecting == True:
        print('No lights could be found after 5 attempts. Aborting.')
        eel.messageFromPy('No lights found. Check your lights are turned on at the switch, and that your firewall isn\'t blocking Meenu.')

    print(lights)
    return True

# Toggle light on and off. Light specified with ID. (JS)
@eel.expose
def toggleLight(lightID):
    if lights[lightID].get_power() == 0:
        lights[lightID].set_power(True)
    else:
        lights[lightID].set_power(False)

# Get Light Name from ID. (JS)
@eel.expose
def getLightName(lightID):
    return lights[lightID].get_label()

# Get the group that a light is in from ID. (JS)
@eel.expose
def getLightGroup(lightID):
    return lights[lightID].get_group()

# Get light color values from ID, in a specified format (HSL or LIFX-HSBK) (JS)
@eel.expose
def getLightColor(lightID, format):
    lightColor = lights[lightID].get_color()
    print(lightColor)
    if format == 'hsl':
        lightColorFormatted = [360*(lightColor[0]/65535), 100*(lightColor[1]/65535), 50]
        hsl = "hsl("+str(lightColorFormatted[0])+","+str(lightColorFormatted[1])+"%, 50%)"
        return hsl
    else:
        return lightColor

@eel.expose
def setColor(lightID, color):
    lights[lightID].set_color([],)

# Get light brightness value from ID. (JS)
@eel.expose
def getLightBrightness(lightID):
    return lights[lightID].get_color()[2]

# Set light brightness. Light specified with ID. (JS)
@eel.expose
def setBrightness(value, lightID):
    lights[lightID].set_brightness(value, 150)

# Push JS to update light info every 5 seconds
def refreshPush():
    while True:
        eel.sleep(10)
        eel.refresh()

eel.spawn(refreshPush)

# Set path to electron executable. Current builds do not use Electron by default.
# eel.browsers.set_path('electron', 'node_modules/electron/dist/electron') 

# Start Eel instance.
eel.start('index.html', size=[500, 300])