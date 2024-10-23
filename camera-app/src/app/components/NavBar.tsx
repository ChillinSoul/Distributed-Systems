import Link from 'next/link';

const styles = {
  navbar: {
    backgroundColor: '#0070f3',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
};

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div>
        <h1 style={{ margin: 0 }}>My Camera App</h1>
      </div>
      <div style={styles.navLinks}>
        <Link href="./" style={styles.link}>
          Home
        </Link>
        <Link href="./cameras" style={styles.link}>
          Cameras
        </Link>
        <Link href="./camera-app/add-camera" style={styles.link}>
          Add Camera
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
