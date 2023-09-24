import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import random
# Initialize Firebase Admin SDK (You need to have your service account credentials JSON)
cred = credentials.Certificate('F:\\ReactNativeProjects\\po-app2\\fake-db\\serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()


# Reference to the source document
query = db.collection("MailServiceItem").where("status", "==", "To be Dispatched")

# Get the documents that match the query
docs = query.stream()

doc_ids = [doc.id for doc in docs]

print(doc_ids)
# print(doc_ids)
new_data = {
    'mail_service_items': random.sample(doc_ids, 5),
    'date': '22092023',
    'destination_post_office_id': 'po-1',
    'origin_post_office_id': 'po-4',
    'status': 'Queued'
}

# Create a new document with a different ID
new_document_ref = db.collection("Bundle")

# Set the data of the new document with the data from the source document
new_document_ref.add(new_data)
