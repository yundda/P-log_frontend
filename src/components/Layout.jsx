import Header from './Header';
import { Outlet } from 'react-router-dom';
import { useRef } from 'react';

export default function Layout() {
  const headerRef = useRef(null);
  //   const [headerHeight, setHeaderHeight] = useState(0);

  //   useEffect(() => {
  //     if (headerRef.current) {
  //       setHeaderHeight(headerRef.current.offsetHeight);
  //     }
  //   }, []);

  return (
    <>
      <div ref={headerRef}>
        <Header />
      </div>
      <main
        className="pt-10 w-[90%] max-w-[1280px] mx-auto"
        // style={{ paddingTop: `${headerHeight}px` }}
      >
        <Outlet />
      </main>
    </>
  );
}
