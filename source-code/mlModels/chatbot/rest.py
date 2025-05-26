from flask import Flask, request, jsonify
from flask_cors import CORS 
from chat import get_response
from main import classify_sentence

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json()
#     text = data.get('message')
#     TODO: check if text is valid
#     response = get_response(text)
#     message = {"answer": response}
#     return jsonify(message)


@app.route('/classify', methods=['POST'])
def classify():
    data = request.json
    sentence = data['message']
    result = classify_sentence(sentence)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, port=8080)




