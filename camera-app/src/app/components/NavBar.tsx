import Link from "next/link";

const styles = {
  navbar: {
    backgroundColor: "#0070f3",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
};

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div>
        <h1 style={{ margin: 0 }}>My Camera App</h1>
      </div>
      <div style={styles.navLinks}>
        <Link href="./" passHref style={styles.link}>
          Home
        </Link>
        <Link href="./cameras" passHref style={styles.link}>
          Cameras
        </Link>
        <Link href="./add-camera" passHref style={styles.link}>
          Add Camera
        </Link>
        <Link href="./videos" passHref style={styles.link}>
          Videos
        </Link>
        <Link href="./create-video" passHref style={styles.link}>
          Create Video
        </Link>
        <Link
          href="./api-doc"
          passHref
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Documentation
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
