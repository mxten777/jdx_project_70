import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 페이지 변경 시 스크롤을 맨 위로 이동
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // 부드러운 스크롤 효과
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;