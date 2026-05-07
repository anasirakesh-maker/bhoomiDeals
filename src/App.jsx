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

const getUsers = () => JSON.parse(localStorage.getItem("bd_users") || "[]");
const saveUsers = (users) => localStorage.setItem("bd_users", JSON.stringify(users));

// ─── SIGNUP ───────────────────────────────────────────────────────────────────
function SignupForm({ onSignup, onSwitch }) {
  const [form, setForm] = useState({ name: "", mobile: "", password: "", confirm: "", district: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter valid 10-digit mobile number";
    if (!form.district) e.district = "Please select your district";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const users = getUsers();
    if (users.find(u => u.mobile === form.mobile)) {
      setErrors({ mobile: "This mobile number is already registered. Please login." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newUser = { id: Date.now(), name: form.name.trim(), mobile: form.mobile, phone: form.mobile, password: form.password, district: form.district, joinedAt: new Date().toLocaleDateString("en-IN") };
      users.push(newUser);
      saveUsers(users);
      setLoading(false);
      onSignup(newUser);
    }, 800);
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">🏡</div>
          <h1>BhoomiDeals</h1>
          <p>Telangana's most trusted platform to buy and sell land across all 33 districts</p>
          <div className="auth-features">
            <div className="auth-feature">✅ All 33 Telangana Districts</div>
            <div className="auth-feature">✅ Measurements in Guntas</div>
            <div className="auth-feature">✅ Direct Seller Contact</div>
            <div className="auth-feature">✅ Free to List & Browse</div>
          </div>
        </div>
        <div className="auth-card">
          <h2>Create Your Account</h2>
          <p className="auth-sub">Join thousands of buyers & sellers in Telangana</p>

          <div className="auth-field">
            <label>👤 Full Name</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Enter your full name" />
            {errors.name && <span className="err">⚠ {errors.name}</span>}
          </div>

          <div className="auth-row">
            <div className="auth-field">
              <label>📱 Mobile Number</label>
              <input type="tel" value={form.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile number" maxLength={10} />
              {errors.mobile && <span className="err">⚠ {errors.mobile}</span>}
            </div>
            <div className="auth-field">
              <label>📍 Your District</label>
              <select value={form.district} onChange={e => set("district", e.target.value)}>
                <option value="">Select district</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
              {errors.district && <span className="err">⚠ {errors.district}</span>}
            </div>
          </div>

          <div className="auth-row">
            <div className="auth-field">
              <label>🔒 Password</label>
              <div className="pass-wrap">
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} placeholder="Min 6 characters" />
                <button className="eye-btn" onClick={() => setShowPass(p => !p)}>{showPass ? "🙈" : "👁️"}</button>
              </div>
              {errors.password && <span className="err">⚠ {errors.password}</span>}
            </div>
            <div className="auth-field">
              <label>🔒 Confirm Password</label>
              <div className="pass-wrap">
                <input type={showPass ? "text" : "password"} value={form.confirm} onChange={e => set("confirm", e.target.value)} placeholder="Re-enter password" />
              </div>
              {errors.confirm && <span className="err">⚠ {errors.confirm}</span>}
            </div>
          </div>

          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "⏳ Creating Account..." : "✅ Create Account"}
          </button>

          <div className="auth-divider"><span>Already have an account?</span></div>
          <button className="auth-btn-outline" onClick={onSwitch}>🔐 Login Instead</button>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginForm({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const e = {};
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter valid 10-digit mobile number";
    if (!form.password) e.password = "Please enter your password";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(u => u.mobile === form.mobile && u.password === form.password);
      setLoading(false);
      if (!user) {
        setErrors({ password: "Incorrect mobile number or password. Please try again." });
        return;
      }
      onLogin(user);
    }, 800);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div className="auth-bg">
      <div className="auth-container login-only">
        <div className="auth-left">
          <div className="auth-brand">🏡</div>
          <h1>BhoomiDeals</h1>
          <p>Telangana's most trusted platform to buy and sell land across all 33 districts</p>
          <div className="auth-features">
            <div className="auth-feature">✅ All 33 Telangana Districts</div>
            <div className="auth-feature">✅ Measurements in Guntas</div>
            <div className="auth-feature">✅ Direct Seller Contact</div>
            <div className="auth-feature">✅ Free to List & Browse</div>
          </div>
        </div>
        <div className="auth-card login-card">
          <h2>Welcome Back! 👋</h2>
          <p className="auth-sub">Login to your BhoomiDeals account</p>

          <div className="auth-field">
            <label>📱 Mobile Number</label>
            <input type="tel" value={form.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g, ""))} onKeyDown={handleKey} placeholder="Enter 10-digit mobile number" maxLength={10} autoFocus />
            {errors.mobile && <span className="err">⚠ {errors.mobile}</span>}
          </div>

          <div className="auth-field">
            <label>🔒 Password</label>
            <div className="pass-wrap">
              <input type={showPass ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} onKeyDown={handleKey} placeholder="Your password" />
              <button className="eye-btn" onClick={() => setShowPass(p => !p)}>{showPass ? "🙈" : "👁️"}</button>
            </div>
            {errors.password && <span className="err">⚠ {errors.password}</span>}
          </div>

          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "⏳ Logging in..." : "🔐 Login to BhoomiDeals"}
          </button>

          <div className="auth-divider"><span>New to BhoomiDeals?</span></div>
          <button className="auth-btn-outline" onClick={onSwitch}>✅ Create Free Account</button>
        </div>
      </div>
    </div>
  );
}

// ─── IMAGE UPLOADER ───────────────────────────────────────────────────────────
function ImageUploader({ images, setImages }) {
  const inputRef = useRef();
  const handleFiles = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setImages(prev => [...prev, { url: ev.target.result, name: file.name }]);
      reader.readAsDataURL(file);
    });
  };
  return (
    <div className="img-uploader">
      <div className="upload-zone" onClick={() => inputRef.current.click()}>
        <div className="upload-icon">📷</div>
        <p>Click to upload property photos</p>
        <span>Upload multiple images</span>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
      </div>
      {images.length > 0 && (
        <div className="img-grid">
          {images.map((img, i) => (
            <div className="img-thumb" key={i}>
              <img src={img.url} alt={img.name} />
              <button className="img-remove" onClick={() => setImages(p => p.filter((_, idx) => idx !== i))}>✕</button>
              {i === 0 && <span className="img-badge">Main</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PROPERTY CARD ────────────────────────────────────────────────────────────
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
                <button onClick={() => setImgIdx(p => (p - 1 + prop.images.length) % prop.images.length)}>‹</button>
                <span>{imgIdx + 1}/{prop.images.length}</span>
                <button onClick={() => setImgIdx(p => (p + 1) % prop.images.length)}>›</button>
              </div>
            )}
          </>
        ) : <div className="prop-img-placeholder">🏡</div>}
        <div className="prop-tag">{prop.propertyType}</div>
      </div>
      <div className="prop-body">
        <h3>{prop.title}</h3>
        <div className="prop-loc">📍 {prop.location}</div>
        <div className="prop-specs">
          <span>📐 {prop.guntas} Guntas</span>
          <span>≈ {guntas_to_sqft(prop.guntas)} sq.ft</span>
          {prop.facing && <span>🧭 {prop.facing}</span>}
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

// ─── SELL FORM ────────────────────────────────────────────────────────────────
function SellForm({ onSubmit, onCancel, user }) {
  const [form, setForm] = useState({ title: "", propertyType: "", location: user.district || "", guntas: "", facing: "", price: "", priceUnit: "Total Price", description: "", sellerName: user.name, sellerPhone: user.phone });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title) e.title = "Required";
    if (!form.propertyType) e.propertyType = "Required";
    if (!form.location) e.location = "Required";
    if (!form.guntas || isNaN(form.guntas) || Number(form.guntas) <= 0) e.guntas = "Enter valid guntas";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Enter valid price";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="form-wrap">
      <h2 className="form-title">📝 List Your Property</h2>
      <div className="user-info-bar">👤 Posting as <strong>{user.name}</strong> · 📍 {user.district}</div>
      <div className="form-grid">
        <div className="field full">
          <label>Property Title *</label>
          <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. 10 Gunta Farm Land in Nalgonda" />
          {errors.title && <span className="err">{errors.title}</span>}
        </div>
        <div className="field">
          <label>Property Type *</label>
          <select value={form.propertyType} onChange={e => set("propertyType", e.target.value)}>
            <option value="">Select type</option>
            {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          {errors.propertyType && <span className="err">{errors.propertyType}</span>}
        </div>
        <div className="field">
          <label>Location *</label>
          <select value={form.location} onChange={e => set("location", e.target.value)}>
            <option value="">Select district</option>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
          {errors.location && <span className="err">{errors.location}</span>}
        </div>
        <div className="field">
          <label>Area (Guntas) *</label>
          <div className="input-hint-wrap">
            <input type="number" value={form.guntas} onChange={e => set("guntas", e.target.value)} placeholder="e.g. 40" min="1" />
            {form.guntas > 0 && <span className="hint">≈ {guntas_to_sqft(form.guntas)} sq.ft · {(form.guntas / 40).toFixed(2)} Acres</span>}
          </div>
          {errors.guntas && <span className="err">{errors.guntas}</span>}
        </div>
        <div className="field">
          <label>Facing</label>
          <select value={form.facing} onChange={e => set("facing", e.target.value)}>
            <option value="">Select facing</option>
            {FACING_OPTIONS.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Price (₹) *</label>
          <input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="e.g. 500000" min="1" />
          {errors.price && <span className="err">{errors.price}</span>}
        </div>
        <div className="field">
          <label>Price Unit</label>
          <select value={form.priceUnit} onChange={e => set("priceUnit", e.target.value)}>
            {PRICE_UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Seller Name</label>
          <input value={form.sellerName} onChange={e => set("sellerName", e.target.value)} />
        </div>
        <div className="field">
          <label>Phone Number</label>
          <input type="tel" value={form.sellerPhone} onChange={e => set("sellerPhone", e.target.value)} maxLength={10} />
        </div>
        <div className="field full">
          <label>Description</label>
          <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Road access, water source, electricity, nearby landmarks..." rows={3} />
        </div>
        <div className="field full">
          <label>Property Photos</label>
          <ImageUploader images={images} setImages={setImages} />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn-submit" onClick={() => { if (validate()) onSubmit({ ...form, images, id: Date.now(), postedBy: user.id }); }}>🏷️ List Property</button>
      </div>
    </div>
  );
}

// ─── CONTACT MODAL ────────────────────────────────────────────────────────────
function ContactModal({ prop, onClose }) {
  if (!prop) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3>Contact Seller</h3>
        <div className="contact-info">
          <div className="contact-row"><span>Property</span><strong>{prop.title}</strong></div>
          <div className="contact-row"><span>Seller</span><strong>{prop.sellerName}</strong></div>
          <div className="contact-row"><span>Phone</span><a href={`tel:${prop.sellerPhone}`} className="phone-link">📞 {prop.sellerPhone}</a></div>
          <div className="contact-row"><span>Price</span><strong>₹{Number(prop.price).toLocaleString("en-IN")} ({prop.priceUnit})</strong></div>
          <div className="contact-row"><span>Area</span><strong>{prop.guntas} Guntas ({guntas_to_sqft(prop.guntas)} sq.ft)</strong></div>
        </div>
        <a href={`tel:${prop.sellerPhone}`} className="call-btn">📞 Call Now</a>
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage({ user, listings, onLogout }) {
  const myListings = listings.filter(p => p.postedBy === user.id);
  return (
    <div className="page">
      <div className="profile-card">
        <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h3>{user.name}</h3>
          <p>📞 {user.phone}</p>
          <p>📱 Mobile: {user.mobile}</p>
          <p>📍 {user.district}</p>
          <p>📅 Joined {user.joinedAt}</p>
        </div>
      </div>
      <h3 className="my-listings-title">🏡 My Listings ({myListings.length})</h3>
      {myListings.length === 0
        ? <div className="empty"><div className="empty-icon">🏡</div><p>You haven't listed any properties yet.</p></div>
        : <div className="grid">{myListings.map(p => <PropertyCard key={p.id} prop={p} onContact={() => {}} />)}</div>
      }
      <button className="logout-btn" onClick={onLogout}>🚪 Logout from BhoomiDeals</button>
    </div>
  );
}

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const SAMPLE = [
  { id: 1, title: "Prime Agricultural Land - Road Facing", propertyType: "Agricultural Land", location: "Nalgonda", guntas: "80", facing: "East", price: "2500000", priceUnit: "Total Price", sellerName: "Ravi Reddy", sellerPhone: "9876543210", description: "Fertile black soil, borewell, 30ft road access. Clear title document available.", images: [], postedBy: 0 },
  { id: 2, title: "Residential Plot Near ORR", propertyType: "Residential Plot", location: "Rangareddy", guntas: "20", facing: "North-East", price: "180000", priceUnit: "Per Gunta", sellerName: "Suresh Rao", sellerPhone: "9845678901", description: "DTCP approved layout. All utilities available. Close to Outer Ring Road.", images: [], postedBy: 0 },
  { id: 3, title: "Farm Land with Borewell", propertyType: "Farm Land", location: "Warangal", guntas: "160", facing: "West", price: "1200000", priceUnit: "Total Price", sellerName: "Manjunath Goud", sellerPhone: "9741234567", description: "Good quality soil, existing borewell, mango plantation.", images: [], postedBy: 0 }
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("home");
  const [listings, setListings] = useState(SAMPLE);
  const [contactProp, setContactProp] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterLoc, setFilterLoc] = useState("All");
  const [successMsg, setSuccessMsg] = useState("");

  const toast = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 4000); };
  const handleLogin = (u) => { setUser(u); setMode("home"); toast("👋 Welcome back, " + u.name + "!"); };
  const handleSignup = (u) => { setUser(u); setMode("home"); toast("🎉 Welcome to BhoomiDeals, " + u.name + "!"); };
  const handleLogout = () => { setUser(null); setAuthMode("login"); setMode("home"); };
  const handleList = (data) => { setListings(p => [data, ...p]); setMode("buy"); toast("🎉 Property listed successfully!"); };

  const filtered = listings.filter(p => (filterType === "All" || p.propertyType === filterType) && (filterLoc === "All" || p.location === filterLoc));

  if (!user) {
    return (
      <>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', sans-serif; }
          .auth-bg { min-height: 100vh; background: linear-gradient(135deg, #1a0e05 0%, #2c1a0e 40%, #1e3a0a 100%); display: flex; align-items: center; justify-content: center; padding: 20px; }
          .auth-container { display: flex; gap: 0; width: 100%; max-width: 900px; border-radius: 20px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.5); }
          .login-only { max-width: 700px; }
          .auth-left { background: linear-gradient(160deg, #2c1a0e, #2d5016); padding: 40px 32px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
          .auth-brand { font-size: 52px; margin-bottom: 12px; }
          .auth-left h1 { font-size: 32px; font-weight: 800; color: #c9a84c; margin-bottom: 12px; }
          .auth-left p { color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.7; margin-bottom: 28px; }
          .auth-features { display: flex; flex-direction: column; gap: 10px; }
          .auth-feature { color: rgba(255,255,255,0.85); font-size: 14px; }
          .auth-card { background: white; padding: 36px 32px; flex: 1.2; overflow-y: auto; max-height: 95vh; }
          .login-card { flex: 1; }
          .auth-card h2 { font-size: 26px; font-weight: 800; color: #2c1a0e; margin-bottom: 4px; }
          .auth-sub { font-size: 13px; color: #6b5840; margin-bottom: 24px; }
          .auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
          .auth-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
          .auth-field label { font-size: 12px; font-weight: 700; color: #4a2f1a; text-transform: uppercase; letter-spacing: 0.3px; }
          .auth-field input, .auth-field select { padding: 12px 14px; border: 1.5px solid rgba(201,168,76,0.35); border-radius: 9px; font-size: 14px; color: #1a1208; outline: none; font-family: inherit; width: 100%; transition: border 0.2s; }
          .auth-field input:focus, .auth-field select:focus { border-color: #c9a84c; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); }
          .pass-wrap { position: relative; }
          .pass-wrap input { padding-right: 44px; }
          .eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; }
          .auth-btn { width: 100%; padding: 14px; background: #c9a84c; color: #2c1a0e; border: none; border-radius: 10px; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.2s; margin-top: 4px; }
          .auth-btn:hover:not(:disabled) { background: #e8c97e; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,0.3); }
          .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
          .auth-btn-outline { width: 100%; padding: 13px; background: white; color: #2d5016; border: 2px solid #2d5016; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
          .auth-btn-outline:hover { background: #f0f8ea; }
          .auth-divider { display: flex; align-items: center; gap: 12px; margin: 16px 0; }
          .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: rgba(201,168,76,0.25); }
          .auth-divider span { font-size: 12px; color: #6b5840; white-space: nowrap; }
          .err { color: #c0392b; font-size: 11px; }
          @media(max-width: 640px) { .auth-container { flex-direction: column; } .auth-left { padding: 24px; } .auth-card { padding: 24px 20px; } .auth-row { grid-template-columns: 1fr; gap: 0; } }
        `}</style>
        {authMode === "login"
          ? <LoginForm onLogin={handleLogin} onSwitch={() => setAuthMode("signup")} />
          : <SignupForm onSignup={handleSignup} onSwitch={() => setAuthMode("login")} />}
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --gold:#c9a84c; --gold-light:#e8c97e; --earth:#2c1a0e; --earth-mid:#4a2f1a; --cream:#faf6ef; --cream2:#f0e8d8; --green:#2d5016; --green-light:#4a7a28; --text:#1a1208; --muted:#6b5840; --border:rgba(201,168,76,0.25); }
        body { font-family:'DM Sans',sans-serif; background:var(--cream); color:var(--text); min-height:100vh; }
        .header { background:linear-gradient(135deg,var(--earth) 0%,var(--earth-mid) 100%); padding:0 20px; display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid var(--gold); position:sticky; top:0; z-index:100; box-shadow:0 4px 20px rgba(44,26,14,0.4); }
        .logo { display:flex; align-items:center; gap:8px; padding:12px 0; cursor:pointer; }
        .logo-icon { font-size:24px; }
        .logo-text { font-family:'Cormorant Garamond',serif; color:var(--gold); font-size:22px; font-weight:700; }
        .logo-sub { color:var(--gold-light); font-size:10px; letter-spacing:2px; opacity:0.8; text-transform:uppercase; }
        .nav { display:flex; gap:2px; align-items:center; }
        .nav-btn { background:none; border:none; color:var(--cream); font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; padding:7px 12px; border-radius:6px; cursor:pointer; transition:all 0.2s; text-transform:uppercase; letter-spacing:0.5px; }
        .nav-btn:hover { background:rgba(201,168,76,0.15); color:var(--gold-light); }
        .nav-btn.active { background:var(--gold); color:var(--earth); font-weight:700; }
        .user-chip { display:flex; align-items:center; gap:6px; background:rgba(201,168,76,0.15); border:1px solid rgba(201,168,76,0.3); border-radius:100px; padding:5px 12px; cursor:pointer; transition:all 0.2s; }
        .user-chip:hover { background:rgba(201,168,76,0.25); }
        .user-chip-avatar { width:26px; height:26px; border-radius:50%; background:var(--gold); color:var(--earth); font-weight:800; font-size:12px; display:flex; align-items:center; justify-content:center; }
        .user-chip-name { color:var(--gold-light); font-size:12px; font-weight:500; }
        .hero { background:linear-gradient(160deg,var(--earth) 0%,#3d2410 50%,var(--green) 100%); min-height:80vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:60px 24px; position:relative; overflow:hidden; }
        .hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 30% 50%,rgba(201,168,76,0.08) 0%,transparent 60%),radial-gradient(ellipse at 70% 30%,rgba(45,80,22,0.2) 0%,transparent 60%); }
        .hero-badge { background:rgba(201,168,76,0.15); border:1px solid rgba(201,168,76,0.4); color:var(--gold-light); padding:6px 18px; border-radius:100px; font-size:11px; letter-spacing:2px; text-transform:uppercase; margin-bottom:16px; position:relative; }
        .welcome-msg { color:var(--gold-light); font-size:15px; margin-bottom:8px; position:relative; }
        .hero h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,7vw,72px); color:white; line-height:1.05; margin-bottom:16px; position:relative; }
        .hero h1 span { color:var(--gold); }
        .hero p { color:rgba(255,255,255,0.7); font-size:15px; max-width:500px; line-height:1.7; margin-bottom:40px; position:relative; }
        .hero-actions { display:flex; gap:14px; flex-wrap:wrap; justify-content:center; position:relative; }
        .hero-btn { padding:14px 30px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.25s; border:none; display:flex; align-items:center; gap:8px; }
        .hero-btn.primary { background:var(--gold); color:var(--earth); box-shadow:0 8px 24px rgba(201,168,76,0.35); }
        .hero-btn.primary:hover { background:var(--gold-light); transform:translateY(-2px); }
        .hero-btn.secondary { background:rgba(255,255,255,0.1); color:white; border:1.5px solid rgba(255,255,255,0.3); }
        .hero-btn.secondary:hover { background:rgba(255,255,255,0.18); transform:translateY(-2px); }
        .stats { display:flex; gap:40px; margin-top:56px; position:relative; }
        .stat { text-align:center; }
        .stat-num { font-family:'Cormorant Garamond',serif; font-size:36px; color:var(--gold); font-weight:700; }
        .stat-label { color:rgba(255,255,255,0.5); font-size:10px; text-transform:uppercase; letter-spacing:1.5px; }
        .page { padding:28px 20px; max-width:1200px; margin:0 auto; }
        .page-title { font-family:'Cormorant Garamond',serif; font-size:28px; color:var(--earth); font-weight:700; margin-bottom:18px; }
        .filters { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:20px; }
        .filter-select { padding:10px 14px; border:1.5px solid var(--border); border-radius:8px; background:white; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text); cursor:pointer; outline:none; }
        .filter-select:focus { border-color:var(--gold); }
        .listing-count { color:var(--muted); font-size:13px; margin-bottom:16px; }
        .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }
        .prop-card { background:white; border-radius:14px; overflow:hidden; box-shadow:0 2px 16px rgba(44,26,14,0.08); transition:all 0.3s; border:1px solid rgba(201,168,76,0.1); }
        .prop-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(44,26,14,0.15); }
        .prop-img-wrap { position:relative; height:200px; background:var(--cream2); overflow:hidden; }
        .prop-img { width:100%; height:100%; object-fit:cover; }
        .prop-img-placeholder { display:flex; align-items:center; justify-content:center; height:100%; font-size:56px; opacity:0.3; }
        .prop-tag { position:absolute; top:10px; left:10px; background:var(--earth); color:var(--gold-light); font-size:10px; padding:3px 10px; border-radius:100px; letter-spacing:1px; text-transform:uppercase; }
        .img-nav { position:absolute; bottom:8px; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:6px; background:rgba(0,0,0,0.5); border-radius:100px; padding:3px 10px; }
        .img-nav button { background:none; border:none; color:white; font-size:16px; cursor:pointer; }
        .img-nav span { color:white; font-size:11px; }
        .prop-body { padding:16px; }
        .prop-body h3 { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:700; margin-bottom:5px; color:var(--earth); }
        .prop-loc { color:var(--muted); font-size:12px; margin-bottom:10px; }
        .prop-specs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
        .prop-specs span { background:var(--cream2); border:1px solid var(--border); color:var(--earth-mid); font-size:11px; padding:3px 7px; border-radius:5px; }
        .prop-price { display:flex; align-items:baseline; gap:6px; margin-bottom:8px; }
        .price-num { font-family:'Cormorant Garamond',serif; font-size:24px; color:var(--green); font-weight:700; }
        .price-unit { font-size:11px; color:var(--muted); text-transform:uppercase; }
        .prop-desc { font-size:12px; color:var(--muted); line-height:1.6; margin-bottom:12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .prop-footer { display:flex; align-items:center; justify-content:space-between; }
        .seller-name { font-size:12px; color:var(--muted); }
        .contact-btn { background:var(--green); color:white; border:none; padding:8px 16px; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s; }
        .contact-btn:hover { background:var(--green-light); }
        .form-wrap { max-width:860px; margin:0 auto; padding:28px 20px; }
        .form-title { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:700; color:var(--earth); margin-bottom:8px; }
        .user-info-bar { background:rgba(45,80,22,0.08); border:1px solid rgba(45,80,22,0.2); border-radius:8px; padding:10px 16px; font-size:13px; color:var(--green); margin-bottom:20px; }
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .field { display:flex; flex-direction:column; gap:5px; }
        .field.full { grid-column:1/-1; }
        .field label { font-size:12px; font-weight:700; color:var(--earth-mid); letter-spacing:0.3px; text-transform:uppercase; }
        .field input,.field select,.field textarea { padding:11px 13px; border:1.5px solid var(--border); border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text); background:white; outline:none; transition:border 0.2s; }
        .field input:focus,.field select:focus,.field textarea:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
        .field textarea { resize:vertical; min-height:80px; }
        .err { color:#c0392b; font-size:11px; }
        .input-hint-wrap { display:flex; flex-direction:column; gap:3px; }
        .hint { font-size:11px; color:var(--green-light); font-weight:500; }
        .form-actions { display:flex; gap:12px; margin-top:24px; justify-content:flex-end; }
        .btn-cancel { padding:11px 24px; border:1.5px solid var(--border); background:white; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; color:var(--muted); }
        .btn-submit { padding:11px 28px; background:var(--gold); color:var(--earth); border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; box-shadow:0 4px 16px rgba(201,168,76,0.3); }
        .img-uploader { display:flex; flex-direction:column; gap:12px; }
        .upload-zone { border:2px dashed var(--border); border-radius:10px; padding:28px; text-align:center; cursor:pointer; transition:all 0.2s; background:var(--cream); }
        .upload-zone:hover { border-color:var(--gold); }
        .upload-icon { font-size:28px; margin-bottom:6px; }
        .upload-zone p { font-weight:600; color:var(--earth-mid); margin-bottom:3px; font-size:14px; }
        .upload-zone span { font-size:12px; color:var(--muted); }
        .img-grid { display:flex; flex-wrap:wrap; gap:8px; }
        .img-thumb { position:relative; width:90px; height:90px; border-radius:7px; overflow:hidden; border:2px solid var(--border); }
        .img-thumb img { width:100%; height:100%; object-fit:cover; }
        .img-remove { position:absolute; top:3px; right:3px; background:rgba(0,0,0,0.65); color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:10px; display:flex; align-items:center; justify-content:center; }
        .img-badge { position:absolute; bottom:3px; left:3px; background:var(--gold); color:var(--earth); font-size:8px; padding:2px 5px; border-radius:3px; font-weight:700; text-transform:uppercase; }
        .modal-overlay { position:fixed; inset:0; background:rgba(44,26,14,0.6); backdrop-filter:blur(4px); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
        .modal { background:white; border-radius:16px; padding:28px; max-width:400px; width:100%; position:relative; box-shadow:0 20px 60px rgba(44,26,14,0.3); }
        .modal-close { position:absolute; top:14px; right:14px; background:none; border:none; font-size:18px; cursor:pointer; color:var(--muted); }
        .modal h3 { font-family:'Cormorant Garamond',serif; font-size:24px; color:var(--earth); margin-bottom:16px; }
        .contact-info { display:flex; flex-direction:column; gap:12px; margin-bottom:20px; }
        .contact-row { display:flex; flex-direction:column; gap:2px; padding-bottom:12px; border-bottom:1px solid var(--cream2); }
        .contact-row span { font-size:10px; text-transform:uppercase; letter-spacing:1px; color:var(--muted); }
        .contact-row strong { color:var(--earth); font-size:14px; }
        .phone-link { color:var(--green); font-weight:700; font-size:16px; text-decoration:none; }
        .call-btn { display:block; text-align:center; background:var(--green); color:white; padding:13px; border-radius:9px; text-decoration:none; font-weight:700; font-size:14px; }
        .success-bar { position:fixed; top:72px; left:50%; transform:translateX(-50%); background:var(--green); color:white; padding:12px 24px; border-radius:10px; font-weight:600; font-size:13px; z-index:150; box-shadow:0 8px 24px rgba(45,80,22,0.35); white-space:nowrap; animation:fadeIn 0.3s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        .empty { text-align:center; padding:48px 20px; color:var(--muted); }
        .empty-icon { font-size:44px; margin-bottom:10px; }
        .profile-card { background:white; border-radius:16px; padding:24px; display:flex; align-items:center; gap:20px; margin-bottom:28px; box-shadow:0 2px 16px rgba(44,26,14,0.08); border:1px solid var(--border); }
        .profile-avatar { width:68px; height:68px; border-radius:50%; background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:var(--earth); font-size:30px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 4px 16px rgba(201,168,76,0.3); }
        .profile-info h3 { font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:700; color:var(--earth); margin-bottom:6px; }
        .profile-info p { font-size:13px; color:var(--muted); margin-bottom:3px; }
        .my-listings-title { font-family:'Cormorant Garamond',serif; font-size:22px; color:var(--earth); font-weight:700; margin-bottom:16px; }
        .logout-btn { margin-top:32px; padding:13px 28px; background:#c0392b; color:white; border:none; border-radius:9px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s; }
        .logout-btn:hover { background:#e74c3c; transform:translateY(-1px); }
        @media(max-width:600px) { .form-grid{grid-template-columns:1fr} .stats{gap:20px} .hero h1{font-size:32px} .hero-actions{flex-direction:column;align-items:center} .grid{grid-template-columns:1fr} .profile-card{flex-direction:column;text-align:center} .nav-btn{padding:6px 8px;font-size:11px} .stat-num{font-size:28px} }
      `}</style>

      <div className="header">
        <div className="logo" onClick={() => setMode("home")}>
          <span className="logo-icon">🏡</span>
          <div>
            <div className="logo-text">BhoomiDeals</div>
            <div className="logo-sub">Telangana · Land · Property</div>
          </div>
        </div>
        <nav className="nav">
          <button className={`nav-btn ${mode === "home" ? "active" : ""}`} onClick={() => setMode("home")}>Home</button>
          <button className={`nav-btn ${mode === "buy" ? "active" : ""}`} onClick={() => setMode("buy")}>🔍 Buy</button>
          <button className={`nav-btn ${mode === "sell" ? "active" : ""}`} onClick={() => setMode("sell")}>🏷️ Sell</button>
          <div className="user-chip" onClick={() => setMode("profile")}>
            <div className="user-chip-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <span className="user-chip-name">{user.name.split(" ")[0]}</span>
          </div>
        </nav>
      </div>

      {successMsg && <div className="success-bar">{successMsg}</div>}

      {mode === "home" && (
        <div className="hero">
          <div className="hero-badge">Telangana's Premier Land Marketplace</div>
          <p className="welcome-msg">👋 Welcome, {user.name}!</p>
          <h1>Buy & Sell <span>Agricultural</span><br />& Residential Land</h1>
          <p>Discover verified properties measured in Guntas — farm lands, plots, and estates across all 33 Telangana districts.</p>
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
          <div className="page-title">Available Properties</div>
          <div className="filters">
            <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <select className="filter-select" value={filterLoc} onChange={e => setFilterLoc(e.target.value)}>
              <option value="All">All Districts</option>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="listing-count">{filtered.length} properties found</div>
          {filtered.length > 0
            ? <div className="grid">{filtered.map(p => <PropertyCard key={p.id} prop={p} onContact={setContactProp} />)}</div>
            : <div className="empty"><div className="empty-icon">🔍</div><p>No properties found.</p></div>}
        </div>
      )}

      {mode === "sell" && <SellForm onSubmit={handleList} onCancel={() => setMode("home")} user={user} />}
      {mode === "profile" && <ProfilePage user={user} listings={listings} onLogout={handleLogout} />}
      <ContactModal prop={contactProp} onClose={() => setContactProp(null)} />
    </>
  );
}
