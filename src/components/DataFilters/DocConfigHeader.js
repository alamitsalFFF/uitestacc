import React from "react";
import HeaderBar from "../menu/HeaderBar";

const DocConfigHeader = ({ categoryOptions, categoryOptionsThai, handleGoMenu }) => {
    return (
        <div className="col-12" style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="col-8">
                <div className="docconfig-header">
                    <h4 className="docconfig-title" onClick={handleGoMenu}>
                        {categoryOptions}
                    </h4>
                    <p className="docconfig-subtitle">{categoryOptionsThai}</p>
                </div>
            </div>
            <div className="col-4">
                <HeaderBar />
            </div>
        </div>
    );
};

export default DocConfigHeader;
