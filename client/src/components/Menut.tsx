// src/components/Menut.tsx (Bart)
import React, { useState } from "react";
import { Link } from "react-router-dom";

const HEADER_HEIGHT = 73; // ← match your Header/AppBar height (56 mobile, 64/72 desktop)

const columnsData: string[][] = [
  ["Stories", "Gallery", "Resources", "Talk"],
  ["Fun Facts", "Games", "Watch"],
];

const menuImages: Record<string, string> = {
  Stories: "assets/Stories.png",
  Gallery: "assets/Gallery.png",
  Resources: "assets/Resources.png",
  Talk: "assets/Talk.png",
  "Fun Facts": "assets/Fun Facts.png",
  Games: "assets/Games.png",
  Watch: "assets/Watch.png",
};

const styles = {
  container: {
    position: "relative" as const,
    zIndex: 10,
  },
  open: {
    position: "fixed" as const,
    top: `${HEADER_HEIGHT + 40}px`,
    left: "30px",
    minWidth: "60px",
    height: "50px",
    cursor: "pointer",
    zIndex: 100000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "0 10px",
    boxShadow: "0 0 5px rgba(0,0,0,0.3)",
  },
  close: {
    position: "absolute" as const,
    top: "10px",
    right: "10px",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "8px",
  },
  menu: {
    backgroundColor: "#92a6ba",
    display: "flex",
    flexDirection: "row" as const,
    width: "290px",
    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
    transition: "transform 0.3s ease",
    position: "fixed" as const,
    top: `${HEADER_HEIGHT}px`,
    left: 0,
    zIndex: 999,
    paddingTop: "60px",
    boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
    overflowY: "auto" as const,
  },
  menuHidden: {
    transform: "translateX(-100%)",
  },
  column: {
    width: "135px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "flex-start",
  },

  // ✅ Card wrapper: fixed size + image fits cleanly
  card: {
    marginTop: "8px",
    marginLeft: "18px",
    width: "110px",
    textAlign: "center" as const,
    backgroundColor: "#d9d9d9",
    borderRadius: "12px",
    padding: "8px",
    boxSizing: "border-box" as const,
    cursor: "pointer",
  },
  // ✅ Image container to guarantee fit/crop consistency
  imgWrap: {
    width: "100%",
    height: "110px",
    borderRadius: "10px",
    overflow: "hidden" as const,
    backgroundColor: "#cfcfcf",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },
  title: {
    margin: "8px 0 0 0",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: 1.2,
    color: "#111",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
};

const Bart: React.FC = () => {
  const [open, setOpen] = useState(false);

  const wrapIfLinked = (title: string, node: React.ReactNode, key: number) => {
    const common = { key, style: styles.link as React.CSSProperties };

    if (title === "Fun Facts") return <Link to="/funfacts" {...common}>{node}</Link>;
    if (title === "Resources") return <Link to="/resources" {...common}>{node}</Link>;
    if (title === "Stories") return <Link to="/stories" {...common}>{node}</Link>;
    if (title === "Gallery") return <Link to="/gallery" {...common}>{node}</Link>;
    if (title === "Games") return <Link to="/games" {...common}>{node}</Link>;
    if (title === "Watch") return <Link to="/watch" {...common}>{node}</Link>;
    if (title === "Talk") return <Link to="/talk" {...common}>{node}</Link>;

    return <React.Fragment key={key}>{node}</React.Fragment>;
  };

  return (
    <div style={styles.container}>
      {!open && (
        <div style={styles.open} onClick={() => setOpen(true)}>
          <img
            src="https://www.svgrepo.com/show/344422/arrow-right-short.svg"
            alt="Open Menu"
            style={{ width: "30px", height: "30px" }}
          />
        </div>
      )}

      <div style={{ ...styles.menu, ...(open ? {} : styles.menuHidden) }}>
        <div style={styles.close} onClick={() => setOpen(false)}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/109/109618.png"
            alt="Close"
            style={{ width: "30px", height: "30px" }}
          />
        </div>

        {columnsData.map((columnItems, colIndex) => (
          <div style={styles.column} key={colIndex}>
            {columnItems.map((title, itemIndex) => {
              const card = (
                <div style={styles.card} key={itemIndex}>
                  <div style={styles.imgWrap}>
                    <img src={menuImages[title]} alt={title} style={styles.img} />
                  </div>
                  <h4 style={styles.title}>{title}</h4>
                </div>
              );

              return wrapIfLinked(title, card, itemIndex);
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bart;
