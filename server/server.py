import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler, SimpleHTTPRequestHandler
import os
import json


class Handler(SimpleHTTPRequestHandler):
    """This handler uses server.base_path instead of always using os.getcwd()"""
    def translate_path(self, path):
        path = SimpleHTTPRequestHandler.translate_path(self, path)
        relpath = os.path.relpath(path, os.getcwd())
        fullpath = os.path.join(self.server.base_path, relpath)
        return fullpath

    def do_POST(self):
        content_len = int(self.headers['Content-Length'])
        post_body = self.rfile.read(content_len)
        post_data = json.loads(post_body)
        id = post_data['id']
        with open('../tracks/{}.json'.format(id), 'w') as outfile:
            json.dump(post_data, outfile)
        self.send_response(200, "ok")
        self.end_headers()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super(Handler, self).end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


class Server(HTTPServer):
    """The main server, you pass in base_path which is the path you want to serve requests from"""
    def __init__(self, base_path, out_path, server_address, RequestHandlerClass=Handler):
        self.base_path = base_path
        self.out_path = out_path
        HTTPServer.__init__(self, server_address, RequestHandlerClass)


def run(server_class=Server, handler_class=Handler, addr="localhost", port=8000):
    web_dir = os.path.join(os.path.dirname(__file__), '../build')
    os.chdir(web_dir)

    tracks_dir = os.path.join(os.path.dirname(__file__), '../tracks')
    if not os.path.exists(tracks_dir):
        os.makedirs(tracks_dir)

    server_address = (addr, port)

    httpd = server_class(web_dir, tracks_dir, server_address, handler_class)

    print("Starting httpd server on {}:{}".format(addr, port))
    httpd.serve_forever()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run a simple HTTP server")
    parser.add_argument(
        "-a",
        "--address",
        default="localhost",
        help="Specify the IP address on which the server listens",
    )
    parser.add_argument(
        "-p",
        "--port",
        type=int,
        default=8000,
        help="Specify the port on which the server listens",
    )
    args = parser.parse_args()
    run(addr=args.address, port=args.port)

