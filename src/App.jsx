import { useState, useRef } from "react";

const PROPERTY_TYPES = ["Agricultural Land", "Residential Plot", "Commercial Plot", "Farm Land", "Villa", "Apartment", "Independent House"];
const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const PRICE_UNITS = ["Per Gunta", "Total Price", "Per Acre", "Per Sq. Ft."];
const LOCATIONS = [
  "Hyderabad", "Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Jagtial", "Jangaon",
  "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam",
  "Kumuram Bheem Asifabad", "Mahabubabad", "Mahbubnagar", "Mancherial", "Medak",
  "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal",
  "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet",
  "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
];

const guntas_to_sqft = (g) => (g * 1089).toLocaleString();

function ImageUploader({ images, setImages }) {
  const inputRef = useRef();
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => [...prev, { url: ev.target.result, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };
  const remove = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));
  return (
    <div className="img-uploader">
      <div className="upload-zone" onClick={() => inputRef.current.click()}>
        <div className="upload-icon">📷</div>
        <p>Click or drop photos here</p>
        <span>Upload up to 10 property images</span>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
      </div>
      {images.length > 0 && (
        <div className="img-grid">
          {images.map((img, i) => (
            <div className="img-thumb" key={i}>
              <img src={img.url} alt={img.name} />
              <button className="img-remove" onClick={() => remove(i)}>✕</button>
              {i === 0 && <span className="img-badge">Main</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyCard({ prop, onContact }) {
  const [imgIdx, setImgIdx] = useState(0);
  return (
    <div className="prop-card">
      <div className="prop-img-wrap">
        {prop.images.length > 0 ? (
          <>
            <img src={prop.images[imgIdx].url} alt="property" className="prop-img" />
            {prop.images.length > 1 && (
              <div className="img-nav">
                <button onClick={() => setImgIdx((p) => (p - 1 + prop.images.length) % prop.images.length)}>‹</button>
                <span>{imgIdx + 1}/{prop.images.length}</span>
                <button onClick={() => setImgIdx((p) => (p + 1) % prop.images.length)}>›</button>
              </div>
            )}
          </>
        ) : (
          <div className="prop-img-placeholder">🏡</div>
        )}
        <div className="prop-tag">{prop.propertyType}</div>
      </div>
      <div className="prop-body">
        <h3>{prop.title}</h3>
        <div className="prop-loc">📍 {prop.location}</div>
        <div className="prop-specs">
          <span>📐 {prop.guntas} Guntas</span>
          <span>≈ {guntas_to_sqft(prop.guntas)} sq.ft</span>
          <span>🧭 {prop.facing}</span>
        </div>
        <div className="prop-price">
          <span className="price-num">₹{Number(prop.price).toLocaleString("en-IN")}</span>
          <span className="price-unit">{prop.priceUnit}</span>
        </div>
        {prop.description && <p className="prop-desc">{prop.description}</p>}
        <div className="prop-footer">
          <span className="seller-name">👤 {prop.sellerName}</span>
          <button className="contact-btn" onClick={() => onContact(prop)}>Contact Seller</button>
        </div>
      </div>
    </div>
  );
}

function SellForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: "", propertyType: "", location: "", guntas: "", facing: "",
    price: "", priceUnit: "Total Price", description: "", sellerName: "", sellerPhone: ""
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title) e.title = "Required";
    if (!form.propertyType) e.propertyType = "Required";
    if (!form.location) e.location = "Required";
    if (!form.guntas || isNaN(form.guntas) || Number(form.guntas) <= 0) e.guntas = "Enter valid guntas";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Enter valid price";
    if (!form.sellerName) e.sellerName = "Required";
    if (!form.sellerPhone || !/^\d{10}$/.test(form.sellerPhone)) e.sellerPhone = "Enter 10-digit number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit({ ...form, images, id: Date.now() });
  };

  return (
    <div className="form-wrap">
      <h2 className="form-title">📝 List Your Property</h2>
      <div className="form-grid">
        <div className="field full">
          <label>Property Title *</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 10 Gunta Farm Land in Nalgonda" />
          {errors.title && <span className="err">{errors.title}</span>}
        </div>
        <div className="field">
          <label>Property Type *</label>
          <select value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
            <option value="">Select type</option>
            {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          {errors.propertyType && <span className="err">{errors.propertyType}</span>}
        </div>
        <div className="field">
          <label>Location *</label>
          <select value={form.location} onChange={(e) => set("location", e.target.value)}>
            <option value="">Select location</option>
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </select>
          {errors.location && <span className="err">{errors.location}</span>}
        </div>
        <div className="field">
          <label>Area (Guntas) *</label>
          <div className="input-hint-wrap">
            <input type="number" value={form.guntas} onChange={(e) => set("guntas", e.target.value)} placeholder="e.g. 40" min="1" />
            {form.guntas > 0 && <span className="hint">≈ {guntas_to_sqft(form.guntas)} sq.ft · {(form.guntas / 40).toFixed(2)} Acres</span>}
          </div>
          {errors.guntas && <span className="err">{errors.guntas}</span>}
        </div>
        <div className="field">
          <label>Facing</label>
          <select value={form.facing} onChange={(e) => set("facing", e.target.value)}>
            <option value="">Select facing</option>
            {FACING_OPTIONS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Price (₹) *</label>
          <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. 500000" min="1" />
          {errors.price && <span className="err">{errors.price}</span>}
        </div>
        <div className="field">
          <label>Price Unit</label>
          <select value={form.priceUnit} onChange={(e) => set("priceUnit", e.target.value)}>
            {PRICE_UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Your Name *</label>
          <input value={form.sellerName} onChange={(e) => set("sellerName", e.target.value)} placeholder="Full name" />
          {errors.sellerName && <span className="err">{errors.sellerName}</span>}
        </div>
        <div className="field">
          <label>Phone Number *</label>
          <input type="tel" value={form.sellerPhone} onChange={(e) => set("sellerPhone", e.target.value)} placeholder="10-digit mobile" maxLength={10} />
          {errors.sellerPhone && <span className="err">{errors.sellerPhone}</span>}
        </div>
        <div className="field full">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Road access, water source, electricity, nearby landmarks..." rows={3} />
        </div>
        <div className="field full">
          <label>Property Photos</label>
          <ImageUploader images={images} setImages={setImages} />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn-submit" onClick={handleSubmit}>🏷️ List Property</button>
      </div>
    </div>
  );
}

function ContactModal({ prop, onClose }) {
  if (!prop) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3>Contact Seller</h3>
        <div className="contact-info">
          <div className="contact-row"><span>Property</span><strong>{prop.title}</strong></div>
          <div className="contact-row"><span>Seller</span><strong>{prop.sellerName}</strong></div>
          <div className="contact-row"><span>Phone</span>
            <a href={`tel:${prop.sellerPhone}`} className="phone-link">📞 {prop.sellerPhone}</a>
          </div>
          <div className="contact-row"><span>Price</span>
            <strong>₹{Number(prop.price).toLocaleString("en-IN")} ({prop.priceUnit})</strong>
          </div>
          <div className="contact-row"><span>Area</span><strong>{prop.guntas} Guntas ({guntas_to_sqft(prop.guntas)} sq.ft)</strong></div>
        </div>
        <a href={`tel:${prop.sellerPhone}`} className="call-btn">📞 Call Now</a>
      </div>
    </div>
  );
}

const SAMPLE = [
  {
    id: 1, title: "Prime Agricultural Land - Road Facing", propertyType: "Agricultural Land",
    location: "Nalgonda", guntas: "80", facing: "East", price: "2500000", priceUnit: "Total Price",
    sellerName: "Ravi Reddy", sellerPhone: "9876543210",
    description: "Fertile black soil, borewell, 30ft road access. Clear title document available.",
    images: []
  },
  {
    id: 2, title: "Residential Plot Near City", propertyType: "Residential Plot",
    location: "Rangareddy", guntas: "20", facing: "North-East", price: "180000", priceUnit: "Per Gunta",
    sellerName: "Suresh Rao", sellerPhone: "9845678901",
    description: "DTCP approved layout. All utilities available. Close to Outer Ring Road.",
    images: []
  },
  {
    id: 3, title: "Farm Land with Water Source", propertyType: "Farm Land",
    location: "Warangal", guntas: "160", facing: "West", price: "1200000", priceUnit: "Total Price",
    sellerName: "Manjunath Goud", sellerPhone: "9741234567",
    description: "Good quality soil, existing borewell, mango plantation.",
    images: []
  }
];

export default function App() {
  const [mode, setMode] = useState("home");
  const [listings, setListings] = useState(SAMPLE);
  const [contactProp, setContactProp] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterLoc, setFilterLoc] = useState("All");
  const [successMsg, setSuccessMsg] = useState("");

  const handleList = (data) => {
    setListings((p) => [data, ...p]);
    setMode("buy");
    setSuccessMsg("🎉 Your property has been listed successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filtered = listings.filter((p) => {
    const byType = filterType === "All" || p.propertyType === filterType;
    const byLoc = filterLoc === "All" || p.location === filterLoc;
    return byType && byLoc;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #c9a84c;
          --gold-light: #e8c97e;
          --earth: #2c1a0e;
          --earth-mid: #4a2f1a;
          --cream: #faf6ef;
          --cream2: #f0e8d8;
          --green: #2d5016;
          --green-light: #4a7a28;
          --text: #1a1208;
          --muted: #6b5840;
          --border: rgba(201,168,76,0.25);
        }
        body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text); min-height: 100vh; }

        /* HEADER */
        .header {
          background: linear-gradient(135deg, var(--earth) 0%, var(--earth-mid) 100%);
          padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 2px solid var(--gold);
          position: sticky; top: 0; z-index: 100;
          box-shadow: 0 4px 20px rgba(44,26,14,0.4);
        }
        .logo { display: flex; align-items: center; gap: 10px; padding: 14px 0; }
        .logo-icon { font-size: 28px; }
        .logo-text { font-family: 'Cormorant Garamond', serif; color: var(--gold); font-size: 24px; font-weight: 700; letter-spacing: 0.5px; line-height: 1; }
        .logo-sub { color: var(--gold-light); font-size: 11px; letter-spacing: 2px; opacity: 0.8; text-transform: uppercase; }
        .nav { display: flex; gap: 4px; }
        .nav-btn {
          background: none; border: none; color: var(--cream); font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; padding: 8px 16px; border-radius: 6px; cursor: pointer;
          transition: all 0.2s; letter-spacing: 0.5px; text-transform: uppercase;
        }
        .nav-btn:hover { background: rgba(201,168,76,0.15); color: var(--gold-light); }
        .nav-btn.active { background: var(--gold); color: var(--earth); font-weight: 600; }

        /* HOME */
        .hero {
          background: linear-gradient(160deg, var(--earth) 0%, #3d2410 50%, var(--green) 100%);
          min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 60px 24px; position: relative; overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 70% 30%, rgba(45,80,22,0.2) 0%, transparent 60%);
        }
        .hero-badge { background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.4); color: var(--gold-light); padding: 6px 18px; border-radius: 100px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; position: relative; }
        .hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px, 7vw, 80px); color: white; line-height: 1.05; margin-bottom: 16px; position: relative; }
        .hero h1 span { color: var(--gold); }
        .hero p { color: rgba(255,255,255,0.7); font-size: 17px; max-width: 520px; line-height: 1.7; margin-bottom: 48px; position: relative; }
        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; position: relative; }
        .hero-btn {
          padding: 16px 36px; border-radius: 10px; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.25s; border: none;
          display: flex; align-items: center; gap: 10px; letter-spacing: 0.3px;
        }
        .hero-btn.primary { background: var(--gold); color: var(--earth); box-shadow: 0 8px 24px rgba(201,168,76,0.35); }
        .hero-btn.primary:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(201,168,76,0.45); }
        .hero-btn.secondary { background: rgba(255,255,255,0.1); color: white; border: 1.5px solid rgba(255,255,255,0.3); backdrop-filter: blur(10px); }
        .hero-btn.secondary:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); }
        .stats { display: flex; gap: 40px; margin-top: 64px; position: relative; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 36px; color: var(--gold); font-weight: 700; }
        .stat-label { color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; }

        /* LISTINGS */
        .page { padding: 32px 24px; max-width: 1200px; margin: 0 auto; }
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .page-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; color: var(--earth); font-weight: 700; }
        .filters { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
        .filter-select { padding: 10px 16px; border: 1.5px solid var(--border); border-radius: 8px; background: white; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text); cursor: pointer; outline: none; }
        .filter-select:focus { border-color: var(--gold); }
        .listing-count { color: var(--muted); font-size: 14px; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }

        /* CARD */
        .prop-card { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 16px rgba(44,26,14,0.08); transition: all 0.3s; border: 1px solid rgba(201,168,76,0.1); }
        .prop-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(44,26,14,0.15); }
        .prop-img-wrap { position: relative; height: 210px; background: var(--cream2); overflow: hidden; }
        .prop-img { width: 100%; height: 100%; object-fit: cover; }
        .prop-img-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; font-size: 64px; opacity: 0.3; }
        .prop-tag { position: absolute; top: 12px; left: 12px; background: var(--earth); color: var(--gold-light); font-size: 11px; padding: 4px 12px; border-radius: 100px; letter-spacing: 1px; text-transform: uppercase; }
        .img-nav { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.5); border-radius: 100px; padding: 4px 12px; }
        .img-nav button { background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0 2px; }
        .img-nav span { color: white; font-size: 12px; }
        .prop-body { padding: 18px; }
        .prop-body h3 { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 700; margin-bottom: 6px; line-height: 1.3; color: var(--earth); }
        .prop-loc { color: var(--muted); font-size: 13px; margin-bottom: 12px; }
        .prop-specs { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
        .prop-specs span { background: var(--cream2); border: 1px solid var(--border); color: var(--earth-mid); font-size: 12px; padding: 4px 10px; border-radius: 6px; }
        .prop-price { display: flex; align-items: baseline; gap: 8px; margin-bottom: 10px; }
        .price-num { font-family: 'Cormorant Garamond', serif; font-size: 26px; color: var(--green); font-weight: 700; }
        .price-unit { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .prop-desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .prop-footer { display: flex; align-items: center; justify-content: space-between; }
        .seller-name { font-size: 13px; color: var(--muted); }
        .contact-btn { background: var(--green); color: white; border: none; padding: 9px 18px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .contact-btn:hover { background: var(--green-light); transform: scale(1.02); }

        /* FORM */
        .form-wrap { max-width: 860px; margin: 0 auto; padding: 32px 24px; }
        .form-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 700; color: var(--earth); margin-bottom: 28px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field.full { grid-column: 1 / -1; }
        .field label { font-size: 13px; font-weight: 600; color: var(--earth-mid); letter-spacing: 0.3px; text-transform: uppercase; }
        .field input, .field select, .field textarea {
          padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text);
          background: white; outline: none; transition: border 0.2s;
        }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
        .field textarea { resize: vertical; min-height: 80px; }
        .err { color: #c0392b; font-size: 12px; }
        .input-hint-wrap { display: flex; flex-direction: column; gap: 4px; }
        .hint { font-size: 12px; color: var(--green-light); font-weight: 500; }
        .form-actions { display: flex; gap: 12px; margin-top: 28px; justify-content: flex-end; }
        .btn-cancel { padding: 12px 28px; border: 1.5px solid var(--border); background: white; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; color: var(--muted); transition: all 0.2s; }
        .btn-cancel:hover { border-color: var(--muted); }
        .btn-submit { padding: 12px 32px; background: var(--gold); color: var(--earth); border: none; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(201,168,76,0.3); }
        .btn-submit:hover { background: var(--gold-light); transform: translateY(-1px); }

        /* IMAGE UPLOADER */
        .img-uploader { display: flex; flex-direction: column; gap: 14px; }
        .upload-zone { border: 2px dashed var(--border); border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--cream); }
        .upload-zone:hover { border-color: var(--gold); background: rgba(201,168,76,0.05); }
        .upload-icon { font-size: 32px; margin-bottom: 8px; }
        .upload-zone p { font-weight: 600; color: var(--earth-mid); margin-bottom: 4px; }
        .upload-zone span { font-size: 12px; color: var(--muted); }
        .img-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .img-thumb { position: relative; width: 96px; height: 96px; border-radius: 8px; overflow: hidden; border: 2px solid var(--border); }
        .img-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .img-remove { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.65); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; }
        .img-badge { position: absolute; bottom: 4px; left: 4px; background: var(--gold); color: var(--earth); font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase; }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; background: rgba(44,26,14,0.6); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal { background: white; border-radius: 16px; padding: 32px; max-width: 440px; width: 100%; position: relative; box-shadow: 0 20px 60px rgba(44,26,14,0.3); }
        .modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 18px; cursor: pointer; color: var(--muted); }
        .modal h3 { font-family: 'Cormorant Garamond', serif; font-size: 26px; color: var(--earth); margin-bottom: 20px; }
        .contact-info { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
        .contact-row { display: flex; flex-direction: column; gap: 3px; padding-bottom: 14px; border-bottom: 1px solid var(--cream2); }
        .contact-row span { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); }
        .contact-row strong { color: var(--earth); font-size: 15px; }
        .phone-link { color: var(--green); font-weight: 700; font-size: 17px; text-decoration: none; }
        .call-btn { display: block; text-align: center; background: var(--green); color: white; padding: 14px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; transition: all 0.2s; }
        .call-btn:hover { background: var(--green-light); }

        /* SUCCESS */
        .success-bar { position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: var(--green); color: white; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; z-index: 150; box-shadow: 0 8px 24px rgba(45,80,22,0.35); animation: slideDown 0.3s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .empty { text-align: center; padding: 64px 24px; color: var(--muted); }
        .empty-icon { font-size: 48px; margin-bottom: 12px; }
        @media(max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; }
          .stats { gap: 24px; }
          .hero h1 { font-size: 36px; }
          .hero-actions { flex-direction: column; align-items: center; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="header">
        <div className="logo">
          <span className="logo-icon">🏡</span>
          <div>
            <div className="logo-text">BhoomiDeals</div>
            <div className="logo-sub">Land · Property · Real Estate</div>
          </div>
        </div>
        <nav className="nav">
          <button className={`nav-btn ${mode === "home" ? "active" : ""}`} onClick={() => setMode("home")}>Home</button>
          <button className={`nav-btn ${mode === "buy" ? "active" : ""}`} onClick={() => setMode("buy")}>🔍 Buy</button>
          <button className={`nav-btn ${mode === "sell" ? "active" : ""}`} onClick={() => setMode("sell")}>🏷️ Sell</button>
        </nav>
      </div>

      {successMsg && <div className="success-bar">{successMsg}</div>}

      {mode === "home" && (
        <div className="hero">
          <div className="hero-badge">Telangana's Premier Land Marketplace</div>
          <h1>Buy & Sell <span>Agricultural</span><br />& Residential Land</h1>
          <p>Discover verified properties measured in Guntas — farm lands, plots, and estates across Telangana. Connect directly with sellers.</p>
          <div className="hero-actions">
            <button className="hero-btn primary" onClick={() => setMode("buy")}>🔍 Browse Properties</button>
            <button className="hero-btn secondary" onClick={() => setMode("sell")}>🏷️ List Your Property</button>
          </div>
          <div className="stats">
            <div className="stat"><div className="stat-num">{listings.length}+</div><div className="stat-label">Listings</div></div>
            <div className="stat"><div className="stat-num">33</div><div className="stat-label">Districts</div></div>
            <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Direct Deals</div></div>
          </div>
        </div>
      )}

      {mode === "buy" && (
        <div className="page">
          <div className="page-header">
            <div className="page-title">Available Properties</div>
          </div>
          <div className="filters">
            <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className="filter-select" value={filterLoc} onChange={(e) => setFilterLoc(e.target.value)}>
              <option value="All">All Locations</option>
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="listing-count">{filtered.length} properties found</div>
          {filtered.length > 0 ? (
            <div className="grid">
              {filtered.map((p) => <PropertyCard key={p.id} prop={p} onContact={setContactProp} />)}
            </div>
          ) : (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <p>No properties found for this filter.</p>
            </div>
          )}
        </div>
      )}

      {mode === "sell" && (
        <SellForm onSubmit={handleList} onCancel={() => setMode("home")} />
      )}

      <ContactModal prop={contactProp} onClose={() => setContactProp(null)} />
    </>
  );
}
