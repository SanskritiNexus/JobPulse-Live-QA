import requests
from datetime import datetime, timezone
from .base import JobProvider

class RemotiveJobProvider(JobProvider):
    def __init__(self):
        self.url = "https://remotive.com/api/remote-jobs"

    @property
    def provider_id(self) -> str:
        return "remotive"

    @property
    def provider_name(self) -> str:
        return "Remotive Remote Jobs API"

    def is_configured(self) -> bool:
        return True  # Open API, no key required

    def search_jobs(self, query: str = "", location: str = "", page: int = 1, limit: int = 10, category: str = None, job_type: str = None, sort_by: str = "date") -> dict:
        params = {}
        if query:
            params["search"] = query
        if category:
            params["category"] = category.lower()
        if limit:
            params["limit"] = min(limit, 50)

        try:
            response = requests.get(self.url, params=params, timeout=10)
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
                    "error": f"Remotive API returned HTTP {response.status_code}"
                }

            data = response.json()
            jobs_list = data.get("jobs", [])

            # Client-side filtering for location if specified (e.g. India or Remote)
            filtered = []
            for item in jobs_list:
                candidate_loc = item.get("candidate_required_location", "").lower()
                if location and location.lower() not in candidate_loc and "anywhere" not in candidate_loc and "worldwide" not in candidate_loc:
                    continue
                filtered.append(item)

            # Pagination slice
            start = (page - 1) * limit
            page_items = filtered[start:start + limit]

            normalized = []
            for item in page_items:
                normalized.append(self.normalize_job(
                    job_id=item.get("id"),
                    title=item.get("title"),
                    company=item.get("company_name"),
                    location=f"Remote ({item.get('candidate_required_location', 'Worldwide')})",
                    category=item.get("category", "Software Development"),
                    contract_type=item.get("job_type", "Full-time").replace("-", " ").title(),
                    salary_min=None,
                    salary_max=None,
                    salary_currency="USD",
                    description=item.get("description", ""),
                    source_url=item.get("url"),
                    source_name="Remotive Official",
                    posted_at=item.get("publication_date")
                ))

            return {
                "provider": self.provider_id,
                "provider_name": self.provider_name,
                "is_configured": True,
                "total_results": len(filtered),
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
                "error": f"Error querying Remotive API: {str(e)}"
            }
