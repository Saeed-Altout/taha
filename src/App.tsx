import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthLayout, SignIn, SignUp } from "@/lib/auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
