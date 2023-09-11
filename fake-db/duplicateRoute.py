import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize Firebase Admin SDK (You need to have your service account credentials JSON)
cred = credentials.Certificate('F:\\ReactNativeProjects\\po-app2\\fake-db\\serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# ID of the source document you want to duplicate
source_document_id = "09092023"

# Reference to the source document
source_doc_ref = db.collection("Route").document(source_document_id)

# Get the data from the source document
source_data = source_doc_ref.get().to_dict()
mails = source_data['mails']
newData = {
    '9wKkbgqZZPOP6mAioP1ge5zdORe2': mails
}
# Create a new document with a different ID
new_document_ref = db.collection("Route").document("11092023")

# Set the data of the new document with the data from the source document
new_document_ref.set(newData)

print("Document duplicated successfully")
