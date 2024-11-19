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
        <Link href="/" passHref>
          <a style={styles.link}>Home</a>
        </Link>
        <Link href="/cameras" passHref>
          <a style={styles.link}>Cameras</a>
        </Link>
        <Link href="/add-camera" passHref>
          <a style={styles.link}>Add Camera</a>
        </Link>
        <Link href="/videos" passHref>
          <a style={styles.link}>Videos</a>
        </Link>
        <Link href="/create-video" passHref>
          <a style={styles.link}>Create Video</a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
