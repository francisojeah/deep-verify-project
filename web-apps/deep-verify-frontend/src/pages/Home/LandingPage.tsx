import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/home", { replace: true });
  }, []);

  return (
    <></>
  );
};

export default LandingPage;
