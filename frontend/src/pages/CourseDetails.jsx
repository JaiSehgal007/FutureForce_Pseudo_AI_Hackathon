import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookOpen, Clock, Users, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCourseDetails();
    if (isAuthenticated) {
      checkEnrollmentStatus();
    }
  }, [courseId, isAuthenticated]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/course/${courseId}`);
      
      if (response.data && response.data.success) {
        setCourse(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast({
        title: "Error",
        description: "Failed to load course details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const response = await api.get(`/course/check-enrollment/${courseId}`);
      setIsEnrolled(response.data.enrolled);
    } catch (error) {
      console.error("Error checking enrollment status:", error);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to enroll in this course",
        variant: "destructive",
      });
      navigate("/auth/login", { state: { from: `/courses/${courseId}` } });
      return;
    }

    setEnrolling(true);
    try {
      await api.post(`/course/enroll/${courseId}`);
      
      toast({
        title: "Enrollment successful",
        description: "You have successfully enrolled in this course",
      });
      
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast({
        title: "Enrollment failed",
        description: error.response?.data?.message || "An error occurred during enrollment",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              
              <div className="flex gap-4 mt-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
              
              <Skeleton className="h-64 w-full" />
            </div>
            
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/courses")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>
    );
  }

  const isMentor = isAuthenticated && user?._id === course.mentor?._id;

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate("/courses")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{course.domain}</Badge>
              {course.price === 0 && (
                <Badge variant="secondary">Free</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            
            <p className="text-muted-foreground mb-6">{course.description}</p>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span>{course.modules?.length || 0} modules</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>Created {formatDate(course.createdAt)}</span>
              </div>
            </div>
            
            {course.image && (
              <div className="rounded-lg overflow-hidden mb-8">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full object-cover h-[300px]"
                />
              </div>
            )}
          </div>
          
          <Tabs defaultValue="modules" className="w-full">
            <TabsList>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="modules" className="pt-4">
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              
              {course.modules && course.modules.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, index) => (
                    <AccordionItem key={module._id} value={module._id}>
                      <AccordionTrigger className="hover:bg-muted/50 px-4 py-2 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <span>{module.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-2">
                        <p className="text-muted-foreground mb-4">{module.description}</p>
                        
                        {module.image && (
                          <div className="rounded-md overflow-hidden mb-2">
                            <img 
                              src={module.image} 
                              alt={module.title} 
                              className="w-full object-cover h-[200px]"
                            />
                          </div>
                        )}
                        
                        {isEnrolled ? (
                          <Button size="sm" className="mt-2">
                            Start Module
                          </Button>
                        ) : (
                          <Alert className="mt-2">
                            <AlertTitle className="text-sm">Enroll to access this module</AlertTitle>
                            <AlertDescription className="text-xs">
                              You need to enroll in this course to access the full content.
                            </AlertDescription>
                          </Alert>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">No modules available for this course yet.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about" className="pt-4">
              <h2 className="text-xl font-semibold mb-4">About this Course</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">What you'll learn</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Complete understanding of {course.domain}</li>
                    <li>Build real-world projects</li>
                    <li>Master key concepts and techniques</li>
                    <li>Learn best practices and industry standards</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Basic understanding of programming concepts</li>
                    <li>Computer with internet connection</li>
                    <li>Enthusiasm to learn!</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {course.price === 0 ? "Free" : `$${course.price}`}
              </CardTitle>
              <CardDescription>
                {isEnrolled ? "You are enrolled in this course" : "Enroll now to access all content"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>{course.modules?.length || 0} modules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Full lifetime access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Access on mobile and desktop</span>
              </div>
            </CardContent>
            <CardFooter>
              {isMentor ? (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(`/courses/edit/${courseId}`)}
                >
                  Edit Course
                </Button>
              ) : isEnrolled ? (
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/courses/learn/${courseId}`)}
                >
                  Continue Learning
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage 
                    src={course.mentor?.profilePicture} 
                    alt={course.mentor?.name} 
                  />
                  <AvatarFallback className="text-lg">
                    {course.mentor?.name ? course.mentor.name.substring(0, 2).toUpperCase() : "ME"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{course.mentor?.name || "Instructor"}</h3>
                  <p className="text-sm text-muted-foreground">{course.mentor?.educationLevel || "Instructor"}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Expert in {course.domain}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Multiple courses created</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
