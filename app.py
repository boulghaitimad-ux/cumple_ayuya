from flask import Flask, render_template, send_from_directory
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__)

@app.get("/")
def index():
    return render_template("index.html")

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    # Local development only. To make it available online, deploy it deliberately.
    app.run(host="127.0.0.1", port=5000, debug=False)
