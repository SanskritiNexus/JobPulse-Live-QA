import os
from .base import JobProvider
from .adzuna_provider import AdzunaJobProvider
from .jsearch_provider import JSearchJobProvider
from .remotive_provider import RemotiveJobProvider
from .fallback_provider import FallbackJobProvider

def get_job_provider() -> JobProvider:
    """
    Factory function to instantiate the active JobProvider based on
    JOB_API_PROVIDER in .env.
    Pluggable design ensures zero frontend changes when swapping job providers.
    """
    provider_key = os.getenv("JOB_API_PROVIDER", "adzuna").strip().lower()

    if provider_key == "adzuna":
        provider = AdzunaJobProvider()
        if not provider.is_configured():
            # If Adzuna credentials aren't set, return FallbackJobProvider
            # while clearly preserving the warning notification.
            return FallbackJobProvider()
        return provider
    elif provider_key == "jsearch":
        provider = JSearchJobProvider()
        if not provider.is_configured():
            return FallbackJobProvider()
        return provider
    elif provider_key == "remotive":
        return RemotiveJobProvider()
    elif provider_key == "fallback":
        return FallbackJobProvider()
    else:
        # Default fallback
        provider = AdzunaJobProvider()
        if not provider.is_configured():
            return FallbackJobProvider()
        return provider
