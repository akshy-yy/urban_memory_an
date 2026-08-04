export interface ComplaintItem {
  id: number;
  aadhar: string;
  name: string;
  state: string;
  city: string;
  roadNumber: string;
  details: string;
  urgency: number;
  imagePreview?: string | null;
  timestamp: string;
  status: string;
}

export const INITIAL_COMPLAINTS: ComplaintItem[] = [
  {
    id: 101,
    aadhar: "7894-3210-9876",
    name: "Ramesh Sharma",
    state: "Karnataka",
    city: "Bengaluru",
    roadNumber: "MG Road (near Trinity Circle)",
    details: "Deep crater-sized pothole right on the active bus lane causing severe morning congestion and near two-wheeler skids.",
    urgency: 9,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: "Pending"
  },
  {
    id: 102,
    aadhar: "5432-1098-7654",
    name: "Pooja Verma",
    state: "Delhi",
    city: "New Delhi",
    roadNumber: "Connaught Place Inner Circle Road",
    details: "Uncovered utility excavation without hazard cones or warning tape. Water leaking onto asphalt.",
    urgency: 8,
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    status: "In Review"
  },
  {
    id: 103,
    aadhar: "3210-9876-5432",
    name: "Vikram Malhotra",
    state: "Maharashtra",
    city: "Mumbai",
    roadNumber: "Andheri-Kurla Road, Sector 3",
    details: "Trench dug across pedestrian sidewalk for cable laying, left backfilled with loose gravel.",
    urgency: 6,
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: "Assigned"
  },
  {
    id: 104,
    aadhar: "6543-2109-8765",
    name: "Ananya Iyer",
    state: "Tamil Nadu",
    city: "Chennai",
    roadNumber: "Anna Salai (near Mount Road)",
    details: "Faded lane markings and uneven road surface after stormwater drain installation.",
    urgency: 4,
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    status: "Pending"
  }
];

export function getStoredComplaints(): ComplaintItem[] {
  try {
    const raw = localStorage.getItem('uims_complaints');
    if (!raw) {
      localStorage.setItem('uims_complaints', JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem('uims_complaints', JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    return parsed.sort((a: ComplaintItem, b: ComplaintItem) => b.urgency - a.urgency);
  } catch (err) {
    console.error('Failed to load stored complaints', err);
    return INITIAL_COMPLAINTS;
  }
}

export function saveComplaintAndSync(complaint: ComplaintItem) {
  // 1. Save in current local storage
  const current = getStoredComplaints();
  const updated = [complaint, ...current.filter(c => c.id !== complaint.id)];
  localStorage.setItem('uims_complaints', JSON.stringify(updated));

  // 2. BroadcastChannel sync (if same browser origin)
  try {
    if (window.BroadcastChannel) {
      const bc = new BroadcastChannel('uims_complaints_channel');
      bc.postMessage({ type: 'SAVE_COMPLAINT', complaint });
      bc.close();
    }
  } catch (e) {
    console.warn('BroadcastChannel error', e);
  }

  // 3. Cross-origin iframe postMessage to Official Portal (port 5173)
  try {
    const targetUrl = 'http://localhost:5173/sync-bridge.html';
    let bridgeFrame = document.getElementById('uims-sync-bridge-5173') as HTMLIFrameElement;
    if (!bridgeFrame) {
      bridgeFrame = document.createElement('iframe');
      bridgeFrame.id = 'uims-sync-bridge-5173';
      bridgeFrame.style.display = 'none';
      bridgeFrame.src = targetUrl;
      document.body.appendChild(bridgeFrame);

      bridgeFrame.onload = () => {
        bridgeFrame.contentWindow?.postMessage({ type: 'SAVE_COMPLAINT', complaint }, 'http://localhost:5173');
      };
    } else {
      bridgeFrame.contentWindow?.postMessage({ type: 'SAVE_COMPLAINT', complaint }, 'http://localhost:5173');
    }
  } catch (e) {
    console.warn('Cross-origin iframe postMessage failed', e);
  }
}
