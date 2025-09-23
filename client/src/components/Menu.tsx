import React, { useState } from "react";
import { Link } from "react-router-dom";

const HEADER_HEIGHT = 73;

// Unified config: title, route, and image path (public/assets)
const menuConfig = [
  [
    { title: "Stories", path: "/stories", img: "/assets/stories.png" },
    { title: "Gallery", path: "/gallery", img: "/assets/gallery.png" },
    { title: "Resources", path: "/resources", img: "/assets/resources.png" },
    { title: "Talk", path: "/talk", img: "/assets/talk.png" },
  ],
  [
    { title: "Fun Facts", path: "/funfacts", img: "/assets/fun-facts.png" },
    { title: "Games", path: "/games", img: "/assets/games.png" },
    { title: "Watch", path: "/watch", img: "/assets/watch.png" },
  ],
];

const styles = {
  container: {
    position: "relative" as const,
    zIndex: 10,
  },
  open: {
    position: "fixed" as const,
    top: `${HEADER_HEIGHT + 20}px`,
    left: "30px",
    minWidth: "80px",
    height: "40px",
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
  box: {
    marginTop: "10px",
    marginLeft: "20px",
    textAlign: "center" as const,
  },
  img: {
    backgroundColor: "#d9d9d9",
    height: "14vh",
    borderRadius: "10px",
    marginBottom: "5px",
    objectFit: "cover" as const,
  },
};

const Bar: React.FC = () => {
  const [open, setOpen] = useState(false);

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

        {menuConfig.map((column, colIndex) => (
          <div style={styles.column} key={colIndex}>
            {column.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                to={item.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={styles.box}>
                  <img src={item.img} alt={item.title} style={styles.img} />
                  <h4>{item.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bar;
