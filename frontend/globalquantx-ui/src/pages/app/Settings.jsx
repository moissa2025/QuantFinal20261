import { useEffect, useState } from "react";
import Page from "../../components/layout/Page";
import { getProfile } from "../../api/user";

export default function Settings() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(console.error);
  }, []);

  return (
    <Page title="Settings">
      {profile && (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
        </div>
      )}
    </Page>
  );
}

