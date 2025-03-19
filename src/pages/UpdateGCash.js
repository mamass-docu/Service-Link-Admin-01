// Settings.js
import React, { useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaBell,
  FaLock,
  FaPalette,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import "../css/Settings.css";
import { useDispatch, useSelector } from "react-redux";
import {
  add,
  all,
  loadingProcess,
  specificLoadingProcess,
  update,
} from "../firebase/helper";
import Spinner from "../components/Spinner";
import { uploadImage } from "../helpers/cloudinary";
import { FaPesoSign } from "react-icons/fa6";

const UpdateGCash = () => {
  const [id, setId] = useState(null);
  const [qr, setQr] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputImageRef = useRef(null);

  useEffect(() => {
    all("adminGcash").then(({ docs }) => {
      if (docs.length > 0) {
        const data = docs[0].data();
        setId(docs[0].id);
        setQrUrl(data.qr);
        setNumber(data.number);
        setName(data.name);
      }
    });
  }, []);

  const onSendImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setQr(file);
      const reader = new FileReader();
      reader.onload = (e) => setQrPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onClickSelectImage = () => {
    if (!inputImageRef.current) return;

    inputImageRef.current.click();
  };

  const onSave = async () => {
    if (name.trim() == "") {
      alert("Please enter a name");
      return;
    }
    if (number.trim() == "") {
      alert("Please enter a number");
      return;
    }
    if (!qrUrl && !qr) {
      alert("Please select a QR code");
      return;
    }

    setIsLoading(true);
    try {
      let data = {
        name: name.trim(),
        number: number.trim(),
      };
      if (qr) {
        const imgUrl = await uploadImage(qr, "admingcashqr");
        if (imgUrl) data.qr = imgUrl;
      }
      if (id) await update("adminGcash", id, data);
      else await add("adminGcash", data);

      alert("Successfully saved.");
    } catch (e) {
      alert("Error saving data!!!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <input
        type="file"
        ref={inputImageRef}
        onChange={onSendImage}
        style={{ display: "none" }}
        accept="image/*"
      />
      <div className="settings-header">
        <h1>GCash Accont</h1>
        <p>Manage your GCash account</p>
      </div>

      <div className="settings-grid">
        {/* Account Settings */}
        <div className="settings-card">
          <div className="card-header">
            <FaPesoSign className="card-icon" />
            <h2>Account Settings</h2>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label>GCash Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter name"
              />
            </div>
            <div className="form-group">
              <label>GCash Number</label>
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                type="text"
                placeholder="Enter number"
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              {qrPreview || qrUrl ? (
                <img src={qrPreview ?? qrUrl} style={{ width: 200 }} />
              ) : null}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <button
                onClick={onClickSelectImage}
                style={{
                  background: "lime",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                Change QR Code
              </button>
            </div>

            <button onClick={onSave} className="save-btn">
              {isLoading ? <Spinner size="30px" /> : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateGCash;
