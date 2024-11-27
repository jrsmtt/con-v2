import React, { useEffect, useRef } from "react";

const TableauEmbed = ({ workbookUrl }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const loadTableauViz = async () => {
            if (window.tableau && containerRef.current) {
                const tableau = await import("https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js");

                // Embed the workbook
                const viz = tableau.VizManager.createViz(containerRef.current, workbookUrl, {
                    height: "600px", // Set height
                    width: "100%",  // Set width
                });

                return () => {
                    viz.dispose(); // Clean up on component unmount
                };
            }
        };

        loadTableauViz();
    }, [workbookUrl]);

    return <div ref={containerRef} style={{ width: "100%", height: "600px" }} />;
};

export default TableauEmbed;
