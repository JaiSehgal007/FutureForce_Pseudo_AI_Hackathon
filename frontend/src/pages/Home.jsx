import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Code, BookOpen, Laptop, Database, PenTool, Server, Shield, Cloud, Link, Gamepad2, Glasses, Cpu, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "@/services/api";
import { useDispatch } from "react-redux";
import { fetchProfile } from "@/store/authSlice";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // Custom hook for media queries

// Custom hook for responsive design
const useResponsiveLayout = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  return { isMobile, isTablet, isDesktop };
};

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [domains, setDomains] = useState(["All"]);
  const [activeTab, setActiveTab] = useState("All");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(useSelector((state) => state.auth.isAuthenticated));
  const { isMobile, isTablet } = useResponsiveLayout();

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all courses
    dispatch(fetchProfile());
    setIsAuthenticated(true);
    fetchCourses();

    // Fetch recommended courses if user is authenticated
    fetchRecommendedCourses();
  }, [isAuthenticated]);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/course/all");

      // Check if response has a json method (it's a Response object)
      const result = response.json ? await (response.json()).data : response.data;

      if (result.success) {
        setCourses(result.message);
        setFilteredCourses(result.message);

        // Extract unique domains for tabs
        const uniqueDomains = ["All", ...new Set(result.message.map(course => course.domain))];
        setDomains(uniqueDomains);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedCourses = async () => {
    setLoadingRecommendations(true);
    try {
      const response = await api.get("/user/recommend");
      const result = response.data;
      if (result.success) {
        console.log("Recommended Courses:", result.message);
        setRecommendedCourses(result.message);
      }
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    // Filter courses based on search term and active tab
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeTab !== "All") {
      filtered = filtered.filter(course => course.domain === activeTab);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, activeTab, courses]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (isMobile) {
      setShowMobileFilters(false);
    }
  };

  const navigateToCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  // Get appropriate icon based on category
  const getCategoryIcon = (category) => {
    const categoryLower = category.toLowerCase();

    if (categoryLower.includes('web') || categoryLower.includes('javascript') || categoryLower.includes('html')) {
      return <Code className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-blue-500`} />;
    } else if (categoryLower.includes('education') || categoryLower.includes('learning')) {
      return <BookOpen className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-green-500`} />;
    } else if (categoryLower.includes('mobile') || categoryLower.includes('android') || categoryLower.includes('ios')) {
      return <Laptop className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-purple-500`} />;
    } else if (categoryLower.includes('data') || categoryLower.includes('sql')) {
      return <Database className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-amber-500`} />;
    } else if (categoryLower.includes('design') || categoryLower.includes('ui') || categoryLower.includes('ux')) {
      return <PenTool className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-pink-500`} />;
    } else if (categoryLower.includes('devops') || categoryLower.includes('server')) {
      return <Server className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-orange-500`} />;
    } else if (categoryLower.includes('security') || categoryLower.includes('cyber')) {
      return <Shield className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-red-500`} />;
    } else if (categoryLower.includes('cloud') || categoryLower.includes('aws')) {
      return <Cloud className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-sky-500`} />;
    } else if (categoryLower.includes('blockchain') || categoryLower.includes('crypto')) {
      return <Link className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-indigo-500`} />;
    } else if (categoryLower.includes('game')) {
      return <Gamepad2 className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-emerald-500`} />;
    } else if (categoryLower.includes('ar') || categoryLower.includes('vr')) {
      return <Glasses className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-violet-500`} />;
    } else if (categoryLower.includes('iot') || categoryLower.includes('embedded')) {
      return <Cpu className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-teal-500`} />;
    } else {
      // Default icon for other categories
      return <BookOpen className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-gray-500`} />;
    }
  };

  // Render a course card with the given course data
  const renderCourseCard = (course) => {
    if (!course) return null;

    return (
      <Card
        key={course._id}
        className="overflow-hidden transition-all hover:shadow-lg cursor-pointer"
        onClick={() => navigateToCourse(course._id)}
      >
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
        <CardHeader className={isMobile ? "px-3 py-2" : "px-6 py-4"}>
          <div className="flex justify-between items-start">
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} line-clamp-1`}>{course.title}</CardTitle>
            <Badge variant="outline" className={isMobile ? "text-xs" : "text-sm"}>{course.domain}</Badge>
          </div>
          <CardDescription className={`line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>{course.description}</CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? "px-3 py-2" : "px-6 py-4"}>
          <div className="flex items-center gap-2">
            <Avatar className={isMobile ? "h-8 w-8" : "h-10 w-10"}>
              <AvatarImage
                src={course.mentor.profilePicture || ""}
                alt={course.mentor.name}
              />
              <AvatarFallback>{course.mentor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{course.mentor.name}</p>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>{course.mentor.educationLevel}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Modules</p>
              <p className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{course.modules.length}</p>
            </div>
            <div>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Price</p>
              <p className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {course.price === 0 ? "Free" : `$${course.price}`}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className={isMobile ? "px-3 py-2" : "px-6 py-4"}>
          <Button className="w-full" size={isMobile ? "sm" : "default"}>Enroll Now</Button>
        </CardFooter>
      </Card>
    );
  };

  const renderRecommendedCourseCard = (course) => {
    if (!course) return null;

    return (
      <Card
        key={course.id}
        className="overflow-hidden transition-all hover:shadow-lg cursor-pointer"
        onClick={() => navigateToCourse(course.id)}
      >
        <div className="aspect-video w-full overflow-hidden bg-muted flex items-center justify-center">
          <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            {getCategoryIcon(course.category)}
            <p className={`mt-2 font-medium text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{course.category}</p>
          </div>
        </div>
        <CardHeader className={isMobile ? "px-3 py-2" : "px-6 py-4"}>
          <div className="flex justify-between items-start">
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} line-clamp-2`}>{course.text}</CardTitle>
            <Badge variant="outline" className={isMobile ? "text-xs" : "text-sm"}>{course.category}</Badge>
          </div>
          <CardDescription className={`line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Explore this course to enhance your skills in {course.category}
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? "px-3 py-2" : "px-6 py-4"}>
          <div className="flex items-center gap-2">
            <Avatar className={isMobile ? "h-8 w-8" : "h-10 w-10"}>
              <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            </Avatar>
            <div>
              <p className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>AI Recommended</p>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>Match Score: {Math.round(course.score * 100)}%</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className={isMobile ? "px-3 py-2" : "px-6 py-4"}>
          <Button className="w-full" size={isMobile ? "sm" : "default"}>Explore Course</Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-center">Learning Buddy</h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6 text-center px-2">
          Discover courses tailored to boost your skills
        </p>

        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mb-4 sm:mb-6 md:mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Recommended Courses Section */}
      {isAuthenticated && (
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500" />
            <h2 className="text-xl sm:text-2xl font-bold">Recommended For You</h2>
          </div>

          {loadingRecommendations ? (
            <div className="flex justify-center items-center h-32 sm:h-40">
              <p className="text-base sm:text-lg">Loading recommendations...</p>
            </div>
          ) : recommendedCourses.length === 0 ? (
            <div className="text-center py-6 sm:py-8 border rounded-lg">
              <p className="text-sm sm:text-base text-muted-foreground">No recommendations available yet. Try exploring more interests!</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {recommendedCourses.map((recommendation, index) => (
                <div key={index}>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Based on your interest in {recommendation.area}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {recommendation.courses.slice(0, isMobile ? 2 : 3).map((course) => renderRecommendedCourseCard(course))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Courses Section */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Browse All Courses</h2>

        {/* Mobile filter toggle */}
        {isMobile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-1"
          >
            <Menu className="h-4 w-4" />
            Filters
          </Button>
        )}
      </div>

      <Tabs defaultValue="All" className="w-full mb-6 sm:mb-8" onValueChange={handleTabChange}>
        <TabsList
          className={`
    ${isMobile ? (showMobileFilters ? 'flex' : 'hidden') : 'flex'}
    justify-center items-center
    gap-2 sm:gap-3
    p-4 sm:p-5  // Significantly increased padding for more nesting
    rounded-xl
    bg-gradient-to-b from-[#1E2633] to-[#2e3b4e]  // Added gradient for depth
    shadow-lg  // Stronger shadow for the container
    border border-[#3e4b5e]  // Slightly lighter border for contrast
    mb-4
  `}
        >
          {domains.map(domain => (
            <TabsTrigger
              key={domain}
              value={domain}
              className={`
        px-3 sm:px-5 py-1  // Reduced padding further for smaller tabs
        text-sm sm:text-base font-semibold
        rounded-lg
        transition-all duration-200 ease-in-out
        text-white 
        bg-transparent
        hover:bg-[#3e4b5e] 
        hover:scale-110  // More pronounced hover effect
        data-[state=active]:bg-[#ffffff] 
        data-[state=active]:text-black
        data-[state=active]:shadow-xl  // Even stronger shadow for active tab
        data-[state=active]:scale-110  // Slightly larger scale for active tab
        data-[state=active]:border data-[state=active]:border-[#1E2633]  // Border for active tab
      `}
            >
              {domain}
            </TabsTrigger>
          ))}
        </TabsList>


        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <p className="text-base sm:text-lg">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <h3 className="text-lg sm:text-xl font-medium">No courses found</h3>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCourses.map((course) => renderCourseCard(course))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Custom hook for media queries


export default Home;
