import { type ReactElement, useState } from "react";
import axios from "axios";
import mathPathTitle from "../../assets/svgs/mathPathTitle.svg";
import bgTrees from "../../assets/backgroundImage/bgTrees.png";
import upperTrees from "../../assets/svgs/upperTrees.svg";
import bottomBush from "../../assets/svgs/bottomBush.svg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login(): ReactElement {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: false, password: false });

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: value.trim() === "" }));
  };

  // handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      email: formData.email.trim() === "",
      password: formData.password.trim() === "",
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    try {
      const res = await axios.post(
        "http://localhost:3001/web/auth/login",
        formData,
      );
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (role === "student") {
        navigate("/student-dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message || "Login failed");
      } else {
        console.error("An unexpected error occurred", error);
      }
    }
  };

  return (
    <div className="h-screen w-screen">
      <header className="fixed z-20 flex w-full items-center justify-center p-8 pt-12 md:justify-start md:pt-8">
        <img
          src={mathPathTitle}
          alt="MathPath Icon"
          className="aspect-[16/9] w-auto min-w-[150px] max-w-[300px] hover:scale-105 hover:cursor-pointer md:w-[10vw]"
          onClick={() => navigate("/")}
        />
      </header>

      <div className="relative flex h-full w-full justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8)), url(${bgTrees})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute left-0 right-0 top-0 min-h-[120px] w-full bg-cover bg-top md:bg-contain xl:h-[20vh] xl:bg-center"
          style={{
            backgroundImage: `url(${upperTrees})`,
            willChange: "transform",
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="md:bg-fill absolute bottom-0 left-1/2 h-[30vh] w-full -translate-x-1/2 bg-cover lg:bg-center"
          style={{
            backgroundImage: `url(${bottomBush})`,
            willChange: "transform",
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        >
          <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-[#222222] to-transparent" />
        </motion.div>
      </div>

      {/* login form */}
      <main className="fixed inset-0 z-30 m-auto flex h-fit w-[90%] min-w-[300px] max-w-sm flex-col gap-8 rounded-xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-lg sm:max-w-md md:max-w-lg">
        <h1 className="text-center text-2xl font-bold text-white md:text-4xl">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xl">
          {/* email */}
          <div className="relative">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
                ${errors.email ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
              placeholder=" "
            />
            <label
              className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
                ${errors.email ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
            >
              Email
            </label>
          </div>

          {/* password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
                ${errors.password ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
              placeholder=" "
            />
            <label
              className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
                ${errors.password ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
            >
              Password
            </label>
          </div>

          {/* forgot password */}
          <button className="text-left text-sm text-gray-100 opacity-50 hover:cursor-pointer hover:underline hover:opacity-100">
            Forgot Password?
          </button>
          {/* login button */}
          <button
            type="submit"
            className="hover:scale-102 rounded-lg bg-[var(--primary-yellow)] py-2 hover:cursor-pointer"
          >
            Login
          </button>
        </form>
      </main>
    </div>
  );
}
