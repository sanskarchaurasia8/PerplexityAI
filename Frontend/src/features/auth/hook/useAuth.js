import { useDispatch } from "react-redux";
import { registerUser, loginUser, getMe } from "../services/auth.api";
import { setUser, setLoading, setError, logout } from "../auth.slice";

export function useAuth() {
    const dispatch = useDispatch();

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true));
            const data = await registerUser({ email, username, password });
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            const data = await loginUser({ email, password });
            dispatch(setUser(data.user));
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user data"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    function handleLogout() {
        dispatch(logout());
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
    };
}
