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

# Sample data generation functions
def generate_address():
    return {
        "HouseNo": fake.building_number(),
        "Address_line_1": fake.street_address(),
        "Address_line_2": fake.secondary_address(),
        "Address_line_3": fake.secondary_address(),
        "City": fake.city(),
        "PostofficeID": fake.random_int(min=1, max=100),
        "RegionID": fake.random_int(min=1, max=100)
    }

def generate_region():
    return {
        "PostofficeID": fake.random_int(min=1, max=100),
        "Name": fake.state()
    }

def generate_postoffice():
    return {
        "name": fake.company(),
        "latitude": fake.latitude(),
        "longitude": fake.longitude()
    }

def generate_barcode():
    return {
        "barcode": fake.ean13()
    }

def generate_mail_service_item():
    # Generate receiver_name
    receiver_name = {
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "mid_name": fake.first_name()
    }
    
    # Generate receiver_address and get its reference
    receiver_address_data = generate_address()
    receiver_address_ref = db.collection("Address").add(receiver_address_data)[1]
    
    # Generate barcode and get its reference
    barcode_data = generate_barcode()
    barcode_ref = db.collection("Barcode").add(barcode_data)[1]
    
    # Generate accepted_recipient and get its reference
    accepted_recipient_data = generate_mail_service_item()
    accepted_recipient_ref = db.collection("MailServiceItem").add(accepted_recipient_data)[1]
    
    return {
        "receiver_name": receiver_name,
        "recerver_address": receiver_address_ref,  # Reference to the Address document
        "barcode": barcode_ref,  # Reference to the Barcode document
        "accepted_recipient": accepted_recipient_ref,  # Reference to the MailServiceItem document
        "timestamp": fake.date_time_this_decade(),
        "status": random.choice(["To be Dispatched", "To be Delivered", "To be Returned", "Out for Delivery", "Delivery Cancelled", "Returned", "Delivered", "Dispatched"]),
        "type": random.choice(["Normal", "Registered", "Parcel", "Return"]),
        "deliveryAttempts": fake.random_int(min=0, max=3)
    }

def generate_return_mail():
    mailID = db.collection("MailServiceItem").add(generate_mail_service_item())[1].id
    return {
        "mailID": mailID
    }

def generate_delivery_attempt():
    mailID = db.collection("MailServiceItem").add(generate_mail_service_item())[1].id
    isDelivered = fake.boolean(chance_of_getting_true=50)
    
    deliveryFailNotice = ""
    if not isDelivered:
        deliveryFailNotice = fake.sentence(nb_words=6, variable_nb_words=True)
    
    return {
        "mailID": mailID,
        "timestamp": fake.date_time_this_decade(),
        "isDelivered": isDelivered,
        "deliveryFailNotice": deliveryFailNotice
    }

def generate_route():
    num_mail_items = 5  # Adjust this number as needed
    mail_item_references = [db.collection("MailServiceItem").add(generate_mail_service_item())[1] for _ in range(num_mail_items)]
    
    return {
        "routes": mail_item_references
    }

# Populate Firestore collections with sample data
num_samples = 10  # Adjust this number as needed

for _ in range(num_samples):
    db.collection("Address").add(generate_address())
    db.collection("Region").add(generate_region())
    db.collection("Postoffice").add(generate_postoffice())
    db.collection("Barcode").add(generate_barcode())
    db.collection("MailServiceItem").add(generate_mail_service_item())
    db.collection("ReturnMail").add(generate_return_mail())
    db.collection("DeliveryAttempt").add(generate_delivery_attempt())

# Example for generating a Route with references to random MailServiceItems
db.collection("Route").add(generate_route())

print("Sample data added to Firestore.")
