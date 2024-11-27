import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../configs/axios";

const Home = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();

  const getData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        "http://localhost:3000/users/profile"
      );
      setData(response.data.message);
    } catch (error) {
      console.error("Fetching data failed:", error);
      alert("Fetching data failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>
      <h1>Home</h1>
      <p>Backend data: {loading ? "Loading..." : data}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default Home;
