"""EchoTwin — Python session ledger backed by SQLite.

GET  /api/history  -> { count, items: [...latest 25], engine }
POST /api/history  -> stores one translation record
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import sqlite3
import time

DB_PATH = os.path.join("/tmp", "echotwin.db")


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            mode TEXT,
            src_lang TEXT,
            tgt_lang TEXT,
            source TEXT,
            translated TEXT,
            confidence REAL,
            latency INTEGER,
            speaker TEXT,
            created_at INTEGER
        )"""
    )
    return conn


class handler(BaseHTTPRequestHandler):
    def _send(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send(204, {})

    def do_GET(self):
        conn = connect()
        try:
            count = conn.execute("SELECT COUNT(*) FROM sessions").fetchone()[0]
            rows = conn.execute(
                "SELECT id, mode, src_lang, tgt_lang, source, translated, confidence, latency, speaker, created_at "
                "FROM sessions ORDER BY created_at DESC LIMIT 25"
            ).fetchall()
            keys = ["id", "mode", "from", "to", "source", "translated", "confidence", "latency", "speaker", "createdAt"]
            items = [dict(zip(keys, r)) for r in rows]
            self._send(200, {"count": count, "items": items, "engine": "Python · SQLite"})
        finally:
            conn.close()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            data = json.loads(self.rfile.read(length) or b"{}")
            if not data.get("source") or not data.get("translated"):
                return self._send(400, {"error": "source and translated are required"})
            conn = connect()
            try:
                conn.execute(
                    "INSERT OR REPLACE INTO sessions VALUES (?,?,?,?,?,?,?,?,?,?)",
                    (
                        str(data.get("id") or time.time_ns()),
                        str(data.get("mode", "studio"))[:20],
                        str(data.get("from", ""))[:10],
                        str(data.get("to", ""))[:10],
                        str(data["source"])[:4000],
                        str(data["translated"])[:4000],
                        float(data.get("confidence") or 0),
                        int(data.get("latency") or 0),
                        data.get("speaker"),
                        int(data.get("createdAt") or time.time() * 1000),
                    ),
                )
                conn.commit()
                count = conn.execute("SELECT COUNT(*) FROM sessions").fetchone()[0]
            finally:
                conn.close()
            self._send(201, {"ok": True, "count": count})
        except Exception as exc:  # noqa: BLE001
            self._send(500, {"error": str(exc)})
