export interface RoadWork {
  id: number;
  city: string;
  state: string;
  title: string;
  roadName: string;
  type: string;
  dept: string;
  status: 'In Progress' | 'Planned' | 'Critical' | 'Completed';
  lat: number;
  lng: number;
  details: string;
  startDate: string;
  completionDate: string;
  impactLevel: string;
}

export const PAN_INDIA_WORKS: RoadWork[] = [
  // BENGALURU
  {
    id: 1,
    city: "Bengaluru",
    state: "Karnataka",
    title: "MG Road Smart Utility Conduit Relaying",
    roadName: "MG Road (Trinity Circle to Brigade Rd)",
    type: "Water Main & Fiber Conduit",
    dept: "BWSSB / BBMP",
    status: "In Progress",
    lat: 12.9756,
    lng: 77.6066,
    details: "Replacing 45-year old cast iron water feeder conduits with 500mm HDPE pipes. Coordinated with BESCOM underground electrical cabling to avoid future excavation.",
    startDate: "2026-07-10",
    completionDate: "2026-10-30",
    impactLevel: "1 Lane Barricaded"
  },
  {
    id: 2,
    city: "Bengaluru",
    state: "Karnataka",
    title: "Silk Board Metro Interchange & Ramp Resurfacing",
    roadName: "Hosur Road - Outer Ring Road Junction",
    type: "Structural Road Decking",
    dept: "BMRCL / PWD",
    status: "Critical",
    lat: 12.9176,
    lng: 77.6238,
    details: "Deck slab casting for multi-level road-cum-rail interchange. Heavy crane mobilization during night shifts. Speed limit restricted to 20 km/h.",
    startDate: "2026-06-01",
    completionDate: "2026-12-15",
    impactLevel: "Major Diversion in Effect"
  },
  {
    id: 3,
    city: "Bengaluru",
    state: "Karnataka",
    title: "Indiranagar 100 Feet Road Stormwater Upgrade",
    roadName: "100 Feet Road, HAL 2nd Stage",
    type: "Drainage Reconstruction",
    dept: "BBMP Stormwater Cell",
    status: "Planned",
    lat: 12.9698,
    lng: 77.6416,
    details: "Box culvert installation to prevent monsoon waterlogging. Pre-cast concrete sections to be deployed with zero open trenches after 6 AM.",
    startDate: "2026-09-01",
    completionDate: "2026-11-20",
    impactLevel: "Night-time Lane Closure"
  },

  // NEW DELHI & NCR
  {
    id: 4,
    city: "New Delhi",
    state: "Delhi NCR",
    title: "Kartavya Path & Rajpath Micro-Surfacing",
    roadName: "Kartavya Path, Central Vista",
    type: "Pavement Preservation",
    dept: "CPWD",
    status: "In Progress",
    lat: 28.6143,
    lng: 77.2091,
    details: "Applying high-friction polymer asphalt micro-layer for national ceremonial corridor. Integrated moisture sensors embedded below binder layer.",
    startDate: "2026-07-20",
    completionDate: "2026-09-15",
    impactLevel: "Alternate Carriage Way Active"
  },
  {
    id: 5,
    city: "New Delhi",
    state: "Delhi NCR",
    title: "Connaught Place Deep Pipeline Renovation",
    roadName: "Outer Circle, CP",
    type: "Pipeline Trenchless Jacking",
    dept: "Delhi Jal Board",
    status: "In Progress",
    lat: 28.6315,
    lng: 77.2167,
    details: "Micro-tunneling water trunk line replacement. Zero surface tearing using trenchless horizontal directional drilling (HDD).",
    startDate: "2026-08-01",
    completionDate: "2026-11-05",
    impactLevel: "Pedestrian Walkway Shielded"
  },
  {
    id: 6,
    city: "New Delhi",
    state: "Delhi NCR",
    title: "Lodhi Road Flyover Joint Rehabilitation",
    roadName: "Lodhi Road Flyover Deck",
    type: "Structural Joint Replacement",
    dept: "NHAI / Delhi PWD",
    status: "Critical",
    lat: 28.5902,
    lng: 77.2275,
    details: "Replacing seismic expansion elastomeric finger joints. 2 of 4 lanes operational with radar speed enforcement.",
    startDate: "2026-07-28",
    completionDate: "2026-08-30",
    impactLevel: "Traffic Crawling / Moderate Delay"
  },

  // MUMBAI
  {
    id: 7,
    city: "Mumbai",
    state: "Maharashtra",
    title: "Coastal Road Marine Drive Connector Integration",
    roadName: "Netaji Subhash Chandra Bose Road (Marine Drive)",
    type: "Expressway Link Paving",
    dept: "BMC (MCGM)",
    status: "In Progress",
    lat: 18.9438,
    lng: 72.8231,
    details: "High-grade SMA (Stone Matrix Asphalt) application on arterial connection linking Coastal Freeway undersea tunnel portal to Marine Drive.",
    startDate: "2026-05-15",
    completionDate: "2026-10-10",
    impactLevel: "Southbound Lane Squeezed"
  },
  {
    id: 8,
    city: "Mumbai",
    state: "Maharashtra",
    title: "Andheri-Kurla Stormwater Pumping Arterial",
    roadName: "Andheri-Kurla Road, Saki Naka",
    type: "Heavy Culvert Installation",
    dept: "BMC Stormwater Dept",
    status: "In Progress",
    lat: 19.1075,
    lng: 72.8872,
    details: "Upgrading high-discharge culverts beneath metro alignment to eliminate monsoon flash-flood risk.",
    startDate: "2026-06-12",
    completionDate: "2026-11-30",
    impactLevel: "Heavy Traffic Congestion"
  },

  // HYDERABAD
  {
    id: 9,
    city: "Hyderabad",
    state: "Telangana",
    title: "Hitec City Cyber Towers Flyover Expansion",
    roadName: "Hitec City Main Road - Mindspace Jn",
    type: "Flyover Pier & Cantilever Paving",
    dept: "GHMC / TSIIC",
    status: "In Progress",
    lat: 17.4504,
    lng: 78.3808,
    details: "Constructing unidirectional elevated loop ramp. Night crane hoisting with smart traffic marshals on ground.",
    startDate: "2026-06-01",
    completionDate: "2026-12-30",
    impactLevel: "Peak Hour Traffic Managed"
  },
  {
    id: 10,
    city: "Hyderabad",
    state: "Telangana",
    title: "Charminar Heritage Pedestrian Cobblestone Paving",
    roadName: "Charminar Pedestrian Precinct",
    type: "Heritage Cobblestone Surfacing",
    dept: "GHMC Heritage Cell",
    status: "Completed",
    lat: 17.3616,
    lng: 78.4747,
    details: "Granite flagstone paving for zero-emission pedestrian buffer zone with underground electrical ducts.",
    startDate: "2026-03-01",
    completionDate: "2026-07-15",
    impactLevel: "Vehicle Restricted Zone"
  },

  // CHENNAI
  {
    id: 11,
    city: "Chennai",
    state: "Tamil Nadu",
    title: "Anna Salai Metro Phase 2 Underground Utility Sync",
    roadName: "Anna Salai (Mount Road)",
    type: "Sub-surface Utility Corridor",
    dept: "CMRL / Chennai Corp",
    status: "Critical",
    lat: 13.0604,
    lng: 80.2496,
    details: "Relocating high-voltage TANGEDCO 110kV feeder cables before TBM (Tunnel Boring Machine) arrival. 24/7 laser displacement monitoring.",
    startDate: "2026-07-01",
    completionDate: "2026-11-15",
    impactLevel: "Lane Diversion via Spencer Plaza"
  },
  {
    id: 12,
    city: "Chennai",
    state: "Tamil Nadu",
    title: "OMR IT Highway Smart Sensor Paving",
    roadName: "Rajiv Gandhi Salai (OMR), Perungudi",
    type: "Smart Asphalt Resurfacing",
    dept: "TN Highways",
    status: "Planned",
    lat: 12.9654,
    lng: 80.2461,
    details: "Deploying piezo-electric weight-in-motion (WIM) sensors embedded into top asphalt lift for freight monitoring.",
    startDate: "2026-09-10",
    completionDate: "2026-12-01",
    impactLevel: "Off-Peak Working Hours"
  },

  // KOLKATA
  {
    id: 13,
    city: "Kolkata",
    state: "West Bengal",
    title: "Park Street Heritage Utility Corridor Modernization",
    roadName: "Park Street (Mother Teresa Sarani)",
    type: "Gas & Drainage Renovation",
    dept: "KMC / Kolkata Gas Supply",
    status: "In Progress",
    lat: 22.5535,
    lng: 88.3524,
    details: "Replacing legacy British-era cast iron gas mains with high-density polyurethane conduits.",
    startDate: "2026-07-05",
    completionDate: "2026-10-25",
    impactLevel: "Partial Single-Way Traffic"
  },
  {
    id: 14,
    city: "Kolkata",
    state: "West Bengal",
    title: "EM Bypass Bus-Bay Realignment & Resurfacing",
    roadName: "Eastern Metropolitan Bypass, Science City",
    type: "Highway Resurfacing",
    dept: "KMDA",
    status: "Completed",
    lat: 22.5398,
    lng: 88.3968,
    details: "Bituminous mastic asphalt overlay on elevated expressway landing ramps with rainwater harvesting chutes.",
    startDate: "2026-04-10",
    completionDate: "2026-07-22",
    impactLevel: "Fully Operational"
  },

  // PUNE
  {
    id: 15,
    city: "Pune",
    state: "Maharashtra",
    title: "FC Road Smart Pedestrian & Drainage Revamp",
    roadName: "Fergusson College Road, Shivajinagar",
    type: "Smart Corridor Redevelopment",
    dept: "PMC Smart City Cell",
    status: "In Progress",
    lat: 18.5204,
    lng: 73.8415,
    details: "Wide pedestrian walkways with tactile paving for visually impaired and dedicated utility ducting underneath.",
    startDate: "2026-06-20",
    completionDate: "2026-10-15",
    impactLevel: "Slow Moving Traffic"
  },

  // JAIPUR
  {
    id: 16,
    city: "Jaipur",
    state: "Rajasthan",
    title: "JLN Marg Underpass Drainage & Pavement Retrofit",
    roadName: "Jawaharlal Nehru Marg, Malviya Nagar",
    type: "Underpass Pavement & Sump System",
    dept: "JDA (Jaipur Development Authority)",
    status: "In Progress",
    lat: 26.8524,
    lng: 75.8052,
    details: "Anti-skid ribbed mastic surface treatment with high-capacity storm water sump pumps.",
    startDate: "2026-07-15",
    completionDate: "2026-09-30",
    impactLevel: "Single Tube Operational"
  },

  // AHMEDABAD
  {
    id: 17,
    city: "Ahmedabad",
    state: "Gujarat",
    title: "SG Highway Smart Elevated Overpass Decking",
    roadName: "Sarkhej-Gandhinagar Highway, Thaltej",
    type: "Elevated Corridor Construction",
    dept: "Gujarat R&B Dept",
    status: "In Progress",
    lat: 23.0538,
    lng: 72.5085,
    details: "Flyover girder launching and SMA wearing coat for 6-lane signal-free corridor to Gandhinagar.",
    startDate: "2026-05-01",
    completionDate: "2026-11-30",
    impactLevel: "Service Road Diversion"
  },

  // KOCHI
  {
    id: 18,
    city: "Kochi",
    state: "Kerala",
    title: "MG Road Metro Feeder Ducting & Pervious Paving",
    roadName: "Mahatma Gandhi Road, Ernakulam",
    type: "Pervious Concrete & Utility Duct",
    dept: "KMRL / Kochi Corp",
    status: "In Progress",
    lat: 9.9723,
    lng: 76.2842,
    details: "Pervious eco-concrete laying to absorb heavy coastal monsoon runoff directly into underground recharge wells.",
    startDate: "2026-07-18",
    completionDate: "2026-10-20",
    impactLevel: "1 Lane Controlled"
  }
];
