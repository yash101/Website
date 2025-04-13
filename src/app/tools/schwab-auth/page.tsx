import { Metadata } from "next";
import SchwabAuthPage from "./component";

export const metadata: Metadata = {
  title: "Schwab OAuth Authorization Utility",
  description: "A utility to assist in obtaining the authorization code for Schwab API access.",
  applicationName: "Schwab OAuth Authorization Utility",
  authors: [
    {
      name: 'yash101',
      url: 'https://devya.sh'
    }
  ],
  generator: 'next.js, bechemel',
  keywords: [ 'schwab', 'schwab api', 'oauth', 'authorization code', 'utility' ],
  openGraph: {
    title: "Schwab OAuth Authorization Utility",
    description: "A utility to assist in obtaining the authorization code for Schwab API access.",
    url: "https://devya.sh/tools/schwab-auth",
    siteName: "Schwab OAuth Authorization Utility",
    images: [
      {
        url: "/objects/dksjhgsldfkjghkl4352kjh.png",
        width: 800,
        height: 600,
        alt: "Schwab OAuth Authorization Utility"
      }
    ]
  },
};

const Page: React.FC = () => <SchwabAuthPage />;
export default Page;
