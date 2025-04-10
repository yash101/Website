'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clipboard } from "lucide-react";
import { useState, useEffect } from "react";

const inputStyle = 'w-full border p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500';
const buttonStyle = 'p-2 rounded-md hover:bg-slate-900 hover:text-slate-50 focus:outline-none focus:ring-2 ' +
  'focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105';


const Bold: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className='font-bold'>{children}</span>
);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(authCode);
    alert("Authorization code copied to clipboard!");
  };

  return (
    <div className='prose-sm p-4 space-y-4'>
      <h1 className='mb-1'>Schwab OAuth Authorization Utility</h1>
      <h2 className='text-red-500 font-bold mt-0'>Use at your own risk</h2>
      <section className='px-4 border-2 bg-slate-200 text-slate-950 rounded-md'>
        <h3 className='font-bold'>How it works</h3>
        <p>Step 1: register your application with Schwab to get a client ID and secret.</p>
        <p>
          Step 2: update your application settings in Schwab to use the redirect URI below.
          Note, that is the correct URI to use if you want to use my instance hosted on Cloudflare Pages.
        </p>
        <p>Step 3: put the client ID (Just the client ID, not the secret).</p>
        <p>{'Step 4: click "Authorize" to be forwarded to Schwab\'s and go through the authorization process'}</p>
        <p>{'Step 5: once you are redirected back here, use the "Copy" button to copy your one-time authorization code.'}</p>
        <p>Step 6: use the Schwab API to authorize and receive your access token and refresh token. Note, that is not implemented here</p>
        <p>
          <span className='font-bold'>Note: </span>The {`"Save Settings"`} button will persist your client ID and redirect
          URL in your {`browser's`} <code>localStorage</code> so you do not need to enter it again each time. It is a ease
          of use feature, but is not required to use the tool.
        </p>
      </section>
      <div>
        <label>
          Client ID:
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className={inputStyle}
          />
        </label>
      </div>
      <div>
        <label>
          <p className='font-bold'>Redirect URI:</p>
          <input
            type="text"
            value={redirectUri}
            onChange={(e) => setRedirectUri(e.target.value)}
            className={inputStyle}
          />
        </label>
      </div>
      <div>
        <label>
          <p className='font-bold'>Auth URL:</p>
          <input
            type="text"
            value={authUrl}
            className={inputStyle}
            onChange={(e) => setAuthUrl(e.target.value)}
          />
        </label>
      </div>
      <section className='px-4 border-2 bg-slate-200 text-slate-950 rounded-md'>
        <h3 className='font-bold'>Cybersecurity &amp; Safety Notes</h3>
        <ul className='md:list-disc pl-0 md:pl-5 space-y-2'>
          <li>
            <Bold>Do not be stoooopid. If you are asking for API access, know how to stay secure.</Bold>
          </li>
          <li>
            <p><Bold>No app secret required</Bold></p>
            <p>
              This utility does <Bold>NOT</Bold> require your app secret. Without it, obtaining your access or
              refresh tokens from your authorization code is not possible.
            </p>
          </li>
          <li>
            <p><Bold>Credential Security:</Bold></p>
            <p>
              Be cautious of any application that requests both your app details (app ID, app secret) and your authorization code.
              Sharing your App ID, secret, and tokens is equivalent to providing someone with your Schwab account username and password.
            </p>
            <p>
              In fact, it is even worse than providing a username and password to your Schwab account since they have
              <Bold>full API access</Bold> and can make drastic account changes in under one second!
            </p>
          </li>
          <li>
            <p><Bold>Protect Your Credentials:</Bold></p>
            <p>Do not share your account username or password with anyone.</p>
            <p>Do not share your access or refresh tokens.</p>
            <p>Keep your app secret confidential.</p>
          </li>
          <li>
            <p><Bold>Verify Authenticity:</Bold></p> 
            <p>
              Always cross-reference the authorization URL with your Schwab API documentation to avoid malicious links.
              Once you click {`"Authorize,"`} it becomes hard to determine if you are being phished.
            </p>
          </li>
          <li>
            <p><Bold>Double-Check the URL:</Bold></p>
            <p>
              Ensure that you are authorizing with Schwab and not falling victim to phishing. As of April 2025, you
              should log in via:
            </p>
            <pre>sws-gateway.schwab.com</pre>
            <p>Always verify the URL in your browser before entering your login details.</p>
          </li>
          <li>
            <p><Bold>Use at Your Own Risk:</Bold></p>
            <p>
              This utility assists in accessing the Schwab APIs. You are solely responsible for your own trades and account actions.
              If you are uncertain about any action, please refrain from proceeding. The developers of this tool will not assume
              responsibility for any financial losses or risks incurred.
            </p>
          </li>
        </ul>
      </section>
      <div className='flex flex-row justify-center md:justify-start space-x-2'>
        <Button onClick={handleSave} className={buttonStyle}>Save Settings</Button>
        <Button onClick={handleAuthorize} className={buttonStyle}>Authorize</Button>
      </div>
      <Separator orientation='horizontal' className='my-4' />
      <label>
        <p className='font-bold'>Authorization Code:</p>
        <div className="flex items-center space-x-2">
          <input type="text" readOnly value={authCode} className={inputStyle} placeholder='Authorization code' />
          <Button onClick={handleCopy} className={buttonStyle}>
            <Clipboard /> Copy
          </Button>
        </div>
      </label>
    </div>
  );
}

