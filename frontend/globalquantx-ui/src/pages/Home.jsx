import React from "react";
import AccountCreationCard from "../components/account/AccountCreationCard.jsx";
import CryptoList from "../components/markets/CryptoList.jsx";
import FxList from "../components/markets/FxList.jsx";

const Home = () => {
  return (
    <section className="home-grid">
      <div className="home-col">
        <AccountCreationCard />
      </div>
      <div className="home-col">
        <CryptoList count={20} />
      </div>
      <div className="home-col">
        <FxList count={10} />
      </div>
    </section>
  );
};

export default Home;

