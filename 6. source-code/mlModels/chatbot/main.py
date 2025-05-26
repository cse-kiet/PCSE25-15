from transformers import BertForSequenceClassification, BertTokenizerFast, pipeline
from pathlib import Path

# Define the path where the model and tokenizer were saved
script_dir = Path(__file__).parent
model_path = script_dir / 'trained-stress-model'

# Load the model
model = BertForSequenceClassification.from_pretrained(model_path)

# Load the tokenizer
tokenizer = BertTokenizerFast.from_pretrained(model_path)


# Create a text classification pipeline
nlp = pipeline('text-classification', model=model, tokenizer=tokenizer)


def classify_sentence(sentence):
    # Perform classification
    result = nlp(sentence)
    return result[0]
