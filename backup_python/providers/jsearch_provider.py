import os
import requests
from datetime import datetime, timezone
from .base import JobProvider

class JSearchJobProvider(JobProvider):
    def __init__(self):
        self.api_key = os.getenv("RAPIDAPI_KEY", "").strip()
        self.api_host = os.getenv("RAPIDAPI_HOST", "jsearch.p.rapidapi.com").strip()
        self.url = "https://jsearch.p.rapidapi.com/search"

    @property
    def provider_id(self) -> str:
        return "jsearch"

    @property
    def provider_name(self) -> str:
        return "JSearch API (via RapidAPI)"

    def is_configured(self) -> bool:
        return bool(self.api_key)

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
                "error": "RapidAPI Key (RAPIDAPI_KEY) is not configured in environment variables."
            }

        search_text = f"{query} in {location}".strip() if (query and location) else (query or location or "Software Developer in India")
        headers = {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": self.api_host
        }
        params = {
            "query": search_text,
            "page": str(page),
            "num_pages": "1"
        }

        try:
            response = requests.get(self.url, headers=headers, params=params, timeout=10)
            if response.status_code != 200:
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
                    "error": f"JSearch API returned status HTTP {response.status_code}: {response.text[:200]}"
                }

            data = response.json()
            raw_results = data.get("data", [])

            normalized = []
            for item in raw_results:
                job_id = item.get("job_id")
                title = item.get("job_title", "Position")
                company = item.get("employer_name", "Employer")
                loc = f"{item.get('job_city', '')}, {item.get('job_country', 'India')}".strip(", ")
                contract = item.get("job_employment_type", "FULLTIME").title()
                s_min = item.get("job_min_salary")
                s_max = item.get("job_max_salary")
                currency = item.get("job_salary_currency", "INR")
                desc = item.get("job_description", "")
                apply_link = item.get("job_apply_link") or (item.get("apply_options", [{}])[0].get("apply_link") if item.get("apply_options") else "#")
                publisher = item.get("job_publisher", "JSearch")
                posted_at = item.get("job_posted_at_datetime_utc", "")

                normalized.append(self.normalize_job(
                    job_id=job_id,
                    title=title,
                    company=company,
                    location=loc or "India",
                    category="Engineering & IT",
                    contract_type=contract,
                    salary_min=s_min,
                    salary_max=s_max,
                    salary_currency=currency,
                    description=desc,
                    source_url=apply_link,
                    source_name=f"{publisher} (via JSearch)",
                    posted_at=posted_at
                ))

            return {
                "provider": self.provider_id,
                "provider_name": self.provider_name,
                "is_configured": True,
                "total_results": len(normalized),
                "page": page,
                "limit": limit,
                "query": query,
                "location": location,
                "fetched_at": datetime.now(timezone.utc).isoformat(),
                "results": normalized,
                "error": None
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
                "error": f"Error querying JSearch API: {str(e)}"
            }
