#!/bin/bash
# Starts a small local web server for the slides and opens them in the browser.
# (Opening index.html directly works too, but YouTube only plays inside the page when it is served over http.)
cd "$(dirname "$0")"
python3 -u - <<'EOF'
import http.server, socketserver, webbrowser, threading, socket
s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', port), Q)
threading.Timer(0.6, lambda: webbrowser.open('http://127.0.0.1:%d/' % port)).start()
print('Marika Hirata — Works: http://127.0.0.1:%d/  (このウインドウを閉じると終了します)' % port, flush=True)
try: srv.serve_forever()
except KeyboardInterrupt: pass
EOF
