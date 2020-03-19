import os
import json

''' This is a small throw away script used in development to remove duplicates and sort the names '''

file = os.path.join(os.path.dirname(__file__), "words.json")

data = None
with open(file) as f:
  data = json.load(f)
  
  unique_data = set(data)
  sorted_unique_data = sorted(list(unique_data))
  capitalized_data = [x.title() for x in sorted_unique_data]

duplicates_removed = len(data) - len(unique_data)
print(f"Total result: {len(capitalized_data)}")
print(f"Removed {duplicates_removed} duplicates")

with open(file, "w") as f:
    json.dump(capitalized_data, f)
