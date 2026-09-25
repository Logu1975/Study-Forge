import { useState, type FormEvent } from "react";
import Dashboard from "../dashboard/Dashboard";

type StoredUser = {
  name: string;
  email: string;
  password: string;
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    setMessage("");

    if (!isLogin) {
      if (cleanName === "") {
        setMessage("Please enter your name.");
        return;
      }

      if (password.length < 6) {
        setMessage("Password must be at least 6 characters.");
        return;
      }

      const user: StoredUser = {
        name: cleanName,
        email: cleanEmail,
        password,
      };

      localStorage.setItem(
        "studyforge_user",
        JSON.stringify(user)
      );

      setMessage("Account created successfully! 🎉");
      setIsLogin(true);
      setPassword("");
      return;
    }

    const savedUser = localStorage.getItem("studyforge_user");

    if (savedUser === null) {
      setMessage("No account found. Please sign up first.");
      return;
    }

    try {
      const user: StoredUser = JSON.parse(savedUser);

      if (
        user.email === cleanEmail &&
        user.password === password
      ) {
        setLoggedIn(true);
        return;
      }

      setMessage("Incorrect email or password.");
    } catch {
      setMessage("Account data is corrupted. Please sign up again.");
      localStorage.removeItem("studyforge_user");
    }
  }

  function showLogin() {
    setIsLogin(true);
    setMessage("");
  }

  function showSignup() {
    setIsLogin(false);
    setMessage("");
  }

  if (loggedIn) {
    return <Dashboard />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: "var(--sf-bg)",
        color: "var(--sf-text)",
      }}
    >
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1
            className="text-4xl font-black"
            style={{
              color: "var(--sf-primary)",
            }}
          >
            StudyForge
          </h1>

          <p
            className="mt-2"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            {isLogin
              ? "Welcome back, learner."
              : "Create your student workspace."}
          </p>
        </div>

        <div
          className="rounded-3xl border p-6 sm:p-8"
          style={{
            background: "var(--sf-surface)",
            borderColor: "var(--sf-surface-soft)",
            boxShadow: "var(--sf-shadow)",
          }}
        >

          {/* MODE BUTTONS */}
          <div className="mb-6 grid grid-cols-2 gap-2">

            <button
              type="button"
              onClick={showLogin}
              className="min-h-11 rounded-xl px-4 py-3 font-bold"
              style={{
                background: isLogin
                  ? "var(--sf-primary)"
                  : "var(--sf-surface-soft)",
                color: isLogin
                  ? "var(--sf-bg)"
                  : "var(--sf-text)",
              }}
            >
              Login
            </button>

            <button
              type="button"
              onClick={showSignup}
              className="min-h-11 rounded-xl px-4 py-3 font-bold"
              style={{
                background: !isLogin
                  ? "var(--sf-primary)"
                  : "var(--sf-surface-soft)",
                color: !isLogin
                  ? "var(--sf-bg)"
                  : "var(--sf-text)",
              }}
            >
              Sign Up
            </button>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-xl border px-4 py-3"
                  style={{
                    background: "var(--sf-bg)",
                    borderColor: "var(--sf-surface-soft)",
                    color: "var(--sf-text)",
                  }}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border px-4 py-3"
                style={{
                  background: "var(--sf-bg)",
                  borderColor: "var(--sf-surface-soft)",
                  color: "var(--sf-text)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border px-4 py-3"
                style={{
                  background: "var(--sf-bg)",
                  borderColor: "var(--sf-surface-soft)",
                  color: "var(--sf-text)",
                }}
              />
            </div>

            {message !== "" && (
              <div
                role="alert"
                className="rounded-xl border px-4 py-3 text-sm font-semibold"
                style={{
                  background: "var(--sf-surface-soft)",
                  borderColor: "var(--sf-primary)",
                  color: "var(--sf-text)",
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="min-h-11 w-full rounded-xl px-4 py-3 font-black"
              style={{
                background: "var(--sf-primary)",
                color: "var(--sf-bg)",
              }}
            >
              {isLogin
                ? "Enter StudyForge →"
                : "Create my account →"}
            </button>

          </form>
        </div>

        <p
          className="mt-6 text-center text-sm"
          style={{
            color: "var(--sf-text-muted)",
          }}
        >
          {isLogin
            ? "New to StudyForge? Click Sign Up above."
            : "Already have an account? Click Login above."}
        </p>

      </div>
    </div>
  );
}