import json
import numpy as np
import tensorflow as tf
import random
import nltk
from nltk.stem import WordNetLemmatizer

# Load model đã train
model = tf.keras.models.load_model("chatbot_model.h5")

# Load dataset
with open("dataset.json", encoding="utf-8") as file:
    data = json.load(file)

# Khởi tạo xử lý văn bản
lemmatizer = WordNetLemmatizer()

# Chuẩn bị từ vựng
words = []
classes = []
documents = []
ignore_words = ["?", "!", ".", ","]

for intent in data["intents"]:
    for pattern in intent["patterns"]:
        word_list = nltk.word_tokenize(pattern.lower())
        words.extend(word_list)
        documents.append((word_list, intent["tag"]))
        if intent["tag"] not in classes:
            classes.append(intent["tag"])

words = [lemmatizer.lemmatize(w) for w in words if w not in ignore_words]
words = sorted(set(words))
classes = sorted(set(classes))

# Hàm xử lý câu hỏi
def bag_of_words(sentence):
    sentence_words = nltk.word_tokenize(sentence.lower())
    sentence_words = [lemmatizer.lemmatize(w) for w in sentence_words]
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array([bag])

# Hàm chatbot trả lời
def chatbot_response(text):
    bow = bag_of_words(text)
    result = model.predict(bow)[0]
    idx = np.argmax(result)
    tag = classes[idx]

    for intent in data["intents"]:
        if intent["tag"] == tag:
            return random.choice(intent["responses"])

# Chạy chatbot
print("Chatbot sẵn sàng! Nhập 'exit' để thoát.")
while True:
    user_input = input("Bạn: ")
    if user_input.lower() == "exit":
        break
    response = chatbot_response(user_input)
    print("Bot:", response)
