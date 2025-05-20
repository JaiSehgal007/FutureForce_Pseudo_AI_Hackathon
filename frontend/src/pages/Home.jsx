import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import api from "@/services/api";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [domains, setDomains] = useState(["All"]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    // Fetch courses from API
    const fetchCourses = async () => {
  try {
    const response = await api.get("/course/all");
    
    // Check if response has a json method (it's a Response object)
    const result = response.json ? await (response.json()).data : response.data;
    
    if (result.success) {
        // console.log(result.message);
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


    fetchCourses();
  }, []);

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
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold mb-2">AI Learning Buddy</h1>
        <p className="text-xl text-muted-foreground mb-6">Discover courses tailored to boost your skills</p>
        
        <div className="relative w-full max-w-md mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Tabs defaultValue="All" className="w-full mb-8" onValueChange={handleTabChange}>
        <TabsList className="mb-6 flex flex-wrap">
          {domains.map(domain => (
            <TabsTrigger key={domain} value={domain} className="px-4 py-2">
              {domain}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No courses found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course._id} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <Badge variant="outline">{course.domain}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage 
                          src={course.mentor.profilePicture || ""} 
                          alt={course.mentor.name} 
                        />
                        <AvatarFallback>{course.mentor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{course.mentor.name}</p>
                        <p className="text-xs text-muted-foreground">{course.mentor.educationLevel}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Modules</p>
                        <p className="font-medium">{course.modules.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">
                          {course.price === 0 ? "Free" : `$${course.price}`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Enroll Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
