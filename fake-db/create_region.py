import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import random
# Initialize Firebase Admin SDK (You need to have your service account credentials JSON)
cred = credentials.Certificate('F:\\ReactNativeProjects\\po-app2\\fake-db\\serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

poIds = {
    "Galle": "rg-4",
    "Matara": "rg-5",
    "Katubedda": "rg-1",
    "Moratuwa": "rg-2",
}


new_data = {
    'name': 'Matara',
    'postoffice_id' : 'po-4'
}

# Create a new document with a different ID
new_document_ref = db.collection("Region").document("rg-4").set(new_data)

# Set the data of the new document with the data from the source document
# new_document_ref.add(new_data)
