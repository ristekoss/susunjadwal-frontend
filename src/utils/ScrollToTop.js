import {useEffect} from 'react'
import { useLocation } from 'react-router';

// ref: https://reactrouter.com/web/guides/scroll-restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop