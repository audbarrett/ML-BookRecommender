#imports
from flask import Flask, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import urllib.parse


app = Flask(__name__)
CORS(app)

model_path = 'model.pkl'

model = joblib.load(model_path,mmap_mode='r')

data_path = 'cleaned_data.csv'

data = pd.read_csv(data_path)

@app.route('/recs/<title>')
def  reccomendations(title):
    title = urllib.parse.unquote(title)
    print(title)
    input_book = data[data['title']==title]
    if input_book.empty:
        return jsonify({'error': title}), 404
    input_features = input_book[['average_rating','  num_pages']].values
    _, indices = model.kneighbors(input_features)
    neighbor_titles = data.iloc[indices[0]]['title']
    neighbor_titles = neighbor_titles[neighbor_titles != title]
    if neighbor_titles.empty:
        return jsonify({'error':'No recommendations found'}), 404
    return jsonify({'recommendations':neighbor_titles.to_list()}), 200

@app.route('/titles')
def get_titles():
    return jsonify({'titles':data['title'].tolist()}), 200

if __name__ == '__main__':
    app.run(debug=True)