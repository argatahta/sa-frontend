import { useState } from "react";

const hours = [...Array(25).keys()];
const heightValue = 10;
export default function Ruler(props) {
    return (
        <div style={{ display: "flex", flexDirection: "column", minWidth: "24rem" }} >
            {hours.map((el) => (
                <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", height: heightValue+"rem", position: 'relative' }}>
                    <p style={{ marginRight: "1rem", position: "absolute" }}>{el}:00</p>
                    <span className="line" />
                </div>
            ))}
        </div>
    )

}