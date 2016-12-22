import bottle
##from bottle import static_file, request
import requests
import json
from geojson import Point, Feature, FeatureCollection
from pprint import pprint
from datetime import datetime

def ip2int(ip):
        split_ip = ip.split(".")
        intip = int(split_ip[0])*(256**3) + int(split_ip[1])*(256**2) + int(split_ip[2])*(256) + int(split_ip[3])

        return intip

@bottle.hook('before_request')
def enable_cors():
        bottle.response.headers['Access-Control-Allow-Origin'] = '*'

@bottle.route("/<ip>")
def skyhook_geojson(ip):
    cblock = ".".join(ip.split(".")[:3])

    url = "http://iplookup.neustar.biz/fetch?val={0}&source=skyhook&time=1&env=prod".format(cblock)

    page = requests.get(url)

    try:
        data = json.loads(page.text)[2:]
        
        geojson = FeatureCollection([Feature(geometry=Point((float(i[2]), float(i[1]))),
                                             properties={"ip": str(i[0]),
                                                         "ipDecimal": ip2int(str(i[0])),
##                                                         "date": str(i[-1])
                                                         "date": datetime.strptime(str(i[-1]), '%Y-%m-%d %H:%M:%S').isoformat()
                                                         })
                                     for i in data])

        return geojson
    except:
        return "error"

bottle.debug(True)
bottle.run(host="10.96.162.34", port="5555")
