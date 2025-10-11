/* This is where user adding logic will reside */
import { useNavigate } from "react-router-dom";

const MemberAddPage = () => {
  const navigate = useNavigate();

  const addNewMember = () => {
    navigate("/add-member");
  };

  return <div></div>;
};

export default MemberAddPage;
