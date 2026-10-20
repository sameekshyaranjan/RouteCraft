from dataclasses import dataclass


@dataclass(frozen=True)
class Location:
    code: str  # IATA code
    city: str
    country: str
    country_code: str  # ISO 3166-1 alpha-2


# A curated set of world cities/airports. Not exhaustive, but covers major
# hubs on every continent plus deep coverage of India (since India-domestic
# trips unlock the Train/Bus agent). No live API needed — this is static
# reference data, so it works instantly with zero signup and never rate
# limits.
LOCATIONS: list[Location] = [
    # ── India (extensive — these matter for the train/bus agent) ──────
    Location("DEL", "New Delhi", "India", "IN"),
    Location("BOM", "Mumbai", "India", "IN"),
    Location("BLR", "Bengaluru", "India", "IN"),
    Location("MAA", "Chennai", "India", "IN"),
    Location("CCU", "Kolkata", "India", "IN"),
    Location("HYD", "Hyderabad", "India", "IN"),
    Location("PNQ", "Pune", "India", "IN"),
    Location("AMD", "Ahmedabad", "India", "IN"),
    Location("JAI", "Jaipur", "India", "IN"),
    Location("GOI", "Goa", "India", "IN"),
    Location("COK", "Kochi", "India", "IN"),
    Location("LKO", "Lucknow", "India", "IN"),
    Location("VNS", "Varanasi", "India", "IN"),
    Location("AGR", "Agra", "India", "IN"),
    Location("UDR", "Udaipur", "India", "IN"),
    Location("ATQ", "Amritsar", "India", "IN"),
    Location("IXC", "Chandigarh", "India", "IN"),
    Location("PAT", "Patna", "India", "IN"),
    Location("BBI", "Bhubaneswar", "India", "IN"),
    Location("GAU", "Guwahati", "India", "IN"),
    Location("IXB", "Bagdogra / Darjeeling", "India", "IN"),
    Location("SXR", "Srinagar", "India", "IN"),
    Location("IXJ", "Jammu", "India", "IN"),
    Location("NAG", "Nagpur", "India", "IN"),
    Location("IDR", "Indore", "India", "IN"),
    Location("BHO", "Bhopal", "India", "IN"),
    Location("RPR", "Raipur", "India", "IN"),
    Location("IXR", "Ranchi", "India", "IN"),
    Location("IXM", "Madurai", "India", "IN"),
    Location("TRZ", "Tiruchirappalli", "India", "IN"),
    Location("CJB", "Coimbatore", "India", "IN"),
    Location("TRV", "Thiruvananthapuram", "India", "IN"),
    Location("VTZ", "Visakhapatnam", "India", "IN"),
    Location("VGA", "Vijayawada", "India", "IN"),
    Location("IXE", "Mangalore", "India", "IN"),
    Location("GAY", "Gaya", "India", "IN"),
    Location("DED", "Dehradun", "India", "IN"),
    Location("JDH", "Jodhpur", "India", "IN"),
    Location("JLR", "Jabalpur", "India", "IN"),
    Location("STV", "Surat", "India", "IN"),
    Location("RAJ", "Rajkot", "India", "IN"),
    Location("BDQ", "Vadodara", "India", "IN"),
    Location("IXL", "Leh", "India", "IN"),
    Location("IXZ", "Port Blair", "India", "IN"),
    Location("DIB", "Dibrugarh", "India", "IN"),
    Location("IMF", "Imphal", "India", "IN"),
    Location("SHL", "Shillong", "India", "IN"),
    Location("IXS", "Silchar", "India", "IN"),
    Location("DHM", "Dharamshala", "India", "IN"),
    Location("KUU", "Kullu Manali", "India", "IN"),
    Location("HJR", "Khajuraho", "India", "IN"),
    Location("ISK", "Nashik", "India", "IN"),
    # ── Middle East ─────────────────────────────────────────────────
    Location("DXB", "Dubai", "United Arab Emirates", "AE"),
    Location("AUH", "Abu Dhabi", "United Arab Emirates", "AE"),
    Location("DOH", "Doha", "Qatar", "QA"),
    Location("RUH", "Riyadh", "Saudi Arabia", "SA"),
    Location("JED", "Jeddah", "Saudi Arabia", "SA"),
    Location("AMM", "Amman", "Jordan", "JO"),
    Location("TLV", "Tel Aviv", "Israel", "IL"),
    Location("BEY", "Beirut", "Lebanon", "LB"),
    Location("MCT", "Muscat", "Oman", "OM"),
    Location("KWI", "Kuwait City", "Kuwait", "KW"),
    # ── Europe ──────────────────────────────────────────────────────
    Location("LON", "London", "United Kingdom", "GB"),
    Location("PAR", "Paris", "France", "FR"),
    Location("FRA", "Frankfurt", "Germany", "DE"),
    Location("BER", "Berlin", "Germany", "DE"),
    Location("AMS", "Amsterdam", "Netherlands", "NL"),
    Location("ROM", "Rome", "Italy", "IT"),
    Location("MIL", "Milan", "Italy", "IT"),
    Location("VCE", "Venice", "Italy", "IT"),
    Location("MAD", "Madrid", "Spain", "ES"),
    Location("BCN", "Barcelona", "Spain", "ES"),
    Location("MUC", "Munich", "Germany", "DE"),
    Location("ZRH", "Zurich", "Switzerland", "CH"),
    Location("GVA", "Geneva", "Switzerland", "CH"),
    Location("VIE", "Vienna", "Austria", "AT"),
    Location("CPH", "Copenhagen", "Denmark", "DK"),
    Location("STO", "Stockholm", "Sweden", "SE"),
    Location("OSL", "Oslo", "Norway", "NO"),
    Location("HEL", "Helsinki", "Finland", "FI"),
    Location("DUB", "Dublin", "Ireland", "IE"),
    Location("LIS", "Lisbon", "Portugal", "PT"),
    Location("ATH", "Athens", "Greece", "GR"),
    Location("IST", "Istanbul", "Turkey", "TR"),
    Location("WAW", "Warsaw", "Poland", "PL"),
    Location("PRG", "Prague", "Czech Republic", "CZ"),
    Location("BUD", "Budapest", "Hungary", "HU"),
    Location("BRU", "Brussels", "Belgium", "BE"),
    Location("NCE", "Nice", "France", "FR"),
    Location("EDI", "Edinburgh", "United Kingdom", "GB"),
    Location("MAN", "Manchester", "United Kingdom", "GB"),
    Location("KEF", "Reykjavik", "Iceland", "IS"),
    Location("MOW", "Moscow", "Russia", "RU"),
    # ── Asia-Pacific ────────────────────────────────────────────────
    Location("SIN", "Singapore", "Singapore", "SG"),
    Location("BKK", "Bangkok", "Thailand", "TH"),
    Location("HKT", "Phuket", "Thailand", "TH"),
    Location("KUL", "Kuala Lumpur", "Malaysia", "MY"),
    Location("HKG", "Hong Kong", "Hong Kong", "HK"),
    Location("TYO", "Tokyo", "Japan", "JP"),
    Location("OSA", "Osaka", "Japan", "JP"),
    Location("ICN", "Seoul", "South Korea", "KR"),
    Location("SHA", "Shanghai", "China", "CN"),
    Location("BJS", "Beijing", "China", "CN"),
    Location("CAN", "Guangzhou", "China", "CN"),
    Location("TPE", "Taipei", "Taiwan", "TW"),
    Location("MNL", "Manila", "Philippines", "PH"),
    Location("CGK", "Jakarta", "Indonesia", "ID"),
    Location("DPS", "Bali", "Indonesia", "ID"),
    Location("SGN", "Ho Chi Minh City", "Vietnam", "VN"),
    Location("HAN", "Hanoi", "Vietnam", "VN"),
    Location("RGN", "Yangon", "Myanmar", "MM"),
    Location("PNH", "Phnom Penh", "Cambodia", "KH"),
    Location("REP", "Siem Reap", "Cambodia", "KH"),
    Location("VTE", "Vientiane", "Laos", "LA"),
    Location("KTM", "Kathmandu", "Nepal", "NP"),
    Location("CMB", "Colombo", "Sri Lanka", "LK"),
    Location("DAC", "Dhaka", "Bangladesh", "BD"),
    Location("MLE", "Male", "Maldives", "MV"),
    Location("ISB", "Islamabad", "Pakistan", "PK"),
    Location("KHI", "Karachi", "Pakistan", "PK"),
    # ── Oceania ─────────────────────────────────────────────────────
    Location("SYD", "Sydney", "Australia", "AU"),
    Location("MEL", "Melbourne", "Australia", "AU"),
    Location("BNE", "Brisbane", "Australia", "AU"),
    Location("PER", "Perth", "Australia", "AU"),
    Location("AKL", "Auckland", "New Zealand", "NZ"),
    Location("NAN", "Nadi", "Fiji", "FJ"),
    # ── North America ───────────────────────────────────────────────
    Location("NYC", "New York", "United States", "US"),
    Location("LAX", "Los Angeles", "United States", "US"),
    Location("CHI", "Chicago", "United States", "US"),
    Location("SFO", "San Francisco", "United States", "US"),
    Location("MIA", "Miami", "United States", "US"),
    Location("SEA", "Seattle", "United States", "US"),
    Location("BOS", "Boston", "United States", "US"),
    Location("LAS", "Las Vegas", "United States", "US"),
    Location("HNL", "Honolulu", "United States", "US"),
    Location("YTO", "Toronto", "Canada", "CA"),
    Location("YVR", "Vancouver", "Canada", "CA"),
    Location("MEX", "Mexico City", "Mexico", "MX"),
    Location("CUN", "Cancun", "Mexico", "MX"),
    # ── South America ───────────────────────────────────────────────
    Location("SAO", "Sao Paulo", "Brazil", "BR"),
    Location("RIO", "Rio de Janeiro", "Brazil", "BR"),
    Location("BUE", "Buenos Aires", "Argentina", "AR"),
    Location("SCL", "Santiago", "Chile", "CL"),
    Location("LIM", "Lima", "Peru", "PE"),
    Location("BOG", "Bogota", "Colombia", "CO"),
    Location("UIO", "Quito", "Ecuador", "EC"),
    # ── Africa ──────────────────────────────────────────────────────
    Location("CAI", "Cairo", "Egypt", "EG"),
    Location("JNB", "Johannesburg", "South Africa", "ZA"),
    Location("CPT", "Cape Town", "South Africa", "ZA"),
    Location("NBO", "Nairobi", "Kenya", "KE"),
    Location("ADD", "Addis Ababa", "Ethiopia", "ET"),
    Location("LOS", "Lagos", "Nigeria", "NG"),
    Location("CMN", "Casablanca", "Morocco", "MA"),
    Location("TUN", "Tunis", "Tunisia", "TN"),
    Location("MRU", "Mauritius", "Mauritius", "MU"),
    Location("SEZ", "Seychelles", "Seychelles", "SC"),
]

_BY_CODE = {loc.code: loc for loc in LOCATIONS}


def get_location(code: str) -> Location | None:
    return _BY_CODE.get(code.upper())


def is_india(code: str) -> bool:
    loc = get_location(code)
    return bool(loc and loc.country_code == "IN")


def search_locations(query: str, limit: int = 8) -> list[Location]:
    q = query.strip().lower()
    if not q:
        return []

    scored: list[tuple[int, Location]] = []
    for loc in LOCATIONS:
        code_l = loc.code.lower()
        city_l = loc.city.lower()
        country_l = loc.country.lower()

        if code_l == q:
            score = 0
        elif city_l.startswith(q):
            score = 1
        elif code_l.startswith(q):
            score = 2
        elif q in city_l:
            score = 3
        elif q in country_l:
            score = 4
        else:
            continue

        scored.append((score, loc))

    scored.sort(key=lambda pair: (pair[0], pair[1].city))
    return [loc for _, loc in scored[:limit]]
