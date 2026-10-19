from flask import Flask, render_template, request, jsonify
from collections import deque

app = Flask(__name__)

# Real-time Social Network Graph Architecture (Adjacency List)
social_graph = {
    'Alice': ['Bob', 'Charlie'],
    'Bob': ['Alice', 'Charlie', 'David'],
    'Charlie': ['Alice', 'Bob', 'David', 'Eve'],
    'David': ['Bob', 'Charlie', 'Eve', 'Frank'],
    'Eve': ['Charlie', 'David', 'Frank'],
    'Frank': ['David', 'Eve']
}

# DAA Algorithmic Logic: BFS Shortest Path Execution Engine
def bfs_shortest_path(graph, start, end):
    if start not in graph or end not in graph:
        return None
    if start == end:
        return [start]
        
    queue = deque([(start, [start])])
    visited = {start}
    
    while queue:
        node, path = queue.popleft()
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                if neighbor == end:
                    return path + [neighbor]
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/find-path', methods=['POST'])
def find_path():
    data = request.json or {}
    start_user = data.get('start')
    end_user = data.get('end')
    
    path = bfs_shortest_path(social_graph, start_user, end_user)
    
    if path:
        return jsonify({'success': True, 'path': path, 'distance': len(path) - 1})
    else:
        return jsonify({'success': False, 'message': 'No optimal connection path found!'})

if __name__ == '__main__':
    app.run(debug=True)
