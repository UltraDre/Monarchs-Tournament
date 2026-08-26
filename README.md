# Monarchs Tournament Engine

A powerful, fully client‑side tournament management tool for group stages and knockout brackets. Built with vanilla JavaScript, Tailwind CSS, and Supabase for optional cloud backups. Designed for esports, sports leagues, or any competitive event where you need to manage fixtures, standings, and elimination rounds.

![Screenshot](screenshot.png)

---

## ✨ Features

- **Dual Tournament Formats**  
  - **Group Stage + Knockout** – Round‑robin groups followed by seeded elimination brackets.  
  - **Direct Knockout** – Single‑elimination bracket from the start.

- **Intuitive Match Management**  
  - Enter scores directly on fixture cards or bracket slots.  
  - Standings auto‑update (points, goal difference, etc.).  
  - Winners are automatically promoted to the next round in the knockout bracket.

- **Fully Editable Player Roster**  
  - Add or edit participant names at any time via the “Edit Players” modal.  
  - Changes propagate to all matches and standings.

- **Cloud Backup (Supabase)**  
  - Upload your tournament data to the cloud with a username and access code.  
  - Load any saved tournament from another device.

- **Local Storage & JSON Backup**  
  - All tournaments are saved automatically in your browser’s local storage.  
  - Download/restore backups as JSON files.

- **Responsive & Dark‑Theme UI**  
  - Works on desktop, tablet, and mobile.  
  - Glass‑morphism design with animated confetti celebration when a champion is crowned.

---

## 🚀 How to Use

### 1. Create a Tournament
- Click **“Create Tournament”** on the home page.
- Enter a tournament name.
- Choose **“Group Stage & Bracket”** or **“Direct Knockout”**.
- Adjust settings (number of entrants, group size, qualifiers, etc.).
- Add player names (one per line) – you can use the “Autofill Sample Teams” button to populate quickly.
- Click **“Create Tournament”**.

### 2. Group Stage
- After creation, you’ll be taken to the **Groups** tab.
- View live standings for each group.
- Switch to the **Fixtures** tab to enter scores for each match.
  - Scores are numeric; the match is marked as “played” once both scores are filled.
- Standings update in real‑time as scores are entered.

### 3. Knockout Stage
- Once all group matches are played, go to the **Knockout** tab.
- If the bracket is locked, click **“Seed Knockout Stage Now”** – the system will automatically seed the top qualifiers from each group into a balanced bracket (configurable for different group/qualifier setups).
- In the bracket view, click on a **slot name** to declare that player as the winner of that match.
- Enter leg scores in the tiny score inputs (for two‑leg ties).
- The winner advances automatically to the next round.
- When a champion is crowned, confetti rains down!

### 4. Edit Players
- On the home page, hover over a tournament card and click the **pencil icon**.
- Modify any player name – the changes will be reflected across all fixtures and standings.

### 5. Cloud Sync (Optional)
- Click the **cloud upload** button (☁️↑) to save your current tournaments to Supabase.
- You’ll be prompted for a username and access code (these are used to identify your backup).
- Click the **cloud download** button (☁️↓) to load a previously saved backup by entering the username.

### 6. Local Backup
- Use the **download** (⬇️) button to save a JSON backup of all tournaments.
- Use the **upload** (⬆️) button to restore a JSON backup file.

---

## 🛠️ Technical Details

### Architecture
- **Single‑page application** – all logic is contained in `index.html`.
- **State management** – tournaments are stored in a JavaScript array and persisted in `localStorage`.
- **Reactive rendering** – functions like `renderActiveFixturesGrid()` and `renderActiveBracket()` rebuild the UI on every data change.

### Supabase Integration
The cloud backup feature uses two **PostgreSQL functions** (RPC) on your Supabase instance:

- `upload_backup(p_username TEXT, p_access_code TEXT, p_data JSONB)` – stores the tournament array under the given username.
- `get_backup(p_username TEXT)` – retrieves the stored JSON.

To enable this, create a table (e.g., `backups`) with columns `username`, `access_code`, `data`, and `created_at`. Then define the two functions. The provided code uses a hard‑coded Supabase URL and anon key – you should replace these with your own credentials.

### Styling
- **Tailwind CSS** – loaded via CDN for utility classes.
- **Custom CSS** – glass effects, bracket layout, and responsive tweaks.

### Dependencies
- [Tailwind CSS](https://tailwindcss.com/) – utility‑first CSS framework.
- [Font Awesome](https://fontawesome.com/) – icons.
- [Supabase JS](https://supabase.com/docs/reference/javascript) – client library for cloud backups.

No build tools are required – just open the file in a modern browser.

---

## 📦 Installation & Deployment

1. **Clone or download** this repository.
2. Open `index.html` in your browser – everything runs locally.
3. (Optional) To enable cloud backup:
   - Create a Supabase project.
   - Replace `SUPABASE_URL` and `SUPABASE_ANON_KEY` in the script with your own.
   - Create the required table and RPC functions (see sample schema below).
4. Deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.) – no server‑side code needed.

### Sample Supabase Schema
```sql
CREATE TABLE backups (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  access_code TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RPC functions (example)
CREATE OR REPLACE FUNCTION upload_backup(
  p_username TEXT,
  p_access_code TEXT,
  p_data JSONB
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO backups (username, access_code, data)
  VALUES (p_username, p_access_code, p_data)
  ON CONFLICT (username) DO UPDATE SET data = EXCLUDED.data;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_backup(p_username TEXT)
RETURNS JSONB AS $$
BEGIN
  RETURN (SELECT data FROM backups WHERE username = p_username LIMIT 1);
END;
$$ LANGUAGE plpgsql;
```

> **Note**: The above schema is a simplified example. You can extend it with authentication or encryption as needed.

---

## 🔧 Customization & Extending

- **Group‑to‑Knockout Seeding** – the `advanceGroupQualifiers()` function currently supports hard‑coded pairings for 2 or 4 groups with 2 or 4 qualifiers each. You can extend it to handle other configurations.
- **Additional Format Options** – you can add more tournament structures by modifying the creation logic and rendering functions.
- **Styling** – all colors and sizes are controlled via Tailwind classes and custom CSS variables – easy to rebrand.

---

## 🤝 Contributing

Pull requests are welcome! If you find a bug or have a feature request, please open an issue.

---

## 📄 License

This project is open‑source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- Built with love by the Monarchs community.
- Icons by Font Awesome.
- Glass‑morphism inspiration from various UI trends.

---

**Enjoy running your tournaments!** 👑
