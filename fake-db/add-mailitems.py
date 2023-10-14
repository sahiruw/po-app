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
start = 3
for i in range(10):
    mailitem = {
        "receiver_name":  fake.name(),
        "receiver_address_id": random.choice(address_ids),  # Reference to the Address document
        "accepted_receptionist": "DO7ugUmcoWTKnmnkTH3RiEAQtvi2",  # Reference to the MailServiceItem document
        "timestamp": fake.date_time_this_decade(),
        # "status": random.choice(["To be Dispatched", "To be Delivered", "To be Returned", "Out for Delivery", "Delivery Cancelled", "Returned", "Delivered", "Dispatched"]),
        "status": "To be Delivered",    
        "type": random.choice(["normal post", "registered post", "logi post", "return", "fast-track-courier"]),
        "delivery_attempts": [],
        "assigned_postman": "9wKkbgqZZPOP6mAioP1ge5zdORe2",
        "cost": random.randint(10, 100),
        
    }

    if mailitem["type"] != "normal post":
        mailitem["sender_name"] = fake.name()
        mailitem["sender_address_id"] = random.choice(address_ids)
        mailitem["secuirity_number"] = fake.password()


    mail_type = mailitem["type"]
    if mail_type == "normal post":
        mail_id = "101" + str(i+start).zfill(8)
    elif mail_type == "registered post":
        mail_id = "111" + str(i+start).zfill(8)
    elif mail_type == "logi post":
        mail_id = "121" + str(i+start).zfill(8)
    elif mail_type == "fast-track-courier":
        mail_id = "131" + str(i+start).zfill(8)
    elif mail_type == "return":
        mail_id = "141" + str(i+start).zfill(8)

    mailitems_ref.document(mail_id).set(mailitem)
    print(mailitem)
