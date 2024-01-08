import React from "react";
import { useState } from "react";
import BlocklyComponent from "../components/BlocklyComponent";
import Canvas from "../components/Canvas";
import AnchorMenu from "../components/AnchorMenu";
import FloatingActionButton from "../components/FloatingActionButton";
import Header from "../components/Header";
import ButtonTabs from "../components/ButtonTabs";
import Sounds from "../components/Sounds";
import FlagButton from "../components/Canvas/FlagButton";
import { useDispatch, useSelector } from "react-redux";


const Home = () => {
  const active = useSelector(state => state.soundTab.activeTab);
 

  return (
    <div>
      <Header />      
      <ButtonTabs />

      <div style={{ textAlign: "center" }}></div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "20px",
        }}
      >
        {active === "Sounds" ? <Sounds /> : <BlocklyComponent />}
        <Canvas />
      </div>
      <AnchorMenu />
      <FloatingActionButton />
    </div>
  );
};

export default Home;
