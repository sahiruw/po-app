import requests
import random
from math import cos
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Replace with your own Google Maps Geocoding API key
api_key = 'AIzaSyAuYYZazxHt-Kl5vWNfLnfffVrYGDBdgeo'

# Define the coordinates for the University of Moratuwa
university_coords = {
    'lat': 6.794052,
    'lng': 79.901683
}

# Define a radius (in meters) around the University to search for random addresses
radius = 1000  # You can adjust this radius as needed

def randomAddress():
    # Generate random coordinates within the defined radius
    random_lat = university_coords['lat'] + (random.random() - 0.5) * 2 * (radius / 111300)
    random_lng = university_coords['lng'] + (random.random() - 0.5) * 2 * (radius / (111300 * cos(random_lat)))

    # Create the URL for the Geocoding API request
    # url = f'https://maps.googleapis.com/maps/api/geocode/json?latlng={random_lat},{random_lng}&key={api_key}'

    # # Send the request to the Google Maps Geocoding API
    # response = requests.get(url)
    # data = response.json()
    return (random_lat, random_lng)


# # Extract and print the formatted address
# if 'results' in data and data['results']:
#     formatted_address = data['results'][0]['formatted_address']
#     print(f'Random Address near University of Moratuwa: {formatted_address}')
# else:
#     print('No address found for the given coordinates.')


cred = credentials.Certificate('F:\\ReactNativeProjects\\po-app2\\fake-db\\serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()


# Reference to the source document
source_doc_ref = db.collection("Address").list_documents()
added = []

for doc in source_doc_ref:
    address = randomAddress()
    while address in added:
        address = randomAddress()
        added.append(address)
        
    doc.update({
        'Location': [address[0], address[1]],
        'lat': firestore.DELETE_FIELD,
        'lng': firestore.DELETE_FIELD
    })
    print(doc.id, "updated")

