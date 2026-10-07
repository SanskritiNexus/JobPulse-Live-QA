import os
import json
import uuid
from datetime import datetime, timezone
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

from providers import get_job_provider
from cache import MemoryCache

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

# Initialize Cache (Default 5 mins TTL)
cache_ttl = int(os.getenv("CACHE_TTL_SECONDS", "300"))
cache = MemoryCache(default_ttl=cache_ttl)

# Application Data Persistence File
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DATA_FILE = os.path.join(DATA_DIR, "applications.json")

def ensure_data_file():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DATA_FILE):
        default_apps = [
            {
                "id": "app-001",
                "job_id": "adz-in-001",
                "title": "Senior Full Stack Engineer",
                "company": "Swiggy",
                "location": "Bengaluru, India",
                "stage": "Interviewing",
                "source_url": "https://careers.swiggy.com/",
                "source_name": "Adzuna Demo / Swiggy Careers",
                "salary": "₹24,00,000 / year",
                "applied_date": "2026-09-28",
                "notes": "Completed technical round 1 on system design. Next HR interview scheduled.",
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "app-002",
                "job_id": "adz-in-003",
                "title": "Frontend Lead Engineer",
                "company": "Razorpay",
                "location": "Bengaluru, India",
                "stage": "Applied",
                "source_url": "https://razorpay.com/jobs/",
                "source_name": "Adzuna Demo / Razorpay Careers",
                "salary": "₹28,00,000 / year",
                "applied_date": "2026-10-02",
                "notes": "Submitted application via official portal with updated portfolio.",
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "app-003",
                "job_id": "adz-in-004",
                "title": "Data Engineer",
                "company": "Zomato",
                "location": "Gurugram, India",
                "stage": "Offer",
                "source_url": "https://www.zomato.com/careers",
                "source_name": "Adzuna Demo / Zomato Careers",
                "salary": "₹22,00,000 / year",
                "applied_date": "2026-09-15",
                "notes": "Received formal offer letter. Negotiating joining bonus.",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(default_apps, f, indent=2)

ensure_data_file()

def load_applications():
    ensure_data_file()
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_applications(apps):
    ensure_data_file()
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(apps, f, indent=2)


# =====================================================================
# ROUTES & API ENDPOINTS
# =====================================================================

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/provider/status", methods=["GET"])
def provider_status():
    provider = get_job_provider()
    return jsonify({
        "provider_id": provider.provider_id,
        "provider_name": provider.provider_name,
        "is_configured": provider.is_configured(),
        "cache_ttl_seconds": cache_ttl,
        "active_env_provider": os.getenv("JOB_API_PROVIDER", "adzuna")
    })


@app.route("/api/jobs/search", methods=["GET"])
def search_jobs():
    query = request.args.get("q", "").strip()
    location = request.args.get("location", "").strip()
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    category = request.args.get("category", "").strip() or None
    job_type = request.args.get("job_type", "").strip() or None
    sort_by = request.args.get("sort_by", "date").strip()
    bypass_cache = request.args.get("nocache", "false").lower() == "true"

    cache_key = f"jobs:{query}:{location}:{page}:{limit}:{category}:{job_type}:{sort_by}"

    if not bypass_cache:
        cached_result = cache.get(cache_key)
        if cached_result:
            cached_result["from_cache"] = True
            return jsonify(cached_result)

    provider = get_job_provider()
    res = provider.search_jobs(
        query=query,
        location=location,
        page=page,
        limit=limit,
        category=category,
        job_type=job_type,
        sort_by=sort_by
    )

    res["from_cache"] = False
    if not res.get("error"):
        cache.set(cache_key, res)

    return jsonify(res)


# Application Tracker CRUD Endpoints

@app.route("/api/applications", methods=["GET"])
def get_user_applications():
    apps = load_applications()
    return jsonify({"success": True, "count": len(apps), "applications": apps})


@app.route("/api/applications", methods=["POST"])
def create_application():
    data = request.json or {}
    if not data.get("title") or not data.get("company"):
        return jsonify({"success": False, "error": "Title and Company are required fields."}), 400

    apps = load_applications()

    # Check if job already saved to prevent duplicates
    job_id = data.get("job_id")
    if job_id and any(a.get("job_id") == job_id for a in apps):
        return jsonify({"success": False, "error": "This job listing is already in your application tracker."}), 409

    new_app = {
        "id": f"app-{uuid.uuid4().hex[:8]}",
        "job_id": job_id or None,
        "title": data.get("title").strip(),
        "company": data.get("company").strip(),
        "location": data.get("location", "India").strip(),
        "stage": data.get("stage", "Wishlist").strip(),
        "source_url": data.get("source_url", "#").strip(),
        "source_name": data.get("source_name", "Live Job API").strip(),
        "salary": data.get("salary", "").strip() or "Not Specified",
        "applied_date": data.get("applied_date", datetime.now(timezone.utc).strftime("%Y-%m-%d")),
        "notes": data.get("notes", "").strip(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

    apps.insert(0, new_app)
    save_applications(apps)
    return jsonify({"success": True, "application": new_app})


@app.route("/api/applications/<app_id>", methods=["PUT"])
def update_application(app_id):
    data = request.json or {}
    apps = load_applications()
    target_idx = next((i for i, a in enumerate(apps) if a["id"] == app_id), None)

    if target_idx is None:
        return jsonify({"success": False, "error": "Application not found."}), 404

    target = apps[target_idx]
    if "stage" in data:
        target["stage"] = data["stage"]
    if "notes" in data:
        target["notes"] = data["notes"]
    if "salary" in data:
        target["salary"] = data["salary"]
    if "applied_date" in data:
        target["applied_date"] = data["applied_date"]
    if "title" in data:
        target["title"] = data["title"]
    if "company" in data:
        target["company"] = data["company"]
    if "location" in data:
        target["location"] = data["location"]

    target["updated_at"] = datetime.now(timezone.utc).isoformat()
    apps[target_idx] = target
    save_applications(apps)
    return jsonify({"success": True, "application": target})


@app.route("/api/applications/<app_id>", methods=["DELETE"])
def delete_application(app_id):
    apps = load_applications()
    new_apps = [a for a in apps if a["id"] != app_id]

    if len(new_apps) == len(apps):
        return jsonify({"success": False, "error": "Application not found."}), 404

    save_applications(new_apps)
    return jsonify({"success": True, "message": "Application removed successfully."})


@app.route("/api/analytics", methods=["GET"])
def get_analytics():
    apps = load_applications()
    total = len(apps)
    stages = {"Wishlist": 0, "Applied": 0, "Interviewing": 0, "Offer": 0, "Rejected": 0}
    companies = set()

    for a in apps:
        st = a.get("stage", "Wishlist")
        stages[st] = stages.get(st, 0) + 1
        if a.get("company"):
            companies.add(a["company"].strip())

    applied_count = stages.get("Applied", 0) + stages.get("Interviewing", 0) + stages.get("Offer", 0) + stages.get("Rejected", 0)
    interview_count = stages.get("Interviewing", 0) + stages.get("Offer", 0)
    response_rate = round((interview_count / applied_count * 100), 1) if applied_count > 0 else 0

    return jsonify({
        "total_tracked": total,
        "total_companies": len(companies),
        "response_rate_pct": response_rate,
        "stages_breakdown": stages,
        "offer_count": stages.get("Offer", 0),
        "interview_count": stages.get("Interviewing", 0)
    })


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "127.0.0.1")
    print(f"Starting Live Job Tracker Server on http://{host}:{port}")
    app.run(host=host, port=port, debug=True)

