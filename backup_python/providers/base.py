from abc import ABC, abstractmethod
from datetime import datetime, timezone

class JobProvider(ABC):
    """
    Abstract base class for all job API providers.
    Enforces unified architecture so the frontend never needs to be modified
    when changing job data providers.
    """

    @property
    @abstractmethod
    def provider_id(self) -> str:
        """Returns the internal key of the provider (e.g. 'adzuna', 'jsearch')."""
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Returns the human-readable name of the provider."""
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        """Returns True if the required environment variables/API keys are set."""
        pass

    @abstractmethod
    def search_jobs(self, query: str = "", location: str = "", page: int = 1, limit: int = 10, category: str = None, job_type: str = None, sort_by: str = "date") -> dict:
        """
        Search for jobs using external API.
        Must return a dict adhering to standard schema:
        {
            "provider": str,
            "provider_name": str,
            "is_configured": bool,
            "total_results": int,
            "page": int,
            "limit": int,
            "query": str,
            "location": str,
            "fetched_at": ISO timestamp,
            "results": [ NormalizedJobDict, ... ],
            "error": str or None
        }
        """
        pass

    def normalize_job(self, job_id, title, company, location, category, contract_type, salary_min, salary_max, salary_currency, description, source_url, source_name, posted_at):
        """Helper to create standardized job dictionary across all providers."""
        fetched_at = datetime.now(timezone.utc).isoformat()
        return {
            "id": str(job_id),
            "title": title or "Untitled Position",
            "company": company or "Unknown Employer",
            "location": location or "India",
            "category": category or "General",
            "contract_type": contract_type or "Full-time",
            "salary_min": salary_min,
            "salary_max": salary_max,
            "salary_currency": salary_currency or "INR",
            "description": description or "No description provided.",
            "source_url": source_url or "#",
            "source_name": source_name or self.provider_name,
            "posted_at": posted_at or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "fetched_at": fetched_at,
            "is_live": True
        }
