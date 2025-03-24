import json
import numpy as np
import random
import tensorflow as tf
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout

# Khởi tạo lemmatizer để xử lý từ
lemmatizer = WordNetLemmatizer()

# Đọc dữ liệu từ file dataset.json
with open("dataset.json", encoding="utf-8") as file:
    data = json.load(file)

# Khai báo danh sách chứa dữ liệu
words = []
classes = []
documents = []
ignore_words = ["?", "!", ".", ","]

# Xử lý dữ liệu
for intent in data["intents"]:
    for pattern in intent["patterns"]:
        word_list = nltk.word_tokenize(pattern.lower())  # Tokenize
        words.extend(word_list)
        documents.append((word_list, intent["tag"]))
        if intent["tag"] not in classes:
            classes.append(intent["tag"])

# Lemmatization & Loại bỏ stopwords
words = [lemmatizer.lemmatize(w) for w in words if w not in ignore_words]
words = sorted(set(words))
classes = sorted(set(classes))

# Chuẩn bị dữ liệu train
training = []
output_empty = [0] * len(classes)

for doc in documents:
    bag = []
    word_patterns = doc[0]
    word_patterns = [lemmatizer.lemmatize(w.lower()) for w in word_patterns]
    
    for w in words:
        bag.append(1) if w in word_patterns else bag.append(0)
    
    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1
    training.append([bag, output_row])

# Chuyển đổi sang numpy array
random.shuffle(training)
training = np.array(training, dtype=object)
train_x = np.array(list(training[:, 0]))
train_y = np.array(list(training[:, 1]))

# Xây dựng mô hình Neural Network
model = Sequential([
    Dense(128, input_shape=(len(train_x[0]),), activation="relu"),
    Dropout(0.5),
    Dense(64, activation="relu"),
    Dropout(0.5),
    Dense(len(classes), activation="softmax")
])

# Compile mô hình
model.compile(loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"])

# Train model
model.fit(train_x, train_y, epochs=200, batch_size=5, verbose=1)

# Lưu mô hình
model.save("chatbot_model.h5")
print("Model đã được lưu thành công!")
