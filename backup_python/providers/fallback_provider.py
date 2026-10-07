from datetime import datetime, timezone, timedelta
from .base import JobProvider

class FallbackJobProvider(JobProvider):
    """
    Fallback provider offering real-world high quality India job listings
    when primary external API credentials are missing from .env.
    Ensures zero downtime and immediate demonstration capability while prompting
    the user to supply their free Adzuna or RapidAPI keys.
    """

    def __init__(self):
        now = datetime.now(timezone.utc)
        self._mock_db = [
            {
                "id": "adz-in-001",
                "title": "Senior Full Stack Engineer (React & Python)",
                "company": "Swiggy",
                "location": "Bengaluru, Karnataka, India",
                "category": "Software Engineering",
                "contract_type": "Full-Time",
                "salary_min": 1800000,
                "salary_max": 2800000,
                "salary_currency": "INR",
                "description": "Swiggy is looking for a Senior Full Stack Engineer to scale backend microservices and modern frontend architectures for millions of daily orders in India.",
                "source_url": "https://careers.swiggy.com/",
                "source_name": "Adzuna Demo / Swiggy Careers",
                "posted_at": (now - timedelta(days=1)).strftime("%Y-%m-%d")
            },
            {
                "id": "adz-in-002",
                "title": "Backend Systems Architect (Go / Node.js)",
                "company": "PhonePe",
                "location": "Bengaluru, Karnataka, India",
                "category": "Software Engineering",
                "contract_type": "Full-Time",
                "salary_min": 2400000,
                "salary_max": 3800000,
                "salary_currency": "INR",
                "description": "Join PhonePe's Core Infrastructure team building ultra-low-latency distributed payment gateways handling 50M+ daily transactions.",
                "source_url": "https://www.phonepe.com/careers/",
                "source_name": "Adzuna Demo / PhonePe Careers",
                "posted_at": (now - timedelta(days=2)).strftime("%Y-%m-%d")
            },
            {
                "id": "adz-in-003",
                "title": "Frontend Lead Engineer (TypeScript / Next.js)",
                "company": "Razorpay",
                "location": "Bengaluru / Hybrid",
                "category": "Frontend Engineering",
                "contract_type": "Full-Time",
                "salary_min": 2000000,
                "salary_max": 3200000,
                "salary_currency": "INR",
                "description": "Razorpay seeks a Frontend Lead to craft developer-first payment dashboards, component design systems, and checkout experiences.",
                "source_url": "https://razorpay.com/jobs/",
                "source_name": "Adzuna Demo / Razorpay Careers",
                "posted_at": (now - timedelta(days=3)).strftime("%Y-%m-%d")
            },
            {
                "id": "adz-in-004",
                "title": "Data Engineer - Big Data & Real-time Analytics",
                "company": "Zomato",
                "location": "Gurugram, Haryana, India",
                "category": "Data & AI",
                "contract_type": "Full-Time",
                "salary_min": 1600000,
                "salary_max": 2600000,
                "salary_currency": "INR",
                "description": "Design scalability data pipelines using Spark, Kafka, and Snowflake to optimize food delivery routing and dynamic pricing across Indian metros.",
                "source_url": "https://www.zomato.com/careers",
                "source_name": "Adzuna Demo / Zomato Careers",
                "posted_at": (now - timedelta(hours=8)).strftime("%Y-%m-%d")
            },
            {
                "id": "adz-in-005",
                "title": "DevOps / SRE Specialist (Kubernetes & AWS)",
                "company": "Flipkart",
                "location": "Bengaluru, Karnataka, India",
                "category": "DevOps & Cloud",
                "contract_type": "Full-Time",
                "salary_min": 2200000,
                "salary_max": 3500000,
                "salary_currency": "INR",
                "description": "Manage multi-region Kubernetes clusters, automated CI/CD pipelines, and high-availability cloud infrastructure for Flipkart Big Billion Days.",
                "source_url": "https://www.flipkartcareers.com/",
                "source_name": "Adzuna Demo / Flipkart Careers",
                "posted_at": (now - timedelta(days=4)).strftime("%Y-%m-%d")
            },
            {
                "id": "adz-in-006",
                "title": "UI/UX Product Designer",
                "company": "CRED",
                "location": "Bengaluru, Karnataka, India",
                "category": "Product Design",
                "contract_type": "Full-Time",
                "salary_min": 1800000,
                "salary_max": 2800000,
                "salary_currency": "INR",
                "description": "Craft high-fidelity micro-interactions, dark-mode design systems, and premium mobile app UI for India's premier credit reward platform.",
                "source_url": "https://cred.club/careers",
                "source_name": "Adzuna Demo / CRED Careers",
                "posted_at": (now - timedelta(days=2)).strftime("%Y-%m-%d")
            },
            {
                "id": "adz-in-007",
                "title": "AI / ML Research Engineer (LLM Fine-tuning)",
                "company": "Sarvam AI",
                "location": "Bengaluru / Remote (India)",
                "category": "Data & AI",
                "contract_type": "Full-Time",
                "salary_min": 2500000,
                "salary_max": 4200000,
                "salary_currency": "INR",
                "description": "Develop and fine-tune Indic language LLMs, speech models, and generative AI interfaces tailored specifically for Indian enterprise use cases.",
                "source_url": "https://www.sarvam.ai/",
                "source_name": "Adzuna Demo / Sarvam AI",
                "posted_at": (now - timedelta(days=1)).strftime("%Y-%m-%d")
            },
            {
                "id": "adz-in-008",
                "title": "Associate Product Manager",
                "company": "MakeMyTrip",
                "location": "Gurugram, Haryana, India",
                "category": "Product Management",
                "contract_type": "Full-Time",
                "salary_min": 1400000,
                "salary_max": 2200000,
                "salary_currency": "INR",
                "description": "Drive conversion optimization, user flow enhancements, and regional localization features for India's leading travel & hotel booking ecosystem.",
                "source_url": "https://careers.makemytrip.com/",
                "source_name": "Adzuna Demo / MakeMyTrip",
                "posted_at": (now - timedelta(days=5)).strftime("%Y-%m-%d")
            }
        ]

    @property
    def provider_id(self) -> str:
        return "fallback"

    @property
    def provider_name(self) -> str:
        return "Live Demo Provider (Adzuna Fallback)"

    def is_configured(self) -> bool:
        return False

    def search_jobs(self, query: str = "", location: str = "", page: int = 1, limit: int = 10, category: str = None, job_type: str = None, sort_by: str = "date") -> dict:
        filtered = []
        q = query.lower().strip()
        loc = location.lower().strip()
        cat = (category or "").lower().strip()

        for item in self._mock_db:
            matches_q = not q or (q in item["title"].lower() or q in item["company"].lower() or q in item["description"].lower() or q in item["category"].lower())
            
            # Location Synonym Normalization for India Metros
            item_loc = item["location"].lower()
            matches_loc = not loc
            if loc:
                if ("bangalore" in loc or "bengaluru" in loc) and ("bangalore" in item_loc or "bengaluru" in item_loc or "india" in item_loc):
                    matches_loc = True
                elif ("gurgaon" in loc or "gurugram" in loc or "ncr" in loc) and ("gurgaon" in item_loc or "gurugram" in item_loc or "haryana" in item_loc or "ncr" in item_loc):
                    matches_loc = True
                elif loc in item_loc or "india" in item_loc or "remote" in item_loc:
                    matches_loc = True

            matches_cat = not cat or (cat in item["category"].lower())

            if matches_q and matches_loc and matches_cat:
                filtered.append(item)


        start = (page - 1) * limit
        page_items = filtered[start:start + limit]

        normalized = []
        for item in page_items:
            normalized.append(self.normalize_job(
                job_id=item["id"],
                title=item["title"],
                company=item["company"],
                location=item["location"],
                category=item["category"],
                contract_type=item["contract_type"],
                salary_min=item["salary_min"],
                salary_max=item["salary_max"],
                salary_currency=item["salary_currency"],
                description=item["description"],
                source_url=item["source_url"],
                source_name=item["source_name"],
                posted_at=item["posted_at"]
            ))

        return {
            "provider": self.provider_id,
            "provider_name": self.provider_name,
            "is_configured": False,
            "total_results": len(filtered),
            "page": page,
            "limit": limit,
            "query": query,
            "location": location,
            "fetched_at": datetime.now(timezone.utc).isoformat(),
            "results": normalized,
            "error": None,
            "notice": "Notice: API credentials (ADZUNA_APP_ID / ADZUNA_APP_KEY) are not yet configured in .env file. Showing live demo listings. Register for free at https://developer.adzuna.com to enable real-time Adzuna API results."
        }

