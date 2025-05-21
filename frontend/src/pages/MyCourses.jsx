import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      // Fetch enrolled courses
      const enrollmentResponse = await api.post("/course/my-courses");
      
      if (!enrollmentResponse.data.success) {
        throw new Error("Failed to fetch enrolled courses");
      }
      
      const enrollments = enrollmentResponse.data.message || [];
      
      // Fetch detailed course information for each enrolled course
      const detailedCourses = await Promise.all(
        enrollments.map(async (enrollment) => {
          try {
            const courseResponse = await api.get(`/course/${enrollment.course}`);
            
            if (!courseResponse.data.success) {
              throw new Error(`Failed to fetch details for course ${enrollment.course}`);
            }
            
            const courseDetails = courseResponse.data.message;
            
            // Combine enrollment data with course details
            return {
              ...courseDetails,
              enrollment: {
                enrollmentId: enrollment._id,
                completedModules: enrollment.completedModules || [],
                enrolledAt: enrollment.createdAt
              }
            };
          } catch (error) {
            console.error(`Error fetching course ${enrollment.course}:`, error);
            return null;
          }
        })
      );
      
      // Filter out any null values (failed course fetches)
      const validCourses = detailedCourses.filter(course => course !== null);
      setEnrolledCourses(validCourses);
      
    } catch (error) {
      console.error("Error fetching my courses:", error);
      setError("Failed to load your courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (course) => {
    if (!course.modules || course.modules.length === 0) return 0;
    return Math.round((course.enrollment.completedModules.length / course.modules.length) * 100);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const navigateToCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <h2 className="text-xl font-medium mb-2">You haven't enrolled in any courses yet</h2>
          <p className="text-muted-foreground mb-6">Explore our course catalog and start learning today!</p>
          <Button onClick={() => navigate('/discover')}>Browse Courses</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const progress = calculateProgress(course);
            
            return (
              <Card 
                key={course._id} 
                className="overflow-hidden transition-all hover:shadow-lg cursor-pointer"
                onClick={() => navigateToCourse(course._id)}
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={course.image || "https://placehold.co/600x400?text=Course+Image"} 
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
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage 
                        src={course.mentor?.profilePicture || ""} 
                        alt={course.mentor?.name} 
                      />
                      <AvatarFallback>
                        {course.mentor?.name ? course.mentor.name.substring(0, 2).toUpperCase() : "ME"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{course.mentor?.name}</p>
                      <p className="text-xs text-muted-foreground">{course.mentor?.educationLevel}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          {course.enrollment.completedModules.length}/{course.modules?.length || 0} modules
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Enrolled {formatDate(course.enrollment.enrolledAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToCourse(course._id);
                    }}
                  >
                    {progress === 100 ? "Review Course" : "Continue Learning"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
