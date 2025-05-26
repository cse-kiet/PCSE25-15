import torch, os
import pandas as pd
from transformers import pipeline, BertTokenizerFast, BertForSequenceClassification
from torch.utils.data import Dataset
from torch import cuda
from transformers import Trainer, TrainingArguments
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
hf_token = os.getenv("HF_TOKEN")
os.environ["HF_TOKEN"] = hf_token


device = 'cuda' if cuda.is_available() else 'cpu'
script_dir = Path(__file__).parent

df_org = pd.read_csv(script_dir / 'dataset.csv')
labels = df_org['category'].unique().tolist()
labels = [s.strip() for s in labels]
NUM_LABELS = len(labels)

id2label = {i: label for i, label in enumerate(labels)}
label2id = {label: i for i, label in enumerate(labels)}
df_org['labels'] = df_org.category.map(lambda x: label2id[x.strip()])
# Set Hugging Face token as a Colab secret
tokenizer = BertTokenizerFast.from_pretrained('google-bert/bert-base-uncased', max_length=512)

model = BertForSequenceClassification.from_pretrained('google-bert/bert-base-uncased', num_labels=NUM_LABELS,id2label = id2label, label2id = label2id)
model.to(device)

SIZE = df_org.shape[0]
train_texts = list(df_org.text[:int(SIZE//2)])
val_texts = list(df_org.text[int(SIZE//2):(3*SIZE)//4])
test_texts = list(df_org.text[(3*SIZE)//4:])
train_labels = list(df_org.labels[:int(SIZE//2)])
val_labels = list(df_org.labels[int(SIZE//2):(3*SIZE)//4])
test_labels = list(df_org.labels[(3*SIZE)//4:])
len(train_texts), len(val_texts), len(test_texts)

train_encodings = tokenizer(train_texts, truncation=True, padding=True)
val_encodings = tokenizer(val_texts, truncation=True, padding=True)
test_encodings = tokenizer(test_texts, truncation=True, padding=True)

class DataLoader(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)
    
train_dataloader = DataLoader(train_encodings, train_labels)
val_dataloader = DataLoader(val_encodings, val_labels)
test_dataloader = DataLoader(test_encodings, test_labels)

def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='macro')
    acc = accuracy_score(labels, preds)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }

training_args = TrainingArguments(
    output_dir='./results',          # output directory
    do_train=True,
    do_eval=True,

    num_train_epochs=20,              # total number of training epochs
    per_device_train_batch_size=8,  # batch size per device during training
    per_device_eval_batch_size=8,   # batch size for evaluation

    warmup_steps=10,                # number of warmup steps for learning rate scheduler
    weight_decay=0.01,               # strength of weight decay
    logging_strategy='steps',        # log every 100 steps

    logging_dir='./logs',            # directory for storing logs
    logging_steps=5,
    evaluation_strategy='steps',     # evaluate every 100 steps
    eval_steps=5,                   # number of update steps before evaluation
    save_strategy='steps',           # save a checkpoint every 500 steps
    fp16=False,                      # Use mixed precision
    load_best_model_at_end=True,     # load the best model when finished training (default metric is loss)
)

trainer = Trainer(
    model=model,                         # the instantiated 🤗 Transformers model to be trained
    args=training_args,                  # training arguments, defined above
    train_dataset=train_dataloader,         # training dataset
    eval_dataset=val_dataloader,             # evaluation dataset
    compute_metrics=compute_metrics
)

trainer.train()

def predict(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    # inputs = {name: tensor.to(device) for name, tensor in inputs.items()}
    outputs = model(**inputs)
    probs = outputs[0].softmax(dim=1)
    pred_label_idx = probs.argmax()

    pred_label = model.config.id2label[pred_label_idx.item()]
    return probs, pred_label_idx, pred_label

model_path = script_dir / 'trained-stress-model'
trainer.save_model(model_path)
tokenizer.save_pretrained(model_path)