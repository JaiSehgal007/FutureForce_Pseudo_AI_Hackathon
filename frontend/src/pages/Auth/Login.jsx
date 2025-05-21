import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { useDispatch } from "react-redux";
import { fetchProfile } from "@/store/authSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";

const Login = () => {
  const { toast } = useToast();
  const { role } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTabChange = (value) => {
    setUserType(value);
    // Clear form data when switching tabs
    setFormData({
      email: "",
      password: ""
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log(`${userType.charAt(0).toUpperCase() + userType.slice(1)} login attempt with:`, formData);
      
      // Include userType in the login request
      const loginData = {
        ...formData,
        userType: userType === "student" ? "Student" : "Mentor"
      };
      
      const { data } = await api.post("/user/login", loginData);
      dispatch(fetchProfile());
      
      toast({
        title: "Login successful",
        description: `Welcome back! Redirecting to ${userType} dashboard...`,
      });
      
      // Redirect to appropriate dashboard based on user type
      setTimeout(() => {
        // does student-dashboard or mentor-dashboard really exist?
        navigate(userType === "student" ? "/dashboard" : "/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-0 shadow-lg dark:border dark:border-gray-700 dark:shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="student" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="mentor">Mentor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="student">
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="student-email">Email</Label>
                <Input
                  id="student-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <Label htmlFor="student-password">Password</Label>
                <Input
                  id="student-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="dark:border-gray-600"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in as Student"}
              </Button>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Register here
                </Link>
              </div>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Forgot Password
                </Link>
              </div>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="mentor">
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mentor-email">Email</Label>
                <Input
                  id="mentor-email"
                  name="email"
                  type="email"
                  placeholder="mentor@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mentor-password">Password</Label>
                <Input
                  id="mentor-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="dark:border-gray-600"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in as Mentor"}
              </Button>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Want to become a mentor?{" "}
                <Link to="/mentor-application" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Apply here
                </Link>
              </div>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Forgot Password
                </Link>
              </div>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default Login;
