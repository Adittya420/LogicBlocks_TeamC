import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../state/reducers/soundTabReducers";



function ButtonTabs(props) {
    const dispatch = useDispatch();
    const active = useSelector((state) => state.soundTab.activeTab);    
    const buttonStyles = {
        backgroundColor: "#cccccc",
        flexBasis: "100px",
        fontSize: "1rem",                                
        textAlign: "center",
        textDecoration: "none",                
        cursor: "pointer",          
        color: "#1976d2",
        borderRadius: "1rem 1rem 0 0",
        border: "1px solid hsla(0, 0%, 0%, 0.15)",
        padding: "0.125rem 1.25rem 0",        
        borderBottom: "0px",


        transition: "background-color 0.2s",
    }

    const activeButton = {
        ...buttonStyles,
        fontSize: "1.1rem",
        backgroundColor: "white",        
        transform: "scale(1.1)"        
    }

    const handleButtonClick = (value) => {            
        dispatch(setActiveTab(value));              
    }

    return (
        <div style={{
            marginTop: "13px",
            width: "50vw",
            height: "2.5rem",
            display: "flex",
            gap: "10px"
        }}>            
            <button style={active == "Home" ? activeButton : buttonStyles} onClick={() => handleButtonClick("Home")}>Home</button>
            <button style={active == "Sounds" ? activeButton : buttonStyles} onClick={() => handleButtonClick("Sounds")}>Sounds</button>
        </div>
    )
}

export default ButtonTabs;