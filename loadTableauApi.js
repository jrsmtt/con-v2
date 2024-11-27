import React, { useEffect, useState } from "react";

const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve("Script loaded successfully");
        script.onerror = (error) => reject(`Error loading script: ${error}`);
        document.body.appendChild(script);
    });
};

const TableauEmbed = ({ url }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        if (!scriptLoaded) {
            loadScript("https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js")
                .then(() => {
                    setScriptLoaded(true);
                    console.log("Tableau API loaded!");
                    const vizContainer = document.getElementById("tableauViz");
                    const viz = new window.tableau.Viz(vizContainer, url);
                })
                .catch((error) => {
                    console.error("Error loading Tableau script:", error);
                });
        }

        return () => {
            // Cleanup the Tableau viz if necessary
            if (window.tableau && window.tableau.VizManager) {
                const viz = window.tableau.VizManager.getVizs()[0];
                if (viz) viz.dispose();
            }
        };
    }, [url, scriptLoaded]);

    return (
        <div>
            <div id="tableauViz" style={{ width: "100%", height: "600px" }}></div>
        </div>
    );
};

export default TableauEmbed;
