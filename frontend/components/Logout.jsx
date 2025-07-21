import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/authSlice";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.post("http://localhost:3000/jagadish/logout", {}, { withCredentials: true });
        // Cookies.remove("token");
        dispatch(setUser(null));
        toast.info("Logged out successfully.");
        navigate("/login");
      } catch (err) {
        toast.error("Logout failed.");
      }
    };

    logoutUser();
  }, [navigate, dispatch]);

  return null;
}
