import pandas as pd
import json

# Load the Excel file
excel_file = 'sheets/product.xlsx'  # Update this path if necessary

# Read the Excel file into a DataFrame
df = pd.read_excel(excel_file)

# Convert the DataFrame to a list of dictionaries
json_data = df.to_dict(orient='records')

# Specify the output JSON file
json_file = 'output/s-products.json'  # Change this path as needed

# Write the JSON data to a file
with open(json_file, 'w') as f:
    json.dump(json_data, f, indent=4)

print(f"Successfully converted {excel_file} to {json_file}")

excel_file2 = 'sheets/f-products.xlsx'  # Update this path if necessary

# for featured products
# Read the Excel file into a DataFrame
df = pd.read_excel(excel_file2)

# Convert the DataFrame to a list of dictionaries
json_data = df.to_dict(orient='records')

# Specify the output JSON file
json_file = 'output/f-products.json'  # Change this path as needed

# Write the JSON data to a file
with open(json_file, 'w') as f:
    json.dump(json_data, f, indent=4)

print(f"Successfully converted {excel_file2} to {json_file}")
