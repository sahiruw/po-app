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
# source_doc_ref = db.collection("MailServiceItem").list_documents()
# doc_ids = [doc.id for doc in source_doc_ref]

query = db.collection("MailServiceItem").where("status", "==", "To be Delivered").stream()

# Get the document IDs of the matching documents
doc_ids = [doc.id for doc in query]

print(doc_ids)

# print(doc_ids)
new_data = {
    '9wKkbgqZZPOP6mAioP1ge5zdORe2': random.sample(doc_ids, random.randint(4,6))
}
print(new_data)

# Create a new document with a different ID
new_document_ref = db.collection("Route").document("20102023")

# Set the data of the new document with the data from the source document
new_document_ref.set(new_data)

print("Document duplicated successfully")
