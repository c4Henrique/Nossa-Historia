from flask import Flask, request, jsonify
import sqlite3
import os

app = Flask(__name__)
DATABASE = 'database.db'

def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    with app.app_context():
        db = get_db()
        # Create tables for love letters, date ideas, and videos
        db.execute('''
            CREATE TABLE IF NOT EXISTS love_letters (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL
            );
        ''')
        db.execute('''
            CREATE TABLE IF NOT EXISTS date_ideas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                idea TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0
            );
        ''')
        db.execute('''
            CREATE TABLE IF NOT EXISTS videos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                type TEXT NOT NULL,
                src TEXT NOT NULL
            );
        ''')
        db.commit()

# Initialize the database on first run
if not os.path.exists(DATABASE):
    init_db()

# API Endpoints for Love Letters
@app.route('/api/love-letters', methods=['GET', 'POST'])
def love_letters():
    db = get_db()
    if request.method == 'GET':
        letters = db.execute('SELECT * FROM love_letters').fetchall()
        return jsonify([dict(l) for l in letters])
    elif request.method == 'POST':
        data = request.json
        title = data['title']
        content = data['content']
        db.execute('INSERT INTO love_letters (title, content) VALUES (?, ?)', (title, content))
        db.commit()
        return jsonify({'message': 'Letter added'}), 201

@app.route('/api/love-letters/<int:letter_id>', methods=['DELETE'])
def delete_love_letter(letter_id):
    db = get_db()
    db.execute('DELETE FROM love_letters WHERE id = ?', (letter_id,))
    db.commit()
    return jsonify({'message': 'Letter deleted'})

# API Endpoints for Date Ideas
@app.route('/api/date-ideas', methods=['GET', 'POST'])
def date_ideas():
    db = get_db()
    if request.method == 'GET':
        ideas = db.execute('SELECT * FROM date_ideas').fetchall()
        return jsonify([dict(i) for i in ideas])
    elif request.method == 'POST':
        data = request.json
        idea = data['idea']
        db.execute('INSERT INTO date_ideas (idea) VALUES (?)', (idea,))
        db.commit()
        return jsonify({'message': 'Date idea added'}), 201

@app.route('/api/date-ideas/<int:idea_id>', methods=['PUT', 'DELETE'])
def manage_date_idea(idea_id):
    db = get_db()
    if request.method == 'PUT':
        data = request.json
        completed = data['completed']
        db.execute('UPDATE date_ideas SET completed = ? WHERE id = ?', (completed, idea_id))
        db.commit()
        return jsonify({'message': 'Date idea updated'})
    elif request.method == 'DELETE':
        db.execute('DELETE FROM date_ideas WHERE id = ?', (idea_id,))
        db.commit()
        return jsonify({'message': 'Date idea deleted'})

# API Endpoints for Videos
@app.route('/api/videos', methods=['GET', 'POST'])
def videos():
    db = get_db()
    if request.method == 'GET':
        videos = db.execute('SELECT * FROM videos').fetchall()
        return jsonify([dict(v) for v in videos])
    elif request.method == 'POST':
        data = request.json
        title = data['title']
        type = data['type']
        src = data['src']
        db.execute('INSERT INTO videos (title, type, src) VALUES (?, ?, ?)', (title, type, src))
        db.commit()
        return jsonify({'message': 'Video added'}), 201

@app.route('/api/videos/<int:video_id>', methods=['DELETE'])
def delete_video(video_id):
    db = get_db()
    db.execute('DELETE FROM videos WHERE id = ?', (video_id,))
    db.commit()
    return jsonify({'message': 'Video deleted'})

if __name__ == '__main__':
    init_db()
    app.run(debug=True) 