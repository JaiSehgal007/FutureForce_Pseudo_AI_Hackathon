import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Plus, ArrowRight, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define form schemas with Zod
const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100, { message: "Title cannot exceed 100 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(1000, { message: "Description cannot exceed 1000 characters" }),
  price: z.coerce.number().min(0, { message: "Price cannot be negative" }),
  domain: z.string().min(1, { message: "Please select a domain" }),
  image: z.instanceof(File).optional(),
});

const moduleSchema = z.object({
  title: z.string().min(3, { message: "Module title must be at least 3 characters" }).max(100, { message: "Module title cannot exceed 100 characters" }),
  description: z.string().min(10, { message: "Module description must be at least 10 characters" }).max(500, { message: "Module description cannot exceed 500 characters" }),
  image: z.instanceof(File).optional(),
});

// Domain options for the course
const domainOptions = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "DevOps",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
  "Game Development",
  "AR/VR",
  "IoT"
];

const AddCourse = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("course-details");
  const [courseImage, setCourseImage] = useState(null);
  const [courseImagePreview, setCourseImagePreview] = useState(null);
  const [addedModules, setAddedModules] = useState([]);
  const [currentModule, setCurrentModule] = useState({ title: "", description: "", image: null, imagePreview: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [courseId, setCourseId] = useState(null);

  // Initialize course form
  const courseForm = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      domain: "",
      image: undefined,
    },
  });

  // Initialize module form
  const moduleForm = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
    },
  });

  // Handle course image change
  const handleCourseImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImage(file);
      courseForm.setValue("image", file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle module image change
  const handleModuleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentModule({
        ...currentModule,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
      moduleForm.setValue("image", file);
    }
  };

  // Handle course form submission
  const onCourseSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("domain", data.domain);
      
      if (courseImage) {
        formData.append("image", courseImage);
      }

      const response = await api.post("/course/create", formData);
      
      setCourseId(response.data.message._id);
      
      toast({
        title: "Course created successfully",
        description: "Now you can add modules to your course",
      });
      
      // Switch to modules tab
      setActiveTab("modules");
    } catch (error) {
      toast({
        title: "Failed to create course",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add module directly to the course
  const addModule = async () => {
    if (!currentModule.title || !currentModule.description) {
      toast({
        title: "Incomplete module",
        description: "Please fill in the module title and description",
        variant: "destructive",
      });
      return;
    }

    setIsAddingModule(true);
    try {
      // Create FormData for module upload
      const formData = new FormData();
      formData.append("title", currentModule.title);
      formData.append("description", currentModule.description);
      
      if (currentModule.image) {
        formData.append("image", currentModule.image);
      }

      // Upload module and add to course
      const response = await api.post(`/course/add-modules/${courseId}`, formData);
      
      // Get the module ID from the response
      const moduleId = response.data.message.modules[response.data.message.modules.length - 1];
      
      // Add to our local state with the module details
      setAddedModules([...addedModules, {
        _id: moduleId,
        title: currentModule.title,
        description: currentModule.description,
        imagePreview: currentModule.imagePreview
      }]);
      
      toast({
        title: "Module added",
        description: "The module has been added to your course",
      });
      
      // Reset current module
      setCurrentModule({ title: "", description: "", image: null, imagePreview: null });
      moduleForm.reset();
    } catch (error) {
      console.error("Error adding module:", error);
      toast({
        title: "Failed to add module",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAddingModule(false);
    }
  };

  // Finish course creation
  const finishCourse = async () => {
    if (addedModules.length === 0) {
      toast({
        title: "No modules added",
        description: "Please add at least one module to your course",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Course completed",
      description: `Your course with ${addedModules.length} modules has been created successfully`,
    });
    
    // Navigate to course details page
    navigate(`/courses/${courseId}`);
  };

  // Update current module form values
  const updateCurrentModule = (field, value) => {
    setCurrentModule({ ...currentModule, [field]: value });
    moduleForm.setValue(field, value);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="course-details" disabled={activeTab === "modules" && !courseId}>
            Course Details
          </TabsTrigger>
          <TabsTrigger value="modules" disabled={!courseId}>
            Add Modules
          </TabsTrigger>
        </TabsList>
        
        {/* Course Details Tab */}
        <TabsContent value="course-details">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>
                Enter the basic details about your course. You'll be able to add modules in the next step.
              </CardDescription>
            </CardHeader>
            <Form {...courseForm}>
              <form onSubmit={courseForm.handleSubmit(onCourseSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={courseForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Complete React Developer Course" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={courseForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what students will learn in this course..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={courseForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormDescription>Set to 0 for a free course</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={courseForm.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Domain</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a domain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {domainOptions.map((domain) => (
                                <SelectItem key={domain} value={domain}>
                                  {domain}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={courseForm.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormLabel>Course Cover Image</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => document.getElementById('course-image').click()}
                              className="w-full h-32 border-dashed flex flex-col gap-2 justify-center items-center"
                            >
                              <Upload className="h-6 w-6" />
                              <span>Upload Image</span>
                            </Button>
                            <input
                              id="course-image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleCourseImageChange}
                            />
                            
                            {courseImagePreview && (
                              <div className="relative">
                                <img 
                                  src={courseImagePreview} 
                                  alt="Course preview" 
                                  className="w-full h-40 object-cover rounded-md" 
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting} className="ml-auto">
                    {isSubmitting ? "Creating Course..." : "Create Course & Continue"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        {/* Modules Tab */}
        <TabsContent value="modules">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Module Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Add Module</CardTitle>
                <CardDescription>
                  Create modules for your course. Each module will be immediately added to your course.
                </CardDescription>
              </CardHeader>
              <Form {...moduleForm}>
                <CardContent className="space-y-6">
                  <FormField
                    control={moduleForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Module Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Introduction to React Hooks" 
                            value={currentModule.title}
                            onChange={(e) => updateCurrentModule("title", e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={moduleForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Module Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what this module covers..." 
                            className="min-h-[100px]"
                            value={currentModule.description}
                            onChange={(e) => updateCurrentModule("description", e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={moduleForm.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormLabel>Module Image (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => document.getElementById('module-image').click()}
                              className="w-full h-24 border-dashed flex flex-col gap-2 justify-center items-center"
                            >
                              <Upload className="h-5 w-5" />
                              <span>Upload Image</span>
                            </Button>
                            <input
                              id="module-image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleModuleImageChange}
                            />
                            
                            {currentModule.imagePreview && (
                              <div className="relative">
                                <img 
                                  src={currentModule.imagePreview} 
                                  alt="Module preview" 
                                  className="w-full h-32 object-cover rounded-md" 
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="button" 
                    onClick={addModule}
                    className="w-full"
                    disabled={isAddingModule}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isAddingModule ? "Adding Module..." : "Add Module to Course"}
                  </Button>
                </CardFooter>
              </Form>
            </Card>
            
            {/* Modules List */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Course Modules ({addedModules.length})</CardTitle>
                <CardDescription>
                  {addedModules.length === 0 
                    ? "Add modules to your course using the form on the left" 
                    : "These modules have been added to your course"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {addedModules.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Plus className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No modules yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Use the form to add modules to your course. A good course typically has 5-10 modules.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {addedModules.map((module, index) => (
                        <div key={module._id} className="border rounded-lg p-4">
                          <div className="flex items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <h3 className="font-medium">{module.title}</h3>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                          {module.imagePreview && (
                            <img 
                              src={module.imagePreview} 
                              alt={module.title} 
                              className="w-full h-32 object-cover rounded-md" 
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("course-details")}
                >
                  Back to Course Details
                </Button>
                <Button 
                  onClick={finishCourse} 
                  disabled={addedModules.length === 0}
                >
                  Finish & View Course
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {addedModules.length > 0 && (
            <Alert className="mt-6">
              <AlertDescription className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                You have added {addedModules.length} module{addedModules.length > 1 ? 's' : ''} to your course.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddCourse;
