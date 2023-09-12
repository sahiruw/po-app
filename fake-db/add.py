import firebase_admin
from firebase_admin import credentials, firestore
import random
from faker import Faker

# Initialize Firebase Admin SDK (replace 'serviceAccountKey.json' with your own service account key)
cred = credentials.Certificate('F:\\ReactNativeProjects\\po-app2\\fake-db\\serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Create a Faker instance to generate fake data
fake = Faker()

# Function to generate random latitude and longitude within Galle City, Sri Lanka
def generate_random_location_in_galle():
    latitude = random.uniform(6.027, 6.089)  # Latitude range for Galle City
    longitude = random.uniform(80.193, 80.269)  # Longitude range for Galle City
    return (latitude, longitude)

# Add at least 100 records to the Address collection within Galle City
addresses = []
for _ in range(100):
    address_doc_ref = db.collection("Address").add({
        "HouseNo": fake.building_number(),
        "Address_line_1": fake.street_name(),
        "Address_line_2": fake.secondary_address(),
        "Address_line_3": fake.building_number(),
        "City": "Galle",
        "PostofficeID": "po-1",  # Replace with the actual Postoffice ID if needed
        "RegionID": f"rg{random.randint(1,3)}",  # Replace with the actual Region ID if needed
        "Location": generate_random_location_in_galle(),
    })
    print(address_doc_ref[1].id)
    addresses.append(address_doc_ref[1].id)



# Sample data for Region collection
regions = [
    {"name": "Region 1", "postoffice_id": "po-1"},
    {"name": "Region 2", "postoffice_id": "po-1"},
    {"name": "Region 3", "postoffice_id": "po-1"},
    {"name": "Region 4", "postoffice_id": "po-1"},
]

for i, region in enumerate(regions, start=1):
    db.collection("Region").document("rg" + str(i)).set(region)

# Sample data for Barcode collection
barcodes = [{"barcode": fake.uuid4()} for _ in range(10)]

for i, barcode in enumerate(barcodes, start=1):
    db.collection("Barcode").document("bc" + str(i)).set(barcode)

# Sample data for MailServiceItem collection
print("Adding sample data to MailServiceItem collection...")
mail_service_items = []
for _ in range(100):
    random_address_id = random.choice(addresses)
    toap = {
        "receiver_name": {
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "mid_name": fake.first_name_male(),
        },
        "receiver_address_id": random_address_id,  # Use a randomly selected address ID from the added addresses
        "barcode_id": f"bc{random.randint(1, 10)}",  # Randomly select a barcode ID
        "accepted_reciptionist_id": random.choice(["6bcQLBF3JGb8VsZBfa6DgRdOIig2","x0gG68V436RL7PnhfMWYJmZNubi2"]),  # Replace with the actual recipient ID if needed
        "timestamp": fake.date_time_between(start_date="-1y", end_date="now", tzinfo=None),
        "status": random.choice(["To be Dispatched", "To be Delivered", "To be Returned",
                                 "Out for Delivery", "Delivery Cancelled", "Returned", "Delivered", "Dispatched"]),
        "type": random.choice(["Normal", "Registered", "Parcel", "Return"]),
        "deliveryAttempts": random.randint(0, 3),
    }
    if toap["type"] !=  "Normal":
        toap["sender_name"] = {
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "mid_name": fake.first_name_male(),
        }
        toap["sender_address_id"] = random.choice(addresses)
    
    mail_doc_ref = db.collection("MailServiceItem").add(toap)
    mail_service_items.append(mail_doc_ref[1].id)

print(mail_service_items)
print("Sample data added to Firestore collections.")
