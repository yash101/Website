'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function SchwabAuthPage() {
  const [clientId, setClientId] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [authUrl, setAuthUrl] = useState("");
  const [authCode, setAuthCode] = useState("");

  useEffect(() => {
    // Load values from localStorage on component mount
    const storedClientId = localStorage.getItem("clientId") || "YOUR_CLIENT_ID";
    const storedRedirectUri =
      localStorage.getItem("redirectUri") || "https://devya.sh/tools/schwab-auth";

    const url = new URL("https://api.schwabapi.com/v1/oauth/authorize");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", storedClientId);
    url.searchParams.set("redirect_uri", storedRedirectUri);
    const storedAuthUrl = localStorage.getItem("authUrl") || url.toString();

    setClientId(storedClientId);
    setRedirectUri(storedRedirectUri);
    setAuthUrl(storedAuthUrl);

    // Extract the authorization code from the URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setAuthCode(code);
    }
  }, []);

  useEffect(() => {
    // Update authUrl whenever clientId or redirectUri changes
    const url = new URL("https://api.schwabapi.com/v1/oauth/authorize");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    const updatedAuthUrl = url.toString();

    setAuthUrl(updatedAuthUrl);
  }, [clientId, redirectUri]);

  const handleAuthorize = () => {
    window.location.href = authUrl;
  };

  const handleSave = () => {
    // Persist values to localStorage
    localStorage.setItem("clientId", clientId);
    localStorage.setItem("redirectUri", redirectUri);
    localStorage.setItem("authUrl", authUrl);

    alert("Settings saved!");
  };

  return (
    <div className='prose pt-4 space-y-4'>
      <h1>Schwab OAuth Authorization Utility</h1>
      <p className='text-red-500'>Use at your own risk</p>
      <p>
        Enter the details below to configure the authorization and click the
        button to retrieve the authorization code.
      </p>
      <div>
        <label>
          Client ID:
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className='w-full border'
          />
        </label>
      </div>
      <div>
        <label>
          Redirect URI:
          <input
            type="text"
            value={redirectUri}
            onChange={(e) => setRedirectUri(e.target.value)}
            className='w-full border'
          />
        </label>
      </div>
      <div>
        <label>
          Auth URL:
          <input
            type="text"
            value={authUrl}
            className='w-full border'
          />
        </label>
      </div>
      <Button onClick={handleSave}>Save Settings</Button>
      <Button onClick={handleAuthorize} style={{ marginLeft: "10px" }}>
        Authorize
      </Button>
      {authCode && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          Authorization Code: {authCode}
        </p>
      )}
    </div>
  );
}