from http.server import BaseHTTPRequestHandler, HTTPServer

class HelloWorldHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Send a 200 OK response
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        # Send the response body
        self.wfile.write(b"Hello, World!")

def run(server_class=HTTPServer, handler_class=HelloWorldHandler, port=5000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting http server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
