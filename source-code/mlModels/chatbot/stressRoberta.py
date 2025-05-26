import torch, os
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from torch.utils.data import Dataset
from torch import cuda
from transformers import Trainer, TrainingArguments
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from pathlib import Path

# Model Selection (choose one)
MODEL_NAME = 'xlnet-base-cased'  # Options below
# 1. BERT models: 'bert-base-uncased', 'bert-base-cased'
# 2. RoBERTa models: 'roberta-base', 'roberta-large'
# 3. DistilBERT: 'distilbert-base-uncased', 'distilbert-base-cased'
# 4. XLNet: 'xlnet-base-cased'

device = 'cuda' if cuda.is_available() else 'cpu'
script_dir = Path(__file__).parent

df_org = pd.read_csv(script_dir / 'dataset.csv')
labels = df_org['category'].unique().tolist()
labels = [s.strip() for s in labels]
NUM_LABELS = len(labels)

# Mapping labels to ids
id2label = {i: label for i, label in enumerate(labels)}
label2id = {label: i for i, label in enumerate(labels)}
df_org['labels'] = df_org.category.map(lambda x: label2id[x.strip()])

# Select appropriate tokenizer and model based on MODEL_NAME
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, max_length=512)
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME, 
    num_labels=NUM_LABELS,
    id2label=id2label, 
    label2id=label2id
)
model.to(device)

# Rest of the code remains the same
SIZE = df_org.shape[0]
train_texts = list(df_org.text[:int(SIZE//2)])
val_texts = list(df_org.text[int(SIZE//2):(3*SIZE)//4])
test_texts = list(df_org.text[(3*SIZE)//4:])
train_labels = list(df_org.labels[:int(SIZE//2)])
val_labels = list(df_org.labels[int(SIZE//2):(3*SIZE)//4])
test_labels = list(df_org.labels[(3*SIZE)//4:])

# Tokenization
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
    output_dir='./results',          
    do_train=True,
    do_eval=True,
    num_train_epochs=20,              
    per_device_train_batch_size=8,  
    per_device_eval_batch_size=8,   
    warmup_steps=10,                
    weight_decay=0.01,               
    logging_strategy='steps',        
    logging_dir='./logs',            
    logging_steps=5,
    evaluation_strategy='steps',     
    eval_steps=5,                   
    save_strategy='steps',           
    fp16=False,                      
    load_best_model_at_end=True,     
)

trainer = Trainer(
    model=model,                         
    args=training_args,                  
    train_dataset=train_dataloader,         
    eval_dataset=val_dataloader,             
    compute_metrics=compute_metrics
)

trainer.train()

def predict(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    outputs = model(**inputs)
    probs = outputs[0].softmax(dim=1)
    pred_label_idx = probs.argmax()

    pred_label = model.config.id2label[pred_label_idx.item()]
    return probs, pred_label_idx, pred_label

model_path = script_dir / 'trained-stress-model'
trainer.save_model(model_path)
tokenizer.save_pretrained(model_path)