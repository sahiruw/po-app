import requests
import random
from math import cos
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from faker import Faker

# Replace with your own Google Maps Geocoding API key
api_key = 'AIzaSyAuYYZazxHt-Kl5vWNfLnfffVrYGDBdgeo'
fake = Faker()
# Define the coordinates for the University of Moratuwa
base_locs = {
    "Katubedda": {
        'lat': 6.794052,
        'lng': 79.901683
    },
    "Galle": {
        'lat': 6.032,
        'lng': 80.214
    },
    "Moratuwa": {
        'lat': 6.7881,
        'lng': 79.8913
    },

    "Matara": {
        'lat': 5.9483,
        'lng': 80.5353
    },
}

poIds = {
    "Galle": "po-3",
    "Matara": "po-4",
    "Katubedda": "po-1",
    "Moratuwa": "po-2",
}
# Define a radius (in meters) around the University to search for random addresses
radius = 1000  # You can adjust this radius as needed


def randomAddress(city):
    base_loc = base_locs[city]
    # Generate random coordinates within the defined radius
    random_lat = base_loc['lat'] + \
        (random.random() - 0.5) * 2 * (radius / 111300)
    random_lng = base_loc['lng'] + \
        (random.random() - 0.5) * 2 * (radius / (111300 * cos(random_lat)))
    return (random_lat, random_lng)


cred = credentials.Certificate(
    'F:\\ReactNativeProjects\\po-app2\\fake-db\\serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()


# Reference to the source document
source_doc_ref = db.collection("Address")
added = []

for i in range(200):
    city = random.choice(list(base_locs.keys()))

    address = randomAddress(city)
    while address in added:
        address = randomAddress()
        added.append(address)

    ads = {
        'Location': [address[0], address[1]],
        "HouseNo": fake.building_number(),
        "Address_line_1": fake.street_name(),
        "Address_line_2": fake.city(),
        "City": city,
        "RegionID": poIds[city]
    }
    print(ads)
    print()
    source_doc_ref.add(ads)
