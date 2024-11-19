from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello Cluster admins'

# Route qui renvoie une opération addition
@app.route('/api/addition')
def get_addition():
    a = int(request.args.get('a', 0))
    b = int(request.args.get('b', 0))
    result = a + b
    return jsonify({'result': result})

# # Route qui renvoie une opération soustraction
# @app.route('/api/soustraction')
# def get_soustraction():
#     result = 8 - 7  
#     return jsonify({'result': result})

# # Route qui renvoie une opération multiplication
# @app.route('/api/multiplication')
# def get_multiplication():
#     result = 8 * 7  
#     return jsonify({'result': result})

# # Route qui renvoie une opération division
# @app.route('/api/division')
# def get_division():
#     result = 8 / 7  
#     return jsonify({'result': result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
