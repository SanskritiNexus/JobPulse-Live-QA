import os
import requests
from datetime import datetime, timezone
from .base import JobProvider

class AdzunaJobProvider(JobProvider):
    def __init__(self):
        self.app_id = os.getenv("ADZUNA_APP_ID", "").strip()
        self.app_key = os.getenv("ADZUNA_APP_KEY", "").strip()
        self.country = os.getenv("ADZUNA_COUNTRY", "in").strip().lower()
        self.base_url = f"https://api.adzuna.com/v1/api/jobs/{self.country}/search"

    @property
    def provider_id(self) -> str:
        return "adzuna"

    @property
    def provider_name(self) -> str:
        return f"Adzuna API ({self.country.upper()})"

    def is_configured(self) -> bool:
        return bool(self.app_id and self.app_key)

    def search_jobs(self, query: str = "", location: str = "", page: int = 1, limit: int = 10, category: str = None, job_type: str = None, sort_by: str = "date") -> dict:
        if not self.is_configured():
            return {
                "provider": self.provider_id,
                "provider_name": self.provider_name,
                "is_configured": False,
                "total_results": 0,
                "page": page,
                "limit": limit,
                "query": query,
                "location": location,
                "fetched_at": datetime.now(timezone.utc).isoformat(),
                "results": [],
                "error": "Adzuna API credentials (ADZUNA_APP_ID / ADZUNA_APP_KEY) are not configured in environment variables."
            }

        url = f"{self.base_url}/{page}"
        params = {
            "app_id": self.app_id,
            "app_key": self.app_key,
            "results_per_page": min(limit, 50),
            "content-type": "application/json"
        }

        if query:
            params["what"] = query
        if location:
            params["where"] = location
        if sort_by == "date":
            params["sort_by"] = "date"
        elif sort_by == "salary":
            params["sort_by"] = "salary"

        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 401 or response.status_code == 403:
                return {
                    "provider": self.provider_id,
                    "provider_name": self.provider_name,
                    "is_configured": True,
                    "total_results": 0,
                    "page": page,
                    "limit": limit,
                    "query": query,
                    "location": location,
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                    "results": [],
                    "error": f"Adzuna API authentication failed (HTTP {response.status_code}). Please verify your ADZUNA_APP_ID and ADZUNA_APP_KEY in .env."
                }
            elif response.status_code == 429:
                return {
                    "provider": self.provider_id,
                    "provider_name": self.provider_name,
                    "is_configured": True,
                    "total_results": 0,
                    "page": page,
                    "limit": limit,
                    "query": query,
                    "location": location,
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                    "results": [],
                    "error": "Adzuna API rate limit exceeded (HTTP 429). Please wait a few moments before searching again."
                }
            elif response.status_code != 200:
                return {
                    "provider": self.provider_id,
                    "provider_name": self.provider_name,
                    "is_configured": True,
                    "total_results": 0,
                    "page": page,
                    "limit": limit,
                    "query": query,
                    "location": location,
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                    "results": [],
                    "error": f"Adzuna API error: HTTP {response.status_code} - {response.text[:200]}"
                }

            data = response.json()
            raw_results = data.get("results", [])
            total_count = data.get("count", len(raw_results))

            normalized = []
            for item in raw_results:
                job_id = item.get("id") or item.get("adref")
                title = item.get("title", "").replace("<strong>", "").replace("</strong>", "")
                company = item.get("company", {}).get("display_name", "Direct Employer")
                loc_name = item.get("location", {}).get("display_name", location or "India")
                cat_label = item.get("category", {}).get("label", "IT & Engineering")
                contract = item.get("contract_type", "Full-Time").capitalize()
                s_min = item.get("salary_min")
                s_max = item.get("salary_max")
                desc = item.get("description", "").replace("<strong>", "").replace("</strong>", "")
                redirect_url = item.get("redirect_url", "#")
                created_at = item.get("created", "")

                normalized.append(self.normalize_job(
                    job_id=job_id,
                    title=title,
                    company=company,
                    location=loc_name,
                    category=cat_label,
                    contract_type=contract,
                    salary_min=s_min,
                    salary_max=s_max,
                    salary_currency="INR" if self.country == "in" else "USD",
                    description=desc,
                    source_url=redirect_url,
                    source_name=f"Adzuna ({self.country.upper()})",
                    posted_at=created_at
                ))

            return {
                "provider": self.provider_id,
                "provider_name": self.provider_name,
                "is_configured": True,
                "total_results": total_count,
                "page": page,
                "limit": limit,
                "query": query,
                "location": location,
                "fetched_at": datetime.now(timezone.utc).isoformat(),
                "results": normalized,
                "error": None
            }

        except requests.exceptions.Timeout:
            return {
                "provider": self.provider_id,
                "provider_name": self.provider_name,
                "is_configured": True,
                "total_results": 0,
                "page": page,
                "limit": limit,
                "query": query,
                "location": location,
                "fetched_at": datetime.now(timezone.utc).isoformat(),
                "results": [],
                "error": "Network timeout while requesting job listings from Adzuna API."
            }
        except Exception as e:
            return {
                "provider": self.provider_id,
                "provider_name": self.provider_name,
                "is_configured": True,
                "total_results": 0,
                "page": page,
                "limit": limit,
                "query": query,
                "location": location,
                "fetched_at": datetime.now(timezone.utc).isoformat(),
                "results": [],
                "error": f"Unexpected error connecting to Adzuna API: {str(e)}"
            }
