import React from "react";
import "./Spinner.css";

const Spinner: React.FC = () => {
    return(
        <div className="gshock-loader">
            <div className="gshock-ring"></div>
            <div className="gshock-square"></div>
        </div>
    )
}

export default Spinner;