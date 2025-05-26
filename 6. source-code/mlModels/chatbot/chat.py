import random
import json
import torch
from pathlib import Path

from model import NeuralNet
from nltk_utils import bag_of_words, tokenize

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
script_dir = Path(__file__).parent

intents_path = script_dir / 'intents.json'

with open(intents_path, 'r') as json_data:
    intents = json.load(json_data)

FILE = script_dir / 'data.pth'
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

bot_name = "sam"


def get_response(input_sentence):
    # Encode user input
    sentence = tokenize(input_sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    # If predicted tag has high confidence, select a random response from intents
    if prob.item() > 0.75:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                return random.choice(intent['responses'])
    else:
        # If confidence is low, generate a generic response
        return "I'm not sure how to respond to that."


if __name__ == "__main__":
    print("Let's chat! (type 'quit' to exit)")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "quit":
            break

        response = get_response(user_input)
        print(f"{bot_name}: {response}")