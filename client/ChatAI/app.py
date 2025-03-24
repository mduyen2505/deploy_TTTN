from flask import Flask, request, jsonify, render_template
import json
import numpy as np
import tensorflow as tf
import nltk
from nltk.stem import WordNetLemmatizer
from flask_cors import CORS

nltk.download("punkt")
nltk.download("wordnet")

app = Flask(__name__)
CORS(app) 

# Load model đã train
model = tf.keras.models.load_model("chatbot_model.h5")

# Load dataset
with open("dataset.json", encoding="utf-8") as file:
    data = json.load(file)

# Xử lý văn bản
lemmatizer = WordNetLemmatizer()
words = []
classes = []
ignore_words = ["?", "!", ".", ","]

for intent in data["intents"]:
    for pattern in intent["patterns"]:
        word_list = nltk.word_tokenize(pattern.lower())
        words.extend(word_list)
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
            return np.random.choice(intent["responses"])

# API nhận tin nhắn từ client
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")
    response = chatbot_response(user_input)
    return jsonify({"response": response})

@app.route("/")
def home():
    return render_template("index.html")

# Chạy server Flask
if __name__ == "__main__":
    app.run(debug=True)
