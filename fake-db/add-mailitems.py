import firebase_admin
from firebase_admin import credentials, firestore
import random
import faker

# Initialize Firebase with your credentials
cred = credentials.Certificate('F:\\ReactNativeProjects\\po-app2\\fake-db\\serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Initialize the Faker library to generate fake data
fake = faker.Faker()

source_doc_ref = db.collection("Address").list_documents()
address_ids = [doc.id for doc in source_doc_ref]


    


mailitems_ref = db.collection("MailServiceItem")

for i in range(10):
    mailitem = {
        "receiver_name":  fake.name(),
        "receiver_address": random.choice(address_ids),  # Reference to the Address document
        "accepted_recipient": "DO7ugUmcoWTKnmnkTH3RiEAQtvi2",  # Reference to the MailServiceItem document
        "timestamp": fake.date_time_this_decade(),
        "status": random.choice(["To be Dispatched", "To be Delivered", "To be Returned", "Out for Delivery", "Delivery Cancelled", "Returned", "Delivered", "Dispatched"]),
        "type": random.choice(["Normal", "Registered", "Logi", "Return", "FastTrack"]),
        "deliveryAttempts": fake.random_int(min=0, max=3),
        "assigned_postman": "9wKkbgqZZPOP6mAioP1ge5zdORe2"
    }

    if mailitem["type"] != "Normal":
        mailitem["sender_name"] = fake.name()
        mailitem["sender_address"] = random.choice(address_ids)

    mail_type = mailitem["type"]
    if mail_type == "Normal":
        mail_id = "10" + str(i).zfill(6)
    elif mail_type == "Registered":
        mail_id = "11" + str(i).zfill(6)
    elif mail_type == "Logi":
        mail_id = "12" + str(i).zfill(6)
    elif mail_type == "FastTrack":
        mail_id = "13" + str(i).zfill(6)
    elif mail_type == "Money Order":
        mail_id = "14" + str(i).zfill(6)

    mailitems_ref.document(mail_id).set(mailitem)
    print(mailitem)
